# PinchTab HTTP API 参考

下文示例的基准地址：`http://localhost:9867`

> **CLI 对照**：各端点都有对应 CLI，可用 `pinchtab help` 查看完整列表。示例中以 `# CLI:` 注释标出等价命令。

## 导航

```bash
# CLI: pinchtab nav https://pinchtab.com [--new-tab] [--block-images]
curl -X POST /navigate \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://pinchtab.com"}'

# 选项示例：自定义超时、屏蔽图片、新标签打开
curl -X POST /navigate \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://pinchtab.com", "timeout": 60, "blockImages": true, "newTab": true}'
```

## 快照（无障碍树）

```bash
# CLI: pinchtab snap [-i] [-c] [-d] [-s main] [--max-tokens 2000]
# 完整树
curl /snapshot

# 仅可交互元素（按钮、链接、输入框）——体积小很多
curl "/snapshot?filter=interactive"

# 限制深度
curl "/snapshot?depth=5"

# 智能 diff —— 相对上一张快照的变化（大幅省 token）
curl "/snapshot?diff=true"

# 文本格式 —— 缩进树，比 JSON 约省 40–60% token
curl "/snapshot?format=text"

# 紧凑格式 —— 每节点一行，比 JSON 约省 56–64% token（推荐）
curl "/snapshot?format=compact"

# YAML 格式
curl "/snapshot?format=yaml"

# 限定在某个 CSS 选择器内（例如只要 main 区域）
curl "/snapshot?selector=main"

# 截断到约 N 个 token
curl "/snapshot?maxTokens=2000"

# 组合：效率最高的一组
curl "/snapshot?format=compact&selector=main&maxTokens=2000&filter=interactive"

# 捕获前禁用动画
curl "/snapshot?noAnimations=true"

# 写入文件
curl "/snapshot?output=file&path=/tmp/snapshot.json"
```

返回扁平 JSON 节点数组，字段含 `ref`、`role`、`name`、`depth`、`value`、`nodeId` 等。

**Token 优化建议**：优先 `?format=compact`；操作类任务加 `?filter=interactive`（节点数大约再少 ~75%）；只关心主内容用 `?selector=main`；需要上限时用 `?maxTokens=2000`；多步流程用 `?diff=true` 只看变化。参数可自由组合。

## 对元素执行操作

```bash
# CLI: pinchtab click e5 / pinchtab type e12 hello / pinchtab press Enter
# 按引用点击
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "click", "ref": "e5"}'

# 向当前焦点元素输入（先 click 再 type）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "click", "ref": "e12"}'
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "type", "ref": "e12", "text": "hello world"}'

# 按键
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "press", "key": "Enter"}'

# 聚焦元素
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "focus", "ref": "e3"}'

# Fill（直接设值，不模拟按键）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "fill", "selector": "#email", "text": "user@pinchtab.com"}'

# Hover（下拉、提示等）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "hover", "ref": "e8"}'

# 下拉框选项（按 value 或可见文案）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "select", "ref": "e10", "value": "option2"}'

# 滚动到某元素
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "scroll", "ref": "e20"}'

# 按像素滚动（无限滚动页）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "scroll", "scrollY": 800}'

# 点击并等待导航（常见于链接跳转）
curl -X POST /action -H 'Content-Type: application/json' \
  -d '{"kind": "click", "ref": "e5", "waitNav": true}'
```

## 批量操作

```bash
# 顺序执行多条 action
curl -X POST /actions -H 'Content-Type: application/json' \
  -d '{"actions":[{"kind":"click","ref":"e3"},{"kind":"type","ref":"e3","text":"hello"},{"kind":"press","key":"Enter"}]}'

# 遇错即停（默认 false）
curl -X POST /actions -H 'Content-Type: application/json' \
  -d '{"tabId":"TARGET_ID","actions":[...],"stopOnError":true}'
```

## 抽取正文

```bash
# CLI: pinchtab text [--raw]
# 默认可读性模式 —— 去掉导航/页脚/广告等
curl /text

# 原始 innerText
curl "/text?mode=raw"
```

返回 `{url, title, text}`。多数页面约 1K token 量级，成本很低。

