# Matt Pocock Skills - Productivity（中文版）

通用工作流工具，不限定于代码任务。

本包翻译自 [`mattpocock/skills`](https://github.com/mattpocock/skills) 的 `skills/productivity` 目录。保留原始 skill id 和文件名，正文改写为自然中文，便于在中文 Agent 工作流中直接使用。

## 来源版本

- 仓库：`https://github.com/mattpocock/skills`
- 路径：`skills/productivity`
- 分支：`main`
- Commit：`66f92b61f5b1434a1c7422f6fbd8efc5ee0c0214`
- 同步日期：`2026-07-06`

## 用户手动调用

只能在用户显式输入时触发（`disable-model-invocation: true`）。

- **[grill-me](./skills/grill-me/SKILL.md)**：启动一次高强度计划或设计追问，让决策树上的每个分支都被处理。
- **[handoff](./skills/handoff/SKILL.md)**：把当前对话压缩成交接文档，让另一个 Agent 能继续工作。
- **[teach](./skills/teach/SKILL.md)**：把当前目录当作有状态教学工作区，分多次会话教授用户一个新技能或概念。
- **[writing-great-skills](./skills/writing-great-skills/SKILL.md)**：编写和编辑高质量 Skill 的参考，说明让 Skill 可预测的术语和原则。

## 模型可调用

模型或用户都可以触发。描述中保留了较丰富的触发语，方便模型主动选用。

- **[grilling](./skills/grilling/SKILL.md)**：围绕计划或设计持续追问，直到双方形成共同理解。
