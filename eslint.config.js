module.exports = require('@klaaay/eslint-config/react')({
  tsconfig: [
    './tsconfig.json',
    `${process.cwd()}/tsconfig.json`,
    `${process.cwd()}/apps/spec-kit-app/tsconfig.json`,
    `${process.cwd()}/packages/spec-kit-ts/tsconfig.json`,
    `${process.cwd()}/configs/eslint-config/tsconfig.json`,
    `${process.cwd()}/configs/uno-config/tsconfig.json`,
  ],
  globalIgnores: ['**/tsup.config.ts'],
  root: process.cwd(),
  rules: {
    'klay/uppercase-const': 'off',
    'klay/no-export-default': 'off',
    'klay/max-params-with-fixable': 'off',
    'no-console': 'off',
    'max-depth': 'off',
    'max-lines': 'off',
    'max-lines-per-function': 'off',
  },
});
