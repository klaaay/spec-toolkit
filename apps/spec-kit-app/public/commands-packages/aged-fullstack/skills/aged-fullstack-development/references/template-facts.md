# Template Facts

本文档只记录 `aged-fullstack-template` 当前已经存在的事实，不写抽象建议。

## 当前目录事实

- 后端目录：`backend/app/bootstrap`、`backend/app/modules`、`backend/app/platform`、`backend/app/shared`
- 前端目录：`frontend/src/components`、`frontend/src/hooks`、`frontend/src/pages`、`frontend/src/service`
- 共享元信息：`libs/template-meta`

## 当前后端事实

- 默认按 `modules/<name>` 组织业务代码
- `example` 模块当前默认路径为 `router.py -> service.py -> Session + ORM model`
- `repository.py` 当前不是模板默认必备层
- 数据库相关基础设施位于 `backend/app/platform/db`
- 迁移命令为 `pnpm db:migrate`
- 所有 router 使用 `success_response()` 包裹返回值，统一格式为 `{"data": <payload>}`；错误格式为 `{"error": {"type": ..., "message": ...}}`
- `backend/app/bootstrap/lifespan.py` 负责应用生命周期管理，启动时初始化 Redis `cache_client`，退出时关闭连接
- `backend/app/modules/<name>/worker.py` 是后台任务扩展点，基线模板中为 no-op + logging

## 当前前端事实

- 请求能力统一收口到 `frontend/src/service`
- `frontend/src/service/core/client.ts` 使用 `axios`
- `frontend/src/service/core/interceptors.ts` 负责请求与响应拦截，response interceptor 自动拆包 `{"data": ...}` 信封，service 层直接拿到业务数据
- `frontend/src/service/core/errors.ts` 负责错误归一化，从 `{"error": ...}` 结构中提取错误信息
- 静态模板元信息由 `@aged-template/meta` 提供

## 当前模板脚本事实

- 初始化脚本：`scripts/init-project.mjs`，替换范围覆盖配置文件、前端源码（含 `ExamplePage.tsx`）、后端配置和 CI 脚本
- 自举验证脚本：`scripts/verify-init-project.mjs`，验证设置替换和包名作用域替换是否成功
- 全量测试：`pnpm test`
- 前端构建：`pnpm build:web`
