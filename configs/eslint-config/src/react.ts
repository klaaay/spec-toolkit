// @ts-ignore
import type { CreateConfigOptions, Rule } from './interface';
import { createRecommendConfig } from './recommended';

const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactFuncPlugin = require('eslint-plugin-react-func');
const pluginJsxA11y = require('eslint-plugin-jsx-a11y');
const reactWebAPI = require('eslint-plugin-react-web-api');

export function createReactConfig(opts: CreateConfigOptions = {}) {
  const baseConfigs = createRecommendConfig(opts);

  const { rules = [], plugins = [], settings = {} } = opts;

  const reactConfig: Rule = {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-func': reactFuncPlugin,
      react: reactPlugin,
      ['jsx-a11y']: pluginJsxA11y,
      'react-web-api': reactWebAPI,
      ...plugins,
    },
    rules: {
      // jsx-a11y rules
      'jsx-a11y/anchor-is-valid': 'warn',
      // react rules
      'react/jsx-key': 'warn', // 检测 map 元素是否有加 key
      // react-func rules
      'react-func/max-combined-conditions': ['warn', 1], // 最大条件组合数
      'react-func/max-lines-per-function': [
        'warn',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ], // function 最大行数，不包括空白行及注释行
      // react-hooks rules
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-web-api/no-leaked-timeout': 'warn',
      'react-web-api/no-leaked-interval': 'warn',
      'react-web-api/no-leaked-event-listener': 'warn',
      'react-web-api/no-leaked-resize-observer': 'warn',
      ...rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
      ...settings,
    },
  };

  return [...baseConfigs, reactConfig];
}
