---
name: superpowers-using-git-worktrees
description: 在开始功能开发或执行实施计划前使用：创建隔离的 git worktree，做目录选择与安全校验，并同步原目录的 .env.local
---

# 使用 Git Worktrees

## 概览

Git worktree 可以在同一个仓库上同时开出多个隔离工作区，而不需要来回切分支。

**核心原则：** 先系统选择目录，再做安全校验，创建隔离工作区后同步原目录的 `.env.local`，最后验证基线。

**开始时宣布：** "我正在使用 `superpowers-using-git-worktrees` skill 来准备隔离工作区。"

## 目录选择顺序

按以下优先级处理：

### 1. 先看现有目录

```bash
ls -d .worktrees 2>/dev/null
ls -d worktrees 2>/dev/null
```

- 如果 `.worktrees` 存在，优先用它
- 如果只有 `worktrees`，用它
- 如果两个都存在，`.worktrees` 优先

### 2. 再看仓库约定文件

```bash
grep -Ei 'worktree.*director' AGENTS.md 2>/dev/null
```

如果 `AGENTS.md` 或仓库约定里明确指定了 worktree 目录，就直接遵循。

### 3. 如果还没有结论，再问用户

```
当前没有发现现成的 worktree 目录。你希望我把 worktree 建在哪？

1. .worktrees/（项目内隐藏目录）
2. ~/.config/superpowers/worktrees/<project-name>/（全局目录）
```

## 安全校验

### 对项目内目录（`.worktrees/` 或 `worktrees/`）

**创建前必须先确认该目录已被 git ignore：**

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

如果没有被忽略：
1. 把对应目录加进 `.gitignore`
2. 提交该变更
3. 再继续创建 worktree

**为什么这一步关键：** 否则 worktree 内容可能被误追踪，污染仓库状态。

### 对全局目录

如果 worktree 建在 `~/.config/superpowers/worktrees/...` 下，则不需要 `.gitignore` 校验，因为它本来就在仓库外。

## 创建步骤

### 1. 识别项目名

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
```

### 2. 创建 worktree

```bash
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

### 3. 同步原目录的 `.env.local`

如果原工作目录存在 `.env.local`，创建完 worktree 后应一并复制到新目录，避免本地环境变量缺失导致无法继续开发或验证。

```bash
if [ -f "$ORIGINAL_DIR/.env.local" ]; then
  cp "$ORIGINAL_DIR/.env.local" "$path/.env.local"
fi
```

### 4. 执行项目初始化

按项目类型自动探测：

```bash
if [ -f package.json ]; then npm install; fi
if [ -f Cargo.toml ]; then cargo build; fi
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
if [ -f go.mod ]; then go mod download; fi
```

### 5. 验证干净基线

```bash
npm test
cargo test
pytest
go test ./...
```

如果测试失败：
- 报告失败项
- 问用户是要继续，还是先调查基线问题

如果测试通过：
- 报告 worktree 已准备好

### 6. 汇报位置

```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## 常见错误

**跳过 ignore 校验**
- 问题：worktree 内容进入 git 状态，污染仓库
- 修复：创建项目前目录型 worktree 前，始终先做 `git check-ignore`

**擅自假设目录位置**
- 问题：破坏项目约定，目录不统一
- 修复：遵守优先级：现有目录 > 仓库约定 > 询问用户

**基线测试失败还直接继续**
- 问题：后续无法区分新问题和旧问题
- 修复：先报告失败，再拿到明确许可

## 红旗

**绝不要：**
- 对项目内目录跳过 ignore 校验
- 跳过基线测试验证
- 在基线测试失败时默认继续
- 在目录位置不明确时擅自决定

**务必：**
- 按既定优先级选目录
- 对项目内目录做 ignore 校验
- 如果原目录存在 `.env.local`，创建后同步到新 worktree
- 自动探测并执行项目初始化
- 验证一个干净的测试基线
