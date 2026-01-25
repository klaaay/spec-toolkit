/**
 * 脚本类型选项
 */
export const SCRIPT_TYPE_CHOICES = {
  sh: 'POSIX Shell (bash/zsh)',
  ps: 'PowerShell',
} as const;

export type ScriptType = keyof typeof SCRIPT_TYPE_CHOICES;
export type ScriptMap = Partial<Record<ScriptType, string>>;

export interface PullPackageOptions {
  registry?: string;
  ai?: string;
  script?: ScriptType;
  project?: string;
  force?: boolean;
}

/**
 * 命令包模板条目
 */
export interface TemplateManifestEntry {
  id: string;
  file: string;
  output: string;
}

/**
 * 命令模板条目
 */
export interface CommandManifestEntry {
  id: string;
  file: string;
  output: string;
  description?: string;
  scripts?: Record<string, string>;
  requires?: string[];
  noSpeckitPrefix?: boolean;
}

export interface AgentManifestEntry {
  id: string;
  file: string;
  output?: string;
  description?: string;
}

/**
 * Skill 脚本条目
 */
export interface SkillScriptEntry {
  id: string;
  file: string;
  description?: string;
}

export interface SkillManifestEntry {
  id: string;
  file: string;
  output?: string;
  description?: string;
  scripts?: SkillScriptEntry[];
}

/**
 * 命令包元数据
 */
export interface CommandPackageManifest {
  package: string;
  version: string;
  commands: CommandManifestEntry[];
  templates?: TemplateManifestEntry[];
  agents?: AgentManifestEntry[];
  skills?: SkillManifestEntry[];
}
