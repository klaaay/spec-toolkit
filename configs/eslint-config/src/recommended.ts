import { createGlobalBaseConfig } from './base';
import type { CreateConfigOptions, Rule, Rules } from './interface';
import { normalizeOptions } from './options';
import { createTSConfig } from './typescript';

export function createRecommendConfig({
  globalIgnores = [],
  plugins = {},
  rules = {},
  ...opts
}: CreateConfigOptions = {}) {
  const options = normalizeOptions(opts);

  const globalIgnoreConfig: Rule = {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.git/**', ...globalIgnores],
  };

  const configs: Rules = [
    globalIgnoreConfig,
    createGlobalBaseConfig({
      plugins,
      rules,
    }),
    // tsx
    createTSConfig({
      files: ['**/*.tsx'],
      tsPluginParserOptions: options,
      tsx: true,
    }),
    // ts
    createTSConfig({
      files: ['**/*.ts'],
      tsPluginParserOptions: options,
    }),
    // jsx
    {
      files: ['**/*.jsx'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    // js
    {
      files: ['**/*.js'],
    },
  ];

  return configs;
}
