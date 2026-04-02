interface ParsedFigmaInput {
  fileKey: string;
  ids?: string;
  isLink: boolean;
}

interface ResolveFigmaRequestTargetOptions {
  input: string;
  ids?: string;
  requireIds?: boolean;
}

const FIGMA_HOSTS = new Set(['figma.com', 'www.figma.com']);
const FIGMA_ROUTE_NAMES = new Set(['design', 'file', 'proto', 'board', 'slides']);

function isUrl(input: string): boolean {
  return /^https?:\/\//i.test(input);
}

function normalizeNodeIds(value: string): string {
  return value
    .split(',')
    .map(id => id.trim())
    .filter(Boolean)
    .map(id => decodeURIComponent(id).replace(/-/g, ':'))
    .join(',');
}

export function parseFigmaInput(input: string): ParsedFigmaInput {
  const trimmedInput = input.trim();

  if (!isUrl(trimmedInput)) {
    return {
      fileKey: trimmedInput,
      isLink: false,
    };
  }

  const url = new URL(trimmedInput);

  if (!FIGMA_HOSTS.has(url.hostname)) {
    throw new Error('仅支持 figma.com 链接或直接传 fileKey');
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const routeName = segments[0];

  if (!routeName || !FIGMA_ROUTE_NAMES.has(routeName)) {
    throw new Error('无法从该 Figma 链接中解析 fileKey');
  }

  const fileKey = segments[2] === 'branch' && segments[3] ? segments[3] : segments[1];

  if (!fileKey) {
    throw new Error('无法从该 Figma 链接中解析 fileKey');
  }

  const nodeId = url.searchParams.get('node-id') || url.searchParams.get('node_id');

  return {
    fileKey,
    ids: nodeId ? normalizeNodeIds(nodeId) : undefined,
    isLink: true,
  };
}

export function resolveFigmaRequestTarget(options: ResolveFigmaRequestTargetOptions): ParsedFigmaInput {
  const parsedInput = parseFigmaInput(options.input);
  const resolvedIds = options.ids?.trim() || parsedInput.ids;

  if (options.requireIds && !resolvedIds) {
    throw new Error('未提供节点 ID，请传 --ids 或直接传带 node-id 的 Figma 链接');
  }

  return {
    ...parsedInput,
    ids: resolvedIds,
  };
}
