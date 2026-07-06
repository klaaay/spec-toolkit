快速开始：

```bash
npx skills add mattpocock/skills --skill=to-prd
```

```bash
npx skills update to-prd
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-prd)

## 它做什么

`to-prd` 会把当前 conversation 和你对 codebase 的理解转成 product requirements document，然后发布到 issue tracker。

它 **不会** 再采访你一遍。到你调用它时，alignment work 已经完成；`to-prd` 是合成已知内容，而不是重新提一轮问题。

## 什么时候用

你通过输入 `/to-prd` 调用它。Agent 不会主动调用。

当一个 change 已经被谈清楚，domain language 已经稳定，而你希望在写代码前把 shared understanding 写成 spec 时，用它。如果还没有对齐，先 grill；这时用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)。要把完成的 PRD 拆成 ticket，用 [to-issues](https://aihero.dev/skills-to-issues)。

## 前置条件

`to-prd` 会发布到 issue tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为此 repo 配置 tracker 和 triage labels。它会自己应用 `ready-for-agent` label，不需要单独跑 triage。

## PRD 包含什么

- **Problem statement**：什么坏了或缺失了，以及为什么值得解决，使用项目自己的 vocabulary。
- **Solution**：高层修复形态，先于任何 implementation detail。
- **User stories**：详尽、编号的具体 behaviour 列表，每项都能独立检查。
- **Implementation decisions**：conversation 中已经定下的选择，避免之后重复争论。
- **Testing decisions**：feature 将在哪些 seam 上测试，以及 “done” 是什么。
- **Out-of-scope items**：本 change 刻意不覆盖什么，用来保持 ticket 有边界。
- **Further notes**：任何值得带到后续、但不适合上述小节的内容。

## Deep modules

写 PRD 前，`to-prd` 会先勾勒 feature 要在哪些 **seam** 上测试，并寻找 **deep module** opportunity：把大量功能隐藏在小而稳定的 interface 后面。它优先使用已有 seam，而不是新 seam，并倾向选择尽可能高的 seam，理想情况是整个 change 只跨一个 seam。

这对 agentic development 很重要：好的 interface 给 test 一个稳定目标，让底层代码可以变化而不移动 tests。

## 它工作正常的信号

- 它开始写 PRD，而不是重新问你一轮问题。
- 写作前会和你确认 seam，并提出尽可能少的 seam。
- PRD 使用项目 domain vocabulary，而不是通用 boilerplate。

## 它放在哪里

`to-prd` 是 main build chain 中的一步：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

在 plan 和 domain language 已经解决后、拆成 implementation ticket 前使用它。关键邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，后者打磨上下文让 PRD 精确；以及 [to-issues](https://aihero.dev/skills-to-issues)，后者把 PRD 变成可被 [implement](https://aihero.dev/skills-implement) 构建的独立 issue。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
