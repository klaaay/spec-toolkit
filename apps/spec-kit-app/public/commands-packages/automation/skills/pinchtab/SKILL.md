---
name: pinchtab
description: "当任务需要通过 PinchTab 做浏览器自动化时使用：打开网站、查看可交互元素、点击走完流程、填写表单、抓取页面正文、用持久化用户档案登录站点、导出截图或 PDF、管理多个浏览器实例，或在 CLI 不可用时回退到 HTTP API。适合依赖稳定无障碍引用（如 e5、e12）、希望省 token 的浏览器任务。"
metadata:
  openclaw:
    requires:
      bins:
        - pinchtab
      anyBins:
        - google-chrome
        - google-chrome-stable
        - chromium
        - chromium-browser
      env:
        - PINCHTAB_TOKEN
        - PINCHTAB_CONFIG
    homepage: https://github.com/pinchtab/pinchtab
    install:
      - kind: brew
        formula: pinchtab/tap/pinchtab
        bins: [pinchtab]
      - kind: go
        package: github.com/pinchtab/pinchtab/cmd/pinchtab@latest
        bins: [pinchtab]
---

# 使用 PinchTab 做浏览器自动化

PinchTab 让 Agent 能通过**稳定的无障碍引用**、**低开销的正文抽取**，以及**持久化用户档案 / 多实例**来驱动真实浏览器。请把本技能视为 **CLI 优先**：只有 CLI 不可用，或需要 CLI 尚未提供的档案管理类接口时，再使用 HTTP API。

推荐调用顺序：

- 优先使用 `pinchtab` 子命令。
- 需要创建/管理用户档案，或无法走 shell 时，用 `curl`。
- 仅在需要解析 JSON 响应结构时再用 `jq`。

## 安全默认值

- 默认面向 `http://localhost`；只有用户明确提供远程 PinchTab 地址（以及必要时 Token）时才连远程。
- 先尽量做只读或低风险操作：`text`、`snap -i -c`、`snap -d`、`find`、`click`、`fill`、`type`、`press`、`select`、`hover`、`scroll`。
- 不要轻易执行任意 JavaScript；若用更简单的 PinchTab 命令就能回答，就不要用 `eval`。
- 除非用户点名要上传的本地文件且流程确实需要，否则不要上传本地文件。
- 不要把截图、PDF 或下载随意写到任意路径；使用用户指定路径，或安全的临时目录 / 工作区路径。
- 不要用 PinchTab 去窥探与任务无关的本地文件、浏览器密钥、已存凭据，或系统配置。

## 核心工作流

每次用 PinchTab 自动化，都建议按下面节奏来：

1. 确认当前任务对应的服务器、用户档案或实例已经就绪。
2. 用 `pinchtab nav <url>` 或 `pinchtab instance navigate <instance-id> <url>` 导航。
3. 用 `pinchtab snap -i -c`、`pinchtab snap --text` 或 `pinchtab text` 观察页面，并记下当前引用，例如 `e5`。
4. 用这些**最新**引用执行 `click`、`fill`、`type`、`press`、`select`、`hover`、`scroll` 等操作。
5. 一旦发生导航、提交、弹窗、手风琴展开等会改动 DOM 的行为，就重新快照或重新读正文。

原则：

- 页面变化后，**不要**继续用过期的 `e#` 引用操作。
- 只需要内容、不关心布局时，默认用 `pinchtab text`。
- 需要可点击/可输入元素时，默认用 `pinchtab snap -i -c`。
- 截图仅用于视觉核对、界面对比或排错。
- 多站点或并行任务时，先选对实例或用户档案，再开始操作。

## 选择器（Selector）

PinchTab 使用统一的选择器语法。凡是针对单个元素的命令，都支持下列写法：

| 类型 | 示例 | 解析方式 |
|---|---|---|
| 引用 | `e5` | 快照缓存（最快） |
| CSS | `#login`、`.btn`、`[data-testid="x"]` | `document.querySelector` |
| XPath | `xpath://button[@id="submit"]` | CDP 搜索 |
| 文本 | `text:Sign In` | 可见文本匹配 |
| 语义 | `find:login button` | 通过 `/find` 的自然语言查询 |

