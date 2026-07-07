---
name: superpowers-requesting-code-review
description: 在完成任务、实施主要功能或合并前验证工作是否符合要求时使用
---

# 发起代码评审

分派 code reviewer 子代理，在问题级联扩散前尽早发现它们。Reviewer 拿到的是你精确构造的上下文，而不是你整段会话历史；这样既能让 review 聚焦于工作产物，也能保留你的主上下文用于继续推进。

**核心原则：** 尽早审查，经常审查。

## 何时请求 Review

**必须：**
- subagent-driven development 的每个任务后
- 完成主要功能后
- 合并到主分支前

**可选但有价值：**
- 卡住时，获得新视角
- 重构前，先建立基准
- 修复复杂 bug 后

## 如何请求

**1. 获取 git SHA：**

```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. 分派 code reviewer 子代理：**

分派 `general-purpose` 子代理，并填写 [code-reviewer.md](code-reviewer.md) 模板。

**占位符：**
- `{DESCRIPTION}` - 简要说明刚完成的内容
- `{PLAN_OR_REQUIREMENTS}` - 它应该满足什么要求
- `{BASE_SHA}` - 起始提交
- `{HEAD_SHA}` - 结束提交

**3. 根据反馈行动：**
- 立即修复 Critical issues
- 继续前修复 Important issues
- 记录 Minor issues，稍后处理
- 如果 reviewer 判断错误，用技术推理反驳

## 示例

```text
[刚完成任务 2：添加验证函数]

你：继续前先请求一次 code review。

BASE_SHA=$(git log --oneline | grep "Task 1" | head -1 | awk '{print $1}')
HEAD_SHA=$(git rev-parse HEAD)

[分派 code reviewer 子代理]
  DESCRIPTION: 添加 verifyIndex() 和 repairIndex()，覆盖 4 种问题类型
  PLAN_OR_REQUIREMENTS: docs/superpowers/plans/deployment-plan.md 中的任务 2
  BASE_SHA: a7981ec
  HEAD_SHA: 3df7661

[子代理返回]：
  Strengths: 架构清晰，测试验证真实行为
  Issues:
    Important: 缺少进度指示器
    Minor: report interval 使用 magic number (100)
  Assessment: 可以继续

你：[修复进度指示器]
[继续任务 3]
```

## 与工作流的衔接

**Subagent-Driven Development：**
- 每个任务结束后 review
- 在问题累积前拦截
- 修复后再进入下一个任务

**Executing Plans：**
- 每个任务后或自然检查点做 review
- 拿到反馈，修正后继续

**临时开发：**
- 合并前 review
- 卡住时也可以 review

## 红旗

**绝不要：**
- 因为“很简单”跳过 review
- 忽略 Critical issues
- 在 Important issues 未修复时继续
- 对有效技术反馈硬拗

**如果 reviewer 错了：**
- 用技术推理反驳
- 展示能证明实现有效的代码或测试
- 请求澄清

模板见：[code-reviewer.md](code-reviewer.md)
