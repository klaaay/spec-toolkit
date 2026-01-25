import { ScriptType } from './pull-package.js';

/**
 * 命令模板生成配置
 */
export interface AgentCommandConfig {
  outputDir: string;
  fileExt: string;
  argFormat: string;
}

/**
 * 代理/技能文件生成配置
 */
export interface AgentAssetConfig {
  outputDir: string;
  fileExt?: string;
}

/**
 * AI 代理配置类型
 */
export interface AgentConfig {
  /** 显示名称 */
  name: string;
  /** 配置文件夹路径 */
  folder: string;
  /** 安装 URL */
  installUrl: string | null;
  /** 是否需要 CLI 工具 */
  requiresCli: boolean;
  /** 命令模板生成配置 */
  commandConfig: AgentCommandConfig;
  /** 代理模板生成配置（可选） */
  agentConfig?: AgentAssetConfig;
  /** 技能模板生成配置（可选） */
  skillConfig?: AgentAssetConfig;
}

/**
 * Init 命令选项
 */
export interface InitOptions {
  ai?: string;
  script?: ScriptType;
  ignoreAgentTools?: boolean;
  noGit?: boolean;
  here?: boolean;
  force?: boolean;
}
