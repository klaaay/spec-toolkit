# Aged Fullstack Template 组织整改实现计划

> **对于 agent 型执行者：** 必需子 skill：优先使用 `superpowers-subagent-driven-development`，否则使用 `superpowers-executing-plans` 逐任务实施本计划。所有步骤使用 `- [ ]` 复选框格式追踪。

**目标：** 修正 `aged-fullstack-template` 的默认开发路径，让后端明确采用 module-first + ORM + request-scoped Session，前端明确采用 `service + axios + interceptors`，并让初始化脚本与模板真实结构重新对齐。

**架构：** 后端继续以 `modules/<name>` 为第一组织单位，`example` 模块改为真实 SQLAlchemy ORM 示例，默认由 `service.py` 直接使用 Session，不再把 `repository.py` 作为强制层。前端删除 `src/lib`，请求能力全部收口到 `src/service`，用统一的 axios client、拦截器和错误归一化逻辑承接页面与 hooks。最后同步更新 README、初始化脚本和相关测试，确保模板说明、自举链路和代码示例一致。

**技术栈：** FastAPI、SQLAlchemy 2.x、Alembic、pytest、React 19、Vite、Vitest、axios、pnpm、Node.js

---

## 文件结构与职责

### 后端

- 修改：`aged-fullstack-template/backend/app/modules/example/models.py`
  - 将 dataclass 改为 SQLAlchemy ORM model，并与 migration 对齐。
- 删除：`aged-fullstack-template/backend/app/modules/example/repository.py`
  - 移除默认示例中的 repository，避免误导为强制层。
- 修改：`aged-fullstack-template/backend/app/modules/example/service.py`
  - 让 `service.py` 直接接收 `Session` 并执行简单查询。
- 修改：`aged-fullstack-template/backend/app/modules/example/router.py`
  - 通过 FastAPI dependency 获取 request-scoped Session。
- 修改：`aged-fullstack-template/backend/app/modules/example/schemas.py`
  - 提供 `from_attributes` 的响应 DTO。
- 修改：`aged-fullstack-template/backend/app/platform/db/session.py`
  - 补齐 `get_db()` dependency。
- 修改：`aged-fullstack-template/backend/app/platform/db/__init__.py`
  - 导出 `get_db`。
- 修改：`aged-fullstack-template/backend/app/platform/db/model_registry.py`
  - 注册真实 ORM model。
- 修改：`aged-fullstack-template/backend/app/shared/errors/handlers.py`
  - 保持统一错误结构，但 500 不暴露原始异常文本。
- 新建：`aged-fullstack-template/backend/tests/conftest.py`
  - 用 SQLite 内存库提供测试期 `get_db` override，避免 contract test 依赖本机 PostgreSQL。
- 修改：`aged-fullstack-template/backend/tests/contracts/test_example.py`
- 修改：`aged-fullstack-template/backend/tests/services/test_example_service.py`
- 删除：`aged-fullstack-template/backend/tests/services/test_example_repository.py`
  - 后端测试跟随新的默认黄金路径。

### 前端

- 修改：`aged-fullstack-template/frontend/package.json`
  - 增加 `axios` 依赖。
- 删除：`aged-fullstack-template/frontend/src/lib/api.ts`
- 删除：`aged-fullstack-template/frontend/src/lib/api.test.ts`
- 删除：`aged-fullstack-template/frontend/src/lib/env.ts`
- 删除：`aged-fullstack-template/frontend/src/contexts/ExampleContext.tsx`
- 新建：`aged-fullstack-template/frontend/src/service/core/interceptors.ts`
  - 注册 axios 请求、响应拦截器。
- 修改：`aged-fullstack-template/frontend/src/service/core/client.ts`
  - 创建统一 axios client。
- 修改：`aged-fullstack-template/frontend/src/service/core/errors.ts`
  - 定义统一错误对象与错误归一化逻辑。
- 修改：`aged-fullstack-template/frontend/src/service/modules/example.ts`
- 修改：`aged-fullstack-template/frontend/src/service/modules/health.ts`
  - 全部改为基于统一 axios client 的模块 API。
- 新建：`aged-fullstack-template/frontend/src/service/core/client.test.ts`
- 新建：`aged-fullstack-template/frontend/src/service/core/errors.test.ts`
  - 为 client 和错误归一化增加单测。
- 修改：`aged-fullstack-template/frontend/src/hooks/use-example-state.ts`
  - 页面状态只消费模块 service 与统一错误对象。
