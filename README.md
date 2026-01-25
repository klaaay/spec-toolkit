# Spec ToolKit

Spec ToolKit 是面向 Spec-Driven Development (SDD) 的工具包与工作流集合，包含 CLI、文档站、命令包与工程化配置。

English -> [README.en.md](README.en.md)

内置 SDD 规范来源：https://github.com/github/spec-kit
文档站点：https://spec-toolkit-spec-kit-app.vercel.app/

## 项目包含

- `packages/spec-kit-ts`: TypeScript 版 Specify CLI（命令为 `spec-ts`），提供项目初始化、环境检查和命令包同步。
- `apps/spec-kit-app`: Next.js 文档站与命令包仓库，提供使用指南和可拉取的命令包内容。
- `configs/eslint-config`: ESLint 共享配置，导出 `recommended` 与 `react` 入口。
- `configs/eslint-plugin`: ESLint 自定义规则集合，供配置包引用。
- `configs/uno-config`: UnoCSS 预设、主题与快捷方式集合，并提供基础配置构建函数。

## 核心能力

- 规格驱动流程：以 `/speckit.constitution`、`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement` 组织工作流。
- CLI 三大命令：`init`、`check`、`pull-package`。
- 离线模板与多 AI 助手支持（`--ai` 参数）。
- 命令包仓库：`apps/spec-kit-app/public/commands-packages`（如 `superpowers`、`brainstorm-spec`）。
- 插件化扩展：支持 `pre-plan`/`post-plan`/`pre-tasks`/`post-tasks` 钩子，内置 `fe-rule` 与 `fe-figma-gen` 示例。

## 快速开始

1. 安装依赖
   ```bash
   pnpm install
   ```
2. 安装 CLI
   ```bash
   npm install -g @klaaay/spec-kit-ts
   ```
3. 初始化项目
   ```bash
   spec-ts init my-project --ai claude
   ```
4. 同步命令包（可选）
   ```bash
   spec-ts pull-package fe --ai claude
   ```
5. 启动文档站
   ```bash
   pnpm --filter @klaaay/spec-kit-app dev
   ```

## 支持的 AI 助手

以下键名用于 `--ai` 参数。

| Key            | Name                   | Requires CLI |
| -------------- | ---------------------- | ------------ |
| `claude`       | Claude Code            | yes          |
| `gemini`       | Gemini CLI             | yes          |
| `copilot`      | GitHub Copilot         | no           |
| `cursor-agent` | Cursor                 | no           |
| `qwen`         | Qwen Code              | yes          |
| `opencode`     | Opencode               | yes          |
| `windsurf`     | Windsurf               | no           |
| `codex`        | Codex CLI              | yes          |
| `kilocode`     | Kilo Code              | no           |
| `auggie`       | Auggie CLI             | yes          |
| `roo`          | Roo Code               | no           |
| `codebuddy`    | CodeBuddy              | yes          |
| `q`            | Amazon Q Developer CLI | yes          |

## 开发脚本

- `pnpm build`: 构建所有 workspace 包（递归）。
- `pnpm lint`: 运行 ESLint。
- `pnpm test`: 运行各包的测试脚本（如存在）。

## 进一步阅读

- `packages/spec-kit-ts/README.md`
- `packages/spec-kit-ts/QUICKSTART.md`
- `packages/spec-kit-ts/PLUGINS.md`

## 许可证

各子包在自己的 `package.json` 中声明许可证。
