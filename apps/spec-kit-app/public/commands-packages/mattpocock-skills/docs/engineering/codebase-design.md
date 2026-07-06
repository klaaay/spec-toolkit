快速开始：

```bash
npx skills add mattpocock/skills --skill=codebase-design
```

```bash
npx skills update codebase-design
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design)

## 它做什么

`codebase-design` 提供一套共享、精确的 vocabulary，用来设计 **deep module**：大量行为隐藏在小接口背后，放在清晰的 seam 上，并能通过这个 interface 测试。

它是 **language, not a procedure**。它不会重构代码，也不会给你 refactor plan。它负责固定词语：module、interface、depth、seam、adapter、leverage、locality，让每次设计讨论以及任何触及设计的 Skill 都使用同一套语言。稳定语言就是全部重点；“component”、“service”、“API”、“boundary” 被刻意禁用，因为它们会模糊真正重要的区别。

## 什么时候用

你可以输入 `/codebase-design` 调用它；当任务匹配时，Agent 也可以自动调用。

当你在设计或改进一个 module 的 interface、寻找 deepening opportunity、决定 seam 放在哪里，或让代码更可测试、更易被 AI 导航时，用它。其他 Skill 需要 deep-module vocabulary 时会拉它进来。如果你想打磨的是项目的 _domain_ 词语，而不是 module design，请用 [domain-modeling](https://aihero.dev/skills-domain-modeling)；如果要对现有 codebase 做完整 architecture pass，请用 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)。

## Deep，而不是 shallow

当大量行为位于小 interface 背后时，一个 module 就是 **deep**；当 interface 几乎和 implementation 一样复杂时，它就是 **shallow**。Depth 用 **leverage** 衡量：caller 或 test 每学习一单位 interface，能驱动多少行为。关键是，depth 是 _interface_ 的属性，不是 implementation 的属性：deep module 内部可以由很多小而可替换的部分组成，只要这些部分不暴露给 caller。

两个检查承担大部分工作。**Deletion test**：想象删除这个 module。如果 complexity 消失了，它只是 pass-through；如果 complexity 在 N 个 caller 中重新出现，它就在创造价值。另一个规则是：**一个 adapter 说明 seam 只是 hypothetical；两个 adapter 才说明 seam 真实存在**。在某个东西确实跨 seam 发生变化之前，不要切 seam。

## Interface 就是 test surface

Caller 和 test 穿过同一条 seam，所以位置良好的 interface 会给 test 一个稳定目标，让底层代码可以自由变化。这就是为什么 vocabulary 坚持使用 **seam**（Feathers 的术语，表示不用编辑此处就能改变行为的位置），而不是含义过载的 “boundary”。这里的 “interface” 指 caller 必须知道的每个事实：signature 当然包括，但也包括 invariant、ordering、error mode 和 performance，而不仅是 type-level surface。

## 刻意抽出来的 reference

`codebase-design` 是 deep-module vocabulary 的 **single source of truth**，被拆成单独的 model-invoked Skill，任何地方都能触达它。其他 Skill 指向它，而不是重复这些词：[tdd](https://aihero.dev/skills-tdd) 借它在写测试前放置 seam，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在重构既有代码时依赖它，[to-prd](https://aihero.dev/skills-to-prd) 在写 spec 前描述 seam 和 deepening opportunity 时也使用它。

保持 standalone 的意义在于，你也可以单独使用它，把它当作思考 module design 的 **reference**，而不触发其他 Skill 规定的大流程。词语只在一处固定，每次设计讨论都继承它们。

## 它放在哪里

`codebase-design` 是 **reach-for-it-anytime standalone**：工程 Skill 底下的共享 vocabulary 层。它最接近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)，后者是面向 problem domain 而非 module structure 的平行 vocabulary Skill。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