- 修改：`aged-fullstack-template/frontend/src/pages/ExamplePage.tsx`
- 修改：`aged-fullstack-template/frontend/src/App.tsx`
- 修改：`aged-fullstack-template/frontend/src/App.test.tsx`
  - 删除 Context 依赖，直接消费模板元信息。

### 共享与文档

- 修改：`aged-fullstack-template/libs/template-meta/src/index.ts`
  - 提供项目名、显示名、模板描述等静态元信息。
- 修改：`aged-fullstack-template/scripts/init-project.mjs`
  - 对齐 `backend/app/platform/config/settings.py` 等真实路径。
- 修改：`aged-fullstack-template/README.md`
  - 写清楚后端 module-first、可选 repository、前端 `service + axios` 的新黄金路径。

---

### 任务 1: 把后端示例收敛到真实 ORM + request-scoped Session

**文件：**
- 修改：`aged-fullstack-template/backend/app/modules/example/models.py`
- 删除：`aged-fullstack-template/backend/app/modules/example/repository.py`
- 修改：`aged-fullstack-template/backend/app/modules/example/service.py`
- 修改：`aged-fullstack-template/backend/app/modules/example/router.py`
- 修改：`aged-fullstack-template/backend/app/modules/example/schemas.py`
- 修改：`aged-fullstack-template/backend/app/platform/db/session.py`
- 修改：`aged-fullstack-template/backend/app/platform/db/__init__.py`
- 修改：`aged-fullstack-template/backend/app/platform/db/model_registry.py`
- 新建：`aged-fullstack-template/backend/tests/conftest.py`
- 修改：`aged-fullstack-template/backend/tests/bootstrap/test_app_factory.py`
- 测试：`aged-fullstack-template/backend/tests/contracts/test_example.py`
- 测试：`aged-fullstack-template/backend/tests/services/test_example_service.py`
- 删除：`aged-fullstack-template/backend/tests/services/test_example_repository.py`

- [ ] **步骤 1: 先改测试，锁定后端新的默认黄金路径**

把 `aged-fullstack-template/backend/tests/services/test_example_service.py` 改成直接验证 service 接收 `Session` 并从真实 ORM model 转换 DTO：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.modules.example.models import ExampleItemModel
from app.modules.example.service import list_example_items
from app.platform.db.base import Base


def test_list_example_items_reads_from_database() -> None:
    engine = create_engine("sqlite+pysqlite:///:memory:", future=True)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    with TestingSessionLocal() as session:
        session.add_all(
            [
                ExampleItemModel(id="hello", label="Hello template"),
                ExampleItemModel(id="customize", label="Customize me"),
            ]
        )
        session.commit()

    with TestingSessionLocal() as session:
        result = list_example_items(session)

    assert result == [
        {"id": "customize", "label": "Customize me"},
        {"id": "hello", "label": "Hello template"},
    ]
```

把 `aged-fullstack-template/backend/tests/contracts/test_example.py` 保持响应契约不变，但测试名改成强调“从数据库返回模板数据”：

```python
def test_example_route_returns_database_items(client) -> None:
    response = client.get("/api/example")

    assert response.status_code == 200
    assert response.json() == {
        "items": [
            {"id": "customize", "label": "Customize me"},
            {"id": "hello", "label": "Hello template"},
        ]
    }
```

创建 `aged-fullstack-template/backend/tests/conftest.py`，在测试期统一把 `get_db` override 到内存 SQLite，并写入示例数据：

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.modules.example.models import ExampleItemModel
from app.platform.db import get_db
from app.platform.db.base import Base


@pytest.fixture
def client() -> TestClient:
    engine = create_engine(
        "sqlite+pysqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        class_=Session,
    )
    Base.metadata.create_all(bind=engine)

    with TestingSessionLocal() as session:
        session.add_all(
            [
                ExampleItemModel(id="hello", label="Hello template"),
                ExampleItemModel(id="customize", label="Customize me"),
            ]
        )
        session.commit()

    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
```

将 `aged-fullstack-template/backend/tests/bootstrap/test_app_factory.py` 改为只验证路由已注册，不强行打到真实数据库：

```python
from app.bootstrap.app import create_app


def test_create_app_registers_template_routes() -> None:
    app = create_app()
    routes = {route.path for route in app.routes}

    assert "/api/health" in routes
    assert "/api/example" in routes
```

