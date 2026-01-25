import { ConfigBase } from 'unocss';
import { KlayUnoConfigOptions } from '../types/index.js';

export const getCommonTheme = (options?: KlayUnoConfigOptions) => {
  const { customColorConfig = {}, customScreenConfig = {} } = options || {};
  return {
    colors: {
      primary: 'var(--color-primary)',
      black: 'var(--color-black)',
      white: 'var(--color-white)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      ...customColorConfig,
    },
    breakpoints: {
      xs: '575px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
      xxxl: '1920px',
      small: '0px',
      middle: '800px',
      large: '1320px',
      customProductPage: '1435px',
      ...customScreenConfig,
    },
  } as ConfigBase['theme'];
};
