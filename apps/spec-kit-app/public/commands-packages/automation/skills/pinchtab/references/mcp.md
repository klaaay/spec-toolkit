# MCP 服务器说明

PinchTab 通过 **stdio JSON-RPC 2.0**（MCP 规范 2025-11-25）暴露 MCP 服务器，使 Claude、GPT-4o 等模型能在工具调用界面里直接控制浏览器。

---

## 配置方式

在 MCP 客户端配置中加入 PinchTab：

```json
{
  "mcpServers": {
    "pinchtab": {
      "command": "pinchtab",
      "args": ["mcp"]
    }
  }
}
```

Claude Desktop（`~/Library/Application Support/Claude/claude_desktop_config.json`）示例：

```json
{
  "mcpServers": {
    "pinchtab": {
      "command": "pinchtab",
      "args": ["mcp"],
      "env": {
        "PINCHTAB_PORT": "9867"
      }
    }
  }
}
```

使用前须先启动 PinchTab（如 `pinchtab start`）。MCP 进程默认把请求代理到本机 `localhost:9867` 的 HTTP API。

---

## 可用工具（共 21 个）

工具名均以 `pinchtab_` 为前缀。

### 导航
| 工具 | 说明 |
|------|------|
| `pinchtab_navigate` | 导航到 URL。必填：`url`。可选：`tabId`。 |
| `pinchtab_health` | 健康检查。无参数。 |

### 页面读取
| 工具 | 说明 |
|------|------|
| `pinchtab_snapshot` | 无障碍树。可选：`interactive`、`compact`、`diff`、`selector`、`tabId`。 |
| `pinchtab_screenshot` | 截图。可选：`quality`、`tabId`。返回 base64 图片。 |
| `pinchtab_get_text` | 抽取可读正文。可选：`raw`、`tabId`。 |
| `pinchtab_find` | 按文本或 CSS 查找。必填：`query`。可选：`tabId`。 |
| `pinchtab_eval` | 执行 JavaScript。必填：`expression`。可选：`tabId`。需 `security.allowEvaluate: true`。 |
| `pinchtab_pdf` | 导出 PDF。可选：`landscape`、`scale`、`pageRanges`、`tabId`。返回 base64。 |
| `pinchtab_cookies` | 获取当前页 Cookie。可选：`tabId`。 |

### 交互
| 工具 | 说明 |
|------|------|
| `pinchtab_click` | 点击（按引用）。必填：`ref`。可选：`tabId`。 |
| `pinchtab_type` | 逐键输入。必填：`ref`、`text`。可选：`tabId`。 |
| `pinchtab_fill` | 通过 JS 派发填写（适合 React/Vue/Angular）。必填：`ref`、`value`。可选：`tabId`。 |
| `pinchtab_press` | 按键（`Enter`、`Tab`、`Escape` 等）。必填：`key`。可选：`tabId`。 |
| `pinchtab_hover` | 悬停。必填：`ref`。可选：`tabId`。 |
| `pinchtab_focus` | 聚焦元素。必填：`ref`。可选：`tabId`。 |
| `pinchtab_select` | 下拉选择。必填：`ref`、`value`。可选：`tabId`。 |
| `pinchtab_scroll` | 滚动页面或元素。可选：`ref`、`pixels`、`tabId`。 |

### 标签页
| 工具 | 说明 |
|------|------|
| `pinchtab_list_tabs` | 列出所有标签。无参数。 |
| `pinchtab_close_tab` | 关闭标签。可选：`tabId`（省略则关当前）。 |

### 工具类
| 工具 | 说明 |
|------|------|
| `pinchtab_wait` | 等待若干毫秒。必填：`ms`（最大 30000）。 |
| `pinchtab_wait_for_selector` | 等待 CSS 选择器出现。必填：`selector`。可选：`timeout`、`tabId`。 |

---

## 元素引用（ref）

`pinchtab_snapshot` 返回的无障碍树里会带有 `e5`、`e12` 这类引用，交互类工具（`click`、`type`、`fill` 等）都依赖它们。

**重要**：引用是临时的。导航或 DOM 大变后会失效。在**新的页面状态下**必须先重新调用 `pinchtab_snapshot`，再使用引用做交互。

---

## MCP 做不到的事

MCP 面故意收窄在浏览器自动化。以下能力 **不能** 仅靠 MCP 工具完成：

| 能力 | 状态 | 替代方案 |
|------|------|----------|
| 创建/编辑/删除用户档案 | 不支持 | `pinchtab profile` CLI 或 HTTP API |
| 配置调度器 | 不支持 | `pinchtab schedule` CLI |
| 修改隐身 / 指纹设置 | 不支持 | 直接改配置文件 |
| 启动或停止 PinchTab 服务 | 不支持 | `pinchtab start` / `pinchtab stop` |
| 管理机群实例 | 不支持 | `pinchtab instances` CLI |
| 读写 PinchTab 全局配置 | 不支持 | 编辑 `~/.pinchtab/config.yaml` 等 |

若 Agent 工作流需要上述能力，请并行使用 CLI，或直接调用 PinchTab HTTP API。

---

## 错误处理

MCP 把业务错误以**工具错误**形式返回（而非协议层错误）。常见情况：

| 错误 | 原因 | 处理 |
|------|------|------|
| Connection refused | PinchTab 未运行 | 执行 `pinchtab start` |
| `ref not found` | 引用已过期 | 重新执行 `pinchtab_snapshot` |
| `evaluate not allowed`（403） | 未允许 `security.allowEvaluate` | 改配置或改用 `find`/`snap` |
| `invalid URL` | 缺少 `http://` 或 `https://` | URL 写完整 scheme |

---

## 相关文档

- 官方 MCP 工具完整参数（若仓库提供）：见 PinchTab 仓库 `docs/reference/mcp-tools.md`
- HTTP API：[api.md](./api.md)
- Agent 优化：[agent-optimization.md](./agent-optimization.md)
