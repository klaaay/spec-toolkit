# Spec ToolKit

Spec ToolKit 是一个围绕 Spec-Driven Development 与前端协作流程构建的 monorepo，包含可独立发布的 CLI、命令包仓库、文档站，以及配套的工程化配置。

English -> [README.en.md](README.en.md) / 日本語 -> [README.ja.md](README.ja.md)

内置 SDD 规范来源：https://github.com/github/spec-kit  
文档站点：https://spec-toolkit-spec-kit-app.vercel.app/

## 这个仓库包含什么

| 路径 | 作用 |
| --- | --- |
| `packages/spec-kit-ts` | Spec Kit 的 TypeScript CLI 实现，命令为 `spec-ts`，负责初始化项目、环境检查和同步命令包。 |
| `packages/figma-toolkit-cli` | 独立发布的 Figma CLI，命令为 `figma-toolkit`，用于读取 Figma 文件、节点和图片资源。 |
| `apps/spec-kit-app` | Next.js 文档站，同时也是命令包静态仓库。 |
| `apps/spec-kit-app/public/commands-packages` | 可被 `spec-ts pull-package` 拉取的命令包集合。 |
| `configs/eslint-config` | ESLint 共享配置。 |
| `configs/eslint-plugin` | 自定义 ESLint 规则集合。 |
| `configs/uno-config` | UnoCSS 预设、主题和快捷方式配置。 |

## 核心能力

### 1. Spec-Driven Development 工作流

- 提供 `/speckit.constitution`、`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement` 等命令流程。
- 通过 `spec-ts init` 在新项目中初始化模板与斜杠命令。
- 通过 `spec-ts pull-package` 拉取领域命令包，例如前端规则、Figma 协作、自动化工作流等。
- 支持多种 AI 助手模板，并保留离线模板能力。

### 2. Figma 数据拉取与资源下载

- 提供 `figma-toolkit` CLI，直接调用 Figma 官方 REST API。
- 支持读取文件、节点、图片导出和图片填充资源。
- 支持通过 Figma 链接自动解析 `fileKey` 与 `node-id`。

### 3. 命令包与文档交付

- `apps/spec-kit-app` 既负责展示文档，也负责对外提供命令包内容。
- 当前内置的命令包包括：
  `automation`、`brainstorm-spec`、`frontend-contract`、`frontend-figma`、`frontend-mocking`、`frontend-rules`、`reading-companion`、`superpowers`、`web-design`

## 快速开始

### 只使用 Spec CLI

```bash
npm install -g @klaaay/spec-kit-ts

spec-ts init my-project --ai claude
spec-ts check
spec-ts pull-package superpowers --ai claude
```

### 只使用 Figma CLI

```bash
npm install -g @klaaay/figma-toolkit-cli

figma-toolkit config set-token <your-figma-token>
figma-toolkit figma file <fileKey>
figma-toolkit figma nodes "https://www.figma.com/design/<fileKey>/<name>?node-id=1-2"
```

### 本地开发这个仓库

```bash
pnpm install

# 启动文档站
pnpm --filter @klaaay/spec-kit-app dev

# 构建所有 workspace
pnpm build

# 运行测试
pnpm test
```

## 支持的 AI 助手

以下键名可用于 `spec-ts` 的 `--ai` 参数。

| Key | Name | Requires CLI |
| --- | --- | --- |
| `claude` | Claude Code | yes |
| `gemini` | Gemini CLI | yes |
| `copilot` | GitHub Copilot | no |
| `cursor-agent` | Cursor | no |
| `qwen` | Qwen Code | yes |
| `opencode` | Opencode | yes |
| `windsurf` | Windsurf | no |
| `codex` | Codex CLI | yes |
| `kilocode` | Kilo Code | no |
| `auggie` | Auggie CLI | yes |
| `roo` | Roo Code | no |
| `codebuddy` | CodeBuddy | yes |
| `q` | Amazon Q Developer CLI | yes |

## 常用开发命令

- `pnpm build`：构建所有 workspace 包。
- `pnpm lint`：运行各 workspace 的 lint 脚本。
- `pnpm test`：运行各 workspace 的测试脚本。
- `pnpm --filter @klaaay/spec-kit-app dev`：启动文档站。
- `pnpm --filter @klaaay/figma-toolkit-cli test`：运行 Figma CLI 测试。

## 进一步阅读

- `packages/spec-kit-ts/README.md`
- `packages/spec-kit-ts/QUICKSTART.md`
- `packages/spec-kit-ts/PLUGINS.md`
- `packages/figma-toolkit-cli/README.md`

## 许可证

各子包在自己的 `package.json` 中声明许可证。