## PDF 导出

除非用户明确要求落盘，否则优先返回 base64 或原始字节。写磁盘时请用安全临时目录或工作区路径。

```bash
# CLI: pinchtab pdf --tab TAB_ID [-o file.pdf] [--landscape] [--scale 0.8]
# 返回 base64 JSON
curl "/tabs/TAB_ID/pdf"

# 原始 PDF 字节
curl "/tabs/TAB_ID/pdf?raw=true" -o page.pdf

# 安全临时路径落盘
curl "/tabs/TAB_ID/pdf?output=file&path=/tmp/pinchtab-page.pdf"

# 横向 + 自定义缩放
curl "/tabs/TAB_ID/pdf?landscape=true&scale=0.8&raw=true" -o page.pdf

# 自定义纸张（Letter 8.5×11，A4 8.27×11.69）
curl "/tabs/TAB_ID/pdf?paperWidth=8.5&paperHeight=11&marginTop=0.5&marginLeft=0.5&raw=true" -o custom.pdf

# 指定页码范围
curl "/tabs/TAB_ID/pdf?pageRanges=1-5&raw=true" -o pages.pdf

# 页眉页脚
curl "/tabs/TAB_ID/pdf?displayHeaderFooter=true&headerTemplate=%3Cspan%20class=title%3E%3C/span%3E&raw=true" -o header.pdf

# 无障碍 PDF + 文档大纲
curl "/tabs/TAB_ID/pdf?generateTaggedPDF=true&generateDocumentOutline=true&raw=true" -o accessible.pdf

# 尊重 CSS 分页尺寸
curl "/tabs/TAB_ID/pdf?preferCSSPageSize=true&raw=true" -o css-sized.pdf
```

**查询参数：**

| 参数 | 类型 | 默认 | 说明 |
|-------|------|------|------|
| `paperWidth` | float | 8.5 | 纸张宽度（英寸） |
| `paperHeight` | float | 11.0 | 纸张高度（英寸） |
| `landscape` | bool | false | 是否横向 |
| `marginTop` | float | 0.4 | 上页边距（英寸） |
| `marginBottom` | float | 0.4 | 下页边距（英寸） |
| `marginLeft` | float | 0.4 | 左页边距（英寸） |
| `marginRight` | float | 0.4 | 右页边距（英寸） |
| `scale` | float | 1.0 | 缩放（0.1–2.0） |
| `pageRanges` | string | 全部 | 导出页范围，如 `1-3,5` |
| `displayHeaderFooter` | bool | false | 是否显示页眉页脚 |
| `headerTemplate` | string | — | 页眉 HTML 模板 |
| `footerTemplate` | string | — | 页脚 HTML 模板 |
| `preferCSSPageSize` | bool | false | 是否采用 CSS `@page` 尺寸 |
| `generateTaggedPDF` | bool | false | 是否生成带标签的无障碍 PDF |
| `generateDocumentOutline` | bool | false | 是否嵌入文档大纲 |
| `output` | string | JSON | `file` 表示写入磁盘，默认返回 base64 |
| `path` | string | 自动 | 目标路径（`output=file` 时建议用临时或工作区路径） |
| `raw` | bool | false | 为 true 时返回原始 PDF 字节而非 JSON |

底层封装 `Page.printToPDF`，默认会打印背景图。

## 下载文件

除非用户明确要求保存文件，否则优先用原始字节或 base64。

```bash
# 默认返回 base64 JSON（沿用浏览器会话 Cookie / 隐身设置）
curl "/download?url=https://site.com/report.pdf"

# 原始字节（管道写入文件）
curl "/download?url=https://site.com/image.jpg&raw=true" -o image.jpg

# 直接写入安全临时路径
curl "/download?url=https://site.com/export.csv&output=file&path=/tmp/pinchtab-export.csv"
```

## 上传文件

仅上传用户**明确提供或明确同意**的本地文件。

