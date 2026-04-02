# CLI 命令参考 — PinchTab 0.8.x

> **提示**：完整参数列表请用 `pinchtab help` 或 `pinchtab <command> --help`。

---

## 控制面

### `pinchtab start`
启动 PinchTab 服务（默认端口 9867）。

```bash
pinchtab start
pinchtab start --port 9868
pinchtab start --profile work --headless
```

### `pinchtab stop`
停止当前运行的服务。

### `pinchtab status` / `pinchtab health`
检查服务是否在运行、是否健康。

---

## 浏览器命令

### `pinchtab nav <url>`
让当前标签页导航到指定 URL。

```bash
pinchtab nav https://example.com
pinchtab nav https://example.com --new-tab
pinchtab nav https://example.com --block-images
pinchtab nav https://example.com --timeout 60
```

| 参数 | 说明 |
|------|------|
| `--new-tab` | 在新标签打开，而不是当前标签 |
| `--block-images` | 阻止图片加载（更快、token 更少） |
| `--timeout <s>` | 导航超时（秒） |
| `--profile <name>` | 指定命名用户档案 |

> ⚠️ **注意**：请使用 `--profile`，不要用 `--profileId`。长参数名以文档为准。

### `pinchtab tab`（不是 `tabs`）
管理浏览器标签页。

```bash
pinchtab tab list            # 列出所有标签
pinchtab tab close           # 关闭当前标签
pinchtab tab close <tabId>   # 关闭指定标签
```

> ⚠️ **注意**：子命令是单数 `tab`，不是 `tabs`。

---

## 交互命令

### `pinchtab click <ref>`
根据无障碍引用（来自 `snap`）点击元素。

```bash
pinchtab click e5
pinchtab click e5 --tab <tabId>
```

### `pinchtab type <ref> <text>`
在输入框中模拟按键输入。

```bash
pinchtab type e12 "hello world"
```

### `pinchtab fill <ref> <value>`
通过派发 JS 事件填写表单。在 React / Vue / Angular 表单上通常比 `type` 更稳。

```bash
pinchtab fill e12 "hello world"
```

### `pinchtab press <key>`
按下命名按键。

```bash
pinchtab press Enter
pinchtab press Tab
pinchtab press Escape
```

### `pinchtab hover <ref>`
悬停在元素上，用于触发提示或悬停样式。

### `pinchtab scroll [ref]`
滚动页面或某个元素。

```bash
pinchtab scroll            # 页面向下约 300px
pinchtab scroll --pixels -300   # 向上滚
pinchtab scroll e20 --pixels 500
```

### `pinchtab select <ref> <value>`
在 `<select>` 下拉框中选择一项。

```bash
pinchtab select e8 "option-value"
```

---

## 输出类命令

### `pinchtab snap`（快照）
获取当前页的无障碍树。**理解页面状态时的首选工具。**

```bash
pinchtab snap                   # 完整树
pinchtab snap -i                # 仅可交互元素（更小）
pinchtab snap -c                # 紧凑格式（更少 token）
pinchtab snap -i -c             # 组合：最省快照
pinchtab snap -d                # 与上一张快照的差异
pinchtab snap -s main           # 限定在某个 CSS 选择器内
pinchtab snap --max-tokens 2000 # 限制 token 上限
```

> ⚠️ **注意**：请用 `snap`，不要用 `snapshot`。`snap` 才是推荐的短命令。

### `pinchtab screenshot`
截取当前页画面。

```bash
pinchtab screenshot
pinchtab screenshot --quality 80   # JPEG 质量 80
```

> ⚠️ **注意**：请写完整单词 `screenshot`，没有 `ss` 或 `shot` 这类别名。

### `pinchtab text`
抽取页面可读正文。

```bash
pinchtab text
pinchtab text --raw    # 不做版式清理
```

### `pinchtab find <query>`
按可见文本或 CSS 选择器查找元素。

```bash
pinchtab find "Submit"
pinchtab find ".btn-primary"
```

### `pinchtab eval <expression>`
在页面上下文中执行 JavaScript。

```bash
pinchtab eval "document.title"
pinchtab eval "document.querySelectorAll('a').length"
```

> 需要在配置中开启 `security.allowEvaluate: true`；默认会返回 403。

---

## 多实例 / 多档案命令

### `pinchtab profile list`
列出所有可用用户档案。

### `pinchtab profile use <name>`
切换当前使用的档案。

```bash
pinchtab profile use work
```

### `pinchtab instances`
列出各档案下正在运行的 PinchTab 实例。

---

## 易错对照表

| 错误写法 | 正确写法 | 说明 |
|----------|----------|------|
| `pinchtab ss` | `pinchtab screenshot` | 没有 `ss` 别名 |
| `pinchtab snapshot` | `pinchtab snap` | 请用短命令 |
| `--profileId` | `--profile` | 长参数名以文档为准 |
| `pinchtab tabs` | `pinchtab tab` | 子命令为单数 |
