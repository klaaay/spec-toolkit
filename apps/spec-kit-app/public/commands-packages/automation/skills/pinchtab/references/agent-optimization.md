# Agent 优化手册

面向 **token 更省、流程更稳** 的 PinchTab 使用方式。

---

## 最低成本路径决策

在满足目标的前提下，永远选**最便宜**的手段：

```
需要确认页面状态？
├─ 已经知道元素引用？ → 跳过 snap，直接 click/type
├─ 要找可交互元素？ → snap -i -c（首选）
├─ 只要读文字/数据？ → pinchtab text（无整棵树开销）
├─ 要找某个具体元素？ → pinchtab find "<文案>"
├─ 需要完整结构？ → snap -c（紧凑全树）
├─ 需要肉眼调试？ → screenshot（少用，体积大）
└─ 需要跑一小段 JS？ → eval（精确、无整页视觉负载）
```

**Token 成本大致排序（便宜 → 贵）：**

1. `eval` —— 单个返回值，不输出整棵 DOM
2. `find` —— 只列出命中元素
3. `text` —— 仅可读正文
4. `snap -i -c` —— 可交互 + 紧凑
5. `snap -c` —— 全树紧凑
6. `snap -i` —— 可交互但偏冗长
7. `snap` —— 全树冗长
8. `screenshot` —— 图片载荷，通常最贵

**经验法则**：默认快照用 `snap -i -c`；只有版式、验证码、画布等**强依赖视觉**时再升级到 `screenshot`。

---

## 跟进阅读用差异快照

交互之后用 `snap -d`，只看**相对上一张的变化**，而不是整棵树。

```bash
pinchtab click e5      # 触发变化
pinchtab snap -d       # 只要增量，体积小很多
```

**适合用 `-d` 的场景：**

- 点击后只有局部 UI 更新（手风琴展开、Toast 出现等）
- 提交表单后出现行内校验提示
- 分步向导里每次只动一块区域

**不适合用 `-d` 的场景：**

- 整页导航之后（diff 往往等于整页新树）
- 刚执行完 `nav` —— 应重新打一张完整 `snap`
- 会话里第一张快照（没有基准可比）

---

## Lite 引擎

用 `--engine lite` 启动 PinchTab，可减轻渲染开销。

```bash
pinchtab start --engine lite
```

**Lite 能做什么：**

- 页面加载更快（无 CSS 动画、减少 JS 执行）
- 内存占用更低，适合多标签「机群」场景
- 无障碍树 `snap` 完整可用
- `text`、`find`、`eval` 行为与常规模块一致

**Lite 的局限：**

- `screenshot` 可能无法反映完整视觉样式
- 依赖 CSS 过渡表达状态的页面，行为可能与真实用户环境不同
- 部分 Canvas / WebGL 内容无法完整渲染
- 不适合做严格视觉回归测试

**更适合**：表单自动化、数据抽取、接口很多的 SPA、对视觉还原要求不高的抓取任务。

---

## 故障恢复

### 403 Forbidden
**原因**：未在配置中允许 `eval`（`security.allowEvaluate: true`），或页面拒绝了请求。

**处理：**

```bash
# 方案一：在配置中允许 eval 并重启服务
# 方案二：改用 snap + find，完全避开 eval
pinchtab find "目标文案"
```

---

### 401 Unauthorized
**原因**：会话过期、认证 Cookie 丢失，或访问了受保护资源。

**处理：**

1. `pinchtab screenshot` —— 确认是否停在登录页
2. 重新认证：`pinchtab nav <登录地址>`，再填写凭据
3. 若使用用户档案：尝试 `pinchtab profile use <名称>` 恢复会话

---

### Connection Refused
**原因**：PinchTab 服务未启动或已崩溃。

**处理：**

```bash
pinchtab health          # 确认是否挂掉
pinchtab start           # 重启
pinchtab health          # 确认恢复后再继续
```

多实例场景下同时检查 `pinchtab instances`，确认连的是正确端口。

---

### 元素引用过期（Stale refs）
**原因**：打完 `snap` 后页面重新渲染（导航、动态更新），旧的 `e5`、`e12` 已失效。

**现象**：交互返回「找不到引用」或点到了错误元素。

**处理：**

```bash
pinchtab snap -i -c      # 新快照 → 新引用
# 仅使用本次响应里的 e#
```

**预防**：不要把引用跨导航缓存；大改版后必须重新快照。

---

### 机器人检测 / CAPTCHA
**原因**：目标站识别出自动化行为。

**处理思路：**

1. `pinchtab screenshot` —— 看清被什么拦住
2. 放慢节奏：交互之间加 `pinchtab wait --ms 1500`
3. 避免连续快速点击，拉开间隔
4. 换用已有会话 Cookie 的用户档案
5. 若是 CAPTCHA：需要人工介入，并向用户说明

---

### 导航超时
**原因**：加载超过默认超时（常见约 30s）。

**处理：**

```bash
pinchtab nav <url> --timeout 90   # 延长超时
```

若经常超时，可配合 `--block-images` 加快加载：

```bash
pinchtab nav <url> --block-images --timeout 60
```

---

## 通用效率原则

- **先批量读再写。** 尽量一次 `snap` 拿全引用，再连续操作；避免无意义的 snap → 点 → snap → 点循环。
- **抽取任务优先 `text`。** 若不需要交互，只读内容，`text` 通常比 `snap` 再解析便宜。
- **缩小快照范围。** 已知区域时用 `snap -s <selector>` 只打那一块。
- **现代框架表单优先 `fill`。** 可减少 React/Vue 未收到键盘事件导致的重试。
- **长任务开头先 `health`。** 服务若已挂，尽早失败，少做无用功。
