快速开始：

```bash
npx skills add mattpocock/skills --skill=code-review
```

```bash
npx skills update code-review
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review)

## 它做什么

`code-review` 会审查 `HEAD` 和你提供的固定点之间的 diff。固定点可以是 commit、branch、tag 或 merge-base。它沿两条独立轴线审查：**Standards**（代码是否遵守该 repo 的文档化约定）和 **Spec**（是否实现了来源 issue 或 PRD 要求的内容）。它会把每条轴线作为独立的 parallel sub-agent 运行，并把结果并排报告。它从不合并或重新排序两组发现。保持它们分离正是重点，因为一个 change 可以通过其中一条轴线、失败于另一条；混成一个 verdict 会让一边掩盖另一边。

## 什么时候用

你可以输入 `/code-review` 调用它；当你要求审查 branch、PR、WIP change 或任何 “since X” 的内容时，Agent 也可以自动调用。

当你有一个 diff，需要和一个 known-good point 对照，并希望 “是否构建正确？” 与 “是否构建了正确的东西？” 这两个问题被独立回答时，用它。它运行在 build loop 的末尾。实际 test-first 写代码请用 [tdd](https://aihero.dev/skills-tdd)；把完整 spec 构建成代码请用 [implement](https://aihero.dev/skills-implement)，后者会在提交前自己运行 `/code-review`。

## 前置条件

**Spec** 轴线需要找到原始 spec：commit message 里的 issue 引用、你传入的路径，或 `docs/` / `specs/` 下的 PRD。issue tracker 的接线来自 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)。如果找不到 spec，Spec 轴线会跳过并说明原因。**Standards** 轴线不需要任何设置；即使 repo 没有记录约定，它也自带 Fowler code smell baseline。

## Two axes，永不合并

定义性概念是 **two axes**。**Standards** 问的是 diff 是否符合这个 repo 写代码的方式：`CODING_STANDARDS.md` 或 `CONTRIBUTING.md`，再加上一组固定的 Fowler code smells baseline，例如 Mysterious Name、Duplicated Code、Feature Envy、Data Clumps 等。两条规则保护 baseline：repo 文档化标准始终覆盖它；每个 smell 都是 judgment call，而不是硬性违规。**Spec** 问的是正交问题：代码是否做到了 issue 或 PRD 真正要求的内容，没有漏需求，也没有塞入 scope creep。

它们以 parallel sub-agent 运行，这样彼此上下文不污染。最终报告分别放在 `## Standards` 和 `## Spec` 标题下，每条轴线都有自己的 summary。刻意不产生跨轴线的单一赢家。

## 它工作正常的信号

- 它先固定并确认 fixed point（`git rev-parse`），遇到坏 ref 或空 diff 会快速失败，而不是等到 sub-agent 内部才失败。
- Standards 和 Spec 发现出现在两个独立区块中，每条都引用来源：一边是 repo standard 或 baseline smell，另一边是被引用的 spec 行。
- 找不到 spec 时，Spec 轴线报告 “no spec available”，而不是发明需求。

## 它放在哪里

`code-review` 是 main build chain 尾部的 review 步骤：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

它最接近的邻居是 [implement](https://aihero.dev/skills-implement)，后者负责构建，并在提交前调用它做 review pass；上游由 [to-prd](https://aihero.dev/skills-to-prd) 和 [to-issues](https://aihero.dev/skills-to-issues) 产生它要对照的 spec。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
