## 子代理分派需要多代理支持

在 Codex 配置（`~/.codex/config.toml`）中加入：

```toml
[features]
multi_agent = true
```

这会启用 `spawn_agent`、`wait_agent` 和 `close_agent`，供 `superpowers-dispatching-parallel-agents`、`superpowers-subagent-driven-development` 等 skill 使用。使用 subagent-driven-development 时，实现者和审查者子代理完成全部工作后，始终关闭它们。

## 环境检测

创建 worktree 或收尾分支的 skills，应先用只读 git 命令检测环境：

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

- `GIT_DIR != GIT_COMMON` → 已经处在 linked worktree 中，跳过创建
- `BRANCH` 为空 → detached HEAD，不能直接在 sandbox 中 branch / push / PR

各 skill 如何使用这些信号，见 `superpowers-using-git-worktrees` 的第 0 步，以及 `superpowers-finishing-a-development-branch` 的第 2 步。

## Codex App 收尾

当 sandbox 阻止分支或 push 操作时（通常是外部管理的 detached HEAD worktree），agent 应提交所有工作，并告知用户使用 App 的原生控件：

- **Create branch**：命名分支，然后通过 App UI commit / push / PR
- **Hand off to local**：把工作交给用户本地 checkout

agent 仍可以运行测试、stage 文件，并输出建议分支名、commit message 和 PR description，供用户使用。
