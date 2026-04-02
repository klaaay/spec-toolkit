# PinchTab 环境变量

本文档刻意只列与 Agent 最相关的几项。

运行时行为应主要通过 `config.json` 或 `pinchtab config` 子命令配置，而不是堆环境变量。

## 与 Agent 相关的变量

| 变量 | 典型用途 | 说明 |
|---|---|---|
| `PINCHTAB_TOKEN` | 访问受保护的服务器时为 CLI 或 MCP 请求鉴权 | 以 `Authorization: Bearer ...` 形式发送 |
| `PINCHTAB_CONFIG` | 指定配置文件路径 | 做自动化时若需固定配置路径，优先用这个 |

## 指向远程服务

不要用环境变量指服务器，请用 CLI 的 `--server`：

```bash
pinchtab --server http://192.168.1.50:9867 snap
pinchtab --server https://pinchtab.example.com snap
```

## 刻意不列出的内容

- 浏览器细项调优一般应写在 `config.json`，而不是临时环境变量。
- 内部进程传递、继承环境等属于实现细节，不作为本技能约定的一部分。

## 推荐默认

对大多数 Agent 任务，通常只需要：

```bash
PINCHTAB_TOKEN=...
```

其余交给配置文件、用户档案、实例以及 `--server` 即可。
