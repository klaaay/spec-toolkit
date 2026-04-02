export interface ToolkitConfig {
  baseUrl?: string;
  figmaToken?: string;
}

export interface CommandRuntimeOptions {
  baseUrl?: string;
  token?: string;
}

export interface RequestConfig {
  method: 'GET';
  url: string;
  headers: Record<string, string>;
  params?: Record<string, unknown>;
}

export interface RequestResponse<T = unknown> {
  data: T;
}

export type RequestLike = <T = unknown>(config: RequestConfig) => Promise<RequestResponse<T>>;

export interface FigmaImagesResponse {
  err?: string | null;
  images: Record<string, string | null>;
}
