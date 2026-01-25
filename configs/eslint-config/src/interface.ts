import type { ParserOptions } from '@typescript-eslint/types';

export type Rules = Rule[];
export type TsPluginParserOptions = ParserOptions;

type Matcher = (path: string) => boolean;

interface LanguageOptions {
  ecmaVersion: string;
  sourceType: 'module' | 'script';
  parser: string | ((...args: any[]) => any);
  globals: Record<string, boolean>;
  parserOptions: ParserOptions;
}

export interface Rule {
  files?: Array<string | Matcher>;
  ignores?: Array<string | Matcher>;
  languageOptions?: Partial<LanguageOptions>;
  plugins?: Record<string, any>;
  rules?: Record<string, any>;
  settings?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface CreateConfigOptions {
  /**
   * @typescript-eslint/parser `project` option
   * @example simple:
   *            `./tsconfig.json` -> `${process.cwd()}/tsconfig.json`
   *          monorepo:
   *            [`./tsconfig.json`, `./tsconfig.build.json`] ->
   *            [`${process.cwd()}/tsconfig.json`, `${process.cwd()}/tsconfig.build.json`]
   * @default `${process.cwd()}/tsconfig.json`
   */
  tsconfig?: string | string[] | true;
  /**
   * tsconfigRootDir
   * @example __dirname
   * @default process.cwd()
   */
  root?: string;
  globalIgnores?: Rule['ignores'];
  plugins?: Rule['plugins'];
  rules?: Rule['rules'];
  settings?: Rule['settings'];
}
