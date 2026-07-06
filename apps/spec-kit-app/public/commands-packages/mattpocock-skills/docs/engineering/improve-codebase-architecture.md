快速开始：

```bash
npx skills add mattpocock/skills --skill=improve-codebase-architecture
```

```bash
npx skills update improve-codebase-architecture
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture)

## 它做什么

`improve-codebase-architecture` 会扫描 codebase，寻找 **deepening opportunity**：那些 shallow module（interface 几乎和被隐藏的东西一样复杂）可以变成 deep module 的地方。它会把候选以自包含的可视化 HTML report 展示出来，然后对你选中的候选运行 grilling。

它 **不会** 给你一张扁平 refactor 清单。每个候选都必须通过 **deletion test**：删除这个 module 后，是能把 complexity _集中_ 到更小 interface 背后，还是只是把 complexity 搬到别处？只有 “concentrates” 的情况才值得成为卡片。这个过滤器避免 report 退化成通用 cleanup 建议。

## 什么时候用

你通过输入 `/improve-codebase-architecture` 调用它。Agent 不会主动调用。

把它当作周期性健康检查：每几天一次，或当 codebase 开始让人觉得必须在太多小 module 间来回跳转才能理解一个概念时。它读取既有 architecture，并建议哪里可以 deepen。如果你已经知道想重新设计哪个 module，只需要 vocabulary 来思考，请用 [codebase-design](https://aihero.dev/skills-codebase-design)。本 Skill 是寻找候选的 survey；那个 Skill 是设计工作台。

## Deepening opportunity

整个 Skill 围绕一个概念：**depth**。deep module 把大量功能隐藏在小而稳定的 interface 后面；shallow module 则让 implementation 通过几乎同样宽的 interface 泄漏出来。report 会寻找 shallowness：只为测试性而抽出的纯函数，但真正 bug 藏在调用方式里（没有 **locality**）；跨 **seam** 泄漏的 module；必须打开五个文件才能理解的概念。然后提出能修复它的 deepening。

它使用共享设计 vocabulary（**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**）以及 `CONTEXT.md` 中的项目 domain language，因此候选读起来会像 “deepen the Order intake module”，而不是 “refactor the FooBarHandler”。

## Report，然后 grill

输出是一个可在浏览器打开的 HTML 文件，写到操作系统临时目录，不会落到 repo。每个候选是一张卡片，包含相关文件、friction、plain-English solution、以 locality 和 leverage 表达的收益、before/after diagram，以及 `Strong` / `Worth exploring` / `Speculative` badge。最后会给出它最想先处理的候选。

然后它会停下来问你想探索哪一个。选中后，它会对这个设计运行 [grilling](https://aihero.dev/skills-grilling) loop：constraints、seam 后面是什么、哪些 tests 会保留下来，并在决策成形时即时更新 domain model。

## 它放在哪里

`improve-codebase-architecture` 是 **periodic maintenance**：每隔几天运行一次，而不是链条中的一步。它的邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，后者拥有每个候选所用的 depth-and-seam vocabulary；[grilling](https://aihero.dev/skills-grilling)，后者在你选定候选后走 design tree；以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)，后者在 redesign 稳定时保持 `CONTEXT.md` 和 ADR 更新。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
