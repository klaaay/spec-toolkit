/* eslint-disable react-func/max-lines-per-function */
import { existsSync } from 'node:fs';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { cwd } from 'node:process';
import axios from 'axios';
import { Liquid } from 'liquidjs';
import ora from 'ora';
import { COMMAND_SCRIPT_MAP, CHECK_PREREQUISITES_SCRIPT_MAP, DEFAULT_REGISTRY_URL } from '../constants/pull-package.js';
import {
  parseCommandTemplate,
  renderCommandBody,
  resolveHookScriptCommands,
  withScriptExtension,
} from '../utils/template-progress.js';
import { showError, showInfo, showSuccess, showWarning } from '../utils/ui.js';
import {
  CommandManifestEntry,
  CommandPackageManifest,
  AgentManifestEntry,
  SkillManifestEntry,
  SkillScriptEntry,
  PullPackageOptions,
  SCRIPT_TYPE_CHOICES,
  ScriptMap,
  ScriptType,
  TemplateManifestEntry,
} from '../types/pull-package.js';
import { AGENT_CONFIG } from '../constants/index.js';

function normalizeBaseUrl(registry: string): string {
  return registry.trim().replace(/\/+$/, '');
}

function buildFileUrl(packageBase: string, relativePath: string): string {
  const baseWithSlash = packageBase.endsWith('/') ? packageBase : `${packageBase}/`;
  return new URL(relativePath, baseWithSlash).toString();
}

function ensureTrailingNewline(content: string): string {
  return content.endsWith('\n') ? content : `${content}\n`;
}

function buildAssetOutputPath(
  baseDir: string,
  entryOutput: string | undefined,
  entryId: string,
  fallbackExt: string | undefined,
  sourceFile: string,
  projectPath: string,
): string {
  const normalizedExt = fallbackExt
    ? fallbackExt.startsWith('.')
      ? fallbackExt
      : `.${fallbackExt}`
    : extname(sourceFile);
  const rawOutput = entryOutput ?? sourceFile ?? `${entryId}${normalizedExt || '.md'}`;
  const hasExt = extname(rawOutput);
  const outputName = hasExt ? rawOutput : `${rawOutput}${normalizedExt || '.md'}`;
  return join(projectPath, baseDir, outputName);
}

async function renderAgentCommands(projectPath: string, aiAssistant: string, scriptType: ScriptType): Promise<void> {
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

    const outputName = parsed.noSpeckitPrefix
      ? withScriptExtension(fileName, config.fileExt)
      : `speckit.${withScriptExtension(fileName, config.fileExt)}`;
    await writeFile(join(outputDir, outputName), outputContent, 'utf8');
  }
}

async function fetchText(url: string): Promise<string> {
  const response = await axios.get<string>(url, { responseType: 'text' });
  return response.data;
}

async function fetchManifest(url: string): Promise<CommandPackageManifest> {
  const response = await axios.get<CommandPackageManifest>(url, {
    responseType: 'json',
  });
  return response.data;
}

function validateManifest(manifest: CommandPackageManifest): void {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Manifest is empty');
  }

  if (!Array.isArray(manifest.commands)) {
    throw new Error('Manifest missing "commands" array');
  }

  if (manifest.templates !== undefined && !Array.isArray(manifest.templates)) {
    throw new Error('Manifest "templates" must be an array if provided');
  }

  if (manifest.agents !== undefined && !Array.isArray(manifest.agents)) {
    throw new Error('Manifest "agents" must be an array if provided');
  }

  if (manifest.skills !== undefined && !Array.isArray(manifest.skills)) {
    throw new Error('Manifest "skills" must be an array if provided');
  }
}

