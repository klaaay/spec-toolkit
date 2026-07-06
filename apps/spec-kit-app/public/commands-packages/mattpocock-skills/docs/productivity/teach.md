快速开始：

```bash
npx skills add mattpocock/skills --skill=teach
```

```bash
npx skills update teach
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/productivity/teach)

## 它做什么

`teach` 会把当前目录变成一个长期教学 workspace，并围绕一个主题跨多个会话教你学习。它会设计短小、漂亮、可交互的 lesson，并把每节课和你学习这个主题的 _why_ 绑定起来。

它 **不会** 从模型自己的记忆里直接教学。Parametric knowledge 被视为不可信；在教学前，它会收集高可信资源，并让每个主张都有 citation 支撑。它也是 stateful 的：workspace 会记住你已经学过什么，所以每次会话都会接着上次继续，而不是从头开始。

## 什么时候用

你通过输入 `/teach` 调用它。Agent 不会主动调用。

当你想长期学习一个主题时使用，例如一门语言、一个 framework、瑜伽或理论物理。它适合让多个会话积累起来，而不是一次性消失。它不适合临时解释一个概念；如果只是当下需要澄清，直接提问即可。只有当学习本身是一项项目时，才用 `teach`。

## 前置条件

`teach` 会在当前目录中构建一整套结构，所以请在你愿意长期保留的专用 workspace 中运行。随着时间推移，它会写入：

- `MISSION.md`：你学习这个主题的原因，是所有教学的锚点。如果为空，`teach` 的第一项工作就是追问到它不为空。
- `RESOURCES.md`：经过筛选的高可信来源，教学从这里出发。
- `./lessons/*.html`：编号的自包含 lesson，是主要教学单元。
- `./reference/*.html`：压缩后的 cheat sheet、algorithm、glossary 等，会被反复查阅。
- `./learning-records/*.md`：你已经学到的东西，ADR 风格，用来判断下一步该教什么。
- `./assets/*`：可复用组件，首先是共享样式表，让 lesson 看起来像同一门课程。
- `NOTES.md`：你的教学偏好。

## Mission 与 zone of proximal development

每节课都挂在 **mission** 上。没有 mission，知识就没有落点，lesson 会显得抽象。所以 `teach` 会先钉住 mission，并随着你成长持续更新。它会根据 mission 和 learning records 计算你的 **zone of proximal development**：下一节课应该 “刚刚好” 地挑战你。

## Storage strength，而不是 fluency

需要抓住的词是 **storage strength**：长期保持。它不同于 **fluency**，也就是当下能回想出来、但会让人误以为已经掌握的流畅感。`teach` 会刻意通过 desirable difficulty 建立 storage strength：retrieval practice、spacing 和 interleaving。知识先教，因为这里困难是敌人；技能再通过 tight feedback loop 训练，因为这里困难是工具。

## 它放在哪里

`teach` 是随时可用的 standalone：一个由你逐会话驱动的长期学习项目，不是构建链中的某一步。它和其他 productivity Skill 没有共享 workflow；它只拥有自己的 workspace 目录，并长期住在那里。拿不准当前该用哪个 Skill 或 flow 时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
