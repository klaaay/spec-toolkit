---
name: superpowers-finishing-a-development-branch
description: 当实现完成且测试通过后使用：引导你决定如何整合成果，并执行对应收尾流程
---

# 完成开发分支

## 概览

当实现完成并且测试通过后，用这个 skill 决定如何整合成果，并执行对应的收尾动作。

**核心原则：** 验证测试 → 给出明确选项 → 执行选择 → 安全收尾。

**开始时宣布：** "我正在使用 `superpowers-finishing-a-development-branch` skill 来完成这项工作。"

## 流程

### 第 1 步：验证测试

**在提出任何收尾选项之前，先验证测试通过：**

```bash
# 运行项目测试套件
npm test / cargo test / pytest / go test ./...
```

**如果测试失败：**
```
测试失败（<N> 个失败）。完成前必须先修复：

[展示失败项]

在测试通过前，不能继续进入合并 / PR / 丢弃分支的收尾流程。
```

停止。不要继续到第 2 步。

**如果测试通过：** 继续到第 2 步。

如果项目没有测试，则跳过此步，直接进入第 2 步。

### 第 2 步：确定基线分支

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

如果无法自动判断，可以直接问用户：这个分支是从 `main` 分出来的吗？

### 第 3 步：给出 4 个固定选项

向用户展示**恰好这 4 个选项**：

```
实现已经完成。你希望我怎么处理？

1. 在本地合并回 <base-branch>
2. 推送当前分支并创建 Pull Request
3. 保持当前分支与工作区不变，我稍后自己处理
4. 丢弃这次工作

请选择一个。
```

不要加额外解释。

### 第 4 步：执行选择

#### 选项 1：本地合并

```bash
git checkout <base-branch>
git pull
git merge <feature-branch>
<test command>
git branch -d <feature-branch>
```

随后进入第 5 步清理工作区。

#### 选项 2：推送并创建 PR

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```

完成后保留当前分支和工作区。

#### 选项 3：保持原样

直接报告：

`保持分支 <name>。工作区保留在 <path>。`

不要清理工作区。

#### 选项 4：丢弃

必须先确认：

```
这会永久删除：
- 分支 <name>
- 所有提交：<commit-list>
- 工作区：<path>

请输入 'discard' 以确认。
```

只有收到精确确认后，才执行：

```bash
git checkout <base-branch>
git branch -D <feature-branch>
```

随后进入第 5 步清理工作区。

### 第 5 步：清理工作区

**仅对选项 1 和选项 4：**

检查当前分支是否处在 worktree 中：

```bash
git worktree list | grep $(git branch --show-current)
```

若是，则执行：

```bash
git worktree remove <worktree-path>
```

**选项 2 和选项 3：** 保留工作区。

## 快速对照

| 选项 | 合并 | 推送 | 保留工作区 | 清理分支 |
| ---- | ---- | ---- | ---------- | -------- |
| 1. 本地合并 | ✓ | - | - | ✓ |
| 2. 创建 PR | - | ✓ | ✓ | - |
| 3. 保持原样 | - | - | ✓ | - |
| 4. 丢弃 | - | - | - | ✓（强制） |

## 常见错误

**跳过测试验证**
- **问题：** 未验证测试就进入收尾
- **修复：** 先验证，再给选项

**开放式提问**
- **问题：** “接下来怎么处理？” 太模糊
- **修复：** 始终给固定的 4 个选项

**误删工作**
- **问题：** 未确认就丢弃分支或清理工作区
- **修复：** 选项 4 必须要求用户输入 `discard`

## 红旗

**绝不要：**
- 测试失败仍继续收尾
- 未验证合并结果就删除分支
- 未确认就删除工作
- 未经明确要求就强推

**务必：**
- 先验证测试
- 只给 4 个固定选项
- 丢弃前拿到精确确认
- 仅在选项 1 和 4 中清理 worktree

## 集成

**被调用于：**
- `superpowers-subagent-driven-development`：全部任务完成后
- `superpowers-executing-plans`：所有任务完成后

**配套使用：**
- `superpowers-using-git-worktrees`：若当前工作发生在 worktree 中，本 skill 负责在合适选项下做清理
