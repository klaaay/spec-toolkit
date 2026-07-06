# Matt Pocock Skills（中文版）

Matt Pocock `skills` 仓库的 Engineering / Productivity Skills 与配套 docs 中文版。

本包翻译自 [`mattpocock/skills`](https://github.com/mattpocock/skills)。保留原始 skill id、文件名、命令、路径和关键英文术语；正文改写为自然中文，便于在中文 Agent 工作流中直接阅读和使用。

## 来源版本

- 仓库：`https://github.com/mattpocock/skills`
- 路径：
  - `skills/productivity`
  - `skills/engineering`
  - `docs/productivity`
  - `docs/engineering`
- 分支：`main`
- 上游版本：`v1.0.1-106-g66f92b6`
- 最新 tag：`v1.0.1`
- Commit：`66f92b61f5b1434a1c7422f6fbd8efc5ee0c0214`
- Commit 日期：`2026-07-05`
- 同步日期：`2026-07-06`

## 包内结构

- `skills/`：可安装的 Productivity / Engineering Skill，按当前命令包约定平铺在本包 `skills/` 下。
- `docs/productivity/`：上游 Productivity Skill 的用户手册。
- `docs/engineering/`：上游 Engineering Skill 的用户手册和 flow 说明。
- `workflow.md`：本包内 Skill 与 docs 的关系、主 flow 和同步规则。

## 用户手动调用

只能在用户显式输入时触发（`disable-model-invocation: true`）。

- **[grill-me](./skills/grill-me/SKILL.md)**：启动一次高强度计划或设计追问，让决策树上的每个分支都被处理。
- **[handoff](./skills/handoff/SKILL.md)**：把当前对话压缩成交接文档，让另一个 Agent 能继续工作。
- **[teach](./skills/teach/SKILL.md)**：把当前目录当作有状态教学工作区，分多次会话教授用户一个新技能或概念。
- **[writing-great-skills](./skills/writing-great-skills/SKILL.md)**：编写和编辑高质量 Skill 的参考，说明让 Skill 可预测的术语和原则。

## 模型可调用

模型或用户都可以触发。描述中保留了较丰富的触发语，方便模型主动选用。

- **[grilling](./skills/grilling/SKILL.md)**：围绕计划或设计持续追问，直到双方形成共同理解。
- **[tdd](./skills/tdd/SKILL.md)**：以 red-green loop 构建 feature 或修 bug。
- **[diagnosing-bugs](./skills/diagnosing-bugs/SKILL.md)**：先建立 tight feedback loop，再诊断 hard bug 或 performance regression。
- **[code-review](./skills/code-review/SKILL.md)**：按 Standards / Spec 两条轴线审查 diff。
- **[codebase-design](./skills/codebase-design/SKILL.md)**：提供 deep module 和 seam 设计 vocabulary。
- **[domain-modeling](./skills/domain-modeling/SKILL.md)**：维护 ubiquitous language、CONTEXT.md 和 ADR。

## Engineering flow 入口

- **[ask-matt](./skills/ask-matt/SKILL.md)**：整套 Skill 的 router，不确定用哪个 flow 时先调用它。
- **[setup-matt-pocock-skills](./skills/setup-matt-pocock-skills/SKILL.md)**：每个 repo 首次使用 engineering Skill 前运行一次。
- **Main build chain**：`grill-with-docs -> to-prd -> to-issues -> implement -> code-review`
- **Triage lane**：`triage -> grilling/domain-modeling -> ready-for-agent brief -> tdd/implement`
- **Codebase health lane**：`improve-codebase-architecture -> grilling -> to-prd/to-issues/implement`

## Docs

- **[docs/productivity](./docs/productivity/grilling.md)**：解释 `grill-me`、`grilling`、`handoff`、`teach`、`writing-great-skills` 的使用场景。
- **[docs/engineering](./docs/engineering/ask-matt.md)**：解释 `ask-matt` 路由、main flow、triage lane、PRD / issues / implement / review 等工程工作流。