删除 `aged-fullstack-template/backend/tests/services/test_example_repository.py`，因为默认示例不再保留 repository 层。

- [ ] **步骤 2: 运行后端相关测试，确认当前实现红灯**

运行：

```bash
cd aged-fullstack-template/backend
uv run pytest tests/services/test_example_service.py tests/contracts/test_example.py -q
```

预期：
- `test_example_service.py` 失败
- 失败点会体现 `list_example_items()` 目前不接收 `Session`，或 `ExampleItemModel` 尚不存在

- [ ] **步骤 3: 把 example module 改成真实 ORM 示例**

将 `aged-fullstack-template/backend/app/modules/example/models.py` 改为：

```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.platform.db.base import Base


class ExampleItemModel(Base):
    __tablename__ = "example_items"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
```

将 `aged-fullstack-template/backend/app/modules/example/schemas.py` 改为：

```python
from pydantic import BaseModel, ConfigDict


class ExampleItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    label: str


class ExampleListResponse(BaseModel):
    items: list[ExampleItem]
```

将 `aged-fullstack-template/backend/app/modules/example/service.py` 改为：

```python
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.example.models import ExampleItemModel
from app.modules.example.schemas import ExampleItem


def list_example_items(session: Session) -> list[dict[str, str]]:
    records = session.scalars(
        select(ExampleItemModel).order_by(ExampleItemModel.id.asc())
    ).all()
    return [ExampleItem.model_validate(record).model_dump() for record in records]
```

将 `aged-fullstack-template/backend/app/modules/example/router.py` 改为：

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.modules.example.service import list_example_items
from app.platform.db import get_db

router = APIRouter()


@router.get("/example")
def get_example_items(session: Session = Depends(get_db)) -> dict[str, list[dict[str, str]]]:
    return {"items": list_example_items(session)}
```

将 `aged-fullstack-template/backend/app/platform/db/session.py` 改为：

```python
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.platform.config.settings import settings


engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)


def get_db() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
```

将 `aged-fullstack-template/backend/app/platform/db/__init__.py` 改为：

```python
from app.platform.db.base import Base
from app.platform.db.session import SessionLocal, engine, get_db

__all__ = ["Base", "SessionLocal", "engine", "get_db"]
```

将 `aged-fullstack-template/backend/app/platform/db/model_registry.py` 改为：

```python
from app.modules.example.models import ExampleItemModel

__all__ = ["ExampleItemModel"]
```

删除文件 `aged-fullstack-template/backend/app/modules/example/repository.py`。

- [ ] **步骤 4: 让 contract test 通过测试夹具拿到真实数据**

合同测试通过 `aged-fullstack-template/backend/tests/conftest.py` 中的 SQLite fixture 获得稳定数据，不让测试依赖本机 PostgreSQL。模板运行时仍由 migration 建表，不在 `lifespan.py` 中做隐式建表。

此时额外检查 `aged-fullstack-template/backend/app/bootstrap/lifespan.py`，保持它仍然是最小生命周期入口：

```python
from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
```

- [ ] **步骤 5: 运行后端测试验证绿灯**

运行：

```bash
cd aged-fullstack-template/backend
uv run pytest tests/bootstrap/test_app_factory.py tests/contracts/test_example.py tests/contracts/test_health.py tests/services/test_example_service.py tests/services/test_config.py -q
```

预期：
- 所有测试通过
- 输出末尾显示 `5 passed`

---

### 任务 2: 收紧后端错误处理，不向客户端暴露原始 500 文本

**文件：**
- 修改：`aged-fullstack-template/backend/app/shared/errors/handlers.py`
- 测试：`aged-fullstack-template/backend/tests/contracts/test_health.py`

- [ ] **步骤 1: 先补一个稳定 500 错误结构测试**

在 `aged-fullstack-template/backend/tests/contracts/test_health.py` 末尾追加：

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.shared.errors.handlers import install_error_handlers


def test_unexpected_error_uses_stable_internal_error_payload() -> None:
    app = FastAPI()
    install_error_handlers(app)

    @app.get("/boom")
    def boom() -> dict[str, str]:
        raise RuntimeError("secret stack detail")

    client = TestClient(app, raise_server_exceptions=False)

    response = client.get("/boom")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "type": "internal_error",
            "message": "internal server error",
        }
    }
```

- [ ] **步骤 2: 运行该测试，确认当前实现红灯**

