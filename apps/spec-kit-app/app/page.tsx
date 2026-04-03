import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PackageIcon } from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

const capabilityCards = [
  {
    title: 'spec-ts CLI',
    description: 'TypeScript 版 Spec Kit CLI。负责初始化项目模板、检查环境，并将命令包内容写入本地项目目录。',
    detail: '常用命令：spec-ts init、spec-ts check、spec-ts pull-package',
  },
  {
    title: '命令包仓库',
    description:
      '文档站同时托管可被 `spec-ts` 拉取并写入项目的命令包内容。每个命令包主要由 commands、skills、模板、代理提示词和依赖说明等 Markdown 或配置文件组成。',
    detail: '按方向可分为自动化、Spec 开发、前端协作、阅读辅助和设计相关内容。',
    href: '/commands-packages',
    hrefLabel: '查看命令包广场',
  },
  {
    title: 'figma-toolkit CLI',
    description: '独立发布的 Figma CLI，直接调用 Figma REST API，适合读取文件、节点、导出图片和下载图片填充资源。',
    detail: '支持从 Figma 链接自动解析 fileKey 与 node-id。',
  },
  {
    title: '共享工程配置',
    description:
      '仓库内还维护 ESLint 配置、自定义 ESLint 规则与 UnoCSS 预设，这些内容作为独立配置包存在于 monorepo 中。',
    detail: '对应目录：configs/eslint-config、configs/eslint-plugin、configs/uno-config',
  },
] as const;

const moduleCards = [
  {
    path: 'packages/spec-kit-ts',
    title: 'Spec 工作流 CLI',
    description: '提供项目初始化、环境检查和命令包拉取能力，并按不同 AI 助手生成对应命令目录与模板。',
  },
  {
    path: 'apps/spec-kit-app',
    title: '文档站与静态仓库',
    description: '用于展示 CLI 使用说明、命令包内容以及辅助依赖信息，同时也是命令包内容的静态分发入口。',
  },
  {
    path: 'packages/figma-toolkit-cli',
    title: 'Figma 数据工具',
    description: '提供本地配置管理与 Figma 官方 REST API 调用能力，可读取文件、节点和图片资源。',
  },
  {
    path: 'configs/*',
    title: '前端工程配置',
    description: '包含 ESLint 共享配置、自定义 ESLint 插件与 UnoCSS 配置，对应仓库中的配置类 package。',
  },
] as const;

const scenarioCards = [
  {
    title: '在项目里落地 Spec Kit',
    description: '如果你需要初始化 `/speckit.*` 命令、生成项目模板并建立基础目录，入口是 `spec-ts`。',
  },
  {
    title: '补充领域命令与工作流',
    description: '如果你希望把额外的 commands、skills 和模板写入项目，入口是命令包广场与 `pull-package`。',
  },
  {
    title: '读取 Figma 文件与资源',
    description: '如果你需要获取节点结构、导出图片或下载填充资源，入口是 `figma-toolkit` CLI。',
  },
  {
    title: '复用统一前端配置',
    description: '如果你只关注配置类 package，可以直接查看并使用 `configs/*` 下的 ESLint 与 UnoCSS 配置。',
  },
] as const;

