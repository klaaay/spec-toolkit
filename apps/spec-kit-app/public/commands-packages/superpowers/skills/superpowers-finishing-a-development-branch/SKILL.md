---
name: superpowers-finishing-a-development-branch
description: 当实现完成、测试通过，并需要决定如何整合成果时使用：提供合并、PR 或清理的结构化收尾选项
---

# 完成开发分支

## 概览

实现完成后，通过清晰选项引导用户选择整合方式，并执行对应流程。

**核心原则：** 验证测试 → 检测环境 → 给出选项 → 执行选择 → 清理。

**开始时宣布：** “我正在使用 `superpowers-finishing-a-development-branch` skill 来完成这项工作。”

## 流程

### 第 1 步：验证测试

**在提出任何收尾选项前，先验证测试通过：**

```bash
# 运行项目测试套件
npm test / cargo test / pytest / go test ./...
```

**如果测试失败：**

```text
测试失败（<N> 个失败）。完成前必须先修复：

[展示失败项]

测试通过前，不能继续合并或创建 PR。
```

停止。不要继续到第 2 步。

**如果测试通过：** 继续到第 2 步。

### 第 2 步：检测环境

**给出选项前，先判断当前工作区状态：**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
```

这决定该展示哪个菜单，以及如何清理：

| 状态 | 菜单 | 清理方式 |
| --- | --- | --- |
| `GIT_DIR == GIT_COMMON`（普通 repo） | 标准 4 个选项 | 没有 worktree 需要清理 |
| `GIT_DIR != GIT_COMMON`，且有分支名 | 标准 4 个选项 | 按来源判断是否清理（见第 6 步） |
| `GIT_DIR != GIT_COMMON`，detached HEAD | 精简 3 个选项（不能本地合并） | 不清理（外部管理） |

### 第 3 步：确定基线分支

```bash
# 尝试常见基线分支
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

或者询问用户：“这个分支是从 `main` 分出来的吗？”

### 第 4 步：给出选项

**普通 repo 或具名分支 worktree：展示恰好 4 个选项。**

```text
实现已经完成。你希望我怎么处理？

1. 在本地合并回 <base-branch>
2. 推送当前分支并创建 Pull Request
3. 保持当前分支原样，我稍后自己处理
4. 丢弃这次工作

请选择一个。
```

**Detached HEAD：展示恰好 3 个选项。**

```text
实现已经完成。当前处于 detached HEAD（外部管理的工作区）。

1. 推送为新分支并创建 Pull Request
2. 保持原样，我稍后自己处理
3. 丢弃这次工作

请选择一个。
```

**不要添加解释。** 选项保持简洁。

### 第 5 步：执行选择

#### 选项 1：本地合并

```bash
# 获取主 repo 根目录，避免在要删除的 worktree 内操作
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# 先合并，并在成功后才删除任何东西
git checkout <base-branch>
git pull
git merge <feature-branch>

# 验证合并后的结果
<test command>

# 合并成功后：清理 worktree（第 6 步），再删除分支
```

随后：清理 worktree（第 6 步），再删除分支：

```bash
git branch -d <feature-branch>
```

#### 选项 2：推送并创建 PR

```bash
# 推送分支
git push -u origin <feature-branch>
```

**不要清理 worktree。** 用户需要保留它来处理 PR 反馈。

#### 选项 3：保持原样

报告：`保留分支 <name>。worktree 保留在 <path>。`

**不要清理 worktree。**

#### 选项 4：丢弃

**先确认：**

```text
这会永久删除：
- 分支 <name>
- 所有提交：<commit-list>
- worktree：<path>

请输入 'discard' 以确认。
```

等待精确确认。

确认后：

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

随后：清理 worktree（第 6 步），再强制删除分支：

```bash
git branch -D <feature-branch>
```

### 第 6 步：清理工作区

**只对选项 1 和选项 4 执行。** 选项 2 和选项 3 始终保留 worktree。

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**如果 `GIT_DIR == GIT_COMMON`：** 普通 repo，没有 worktree 需要清理。结束。

**如果 worktree 路径位于 `.worktrees/` 或 `worktrees/` 下：** 这是 Superpowers 创建的 worktree，可以清理。

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git worktree remove "$WORKTREE_PATH"
git worktree prune  # 自修复：清理过期登记
```

**否则：** 宿主环境拥有这个 workspace。不要删除它。如果平台提供退出 workspace 的工具，就使用该工具；否则保留 workspace。

## 快速对照

| 选项 | 合并 | 推送 | 保留 Worktree | 清理分支 |
| --- | --- | --- | --- | --- |
| 1. 本地合并 | yes | - | - | yes |
| 2. 创建 PR | - | yes | yes | - |
| 3. 保持原样 | - | - | yes | - |
| 4. 丢弃 | - | - | - | yes（force） |

## 常见错误

**跳过测试验证**
- **问题：** 合并了坏代码，或创建失败 PR
- **修复：** 给选项前始终先验证测试。

**开放式提问**
- **问题：** “接下来怎么处理？” 含义不清
- **修复：** 给出固定的 4 个结构化选项；detached HEAD 时给 3 个。

**在选项 2 清理 worktree**
- **问题：** 删除了用户处理 PR 反馈所需的工作区
- **修复：** 只在选项 1 和 4 清理。

**删除 worktree 前先删分支**
- **问题：** `git branch -d` 会失败，因为 worktree 仍引用该分支
- **修复：** 先合并，再删除 worktree，最后删除分支。

**在要删除的 worktree 内执行 `git worktree remove`**
- **问题：** 当前目录位于被删除 worktree 内，命令会失败
- **修复：** 执行 `git worktree remove` 前始终 `cd` 到主 repo 根目录。

**清理宿主环境拥有的 worktree**
- **问题：** 删除平台创建的 worktree 会造成幽灵状态
- **修复：** 只清理 `.worktrees/` 或 `worktrees/` 下的 worktree。

**丢弃前没有确认**
- **问题：** 误删工作
- **修复：** 要求用户输入精确的 `discard`。

## 红旗

**绝不要：**
- 测试失败仍继续收尾
- 未验证合并结果就删除分支
- 未确认就删除工作
- 未经明确要求就 force-push
- 合并成功前删除 worktree
- 清理不是你创建的 worktree（先做来源判断）
- 在 worktree 内部执行 `git worktree remove`

**务必：**
- 给选项前先验证测试
- 给菜单前先检测环境
- 给出恰好 4 个选项；detached HEAD 时给 3 个
- 选项 4 前拿到精确确认
- 只在选项 1 和 4 清理 worktree
- 删除 worktree 前先 `cd` 到主 repo 根目录
- 删除后执行 `git worktree prune`