```bash
# 上传到 file input
curl -X POST "/upload?tabId=TAB_ID" -H "Content-Type: application/json" \
  -d '{"selector": "input[type=file]", "paths": ["/tmp/user-approved-photo.jpg"]}'

# base64 数据
curl -X POST /upload -H "Content-Type: application/json" \
  -d '{"selector": "#avatar-input", "files": ["data:image/png;base64,iVBOR..."]}'
```

通过 CDP 设置 `<input type=file>` 的文件并触发 `change`。省略 selector 时默认 `input[type=file]`。

## 截图

```bash
# CLI: pinchtab ss [-o file.jpg] [-q 80]
# 默认返回原始 JPEG
curl "/screenshot?raw=true" -o screenshot.jpg
curl "/screenshot?raw=true&quality=50" -o screenshot.jpg

# 原始 PNG
curl "/screenshot?raw=true&format=png" -o screenshot.png
```

## 执行 JavaScript

请尽量少用。优先 `text`、快照与普通 action。默认只做只读 DOM 检查，不要随意读 Cookie、localStorage 或与任务无关的敏感数据，除非用户明确要求。

```bash
# CLI: pinchtab eval "document.title"
curl -X POST /evaluate -H 'Content-Type: application/json' \
  -d '{"expression": "document.title"}'
```

## 标签页管理

```bash
# CLI: pinchtab tabs / pinchtab tabs new <url> / pinchtab tabs close <id>
# 列出标签
curl /tabs

# 新建标签
curl -X POST /tab -H 'Content-Type: application/json' \
  -d '{"action": "new", "url": "https://pinchtab.com"}'

# 关闭标签
curl -X POST /tab -H 'Content-Type: application/json' \
  -d '{"action": "close", "tabId": "TARGET_ID"}'
```

多标签：在快照/截图/正文等接口上加 `?tabId=TARGET_ID`，或在 POST 体里带 `"tabId"`。

## 按标签页划分的端点

所有读/写接口都有 `/tabs/{id}/...` 形式：

```bash
# 指定标签导航
curl -X POST /tabs/TARGET_ID/navigate \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://pinchtab.com"}'

# 指定标签快照
curl "/tabs/TARGET_ID/snapshot"
curl "/tabs/TARGET_ID/snapshot?filter=interactive&format=compact"

# 指定标签截图
curl "/tabs/TARGET_ID/screenshot?raw=true" -o tab-screenshot.jpg

# 指定标签正文
curl "/tabs/TARGET_ID/text"

# 指定标签单次 action
curl -X POST /tabs/TARGET_ID/action \
  -H 'Content-Type: application/json' \
  -d '{"kind": "click", "ref": "e5"}'

# 指定标签批量 action
curl -X POST /tabs/TARGET_ID/actions \
  -H 'Content-Type: application/json' \
  -d '{"actions": [{"kind": "click", "ref": "e3"}, {"kind": "type", "ref": "e3", "text": "hello"}]}'
```

与顶层接口加 `?tabId=` 等价，只是更符合 REST 习惯。标签 ID 来自 `/tabs` 或导航/建标签响应里的 `tabId`。

## 标签页锁（多 Agent）

```bash
# 加锁（默认 30s 超时，最长 5 分钟）
curl -X POST /tab/lock -H 'Content-Type: application/json' \
  -d '{"tabId": "TARGET_ID", "owner": "agent-1", "timeoutSec": 60}'

# 解锁
curl -X POST /tab/unlock -H 'Content-Type: application/json' \
  -d '{"tabId": "TARGET_ID", "owner": "agent-1"}'
```

已锁标签在 `/tabs` 中会显示 `owner`、`lockedUntil`。冲突时返回 409。

## Cookie

```bash
# 读取当前页 Cookie
curl /cookies

# 设置 Cookie
curl -X POST /cookies -H 'Content-Type: application/json' \
  -d '{"url":"https://pinchtab.com","cookies":[{"name":"session","value":"abc123"}]}'
```

## 隐身 / 指纹

```bash
# 查看隐身状态与评分
curl /stealth/status

# 旋转浏览器指纹
curl -X POST /fingerprint/rotate -H 'Content-Type: application/json' \
  -d '{"os":"windows"}'
# os 可选 "windows"、"mac"，或省略表示随机
```

## 健康检查

```bash
curl /health
```
