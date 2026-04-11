---
name: aged-fullstack-frontend-feature
description: 按 aged 前端默认路径实现功能：service、axios、interceptors、hooks、pages 与 components。
---

# 按 aged 默认路径实现前端功能

这个 skill 用于在 `aged-*` 项目里按统一方式实现前端功能。

## 默认实现路径

1. 请求能力统一收口到 `service`
2. `service/core/client.ts` 负责 axios client
3. `service/core/interceptors.ts` 负责拦截器，自动拆包后端 `{"data": ...}` 信封，service 方法直接拿到业务数据
4. `service/core/errors.ts` 负责统一错误结构，从后端 `{"error": ...}` 中提取
5. `service/modules/*` 负责模块 API
6. hooks、pages、components 只消费模块 service

## 实施规则

- 不新增平行的 `lib` 请求入口
- 不让页面直接拼接请求
- 静态元信息优先来自共享来源，例如 `libs/template-meta`
- 错误结构优先统一后再向页面暴露

## 验证要求

- 前端相关单测
- `pnpm test`
- `pnpm build:web`