export default function Home() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Spec ToolKit 文档</h1>
        <p className="text-xl text-gray-600 mt-4">
          围绕 Spec-Driven Development 与前端协作流程构建的 CLI、命令包内容、文档站与工程配置集合
        </p>
      </header>

      <section className="mb-12 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Spec ToolKit 是什么</h2>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Spec ToolKit 是一个 monorepo。它不是单一 CLI，也不是只讲方法论的说明页，而是一组已经落地的工具和内容：
            <strong className="text-slate-900">
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm">spec-ts</code>
              CLI、
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm">figma-toolkit</code>
              CLI、命令包内容、文档站
            </strong>
            ，以及可独立复用的前端工程配置。
          </p>
          <p>
            这个首页只说明仓库当前已经提供的能力和入口，不额外扩展到仓库之外的承诺。如果你要找具体命令、命令包或依赖说明，可以直接从下方对应模块进入。
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {capabilityCards.map(card => (
            <div key={card.title} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mb-3 text-sm text-gray-700">{card.description}</p>
              <p className="text-sm text-slate-500">{card.detail}</p>
              {'href' in card && card.href && 'hrefLabel' in card && card.hrefLabel ? (
                <Link
                  href={card.href}
                  className="mt-3 inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
                  {card.hrefLabel}
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">当前提供的能力</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {moduleCards.map(card => (
            <div key={card.path} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">{card.path}</p>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm leading-6 text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-4 text-xl font-bold text-slate-900">适合这些场景</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {scenarioCards.map(card => (
            <div key={card.title}>
              <h3 className="mb-2 font-semibold text-slate-900">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-lg border bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-bold">快速开始</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">使用 spec-ts</h3>
              <p className="mb-2 text-sm text-gray-600">安装并初始化项目模板：</p>
              <CodeBlock language="bash" code={`npm install -g @klaaay/spec-kit-ts`} />
            </div>
            <div>
              <CodeBlock language="bash" code={`spec-ts init my-project --ai claude`} />
              <p className="mt-2 text-sm text-gray-600">在新目录中创建项目模板、命令目录和基础文件。</p>
            </div>
            <div>
              <CodeBlock language="bash" code={`spec-ts check`} />
              <p className="mt-2 text-sm text-gray-600">检查本地依赖和所选 AI 助手环境是否可用。</p>
            </div>
            <div>
              <CodeBlock language="bash" code={`spec-ts pull-package superpowers --ai claude`} />
              <p className="mt-2 text-sm text-gray-600">
                把命令包内容写入当前项目。更多可用包可在
                <Link href="/commands-packages" className="mx-1 text-blue-600 hover:underline">
                  命令包广场
                </Link>
                查看。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">使用 figma-toolkit</h3>
              <p className="mb-2 text-sm text-gray-600">
                如果你的目标是读取 Figma 数据或下载资源，可以单独使用 Figma CLI：
              </p>
              <CodeBlock language="bash" code={`npm install -g @klaaay/figma-toolkit-cli`} />
            </div>
            <div>
              <CodeBlock language="bash" code={`figma-toolkit config set-token <your-figma-token>`} />
            </div>
            <div>
              <CodeBlock language="bash" code={`figma-toolkit figma file <fileKey>`} />
            </div>
            <div>
              <CodeBlock
                language="bash"
                code={`figma-toolkit figma nodes "https://www.figma.com/design/<fileKey>/<name>?node-id=1-2"`}
              />
              <p className="mt-2 text-sm text-gray-600">
                支持直接传入 Figma 链接，工具会自动解析 `fileKey` 与 `node-id`。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-700">
            初始化完成后，常用的核心命令包括
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">/speckit.constitution</code>
            <code className="mr-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">/speckit.specify</code>
            <code className="mr-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">/speckit.plan</code>
            <code className="mr-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">/speckit.tasks</code>
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">/speckit.implement</code>。 支持的 AI
            助手键名与完整示例可在
            <Link href="/usage" className="mx-1 text-blue-600 hover:underline">
              使用说明
            </Link>
            页面查看。
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">文档导航</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/usage" className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-3 flex items-center text-xl font-semibold">
              使用说明
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </h3>
            <p className="text-gray-600">查看 `spec-ts`、`figma-toolkit`、AI 助手键名和完整命令示例。</p>
          </Link>

          <Link
            href="/commands-packages"
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-center">
              <PackageIcon className="mr-2 h-5 w-5 text-gray-700" />
              <h3 className="flex items-center text-xl font-semibold">
                命令包广场
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </h3>
            </div>
            <p className="text-gray-600">浏览当前提供的命令包内容，查看其中包含的命令、技能、模板与依赖说明。</p>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                使用 <code className="rounded bg-gray-100 px-2 py-1 text-xs">spec-ts pull-package</code>{' '}
                将这些内容写入你的项目里。
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
