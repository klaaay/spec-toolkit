快速开始：

```bash
npx skills add mattpocock/skills --skill=resolving-merge-conflicts
```

```bash
npx skills update resolving-merge-conflicts
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/resolving-merge-conflicts)

## 它做什么

`resolving-merge-conflicts` 会处理进行中的 git merge 或 rebase conflict：逐个 hunk 解决，并完成整个操作，最终状态是已解决、已检查、已提交。

它按 **intent** 解决，而不是按文本解决。触碰 hunk 前，它会把双方追溯到各自的 **primary source**：commit message、PR、原始 issue，理解为什么做了这个 change，然后在兼容时保留双方 intent。它不会发明新行为来糊住冲突，也不会使用 `--abort`：merge 必须被完成。

## 什么时候用

你可以输入 `/resolving-merge-conflicts` 调用它；当任务匹配时，Agent 也可以自动调用。

当你正处于 merge 或 rebase 中，而 git 卡在无法自动解决的 conflict 上时，用它。它处理眼前的 conflict，不负责规划 merge，也不负责调试 merge 后坏掉的行为。如果 merge 已经完成，但现在某些东西失败且原因不明，请用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。

## Resolving by intent

conflict 的陷阱，是把它当成文本问题：选 “ours” 或 “theirs”，只要消掉 marker 就好。这个 Skill 把它当成 **intent** 问题。hunk 的每一边之所以存在，是因为有人想要某个结果；resolution 必须尽可能尊重双方意图。当双方确实不兼容时，选择符合这次 merge 明确目标的一边，并把 trade-off 说清楚。

这就是 primary source 重要的原因。你无法保留自己没读过的 intent，所以工作从 history 开始：commit、PR、ticket，而不是 diff。

## 它工作正常的信号

- 每个已解决 hunk 都保留双方行为，或说明无法保留时的 trade-off。
- 不出现任何不属于任一 branch 的新行为。
- 找到并运行项目自己的检查：typecheck、tests、format，且提交前为绿色。
- merge 或 rebase 被一路推进到完成 commit，从不 abort。

## 它放在哪里

这是随时可用的 standalone：在 merge 或 rebase 卡住的那一刻调用，返回一个干净、已提交的 tree。它天然邻近 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)，因为一个解决干净但之后行为异常的 merge 是 diagnosis 问题，不是 conflict 问题。拿不准哪个 Skill 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
