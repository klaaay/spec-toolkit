快速开始：

```bash
npx skills add mattpocock/skills --skill=grill-me
```

```bash
npx skills update grill-me
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me)

## 它做什么

`grill-me` 会围绕一个计划或设计进行 relentless interview：沿着 decision tree 的每个分支往下走，直到你和 Agent 达成 **shared understanding**。

它 **一次只问一个问题**，并等待你的回答。它不会一次性抛出一组问题，那会让人无所适从。凡是能通过读代码库回答的问题，它会自己去读，而不是问你。每个问题都会带上 Agent 推荐的答案，所以你是在回应一个提案，而不是盯着空白提示词。

## 什么时候用

你通过输入 `/grill-me` 调用它。Agent 不会主动调用。

在开始构建前，如果计划大体正确，但你能感觉其中藏着未解决的决策，就用它。它适合把方案的软点找出来，并迫使它们浮出水面。如果你还希望同一轮追问留下 ADR 和 glossary 作为记录，请改用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。

## Design tree

会话会把计划当作一棵 decision tree 来走：先解决父决策，再处理挂在它下面的选择。目标不是快速达成一致，而是把每个隐含判断显式化，避免重要假设静默留在计划里。结束时，你会得到一份所有分支都被访问过的计划。

`grill-me` 是 **stateless** 的：它不写文件，也不留下 workspace。它可以在任何地方运行，唯一产物是对话中被打磨清楚的理解。这正是它和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 的刻意区别：后者会把同样的 interview 记录成持久的 ADR 和 glossary。

## 它放在哪里

`grill-me` 是随时可用的 standalone：一个构建前的压力测试。它是 [grilling](https://aihero.dev/skills-grilling) primitive 的 stateless、user-invoked 入口；最接近的邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，后者是 stateful 版本，同样追问，但还会把决策记录成 ADR 和 glossary。如果结果需要写成 spec，请交给 [to-prd](https://aihero.dev/skills-to-prd)，它会把已经达成的理解合成为 PRD，而不是重新采访你。拿不准用哪个 flow 时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
