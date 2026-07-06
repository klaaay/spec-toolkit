快速开始：

```bash
npx skills add mattpocock/skills --skill=ask-matt
```

```bash
npx skills update ask-matt
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/ask-matt)

## 它做什么

`ask-matt` 是这个 repo 里所有 Skill 的 router。你描述当前处境，它告诉你应该使用哪个 Skill 或 flow，以及按什么顺序运行。

它 **自己不做工作**。它不会 grill、写 PRD 或修东西，只负责定位。它尤其服务于 **user-invoked** Skill：这些 Skill 不会自动触发，所以 _你_ 必须记得它们存在，而 `ask-matt` 就是你可以外包出去的记忆。它也会指向你可以按名字调用的 model-invoked Skill，例如 `/tdd`、`/diagnosing-bugs`、`/prototype`、`/code-review`，以及两个 vocabulary reference：`/domain-modeling` 和 `/codebase-design`。它回答 “该用哪一个、什么时候用”，然后把你交给真正做事的 Skill。

## 什么时候用

你通过输入 `/ask-matt` 调用它。Agent 不会主动调用。

当你不确定当前情况应该走哪个 Skill 或 flow 时，就用它：你有个想法但不知道从哪里开始；你有一堆 bug report，不知道是否该走 `/triage`；或两个 Skill 看起来可互换，但你分不清区别。如果你已经知道想用哪个 Skill，就跳过 router，直接调用。

## Flow，而不只是 Skill

`ask-matt` 给你的核心概念是 **flow**：不是单个工具，而是穿过多个 Skill 的路径。大多数工作会走一条 **main flow**（idea -> ship：grill -> PRD -> issues -> implement -> review），两个 **on-ramp** 会汇入它（处理传入 bug 和 request 的 triage lane，以及产生新想法的 codebase-health lane），其他都是可以单独使用的 **standalone**。你提问后，它会把你放到正确 flow 的正确步骤上，而不是只递给你一个工具。

## 它放在哪里

`ask-matt` 是 **router**：覆盖整套 Skill 的 standalone 地图。其他 docs 页面都会链接回 [ask-matt](https://aihero.dev/skills-ask-matt)，所以它不位于任何链条 _内部_，而是指向每条链条 _里面_。从这里，你最常落到 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，也就是 main flow 的开头，或 [triage](https://aihero.dev/skills-triage)，也就是处理非你发起工作的 on-ramp。如果连 router 自己的图都过期了，它的 [Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/ask-matt) 才是记录来源。
