/* eslint-disable react-func/max-lines-per-function */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import chalk from 'chalk';
import { type InitOptions } from '../types/index.js';
import { copyLocalTemplate } from '../utils/template.js';
import { checkTool, ensureExecutableScripts, initGitRepo, isGitRepo } from '../utils/tools.js';
import { showError, showInfo, showSuccess, showWarning, StepTracker } from '../utils/ui.js';
import { SCRIPT_TYPE_CHOICES } from '../types/pull-package.js';
import { AGENT_CONFIG } from '../constants/index.js';
import { DEFAULT_REGISTRY_URL } from '../constants/pull-package.js';

/**
 * Init 命令处理函数
 *
 * @param projectName - 项目名称
 * @param options - 命令选项
 */
export async function initCommand(projectName: string | undefined, options: InitOptions): Promise<void> {
  // 处理 --here 标志
  const isHere = options.here || projectName === '.';
  if (isHere && projectName && projectName !== '.') {
    showError('参数错误', '不能同时指定项目名称和 --here 标志');
    process.exit(1);
  }

  if (!isHere && !projectName) {
    showError('参数错误', '必须指定项目名称、使用 "." 表示当前目录，或使用 --here 标志');
    process.exit(1);
  }

  // 确定项目路径
  let projectPath: string;
  let finalProjectName: string;

  if (isHere) {
    projectPath = cwd();
    finalProjectName = projectPath.split('/').pop() || 'project';

    // 检查当前目录是否为空
    const existingItems = readdirSync(projectPath);
    if (existingItems.length > 0) {
      showWarning(`当前目录不为空 (${existingItems.length} 个文件/文件夹)`);
      showWarning('模板文件将与现有内容合并，可能覆盖现有文件');

      if (!options.force) {
        showInfo('使用 --force 标志跳过此确认');
        // 这里应该添加交互式确认，暂时跳过
      }
    }
  } else {
    projectPath = resolve(cwd(), projectName!);
    finalProjectName = projectName!;

    if (existsSync(projectPath)) {
      showError('目录冲突', `目录 "${projectName}" 已存在\n请选择不同的项目名称或删除现有目录`);
      process.exit(1);
    }
  }

  // 显示项目信息
  console.log(chalk.cyan.bold('\n📦 Specify 项目设置\n'));
  console.log(`项目名称：    ${chalk.green(finalProjectName)}`);
  console.log(`工作目录：    ${chalk.dim(cwd())}`);
  if (!isHere) {
    console.log(`目标路径：    ${chalk.dim(projectPath)}`);
  }
  console.log();

  // 检查 Git
  const shouldInitGit = !options.noGit && (await checkTool('git'));
  if (!shouldInitGit && !options.noGit) {
    showWarning('未找到 Git - 将跳过仓库初始化');
  }

  // 选择 AI 助手
  let selectedAi = options.ai;
  if (!selectedAi) {
    showInfo('请在命令中使用 --ai 参数指定 AI 助手');
    showInfo(`可选项：${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }

  if (!AGENT_CONFIG[selectedAi]) {
    showError('无效的 AI 助手', `"${selectedAi}" 不是有效的选项`);
    showInfo(`可选项：${Object.keys(AGENT_CONFIG).join(', ')}`);
    process.exit(1);
  }

  // 检查 AI 工具
  if (!options.ignoreAgentTools) {
    const agentConfig = AGENT_CONFIG[selectedAi];
    if (agentConfig.requiresCli) {
      const toolAvailable = await checkTool(selectedAi);
      if (!toolAvailable) {
        showError(
          '代理检测错误',
          `未找到 ${selectedAi}\n安装地址：${agentConfig.installUrl}\n\n提示：使用 --ignore-agent-tools 跳过此检查`,
        );
        process.exit(1);
      }
    }
  }

  // 选择脚本类型
  const selectedScript = options.script || (process.platform === 'win32' ? 'ps' : 'sh');
  if (!SCRIPT_TYPE_CHOICES[selectedScript]) {
    showError('无效的脚本类型', `"${selectedScript}" 不是有效的选项`);
    process.exit(1);
  }

  console.log(`选择的 AI 助手：${chalk.cyan(selectedAi)}`);
  console.log(`选择的脚本类型：${chalk.cyan(selectedScript)}`);
  console.log();

  // 创建步骤追踪器
  const tracker = new StepTracker();
  tracker.addStep('precheck', '检查必需工具');
  tracker.completeStep('precheck', '完成');
  tracker.addStep('ai-select', '选择 AI 助手');
  tracker.completeStep('ai-select', selectedAi);
  tracker.addStep('script-select', '选择脚本类型');
  tracker.completeStep('script-select', selectedScript);
  tracker.addStep('copy-template', '复制模板文件');
  tracker.addStep('chmod', '设置脚本权限');
  tracker.addStep('git', '初始化 Git 仓库');
  tracker.addStep('final', '完成');

  try {
    // 复制本地模板
    tracker.startStep('copy-template');
    await copyLocalTemplate(projectPath, selectedAi, selectedScript, isHere);
    tracker.completeStep('copy-template', '完成');

    // 设置脚本权限
    tracker.startStep('chmod');
    const scriptsPath = resolve(projectPath, '.specify/scripts');
    await ensureExecutableScripts(scriptsPath);
    tracker.completeStep('chmod', '完成');

    // 初始化 Git
    if (!options.noGit) {
      tracker.startStep('git');
      const isExistingRepo = await isGitRepo(projectPath);
      if (isExistingRepo) {
        tracker.completeStep('git', '检测到现有仓库');
      } else if (shouldInitGit) {
        const { success, error } = await initGitRepo(projectPath);
        if (success) {
          tracker.completeStep('git', '已初始化');
        } else {
          tracker.errorStep('git', '初始化失败');
          if (error) {
            showWarning(`Git 初始化失败：${error}`);
          }
        }
      } else {
        tracker.completeStep('git', 'Git 不可用');
      }
    } else {
      tracker.completeStep('git', '已跳过 (--no-git)');
    }

    tracker.completeStep('final', '项目就绪');
    tracker.render();

    showSuccess('\n项目创建成功！\n');

    // AI 代理目录安全提示
    const agentConfig = AGENT_CONFIG[selectedAi];
    if (agentConfig) {
      console.log(chalk.yellow.bold('⚠ AI 代理目录安全提示'));
      console.log(`部分代理可能会在项目中的 ${chalk.cyan(agentConfig.folder)} 目录保存凭据、令牌等敏感信息。`);
      console.log(
        `请考虑将 ${chalk.cyan(agentConfig.folder)}（或其中的部分）加入 ${chalk.cyan('.gitignore')} 以避免泄露。\n`,
      );
    }

    // 显示后续步骤
    console.log(chalk.cyan.bold('📝 后续步骤:\n'));
    if (!isHere) {
      console.log(`1. 进入项目目录：${chalk.cyan(`cd ${finalProjectName}`)}`);
    } else {
      console.log('1. 你已经在项目目录中！');
    }
    let nextStepIndex = 2;

    if (selectedAi === 'codex') {
      console.log(`${nextStepIndex}. 在运行 Codex 前设置环境变量 CODEX_HOME：`);
      console.log(`   macOS/Linux: ${chalk.cyan('export CODEX_HOME="$(pwd)/.codex"')}`);
      console.log(`   Windows: ${chalk.cyan('setx CODEX_HOME "%cd%\\.codex"')}`);
      nextStepIndex += 1;
    }

    console.log(`${nextStepIndex}. 开始使用 AI 代理的斜杠命令：`);
    console.log(`   - ${chalk.cyan('/speckit.constitution')} - 建立项目原则`);
    console.log(`   - ${chalk.cyan('/speckit.specify')} - 创建基线规范`);
    console.log(`   - ${chalk.cyan('/speckit.plan')} - 创建实施计划`);
    console.log(`   - ${chalk.cyan('/speckit.tasks')} - 生成可执行任务`);
    console.log(`   - ${chalk.cyan('/speckit.implement')} - 执行实施`);
    console.log();

    nextStepIndex += 1;
    console.log(`${nextStepIndex}. 安装更多命令包（可选）：`);
    console.log(`   访问命令包仓库：${chalk.cyan(DEFAULT_REGISTRY_URL)}`);
    console.log(`   使用 ${chalk.cyan('spec-ts pull-package <包名> --ai ' + selectedAi)} 安装命令包`);
    console.log(`   示例：${chalk.cyan('spec-ts pull-package fe --ai ' + selectedAi)} - 安装前端工程化命令包`);
    console.log();
    // console.log(`   - ${chalk.cyan('/speckit.fe-rule.wizard')} - 交互式完善前端工程规则模板`);
    // console.log(`   - ${chalk.cyan('/speckit.fe-rule.scan')} - 扫描仓库推断前端工程规则`);
    // console.log(`   - ${chalk.cyan('/speckit.fe-rule.run')} - 根据规则实现前端需求代码`);
    // console.log(`   - ${chalk.cyan('/speckit.fe-figma-gen.wizard')} - 交互式补全 Figma 约束及公用色值命名规范`);
    // console.log(`   - ${chalk.cyan('/speckit.fe-figma-gen.scan')} - 扫描仓库生成 Figma 构建约束与共享色值 Token`);
    // console.log(`   - ${chalk.cyan('/speckit.fe-figma-gen.run')} - 按约束生成页面/组件并匹配代码库现有变量`);
    // console.log(
    //   `   - ${chalk.cyan('/speckit.fe-definition-gen.run')} - 基于后端接口定义自动生成前端请求封装与 UI 逻辑`,
    // );
    console.log();
  } catch (error) {
    tracker.errorStep('final', '失败');
    tracker.render();
    showError('初始化失败', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
