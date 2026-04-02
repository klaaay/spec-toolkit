# Visual Companion 指南

基于浏览器的视觉脑暴伴侣，用来展示线框图、布局方案、架构图与视觉对比稿。

## 何时使用

按“问题”判断，而不是按“会话”判断。标准只有一个：**用户看图会不会比看文字更容易理解？**

**适合浏览器的内容：**
- UI 线框图、布局、导航结构、组件方案
- 架构图、数据流、关系图
- 视觉方案的并排对比
- 关于观感、层级、留白、视觉结构的问题
- 需要空间关系表达的流程图、状态图

**适合终端的内容：**
- 需求与范围问题
- 概念性的 A / B / C 选择
- 权衡表与优缺点列表
- API 设计、数据建模、架构取舍
- 纯文字澄清问题

## 工作原理

服务会监听一个目录中的 HTML 文件，并将最新文件提供给浏览器。  
你把 HTML 写入 `screen_dir`，用户会在浏览器中看到它，并可通过点击选择选项。  
选择结果会写入 `state_dir/events`，你在下一轮对话中读取即可。

**内容片段 vs 完整 HTML：**
- 如果文件以 `<!DOCTYPE` 或 `<html>` 开头，服务会按完整文档原样提供
- 否则服务会自动套上 `frame-template.html`

默认优先写**内容片段**，只有在你需要完全控制页面时才写完整 HTML。

## 启动会话

```bash
scripts/start-server.sh --project-dir /path/to/project
```

它会返回一段 JSON，其中包含：
- `url`
- `screen_dir`
- `state_dir`

你需要保存这些值，并告诉用户去打开 `url`。

## 交互循环

1. **确认服务仍然活着**
2. **向 `screen_dir` 写入一个新的 HTML 文件**
3. **告诉用户当前页面里有什么，并提示他看浏览器**
4. **下一轮读取 `state_dir/events`**
5. **结合终端里的文字反馈，决定继续迭代还是进入下一个问题**

如果当前问题结束，下一步又回到终端讨论，请推送一个简短的 waiting 页面，避免用户继续盯着过期画面。

## 建议的内容结构

### A / B / C 选项

```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>方案 A</h3>
      <p>说明文字</p>
    </div>
  </div>
</div>
```

### 视觉卡片

```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"></div>
    <div class="card-body">
      <h3>方案名</h3>
      <p>说明文字</p>
    </div>
  </div>
</div>
```

### 左右对比

```html
<div class="split">
  <div class="mockup">左侧方案</div>
  <div class="mockup">右侧方案</div>
</div>
```

## 设计建议

- 忠实度要和问题匹配：布局问题用线框，视觉精修问题再做高保真
- 每个页面都写清楚“你想让用户判断什么”
- 每屏最多 2-4 个选项
- 当前页面还没达成共识前，不要急着切到下一个问题
- 如果真实内容会显著影响判断，就尽量用真实内容，不要全用占位符

## 文件命名

- 用语义化名字，如：`layout.html`、`visual-style.html`
- 每个页面都使用新文件名，不要复用
- 迭代版用 `layout-v2.html`、`layout-v3.html`

## 清理

```bash
scripts/stop-server.sh $SESSION_DIR
```

如果启动时用了 `--project-dir`，生成的 mockup 会保留在 `.superpowers/brainstorm/` 下，便于之后回看。

## 参考

- 页面框架：`scripts/frame-template.html`
- 客户端辅助脚本：`scripts/helper.js`
