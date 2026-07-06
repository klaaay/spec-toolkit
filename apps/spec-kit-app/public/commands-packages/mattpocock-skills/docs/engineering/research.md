快速开始：

```bash
npx skills add mattpocock/skills --skill=research
```

```bash
npx skills update research
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/research)

## 它做什么

`research` 通过阅读拥有答案的来源来回答问题，并留下带 citation 的 Markdown 文件。它只使用 **primary sources**：官方文档、源代码、规范、一方 API，而不使用它们的二手解读。因此它保存下来的内容可以追溯到权威来源，而不是摘要的摘要。

## 什么时候用

你可以输入 `/research` 调用它；当任务变成阅读摸排时，Agent 也可以自动调用。

当下一步是 _查清某件事_ 时用它：API 到底如何行为、spec 实际怎么说、某个 claim 是否成立。如果你不想让自己的主线程停下来做阅读，就把它交给 `research`。如果要通过 interview 打磨计划而不是通过阅读查明问题，用 [grilling](https://aihero.dev/skills-grilling)；如果要用可丢弃代码探索要构建什么，用 [prototype](https://aihero.dev/skills-prototype)。

## Delegated legwork

定义性动作是阅读作为 **background agent** 运行。你继续工作；它离开主线，追溯每个 claim 到 primary source，然后把一个带 citation 的 Markdown 文件放到 repo 保存这类笔记的位置。Research 是你委派出去的 legwork，不是外包出去的 thinking。你拿回的是一份可以反应和判断的文档，且来源附在上面。

## 它放在哪里

这是随时可用的 standalone，会喂给思考型 Skill：它产出的文件可以被 grill、plan 或 design，所以它位于 [grilling](https://aihero.dev/skills-grilling) 和 [to-prd](https://aihero.dev/skills-to-prd) 这类工作之前，而不在 build chain 内部。完整地图见 [ask-matt](https://aihero.dev/skills-ask-matt)。
