import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execaCommand } from 'execa';

/**
 * Claude CLI 本地路径（迁移后）
 */
const CLAUDE_LOCAL_PATH = join(homedir(), '.claude', 'local', 'claude');

/**
 * 检查工具是否已安装
 *
 * @param tool - 工具名称
 * @returns 工具是否可用
 */
export async function checkTool(tool: string): Promise<boolean> {
  // Claude CLI 特殊处理（参考 spec-kit issue #123）
  // migrate-installer 命令会移除原始可执行文件并创建别名
  if (tool === 'claude') {
    if (existsSync(CLAUDE_LOCAL_PATH)) {
      return true;
    }
  }

  try {
    await execaCommand(`which ${tool}`, { shell: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查是否为 Git 仓库
 *
 * @param path - 要检查的路径
 * @returns 是否为 Git 仓库
 */
export async function isGitRepo(path?: string): Promise<boolean> {
  try {
    await execaCommand('git rev-parse --is-inside-work-tree', {
      cwd: path,
      shell: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * 初始化 Git 仓库
 *
 * @param projectPath - 项目路径
 * @returns 初始化是否成功及错误信息
 */
export async function initGitRepo(projectPath: string): Promise<{ success: boolean; error?: string }> {
  try {
    await execaCommand('git init', { cwd: projectPath, shell: true });
    await execaCommand('git add .', { cwd: projectPath, shell: true });
    await execaCommand('git commit -m "Initial commit from Specify template"', {
      cwd: projectPath,
      shell: true,
    });
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMsg };
  }
}

/**
 * 确保脚本具有可执行权限（仅 Unix 系统）
 *
 * @param scriptsPath - 脚本目录路径
 */
export async function ensureExecutableScripts(scriptsPath: string): Promise<void> {
  // Windows 系统跳过
  if (process.platform === 'win32') {
    return;
  }

  try {
    // 递归查找所有 .sh 文件并添加执行权限
    await execaCommand(`find "${scriptsPath}" -type f -name "*.sh" -exec chmod +x {} \\;`, { shell: true });
  } catch (error) {
    console.warn('设置脚本执行权限失败:', error);
  }
}
