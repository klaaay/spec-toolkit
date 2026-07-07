# Pi 工具映射

Skill 文档描述的是动作，例如“dispatch a subagent”“create a todo”“read a file”。在 Pi 中，这些动作映射到下列能力。

| Skill 请求的动作 | Pi 对应能力 |
| --- | --- |
| 分派子代理（`Subagent (general-purpose):` 模板） | 如果已安装可用子代理工具，使用它，例如 `pi-subagents` 提供的 `subagent` |
| 任务跟踪（“create a todo”“mark complete”） | 如果已安装 todo / task 工具，使用该工具；否则在计划或 `TODO.md` 中跟踪 |

## 子代理

Pi core 没有内置标准子代理工具。`pi-subagents` 是推荐的可选配套包，提供 `subagent` 工具，支持单代理、链式、并行、异步、forked context、resume / status 等流程。如果没有可用子代理工具，不要伪造 `Task` 调用；应在当前会话中顺序执行，或说明可选子代理能力未安装。

## 任务列表

Pi core 没有内置标准任务列表工具。如果安装了 todo / task 扩展，就按它的文档使用；否则用 Superpowers 计划文件、Markdown checklist，或仓库本地 `TODO.md` 跟踪任务。旧版 Superpowers 文档可能提到 `TodoWrite`，将其视为上面的任务跟踪动作。
