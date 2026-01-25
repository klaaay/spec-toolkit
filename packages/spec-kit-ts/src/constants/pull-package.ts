import { ScriptMap } from '../types/pull-package.js';

export const DEFAULT_REGISTRY_URL = 'http://localhost:3000/commands-packages';

export const CHECK_PREREQUISITES_SCRIPT_MAP: ScriptMap = {
  sh: 'scripts/bash/check-prerequisites.sh --json --paths-only',
  ps: 'scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly',
};

export const COMMAND_SCRIPT_MAP: Record<string, ScriptMap> = {
  'fe-definition-gen.run': {
    sh: 'scripts/bash/check-prerequisites.sh --json --paths-only',
    ps: 'scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly',
  },
  'fe-figma-gen.run': {
    sh: 'scripts/bash/check-prerequisites.sh --json --paths-only',
    ps: 'scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly',
  },
  'fe-rule.run': {
    sh: 'scripts/bash/check-prerequisites.sh --json --paths-only',
    ps: 'scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly',
  },
};
