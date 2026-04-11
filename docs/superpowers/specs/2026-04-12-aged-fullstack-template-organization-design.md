# Aged Fullstack Template 组织整改设计

**目标**

收敛 `aged-fullstack-template` 的默认开发路径，让模板本身能稳定表达“在该框架内做日常全栈开发”的推荐方式。此次整改只修改模板，不同时产出新的 `aged-` skill 包。

**当前问题**

1. 后端数据库路径不一致。`platform/db`、Alembic 和 migration 在表达真实数据库开发，但 `example` 模块仍使用 dataclass 和内存假数据。
2. `init:project` 与当前目录结构失配。脚本仍引用旧路径，说明模板自举链路没有跟上结构演进。
3. 前端请求分层不清。`lib`、`service`、Context 和 `template-meta` 的职责重叠，默认示例无法清楚表达“请求能力应该放哪里”。
4. 模板默认错误处理过于宽松。后端 500 错误直接返回原始异常文本，不适合作为生产基线。

## 设计结论

### 1. 后端继续按 module 组织

后端的大方向保持不变，仍以 `modules/<name>` 作为第一组织单位。保留现有顶层结构：

- `bootstrap`：应用装配、路由注册、生命周期、异常处理入口
- `platform`：配置、数据库、运行时基础设施
- `shared`：真正跨模块复用的轻量公共能力
- `modules`：业务模块

默认模块结构调整为：

```text
modules/<name>/
  router.py
  service.py
  schemas.py
  models.py
  repository.py   # optional
```

`repository.py` 不再是默认强制层。只有在查询逻辑复杂、多个 service 需要复用同一批查询，或需要将查询拼装从业务编排中拆开时，才引入 `repository.py`。

### 2. 后端默认黄金路径

模板用 `example` 模块表达下面这条默认路径：

`router.py -> service.py -> Session + ORM model`

具体规则：

1. `router.py` 只负责 HTTP 层入参、出参与调用 service。
2. `service.py` 是模块内的默认业务入口，负责组织简单查询、编排业务逻辑、转换响应 DTO。
3. `models.py` 放真实 SQLAlchemy ORM 模型，不再放 dataclass 式假模型。
4. `schemas.py` 放 Pydantic 请求/响应模型，并与 ORM 模型保持职责分离。
5. 数据库 Session 通过 FastAPI dependency 以 request scope 提供。
6. Alembic migration、`Base.metadata`、`model_registry` 与真实 ORM 模型保持一致。

### 3. 前端请求能力统一收口到 service

删除 `frontend/src/lib`，不再保留额外的请求入口。前端默认组织改为：

```text
service/
  core/
    client.ts
    interceptors.ts
    errors.ts
  modules/
    example.ts
    health.ts
```

具体规则：

1. `service/core/client.ts` 负责创建 `axios` instance。
2. `service/core/interceptors.ts` 负责请求、响应拦截器。
3. `service/core/errors.ts` 负责把服务端错误、网络错误、超时和未知错误转换成统一错误结构。
4. `service/modules/*.ts` 只负责模块 API，不重复处理通用错误逻辑。
5. 页面、hooks 只消费模块 service，不直接拼接请求。

### 4. 模板静态元信息使用单一来源

像项目名、显示名、模板描述这类静态元信息，统一由 `libs/template-meta` 提供。前端页面直接消费这份共享元信息，不再通过 `ExampleContext` 这类仅承载静态文案的 React Context 再复制一份。

Context 的使用边界收紧为：只有确实存在跨组件共享的动态状态时，才引入 Context。

### 5. init:project 必须对齐真实结构

`scripts/init-project.mjs` 必须只操作当前真实存在的文件，并覆盖这些场景：

1. 根项目名、包名、workspace scope 替换
2. `.env.example` 中的项目名、端口、数据库连接替换
3. `backend/app/platform/config/settings.py` 中默认配置替换
4. CI、镜像、Compose、前端包名等衍生标识替换

初始化脚本不允许继续依赖已删除的旧路径。

## 架构与数据流

### 后端数据流

1. FastAPI 路由通过 dependency 获取 DB Session
2. 路由调用模块 service
3. service 直接使用 ORM model 和 Session 执行简单查询
4. service 将 ORM 结果转换成 `schemas.py` 定义的响应 DTO
5. 复杂查询场景才向下拆分 `repository.py`

### 前端数据流

1. 页面或 hook 调用 `service/modules/*`
2. 模块 service 使用统一的 axios client 发起请求
3. 拦截器处理通用 header 注入、响应错误解析和错误归一化
4. 页面只处理稳定的业务结果和统一错误对象

## 错误处理

### 后端

1. 保留统一异常处理入口。
2. `AppError` 仍用于业务型错误。
3. 默认 500 响应返回稳定错误结构，不直接暴露原始异常文本。
4. 为日志或监控接入保留扩展位，但模板不预置具体监控产品。

### 前端

1. axios 响应拦截器统一解析后端错误结构。
2. 网络错误、超时和未知错误统一归一化。
3. 模板不预置具体鉴权逻辑，但在请求拦截器中预留 header 注入扩展点。

## 测试策略

### 后端

1. 更新现有 contract tests，使其覆盖真实 ORM 示例返回。
2. 更新 service tests，使其反映“默认由 service 直接使用 Session”的路径。
3. 补充配置与初始化相关测试，确保默认配置仍可加载。

### 前端

1. 删除或改写依赖 `src/lib` 的测试。
2. 为 `service/core` 的 axios client、拦截器、错误归一化增加单测。
3. 更新页面测试，确保页面继续通过模块 service 渲染。

### 模板自举验证

至少补一条最小验证，证明 `pnpm init:project --name aged-demo` 后，关键文件中的项目名、端口和配置路径替换正确。

## 范围边界

本次整改包含：

1. 模板结构与示例代码调整
2. README 和模板说明同步
3. 初始化脚本修正
4. 必要测试更新

本次整改不包含：

1. 新的 `aged-` 全栈 skill 包
2. 业务鉴权、用户体系、文件上传等非模板基线能力
3. 对现有模板之外的下游项目做迁移

## 决策摘要

1. 后端继续以 module 为第一组织单位，不改方向。
2. 后端示例改为真实 ORM + request-scoped Session 路径。
3. `repository.py` 改为可选层，通过默认示例和文档共同体现。
4. 前端删除 `src/lib`，请求能力统一收口到 `service`。
5. 前端统一使用 `axios`，并在 `client` 中提供推荐拦截器逻辑。
6. 模板静态元信息统一收口到 `libs/template-meta`。
7. `init:project` 与真实目录结构重新对齐。