运行：

```bash
cd aged-fullstack-template/backend
uv run pytest tests/contracts/test_health.py::test_unexpected_error_uses_stable_internal_error_payload -q
```

预期：
- 测试失败
- 当前返回值里还包含 `"secret stack detail"`

- [ ] **步骤 3: 修改全局异常处理**

将 `aged-fullstack-template/backend/app/shared/errors/handlers.py` 改为：

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.shared.errors.exceptions import AppError


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"type": exc.error_type, "message": exc.message}},
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        # 这里保留日志扩展位，但不把内部异常直接返回给客户端。
        _ = exc
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "type": "internal_error",
                    "message": "internal server error",
                }
            },
        )
```

- [ ] **步骤 4: 运行该测试验证通过**

运行：

```bash
cd aged-fullstack-template/backend
uv run pytest tests/contracts/test_health.py::test_unexpected_error_uses_stable_internal_error_payload -q
```

预期：
- 输出显示 `1 passed`

---

### 任务 3: 删除前端 lib，统一改为 service + axios + interceptors

**文件：**
- 修改：`aged-fullstack-template/frontend/package.json`
- 删除：`aged-fullstack-template/frontend/src/lib/api.ts`
- 删除：`aged-fullstack-template/frontend/src/lib/api.test.ts`
- 删除：`aged-fullstack-template/frontend/src/lib/env.ts`
- 修改：`aged-fullstack-template/frontend/src/service/core/client.ts`
- 新建：`aged-fullstack-template/frontend/src/service/core/interceptors.ts`
- 修改：`aged-fullstack-template/frontend/src/service/core/errors.ts`
- 新建：`aged-fullstack-template/frontend/src/service/core/client.test.ts`
- 新建：`aged-fullstack-template/frontend/src/service/core/errors.test.ts`
- 修改：`aged-fullstack-template/frontend/src/service/modules/example.ts`
- 修改：`aged-fullstack-template/frontend/src/service/modules/health.ts`

- [ ] **步骤 1: 先写前端 service 层失败测试**

创建 `aged-fullstack-template/frontend/src/service/core/errors.test.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { AxiosError } from 'axios'

import { normalizeApiError } from './errors'

describe('normalizeApiError', () => {
  it('对已经归一化的错误保持原样返回', () => {
    expect(
      normalizeApiError({
        type: 'internal_error',
        message: 'internal server error',
        status: 500
      })
    ).toEqual({
      type: 'internal_error',
      message: 'internal server error',
      status: 500
    })
  })

  it('把后端错误结构转换成统一错误对象', () => {
    const error = new AxiosError('Request failed with status code 500')
    error.response = {
      data: {
        error: {
          type: 'internal_error',
          message: 'internal server error'
        }
      },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as never
    }

    expect(normalizeApiError(error)).toEqual({
      type: 'internal_error',
      message: 'internal server error',
      status: 500
    })
  })
})
```

创建 `aged-fullstack-template/frontend/src/service/core/client.test.ts`：

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')

  return {
    ...actual,
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      }))
    }
  }
})

describe('createApiClient', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('使用 VITE_API_BASE_URL 创建 axios client 并注册拦截器', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/api')

    const { apiClient } = await import('./client')
    const axios = (await import('axios')).default

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api',
      timeout: 10000
    })
    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(1)
    expect(apiClient.interceptors.response.use).toHaveBeenCalledTimes(1)
  })
})
```

保留并改写 `aged-fullstack-template/frontend/src/service/modules/example.test.ts`：

```ts
import { describe, expect, it, vi } from 'vitest'

vi.mock('../core/client', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({
      data: {
        items: [
          { id: 'hello', label: 'Hello template' },
          { id: 'customize', label: 'Customize me' }
        ]
      }
    })
  }
}))

import { getExampleItems } from './example'

describe('getExampleItems', () => {
  it('从 example 模块返回列表数据', async () => {
    const result = await getExampleItems()

    expect(result).toEqual([
      { id: 'hello', label: 'Hello template' },
      { id: 'customize', label: 'Customize me' }
    ])
  })
})
```

- [ ] **步骤 2: 运行前端相关测试，确认当前实现红灯**

运行：

```bash
cd aged-fullstack-template/frontend
pnpm vitest run src/service/core/errors.test.ts src/service/core/client.test.ts src/service/modules/example.test.ts
```

