# Spec ToolKit

Spec ToolKit is a toolkit and workflow suite for Spec-Driven Development (SDD), with a CLI, docs site, command packages, and shared configs.

Built-in SDD spec source: https://github.com/github/spec-kit
Docs site: https://spec-toolkit-spec-kit-app.vercel.app/

## What's inside

- `packages/spec-kit-ts`: TypeScript Specify CLI (`spec-ts`) for project init, environment checks, and command package sync.
- `apps/spec-kit-app`: Next.js docs site and command package registry with usage guides.
- `configs/eslint-config`: Shared ESLint config with `recommended` and `react` entries.
- `configs/eslint-plugin`: Custom ESLint rules used by the config package.
- `configs/uno-config`: UnoCSS preset, theme/shortcuts, and base config helper.

## Key capabilities

- Spec-driven workflow via `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`.
- CLI core commands: `init`, `check`, `pull-package`.
- Offline templates and multi-AI support via `--ai`.
- Command packages live under `apps/spec-kit-app/public/commands-packages` (for example `superpowers`, `brainstorm-spec`).
- Plugin hooks for `pre-plan`/`post-plan`/`pre-tasks`/`post-tasks`, with built-in `fe-rule` and `fe-figma-gen` examples.

## Quick start

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Install the CLI
   ```bash
   npm install -g @klaaay/spec-kit-ts
   ```
3. Initialize a project
   ```bash
   spec-ts init my-project --ai claude
   ```
4. Pull command packages (optional)
   ```bash
   spec-ts pull-package fe --ai claude
   ```
5. Run the docs site
   ```bash
   pnpm --filter @klaaay/spec-kit-app dev
   ```

## Supported AI assistants

These keys are used by `--ai`.

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

## Scripts

- `pnpm build`: Build all workspaces (recursive).
- `pnpm lint`: Run ESLint.
- `pnpm test`: Run tests if present.

## More docs

- `packages/spec-kit-ts/README.md`
- `packages/spec-kit-ts/QUICKSTART.md`
- `packages/spec-kit-ts/PLUGINS.md`

## License

Licenses are declared per package in `package.json`.