自动识别规则：单独的 `e5` → 引用；`#id` / `.class` / `[attr]` → CSS；以 `//` 开头 → XPath。若自动识别可能歧义，请显式加前缀：`css:`、`xpath:`、`text:`、`find:`。

```bash
pinchtab click e5                        # 引用
pinchtab click "#submit"                 # CSS（自动识别）
pinchtab click "text:Sign In"            # 文本匹配
pinchtab click "xpath://button[@type]"   # XPath
pinchtab fill "#email" "user@test.com"   # CSS
pinchtab fill e3 "user@test.com"         # 引用
```

HTTP API 里同样通过 `selector` 字段传入上述语法：

```json
{"kind": "click", "selector": "text:Sign In"}
{"kind": "fill", "selector": "#email", "text": "user@test.com"}
{"kind": "click", "selector": "e5"}
```

为兼容旧客户端，仍支持单独的 `ref` 字段。

## 命令串联

只有**不需要**根据中间输出再决定下一步时，才用 `&&` 串联。

合适示例：

```bash
pinchtab nav https://example.com && pinchtab snap -i -c
pinchtab click --wait-nav e5 && pinchtab snap -i -c
pinchtab nav https://example.com --block-images && pinchtab text
```

必须先读完快照再决定点哪个 `e#` 时，请分行执行：

```bash
pinchtab nav https://example.com
pinchtab snap -i -c
# 阅读引用，选对 e#
pinchtab click e7
pinchtab snap -i -c
```

## 认证与状态：五种常见模式

动手操作站点前，先选定下面哪一种模式。

### 1. 一次性公开浏览

公开页面、抓取类任务、不需要登录持久化时，用临时实例即可。

```bash
pinchtab instance start
pinchtab instances
# 把后续 CLI 指到对应实例端口
pinchtab --server http://localhost:9868 nav https://example.com
pinchtab --server http://localhost:9868 text
```

### 2. 复用已有命名用户档案

同一站点要反复自动化、且希望保持登录态时，用命名档案。

```bash
pinchtab profiles
pinchtab instance start --profile work --mode headed
pinchtab --server http://localhost:9868 nav https://mail.google.com
```

若该档案里已有登录态，之后可改为无头：

```bash
pinchtab instance stop inst_ea2e747f
pinchtab instance start --profile work --mode headless
```

### 3. 通过 HTTP 新建专用登录档案

需要长期保存、但档案尚不存在时，用 Dashboard API（默认 9867 端口）创建。

```bash
curl -X POST http://localhost:9867/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"billing","description":"Billing portal automation","useWhen":"Use for billing tasks"}'

curl -X POST http://localhost:9867/profiles/billing/start \
  -H "Content-Type: application/json" \
  -d '{"headless":false}'
```

随后用返回端口，在 CLI 上加 `--server`。

### 4. 人工协助有界面登录，再由 Agent 接续

遇到验证码、多因素认证或首次配置时，先开有头模式让人类完成登录。

```bash
pinchtab instance start --profile work --mode headed
# 用户在可见 Chrome 窗口中完成登录
pinchtab --server http://localhost:9868 nav https://app.example.com/dashboard
pinchtab --server http://localhost:9868 snap -i -c
```

会话写入档案后，后续任务可继续复用同一档案。

### 5. 远程环境或无 shell：带 Token 的 HTTP API

Agent 无法直接执行 CLI 时使用。

```bash
curl http://localhost:9867/health
curl -X POST http://localhost:9867/instances/launch \
  -H "Content-Type: application/json" \
  -d '{"name":"work","headless":true}'
curl -X POST http://localhost:9868/action \
  -H "Content-Type: application/json" \
  -d '{"kind":"click","selector":"e5"}'
```

若服务暴露在 localhost 之外，应要求 Token，并使用专用自动化档案。详见 [TRUST.md](./TRUST.md)；具体绑定与鉴权请以官方配置文档为准。

## 常用命令速览

### 服务与目标实例

