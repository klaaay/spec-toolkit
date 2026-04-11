# Recommended Rules

本文档记录对 `aged-*` 项目推荐遵守的稳定规范，不要求模板外项目逐字照搬目录。

## 后端推荐规范

1. 优先采用 `module-first`
2. 默认路径优先是 `router.py -> service.py -> Session + ORM model`
3. 不要为了分层好看预先创建空 `repository.py`
4. `platform` 只放运行时基础设施，`shared` 只放轻量公共能力
5. 错误结构应稳定，不向客户端泄露原始 500 文本
6. router 返回值统一使用 `success_response(data)` 包裹，保持成功 `{"data": ...}` / 失败 `{"error": ...}` 的对称格式
7. 应用生命周期资源（如 Redis 连接）在 `lifespan.py` 中初始化和清理

## 前端推荐规范

1. 请求能力统一收口到 `service`
2. 不要额外并行创建新的 `lib` 请求入口
3. 默认采用统一的 `axios` client、拦截器和错误归一化
4. 页面与 hooks 只消费模块 service，不直接拼请求
5. 静态跨端元信息尽量单一来源
6. service 模块无需手动拆包 `{"data": ...}` 信封，interceptor 已自动处理

## 验证推荐规范

1. 起步项目时，优先补跑 `node ./scripts/verify-init-project.mjs`
2. 实现完成后，至少跑 `pnpm test`
3. 涉及前端交付时，补跑 `pnpm build:web`
4. 涉及迁移时，显式跑 `pnpm db:migrate`
