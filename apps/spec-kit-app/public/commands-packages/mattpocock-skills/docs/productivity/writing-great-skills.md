快速开始：

```bash
npx skills add mattpocock/skills --skill=writing-great-skills
```

```bash
npx skills update writing-great-skills
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills)

## 它做什么

`writing-great-skills` 是你编写和编辑 Skill 时使用的 reference：它提供共享 vocabulary 和原则，让 Skill 的行为更 predictable。

Skill 的工作，是从 stochastic system 中拧出 determinism。所以目标不是每次运行得到相同 _output_，而是相同 _process_。**Predictability** 是根本美德，每个设计选择都要拿它来判断，而不是看 Skill 读起来是否聪明、完整或穷尽。

## 什么时候用

你通过输入 `/writing-great-skills` 调用它。Agent 不会主动调用。

当你在创作新 Skill 或编辑已有 Skill，并希望它每次都以同样方式行动时，就用它：决定 invocation mode、写 description、选择什么放进 `SKILL.md`、什么放进链接文件，或诊断一个 Skill 为什么误触发。

## Cognitive load

整份 reference 围绕 **cognitive load**，以及它的对应物 **context load** 展开。每个 Skill 都会消耗其中一个：

- **model-invoked** Skill 每轮都把 description 留在窗口中，所以花费 **context load**，但能自己触发。
- **user-invoked** Skill 去掉 description；它不花 context load，但现在 _你_ 是索引，必须记得它存在，这就是 **cognitive load**。

这些 Skill 大多是 user-invoked，因此 cognitive load 是整套系统要管理的压力。user-invoked Skill 多到你记不住时，解法是一个 **router skill**：列出其他 Skill 以及什么时候该用哪个。一旦你用这两种 load 思考，大多数 authoring 决策都会变成同一个取舍的不同版本：拆不拆、内联还是披露、model-invoked 还是 user-invoked。

## 其他杠杆

reference 的其余部分，是帮助你把这些 load 花好的工具箱：

- **Leading words**：模型预训练中已有的紧凑概念，例如 _tight_、_red_、_tracer bullet_。Agent 运行 Skill 时会借它思考。它用最少 token 同时锚定 execution 和 invocation；要主动寻找可以被一个词替代的重复表述。
- **Information hierarchy**：从 in-skill step、in-skill reference，到 **context pointer** 后的 external reference 的层级。**Progressive disclosure** 就是沿这架梯子向下移动，让顶层保持清晰。
- **Pruning**：single source of truth、relevance，以及逐句做 no-op test，用来对抗 **sediment** 和 **sprawl**。
- **Failure modes**：**premature completion**、**duplication**、**sediment**、**sprawl**、**no-op**，用来诊断 Skill 为什么行为不对。

## 它放在哪里

这是随时可用的 standalone reference：一个构建其他 Skill 时使用的 meta-skill，不是链条中的一步。它天然邻近你维护的任何 router，因为 router 正是治理 user-invoked Skill 堆积造成的 cognitive load 的直接解法。拿不准任务适合哪个 Skill 或 flow 时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由整套集合。
