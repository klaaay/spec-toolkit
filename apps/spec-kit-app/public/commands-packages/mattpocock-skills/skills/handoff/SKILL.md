---
name: handoff
description: 把当前对话压缩成交接文档，方便另一个 Agent 接手。
argument-hint: '下一次会话会用来做什么？'
disable-model-invocation: true
---

写一份交接文档，总结当前对话，让一个新的 Agent 可以继续工作。把文档保存到用户操作系统的临时目录，不要保存到当前工作区。

在文档中加入一个 “suggested skills” 小节，建议接手的 Agent 应该调用哪些 Skill。

不要重复已经记录在其他产物中的内容，例如 PRD、计划、ADR、issue、commit 或 diff。引用它们的路径或 URL 即可。

遮蔽所有敏感信息，例如 API key、密码和个人身份信息。

如果用户传入了参数，把参数视为下一次会话的重点说明，并据此调整交接文档。
