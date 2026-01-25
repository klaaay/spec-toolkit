import path from 'path';
import { fileURLToPath } from 'url';
import { CodeInspectorPlugin } from 'code-inspector-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [],
  },
  turbopack: {},
  webpack: config => {
    config.cache = false;
    config.plugins.push(CodeInspectorPlugin({ bundler: 'webpack' }));
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, './src'),
      '@app': path.join(__dirname, './'),
      '@components': path.join(__dirname, './components'),
      '@hooks': path.join(__dirname, './hooks'),
      '@utils': path.join(__dirname, './utils'),
      '@examples': path.join(__dirname, './examples'),
      '@constants': path.join(__dirname, './constants'),
    };
    return config;
  },
};

export default nextConfig;
