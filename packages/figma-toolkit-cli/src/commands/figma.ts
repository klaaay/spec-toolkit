import { join } from 'node:path';

import type { Command } from 'commander';

import { createFigmaToolkitClient } from '../lib/figma-client.js';
import { resolveFigmaRequestTarget } from '../lib/figma-input.js';
import { downloadFigmaImages } from '../lib/image-download.js';
import { printJson, printSuccess } from '../lib/output.js';
import { resolveRuntimeConfig } from '../lib/runtime-config.js';
import type { CommandRuntimeOptions, FigmaImagesResponse } from '../types.js';

function parseInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`无效的整数参数: ${value}`);
  }

  return parsed;
}

function parseFloatNumber(value: string): number {
  const parsed = Number.parseFloat(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`无效的数字参数: ${value}`);
  }

  return parsed;
}

function resolveImageOutputDir(fileKey: string, outputDir?: string): string {
  return outputDir?.trim() || join(process.cwd(), 'figma-images', fileKey);
}

async function downloadImagesToLocal(
  fileKey: string,
  response: FigmaImagesResponse,
  options: {
    format?: string;
    outputDir?: string;
  },
): Promise<void> {
  if (!response?.images || typeof response.images !== 'object') {
    throw new Error('Figma 图片接口返回格式异常，缺少 images 字段');
  }

  const format = options.format || 'png';
  const outputDir = resolveImageOutputDir(fileKey, options.outputDir);
  const result = await downloadFigmaImages({
    fileKey,
    outputDir,
    format,
    images: response.images,
  });

  printSuccess(`已下载 ${result.savedFiles.length} 个文件到 ${result.outputDir}`);

  if (result.skippedNodeIds.length > 0) {
    printJson({
      skippedNodeIds: result.skippedNodeIds,
    });
  }
}

function withConnectionOptions(command: Command): Command {
  return command
    .option('--base-url <url>', 'Figma API 服务地址，默认 https://api.figma.com')
    .option('--token <token>', '本次请求使用的 Figma Token，会覆盖本地配置');
}

async function createClientFromOptions(options: CommandRuntimeOptions) {
  const runtimeConfig = await resolveRuntimeConfig(options);

  return createFigmaToolkitClient({
    baseUrl: runtimeConfig.baseUrl!,
    figmaToken: runtimeConfig.figmaToken,
  });
}

function registerFileCommand(figmaCommand: Command): void {
  withConnectionOptions(
    figmaCommand
      .command('file <fileKeyOrLink>')
      .description('获取文件信息，对应 GET /v1/files/{file_key}，支持直接传 Figma 链接')
      .option('--version <version>', '文件版本 ID')
      .option('--ids <ids>', '要包含的节点 ID，多个用逗号分隔；若传 Figma 链接可自动取 node-id')
      .option('--depth <depth>', '遍历深度（1-5）', parseInteger)
      .option('--geometry <geometry>', '是否包含几何路径，目前支持 paths')
      .option('--plugin-data <pluginData>', '插件数据 ID')
      .option('--branch-data', '是否返回分支数据')
      .action(async (fileKeyOrLink: string, options) => {
        const target = resolveFigmaRequestTarget({
          input: fileKeyOrLink,
          ids: options.ids,
        });
        const client = await createClientFromOptions(options);
        const response = await client.getFile(target.fileKey, {
          version: options.version,
          ids: target.ids,
          depth: options.depth,
          geometry: options.geometry,
          plugin_data: options.pluginData,
          branch_data: options.branchData,
        });

        printJson(response);
      }),
  );
}

function registerNodesCommand(figmaCommand: Command): void {
  withConnectionOptions(
    figmaCommand
      .command('nodes <fileKeyOrLink>')
      .description('获取节点信息，对应 GET /v1/files/{file_key}/nodes，支持直接传 Figma 链接')
      .option('--ids <ids>', '节点 ID，多个用逗号分隔；若传 Figma 链接可自动取 node-id')
      .option('--version <version>', '文件版本 ID')
      .option('--depth <depth>', '遍历深度', parseInteger)
      .option('--geometry <geometry>', '设置为 paths 以导出矢量数据')
      .option('--plugin-data <pluginData>', '插件数据 ID')
      .action(async (fileKeyOrLink: string, options) => {
        const target = resolveFigmaRequestTarget({
          input: fileKeyOrLink,
          ids: options.ids,
          requireIds: true,
        });
        const client = await createClientFromOptions(options);
        const response = await client.getFileNodes(target.fileKey, {
          ids: target.ids,
          version: options.version,
          depth: options.depth,
          geometry: options.geometry,
          plugin_data: options.pluginData,
        });

        printJson(response);
      }),
  );
}

function registerImagesCommand(figmaCommand: Command): void {
  withConnectionOptions(
    figmaCommand
      .command('images <fileKeyOrLink>')
      .description('下载图片到本地，对应 GET /v1/images/{file_key}，支持直接传 Figma 链接')
      .option('--ids <ids>', '节点 ID，多个用逗号分隔；若传 Figma 链接可自动取 node-id')
      .option('--version <version>', '文件版本 ID')
      .option('--scale <scale>', '缩放比例（0.01-4）', parseFloatNumber)
      .option('--format <format>', '输出格式：jpg、png、svg、pdf')
      .option('--svg-outline-text', 'SVG 中文本渲染为轮廓')
      .option('--svg-include-id', 'SVG 元素包含 id 属性')
      .option('--svg-include-node-id', 'SVG 元素包含 node id 属性')
      .option('--svg-simplify-stroke', '简化 SVG 中的描边')
      .option('--use-absolute-bounds', '使用绝对边界')
      .option('--output-dir <dir>', '下载目录，默认 ./figma-images/<fileKey>')
      .action(async (fileKeyOrLink: string, options) => {
        const target = resolveFigmaRequestTarget({
          input: fileKeyOrLink,
          ids: options.ids,
          requireIds: true,
        });
        const client = await createClientFromOptions(options);
        const response = (await client.getImages(target.fileKey, {
          ids: target.ids,
          version: options.version,
          scale: options.scale,
          format: options.format,
          svg_outline_text: options.svgOutlineText,
          svg_include_id: options.svgIncludeId,
          svg_include_node_id: options.svgIncludeNodeId,
          svg_simplify_stroke: options.svgSimplifyStroke,
          use_absolute_bounds: options.useAbsoluteBounds,
        })) as FigmaImagesResponse;
        await downloadImagesToLocal(target.fileKey, response, {
          format: options.format,
          outputDir: options.outputDir,
        });
      }),
  );
}

function registerImageFillsCommand(figmaCommand: Command): void {
  withConnectionOptions(
    figmaCommand
      .command('image-fills <fileKeyOrLink>')
      .description('获取图片填充资源，对应 GET /v1/files/{file_key}/images，支持直接传 Figma 链接')
      .action(async (fileKeyOrLink: string, options) => {
        const target = resolveFigmaRequestTarget({
          input: fileKeyOrLink,
        });
        const client = await createClientFromOptions(options);
        const response = await client.getImageFills(target.fileKey);

        printJson(response);
      }),
  );
}

export function registerFigmaCommands(program: Command): void {
  const figmaCommand = program.command('figma').description('直接调用 Figma 官方 REST API');

  registerFileCommand(figmaCommand);
  registerNodesCommand(figmaCommand);
  registerImagesCommand(figmaCommand);
  registerImageFillsCommand(figmaCommand);
}
