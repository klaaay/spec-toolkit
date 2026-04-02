import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import axios from 'axios';

interface DownloadFigmaImagesOptions {
  fileKey: string;
  outputDir: string;
  format: string;
  images: Record<string, string | null>;
  downloader?: (url: string) => Promise<Buffer>;
}

interface DownloadFigmaImagesResult {
  outputDir: string;
  savedFiles: string[];
  skippedNodeIds: string[];
}

function normalizeNodeIdForFileName(nodeId: string): string {
  return nodeId.replace(/:/g, '-');
}

async function defaultDownloader(url: string): Promise<Buffer> {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });

  return Buffer.from(response.data);
}

export async function downloadFigmaImages(options: DownloadFigmaImagesOptions): Promise<DownloadFigmaImagesResult> {
  const downloader = options.downloader || defaultDownloader;
  const savedFiles: string[] = [];
  const skippedNodeIds: string[] = [];

  await mkdir(options.outputDir, { recursive: true });

  for (const [nodeId, url] of Object.entries(options.images)) {
    if (!url) {
      skippedNodeIds.push(nodeId);
      continue;
    }

    const filePath = join(options.outputDir, `${normalizeNodeIdForFileName(nodeId)}.${options.format}`);
    const content = await downloader(url);

    await writeFile(filePath, content);
    savedFiles.push(filePath);
  }

  return {
    outputDir: options.outputDir,
    savedFiles,
    skippedNodeIds,
  };
}
