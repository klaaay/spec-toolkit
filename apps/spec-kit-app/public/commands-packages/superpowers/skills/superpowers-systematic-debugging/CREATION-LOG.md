# 创建记录：Systematic Debugging

这份文档记录该 skill 的目的与设计意图，供后续维护参考。

## 核心目标

把“先猜一个修法试试”这类高频低效行为，替换为可重复执行的四阶段调试流程：

1. 根因调查
2. 模式分析
3. 假设与实验
4. 实现与验证

## 为什么需要它

多数调试浪费都来自：
- 没读完错误信息
- 没稳定复现
- 同时改多个地方
- 第一个补丁失败后继续叠补丁
- 明明没理解，却提前给方案

## 这份 skill 想抵抗什么

- 时间压力下的“先修一下再说”
- 精疲力尽时的“差不多能过就行”
- 权威压力下的“别人说这样修，那就这么修”
- 连续失败后的“再试最后一次”

## 配套材料

- `root-cause-tracing.md`
- `defense-in-depth.md`
- `condition-based-waiting.md`
- `test-academic.md`
- `test-pressure-1.md`
- `test-pressure-2.md`
- `test-pressure-3.md`
