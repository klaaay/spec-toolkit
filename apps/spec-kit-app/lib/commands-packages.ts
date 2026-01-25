import { promises as fs } from 'fs';
import path from 'path';

export interface PackageMetaCommand {
  id: string;
  file: string;
  output: string;
  description: string;
  requires?: string[];
}

export interface PackageMetaTemplate {
  id: string;
  file: string;
  output: string;
}

export interface PackageMetaAgent {
  id: string;
  file: string;
  output?: string;
  description?: string;
}

export interface PackageMetaSkillScript {
  id: string;
  file: string;
  description?: string;
}

export interface PackageMetaSkill {
  id: string;
  file: string;
  output?: string;
  description?: string;
  scripts?: PackageMetaSkillScript[];
}

export interface PackageMetaDependencyInfo {
  name?: string;
  description?: string;
  docUrl?: string;
}

export interface PackageMetaMcpServer extends PackageMetaDependencyInfo {}

export interface PackageMeta {
  package: string;
  version?: string;
  category?: string;
  commands?: PackageMetaCommand[];
  templates?: PackageMetaTemplate[];
  agents?: PackageMetaAgent[];
  skills?: PackageMetaSkill[];
  mcpServers?: Record<string, PackageMetaMcpServer>;
  otherDependencies?: Record<string, PackageMetaDependencyInfo>;
  [key: string]: unknown;
}

export interface BaseNode {
  name: string;
  path: string;
}

export interface FileNode extends BaseNode {
  type: 'file';
  extension: string;
}

export interface DirectoryNode extends BaseNode {
  type: 'directory';
  children: Array<DirectoryNode | FileNode>;
  meta?: PackageMeta;
}

export type PackageTree = DirectoryNode;

const COMMANDS_PACKAGES_ROOT = path.join(process.cwd(), 'public', 'commands-packages');

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/');
}

async function readMetaFile(metaPath: string): Promise<PackageMeta | undefined> {
  try {
    const raw = await fs.readFile(metaPath, 'utf-8');
    const parsed = JSON.parse(raw) as PackageMeta;
    return parsed;
  } catch {
    return undefined;
  }
}

async function buildDirectoryTree(currentPath: string, relativePath = ''): Promise<DirectoryNode> {
  const entries = await fs.readdir(currentPath, { withFileTypes: true });
  const children: Array<DirectoryNode | FileNode> = [];
  let meta: PackageMeta | undefined;

  await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(currentPath, entry.name);
      const entryRelativePath = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isFile()) {
        if (entry.name === '_meta.json') {
          meta = await readMetaFile(entryPath);
          return;
        }

        children.push({
          type: 'file',
          name: entry.name,
          path: toPosixPath(entryRelativePath),
          extension: path.extname(entry.name).replace('.', '').toLowerCase(),
        });
        return;
      }

      if (entry.isDirectory()) {
        const child = await buildDirectoryTree(entryPath, entryRelativePath);
        children.push(child);
      }
    }),
  );

  children.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name, 'zh-CN');
    }

    return a.type === 'directory' ? -1 : 1;
  });

  return {
    type: 'directory',
    name: relativePath ? path.basename(currentPath) : 'commands-packages',
    path: toPosixPath(relativePath),
    children,
    meta,
  };
}

export async function getCommandsPackagesTree(): Promise<PackageTree> {
  return buildDirectoryTree(COMMANDS_PACKAGES_ROOT);
}
