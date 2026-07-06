快速开始：

```bash
npx skills add mattpocock/skills --skill=implement
```

```bash
npx skills update implement
```

[来源](https://github.com/mattpocock/skills/tree/main/skills/engineering/implement)

## 它做什么

`implement` 会构建 PRD 或一组 issue 中描述的工作：通过 test-driven development、typecheck 和完整 test suite 推进，然后交给 review，并提交到当前 branch。

它 **不决定构建什么**。spec 已经稳定，seam 已经达成一致；`implement` 执行计划，而不是重新打开计划。它是手，不是头脑；思考已经在上游完成。

## 什么时候用

你通过输入 `/implement` 调用它。Agent 不会主动调用。

当工作已经写成 PRD 或拆成 issue，并且你准备把它变成代码时，用它。如果 spec 还不存在，先写 spec；这时用 [to-prd](https://aihero.dev/skills-to-prd)，或用 [to-issues](https://aihero.dev/skills-to-issues) 把 PRD 拆成 ticket。如果你只是想在没有完整 spec 的情况下 test-first 构建某个东西，直接降到 [tdd](https://aihero.dev/skills-tdd)。

## 预先同意的 seam

`implement` 运行所依赖的概念是 **seam**：feature 被测试的稳定 interface，在写任何代码前选定。它不会在构建中途发明 seam；它使用已经选好的 seam（通常在 [to-prd](https://aihero.dev/skills-to-prd) 中选定），并通过 [tdd](https://aihero.dev/skills-tdd) 针对它写测试。在预先同意的 seam 上工作，是保持实现诚实的关键：test 目标稳定，底层代码可以移动而不带着 test 移动。

围绕这个核心，它保持 loop 紧凑：频繁 typecheck，过程中运行单个 test file，最后运行完整 suite，然后用 review pass 和对当前 branch 的 commit 收尾。

## 它放在哪里

`implement` 是 main chain 末端附近的 build 步骤，就在 review 前：

```txt
grill-with-docs → to-prd → to-issues → implement → code-review
```

只有当工作已经 specced 并排序后才用它。它的关键邻居是 [to-issues](https://aihero.dev/skills-to-issues)，后者产出可独立领取的 ticket；以及 [tdd](https://aihero.dev/skills-tdd)，它在内部驱动每个 seam 的测试，然后运行自己的 [code-review](https://aihero.dev/skills-code-review) pass 并提交。拿不准哪个 Skill 或 flow 适合当前任务时，用 [ask-matt](https://aihero.dev/skills-ask-matt) 路由。