export async function pullPackageCommand(packageName: string | undefined, options: PullPackageOptions): Promise<void> {
  const finalPackageName = packageName && packageName.trim().length > 0 ? packageName.trim() : 'fe';

  const registryBase = normalizeBaseUrl(options.registry ?? DEFAULT_REGISTRY_URL);
  const packageBase = `${registryBase}/${finalPackageName}`;
  const metaUrl = buildFileUrl(packageBase, '_meta.json');

  const selectedAi = options.ai;
  if (!selectedAi) {
    showError('缺少参数', '请使用 --ai 指定要更新的 AI 助手');
    showInfo(`可选项：${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }
  if (!AGENT_CONFIG[selectedAi]) {
    showError('无效的 AI 助手', `"${selectedAi}" 不在支持列表中`);
    showInfo(`可选项：${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }

  const scriptType = options.script ?? (process.platform === 'win32' ? 'ps' : 'sh');
  if (!SCRIPT_TYPE_CHOICES[scriptType]) {
    showError('无效的脚本类型', `"${scriptType}" 不是有效的选项`);
    showInfo(`可选项：${Object.keys(SCRIPT_TYPE_CHOICES).join(', ')}`);
    process.exit(1);
  }

  const agentConfig = AGENT_CONFIG?.[selectedAi]?.agentConfig;
  const skillConfig = AGENT_CONFIG?.[selectedAi]?.skillConfig;

  const projectPath = options.project ? resolve(cwd(), options.project) : cwd();
  const templatesRoot = join(projectPath, '.specify', 'templates');
  const commandsRoot = join(templatesRoot, 'commands');

  if (!existsSync(templatesRoot)) {
    showError('缺少 Specify 模板', `未找到 ${templatesRoot}\n请先运行 spec-ts init 初始化项目`);
    process.exit(1);
  }

  await mkdir(commandsRoot, { recursive: true });

  const manifestSpinner = ora(`拉取命令包 ${finalPackageName} 元数据`).start();
  let manifest: CommandPackageManifest;
  try {
    manifest = await fetchManifest(metaUrl);
    validateManifest(manifest);
    manifestSpinner.succeed(`命令包 ${finalPackageName} 元数据获取成功`);
  } catch (error) {
    manifestSpinner.fail('元数据获取失败');
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const reason = error.response?.statusText ?? error.message;
      showError(
        '拉取失败',
        `请求 ${metaUrl} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '') + '）' : ''}`,
      );
    } else if (error instanceof Error) {
      showError('拉取失败', error.message);
    } else {
      showError('拉取失败', String(error));
    }
    process.exit(1);
  }

  if (manifest.package && manifest.package !== finalPackageName) {
    showWarning(`包名不一致：manifest 中为 "${manifest.package}"，请求为 "${finalPackageName}"`);
  }

  // 只有当 templates 存在且不为空时，才检查命令的依赖关系
  if (manifest.templates && manifest.templates.length > 0) {
    const templateIds = new Set(manifest.templates.map(template => template.id));
    for (const commandEntry of manifest.commands) {
      if (!commandEntry.requires) {
        continue;
      }

      for (const requiredId of commandEntry.requires) {
        if (!templateIds.has(requiredId)) {
          showWarning(`命令 ${commandEntry.id} 依赖的模板 ${requiredId} 未在 manifest.templates 中声明`);
        }
      }
    }
  }

  const engine = new Liquid();
  const updatedFiles: string[] = [];
  const skippedFiles: string[] = [];

  const writeTemplate = async (entry: TemplateManifestEntry): Promise<void> => {
    const spinner = ora(`同步模板 ${entry.id}`).start();
    try {
      const url = buildFileUrl(packageBase, entry.file);
      const raw = await fetchText(url);
      const rendered = await engine.parseAndRender(raw, {
        manifest,
        template: entry,
        package: manifest.package,
        version: manifest.version,
      });
      const destPath = join(projectPath, entry.output);
      await mkdir(dirname(destPath), { recursive: true });

      if (existsSync(destPath) && !options.force) {
        spinner.stop();
        showWarning(`跳过模板：${relative(projectPath, destPath)} 已存在（使用 --force 覆盖）`);
        skippedFiles.push(destPath);
        return;
      }

      await writeFile(destPath, ensureTrailingNewline(rendered), 'utf8');
      spinner.succeed(`模板 ${entry.id} 已更新`);
      updatedFiles.push(destPath);
    } catch (error) {
      spinner.fail(`模板 ${entry.id} 同步失败`);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.statusText ?? error.message;
        showError(
          '下载失败',
          `请求模板 ${entry.file} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '') + '）' : ''}`,
        );
      } else if (error instanceof Error) {
        showError('下载失败', error.message);
      } else {
        showError('下载失败', String(error));
      }
      process.exit(1);
    }
  };

  const writeCommand = async (entry: CommandManifestEntry): Promise<void> => {
    const spinner = ora(`同步命令 ${entry.id}`).start();
    try {
      const url = buildFileUrl(packageBase, entry.file);
      const raw = await fetchText(url);
      const scriptConfig: ScriptMap = {
        ...(entry.scripts ?? {}),
        ...(COMMAND_SCRIPT_MAP[entry.id] ?? CHECK_PREREQUISITES_SCRIPT_MAP),
      };
      const scriptCommand = scriptConfig[scriptType] ?? '';
      const rendered = await engine.parseAndRender(raw, {
        manifest,
        command: entry,
        scripts: scriptConfig,
        'check-prerequisites-script': scriptCommand,
        scriptType,
        package: manifest.package,
        version: manifest.version,
      });

      // 如果 entry 配置了 noSpeckitPrefix，在 frontmatter 中添加该标记
      let finalContent = rendered;
      if (entry.noSpeckitPrefix) {
        finalContent = rendered.replace(/^(---\n)/, '$1noSpeckitPrefix: true\n');
      }

      const destPath = join(projectPath, entry.output);
      console.log('destPath', destPath);
      await mkdir(dirname(destPath), { recursive: true });

      if (existsSync(destPath) && !options.force) {
        spinner.stop();
        showWarning(`跳过命令：${relative(projectPath, destPath)} 已存在（使用 --force 覆盖）`);
        skippedFiles.push(destPath);
        return;
      }

      await writeFile(destPath, ensureTrailingNewline(finalContent), 'utf8');
      spinner.succeed(`命令 ${entry.id} 已更新`);
      updatedFiles.push(destPath);
    } catch (error) {
      spinner.fail(`命令 ${entry.id} 同步失败`);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.statusText ?? error.message;
        showError(
          '下载失败',
          `请求命令 ${entry.file} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '') + '）' : ''}`,
        );
      } else if (error instanceof Error) {
        showError('下载失败', error.message);
      } else {
        showError('下载失败', String(error));
      }
      process.exit(1);
    }
  };

  const writeAgent = async (entry: AgentManifestEntry): Promise<void> => {
    if (!agentConfig) {
      return;
    }

    const spinner = ora(`同步代理 ${entry.id}`).start();
    try {
      const url = buildFileUrl(packageBase, entry.file);
      const raw = await fetchText(url);
      const destPath = buildAssetOutputPath(
        agentConfig.outputDir,
        entry.output,
        entry.id,
        agentConfig.fileExt,
        entry.file,
        projectPath,
      );
      await mkdir(dirname(destPath), { recursive: true });

      if (existsSync(destPath) && !options.force) {
        spinner.stop();
        showWarning(`跳过代理：${relative(projectPath, destPath)} 已存在（使用 --force 覆盖）`);
        skippedFiles.push(destPath);
        return;
      }

      await writeFile(destPath, ensureTrailingNewline(raw), 'utf8');
      spinner.succeed(`代理 ${entry.id} 已更新`);
      updatedFiles.push(destPath);
    } catch (error) {
      spinner.fail(`代理 ${entry.id} 同步失败`);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.statusText ?? error.message;
        showError(
          '下载失败',
          `请求代理 ${entry.file} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '') + '）' : ''}`,
        );
      } else if (error instanceof Error) {
        showError('下载失败', error.message);
      } else {
        showError('下载失败', String(error));
      }
      process.exit(1);
    }
  };

  const writeSkillScript = async (
    entry: SkillManifestEntry,
    scriptEntry: SkillScriptEntry,
    skillBaseDir: string,
  ): Promise<void> => {
    const scriptSpinner = ora(`同步技能脚本 ${entry.id}/${scriptEntry.id}`).start();
    try {
      const url = buildFileUrl(packageBase, scriptEntry.file);
      const raw = await fetchText(url);
      // 从脚本文件的完整路径中提取相对于 skill 目录的路径
      // 使用 entry.id 来精确匹配 skill 目录名
      const skillDirPattern = new RegExp(`^skills/${entry.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);
      const scriptRelativePath = scriptEntry.file.replace(skillDirPattern, '');
      const scriptDestPath = join(skillBaseDir, scriptRelativePath);
      await mkdir(dirname(scriptDestPath), { recursive: true });

      if (existsSync(scriptDestPath) && !options.force) {
        scriptSpinner.stop();
        showWarning(`跳过脚本：${relative(projectPath, scriptDestPath)} 已存在（使用 --force 覆盖）`);
        skippedFiles.push(scriptDestPath);
        return;
      }

      await writeFile(scriptDestPath, ensureTrailingNewline(raw), 'utf8');
      scriptSpinner.succeed(`技能脚本 ${entry.id}/${scriptEntry.id} 已更新`);
      updatedFiles.push(scriptDestPath);
    } catch (error) {
      scriptSpinner.fail(`技能脚本 ${entry.id}/${scriptEntry.id} 同步失败`);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.statusText ?? error.message;
        showError(
          '下载失败',
          `请求脚本 ${scriptEntry.file} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '') + '）' : ''}`,
        );
      } else if (error instanceof Error) {
        showError('下载失败', error.message);
      } else {
        showError('下载失败', String(error));
      }
      process.exit(1);
    }
  };

  const writeSkill = async (entry: SkillManifestEntry): Promise<void> => {
    if (!skillConfig) {
      return;
    }

    const spinner = ora(`同步技能 ${entry.id}`).start();
    try {
      const url = buildFileUrl(packageBase, entry.file);
      const raw = await fetchText(url);
      const destPath = buildAssetOutputPath(
        skillConfig.outputDir,
        entry.output,
        entry.id,
        skillConfig.fileExt,
        entry.file,
        projectPath,
      );
      await mkdir(dirname(destPath), { recursive: true });

      if (existsSync(destPath) && !options.force) {
        spinner.stop();
        showWarning(`跳过技能：${relative(projectPath, destPath)} 已存在（使用 --force 覆盖）`);
        skippedFiles.push(destPath);
      } else {
        await writeFile(destPath, ensureTrailingNewline(raw), 'utf8');
        spinner.succeed(`技能 ${entry.id} 已更新`);
        updatedFiles.push(destPath);
      }

      // 处理技能下的 scripts 文件
      if (entry.scripts && entry.scripts.length > 0) {
        // skill 的基础目录（不包含文件名）
        const skillBaseDir = dirname(destPath);
        for (const scriptEntry of entry.scripts) {
          await writeSkillScript(entry, scriptEntry, skillBaseDir);
        }
      }
    } catch (error) {
      spinner.fail(`技能 ${entry.id} 同步失败`);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.statusText ?? error.message;
        showError(
          '下载失败',
          `请求技能 ${entry.file} 失败${status ? `（HTTP ${status}` + (reason ? ` ${reason}` : '）') : ''}`,
        );
      } else if (error instanceof Error) {
        showError('下载失败', error.message);
      } else {
        showError('下载失败', String(error));
      }
      process.exit(1);
    }
  };

  if (manifest.templates && manifest.templates.length > 0) {
    for (const templateEntry of manifest.templates) {
      await writeTemplate(templateEntry);
    }
  }

  console.log('manifest.commands', manifest.commands);

  for (const commandEntry of manifest.commands) {
    await writeCommand(commandEntry);
  }

  if (manifest.agents && manifest.agents.length > 0 && agentConfig) {
    for (const agentEntry of manifest.agents) {
      await writeAgent(agentEntry);
    }
  }

  if (manifest.skills && manifest.skills.length > 0 && skillConfig) {
    for (const skillEntry of manifest.skills) {
      await writeSkill(skillEntry);
    }
  }

  const renderSpinner = ora(`更新 ${selectedAi} 代理命令`).start();
  try {
    await renderAgentCommands(projectPath, selectedAi, scriptType);
    renderSpinner.succeed(`${selectedAi} 代理命令已更新`);
  } catch (error) {
    renderSpinner.fail(`${selectedAi} 代理命令更新失败`);
    if (error instanceof Error) {
      showWarning(error.message);
    } else {
      showWarning(String(error));
    }
  }

  if (updatedFiles.length > 0) {
    showInfo('已更新文件：');
    for (const file of updatedFiles) {
      console.log(`  - ${relative(projectPath, file)}`);
    }
  }

  if (skippedFiles.length > 0) {
    showWarning('以下文件因已存在而被跳过：');
    for (const file of skippedFiles) {
      console.log(`  - ${relative(projectPath, file)}`);
    }
  }

  showSuccess(`命令包 ${finalPackageName} 同步完成`);
}
