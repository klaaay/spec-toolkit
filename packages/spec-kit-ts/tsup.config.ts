import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: true,
  outDir: './dist',
  sourcemap: false,
  clean: true,
  shims: true,
  // 复制 spec-kit-templates 文件夹到 dist（包括隐藏文件）
  onSuccess: async () => {
    const { cp } = await import('fs/promises');
    const { join } = await import('path');

    // 使用 Node.js 的 fs.cp 来复制，它会自动包含隐藏文件
    await cp(join(process.cwd(), 'src/spec-kit-templates'), join(process.cwd(), 'dist/spec-kit-templates'), {
      recursive: true,
      force: true,
    });
    console.log('✓ 已复制模板文件到 dist/spec-kit-templates');
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
