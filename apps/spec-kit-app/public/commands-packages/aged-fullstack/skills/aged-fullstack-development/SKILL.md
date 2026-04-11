---
name: aged-fullstack-development
description: aged-* 项目的全栈开发主入口。识别当前任务属于起步、后端、前端还是联调，并将任务导向正确的 aged skill。
---

# 选择正确的 aged 全栈 skill

这个 skill 只做领域分流，不接管总流程。

## 前置关系

- 如果需求和方案仍未定稿，先使用 `superpowers-brainstorming`
- 如果实施计划还未写好，先使用 `superpowers-writing-plans`
- 只有在任务已经进入明确执行阶段时，才进入本包

## 必读参考

1. 先读 `references/template-facts.md`
2. 再读 `references/recommended-rules.md`
3. 明确哪些是模板事实，哪些是 aged 推荐规范

## 分流规则

- 从模板起一个新项目、检查初始化链路、准备环境：
  使用 `aged-fullstack-bootstrap`
- 新增或修改 FastAPI 模块、处理 ORM、Session、migration：
  使用 `aged-fullstack-backend-module`
- 新增或修改前端页面、hooks、service、axios、错误结构：
  使用 `aged-fullstack-frontend-feature`
- 做接口接入、联调、关键验证、自举校验：
  使用 `aged-fullstack-integration-gate`

## 关键原则

- 不自己接管 brainstorming、planning、finish 流程
- 不把模板事实和推荐规范混成一句话
- 如果任务跨多个场景，先说明主次，再选择第一个进入的 skill
