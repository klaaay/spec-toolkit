快速开始：

```bash
npx skills add mattpocock/skills --skill=diagnosing-bugs
```

```bash
npx skills update diagnosing-bugs
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs)

## 它做什么

`diagnosing-bugs` 会为困难 bug 和 performance regression 运行一套纪律化 diagnosis loop：构建 repro、最小化、排序 hypothesis、加 instrumentation，然后用 regression test 修复。

在拥有 **tight feedback loop** 之前，它拒绝提出假设。tight feedback loop 是一个能运行、并且已经会因为 _这个_ bug 变红的命令。在这个命令存在前就读代码建理论，正是这个 Skill 要防止的失败模式。没有能变红的 loop，就没有 diagnosis。

## 什么时候用

你可以输入 `/diagnosing-bugs` 调用它；当任务匹配时，Agent 也可以自动调用。它会在你说 “diagnose” / “debug this”，或报告某个东西 broken、throwing、failing、slow 时触发。

困难问题用它：第一眼看不出的 bug、间歇 flake、夹在两个 known-good 状态之间的 regression。如果只是想快速验证一个设计问题，而不是追踪 defect，请用 [prototype](https://aihero.dev/skills-prototype)。

## Tight loop 就是这个 Skill

一旦有了信号，bisect、hypothesis testing、instrumentation 都只是机械步骤。因此这个 Skill 会在 Phase 1 上投入不成比例的精力：构造一个 pass/fail command，驱动实际 bug code path，并断言用户报告的精确症状。然后持续 **tightening**，直到它足够快、确定、Agent 可运行。一个 30 秒且 flaky 的 loop 只比没有好一点；一个 2 秒且 deterministic 的 loop 才是 debugging superpower。

它会给你一组构建 loop 的阶梯：failing test、curl script、CLI diff、headless browser、replayed trace、throwaway harness、fuzz loop、`git bisect run`、differential run；最后才是 human-in-the-loop bash script。对 non-deterministic bug，目标不是干净 repro，而是 **更高 reproduction rate**：循环触发、并行化、加压，直到 flake 可以调试。

## 它工作正常的信号

- 在建立理论前，先构建并运行 repro command，并贴出 invocation 和 red output。
- loop 断言的是你实际报告的症状，而不是附近的另一个失败。
- hypothesis 以排序、可证伪的列表出现，并在测试前展示给你。
- debug instrumentation 带有标签（`[DEBUG-...]`），并在宣称完成前通过 grep 清掉。

## 它放在哪里

`diagnosing-bugs` 是随时可用的 standalone：东西坏了就进入，修复和 regression test 完成后退出。当 post-mortem 发现真正问题是没有合适 seam 来锁住 bug 时，它会交给 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)：此时问题不只是 bug，而是代码。拿不准哪个 Skill 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
