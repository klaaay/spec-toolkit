---
name: aged-fullstack-backend-module
description: 按 module-first 方式实现 FastAPI 后端模块，默认走 router、service、Session 与 ORM model 路径。
---

# 按 aged 默认路径实现后端模块

这个 skill 用于在 `aged-*` 项目里按统一方式实现或修改 FastAPI 模块。

## 默认模块结构

```text
modules/<name>/
├─ router.py
├─ service.py
├─ schemas.py
├─ models.py
└─ repository.py   # optional
```

## 默认实现路径

`router.py -> service.py -> Session + ORM model`

## 实施规则

1. `router.py` 只处理 HTTP 层，返回值统一用 `success_response()` 包裹：`return success_response({"items": ...})`
2. `service.py` 是默认业务入口
3. `schemas.py` 放请求/响应 DTO
4. `models.py` 放 ORM model
5. `worker.py` 是后台任务扩展点，基线为 no-op
6. `repository.py` 只在查询复杂或需要复用查询拼装时引入
7. `platform` 不承载业务代码
8. `shared` 不成为业务逻辑回收站

## 验证要求

- 相关 `pytest` 用例
- 必要时 `pnpm db:migrate`
- 涉及模板本身时，保持 `example` 路径与 README 一致
