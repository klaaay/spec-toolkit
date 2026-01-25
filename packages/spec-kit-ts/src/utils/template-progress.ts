/* eslint-disable react-func/max-lines-per-function */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ScriptType } from '../types/pull-package.js';

export interface ParsedCommandTemplate {
  description: string;
  scripts: Record<string, string>;
  agentScripts: Record<string, string>;
  hookScripts: Record<string, Record<string, string>>;
  cleanedFrontmatter: string;
  body: string;
  noSpeckitPrefix: boolean;
}

function rewriteTemplatePaths(content: string): string {
  return content
    .replace(/(?<!\.specify\/)memory\//g, '.specify/memory/')
    .replace(/(?<!\.specify\/)scripts\//g, '.specify/scripts/')
    .replace(/(?<!\.specify\/)templates\//g, '.specify/templates/');
}

function replaceAll(content: string, search: string, replacement: string): string {
  return content.split(search).join(replacement);
}

function parseKeyValue(line: string): [string, string] | null {
  const trimmed = line.trim();
  const separatorIndex = trimmed.indexOf(':');
  if (separatorIndex === -1) {
    return null;
  }
  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();
  if (!key) {
    return null;
  }
  return [key, value];
}

export async function parseCommandTemplate(filePath: string): Promise<ParsedCommandTemplate> {
  const raw = await readFile(filePath, 'utf8');
  const normalized = raw.replace(/\r/g, '');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`模板缺少 YAML 头部：${filePath}`);
  }

  const frontmatter = match[1];
  const body = match[2];
  const lines = frontmatter.split('\n');
  const scripts: Record<string, string> = {};
  const agentScripts: Record<string, string> = {};
  const hookScripts: Record<string, Record<string, string>> = {};
  const retainedLines: string[] = [];
  let description = '';
  let noSpeckitPrefix = false;
  let currentSection: 'scripts' | 'agent_scripts' | 'hook_scripts' | null = null;
  let currentHookPlaceholder: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      retainedLines.push(line);
      continue;
    }

    if (!line.startsWith(' ')) {
      currentSection = null;
      currentHookPlaceholder = null;
      if (line.startsWith('description:')) {
        const [, value] = parseKeyValue(line) ?? ['description', ''];
        description = value ?? '';
        retainedLines.push(line);
        continue;
      }

      if (line.startsWith('noSpeckitPrefix:')) {
        const [, value] = parseKeyValue(line) ?? ['noSpeckitPrefix', ''];
        noSpeckitPrefix = value === 'true';
        continue;
      }

      if (line.startsWith('scripts:')) {
        currentSection = 'scripts';
        continue;
      }

      if (line.startsWith('agent_scripts:')) {
        currentSection = 'agent_scripts';
        continue;
      }

      if (line.startsWith('hook_scripts:')) {
        currentSection = 'hook_scripts';
        continue;
      }

      retainedLines.push(line);
      continue;
    }

    if (!currentSection) {
      retainedLines.push(line);
      continue;
    }

    if (currentSection === 'hook_scripts') {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      if (!line.startsWith('    ')) {
        if (trimmed.endsWith(':')) {
          const placeholder = trimmed.slice(0, trimmed.length - 1).trim();
          if (placeholder) {
            currentHookPlaceholder = placeholder;
            if (!hookScripts[currentHookPlaceholder]) {
              hookScripts[currentHookPlaceholder] = {};
            }
          }
        }
        continue;
      }

      if (!currentHookPlaceholder) {
        continue;
      }

      const keyValue = parseKeyValue(trimmed);
      if (!keyValue) {
        continue;
      }
      const [hookKey, hookValue] = keyValue;
      hookScripts[currentHookPlaceholder][hookKey] = hookValue;
      continue;
    }

    const keyValue = parseKeyValue(line);
    if (!keyValue) {
      continue;
    }
    const [key, value] = keyValue;
    if (currentSection === 'scripts') {
      scripts[key] = value;
    } else if (currentSection === 'agent_scripts') {
      agentScripts[key] = value;
    }
  }

  while (retainedLines.length && !retainedLines[retainedLines.length - 1].trim()) {
    retainedLines.pop();
  }

  const cleanedFrontmatter = retainedLines.join('\n');

  return {
    description,
    scripts,
    agentScripts,
    hookScripts,
    cleanedFrontmatter,
    body,
    noSpeckitPrefix,
  };
}

export interface RenderCommandBodyOptions {
  scriptCommand: string;
  agentScriptCommand?: string;
  hookScriptCommands?: Record<string, string>;
  argFormat: string;
  aiAssistant: string;
}

export function renderCommandBody(parsed: ParsedCommandTemplate, options: RenderCommandBodyOptions): string {
  const { scriptCommand, agentScriptCommand, hookScriptCommands = {}, argFormat, aiAssistant } = options;

  let processedBody = parsed.body;
  processedBody = replaceAll(processedBody, '{SCRIPT}', scriptCommand);
  if (agentScriptCommand) {
    processedBody = replaceAll(processedBody, '{AGENT_SCRIPT}', agentScriptCommand);
  }
  for (const [placeholder, command] of Object.entries(hookScriptCommands)) {
    if (command) {
      processedBody = replaceAll(processedBody, `{${placeholder}}`, command);
    }
  }
  processedBody = replaceAll(processedBody, '{ARGS}', argFormat);
  processedBody = replaceAll(processedBody, '__AGENT__', aiAssistant);

  return rewriteTemplatePaths(processedBody).trimEnd();
}

export function resolveHookScriptCommands(
  parsed: ParsedCommandTemplate,
  scriptType: ScriptType,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [placeholder, scripts] of Object.entries(parsed.hookScripts ?? {})) {
    const command = scripts?.[scriptType];
    if (command) {
      result[placeholder] = command;
    }
  }
  return result;
}

export function withScriptExtension(fileName: string, ext: string): string {
  const nameWithoutExt = fileName.replace(path.extname(fileName), '');
  return `${nameWithoutExt}.${ext}`;
}
