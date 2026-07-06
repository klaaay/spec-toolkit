快速开始：

```bash
npx skills add mattpocock/skills --skill=handoff
```

```bash
npx skills update handoff
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff)

## 它做什么

`handoff` 会把当前对话压缩成一份 **handoff document**：一个新的 Agent 读完后，就能从你停下的地方继续工作的单份文档。

它 **不会** 复述已经存在于其他地方的内容。任何已经记录在 PRD、plan、ADR、issue、commit 或 diff 中的信息，只会通过路径或 URL 引用，不会复制。文档只保留当前仍活跃的线索：你在做什么、为什么做、下一步是什么。它会保存到操作系统的临时目录，而不是 workspace，因此不会变成另一个需要维护的产物。

## 什么时候用

你通过输入 `/handoff` 调用它。Agent 不会主动调用。你也可以传入下一次会话的重点说明，生成的文档会围绕这个重点调整。

当对话已经长到上下文存在风险时使用：接近 context limit、准备当天收工，或刻意把工作交给另一个 Agent。目标是在不携带整段 transcript 的前提下，保留可恢复的工作线索。

## 文档包含什么

- **Live thread**：当前正在推进的内容和原因，用对话自己的语言写，但排除已经写到别处的细节。
- **Suggested skills**：建议下一位 Agent 调用哪些 Skill。
- **References, not copies**：指向 PRD、plan、ADR、issue 和 diff 的链接或路径。
- **Redacted secrets**：写入前剔除 API key、密码和 PII。

请抓住 **compaction** 这个概念：handoff 是把对话压缩到只剩可恢复的核心，让新的 Agent 继承动量，而不是继承噪音。

## 它放在哪里

`handoff` 是随时可用的 standalone，位于两个会话之间，而不是构建链内部。它天然会和产生产物的 Skill 配合，因为 handoff 会指向这些产物而不是重复它们，例如 [to-prd](https://aihero.dev/skills-to-prd)。拿不准当前该用哪个 Skill 时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
