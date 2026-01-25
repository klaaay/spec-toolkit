import {
  definePreset,
  ConfigBase,
  PresetFactory,
  defineConfig,
  UserConfig,
  presetUno,
  transformerVariantGroup,
} from 'unocss';
import { getCommonShortcuts } from './shortcuts/index.js';
import { getCommonTheme } from './themes/index.js';
import { KlayUnoConfigOptions } from './types/index.js';
import { createUnoCssRules } from './utils/index.js';
import {
  COMMON_BG_TYPES,
  COMMON_BG_UNITS,
  COMMON_BLUE_COLOR_TYPES,
  COMMON_BLUE_COLOR_UNITS,
  COMMON_BORDER_SIZE_TYPES,
  COMMON_BORDER_SIZE_UNITS,
  COMMON_BORDER_TYPES,
  COMMON_BORDER_UNITS,
  COMMON_BOX_SHADOW_TYPES,
  COMMON_BOX_SHADOW_UNITS,
  COMMON_CONTROL_HEIGHT_TYPES,
  COMMON_CONTROL_HEIGHT_UNITS,
  COMMON_CONTROL_TYPES,
  COMMON_CONTROL_UNITS,
  COMMON_CYAN_COLOR_TYPES,
  COMMON_CYAN_COLOR_UNITS,
  COMMON_FILL_TYPES,
  COMMON_FILL_UNITS,
  COMMON_FONT_SIZE_TYPES,
  COMMON_FONT_SIZE_UNITS,
  COMMON_FONT_WEIGHTS_TYPES,
  COMMON_FONT_WEIGHTS_UNITS,
  COMMON_GEEK_BLUE_COLOR_TYPES,
  COMMON_GEEK_BLUE_COLOR_UNITS,
  COMMON_GOLD_COLOR_TYPES,
  COMMON_GOLD_COLOR_UNITS,
  COMMON_ICON_TYPES,
  COMMON_ICON_UNITS,
  COMMON_LIME_COLOR_TYPES,
  COMMON_LIME_COLOR_UNITS,
  COMMON_LINK_TYPES,
  COMMON_LINK_UNITS,
  COMMON_MAGENTA_COLOR_TYPES,
  COMMON_MAGENTA_COLOR_UNITS,
  COMMON_NORMAL_COLOR_TYPES,
  COMMON_NORMAL_COLOR_UNITS,
  COMMON_PURPLE_COLOR_TYPES,
  COMMON_PURPLE_COLOR_UNITS,
  COMMON_SPACE_TYPES,
  COMMON_SPACE_UNITS,
  COMMON_TEXT_TYPES,
  COMMON_TEXT_UNITS,
  COMMON_VOLCANO_COLOR_TYPES,
  COMMON_VOLCANO_COLOR_UNITS,
  COMMON_YELLOW_COLOR_TYPES,
  COMMON_YELLOW_COLOR_UNITS,
} from './rules/index.js';

export * from './rules/index.js';
export * from './themes/index.js';
export * from './shortcuts/index.js';
export * from './utils/index.js';

export const getCommonRules = (options?: KlayUnoConfigOptions): Exclude<ConfigBase['rules'], undefined> => {
  const { customExtraRules = [] } = options || {};
  return [
    createUnoCssRules(COMMON_BORDER_SIZE_TYPES, COMMON_BORDER_SIZE_UNITS),
    createUnoCssRules(COMMON_FONT_WEIGHTS_TYPES, COMMON_FONT_WEIGHTS_UNITS),
    createUnoCssRules(COMMON_FONT_SIZE_TYPES, COMMON_FONT_SIZE_UNITS),
    createUnoCssRules(COMMON_CONTROL_HEIGHT_TYPES, COMMON_CONTROL_HEIGHT_UNITS),
    createUnoCssRules(COMMON_BOX_SHADOW_TYPES, COMMON_BOX_SHADOW_UNITS),
    createUnoCssRules(COMMON_SPACE_TYPES, COMMON_SPACE_UNITS),

    createUnoCssRules(COMMON_TEXT_TYPES, COMMON_TEXT_UNITS),
    createUnoCssRules(COMMON_ICON_TYPES, COMMON_ICON_UNITS),
    createUnoCssRules(COMMON_FILL_TYPES, COMMON_FILL_UNITS),
    createUnoCssRules(COMMON_BG_TYPES, COMMON_BG_UNITS),
    createUnoCssRules(COMMON_BORDER_TYPES, COMMON_BORDER_UNITS),
    createUnoCssRules(COMMON_LINK_TYPES, COMMON_LINK_UNITS),
    createUnoCssRules(COMMON_CONTROL_TYPES, COMMON_CONTROL_UNITS),
    createUnoCssRules(COMMON_BLUE_COLOR_TYPES, COMMON_BLUE_COLOR_UNITS),
    createUnoCssRules(COMMON_CYAN_COLOR_TYPES, COMMON_CYAN_COLOR_UNITS),
    createUnoCssRules(COMMON_GEEK_BLUE_COLOR_TYPES, COMMON_GEEK_BLUE_COLOR_UNITS),
    createUnoCssRules(COMMON_GOLD_COLOR_TYPES, COMMON_GOLD_COLOR_UNITS),
    createUnoCssRules(COMMON_LIME_COLOR_TYPES, COMMON_LIME_COLOR_UNITS),
    createUnoCssRules(COMMON_MAGENTA_COLOR_TYPES, COMMON_MAGENTA_COLOR_UNITS),
    createUnoCssRules(COMMON_PURPLE_COLOR_TYPES, COMMON_PURPLE_COLOR_UNITS),
    createUnoCssRules(COMMON_VOLCANO_COLOR_TYPES, COMMON_VOLCANO_COLOR_UNITS),
    createUnoCssRules(COMMON_YELLOW_COLOR_TYPES, COMMON_YELLOW_COLOR_UNITS),
    createUnoCssRules(COMMON_NORMAL_COLOR_TYPES, COMMON_NORMAL_COLOR_UNITS),
    ...customExtraRules,
  ];
};

export const klayUnoConfigPreset: PresetFactory<object, KlayUnoConfigOptions> = definePreset(
  (options?: KlayUnoConfigOptions) => {
    return {
      name: 'klay-config',
      rules: getCommonRules(options),
      theme: getCommonTheme(options),
      shortcuts: getCommonShortcuts(),
    };
  },
);

export type { KlayUnoConfigOptions };

// 该方法用于在 uno.config.ts 中的快速使用
export const getKlayBaseConfig = ({
  config = {},
  options = {},
}: { config?: UserConfig<object>; options?: KlayUnoConfigOptions } = {}) => {
  return defineConfig({
    presets: [presetUno(), klayUnoConfigPreset(options)],
    transformers: [transformerVariantGroup()],
    ...config,
  });
};
