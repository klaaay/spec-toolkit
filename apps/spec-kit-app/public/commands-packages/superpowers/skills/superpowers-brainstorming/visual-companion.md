# Visual Companion 指南

基于浏览器的视觉脑暴伴侣，用来展示 mockup、diagram 和选项对比。

## 何时使用

按“问题”判断，而不是按“会话”判断。标准只有一个：**用户看图会不会比看文字更容易理解？**

**适合浏览器的内容：**

- **UI mockups**：wireframe、layout、navigation structure、component design
- **Architecture diagrams**：系统组件、数据流、关系图
- **并排视觉对比**：对比两个 layout、两套配色、两个设计方向
- **设计润色**：讨论观感、间距、视觉层级时
- **空间关系**：state machine、flowchart、entity relationship 等图形化内容

**适合终端的内容：**

- **需求和范围问题**：“X 是什么意思？”“哪些功能在 scope 内？”
- **概念性 A/B/C 选择**：用文字描述方案并选择
- **权衡列表**：pros / cons、comparison table
- **技术决策**：API design、data modeling、architecture approach
- **澄清问题**：答案主要是文字，而不是视觉偏好

一个问题“关于 UI”不代表它就是视觉问题。“你想要什么样的 wizard？”是概念问题，走终端。“这几个 wizard layout 哪个更合适？”才是视觉问题，走浏览器。

## 工作原理

服务监听一个目录中的 HTML 文件，并把最新文件提供给浏览器。你把 HTML 写入 `screen_dir`，用户会在浏览器中看到并点击选项。选择结果会写入 `state_dir/events`，你在下一轮读取。

**内容片段 vs 完整文档：** 如果 HTML 文件以 `<!DOCTYPE` 或 `<html` 开头，服务会按完整文档原样提供，只注入 helper script。否则，服务会自动套上 frame template，添加 header、CSS theme、connection status 和交互设施。默认写**内容片段**；只有需要完全控制页面时才写完整文档。

## 启动会话

```bash
# 用户同意 companion 之后再启动。--open 会在第一屏出现时自动打开浏览器；
# --project-dir 会持久化 mockups，并支持重启后复用同一端口。
scripts/start-server.sh --project-dir /path/to/project --open

# 返回示例：
# {"type":"server-started","port":52341,
#  "url":"http://localhost:52341/?key=ab12…",
#  "screen_dir":"/path/to/project/.superpowers/brainstorm/12345-1706000000/content",
#  "state_dir":"/path/to/project/.superpowers/brainstorm/12345-1706000000/state"}
```

保存返回的 `screen_dir` 和 `state_dir`。使用 `--open` 时，第一屏推送后浏览器会自动打开；但仍要把 URL 给用户作为 fallback，因为 headless 或 remote 环境不一定能自动打开。

**URL 含 session key（`?key=…`）。** 服务会拒绝没有 key 的请求，所以必须把 `url` 字段里的完整 URL 给用户。不要删掉 query string，也不要只给裸的 `http://host:port`。该 key 同时保护 HTTP 和 WebSocket 访问，避免其他浏览器 tab 或网络中的机器读取 screen 或注入事件。第一次加载后，浏览器会把 key 记入 cookie，刷新页面和 `/files/*` 资产访问不需要重复 key。

**查找连接信息：** 服务会把启动 JSON 写到 `$STATE_DIR/server-info`。如果后台启动后没有捕获 stdout，读取该文件获取 URL 和端口。使用 `--project-dir` 时，可在 `<project>/.superpowers/brainstorm/` 下找到 session 目录。

**注意：** 把项目根目录传给 `--project-dir`，这样 mockups 会保存在 `.superpowers/brainstorm/` 并能跨重启保留。否则文件会写到 `/tmp` 并被清理。如果 `.superpowers/` 还没被 ignore，提醒用户加入 `.gitignore`。

## 按平台启动

**Claude Code：**

```bash
# 默认模式可用，脚本会自行后台运行服务。
scripts/start-server.sh --project-dir /path/to/project --open
```

Windows 上，脚本会自动切换到 foreground mode，这会阻塞工具调用。通过 Bash 工具调用时使用 `run_in_background: true`，让服务跨对话轮次存活；下一轮读取 `$STATE_DIR/server-info` 获取 URL 和端口。

**Codex：**

```bash
# Codex 会回收后台进程。脚本会自动检测 CODEX_CI 并切到 foreground mode。
# 正常运行即可，不需要额外 flag。
scripts/start-server.sh --project-dir /path/to/project --open
```

**Copilot CLI：**

```bash
# 使用 --foreground，并通过 bash 工具的 async mode 启动服务，
# 让进程跨轮次存活。需要后续交互时，保存返回的 shellId。
scripts/start-server.sh --project-dir /path/to/project --open --foreground
```

**其他环境：** 服务必须在对话轮次之间保持运行。如果环境会回收 detached process，使用 `--foreground` 并通过该平台的后台执行机制启动。

如果浏览器无法访问 URL（remote / container 环境常见），绑定非 loopback host：

