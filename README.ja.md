# Spec ToolKit

Spec ToolKit は Spec-Driven Development (SDD) のためのツールキットとワークフロー群です。CLI、ドキュメントサイト、コマンドパッケージ、共有設定を含みます。

言語: English -> [README.en.md](README.en.md) / 中文 -> [README.md](README.md)

内蔵 SDD 仕様の出典: https://github.com/github/spec-kit
ドキュメントサイト: https://spec-toolkit-spec-kit-app.vercel.app/

## 含まれるもの

- `packages/spec-kit-ts`: TypeScript 版の Specify CLI（`spec-ts`）。初期化、環境チェック、コマンドパッケージ同期を提供。
- `apps/spec-kit-app`: Next.js 製ドキュメントサイトとコマンドパッケージレジストリ。
- `configs/eslint-config`: `recommended` と `react` を公開する ESLint 共有設定。
- `configs/eslint-plugin`: ESLint カスタムルール集。
- `configs/uno-config`: UnoCSS プリセット、テーマ/ショートカット、ベース設定ヘルパー。

## 主な機能

- `/speckit.constitution`、`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement` による SDD ワークフロー。
- CLI の主要コマンド: `init`、`check`、`pull-package`。
- オフラインテンプレートと `--ai` による複数 AI 対応。
- コマンドパッケージは `apps/spec-kit-app/public/commands-packages` 配下（例: `superpowers`、`brainstorm-spec`）。
- `pre-plan`/`post-plan`/`pre-tasks`/`post-tasks` のプラグインフック。`fe-rule` と `fe-figma-gen` を内蔵。

## クイックスタート

1. 依存関係をインストール
   ```bash
   pnpm install
   ```
2. CLI をインストール
   ```bash
   npm install -g @klaaay/spec-kit-ts
   ```
3. プロジェクトを初期化
   ```bash
   spec-ts init my-project --ai claude
   ```
4. コマンドパッケージを同期（任意）
   ```bash
   spec-ts pull-package fe --ai claude
   ```
5. ドキュメントサイトを起動
   ```bash
   pnpm --filter @klaaay/spec-kit-app dev
   ```

## 対応 AI アシスタント

`--ai` で指定するキー一覧です。

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

## スクリプト

- `pnpm build`: 全 workspace をビルド（再帰）。
- `pnpm lint`: ESLint を実行。
- `pnpm test`: 存在するテストを実行。

## 参考ドキュメント

- `packages/spec-kit-ts/README.md`
- `packages/spec-kit-ts/QUICKSTART.md`
- `packages/spec-kit-ts/PLUGINS.md`

## ライセンス

ライセンスは各パッケージの `package.json` に記載されています。
