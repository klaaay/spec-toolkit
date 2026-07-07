---
name: superpowers-using-git-worktrees
description: 在开始需要隔离当前工作区的功能开发，或执行实施计划前使用：优先确认已有隔离工作区，其次使用平台原生工具，最后才回退到 git worktree
---

# 使用 Git Worktrees

## 概览

确保工作发生在隔离工作区中。优先使用当前平台提供的原生 worktree 工具；只有没有原生工具时，才手动回退到 git worktree。

**核心原则：** 先检测已有隔离环境，再使用原生工具，最后才回退到 git。不要和运行平台对着干。

**开始时宣布：** “我正在使用 `superpowers-using-git-worktrees` skill 来准备隔离工作区。”

## 第 0 步：检测已有隔离环境

**创建任何东西之前，先检查当前是否已经处在隔离工作区。**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard：** 在 git submodule 中，`GIT_DIR != GIT_COMMON` 也可能成立。判断“已经在 worktree”前，先确认当前不是 submodule：

```bash
# 如果这里返回路径，说明你在 submodule 中，不是 worktree；按普通 repo 处理
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**如果 `GIT_DIR != GIT_COMMON`（且不是 submodule）：** 当前已经在 linked worktree 中。跳到第 2 步（项目初始化）。不要再创建另一个 worktree。

按分支状态汇报：
- 有分支名：`Already in isolated workspace at <path> on branch <name>.`
- detached HEAD：`Already in isolated workspace at <path> (detached HEAD, externally managed). Branch creation needed at finish time.`

**如果 `GIT_DIR == GIT_COMMON`（或处在 submodule 中）：** 当前是普通 repo checkout。

如果用户指令里已经说明 worktree 偏好，就直接遵循。否则，创建 worktree 前先征得同意：

> “需要我创建一个隔离 worktree 吗？它可以保护当前分支不被本次改动影响。”

如果用户拒绝，就在当前目录工作，并跳到第 2 步。

## 第 1 步：创建隔离工作区

**按以下顺序选择机制。**

### 1a. 平台原生 Worktree 工具（优先）

用户已经同意创建隔离工作区后，检查当前平台是否有创建 worktree 的工具，例如 `EnterWorktree`、`WorktreeCreate`、`/worktree` 命令或 `--worktree` 参数。如果有，使用它，然后跳到第 2 步。

原生工具会自动处理目录位置、分支创建和清理。平台有原生工具时再手动执行 `git worktree add`，会制造平台无法感知或管理的幽灵状态。

只有确认没有原生 worktree 工具时，才进入 1b。

### 1b. Git Worktree 回退

**仅在 1a 不适用时使用。** 手动用 git 创建 worktree。

#### 目录选择

按以下优先级处理。用户明确偏好始终优先于文件系统探测结果。

1. **检查指令中是否声明 worktree 目录偏好。** 如果用户已经指定，直接使用，不再询问。

2. **检查项目内是否已有 worktree 目录：**
   ```bash
   ls -d .worktrees 2>/dev/null
   ls -d worktrees 2>/dev/null
   ```
   如果发现目录，就使用它。两个都存在时，优先 `.worktrees`。

3. **如果没有其他指引，** 默认在项目根目录使用 `.worktrees/`。

#### 安全校验（仅项目内目录）

**创建 worktree 前，必须确认目录已被 git ignore：**

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**如果未被忽略：** 把目录加入 `.gitignore`，提交该变更，然后继续。

**原因：** 防止 worktree 内容被误提交到仓库。

#### 创建 Worktree

```bash
# 按选定位置确定路径
path="$LOCATION/$BRANCH_NAME"

git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox 回退：** 如果 `git worktree add` 因权限错误失败，告诉用户 sandbox 阻止了 worktree 创建，你将改在当前目录工作。随后在当前目录执行初始化和基线测试。

## 第 2 步：项目初始化

按项目类型自动探测并执行初始化：

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

## 第 3 步：验证干净基线

运行项目测试，确保工作区从干净状态开始：

```bash
# 使用项目对应测试命令
npm test / cargo test / pytest / go test ./...
```

**如果测试失败：** 报告失败项，并询问用户是继续还是先调查。

**如果测试通过：** 报告工作区已就绪。

### 汇报

```text
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## 快速对照

| 情况 | 动作 |
| --- | --- |
| 已经在 linked worktree | 跳过创建（第 0 步） |
| 处在 submodule | 按普通 repo 处理（第 0 步 guard） |
| 有平台原生 worktree 工具 | 使用它（1a） |
| 没有原生工具 | git worktree 回退（1b） |
| `.worktrees/` 已存在 | 使用它，并验证 ignore |
| `worktrees/` 已存在 | 使用它，并验证 ignore |
| 两者都存在 | 使用 `.worktrees/` |
| 都不存在 | 检查指令文件，然后默认 `.worktrees/` |
| 目录未被 ignore | 更新 `.gitignore` 并提交 |
| 创建时遇到权限错误 | sandbox 回退，在当前目录工作 |
| 基线测试失败 | 报告失败并询问 |
| 没有 package.json / Cargo.toml 等 | 跳过依赖安装 |

## 常见错误

### 和运行平台对着干

- **问题：** 平台已经提供隔离能力时，仍手动执行 `git worktree add`
- **修复：** 第 0 步检测已有隔离；1a 优先交给原生工具。

### 跳过检测

- **问题：** 在已有 worktree 中再创建嵌套 worktree
- **修复：** 创建任何东西前始终执行第 0 步。

### 跳过 ignore 校验

- **问题：** worktree 内容进入 git 状态，污染仓库
- **修复：** 创建项目内 worktree 前始终执行 `git check-ignore`。

### 擅自假设目录位置

- **问题：** 制造不一致，违背项目约定
- **修复：** 按优先级处理：明确指令 > 已有项目内目录 > 默认位置。

### 测试失败仍继续

- **问题：** 后续无法区分新问题和旧问题
- **修复：** 报告失败项，拿到明确许可后再继续。

## 红旗

**绝不要：**
- 第 0 步已经检测到隔离工作区时仍创建 worktree
- 有原生 worktree 工具时使用 `git worktree add`
- 跳过 1a，直接进入 1b 的 git 命令
- 创建项目内 worktree 前不验证 ignore
- 跳过基线测试验证
- 基线测试失败时默认继续

**务必：**
- 先执行第 0 步检测
- 优先使用平台原生工具，再回退到 git
- 按目录优先级处理：明确指令 > 已有项目内目录 > 默认位置
- 对项目内目录验证 ignore
- 自动探测并执行项目初始化
- 验证干净测试基线
