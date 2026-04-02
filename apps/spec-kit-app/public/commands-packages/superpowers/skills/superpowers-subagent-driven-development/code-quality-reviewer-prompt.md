# 代码质量审查者提示模板

使用此模板来分派代码质量审查者子代理。

**目的：** 验证实现是否构建良好（干净、已测试、可维护）

**仅在规范合规性审查通过后才分派。**

```
任务工具 (superpowers-code-reviewer):
  使用 superpowers-requesting-code-review/code-reviewer.md 中的模板

  WHAT_WAS_IMPLEMENTED: [来自实现者的报告]
  PLAN_OR_REQUIREMENTS: 任务 N 来自 [计划文件]
  BASE_SHA: [任务前的提交]
  HEAD_SHA: [当前提交]
  DESCRIPTION: [任务摘要]
```

**除标准代码质量问题外，还应额外检查：**
- 每个文件是否只有一个清晰职责，并拥有明确接口？
- 各代码单元是否被拆到足够独立，便于理解和测试？
- 实现是否遵循了计划中约定的文件结构？
- 本次改动是否新建了已经过大的文件，或显著继续膨胀了现有文件？（只关注这次改动带来的增量，不追究历史包袱）

**代码审查者返回：** 优势、问题（Critical / Important / Minor）、评估