```bash
scripts/start-server.sh \
  --project-dir /path/to/project \
  --host 0.0.0.0 \
  --url-host localhost
```

用 `--url-host` 控制返回 URL 中的 hostname。

## 交互循环

1. **确认服务仍然活着，然后向 `screen_dir` 写入新 HTML 文件：**
   - 引用 URL 或推送 screen 前，必须确认服务还活着。检查 `$STATE_DIR/server-info` 存在，且 `$STATE_DIR/server-stopped` 不存在。如果服务停了，用相同的 `--project-dir` 重启；它会复用同一端口，用户打开的 tab 会自动重连，并显示 paused overlay。服务默认 4 小时空闲后退出，可用 `--idle-timeout-minutes` 调整。
   - 使用语义化文件名，例如 `platform.html`、`visual-style.html`、`layout.html`。
   - **不要复用文件名。** 每个 screen 都写新文件。
   - 使用文件创建工具，不要用 `cat` / heredoc，避免把大段 HTML 噪声打进终端。
   - 服务会自动展示最新文件。

2. **告诉用户会看到什么，并结束当前轮：**
   - 每一步都提醒完整 URL，而不是只在第一次提醒。
   - 简短说明屏幕内容，例如“正在展示首页的 3 个 layout 方案”。
   - 让用户在终端回复：“看一下后告诉我想法；如果愿意，也可以点击选择一个选项。”

3. **下一轮读取反馈：**
   - 如果 `$STATE_DIR/events` 存在，读取它；其中是一行一个 JSON 的点击或选择事件。
   - 将浏览器事件和用户在终端里的文字反馈合并判断。
   - 终端消息是主反馈；`state_dir/events` 提供结构化交互数据。

4. **迭代或前进：** 如果反馈改变当前 screen，写新文件，例如 `layout-v2.html`。只有当前步骤被确认后，才进入下一个问题。

5. **回到终端时清空视觉上下文：** 如果下一步不再需要浏览器，例如澄清问题或权衡讨论，推送一个 waiting screen，避免用户继续盯着过期画面。

   ```html
   <!-- filename: waiting.html (or waiting-2.html, etc.) -->
   <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
     <p class="subtitle">Continuing in terminal...</p>
   </div>
   ```

6. 重复直到完成。

## 编写内容片段

只写页面内部内容。服务会自动套上 frame template，提供 header、theme CSS、connection status 和交互基础设施。

**最小示例：**

```html
<h2>Which layout works better?</h2>
<p class="subtitle">Consider readability and visual hierarchy</p>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Single Column</h3>
      <p>Clean, focused reading experience</p>
    </div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>Two Column</h3>
      <p>Sidebar navigation with main content</p>
    </div>
  </div>
</div>
```

不需要 `<html>`、CSS 或 `<script>`。服务会提供。

## 可用 CSS Classes

### Options（A/B/C 选择）

```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

**多选：** 在容器上加 `data-multiselect`，用户即可选择多个选项。每次点击会切换该项的 selected 样式。

```html
<div class="options" data-multiselect>
  <!-- same option markup -->
</div>
```

### Cards（视觉方案）

```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"><!-- mockup content --></div>
    <div class="card-body">
      <h3>Name</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

### Mockup container

```html
<div class="mockup">
  <div class="mockup-header">Preview: Dashboard Layout</div>
  <div class="mockup-body"><!-- your mockup HTML --></div>
</div>
```

### Split view（并排对比）

```html
<div class="split">
  <div class="mockup"><!-- left --></div>
  <div class="mockup"><!-- right --></div>
</div>
```

### Pros / Cons

```html
<div class="pros-cons">
  <div class="pros"><h4>Pros</h4><ul><li>Benefit</li></ul></div>
  <div class="cons"><h4>Cons</h4><ul><li>Drawback</li></ul></div>
</div>
```

### Wireframe building blocks

```html
<div class="mock-nav">Logo | Home | About | Contact</div>
<div style="display: flex;">
  <div class="mock-sidebar">Navigation</div>
  <div class="mock-content">Main content area</div>
</div>
<button class="mock-button">Action Button</button>
<input class="mock-input" placeholder="Input field">
<div class="placeholder">Placeholder area</div>
```

### Typography and sections

- `h2` — 页面标题
- `h3` — section 标题
- `.subtitle` — 标题下方的辅助文字
- `.section` — 带下边距的内容块
- `.label` — 小号大写 label 文本

## Browser Events 格式

用户在浏览器中点击选项时，交互会写入 `$STATE_DIR/events`，每行一个 JSON 对象。推送新 screen 时，该文件会自动清空。

```jsonl
{"type":"click","choice":"a","text":"Option A - Simple Layout","timestamp":1706000101}
{"type":"click","choice":"c","text":"Option C - Complex Grid","timestamp":1706000108}
{"type":"click","choice":"b","text":"Option B - Hybrid","timestamp":1706000115}
```

完整事件流能反映用户探索过程。用户可能先后点击多个选项。最后一个 `choice` 通常是最终选择，但点击路径也可能显示犹豫或偏好，值得追问。
