# Gemini CLI 工具映射

Superpowers 的 skill 文档默认使用 Claude Code 工具名。若你在 Gemini CLI 环境中遇到这些名称，请做如下映射：

| Skill 中的工具 | Gemini CLI 对应能力 |
| --- | --- |
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace` |
| `Bash` | `run_shell_command` |
| `Grep` | `grep_search` |
| `Glob` | `glob` |
| `TodoWrite` | `write_todos` |
| `Skill` | `activate_skill` |
| `WebSearch` | `google_web_search` |
| `WebFetch` | `web_fetch` |
| `Task` | 无等价能力 |

## 没有子代理支持

Gemini CLI 没有与 Claude Code `Task` 等价的子代理机制。  
因此依赖子代理的 skill，例如：

- `superpowers-subagent-driven-development`
- `superpowers-dispatching-parallel-agents`

在 Gemini CLI 中应退化为单会话线性执行，通常改走 `superpowers-executing-plans`。

## Gemini CLI 额外能力

Gemini CLI 还提供一些 Claude Code 没有的工具：

| 工具 | 用途 |
| --- | --- |
| `list_directory` | 列目录 |
| `save_memory` | 跨会话写入 GEMINI.md |
| `ask_user` | 请求结构化用户输入 |
| `tracker_create_task` | 丰富的任务管理 |
| `enter_plan_mode` / `exit_plan_mode` | 进入 / 退出只读规划模式 |
