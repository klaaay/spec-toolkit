import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: false,
  outDir: 'dist',
  sourcemap: false,
  clean: true,
  dts: true,
});
