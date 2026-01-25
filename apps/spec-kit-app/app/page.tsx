import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PackageIcon, GitPullRequestIcon, SparklesIcon } from 'lucide-react';
import { CodeBlock } from '@/components/ui/code-block';

export default function Home() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Spec ToolKit 文档</h1>
        <p className="text-xl text-gray-600 mt-4">规格驱动开发（Spec-Driven Development）工具包</p>
      </header>

      {/* Spec-Driven Development 介绍 */}
      <section className="mb-12 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100">
        <h2 className="text-2xl font-bold mb-6 text-indigo-900">什么是规格驱动开发（SDD）？</h2>

        <div className="space-y-6">
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              <strong className="text-indigo-800">规格驱动开发</strong>
              颠覆了传统软件开发的权力结构。几十年来，代码一直是核心 ——
              规格文档只是我们搭建后丢弃的脚手架，一旦"真正的工作"（编码）开始，它们就被抛在脑后。
            </p>
            <p className="mb-4">
              SDD 彻底反转了这种关系：
              <span className="font-semibold text-purple-700">规格不再服务于代码，而是代码服务于规格</span>。
              产品需求文档不再只是实施指南，而是<strong>直接生成实施</strong>
              的源头；技术方案不再只是指导文档，而是
              <strong>精确的定义</strong>， 可以自动产出代码。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-indigo-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🔄</span>
                <h4 className="font-semibold text-gray-900">权力反转</h4>
              </div>
              <p className="text-sm text-gray-600">
                传统开发中代码是真理，规格常常落后于实现。SDD 让规格成为
                <strong>唯一的真相源</strong>
                ，代码只是规格在特定语言和框架中的表达。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-indigo-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📝</span>
                <h4 className="font-semibold text-gray-900">可执行规格</h4>
              </div>
              <p className="text-sm text-gray-600">
                规格必须足够精确、完整、无歧义，才能生成可工作的系统。这消除了意图与实现之间的鸿沟 ——
                只有转换，没有差距。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-indigo-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🧠</span>
                <h4 className="font-semibold text-gray-900">意图驱动</h4>
              </div>
              <p className="text-sm text-gray-600">
                开发团队的意图用自然语言表达（"<strong>意图驱动开发</strong>
                "），设计资产、核心原则和其他指南成为开发的通用语言， 代码只是最后一公里的实现。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 border border-indigo-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🔁</span>
                <h4 className="font-semibold text-gray-900">持续演进</h4>
              </div>
              <p className="text-sm text-gray-600">
                维护软件意味着演进规格；调试意味着修复生成错误代码的规格；重构意味着为了更清晰而重组规格。整个开发工作流围绕规格重新组织。
              </p>
            </div>
          </div>

          <div className="bg-indigo-100/50 rounded-lg p-5 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-3">为什么现在是 SDD 的时代？</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 mt-0.5">•</span>
                <span>
                  <strong>AI 能力突破</strong>
                  ：自然语言规格现在可以可靠地生成可工作的代码，这不是取代开发者，而是放大他们的效能。
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 mt-0.5">•</span>
                <span>
                  <strong>复杂性爆炸</strong>
                  ：现代系统集成数十种服务、框架和依赖。SDD 通过规格驱动生成提供系统性的对齐。
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 mt-0.5">•</span>
                <span>
                  <strong>变化加速</strong>：需求变化比以往任何时候都快。SDD 将需求变更从障碍转变为正常的工作流程 ——
                  修改规格中的核心需求，受影响的实施计划和代码自动更新。
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 核心特性介绍 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">核心特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center mb-3">
              <SparklesIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold">集成 Spec Kit 能力</h3>
            </div>
            <p className="text-gray-700 mb-3">
              完整集成 GitHub Spec Kit 的所有核心能力，提供从规格定义到代码实施的完整工作流。
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">/speckit.constitution</code> -
                  创建项目的治理原则和开发指南
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">/speckit.specify</code> -
                  描述你想要构建的内容，关注要做什么以及为什么
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">/speckit.plan</code> -
                  提供你的技术栈和架构选择
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">/speckit.tasks</code> -
                  根据你的实施计划创建可执行的任务列表
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>
                  <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">/speckit.implement</code> -
                  执行所有任务，并根据计划构建你的功能
                </span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-lg border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center mb-3">
              <GitPullRequestIcon className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold">远端命令包拉取</h3>
            </div>
            <p className="text-gray-700 mb-3">
              核心设计亮点：支持从远端仓库动态拉取结构化命令包，实现命令能力的扩展和定制。
            </p>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <code className="text-sm text-gray-800">specify-ts pull-package [packageName]</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              命令包可以包含自定义的斜杠命令、模板和配置，根据不同 AI 助手和脚本类型自动适配。
            </p>
            <Link
              href="/commands-packages"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800">
              查看可用命令包
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 技术亮点 */}
      <section className="mb-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-4">为什么选择 spec-kit-ts？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🚀 TypeScript 实现</h4>
            <p className="text-sm text-gray-700">更好的类型安全和开发体验，与现代前端工具链无缝集成</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🎯 可扩展架构</h4>
            <p className="text-sm text-gray-700">通过远端命令包机制，轻松扩展和定制 AI 助手的能力</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">🤖 多 AI 支持</h4>
            <p className="text-sm text-gray-700">支持 Claude、Copilot、Cursor 等主流 AI 编码助手</p>
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="mb-12 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">快速开始</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                1
              </span>
              安装 CLI 工具
            </h3>
            <p className="text-sm text-gray-600 mb-2">通过内部私有源全局安装 Specify CLI（需要 Node.js 环境）：</p>
            <CodeBlock language="bash" code={`npm install -g @klaaay/spec-kit-ts`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                2
              </span>
              初始化项目
            </h3>
            <p className="text-sm text-gray-600 mb-2">创建新项目目录：</p>
            <CodeBlock language="bash" code={`specify-ts init my-project --ai claude`} />
            <p className="text-sm text-gray-600 mt-3 mb-2">
              或在当前项目目录初始化（使用 <code className="bg-white px-1.5 py-0.5 rounded text-xs">.</code> 或{' '}
              <code className="bg-white px-1.5 py-0.5 rounded text-xs">--here</code>
              ）：
            </p>
            <CodeBlock language="bash" code={`specify-ts init . --ai claude`} />
            <p className="text-xs text-gray-500 mt-2">
              其中 <code className="bg-white px-1.5 py-0.5 rounded text-xs">--ai</code> 参数需要填写支持的 AI
              助手键名（如
              <code className="bg-white px-1.5 py-0.5 rounded text-xs ml-1">claude</code>、
              <code className="bg-white px-1.5 py-0.5 rounded text-xs ml-1">cursor-agent</code> 等），完整列表可在{' '}
              <Link href="/usage" className="text-blue-600 hover:underline">
                使用说明 &gt; 支持的 AI 助手
              </Link>{' '}
              中查看。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                3
              </span>
              拉取命令包（可选）
            </h3>
            <CodeBlock language="bash" code={`specify-ts pull-package fe --ai claude`} />
            <p className="text-sm text-gray-600 mt-2">
              从远端拉取前端规范命令包（需通过 <code className="bg-white px-1.5 py-0.5 rounded text-xs">--ai</code> 指定
              AI 助手，如 <code className="bg-white px-1.5 py-0.5 rounded text-xs">claude</code>
              <code className="bg-white px-1.5 py-0.5 rounded text-xs">cursor-agent</code>
              ），获得
              <code className="bg-white px-1.5 py-0.5 rounded text-xs">/speckit.fe-*</code> 等扩展命令
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                4
              </span>
              开始使用斜杠命令
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              在你使用的 AI 客户端（如 Claude、Cursor、Copilot Chat 等）对话框中，根据你的使用场景选择对应的命令：
            </p>
            <p className="text-sm text-gray-600 mb-2">
              如果你打算直接使用集成的 Spec Kit 能力，请按上文「集成 Spec Kit 能力」中列出的
              <code className="bg-white px-1.5 py-0.5 rounded text-xs ml-1 mr-1">/speckit.constitution</code>
              <code className="bg-white px-1.5 py-0.5 rounded text-xs mr-1">/speckit.specify</code>
              <code className="bg-white px-1.5 py-0.5 rounded text-xs mr-1">/speckit.plan</code>
              <code className="bg-white px-1.5 py-0.5 rounded text-xs mr-1">/speckit.tasks</code>
              <code className="bg-white px-1.5 py-0.5 rounded text-xs">/speckit.implement</code>
              等步骤逐步执行。
            </p>
            <CodeBlock language="bash" code={`/speckit.specify 构建一个待办事项管理应用...`} />
            <p className="text-sm text-gray-600 mb-2">
              如果你希望使用自定义命令包中的斜杠命令，可以先通过
              <code className="bg-white px-1.5 py-0.5 rounded text-xs mx-1">specify-ts pull-package [packageName]</code>
              拉取命令包，然后前往
              <Link href="/commands-packages" className="text-blue-600 hover:underline mx-1">
                命令包广场
              </Link>
              页面，根据每个命令包展示的说明找到对应的斜杠命令并在 AI 对话框中使用。
            </p>
          </div>
        </div>
      </section>

      {/* 导航卡片 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">文档导航</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/usage" className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              使用说明
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </h3>
            <p className="text-gray-600">查看 Spec ToolKit 的完整命令列表和使用示例</p>
          </Link>

          <Link
            href="/commands-packages"
            className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <PackageIcon className="h-5 w-5 text-gray-700 mr-2" />
              <h3 className="text-xl font-semibold flex items-center">
                命令包广场
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </h3>
            </div>
            <p className="text-gray-600">浏览可用的命令包资源，查看包含的斜杠命令、模板与配置文件</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                使用 <code className="bg-gray-100 px-2 py-1 rounded text-xs">pull-package</code>{' '}
                命令拉取这些命令包到你的项目中
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