预期：
- 新增测试失败
- 失败点会体现 `axios` 尚未安装、`normalizeApiError` 尚不存在，或 `apiClient` 尚未创建

- [ ] **步骤 3: 引入 axios 并实现统一 client**

将 `aged-fullstack-template/frontend/package.json` 的 `dependencies` 改为：

```json
{
  "dependencies": {
    "@aged-template/meta": "workspace:*",
    "axios": "^1.9.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

新建 `aged-fullstack-template/frontend/src/service/core/interceptors.ts`：

```ts
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { normalizeApiError } from './errors'

function attachDefaultHeaders(config: InternalAxiosRequestConfig) {
  config.headers.set('Accept', 'application/json')
  return config
}

export function installInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => attachDefaultHeaders(config))
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeApiError(error))
  )
}
```

将 `aged-fullstack-template/frontend/src/service/core/errors.ts` 改为：

```ts
import { AxiosError } from 'axios'

export type ApiError = {
  type: string
  message: string
  status: number | null
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'status' in error
  )
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof AxiosError) {
    const payload = error.response?.data as
      | { error?: { type?: string; message?: string } }
      | undefined

    return {
      type: payload?.error?.type ?? 'network_error',
      message: payload?.error?.message ?? error.message,
      status: error.response?.status ?? null
    }
  }

  if (error instanceof Error) {
    return {
      type: 'unknown_error',
      message: error.message,
      status: null
    }
  }

  return {
    type: 'unknown_error',
    message: 'unknown error',
    status: null
  }
}
```

将 `aged-fullstack-template/frontend/src/service/core/client.ts` 改为：

```ts
import axios from 'axios'

import { installInterceptors } from './interceptors'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000
})

installInterceptors(apiClient)
```

将 `aged-fullstack-template/frontend/src/service/modules/example.ts` 改为：

```ts
import { apiClient } from '../core/client'

type ExampleItem = {
  id: string
  label: string
}

type ExampleResponse = {
  items: ExampleItem[]
}

export async function getExampleItems() {
  const response = await apiClient.get<ExampleResponse>('/example')
  return response.data.items
}
```

将 `aged-fullstack-template/frontend/src/service/modules/health.ts` 改为：

```ts
import { apiClient } from '../core/client'

type HealthResponse = {
  status: string
  service: string
}

export async function getHealthStatus() {
  const response = await apiClient.get<HealthResponse>('/health')
  return response.data
}
```

删除：

```text
aged-fullstack-template/frontend/src/lib/api.ts
aged-fullstack-template/frontend/src/lib/api.test.ts
aged-fullstack-template/frontend/src/lib/env.ts
```

- [ ] **步骤 4: 运行前端 service 层测试验证通过**

运行：

```bash
cd aged-fullstack-template/frontend
pnpm install
pnpm vitest run src/service/core/errors.test.ts src/service/core/client.test.ts src/service/modules/example.test.ts
```

预期：
- 输出显示 `3 passed`

---

### 任务 4: 删除 ExampleContext，改为直接消费 template-meta 和统一错误对象

**文件：**
- 修改：`aged-fullstack-template/libs/template-meta/src/index.ts`
- 删除：`aged-fullstack-template/frontend/src/contexts/ExampleContext.tsx`
- 修改：`aged-fullstack-template/frontend/src/hooks/use-example-state.ts`
- 修改：`aged-fullstack-template/frontend/src/pages/ExamplePage.tsx`
- 修改：`aged-fullstack-template/frontend/src/App.tsx`
- 修改：`aged-fullstack-template/frontend/src/App.test.tsx`

- [ ] **步骤 1: 先改页面测试，锁定新的页面依赖**

将 `aged-fullstack-template/frontend/src/App.test.tsx` 改为：

```ts
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('./service', () => ({
  getExampleItems: vi.fn().mockResolvedValue([
    { id: 'hello', label: 'Hello template' },
    { id: 'customize', label: 'Customize me' }
  ]),
  getHealthStatus: vi.fn().mockResolvedValue({
    status: 'ok',
    service: 'aged-fullstack-template'
  })
}))

import App from './App'

