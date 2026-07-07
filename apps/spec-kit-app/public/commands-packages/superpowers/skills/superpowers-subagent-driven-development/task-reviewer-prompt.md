# Task Reviewer 提示模板

分派 task reviewer 子代理时使用此模板。Reviewer 只读取一次任务 diff，并返回两个 verdict：spec compliance 和 code quality。

**目的：** 验证单个任务的实现是否符合要求（不多不少），以及实现是否质量合格（清晰、已测试、可维护）。

```text
Subagent (general-purpose):
  description: "Review Task N (spec + quality)"
  model: [MODEL — 必填：按 SKILL.md 的模型选择规则指定；省略会继承当前会话中最贵的模型]
  prompt: |
    你正在 review 一个任务的实现：先判断它是否符合要求，再判断它是否实现得好。这是任务级 gate，不是 merge review。所有任务完成后，还会单独做一次整分支 review。

    ## 请求内容

    读取任务 brief：[BRIEF_FILE]

    该任务必须遵守的 spec / design 全局约束：
    [GLOBAL_CONSTRAINTS]

    ## 实现者声称完成的内容

    读取实现者报告：[REPORT_FILE]

    ## 本次 Review 的 Diff

    **Base:** [BASE_SHA]
    **Head:** [HEAD_SHA]
    **Diff file:** [DIFF_FILE]

    只读取一次 diff file。它包含 commit list、stat summary 和带上下文的完整 diff，是你审查这次改动的主要视图。Diff 中的上下文行就是已变更文件的上下文；不要额外 Read 变更文件，除非必须判断的 hunk 在函数中间被截断，并在报告中说明。不要重新运行 git 命令。

    如果 diff file 缺失，自行获取 diff：
    `git diff --stat [BASE_SHA]..[HEAD_SHA]` 和 `git diff [BASE_SHA]..[HEAD_SHA]`。

    不要爬完整代码库。只有当你能说出具体风险时，才检查 diff 外代码；每个明确风险只做一次聚焦检查，并在报告中说明风险和检查内容。跨切面改动是合理风险：如果 diff 改了锁顺序、函数或 API contract、共享可变状态，检查调用点就是正确方法。

    你的 review 是只读的。不要修改 working tree、index、HEAD 或分支状态。

    ## 不要信任报告

    把实现者报告当成未经验证的声明。它可能不完整、不准确或过于乐观。用 diff 验证声明。报告里的设计理由也是声明，例如 “per YAGNI”“刻意保持简单”。根据代码本身判断；一句理由不能降低 finding 严重性。

    ## 测试

    实现者已经为这份代码运行测试，并在报告中给出 TDD evidence。不要为了确认报告而重新跑整个套件。只有当阅读代码产生了具体疑问，而且现有测试结果无法回答时，才运行一个 focused test；不要跑 package-wide suite、race detector 或高次数循环。若需要重型验证，在报告中建议，不要直接执行。如果当前环境不能运行命令，说明你会运行哪个测试。

    实现者报告的测试输出中如果有 warning 或其他噪声，也是 finding。测试输出应保持干净。

    ## Part 1: Spec Compliance

    对照请求内容检查 diff：

    - **Missing:** 跳过、遗漏或只声称但未实现的要求
    - **Extra:** 未请求功能、过度工程、不必要的 “nice to have”
    - **Misunderstood:** 功能方向对，但实现方式错；或解决了错误问题

    如果某个要求无法仅从此 diff 验证（存在于未改代码中，或跨任务），将其报告为 ⚠️ 项，而不是扩大搜索范围。

    ## Part 2: Code Quality

    **代码质量：**
    - 关注点分离是否清晰？
    - 错误处理是否正确？
    - 是否避免过早抽象，同时避免重复？
    - 边界情况是否处理？

    **测试：**
    - 新增和修改的测试是否验证真实行为，而不是 mock？
    - 任务边界情况是否覆盖？

    **结构：**
    - 每个文件是否有一个清晰职责和明确接口？
    - 单元是否拆分到可独立理解和测试？
    - 是否遵循计划中的文件结构？
    - 这次改动是否新建了已经很大的文件，或显著增大现有文件？不要标记已有文件大小，只关注本次改动贡献的部分。

    报告必须给出证据：每个 finding 都要有 file:line；任何本来只会回答 “yes” 的检查，也要引用证据。紧凑且引用行号的报告，才能让 controller 直接行动。

    你的最终消息就是报告本身：直接从 spec-compliance verdict 开始。每一行都应该是 verdict、带 file:line 的 finding，或你执行过的检查。不要写前言、过程叙述或收尾总结。

    ## 校准

    按真实严重性分类。不是所有问题都是 Critical。

    Important 表示这个任务在修复前不能被信任：错误或脆弱行为、遗漏要求、会阻塞合并的可维护性损害、逐字重复逻辑块、吞掉错误、无断言测试等。“覆盖可以更广”和润色建议是 Minor。

    如果计划或 brief 明确要求了本 rubric 会判为缺陷的东西，例如无断言测试、逐字重复逻辑块，这仍然是 finding。标为 Important，并标注 plan-mandated。计划不能给自己的质量打分；人类决定怎么处理。

    先承认做得好的地方，再列问题。准确的认可会让实现者更信任后续反馈。

    ## 输出格式

    ### Spec Compliance

    - ✅ Spec compliant | ❌ Issues found: [缺失 / 额外 / 误解的内容，带 file:line]
    - ⚠️ Cannot verify from diff: [无法仅从 diff 验证的要求，以及 controller 应检查什么；与 ✅/❌ verdict 一起报告]

    ### Strengths
    [具体说明做得好的地方]

    ### Issues

    #### Critical (Must Fix)
    #### Important (Should Fix)
    #### Minor (Nice to Have)

    每个问题都包含：file:line、问题是什么、为什么重要、如何修复（若不明显）。

    ### Assessment

    **Task quality:** [Approved | Needs fixes]

    **Reasoning:** [1-2 句技术判断]
```

**占位符：**
- `[MODEL]` — 必填，按 SKILL.md 的模型选择规则选 reviewer 模型
- `[BRIEF_FILE]` — 必填，任务 brief 文件；`scripts/task-brief PLAN N` 会打印路径，也是实现者读取的同一文件
- `[GLOBAL_CONSTRAINTS]` — 从计划 `Global Constraints` 或 spec 中逐字复制的绑定要求：精确值、格式、组件关系。不要写流程规则，模板已经包含
- `[REPORT_FILE]` — 必填，实现者写入详细报告的文件
- `[BASE_SHA]` — 该任务开始前的提交
- `[HEAD_SHA]` — 当前提交
- `[DIFF_FILE]` — 必填，controller 写入 review package 的路径；`scripts/review-package BASE HEAD` 会打印唯一路径，package 不进入 controller 上下文

**Reviewer 返回：** Spec Compliance verdict（✅/❌/⚠️）、Strengths、Issues（Critical / Important / Minor）、Task quality verdict。

Fix dispatch 可以同时处理 spec gaps 和 quality findings；修复后的 re-review 会覆盖两个 verdict。
