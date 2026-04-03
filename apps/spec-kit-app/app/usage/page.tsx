import React from 'react';
import Link from 'next/link';
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
] as const;

const specTsCommands = [
  {
    name: 'init',
    summary: '初始化项目模板，并按 AI 助手写入对应命令与目录结构。',
    code: 'spec-ts init my-project --ai claude',
  },
  {
    name: 'check',
    summary: '检查 Git、内置 AI 助手 CLI、VS Code 与 VS Code Insiders 是否可用。',
    code: 'spec-ts check',
  },
  {
    name: 'pull-package',
    summary: '从命令包静态源拉取命令包内容，并写入当前项目模板目录。',
    code: 'spec-ts pull-package superpowers --ai claude',
  },
] as const;

const figmaConfigCommands = [
  {
    name: 'set-token',
    summary: '保存 Figma Token 到本地配置文件。',
    code: 'figma-toolkit config set-token <your-figma-token>',
  },
  {
    name: 'set-base-url',
    summary: '保存 Figma API 服务地址。',
    code: 'figma-toolkit config set-base-url https://api.figma.com',
  },
  {
    name: 'list',
    summary: '查看当前配置，Token 会自动脱敏。',
    code: 'figma-toolkit config list',
  },
  {
    name: 'path',
    summary: '输出配置文件路径。',
    code: 'figma-toolkit config path',
  },
  {
    name: 'remove',
    summary: '删除某一项配置，支持 figmaToken、baseUrl。',
    code: 'figma-toolkit config remove figmaToken',
  },
] as const;

const figmaApiCommands = [
  {
    name: 'figma file',
    summary: '读取文件信息，对应 Figma 官方 `GET /v1/files/{file_key}`。',
    code: 'figma-toolkit figma file <fileKey>',
  },
  {
    name: 'figma nodes',
    summary: '读取节点信息，对应 `GET /v1/files/{file_key}/nodes`。',
    code: 'figma-toolkit figma nodes "<figma-link-with-node-id>"',
  },
  {
    name: 'figma images',
    summary: '导出并下载图片资源到本地目录，对应 `GET /v1/images/{file_key}`。',
    code: 'figma-toolkit figma images "<figma-link-with-node-id>" --format png --scale 2',
  },
  {
    name: 'figma image-fills',
    summary: '读取图片填充资源，对应 `GET /v1/files/{file_key}/images`。',
    code: 'figma-toolkit figma image-fills <fileKey>',
  },
] as const;

export const metadata = {
  title: '使用说明 - Spec ToolKit 文档',
  description: 'Spec ToolKit 当前 packages 中所有 CLI 的安装方式与命令说明',
};