describe('App', () => {
  it('通过模板元信息和 example 页面渲染模板结构', async () => {
    render(<App />)

    expect(screen.getByText('Aged Fullstack Template')).toBeTruthy()
    expect(screen.getByText('面向 aged-* 业务项目的全栈模板。')).toBeTruthy()
    expect(await screen.findByText('Hello template')).toBeTruthy()
    expect(screen.getByText('服务状态')).toBeTruthy()
  })
})
```

- [ ] **步骤 2: 运行该测试，确认当前实现红灯**

运行：

```bash
cd aged-fullstack-template/frontend
pnpm vitest run src/App.test.tsx
```

预期：
- 测试失败
- 当前页面仍依赖 `ExampleContext`

- [ ] **步骤 3: 改写模板元信息和页面状态流**

将 `aged-fullstack-template/libs/template-meta/src/index.ts` 改为：

```ts
export const templateProjectName = 'aged-fullstack-template'
export const templateDisplayName = 'Aged Fullstack Template'
export const templateDescription = '面向 aged-* 业务项目的全栈模板。'
export const templatePackageScope = '@aged-template'
```

将 `aged-fullstack-template/frontend/src/hooks/use-example-state.ts` 改为：

```ts
import { useEffect, useState } from 'react'

import { getExampleItems, getHealthStatus } from '../service'
import { normalizeApiError, type ApiError } from '../service/core/errors'

type ExampleItem = {
  id: string
  label: string
}

type ExampleState = {
  items: ExampleItem[]
  healthStatus: string
  error: ApiError | null
  isLoading: boolean
}

export function useExampleState() {
  const [state, setState] = useState<ExampleState>({
    items: [],
    healthStatus: 'loading',
    error: null,
    isLoading: true
  })

  useEffect(() => {
    async function load() {
      try {
        const [items, health] = await Promise.all([
          getExampleItems(),
          getHealthStatus()
        ])

        setState({
          items,
          healthStatus: health.status,
          error: null,
          isLoading: false
        })
      } catch (error) {
        setState({
          items: [],
          healthStatus: 'error',
          error: normalizeApiError(error),
          isLoading: false
        })
      }
    }

    void load()
  }, [])

  return state
}
```

将 `aged-fullstack-template/frontend/src/pages/ExamplePage.tsx` 改为：

```tsx
import {
  templateDescription,
  templateDisplayName
} from '@aged-template/meta'

import { PageHeader } from '../components/app'
import { ExamplePanel } from '../components/example'
import { SectionCard } from '../components/ui/SectionCard'
import { useExampleState } from '../hooks/use-example-state'

export function ExamplePage() {
  const { items, healthStatus, error, isLoading } = useExampleState()

  return (
    <>
      <PageHeader title={templateDisplayName} description={templateDescription} />
      <ExamplePanel items={items} />
      <SectionCard title="服务状态">
        {isLoading && <p>正在检测 API...</p>}
        {!isLoading && error && <p>请求失败：{error.message}</p>}
        {!isLoading && !error && <p>后端健康状态：{healthStatus}</p>}
      </SectionCard>
    </>
  )
}
```

将 `aged-fullstack-template/frontend/src/App.tsx` 改为：

```tsx
import { AppLayout } from './layouts'
import { ExamplePage } from './pages'

export default function App() {
  return (
    <AppLayout>
      <ExamplePage />
    </AppLayout>
  )
}
```

删除 `aged-fullstack-template/frontend/src/contexts/ExampleContext.tsx`。

- [ ] **步骤 4: 运行页面测试验证通过**

运行：

```bash
cd aged-fullstack-template/frontend
pnpm vitest run src/App.test.tsx
```

预期：
- 输出显示 `1 passed`

---

### 任务 5: 修正 init:project、README 和模板验证链路

**文件：**
- 修改：`aged-fullstack-template/scripts/init-project.mjs`
- 修改：`aged-fullstack-template/README.md`
- 新建：`aged-fullstack-template/scripts/verify-init-project.mjs`

- [ ] **步骤 1: 先补最小初始化验证脚本**

创建 `aged-fullstack-template/scripts/verify-init-project.mjs`：

```js
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const repoRoot = path.resolve(import.meta.dirname, '..')
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aged-template-'))
const copyDir = path.join(tempRoot, 'aged-fullstack-template')

fs.cpSync(repoRoot, copyDir, {
  recursive: true,
  filter(source) {
    return !source.includes(`${path.sep}.git${path.sep}`) && !source.endsWith(`${path.sep}.git`)
  }
})

execFileSync(
  'node',
  [
    './scripts/init-project.mjs',
    '--name',
    'aged-demo',
    '--port-api',
    '3001',
    '--port-postgres',
    '55432',
    '--port-redis',
    '56379'
  ],
  {
    cwd: copyDir,
    stdio: 'inherit'
  }
)

