---
name: superpowers-requesting-code-review
description: 在完成任务、实施主要功能或合并前验证工作是否符合要求时使用
---

# 发起代码评审

派发 `superpowers-code-reviewer` 子代理，在问题级联扩散前尽早发现它们。评审者拿到的是你精确构造的上下文，而不是你整段会话历史；这样既能让评审聚焦于工作产物，也能保留你的上下文用于继续推进实现。

**核心原则：** 尽早审查，经常审查。

## 何时请求评审

**必须：**
- 在 subagent-driven development 的每个任务后
- 完成主要功能后
- 合并到主分支前

**可选但有价值：**
- 遇到困难时，获得新视角
- 重构前，先建立基准
- 修复复杂缺陷后

## 如何请求

**1. 获取 git SHA：**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 派发 `superpowers-code-reviewer` 子代理：**

使用任务工具，选择 `superpowers-code-reviewer` 类型，填写 `superpowers-requesting-code-review/code-reviewer.md` 中的模板。

**占位符：**
- `{WHAT_WAS_IMPLEMENTED}` - 您刚刚构建的内容
- `{PLAN_OR_REQUIREMENTS}` - 它应该做什么
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交
- `{DESCRIPTION}` - 简要摘要

**3. 根据反馈采取行动：**
- 立即修复严重问题
- 在继续前修复重要问题
- 次要问题可记录后稍后处理
- 如果评审者判断有误，用技术推理反驳

## 示例

```
[刚刚完成任务 2：添加验证函数]

您：继续前先请求一次代码审查。

BASE_SHA=$(git log --oneline | grep "任务 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[派发 superpowers-code-reviewer 子代理]
  WHAT_WAS_IMPLEMENTED: 对话索引的验证和修复函数
  PLAN_OR_REQUIREMENTS: docs/superpowers/plans/deployment-plan.md 中的任务 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661
  DESCRIPTION: 添加了 verifyIndex() 和 repairIndex()，包含 4 种问题类型

[子代理返回]：
  优势：架构清晰，测试真实
  问题：
    重要：缺少进度指示器
    次要：报告间隔里存在幻数（100）
  评估：可以继续

您：[修复进度指示器]
[继续到任务 3]
```

## 与工作流的衔接

**Subagent-Driven Development：**
- 每个任务结束后都做评审
- 在问题积累前就拦下来
- 修好后再进入下一个任务

**执行计划：**
- 在合适节点主动请求评审
- 拿到反馈后修正，再继续

**临时开发：**
- 合并前做评审
- 卡住时也可以做评审

## 危险信号

**永远不要：**
- 因为“很简单”而跳过审查
- 忽略严重问题
- 在重要问题未修复时继续推进
- 对有效的技术反馈硬拗

**如果审查者错误：**
- 用技术推理提出反驳
- 展示能证明其有效的代码或测试
- 请求澄清

模板见：`superpowers-requesting-code-review/code-reviewer.md`
