// @ts-ignore
import { fixupPluginRules } from '@eslint/compat';
import type { Rule } from './interface';

const globals = require('globals');

const pluginKlay = require('@klaaay/eslint-plugin');
const pluginImport = require('eslint-plugin-import');
const pluginUnusedImports = require('eslint-plugin-unused-imports');
const command = require('eslint-plugin-command/config');
const parserInstance = require('@typescript-eslint/parser');

// eslint-disable-next-line react-func/max-lines-per-function
export const createGlobalBaseConfig = (
  { plugins, rules }: { plugins?: Rule['plugins']; rules?: Rule['rules'] } = {
    plugins: {},
    rules: {},
  },
) => {
  const config: Rule = {
    languageOptions: {
      ecmaVersion: 'latest', // default
      sourceType: 'module', // default
      parser: parserInstance,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.commonjs,
      },
      parserOptions: { ecmaFeatures: { globalReturn: true } },
    },
    plugins: {
      klay: pluginKlay,
      import: fixupPluginRules(pluginImport),
      ['unused-imports']: pluginUnusedImports,
      ...command()?.plugins,
      ...plugins,
    },
    rules: {
      // common rules
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'lodash',
              message: 'use lodash-es instead',
            },
          ],
        },
      ],
      'no-var': 'warn', // 禁用 var
      'no-console': 'warn', // 标记 console 和 debugger
      'no-debugger': 'warn',
      'max-lines': ['error', 400], // 单文件最大行数，不包含空白行及纯注释行
      'max-depth': ['error', 2], // function 内最大缩进数
      'no-unused-vars': 'off',
      // unused-imports
      'unused-imports/no-unused-imports': 'warn',
      // import rules
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index'], 'unknown'],
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
            {
              pattern: './*.less',
              group: 'unknown',
              position: 'after',
            },
          ],
        },
      ],
      // klay rules
      'klay/uppercase-const': 'warn',
      'klay/require-useEffect-before-return': 'warn',
      'klay/no-export-default': 'warn',
      'klay/max-params-with-fixable': [
        'warn',
        {
          max: 3,
        },
      ],
      'klay/replace-px-with-named-sizes': 'warn',
      'command/command': 'warn',
      ...rules,
    },
  };

  return config;
};
