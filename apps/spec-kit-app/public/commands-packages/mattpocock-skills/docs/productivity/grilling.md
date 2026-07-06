快速开始：

```bash
npx skills add mattpocock/skills --skill=grilling
```

```bash
npx skills update grilling
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling)

## 它做什么

`grilling` 是在构建前压力测试计划或设计的 relentless interview。它沿着 design tree 逐个分支向下走，一次解决一个决策依赖，直到你和 Agent 对方案形成同一份理解。

它 **一次只问一个问题**，并在进入下一个问题前等待你的回答；不会给你一串问题清单。每个问题都会带上 Agent 自己的推荐答案。任何能由代码库回答的问题，它都会自己探索，而不是问你。除非你确认 shared understanding 已经达成，否则它不会开始执行计划。

## 什么时候用

你可以输入 `/grilling` 调用它；当任务匹配时，Agent 也可以自动调用。它是底层 primitive，不只是用户手动入口。

当计划或设计仍有软点，而你希望在写代码前暴露它们时，用它。实际使用中，你通常通过两个 wrapper 调用它：普通追问会话用 [grill-me](https://aihero.dev/skills-grill-me)；希望追问时同时写 ADR 和 glossary，则用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。

## Design tree

核心心智模型是 **design tree**：每个计划都会分叉成多个决策，而决策之间有依赖。`grilling` 一次只下降到一个节点，所以早期答案会重塑接下来的问题。问题必须单个、按依赖顺序出现，也是因为并行问题的洪水会冲散结构，无法收敛到 shared understanding。

## 刻意抽出来的 primitive

`grilling` 是 interview technique 的 **single source of truth**。它被拆成一个 model-invoked **primitive**，这样任何需要 interview 的 Skill 都能调用它，而不是各自重新实现。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 是它的两个 user-invoked 入口，但 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 和 [triage](https://aihero.dev/skills-triage) 也依赖它来压力测试自己的决策。

把技术集中在一处，也意味着当你只想要 interview，而不想要 ADR、ticket shaping 等 wrapper 行为时，可以直接调用它。

## 它放在哪里

`grilling` 是主构建链下面的 interview **primitive**：[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 会运行它，在 [to-prd](https://aihero.dev/skills-to-prd) 写 spec 前打磨上下文。拿不准入口时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
