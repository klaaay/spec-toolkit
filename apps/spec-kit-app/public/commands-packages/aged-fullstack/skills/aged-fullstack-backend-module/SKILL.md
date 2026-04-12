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

1. `router.py` 只处理 HTTP 层。资源路由命名保持 RESTful 语义，返回值统一用 `success_response()` 包裹。
2. HTTP 方法必须正确使用：查询走 `GET`，创建走 `POST`，更新走 `PUT/PATCH`，删除走 `DELETE`。
3. 状态码必须和结果语义一致，不能把业务错误统一返回 `200`。
4. `service.py` 是默认业务入口，承接事务、权限、领域校验和错误收口。
5. `schemas.py` 放请求/响应 DTO，不直接把 ORM 对象裸暴露给外部。
6. `models.py` 放 ORM model，字段、约束、索引与关系定义要完整。
7. `worker.py` 是后台任务扩展点，基线为 no-op。
8. `repository.py` 只在查询复杂或需要复用查询拼装时引入，不为分层而空建。
9. 查询默认走 ORM 或参数化表达式，禁止字符串拼接 SQL。
10. 列表接口必须显式考虑分页、排序白名单、筛选条件合法性和索引命中。
11. 关联查询要主动规避 N+1，按场景使用 `joinedload` 或 `selectinload`。
12. 涉及密码时，必须使用 `bcrypt` 或 `argon2` 加盐哈希，禁止明文、禁止 `MD5`。
13. 涉及认证与权限时，除角色判断外，还要校验资源归属。
14. 多表写操作必须放进事务，失败时回滚。
15. 必须接入全局异常处理，不把原始堆栈直接暴露给客户端。
16. `platform` 不承载业务代码。
17. `shared` 不成为业务逻辑回收站。

## 验证要求

- 相关 `pytest` 用例
- 列表接口验证分页边界、权限边界和错误状态码
- 涉及认证时，验证密码哈希、登录态和鉴权失败路径
- 涉及复杂查询时，检查是否存在明显 N+1
- 必要时 `pnpm db:migrate`
- 涉及模板本身时，保持 `example` 路径与 README 一致
