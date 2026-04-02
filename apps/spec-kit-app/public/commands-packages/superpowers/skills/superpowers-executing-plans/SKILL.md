---
name: superpowers-executing-plans
description: 当你有一个书面实施计划需要在当前或独立会话中线性执行时使用
---

# 执行计划

## 概览

加载计划，先做批判性审查，再逐任务执行，全部完成后再收尾。

**开始时宣布：** "我正在使用 `superpowers-executing-plans` skill 来实施此计划。"

**提示：** 如果当前平台支持子代理，那么 `superpowers` 在 `superpowers-subagent-driven-development` 模式下通常质量更高。只有在没有子代理，或者你明确要在当前会话直接线性执行时，再使用本 skill。

## 流程

### 第 0 步：准备隔离工作区

- **必需前置 skill：** `superpowers-using-git-worktrees`
- 在开始执行任务前，先准备好隔离 worktree
- 若当前已经在一个合适的 linked worktree 中，则可跳过新建

### 第 1 步：加载并审查计划
1. 阅读计划文件
2. 批判性审查，识别计划中的问题或疑虑
3. 若有疑虑，在开始前先向 human 伙伴提出
4. 若没有疑虑，创建 TodoWrite 并继续

### 第 2 步：执行任务

对于每个任务：
1. 标记为 in_progress
2. 严格按照每个步骤执行
3. 运行指定验证
4. 标记为 completed

### 第 3 步：完成开发

所有任务完成并验证后：
- 宣布："我正在使用 `superpowers-finishing-a-development-branch` skill 来完成这项工作。"
- **必需子 skill：** 使用 `superpowers-finishing-a-development-branch`
- 遵循该 skill 验证测试、呈现选项并执行选择

## 何时停止并寻求帮助

**在以下情况立即停止执行：**
- 遇到障碍（缺少依赖项、测试失败、指令不清楚）
- 计划存在关键缺陷，导致无法开始
- 你不理解某个指令
- 验证反复失败

**遇阻时应寻求澄清，而不是猜测。**

## 何时重新回到审查步骤

**在以下情况回到第 1 步重新审查计划：**
- human 伙伴根据你的反馈更新了计划
- 你发现基础实现方向需要重想

**不要硬闯障碍。** 停下并提问。

## 记住
- 执行前先确认 worktree 已就绪
- 开始前先批判性审查计划
- 严格按照计划步骤执行
- 不要跳过验证
- 当计划要求引用 skill 时就引用
- 遇到障碍时停止，不要猜测
- 未经用户明确同意，不要在 `main` / `master` 上直接开始实现
