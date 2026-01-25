'use client';

import { type KeyboardEvent, useState } from 'react';
import { InfoIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AddCommandPackageGuideProps {
  show: boolean;
}

export function AddCommandPackageGuide({ show }: AddCommandPackageGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!show) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        aria-label="如何添加命令包"
        onClick={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="group cursor-pointer border border-dashed border-primary/40 bg-primary/5 transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40">
        <CardContent className="flex h-full flex-col justify-between gap-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-primary/40 bg-primary/10 text-primary">
              <InfoIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold leading-5 text-primary">如何添加命令包</div>
              <div className="text-xs text-muted-foreground">按照示例结构创建或更新本地命令包资源。</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-auto w-full"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              setIsOpen(true);
            }}>
            查看指引
          </Button>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-xl">
          <div className="flex h-full flex-col gap-6 overflow-hidden">
            <SheetHeader className="gap-2 px-6 pt-6 text-left">
              <SheetTitle className="text-lg font-semibold">如何添加命令包</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                参考以下步骤将自定义命令包添加到本地资源目录。
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <div className="space-y-6 text-sm leading-6 text-muted-foreground">
                <section className="space-y-2">
                  <div className="text-base font-semibold text-foreground">步骤 1：克隆命令包模板仓库</div>
                  <p>克隆 spec-toolkit 仓库，获取命令包示例资源。</p>
                  <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs leading-6">
                    <code>git clone https://github.com/klaaay/spec-toolkit.git</code>
                  </pre>
                </section>

                <section className="space-y-3">
                  <div className="text-base font-semibold text-foreground">步骤 2：按目录结构添加命令包</div>
                  <p>
                    在 <code>spec-kit-app/public/commands-packages</code> 目录下，按照如下结构放置自定义命令包资源：
                  </p>
                  <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs leading-6">
                    <code>{`└── fe
    ├── _meta.json
    ├── commands
    │   ├── fe-definition-gen.run.liquid.md
    │   ├── fe-figma-gen.run.liquid.md
    │   ├── fe-figma-gen.scan.liquid.md
    │   ├── fe-figma-gen.wizard.liquid.md
    │   ├── fe-rule.run.liquid.md
    │   ├── fe-rule.scan.liquid.md
    │   └── fe-rule.wizard.liquid.md
    └── templates
        ├── fe-definition-gen-run-template.liquid.md
        ├── fe-figma-gen-run-template.liquid.md
        ├── fe-figma-gen-template.liquid.md
        ├── fe-rule-run-template.liquid.md
        └── fe-rule-template.liquid.md`}</code>
                  </pre>
                  <p>
                    liquid 模板中的 <code>{'{{ check-prerequisites-script }}'}</code>
                    占位符可注入以下脚本映射，用于生成运行存档指令时初始化文件目录：
                  </p>
                  <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs leading-6">
                    <code>{`export const CHECK_PREREQUISITES_SCRIPT_MAP: ScriptMap = {
  sh: 'scripts/bash/check-prerequisites.sh --json --paths-only',
  ps: 'scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly',
};`}</code>
                  </pre>
                  <p>
                    脚本内容可分别在
                    <a
                      className="text-primary underline"
                      href="https://github.com/klaaay/spec-toolkit/tree/main/packages/spec-kit-ts/src/spec-kit-templates/scripts/sh/.specify/scripts/bash"
                      target="_blank"
                      rel="noreferrer">
                      bash 版本
                    </a>
                    和
                    <a
                      className="text-primary underline"
                      href="https://github.com/klaaay/spec-toolkit/tree/main/packages/spec-kit-ts/src/spec-kit-templates/scripts/ps/.specify/scripts/powershell"
                      target="_blank"
                      rel="noreferrer">
                      PowerShell 版本
                    </a>
                    查看。
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="text-base font-semibold text-foreground">步骤 3：配置命令包元信息</div>
                  <p>
                    根据命令与模板的实际情况填写 <code>_meta.json</code>
                    ，示例如下：
                  </p>
                  <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs leading-6">
                    <code>{`{
  "package": "fe",
  "version": "1.0.0",
  "commands": [
    {
      "id": "fe-definition-gen.run",
      "file": "commands/fe-definition-gen.run.liquid.md",
      "output": ".specify/templates/commands/fe-definition-gen.run.md",
      "description": "基于后端接口定义自动生成前端请求封装与 UI 逻辑。",
      "requires": ["fe-definition-gen-run-template"]
    },
    {
      "id": "fe-figma-gen.run",
      "file": "commands/fe-figma-gen.run.liquid.md",
      "output": ".specify/templates/commands/fe-figma-gen.run.md",
      "description": "按照项目约束与 Figma 标注生成页面或组件代码。",
      "requires": ["fe-figma-gen-run-template"]
    },
    {
      "id": "fe-figma-gen.scan",
      "file": "commands/fe-figma-gen.scan.liquid.md",
      "output": ".specify/templates/commands/fe-figma-gen.scan.md",
      "description": "自动扫描现有仓库，推断 Figma 构建约束并填充 fe-figma-gen 模板。",
      "requires": ["fe-figma-gen-template"]
    },
    {
      "id": "fe-figma-gen.wizard",
      "file": "commands/fe-figma-gen.wizard.liquid.md",
      "output": ".specify/templates/commands/fe-figma-gen.wizard.md",
      "description": "交互式收集项目的 Figma 构建约束并填充 fe-figma-gen 模板。",
      "requires": ["fe-figma-gen-template"]
    },
    {
      "id": "fe-rule.run",
      "file": "commands/fe-rule.run.liquid.md",
      "output": ".specify/templates/commands/fe-rule.run.md",
      "description": "根据前端规则文档在现有仓库中实现需求代码。",
      "requires": ["fe-rule-run-template"]
    },
    {
      "id": "fe-rule.scan",
      "file": "commands/fe-rule.scan.liquid.md",
      "output": ".specify/templates/fe-rule.scan.md",
      "description": "分析仓库并生成前端工程规则文档，并填充 fe-rule 模板。",
      "requires": ["fe-rule-template"]
    },
    {
      "id": "fe-rule.wizard",
      "file": "commands/fe-rule.wizard.liquid.md",
      "output": ".specify/templates/fe-rule.wizard.md",
      "description": "交互式向导，帮助用户为新项目完成 fe-rule-template。",
      "requires": ["fe-rule-template"]
    }
  ],
  "templates": [
    {
      "id": "fe-definition-gen-run-template",
      "file": "templates/fe-definition-gen-run-template.liquid.md",
      "output": ".specify/templates/fe-definition-gen-run-template.md"
    },
    {
      "id": "fe-figma-gen-run-template",
      "file": "templates/fe-figma-gen-run-template.liquid.md",
      "output": ".specify/templates/fe-figma-gen-run-template.md"
    },
    {
      "id": "fe-figma-gen-template",
      "file": "templates/fe-figma-gen-template.liquid.md",
      "output": ".specify/templates/fe-figma-gen-template.md"
    },
    {
      "id": "fe-rule-run-template",
      "file": "templates/fe-rule-run-template.liquid.md",
      "output": ".specify/templates/fe-rule-run-template.md"
    },
    {
      "id": "fe-rule-template",
      "file": "templates/fe-rule-template.liquid.md",
      "output": ".specify/templates/fe-rule-template.md"
    }
  ],
  "mcpServers": {
    "klay-figma": {
      "name": "Klay Figma MCP",
      "description": "Klay Figma MCP 是 Klay 提供的一个 MCP 服务，用于获取 Figma 的标注信息。",
      "docUrl": ""
    },
    "figma": {
      "name": "Figma MCP",
      "description": "Figma 官方提供的 MCP 工具，获取代码结构信息、token 变量和设计稿截图等",
      "docUrl": "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
    }
  },
  "otherDependencies": {
    "klay-figma-plugin": {
      "name": "Klay Figma Plugin",
      "description": "自定义的插件可以用于在 Figma 设计稿上快速给图层添加标注，和隐藏 Text 元数据信息",
      "docUrl": ""
    }
  }
}`}</code>
                  </pre>
                </section>

                <section className="space-y-2">
                  <div className="text-base font-semibold text-foreground">步骤 4：提交改动</div>
                  <p>
                    完成编写后提交最终 MR，发送合入 <code>main</code> 分支。
                  </p>
                </section>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
