---
name: superpowers-requesting-code-review
description: 在完成任务、实施主要功能或合并前验证工作是否符合要求时使用
---

# 请求代码评审

派发 `agents/superpowers-code-reviewer` subagent 在问题级联前捕获它们。

**核心原则：** 尽早审查，经常审查。

## 何时请求评审

**必须：**
- 在 subagent-driven development 的每个任务后
- 完成主要功能后
- 合并到主分支前

**可选但有价值：**
- 遇到困难时（获得新视角）
- 重构前（建立基准）
- 修复复杂缺陷后

## 如何请求

**1. 获取 git SHA：**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 派发 `agents/superpowers-code-reviewer` subagent：**

使用 Task 工具，选择 superpowers-code-reviewer 类型，填写 `skills/superpowers-requesting-code-review/code-reviewer.md` 中的模板。

**占位符：**
- `{WHAT_WAS_IMPLEMENTED}` - 您刚刚构建的内容
- `{PLAN_OR_REQUIREMENTS}` - 它应该做什么
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交
- `{DESCRIPTION}` - 简要摘要

**3. 根据反馈采取行动：**
- 立即修复严重问题
- 在继续之前修复重要问题
- 记录次要问题，稍后处理
- 如果审查者错误，提出反驳（附推理）

## 示例

```
[刚刚完成任务2：添加验证函数]

您：让我在继续之前请求代码审查。

BASE_SHA=$(git log --oneline | grep "任务1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[派发 agents/superpowers-code-reviewer subagent]
  WHAT_WAS_IMPLEMENTED: 对话索引的验证和修复函数
  PLAN_OR_REQUIREMENTS: docs/plans/deployment-plan.md 中的任务2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: 添加了 verifyIndex() 和 repairIndex()，包含 4 种问题类型

[Subagent 返回]：
  优势：架构清晰，测试真实
  问题：
    重要：缺少进度指示器
    次要：报告间隔的幻数（100）
  评估：准备继续

您：[修复进度指示器]
[继续到任务3]
```

## 与工作流的衔接

**Subagent-Driven Development：**
- 每个任务后都进行评审
- 在问题累积前捕获
- 修复后再进入下一个任务

**执行计划：**
- 每批（3 个任务）后进行审查
- 获取反馈，应用反馈，继续

**临时开发：**
- 合并前进行审查
- 遇到困难时进行审查

## 危险信号

**永远不要：**
- 因为"很简单"而跳过审查
- 忽略严重问题
- 在存在未修复的重要问题时继续
- 与有效的技术反馈进行争论

**如果审查者错误：**
- 用技术推理提出反驳
- 展示证明其有效的代码/测试
- 请求澄清

模板见：`skills/superpowers-requesting-code-review/code-reviewer.md`
