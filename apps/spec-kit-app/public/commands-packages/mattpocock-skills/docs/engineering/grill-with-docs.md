快速开始：

```bash
npx skills add mattpocock/skills --skill=grill-with-docs
```

```bash
npx skills update grill-with-docs
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs)

## 它做什么

`grill-with-docs` 会围绕计划或设计持续追问你，一次一个问题，直到你和 Agent 达成 shared understanding；同时，它会在过程中写下 vocabulary 和 decisions。

这次 grilling **会留下 paper trail**。普通 interview 会打磨你的思考，但会在会话结束后消散；这个 Skill 会在术语被解决的瞬间把它写进 `CONTEXT.md` glossary，并把困难的一次性决策记录成 ADR。对齐结果会存活在对话之外，而不只留在脑子里。

## 什么时候用

你通过输入 `/grill-with-docs` 调用它。Agent 不会主动调用。

在一次 change 的最开始使用：计划还模糊，domain language 还没稳定，而你希望在写任何代码前同时压力测试两者。如果只想要 interview，不需要 artifact，用 [grilling](https://aihero.dev/skills-grilling)；如果计划已经清楚，只需要固定或记录术语，用 [domain-modeling](https://aihero.dev/skills-domain-modeling)。

## 前置条件

这个 Skill 是 stateful 的，会一边 grill 一边写入 repo。已解决术语会落到根目录的 `CONTEXT.md` glossary；如果 `CONTEXT-MAP.md` 标记 repo 是 multi-context，则落到相关 context 的 `CONTEXT.md`。真正 hard-to-reverse 的决策会写成 `docs/adr/` 下的 ADR。两者都按需创建，只有第一个术语或决策成形时才出现。因此你不需要预先 scaffold，但必须处在可以安全写这些文件的位置。

## The grill

引擎是 **grill**：relentless、one-question-at-a-time 地走过 design tree，先解决决策之间的依赖，再继续前进，并为每个问题提供推荐答案。能由代码库回答的问题，会通过读代码库解决，而不是问你。

这个变体成为独立 Skill 的原因在于答案去向。grill 运行时，模糊语言会被打磨成 canonical term，并立即写入 glossary，而不是最后批量补。glossary 保持 glossary：纯 vocabulary，没有 implementation detail，没有 spec。ADR 只在少数情况下提供：决策 hard to reverse、without context 会让人意外，并且来自真实 trade-off。大多数会话只产生更清晰的 glossary，很少或没有 ADR，这正是预期形态。

## 它工作正常的信号

- 它一次只问一个问题并等待，而不是丢出问卷。
- 术语一旦解决，就以项目自己的语言写进 `CONTEXT.md`。
- 能自己读代码库回答的问题，它会进入代码库查。
- ADR 保持稀少；不会让你对可逆选择反复盖章。

## 它放在哪里

`grill-with-docs` 是 main build chain 的开头：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

它在任何 spec 写下之前运行，产出 shared understanding 和稳定 vocabulary；[to-prd](https://aihero.dev/skills-to-prd) 随后会基于这些内容合成 PRD，而不是重新采访你。它的近邻是 [grilling](https://aihero.dev/skills-grilling)，也就是不写文档的同款 interview，以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)，也就是它驱动的 glossary-and-ADR 纪律。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