```bash
pinchtab server                                     # 前台启动服务
pinchtab daemon install                             # 安装为系统服务
pinchtab health                                     # 检查服务状态
pinchtab instances                                  # 列出运行中的实例
pinchtab profiles                                   # 列出可用用户档案
pinchtab --server http://localhost:9868 snap -i -c  # 指定实例端口
```

### 导航与标签页

```bash
pinchtab nav <url>
pinchtab nav <url> --new-tab
pinchtab nav <url> --tab <tab-id>
pinchtab nav <url> --block-images
pinchtab nav <url> --block-ads
pinchtab back                                       # 历史后退
pinchtab forward                                    # 历史前进
pinchtab reload                                     # 刷新当前页
pinchtab tab                                        # 列出或聚焦标签页
pinchtab tab new <url>
pinchtab tab close <tab-id>
pinchtab instance navigate <instance-id> <url>
```

### 观察页面

```bash
pinchtab snap
pinchtab snap -i                                    # 仅可交互元素
pinchtab snap -i -c                                 # 可交互 + 紧凑格式
pinchtab snap -d                                    # 与上一张快照的差异
pinchtab snap --selector <css>                      # 限定在某个 CSS 区域内
pinchtab snap --max-tokens <n>                      # 限制 token 预算
pinchtab snap --text                                # 以文本树输出
pinchtab text                                       # 页面可读正文
pinchtab text --raw                                 # 原始文本抽取
pinchtab find <query>                               # 语义查找元素
pinchtab find --ref-only <query>                    # 只返回引用
```

使用建议：

- 要找可操作的 `e#`，默认用 `snap -i -c`。
- 多步流程里，跟进的快照默认用 `snap -d`。
- 读文章、仪表盘、报表或确认文案，默认用 `text`。
- 页面很大且目标明确时，`find --ref-only` 很实用。

### 交互

所有交互类命令都支持上文统一选择器（引用、CSS、XPath、文本、语义）。

```bash
pinchtab click <selector>                           # 单击
pinchtab click --wait-nav <selector>                # 单击并等待导航完成
pinchtab click --x 100 --y 200                      # 按坐标点击
pinchtab dblclick <selector>                        # 双击
pinchtab type <selector> <text>                     # 模拟按键输入
pinchtab fill <selector> <text>                     # 直接写入值
pinchtab press <key>                                # 按键（Enter、Tab、Escape…）
pinchtab hover <selector>                           # 悬停
pinchtab select <selector> <value>                  # 下拉框选项
pinchtab scroll <selector|pixels>                   # 滚动元素或页面
```

建议：

- 表单输入优先用 `fill`，结果更稳定。
- 只有站点强依赖键盘事件时才用 `type`。
- 预期点击会引发跳转时用 `click --wait-nav`。
- 若 `click`、按 Enter、`select`、`scroll` 可能改变界面，之后应立即重新快照。

### 导出、调试与核验

```bash
pinchtab screenshot
pinchtab screenshot -o /tmp/pinchtab-page.png       # 扩展名决定格式
pinchtab screenshot -q 60                            # JPEG 质量
pinchtab pdf
pinchtab pdf -o /tmp/pinchtab-report.pdf
pinchtab pdf --landscape
```

### 高级操作（须明确需要且更安全命令不够用时再用）

```bash
pinchtab eval "document.title"
pinchtab download <url> -o /tmp/pinchtab-download.bin
pinchtab upload /absolute/path/provided-by-user.ext -s <css>
```

说明：

- `eval` 默认只做**只读、范围很小**的 DOM 探查；除非用户明确要求改页面状态，否则不要用来改 DOM。
- `download` 优先写到安全临时目录或工作区，而不是任意路径。
- `upload` 必须使用用户明确提供或明确同意使用的文件路径。

### HTTP API 回退示例

```bash
curl -X POST http://localhost:9868/navigate \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

curl "http://localhost:9868/snapshot?filter=interactive&format=compact"

curl -X POST http://localhost:9868/action \
  -H "Content-Type: application/json" \
  -d '{"kind":"fill","selector":"e3","text":"ada@example.com"}'

curl http://localhost:9868/text
```

