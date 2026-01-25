import { join } from 'path';
import { existsSync } from 'fs';
import { CreateConfigOptions, TsPluginParserOptions } from './interface';

export const normalizeOptions = (opts: CreateConfigOptions = {}) => {
  const cwd = process.cwd();
  let root: CreateConfigOptions['root'];
  let tsconfig: CreateConfigOptions['tsconfig'] | true;

  // root
  if (opts.root?.length) {
    root = opts.root;
  } else {
    root = cwd;
  }

  // tsconfig
  if (opts.tsconfig === true) {
    tsconfig = true;
  } else if (opts.tsconfig?.length) {
    tsconfig = opts.tsconfig;
  } else {
    const rootTsconfigPath = join(cwd, 'tsconfig.json');
    if (existsSync(rootTsconfigPath)) {
      tsconfig = rootTsconfigPath;
    } else {
      tsconfig = true;
    }
  }

  // root
  return {
    project: tsconfig,
    tsconfigRootDir: root,
  } as TsPluginParserOptions;
};
