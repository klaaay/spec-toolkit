# 🌱 Spec Kit TypeScript 版

> Spec-Driven Development 工具包的 TypeScript 实现

## 简介

这是 [GitHub Spec Kit](https://github.com/github/spec-kit) 的 TypeScript 版本实现。Spec Kit 是一个用于实现 Spec-Driven Development (SDD) 的工具包 - 一种强调在实现之前创建清晰规范的方法论。

## 特性

- ✨ **TypeScript 实现** - 完全使用 TypeScript 重写，提供更好的类型安全
- 🚀 **快速启动** - 基于 Commander.js 的现代 CLI
- 🎨 **美观输出** - 使用 Chalk 和 Ora 提供友好的用户界面
- 📦 **易于安装** - 通过 npm 全局安装即可使用
- 🔧 **多 AI 支持** - 支持 5 种主流 AI 助手（Claude、Codex、Copilot、Cursor）
- 💾 **离线模板** - 所有模板都打包在本地，无需从 GitHub 下载

## 安装

```bash
# 全局安装
npm install -g @klaaay/spec-kit-ts
```

## 使用

### 初始化新项目

```bash
# 基本用法
specify-ts init my-project --ai claude

# 在当前目录初始化
specify-ts init . --ai copilot

# 或使用 --here 标志
specify-ts init --here --ai claude

# 跳过 git 初始化
specify-ts init my-project --ai claude --no-git

# 强制合并到非空目录
specify-ts init . --ai claude --force
```

### 检查工具安装

```bash
specify-ts check
```

## 支持的 AI 助手

当前内置的 AI 助手模板：

| 助手                   | 标识           | 需要 CLI |
| ---------------------- | -------------- | -------- |
| Claude Code            | `claude`       | ✅        |
| Gemini CLI             | `gemini`       | ✅        |
| GitHub Copilot         | `copilot`      | ❌        |
| Cursor Agent           | `cursor-agent` | ❌        |
| Qwen Code              | `qwen`         | ✅        |
| Opencode               | `opencode`     | ✅        |
| Windsurf               | `windsurf`     | ❌        |
| Codex CLI              | `codex`        | ✅        |
| Kilo Code              | `kilocode`     | ❌        |
| Auggie CLI             | `auggie`       | ✅        |
| Roo Code               | `roo`          | ❌        |
| CodeBuddy              | `codebuddy`    | ✅        |
| Amazon Q Developer CLI | `q`            | ✅        |


## 可用的斜杠命令

初始化项目后，你的 AI 助手将可以访问这些斜杠命令：

### 核心命令

| 命令                    | 说明                                   |
| ----------------------- | -------------------------------------- |
| `/speckit.constitution` | 创建或更新项目治理原则和开发指南       |
| `/speckit.specify`      | 定义你想要构建的内容（需求和用户故事） |
| `/speckit.plan`         | 使用你选择的技术栈创建技术实施计划     |
| `/speckit.tasks`        | 为实施生成可操作的任务列表             |
| `/speckit.implement`    | 执行所有任务以根据计划构建功能         |

### 可选命令

| 命令                 | 说明                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| `/speckit.clarify`   | 澄清未充分规范的领域（建议在 `/speckit.plan` 之前使用）                               |
| `/speckit.analyze`   | 跨构件一致性和覆盖范围分析（在 `/speckit.tasks` 之后、`/speckit.implement` 之前运行） |
| `/speckit.checklist` | 生成自定义质量检查清单，验证需求的完整性、清晰度和一致性                              |

### 领域命令

| 命令                             | 说明                                           |
| -------------------------------- | ---------------------------------------------- |
| `/speckit.fe-rule.wizard`        | 交互式完善前端工程规则模板                     |
| `/speckit.fe-rule.scan`          | 扫描仓库推断前端工程规则                       |
| `/speckit.fe-rule.run`           | 根据规则实现前端需求代码                       |
| `/fe-figma-gen.wizard`           | 交互式补全 Figma 约束及公用色值命名规范        |
| `/fe-figma-gen.scan`             | 扫描仓库生成 Figma 构建约束与共享色值 Token    |
| `/fe-figma-gen.scan`             | 按约束生成页面/组件并匹配代码库现有变量        |
| `/speckit.fe-definition-gen.run` | 基于后端接口定义自动生成前端请求封装与 UI 逻辑 |

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck
```

## 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Commander.js** - 强大的 CLI 框架
- **Chalk** - 终端字符串样式
- **Ora** - 优雅的终端加载动画
- **Axios** - HTTP 客户端
- **tsup** - 快速的 TypeScript 打包工具

## 与原版的区别

相比原版的 Python 实现，TypeScript 版本具有以下优势：

1. **更好的类型安全** - TypeScript 的静态类型系统
2. **更快的启动** - Node.js 的快速启动时间
3. **熟悉的技术栈** - 对于前端开发者更友好
4. **易于集成** - 可以轻松集成到 Node.js 项目中

## 许可证

MIT

## 致谢

本项目基于 [GitHub Spec Kit](https://github.com/github/spec-kit) 的设计和理念。
