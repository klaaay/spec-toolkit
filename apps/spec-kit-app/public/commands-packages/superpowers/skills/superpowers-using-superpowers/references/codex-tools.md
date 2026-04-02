# Codex 工具映射

Superpowers 的 skill 文档默认使用 Claude Code 工具名。若你在 Codex 环境中遇到这些名称，请做如下映射：

| Skill 中的工具 | Codex 对应能力 |
| --- | --- |
| `Task`（派发子代理） | `spawn_agent` |
| 多次 `Task` 并行派发 | 多次 `spawn_agent` |
| 等待任务结果 | `wait_agent` |
| 任务结束后释放资源 | `close_agent` |
| `TodoWrite` | `update_plan` |
| `Skill` | 平台原生加载 skill，直接遵循 |
| `Read` / `Write` / `Edit` | 使用 Codex 原生文件工具 |
| `Bash` | 使用 Codex 的 shell / command 工具 |

## 子代理前提

Codex 只有在支持多代理时，相关 skill 才能完整发挥作用，例如：

- `superpowers-dispatching-parallel-agents`
- `superpowers-subagent-driven-development`

如果当前平台不支持多代理，这类 skill 应退化为线性执行流程。

## 命名 agent 的处理方式

Claude Code 的 skill 会直接引用命名 agent，例如 `superpowers-code-reviewer`。  
Codex 没有同样的命名 agent 注册机制，因此需要手工做一层映射：

1. 找到对应 agent prompt 文件，例如 `agents/code-reviewer.md`
2. 读取提示内容
3. 填入占位符（如 `{BASE_SHA}`、`{WHAT_WAS_IMPLEMENTED}`）
4. 用填好的完整提示去 `spawn_agent`

## 信息组织建议

给 Codex 子代理发消息时，最好采用任务型 framing，而不是角色扮演式 framing：

```text
请执行以下任务，并严格遵守下面的指令。

<agent-instructions>
[填好的 agent prompt]
</agent-instructions>
```

这样更稳定，也更利于子代理按模板输出。
