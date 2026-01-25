import { existsSync, readdirSync } from 'node:fs';
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import ora from 'ora';
import { ScriptType } from '../types/pull-package.js';
import { AGENT_CONFIG } from '../constants/index.js';
import {
  parseCommandTemplate,
  renderCommandBody,
  resolveHookScriptCommands,
  withScriptExtension,
} from './template-progress.js';

// 获取当前模块的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 获取模板目录路径
 * 打包后的结构：
 *   dist/
 *     index.js (编译后的代码)
 *     spec-kit-templates/ (复制的模板)
 */
function getTemplatesDir(): string {
  // 尝试不同的路径，找到第一个存在的
  const possiblePaths = [
    join(__dirname, 'spec-kit-templates'), // 打包后：dist/spec-kit-templates
    join(__dirname, '../spec-kit-templates'), // 可能的路径
    join(__dirname, '../../src/spec-kit-templates'), // 开发环境
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error(`未找到模板目录。尝试的路径：${possiblePaths.join(', ')}\n当前目录：${__dirname}`);
}

const TEMPLATES_DIR = getTemplatesDir();

/**
 * 模板片段定义
 */
interface TemplateSegment {
  id: string;
  label: string;
  path: string;
  allowOverride: boolean;
}

/**
 * 获取模块化模板片段列表。
 * 当返回 null 时，表示仍需回退到旧版整包模板。
 */
function getTemplateSegments(aiAssistant: string, scriptType: ScriptType): TemplateSegment[] | null {
  const basePath = join(TEMPLATES_DIR, 'base');
  if (!existsSync(basePath)) {
    return null;
  }

  const segments: TemplateSegment[] = [
    {
      id: 'base',
      label: '基础模板',
      path: basePath,
      allowOverride: false,
    },
  ];

  const agentPath = join(TEMPLATES_DIR, 'agents', aiAssistant);
  if (!existsSync(agentPath)) {
    throw new Error(`未找到 AI 模板片段：${agentPath}`);
  }
  segments.push({
    id: `agent:${aiAssistant}`,
    label: `AI 模板 (${aiAssistant})`,
    path: agentPath,
    allowOverride: true,
  });

  const scriptPath = join(TEMPLATES_DIR, 'scripts', scriptType);
  if (!existsSync(scriptPath)) {
    throw new Error(`未找到脚本模板片段：${scriptPath}`);
  }
  segments.push({
    id: `script:${scriptType}`,
    label: `脚本模板 (${scriptType})`,
    path: scriptPath,
    allowOverride: true,
  });

  return segments;
}

/**
 * 回退：获取旧版整包模板目录
 *
 * @param aiAssistant - AI 助手类型
 * @param scriptType - 脚本类型
 * @returns 模板目录路径
 */
function getLegacyTemplatePath(aiAssistant: string, scriptType: ScriptType): string {
  // 查找匹配的模板目录
  const pattern = `spec-kit-template-${aiAssistant}-${scriptType}`;

  try {
    if (!existsSync(TEMPLATES_DIR)) {
      throw new Error(`模板根目录不存在：${TEMPLATES_DIR}`);
    }

    const templates = readdirSync(TEMPLATES_DIR);
    const matchingTemplate = templates.find((name: string) => name.startsWith(pattern));

    if (!matchingTemplate) {
      throw new Error(`未找到本地模板：${pattern}`);
    }

    return join(TEMPLATES_DIR, matchingTemplate);
  } catch (error) {
    throw new Error(`读取模板目录失败：${error}`);
  }
}

async function generateAgentCommands(projectPath: string, aiAssistant: string, scriptType: ScriptType): Promise<void> {
  const config = AGENT_CONFIG?.[aiAssistant]?.commandConfig;
  if (!config) {
    return;
  }

  const commandsDir = join(projectPath, '.specify', 'templates', 'commands');
  if (!existsSync(commandsDir)) {
    throw new Error(`未找到命令模板目录：${commandsDir}`);
  }

  const templateFiles = await readdir(commandsDir);
  const markdownTemplates = templateFiles.filter(name => name.endsWith('.md'));
  if (markdownTemplates.length === 0) {
    throw new Error(`命令模板为空：${commandsDir}`);
  }

  const outputDir = join(projectPath, config.outputDir);
  await mkdir(outputDir, { recursive: true });

  const existingOutputs = await readdir(outputDir);
  await Promise.all(
    existingOutputs.filter(name => name.startsWith('speckit.')).map(name => rm(join(outputDir, name), { force: true })),
  );

  for (const fileName of markdownTemplates) {
    const templatePath = join(commandsDir, fileName);
    const parsed = await parseCommandTemplate(templatePath);

    const scriptCommand = parsed.scripts?.[scriptType] ?? `(Missing script command for ${scriptType})`;
    const agentScriptCommand = parsed.agentScripts?.[scriptType];
    const hookScriptCommands = resolveHookScriptCommands(parsed, scriptType);

    const processedBody = renderCommandBody(parsed, {
      scriptCommand,
      agentScriptCommand,
      hookScriptCommands,
      argFormat: config.argFormat,
      aiAssistant,
    });

    let outputContent: string;
    if (config.fileExt === 'toml') {
      const escapedDescription = (parsed.description ?? '').replace(/"/g, '\\"');
      const escapedBody = processedBody.replace(/\\/g, '\\\\');
      outputContent = `description = "${escapedDescription}"\n\nprompt = """\n${escapedBody}\n"""\n`;
    } else {
      const frontmatterSection = parsed.cleanedFrontmatter ? `${parsed.cleanedFrontmatter}\n` : '';
      outputContent = `---\n${frontmatterSection}---\n\n${processedBody}\n`;
    }

    const outputName = `speckit.${withScriptExtension(fileName, config.fileExt)}`;
    await writeFile(join(outputDir, outputName), outputContent, 'utf8');
  }
}

/**
 * 递归复制目录，支持过滤 .gitkeep 文件
 *
 * @param srcPath - 源路径
 * @param destPath - 目标路径
 * @param force - 是否强制覆盖
 * @param filterGitkeep - 是否过滤 .gitkeep 文件
 */
async function copyRecursiveFiltered(
  srcPath: string,
  destPath: string,
  force: boolean,
  filterGitkeep: boolean,
): Promise<void> {
  const stats = await readdir(srcPath, { withFileTypes: true });

  for (const entry of stats) {
    // 如果需要过滤且是 .gitkeep 文件，则跳过
    if (filterGitkeep && entry.name === '.gitkeep') {
      continue;
    }

    const sourcePath = join(srcPath, entry.name);
    const targetPath = join(destPath, entry.name);

    if (entry.isDirectory()) {
      // 创建目录并递归复制
      await mkdir(targetPath, { recursive: true });
      await copyRecursiveFiltered(sourcePath, targetPath, force, filterGitkeep);
    } else {
      // 复制文件
      await cp(sourcePath, targetPath, { force });
    }
  }
}

/**
 * 将源目录内容复制到目标目录
 *
 * @param sourceDir - 源目录
 * @param targetDir - 目标目录
 * @param options - 复制选项
 */
async function copyDirectoryInto(
  sourceDir: string,
  targetDir: string,
  options: {
    flattenSingleDir?: boolean;
    force?: boolean;
    filterGitkeep?: boolean;
  } = {},
): Promise<void> {
  const { flattenSingleDir = false, force = false, filterGitkeep = false } = options;

  if (!existsSync(sourceDir)) {
    throw new Error(`模板片段不存在：${sourceDir}`);
  }

  let effectiveSource = sourceDir;
  let entries = await readdir(effectiveSource, { withFileTypes: true });
  if (entries.length === 0) {
    throw new Error(`模板片段为空：${sourceDir}`);
  }

  if (flattenSingleDir && entries.length === 1 && entries[0].isDirectory()) {
    effectiveSource = join(effectiveSource, entries[0].name);
    entries = await readdir(effectiveSource, { withFileTypes: true });
  }

  // 过滤掉 .gitkeep 文件后再检查是否为空
  const filteredEntries = filterGitkeep ? entries.filter(entry => entry.name !== '.gitkeep') : entries;
  if (filteredEntries.length === 0) {
    throw new Error(`模板片段为空：${effectiveSource}`);
  }

  // 确保目标目录存在
  await mkdir(targetDir, { recursive: true });

  // 使用过滤复制函数
  await copyRecursiveFiltered(effectiveSource, targetDir, force, filterGitkeep);
}

/**
 * 从本地复制模板到目标目录
 *
 * @param projectPath - 项目路径
 * @param aiAssistant - AI 助手类型
 * @param scriptType - 脚本类型
 * @param isCurrentDir - 是否在当前目录初始化
 */
export async function copyLocalTemplate(
  projectPath: string,
  aiAssistant: string,
  scriptType: ScriptType,
  isCurrentDir: boolean,
): Promise<void> {
  const spinner = ora('准备模板...').start();

  try {
    let modularSegments: TemplateSegment[] | null = null;
    let modularError: Error | null = null;

    try {
      modularSegments = getTemplateSegments(aiAssistant, scriptType);
    } catch (error) {
      modularError = error instanceof Error ? error : new Error(String(error));
    }

    if (modularSegments) {
      spinner.text = '加载模块化模板';
      console.log(chalk.cyan('\n模板组件：'));
      for (const segment of modularSegments) {
        console.log(`  - ${segment.label}: ${segment.path}`);
      }

      if (!isCurrentDir) {
        await mkdir(projectPath, { recursive: true });
      }

      for (const segment of modularSegments) {
        spinner.text = `复制 ${segment.label}`;
        await copyDirectoryInto(segment.path, projectPath, {
          force: isCurrentDir || segment.allowOverride,
          filterGitkeep: true,
        });
      }

      spinner.text = '生成命令模板';
      await generateAgentCommands(projectPath, aiAssistant, scriptType);

      spinner.succeed('模板复制完成');
      return;
    }

    if (modularError) {
      console.log(chalk.yellow(`模块化模板加载失败，回退到旧版模板：${modularError.message}`));
    }

    spinner.text = '查找模板';
    const templatePath = getLegacyTemplatePath(aiAssistant, scriptType);
    console.log(chalk.cyan(`\n模板路径：${templatePath}`));

    if (!isCurrentDir) {
      await mkdir(projectPath, { recursive: true });
    }

    await copyDirectoryInto(templatePath, projectPath, {
      flattenSingleDir: true,
      force: isCurrentDir,
      filterGitkeep: true,
    });

    spinner.succeed('模板复制完成');
  } catch (error) {
    spinner.fail('模板处理失败');
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    throw error;
  }
}
