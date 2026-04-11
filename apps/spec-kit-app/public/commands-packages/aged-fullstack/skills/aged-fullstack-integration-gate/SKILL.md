---
name: aged-fullstack-integration-gate
description: 对齐前后端契约、错误结构与关键验证命令，在收尾前完成最小联调校验。
---

# 做 aged 全栈联调与关键校验

这个 skill 用于在收尾前做最小联调校验。

## 适用场景

- 前端 service 接后端接口
- 对齐错误结构
- 跑关键验证命令
- 检查模板自举链路

## 检查项

1. 后端 router 是否统一使用 `success_response()` 包裹返回值（格式 `{"data": ...}`）
2. 前端 interceptor 是否正确拆包 `{"data": ...}` 信封，service 层拿到的是否为业务数据
3. 错误结构是否稳定（`{"error": {"type": ..., "message": ...}}`）且能被前端 `normalizeApiError` 解析
4. 涉及模板起步时，是否补跑 `node ./scripts/verify-init-project.mjs`
5. 是否至少运行：
   - `pnpm test`
   - `pnpm build:web`
6. 涉及迁移时，是否运行 `pnpm db:migrate`

## 输出要求

- 明确指出已验证项
- 明确指出未验证项
- 若契约和实现不一致，先暴露冲突，不静默绕过