export default function UsagePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">CLI 使用说明</h1>
        <p className="text-gray-600">
          本页汇总当前 <code>packages</code> 中所有对外 CLI 的安装方式、主要命令与使用示例。目前包含{' '}
          <code>spec-ts</code> 与 <code>figma-toolkit</code> 两个命令。
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">packages/spec-kit-ts</div>
          <h2 className="mb-3 text-2xl font-semibold">spec-ts</h2>
          <p className="mb-4 text-sm leading-6 text-gray-700">
            用于初始化项目模板、检查环境，以及从文档站拉取命令包内容到本地项目目录。
          </p>
          <Link href="#spec-ts" className="text-sm font-medium text-blue-600 hover:underline">
            查看 spec-ts 详细说明
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            packages/figma-toolkit-cli
          </div>
          <h2 className="mb-3 text-2xl font-semibold">figma-toolkit</h2>
          <p className="mb-4 text-sm leading-6 text-gray-700">
            用于管理本地 Figma 配置，并直接调用 Figma 官方 REST API 读取文件、节点和图片资源。
          </p>
          <Link href="#figma-toolkit" className="text-sm font-medium text-blue-600 hover:underline">
            查看 figma-toolkit 详细说明
          </Link>
        </div>
      </section>

      <section id="spec-ts" className="space-y-6 rounded-lg border bg-white p-6 shadow-sm scroll-mt-20">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">spec-ts</h2>
          <p className="text-gray-600">
            <code>spec-ts</code> 是 `@klaaay/spec-kit-ts`
            暴露的命令。它负责把项目模板、命令目录和命令包内容写入具体项目目录。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">安装</h3>
          <CodeBlock language="bash" code={`npm install -g @klaaay/spec-kit-ts`} />
          <CodeBlock language="bash" code={`spec-ts --help\nspec-ts --version`} />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">主要命令</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {specTsCommands.map(command => (
              <div key={command.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 font-semibold text-slate-900">{command.name}</h4>
                <p className="mb-3 text-sm text-gray-700">{command.summary}</p>
                <CodeBlock language="bash" code={command.code} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">支持的 AI 助手键名</h3>
          <p className="text-sm text-gray-600">
            以下键名可用于 <code>--ai</code> 参数。标记为“需要 CLI”的助手，需要先在本机安装对应命令行工具。
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {aiAssistants.map(agent => (
              <div key={agent.key} className="rounded border border-slate-200 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">{agent.key}</span>
                <span className="mx-2 text-slate-400">-</span>
                <span>{agent.name}</span>
                <span className="ml-2 text-slate-500">{agent.requiresCli ? '需要 CLI' : '无需 CLI'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">常用参数</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="mb-2 font-semibold">init</h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <code>--ai &lt;agent&gt;</code>：必填，指定要启用的 AI 助手键名。
                </li>
                <li>
                  <code>--script &lt;type&gt;</code>：脚本类型，支持 <code>sh</code> 和 <code>ps</code>。
                </li>
                <li>
                  <code>--ignore-agent-tools</code>：跳过对 AI 助手 CLI 的安装检查。
                </li>
                <li>
                  <code>--no-git</code>：跳过 Git 仓库初始化。
                </li>
                <li>
                  <code>--here</code>：在当前目录初始化，而不是创建新目录。
                </li>
                <li>
                  <code>--force</code>：与 <code>--here</code> 配合时跳过覆盖确认。
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">pull-package</h4>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <code>--registry &lt;url&gt;</code>：命令包源地址。
                </li>
                <li>
                  <code>--ai &lt;agent&gt;</code>：必填，指定要写入模板的 AI 助手。
                </li>
                <li>
                  <code>--script &lt;type&gt;</code>：脚本类型，支持 <code>sh</code> 和 <code>ps</code>。
                </li>
                <li>
                  <code>--project &lt;path&gt;</code>：Specify 项目根目录，默认当前目录。
                </li>
                <li>
                  <code>--force</code>：允许覆盖本地已存在的模板与命令文件。
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">推荐使用流程</h3>
          <CodeBlock
            language="bash"
            code={`npm install -g @klaaay/spec-kit-ts
spec-ts init my-project --ai claude
cd my-project
spec-ts check
spec-ts pull-package superpowers --ai claude`}
          />
          <p className="text-sm text-gray-600">
            命令包名称请以
            <Link href="/commands-packages" className="mx-1 text-blue-600 hover:underline">
              命令包广场
            </Link>
            中实际提供的命令包为准。
          </p>
        </div>
      </section>

      <section id="figma-toolkit" className="space-y-6 rounded-lg border bg-white p-6 shadow-sm scroll-mt-20">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">figma-toolkit</h2>
          <p className="text-gray-600">
            <code>figma-toolkit</code> 是 `@klaaay/figma-toolkit-cli` 暴露的命令，负责保存本地配置并直接调用 Figma 官方
            REST API。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">安装</h3>
          <CodeBlock language="bash" code={`npm install -g @klaaay/figma-toolkit-cli`} />
          <CodeBlock language="bash" code={`figma-toolkit --help\nfigma-toolkit --version`} />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">配置命令</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {figmaConfigCommands.map(command => (
              <div key={command.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 font-semibold text-slate-900">{command.name}</h4>
                <p className="mb-3 text-sm text-gray-700">{command.summary}</p>
                <CodeBlock language="bash" code={command.code} />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            默认配置文件路径为 <code>~/.figma-toolkit-cli/config.json</code>。
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">Figma API 命令</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {figmaApiCommands.map(command => (
              <div key={command.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 font-semibold text-slate-900">{command.name}</h4>
                <p className="mb-3 text-sm text-gray-700">{command.summary}</p>
                <CodeBlock language="bash" code={command.code} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">输入规则</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>
              所有 Figma 子命令都支持直接传入 <code>fileKey</code>。
            </li>
            <li>
              <code>figma file</code>、<code>figma nodes</code>、<code>figma images</code>、
              <code>figma image-fills</code> 都支持直接传完整 Figma 链接。
            </li>
            <li>
              对 <code>nodes</code> 和 <code>images</code>，如果链接中带有 <code>node-id</code>，CLI 会自动解析成{' '}
              <code>ids</code>。
            </li>
            <li>
              如果链接里没有 <code>node-id</code>，而当前命令又需要节点 ID，则需要显式传入 <code>--ids</code>。
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">配置优先级</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
            <li>
              命令行参数 <code>--token</code>、<code>--base-url</code>
            </li>
            <li>
              环境变量 <code>FIGMA_TOOLKIT_FIGMA_TOKEN</code>、<code>FIGMA_TOKEN</code>、
              <code>FIGMA_TOOLKIT_BASE_URL</code>
            </li>
            <li>
              本地配置文件 <code>~/.figma-toolkit-cli/config.json</code>
            </li>
            <li>
              默认官方地址 <code>https://api.figma.com</code>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium">推荐使用流程</h3>
          <CodeBlock
            language="bash"
            code={`npm install -g @klaaay/figma-toolkit-cli
figma-toolkit config set-token <your-figma-token>
figma-toolkit figma nodes "https://www.figma.com/design/<fileKey>/<name>?node-id=1-2"
figma-toolkit figma images "https://www.figma.com/design/<fileKey>/<name>?node-id=1-2" --format png --scale 2`}
          />
        </div>
      </section>
    </div>
  );
}
