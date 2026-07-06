快速开始：

```bash
npx skills add mattpocock/skills --skill=domain-modeling
```

```bash
npx skills update domain-modeling
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling)

## 它做什么

`domain-modeling` 会在设计过程中建立并打磨项目的 **ubiquitous language**：挑战模糊词，用具体场景压力测试关系，并在术语和决策成形的那一刻写下 glossary 与决策记录。

这是 **主动** 纪律，不是被动习惯。仅仅读 `CONTEXT.md` 借用 vocabulary，是任何 Skill 都能做到的一行习惯；这个 Skill 用在你正在 _改变_ model 的时候：确立 canonical term、发现代码和你刚说的话互相矛盾、记录难以逆转的决策。它也保持 glossary 干净：`CONTEXT.md` 只是 glossary，不能混入 implementation detail、spec 或 scratch pad。

## 什么时候用

你可以输入 `/domain-modeling` 调用它；当任务匹配时，Agent 也可以自动调用，例如你正在固定术语、解决 overloaded word，或记录 architecture decision。

当 _词语_ 本身是问题时，用它：两个人说 “cancellation” 时意思不同，“account” 承担了三种职责，或设计讨论不断卡在一个从未被精确定义的概念上。如果问题是 module 的 _形状_，例如 seam 在哪、interface 多 deep，请用 [codebase-design](https://aihero.dev/skills-codebase-design)。如果你想在构建前拷问计划本身，请用 [grilling](https://aihero.dev/skills-grilling)。

## 前置条件

这个 Skill 会按需写入两个位置，只有真的有内容要记录时才创建。已解决的术语写入根目录的 `CONTEXT.md`；如果 repo 通过 `CONTEXT-MAP.md` 标记为 multi-context，则写入对应 context 的 `CONTEXT.md`。决策写入 `docs/adr/`。无需预先准备任何文件；第一个已解决术语会创建 glossary，第一个真实 trade-off 会创建 ADR。

## Glossary 与 ADR

两个 artifact，对应两个门槛：

- **Glossary**（`CONTEXT.md`）记录语言。每当模糊术语变成 canonical term，就立即写下，而不是最后批量补录，这样共享 vocabulary 会和讨论同步更新。它必须严格排除 implementation detail。
- **ADR** 记录决策，门槛很高：只有当选择 **hard to reverse**、**without context 会让人意外**，并且 **来自真实 trade-off** 时才提供。缺任一项就不写 ADR。这样 `docs/adr/` 才是重要岔路记录，而不是日记。

让它起效的关键动作是：当你描述某事如何工作时，Skill 会交叉引用代码并暴露矛盾，例如 “你的代码取消的是整个 Order，但你刚说可以 partial cancellation；哪个是对的？” 语言和代码必须被迫一致。

## 刻意抽出来的 reference

`domain-modeling` 是建立项目 ubiquitous language 的 **single source of truth**，被拆成单独的 model-invoked Skill，方便其他 Skill 触达。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 运行 grilling 时依赖它记录术语和决策，[triage](https://aihero.dev/skills-triage) 用它让 ticket 使用项目自己的词，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 工作时也会调用它。

保持 standalone 的意义在于，你也可以直接用它，把它作为打磨 model 的 **reference**，而不承诺执行其他 Skill 的步骤。语言只存在一处，所有需要它的地方都指向这里。

## 它放在哪里

`domain-modeling` 是 **reach-for-it-anytime standalone**，它经常运行在其他 Skill 之下，而不固定在某一步。它最接近的邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，因为共享语言能让你精确命名 deep module 和 seam；下游，[to-prd](https://aihero.dev/skills-to-prd) 会把稳定 glossary 合成为用项目语言写成的 spec。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
