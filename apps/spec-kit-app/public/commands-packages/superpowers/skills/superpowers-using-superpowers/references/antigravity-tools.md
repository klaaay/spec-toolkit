# Antigravity CLI (`agy`) 工具映射

Skill 文档描述的是动作，例如“dispatch a subagent”“create a todo”“read a file”。在 Antigravity CLI (`agy`) 中，这些动作映射到下列能力。

| Skill 请求的动作 | Antigravity CLI 对应能力 |
| --- | --- |
| 分派子代理（`Subagent (general-purpose):` 模板） | 使用带内置 `TypeName` 的 `invoke_subagent`：`self` 用于完整能力任务，`research` 用于只读任务 |
| 任务跟踪（“create a todo”“mark complete”） | 使用 **task artifact**：通过 `write_to_file` 写入 `IsArtifact: true` 且 `ArtifactType: "task"` 的文件。不要用 `manage_task`，它管理的是后台进程 |

## 任务跟踪

Antigravity 没有 todo 工具。`manage_task` 管理后台进程（`list` / `kill` / `status` / `send_input`），不是 checklist。当 skill 要求创建 todo list 或跟踪任务时，维护一个 **task artifact**：用 `write_to_file` 保存 Markdown checklist（`IsArtifact: true`，`ArtifactMetadata.ArtifactType: "task"`），并在过程中用 `replace_file_content` / `multi_replace_file_content` 更新。

开始任何多步骤任务时，先创建列出每个步骤的 task artifact。完成步骤后，把对应项改成 `- [x]`。如果计划变化，更新 checklist。它是剩余工作的事实来源；对话变长后，每次开始下一步前先重新读取它。
