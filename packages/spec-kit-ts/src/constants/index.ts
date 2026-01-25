import { AgentConfig } from '../types/index.js';

/**
 * 所有支持的 AI 代理配置
 * 注意：只包含已内置模板的 AI 助手
 */
export const AGENT_CONFIG: Record<string, AgentConfig> = {
  claude: {
    name: 'Claude Code',
    folder: '.claude/',
    installUrl: 'https://docs.anthropic.com/en/docs/claude-code/setup',
    requiresCli: true,
    commandConfig: {
      outputDir: '.claude/commands',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.claude/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.claude/skills',
      fileExt: 'md',
    },
  },
  gemini: {
    name: 'Gemini CLI',
    folder: '.gemini/',
    installUrl: 'https://github.com/google-gemini/gemini-cli',
    requiresCli: true,
    commandConfig: {
      outputDir: '.gemini/commands',
      fileExt: 'toml',
      argFormat: '{{args}}',
    },
    agentConfig: {
      outputDir: '.gemini/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.gemini/skills',
      fileExt: 'md',
    },
  },
  copilot: {
    name: 'GitHub Copilot',
    folder: '.github/',
    installUrl: null,
    requiresCli: false,
    commandConfig: {
      outputDir: '.github/prompts',
      fileExt: 'prompt.md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.github/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.github/skills',
      fileExt: 'md',
    },
  },
  'cursor-agent': {
    name: 'Cursor',
    folder: '.cursor/',
    installUrl: null,
    requiresCli: false,
    commandConfig: {
      outputDir: '.cursor/commands',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.cursor/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.cursor/skills',
      fileExt: 'md',
    },
  },
  qwen: {
    name: 'Qwen Code',
    folder: '.qwen/',
    installUrl: 'https://github.com/QwenLM/qwen-code',
    requiresCli: true,
    commandConfig: {
      outputDir: '.qwen/commands',
      fileExt: 'toml',
      argFormat: '{{args}}',
    },
    agentConfig: {
      outputDir: '.qwen/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.qwen/skills',
      fileExt: 'md',
    },
  },
  opencode: {
    name: 'opencode',
    folder: '.opencode/',
    installUrl: 'https://opencode.ai',
    requiresCli: true,
    commandConfig: {
      outputDir: '.opencode/command',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.opencode/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.opencode/skills',
      fileExt: 'md',
    },
  },
  windsurf: {
    name: 'Windsurf',
    folder: '.windsurf/',
    installUrl: null,
    requiresCli: false,
    commandConfig: {
      outputDir: '.windsurf/workflows',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.windsurf/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.windsurf/skills',
      fileExt: 'md',
    },
  },
  codex: {
    name: 'Codex CLI',
    folder: '.codex/',
    installUrl: 'https://github.com/openai/codex',
    requiresCli: true,
    commandConfig: {
      outputDir: '.codex/prompts',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.codex/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.codex/skills',
      fileExt: 'md',
    },
  },
  kilocode: {
    name: 'Kilo Code',
    folder: '.kilocode/',
    installUrl: null,
    requiresCli: false,
    commandConfig: {
      outputDir: '.kilocode/workflows',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.kilocode/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.kilocode/skills',
      fileExt: 'md',
    },
  },
  auggie: {
    name: 'Auggie CLI',
    folder: '.augment/',
    installUrl: 'https://docs.augmentcode.com/cli/setup-auggie/install-auggie-cli',
    requiresCli: true,
    commandConfig: {
      outputDir: '.augment/commands',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.augment/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.augment/skills',
      fileExt: 'md',
    },
  },
  roo: {
    name: 'Roo Code',
    folder: '.roo/',
    installUrl: null,
    requiresCli: false,
    commandConfig: {
      outputDir: '.roo/commands',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.roo/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.roo/skills',
      fileExt: 'md',
    },
  },
  codebuddy: {
    name: 'CodeBuddy',
    folder: '.codebuddy/',
    installUrl: 'https://www.codebuddy.ai/cli',
    requiresCli: true,
    commandConfig: {
      outputDir: '.codebuddy/commands',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.codebuddy/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.codebuddy/skills',
      fileExt: 'md',
    },
  },
  q: {
    name: 'Amazon Q Developer CLI',
    folder: '.amazonq/',
    installUrl: 'https://aws.amazon.com/developer/learning/q-developer-cli/',
    requiresCli: true,
    commandConfig: {
      outputDir: '.amazonq/prompts',
      fileExt: 'md',
      argFormat: '$ARGUMENTS',
    },
    agentConfig: {
      outputDir: '.amazonq/agents',
      fileExt: 'md',
    },
    skillConfig: {
      outputDir: '.amazonq/skills',
      fileExt: 'md',
    },
  },
};
