import React from 'react';
import { CodeBlock } from '@/components/ui/code-block';

const aiAssistants = [
  { key: 'claude', name: 'Claude Code', requiresCli: true },
  { key: 'gemini', name: 'Gemini CLI', requiresCli: true },
  { key: 'copilot', name: 'GitHub Copilot', requiresCli: false },
  { key: 'cursor-agent', name: 'Cursor', requiresCli: false },
  { key: 'qwen', name: 'Qwen Code', requiresCli: true },
  { key: 'opencode', name: 'opencode', requiresCli: true },
  { key: 'windsurf', name: 'Windsurf', requiresCli: false },
  { key: 'codex', name: 'Codex CLI', requiresCli: true },
  { key: 'kilocode', name: 'Kilo Code', requiresCli: false },
  { key: 'auggie', name: 'Auggie CLI', requiresCli: true },
  { key: 'roo', name: 'Roo Code', requiresCli: false },
  { key: 'codebuddy', name: 'CodeBuddy', requiresCli: true },
  { key: 'q', name: 'Amazon Q Developer CLI', requiresCli: true },
];

const scriptOptions = [
  {
    type: 'sh',
    label: 'POSIX Shell (bash/zsh)',
    defaultHint: 'macOS / Linux 默认',
  },
  { type: 'ps', label: 'PowerShell', defaultHint: 'Windows 默认' },
];

const initOptions = [
  {
    flag: '--ai <agent>',
    description: '必选。指定要启用的 AI 助手，需与上方列表中的键名一致。',
  },
  {
    flag: '--script <type>',
    description: '可选。脚本类型，支持 sh 或 ps。默认随系统选择（Unix 为 sh，Windows 为 ps）。',
  },
  {
    flag: '--ignore-agent-tools',
    description: '跳过对 AI 助手 CLI 的安装检查。',
  },
  { flag: '--no-git', description: '跳过 Git 仓库初始化。' },
  {
    flag: '--here',
    description: '在当前目录下初始化项目。配合 --force 可覆盖已有文件。',
  },
  { flag: '--force', description: '与 --here 搭配使用时跳过覆盖确认。' },
];

const pullPackageOptions = [
  {
    flag: '--registry <url>',
    description: '命令包源地址，默认 http://localhost:3000/commands-packages。',
  },
  { flag: '--ai <agent>', description: '必选。指定要同步命令的 AI 助手。' },
  {
    flag: '--script <type>',
    description: '可选。脚本类型，默认为当前系统对应的类型。',
  },
  {
    flag: '--project <path>',
    description: 'Specify 项目根目录，默认当前工作目录。',
  },
  { flag: '--force', description: '允许覆盖本地已存在的模板与命令文件。' },
];

export const metadata = {
  title: '使用说明 - Spec ToolKit 文档',
  description: 'Spec ToolKit 工具的使用说明和命令指南',
};

export default function UsagePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Specify CLI 使用指南</h1>
        <p className="text-gray-600">
          Specify CLI（命令名为 <code>specify-ts</code>
          ）提供项目初始化、工具检测与命令包同步能力。下文内容依据 CLI 参数与默认行为整理，便于快速上手并避免常见误用。
        </p>
      </header>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">安装</h2>
        <div>
          <h3 className="text-xl font-medium mb-2">Node 环境配置</h3>
          <p className="mb-2">推荐使用 Node.js LTS 版本，并搭配 pnpm 或 npm 进行依赖管理。</p>
          <a
            href="https://nodejs.org/zh-cn/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline">
            Node.js 官方下载
          </a>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">全局安装 CLI</h3>
          <p className="mb-3">通过内部私有源安装 Specify CLI：</p>
          <CodeBlock language="bash" code={`npm install -g @klaaay/spec-kit-ts`} />
        </div>
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">基础命令</h2>
        <p>安装完成后可通过帮助命令快速查看所有子命令与参数说明。CLI 在未指定子命令时会自动输出帮助信息。</p>
        <CodeBlock language="bash" code={`specify-ts --help\nspecify-ts --version`} />
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">支持的 AI 助手</h2>
        <p>
          以下键名用于 <code>--ai</code> 参数；带 * 的项目需要提前安装对应 CLI：
        </p>
        <ul className="list-disc list-inside space-y-1">
          {aiAssistants.map(agent => (
            <li key={agent.key}>
              <span className="font-medium">{agent.key}</span> — {agent.name}
              {agent.requiresCli ? ' *' : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">脚本类型</h2>
        <p>命令脚本支持 Shell 与 PowerShell，两者在指定自动化脚本时会生成不同的命令模板。</p>
        <ul className="list-disc list-inside space-y-1">
          {scriptOptions.map(option => (
            <li key={option.type}>
              <span className="font-medium">{option.type}</span> — {option.label}（{option.defaultHint}）
            </li>
          ))}
        </ul>
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">项目初始化：init</h2>
        <p>
          <code>specify-ts init</code> 会根据选择的 AI 助手与脚本类型复制模板、配置脚本权限并初始化 Git 仓库。
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-medium">在新目录创建项目：</p>
            <CodeBlock language="bash" code={`specify-ts init my-spec-project --ai claude --script sh`} />
          </div>
          <div>
            <p className="font-medium">在当前项目目录下直接初始化：</p>
            <p className="text-gray-600 text-sm mb-2">
              使用 <code>.</code> 作为项目名可等效于 <code>--here</code>
              ，会将模板合并到现有目录中，适用于已经存在的仓库。如目录非空，CLI 会提示覆盖风险，可结合{' '}
              <code>--force</code> 跳过确认。
            </p>
            <CodeBlock language="bash" code={`specify-ts init . --ai claude --script sh`} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">常用参数</h3>
          <ul className="list-disc list-inside space-y-1">
            {initOptions.map(item => (
              <li key={item.flag}>
                <span className="font-medium">{item.flag}</span> — {item.description}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-gray-600 text-sm">
          初始化完成后 CLI 会提示后续步骤（如设置 CODEX_HOME 或使用斜杠命令），请按需执行。
        </p>
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">环境检查：check</h2>
        <p>
          <code>specify-ts check</code> 用于检查 Git、所有内置 AI 助手 CLI 以及 VS Code 是否安装，确保运行环境准备就绪。
        </p>
        <CodeBlock language="bash" code="specify-ts check" />
        <p className="text-gray-600 text-sm">建议在首次安装 CLI 或更新工具链后执行，以便快速定位缺少的依赖。</p>
      </section>

      <section className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
        <h2 className="text-2xl font-semibold">命令包同步：pull-package</h2>
        <p>
          <code>specify-ts pull-package</code> 会从命令包仓库拉取最新模板，并根据 AI
          助手与脚本类型渲染斜杠命令。未指定包名时默认使用
          <code>fe</code>。
        </p>
        <CodeBlock language="bash" code={`specify-ts pull-package fe --ai claude --script sh`} />
        <div>
          <h3 className="text-xl font-medium mb-2">常用参数</h3>
          <ul className="list-disc list-inside space-y-1">
            {pullPackageOptions.map(item => (
              <li key={item.flag}>
                <span className="font-medium">{item.flag}</span> — {item.description}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-gray-600 text-sm">
          拉取命令包前需确保项目已通过 <code>init</code> 初始化，且 <code>.specify/templates</code> 目录存在。使用{' '}
          <code>--force</code> 可覆盖本地改动，请谨慎操作。
        </p>
      </section>
    </div>
  );
}
