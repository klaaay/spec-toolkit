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

**代码审查者返回：** 优势、问题（严重/重要/轻微）、评估