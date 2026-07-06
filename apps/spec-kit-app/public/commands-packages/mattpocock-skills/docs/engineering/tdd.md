快速开始：

```bash
npx skills add mattpocock/skills --skill=tdd
```

```bash
npx skills update tdd
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)

## 它做什么

`tdd` 会 test-first 地构建 feature 或修 bug：一次一个 behaviour，通过 red-green loop 驱动代码产生。

它 **不会** 一次性先写完所有 tests。先批量写 test（“horizontal slicing”）会产出测试 _想象中_ 行为的 tests：它们检查形状，却对真实变化变得麻木。`tdd` 改走 vertical slice：一个 test，然后只写足够通过它的代码，再写下一个 test；每轮都被上一轮教会的东西校准。tests 只针对 public interface，这样底层 implementation 可以变化，而 tests 不需要移动。

## 什么时候用

你可以输入 `/tdd` 调用它；当任务匹配时，Agent 也可以自动调用，例如 test-first 构建 feature、修 bug，或你说 “red-green-refactor”。

当你有具体 behaviour 要构建，并希望 tests 能经受 refactor 时，用它。如果 behaviour 还没钉住，先稳定 spec；这时用 [to-prd](https://aihero.dev/skills-to-prd)。如果工作重点是 interface 形状而不是 tests，用 [codebase-design](https://aihero.dev/skills-codebase-design)；`tdd` 会在规划时调用它，使用 deep-module vocabulary。

## Red-green，一次一个 slice

核心概念是 **red-green loop**：写一个 failing test（red），加刚好足够的代码让它通过（green），然后重复下一个 behaviour。每轮都被上一轮教会的东西影响。第一轮是 **tracer bullet**：一个证明单一路径端到端可工作的 test，然后再向外扩展。因为你刚写完代码，所以你知道哪些 behaviour 重要、如何验证它；不会超出 headlights，提前承诺自己还不理解的 test structure。

两条规则保持 tests 诚实。好 test 读起来像 specification（例如 “user can checkout with valid cart”），并通过 public API 运行真实 code path，所以内部函数改名不会破坏它。expected value 必须来自独立事实源：known-good literal、worked example、spec；不能用和代码同样的方式重新计算，否则就会得到 **tautological** test，天然通过却什么也没告诉你。

suite 绿色后才能 refactor；红的时候绝不 refactor。

## 它工作正常的信号

- 它写一个 test，让它通过，然后才写下一个；不会先批量写 tests，再批量写代码。
- tests 命名 behaviour，而不是 internal，并且能经受内部 rename。
- expected value 是 spec 中的 literal，而不是用和代码一样的方式派生出来的数字。

## 它放在哪里

`tdd` 是 main build chain 用来写代码的 red-green loop：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

[implement](https://aihero.dev/skills-implement) 是链条里的 build 步骤，它内部驱动 `tdd` 以 test-first 方式构建每个 ticket，然后交给 [code-review](https://aihero.dev/skills-code-review)。因此 `tdd` 是该步骤内部的 engine，而不是独立链条步骤。你也可以直接用它，只要有一个具体 behaviour 要构建，而不需要完整 spec。它另一个邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，后者帮它找到值得测试的 deep-module seam。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