const settings = fs.readFileSync(
  path.join(copyDir, 'backend/app/platform/config/settings.py'),
  'utf8'
)
const envExample = fs.readFileSync(path.join(copyDir, '.env.example'), 'utf8')

if (!settings.includes('project_name: str = "aged-demo"')) {
  throw new Error('settings.py did not update project_name')
}

if (!settings.includes('api_port: int = 3001')) {
  throw new Error('settings.py did not update api_port')
}

if (!envExample.includes('POSTGRES_PORT=55432')) {
  throw new Error('.env.example did not update POSTGRES_PORT')
}

if (!envExample.includes('REDIS_PORT=56379')) {
  throw new Error('.env.example did not update REDIS_PORT')
}
```

- [ ] **步骤 2: 运行验证脚本，确认当前实现红灯**

运行：

```bash
cd aged-fullstack-template
node ./scripts/verify-init-project.mjs
```

预期：
- 脚本失败
- 失败点会指向 `backend/app/platform/config/settings.py` 尚未被 `init-project` 改写

- [ ] **步骤 3: 修正 init:project 的真实目标文件，并同步 README**

将 `aged-fullstack-template/scripts/init-project.mjs` 的 `targetFiles` 改为：

```js
const targetFiles = [
  'package.json',
  'pnpm-lock.yaml',
  '.env.example',
  'README.md',
  '.gitlab-ci.yml',
  '.github/workflows/release.yml',
  'docker-compose.yml',
  'docker-compose.dev.yml',
  'frontend/package.json',
  'frontend/index.html',
  'frontend/Dockerfile',
  'frontend/src/App.test.tsx',
  'frontend/vite.config.ts',
  'backend/pyproject.toml',
  'backend/uv.lock',
  'backend/app/platform/config/settings.py',
  'backend/tests/contracts/test_health.py',
  'libs/template-meta/package.json',
  'libs/template-meta/src/index.ts',
  'scripts/ci/check-docker.sh',
  'scripts/ci/build-images.sh',
  'scripts/ci/publish-images.sh',
  'scripts/start-web.sh',
  'scripts/init-project.mjs'
]
```

并把原来针对 `backend/app/core/config.py` 的替换逻辑，改为针对 `backend/app/platform/config/settings.py`：

```js
if (file === 'backend/app/platform/config/settings.py') {
  content = content
    .replace(/project_name: str = "[^"]+"/m, `project_name: str = "${projectName}"`)
    .replace(/api_port: int = \d+/m, `api_port: int = ${apiPort}`)
    .replace(
      /database_url: str = \(\n\s+"postgresql\+psycopg:\/\/postgres:postgres@127\.0\.0\.1:\d+\/[a-z0-9_]+"\n\s+\)/m,
      `database_url: str = (\n        "postgresql+psycopg://postgres:postgres@127.0.0.1:${postgresPort}/${projectDbName}"\n    )`
    )
    .replace(
      /redis_url: str = "redis:\/\/127\.0\.0\.1:\d+\/0"/m,
      `redis_url: str = "redis://127.0.0.1:${redisPort}/0"`
    )
}
```

同时修改 `aged-fullstack-template/README.md`：

- 把前端层级说明中的 `lib` 删除
- 在前端结构约定中补上 `service/core` 使用 axios 和 interceptors
- 在后端结构约定中明确 `repository.py` 为可选层
- 在“模板包含什么”或“结构约定”中写清 `module-first` 是默认开发路径

- [ ] **步骤 4: 运行初始化验证和模板基线验证**

运行：

```bash
cd aged-fullstack-template
node ./scripts/verify-init-project.mjs
pnpm test
pnpm build:web
```

预期：
- `node ./scripts/verify-init-project.mjs` 成功退出
- `pnpm test` 通过
- `pnpm build:web` 通过

- [ ] **步骤 5: 检查最终变更范围**

运行：

```bash
git status --short
git diff -- aged-fullstack-template/backend aged-fullstack-template/frontend aged-fullstack-template/libs/template-meta aged-fullstack-template/scripts/init-project.mjs aged-fullstack-template/scripts/verify-init-project.mjs aged-fullstack-template/README.md
```

预期：
- 只出现计划内文件
- diff 能清楚体现后端 ORM 收敛、前端 axios 收敛、初始化脚本对齐三条主线
