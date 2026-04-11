---
name: aged-fullstack-bootstrap
description: 从 aged-fullstack-template 起步：init、环境准备、首次运行和自举验证。
---

# 从 aged-fullstack-template 起步

这个 skill 处理“如何正确从模板起项目”的问题。

## 适用场景

- 基于模板创建新的 `aged-*` 项目
- 检查模板派生链路是否还正常
- 首次准备依赖和运行环境

## 默认流程

1. 确认目标项目名符合 `aged-*`
2. 复制模板目录
3. 运行 `node ./scripts/init-project.mjs --name <project-name>`
4. 执行 `pnpm install`
5. 执行 `cd backend && uv sync`
6. 复制 `.env.example` 为 `.env`
7. 执行 `pnpm infra:up`
8. 执行 `pnpm db:migrate`
9. 执行 `node ./scripts/verify-init-project.mjs`
10. 需要联机验证时，再执行 `pnpm dev`

## 关键原则

- 初始化后优先跑自举验证，不直接假设模板可用
- 端口冲突时，优先在 `init-project` 阶段覆盖
- 模板脚本与 README 不一致时，以当前真实脚本为准
