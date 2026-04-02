import axios, { AxiosError } from 'axios';

import type { RequestLike } from '../types.js';

interface ClientOptions {
  baseUrl: string;
  figmaToken?: string;
  request?: RequestLike;
}

type QueryParams = Record<string, unknown>;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

function sanitizeParams(params?: QueryParams): QueryParams | undefined {
  if (!params) {
    return undefined;
  }

  const nextParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));

  return Object.keys(nextParams).length > 0 ? nextParams : undefined;
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (error.response?.status) {
      return `请求失败，状态码 ${error.response.status}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '请求失败';
}

export function createFigmaToolkitClient(options: ClientOptions) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const request: RequestLike = options.request || (config => axios(config));

  const requestGet = async <T>(path: string, params?: QueryParams): Promise<T> => {
    if (!options.figmaToken) {
      throw new Error('未配置 Figma Token，请先执行 `figma-toolkit config set-token <token>`');
    }

    try {
      const response = await request<T>({
        method: 'GET',
        url: `${baseUrl}${path}`,
        headers: {
          'X-Figma-Token': options.figmaToken,
        },
        params: sanitizeParams(params),
      });

      return response.data;
    } catch (error) {
      throw new Error(resolveErrorMessage(error));
    }
  };

  return {
    getFile(fileKey: string, params?: QueryParams) {
      return requestGet(`/v1/files/${encodeURIComponent(fileKey)}`, params);
    },
    getFileNodes(fileKey: string, params?: QueryParams) {
      return requestGet(`/v1/files/${encodeURIComponent(fileKey)}/nodes`, params);
    },
    getImages(fileKey: string, params?: QueryParams) {
      return requestGet(`/v1/images/${encodeURIComponent(fileKey)}`, params);
    },
    getImageFills(fileKey: string) {
      return requestGet(`/v1/files/${encodeURIComponent(fileKey)}/images`);
    },
  };
}
