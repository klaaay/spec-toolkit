import chalk from 'chalk';
import { checkTool } from '../utils/tools.js';
import { showSuccess, StepTracker } from '../utils/ui.js';
import { AGENT_CONFIG } from '../constants/index.js';

/**
 * Check 命令处理函数
 * 检查所有必需的工具是否已安装
 */
export async function checkCommand(): Promise<void> {
  console.log(chalk.bold('\n正在检查已安装的工具...\n'));

  const tracker = new StepTracker();

  // 检查 Git
  tracker.addStep('git', 'Git 版本控制');
  const gitOk = await checkTool('git');
  if (gitOk) {
    tracker.completeStep('git', '可用');
  } else {
    tracker.errorStep('git', '未找到');
  }

  // 检查所有 AI 代理
  const agentResults: Record<string, boolean> = {};
  for (const [agentKey, agentConfig] of Object.entries(AGENT_CONFIG)) {
    tracker.addStep(agentKey, agentConfig.name);
    const available = await checkTool(agentKey);
    agentResults[agentKey] = available;

    if (available) {
      tracker.completeStep(agentKey, '可用');
    } else {
      tracker.errorStep(agentKey, '未找到');
    }
  }

  // 检查 VS Code
  tracker.addStep('code', 'Visual Studio Code');
  const codeOk = await checkTool('code');
  if (codeOk) {
    tracker.completeStep('code', '可用');
  } else {
    tracker.errorStep('code', '未找到');
  }

  tracker.addStep('code-insiders', 'Visual Studio Code Insiders');
  const codeInsidersOk = await checkTool('code-insiders');
  if (codeInsidersOk) {
    tracker.completeStep('code-insiders', '可用');
  } else {
    tracker.errorStep('code-insiders', '未找到');
  }

  tracker.render();

  showSuccess('Specify CLI 已准备就绪！\n');

  if (!gitOk) {
    console.log(chalk.dim('提示: 安装 Git 以便进行仓库管理'));
  }

  if (!Object.values(agentResults).some(v => v)) {
    console.log(chalk.dim('提示: 安装一个 AI 助手以获得最佳体验'));
  }
}
