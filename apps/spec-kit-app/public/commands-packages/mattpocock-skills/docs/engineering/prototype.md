快速开始：

```bash
npx skills add mattpocock/skills --skill=prototype
```

```bash
npx skills update prototype
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/prototype)

## 它做什么

`prototype` 会构建一个小型、可丢弃程序。它唯一任务是回答一个 design question：这个 state model 感觉对不对，或这个 UI 应该长什么样。

代码从第一天起就是 **throwaway**，并会被标记为如此。它不带 test，不做超过运行所需的 error handling，不抽 abstraction，也不做 persistence。重点是快速学到东西，然后删除它。所以一旦你开始加固它，你就已经不再 prototyping。

## 什么时候用

你可以输入 `/prototype` 调用它；当任务匹配时，Agent 也可以自动调用。

当你有一个难以在纸面上解决的 design question 时，用它：一个你无法在脑中完整展开的 state machine，或一个必须看到几个版本并排后才能想象清楚的 screen。如果问题是已经构建出来的东西行为异常，需要查明原因，请用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)；prototype 探索的是要构建什么，不是已经构建的东西为什么坏了。

## 两个分支

问题决定形态，形态有两种：

- **“这个 logic / state model 感觉对吗？”**：一个很小的 interactive terminal app，用尴尬 case 推动 state machine，每个 action 后打印完整 state，让你观察变化。
- **“这个应该长什么样？”**：同一路由上的多个差异很大的 UI variation，可通过 floating bar 切换，让你比较真实 render，而不是靠想象。

选错分支会浪费整个 prototype，所以先确定问题。两个分支都把 state 保存在内存里，都通过单条命令运行，并在每一步暴露完整 state。

## 答案才是 artifact

代码可丢弃；唯一值得保留的是 **答案**。当 prototype 解决了问题，把 verdict 和它回答的问题一起记录到持久位置：commit message、ADR、issue，或旁边的 `NOTES.md`。然后删除或吸收代码。一个留在 repo 里腐烂的 prototype，已经超出了它的目的。

## 它放在哪里

`prototype` 是随时可用的 standalone：进入它是为了解决 design question，解决后就退出。它的答案经常喂给下一步，例如经过验证的 state model 或 UI direction 可以成为 [to-prd](https://aihero.dev/skills-to-prd) 写作的稳定输入，也可以通过 [domain-modeling](https://aihero.dev/skills-domain-modeling) 记录成 architecture decision。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
