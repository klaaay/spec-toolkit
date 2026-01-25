export type PluginKind = 'figma' | 'browser';

export interface PluginCapability {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface PluginInstallationGuide {
  readonly prerequisites?: ReadonlyArray<string>;
  readonly steps: ReadonlyArray<string>;
  readonly notes?: ReadonlyArray<string>;
}

export interface PluginMedia {
  /** 媒体类型：图片或视频 */
  readonly type: 'image' | 'video';
  /** 媒体资源 URL */
  readonly url: string;
  /** 替代文本（用于图片的 alt 属性和无障碍访问） */
  readonly alt?: string;
  /** 媒体说明文字（可选的标题或描述） */
  readonly caption?: string;
}

export interface PluginInfo {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly description: string;
  readonly kind: PluginKind;
  readonly repositoryPath?: string;
  readonly tags?: ReadonlyArray<string>;
  /** 展示的图片或视频资源，会显示在主要能力部分的上方 */
  readonly media?: ReadonlyArray<PluginMedia>;
  readonly capabilities: ReadonlyArray<PluginCapability>;
  readonly installation: PluginInstallationGuide;
  /** 外部链接，如果配置了此字段，卡片点击时会打开外链而不是内部详情页 */
  readonly externalLink?: string;
}

export const plugins: ReadonlyArray<PluginInfo> = [];

export function findPluginById(id: string): PluginInfo | undefined {
  return plugins.find(plugin => plugin.id === id);
}
