import { ConfigBase } from 'unocss';

export type KlayUnoConfigOptions = {
  customExtraRules?: ConfigBase['rules'];
  customColorConfig?: object;
  customScreenConfig?: object;
};
