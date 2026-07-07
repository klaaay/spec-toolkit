---
name: superpowers-using-superpowers
description: 会话开始时使用：建立如何发现并使用 skills，要求在任何回应或动作前先判断并调用适用 skill
---

<SUBAGENT-STOP>
如果你是被分派来执行某个具体任务的子代理，请忽略此 skill。
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
只要你认为当前任务有哪怕 1% 的可能适用某个 skill，就必须调用该 skill。

如果某个 skill 适用于当前任务，你没有选择权，必须使用。

这条规则不可协商，也不能用理由绕开。
</EXTREMELY-IMPORTANT>

## 规则

**在任何回应或动作之前，先调用相关或被点名的 skills**，包括澄清问题、探索代码库、检查文件。如果后来发现不适用，可以不继续使用。

**进入 plan mode 前：** 如果还没有做过 brainstorm，先调用 `superpowers-brainstorming`。

随后说明“正在使用 [skill] 来 [目的]”，并严格遵循该 skill。如果它有 checklist，就为每项创建 todo。

## Skill 优先级

多个 skill 同时适用时，流程型 skill 优先。它们决定做事方法；实现型 skill 再负责落地。`superpowers-brainstorming` 和 `superpowers-systematic-debugging` 是 Superpowers 最常见的流程型 skill，但这条规则适用于所有 skill。

- “构建 X” → 先用 `superpowers-brainstorming`，再用实现相关 skill。
- “修复这个 bug” → 先用 `superpowers-systematic-debugging`，再用领域 skill。

## 危险信号

出现以下想法时，立刻停下。你正在合理化跳过流程：

| 想法 | 现实 |
| --- | --- |
| “这只是个简单问题” | 问题也是任务。先检查 skill。 |
| “我需要先拿更多上下文” | skill 检查发生在澄清问题之前。 |
| “我先浏览一下代码库” | skill 会告诉你如何探索。先检查。 |
| “我快速看一下 git / 文件就好” | 文件没有对话上下文。先检查 skill。 |
| “我先收集信息” | skill 会告诉你如何收集信息。 |
| “这不需要正式 skill” | 只要有适用 skill，就使用。 |
| “我记得这个 skill” | skill 会演进。读取当前版本。 |
| “这不算任务” | 有动作就算任务。先检查 skill。 |
| “这个 skill 太重了” | 简单任务也会变复杂。使用 skill。 |
| “我先做这一步” | 做任何事之前先检查。 |
| “这样更有效率” | 无纪律的动作会浪费时间。skill 用来避免这点。 |
| “我知道那是什么意思” | 知道概念不等于使用了 skill。调用它。 |

## 平台适配

如果当前运行环境在下面列表中，读取对应参考文件：

- Codex：`references/codex-tools.md`
- Pi：`references/pi-tools.md`
- Antigravity：`references/antigravity-tools.md`

## 用户指令

用户指令（`CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 等指令文件，以及用户直接请求）优先于 skills；skills 优先于默认行为。只有当人类伙伴明确要求跳过某个工作流或指令时，才可以跳过。
