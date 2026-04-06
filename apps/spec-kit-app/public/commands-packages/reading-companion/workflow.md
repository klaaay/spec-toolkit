# 阅读伴读（Reading Companion）

本命令包以 **skill** 形式提供（与 `superpowers` 包相同的 `skills/<id>/` 布局），通过 `spec-kit` 的 pull 流程安装到各 AI 助手的 skills 目录（如 `.claude/skills`）。

## 组件

- `reading-companion-assist`：书籍伴读助手。按固定 MDX/笔记结构输出章节总结、内在联系、常见疑问、现实启发与全书小结。

## 使用建议

在用户需要整理读书笔记、多章串联或全书脉络时，在会话中加载 `reading-companion-assist`，并在对话中给出书名、章节范围与具体问题。