适合在以下情况使用 API：

- Agent 不能执行 shell；
- 需要创建或修改用户档案；
- 需要显式的实例级、标签页级路由。

## 常见模式

### 打开页面并查看可操作项

```bash
pinchtab nav https://pinchtab.com && pinchtab snap -i -c
```

### 填写并提交表单

```bash
pinchtab nav https://example.com/login
pinchtab snap -i -c
pinchtab fill e3 "user@example.com"
pinchtab fill e4 "correct horse battery staple"
pinchtab click --wait-nav e5
pinchtab text
```

### 搜索后以较低成本读结果页

```bash
pinchtab nav https://example.com
pinchtab snap -i -c
pinchtab fill e2 "quarterly report"
pinchtab press Enter
pinchtab text
```

### 多步流程里用差异快照

```bash
pinchtab nav https://example.com/checkout
pinchtab snap -i -c
pinchtab click e8
pinchtab snap -d -i -c
```

### 已知结构时跳过全页快照

若已了解页面结构，可直接用 CSS 或文本选择器：

```bash
pinchtab click "text:Accept Cookies"
pinchtab fill "#search" "quarterly report"
pinchtab click "xpath://button[@type='submit']"
```

### 引导已登录的用户档案

```bash
pinchtab profiles
pinchtab instance start --profile work --mode headed
# 人工完成一次登录
pinchtab --server http://localhost:9868 text
```

### 不同站点用不同实例

```bash
pinchtab instance start --profile work --mode headless
pinchtab instance start --profile staging --mode headless
pinchtab instances
```

之后各命令流通过不同 `--server` 端口区分。

## 安全与 Token 经济

- 使用**专用自动化用户档案**，不要用日常私人浏览档案。
- PinchTab 若可被局域网或公网访问，必须启用 Token，并保守配置监听地址。
- 在截图、PDF、`eval`、下载、上传之前，优先用 `text`、`snap -i -c`、`snap -d`。
- 纯阅读、不需要图片资源时，可加 `--block-images`。
- 切换无关账号或环境时，停止或隔离对应实例。

## 差异对比与结果确认

- 长流程里，每次**改变界面状态**的操作后，可用 `pinchtab snap -d` 只看变化。
- 用 `pinchtab text` 核对成功提示、表格更新或是否跳到预期页。
- 只有涉及视觉回归、验证码或强依赖版式时，再用 `pinchtab screenshot`。
- 若某次变更后某个 `e#` 消失，多半是正常的——请重新快照拿新引用，不要死磕旧引用。

## 隐私与安全（产品特性摘要）

PinchTab 是开源、默认本地的浏览器自动化工具：

- **默认只监听本机。** 服务默认绑定 `127.0.0.1`；工具自身不会替你访问无关外网。
- **无遥测、无分析。** 二进制不会主动对外汇报使用情况。
- **单一 Go 二进制（约 16MB）。** 可从 [github.com/pinchtab/pinchtab](https://github.com/pinchtab/pinchtab) 自行构建验证。
- **本地 Chrome 用户档案。** Cookie 与会话只存在你的机器上，便于 Agent 像人类复用浏览器会话那样保持登录。
- **为省 token 设计。** 优先用无障碍树（结构化文本）而非截图，减轻上下文压力。能力与 Playwright 有可比性，但更面向 AI Agent 场景。
- **多实例隔离。** 每个浏览器实例有独立档案目录，并支持标签页级锁，便于多 Agent 安全共用。

## 参考文档（本命令包内）

- CLI 命令详解：[references/commands.md](./references/commands.md)
- HTTP API：[references/api.md](./references/api.md)
- 用户档案：[references/profiles.md](./references/profiles.md)
- 环境变量：[references/env.md](./references/env.md)
- Agent 优化与排错：[references/agent-optimization.md](./references/agent-optimization.md)
- MCP：[references/mcp.md](./references/mcp.md)
- 安全与信任：[TRUST.md](./TRUST.md)

官方仓库中的完整手册（如全局 `config` 说明）见：https://github.com/pinchtab/pinchtab
