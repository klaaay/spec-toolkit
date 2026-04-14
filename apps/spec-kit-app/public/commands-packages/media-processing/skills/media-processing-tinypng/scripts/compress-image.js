#!/usr/bin/env node
/* eslint-disable react-func/max-lines-per-function */

/**
 * TinyPNG 图片压缩脚本
 * 使用方式：node compress-image.js <image-path> [api-key]
 *
 * 功能：
 * 1. 自动查找 Git 仓库根目录
 * 2. 读取 Git 根目录下 .specify/configs.json 中的 tinyPNG API key
 * 3. 如果没有配置，使用传入的 api-key 参数或提示用户输入
 * 4. 调用 TinyPNG API 压缩图片
 * 5. 保存压缩后的图片（覆盖原图，保持原文件名）
 *
 * 配置文件位置：
 * - 始终保存在 Git 仓库根目录下的 .specify/configs.json
 * - 脚本会自动查找 Git 根目录（通过 git rev-parse --show-toplevel 或向上查找 .git 目录）
 *
 * 原图处理逻辑：
 * - 压缩后的图片会直接覆盖原图（使用相同的文件路径和文件名）
 * - 原图会被压缩版本替换，不会保留备份
 * - 如果需要保留原图，请在使用脚本前手动备份
 *
 * API 调用说明：
 * - POST https://api.tinify.com/shrink - 上传图片进行压缩
 * - GET <output.url> - 下载压缩后的图片
 * - 使用 Basic Authentication (api:apiKey)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { Buffer } = require('buffer');
const { execSync } = require('child_process');

const TINYPNG_API_BASE = 'https://api.tinify.com';

/**
 * 查找 Git 仓库根目录
 */
function findGitRoot(startPath = __dirname) {
  let currentPath = path.resolve(startPath);
  const root = path.parse(currentPath).root;

  while (currentPath !== root) {
    const gitPath = path.join(currentPath, '.git');
    if (fs.existsSync(gitPath)) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }

  // 如果没找到，尝试使用 git 命令
  try {
    const gitRoot = execSync('git rev-parse --show-toplevel', {
      cwd: startPath,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return gitRoot;
  } catch {
    // 如果 git 命令也失败，返回当前工作目录
    return process.cwd();
  }
}

/**
 * 获取配置文件路径（基于 Git 仓库根目录）
 */
function getConfigFilePath() {
  const gitRoot = findGitRoot();
  return path.join(gitRoot, '.specify', 'configs.json');
}

// 配置文件路径（动态获取）
let CONFIG_FILE = null;

/**
 * 读取配置文件
 */
function readConfig() {
  try {
    const configFile = getConfigFilePath();
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf-8');
      return content.trim() ? JSON.parse(content) : {};
    }
  } catch (error) {
    console.error('读取配置文件失败：', error.message);
  }
  return {};
}

/**
 * 写入配置文件
 */
function writeConfig(config) {
  try {
    const configFile = getConfigFilePath();
    const dir = path.dirname(configFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('写入配置文件失败：', error.message);
    return false;
  }
}

/**
 * 获取 API Key
 */
function getApiKey(providedKey) {
  const config = readConfig();

  // 优先使用传入的参数
  if (providedKey) {
    return providedKey;
  }

  // 从配置文件读取
  if (config.tinyPNGApiKey) {
    return config.tinyPNGApiKey;
  }

  return null;
}

/**
 * 保存 API Key 到配置
 */
function saveApiKey(apiKey) {
  const config = readConfig();
  config.tinyPNGApiKey = apiKey;
  if (writeConfig(config)) {
    console.log('✓ API Key 已保存到配置文件');
    return true;
  }
  return false;
}

/**
 * 调用 TinyPNG API 压缩图片
 *
 * API 文档：https://tinypng.com/developers/reference
 *
 * 请求方式：
 * - POST https://api.tinify.com/shrink
 * - Authorization: Basic base64(api:apiKey)
 * - Body: 图片二进制数据
 * - 响应：201 Created，包含 output.url 用于下载压缩后的图片
 */
function compressImage(imagePath, apiKey) {
  return new Promise((resolve, reject) => {
    let imageData;
    try {
      imageData = fs.readFileSync(imagePath);
    } catch (error) {
      reject(new Error('读取图片文件失败：' + error.message));
      return;
    }

    const auth = Buffer.from(`api:${apiKey.trim()}`).toString('base64');

    const options = {
      hostname: 'api.tinify.com',
      path: '/shrink',
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        // TinyPNG API 会自动检测图片类型，Content-Type 可选
        // 但设置 application/octet-stream 可以确保正确传输二进制数据
        'Content-Type': 'application/octet-stream',
        'Content-Length': imageData.length,
      },
    };

    const req = https.request(options, res => {
      let responseData = '';

      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          try {
            const result = JSON.parse(responseData);
            // 验证响应结构
            if (!result.output || !result.output.url) {
              reject(new Error('API 响应格式错误：缺少 output.url'));
              return;
            }
            resolve(result);
          } catch (error) {
            reject(new Error('解析响应失败：' + error.message));
          }
        } else {
          try {
            const error = JSON.parse(responseData);
            const errorMsg = error.error || error.message || JSON.stringify(error);
            reject(new Error(`压缩失败 (${res.statusCode}): ${errorMsg}`));
          } catch {
            reject(new Error(`压缩失败 (${res.statusCode}): ${responseData}`));
          }
        }
      });
    });

    req.on('error', error => {
      reject(new Error('请求失败：' + error.message));
    });

    // 写入图片数据
    try {
      req.write(imageData);
      req.end();
    } catch (error) {
      reject(new Error('发送请求数据失败：' + error.message));
    }
  });
}

/**
 * 下载压缩后的图片
 *
 * 从 TinyPNG API 返回的 output.url 下载压缩后的图片二进制数据
 */
function downloadCompressedImage(outputUrl, apiKey) {
  return new Promise((resolve, reject) => {
    let url;
    try {
      url = new URL(outputUrl);
    } catch (error) {
      reject(new Error('无效的输出 URL: ' + outputUrl));
      return;
    }

    const auth = Buffer.from(`api:${apiKey.trim()}`).toString('base64');

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };

    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', chunk => {
          errorBody += chunk.toString();
        });
        res.on('end', () => {
          reject(new Error(`下载失败 (${res.statusCode}): ${errorBody || '未知错误'}`));
        });
        return;
      }

      const chunks = [];
      res.on('data', chunk => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        if (chunks.length === 0) {
          reject(new Error('下载的数据为空'));
          return;
        }
        resolve(Buffer.concat(chunks));
      });
    });

    req.on('error', error => {
      reject(new Error('下载失败：' + error.message));
    });

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('下载超时'));
    });

    req.end();
  });
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('错误：请提供图片路径');
    console.log('使用方式：node compress-image.js <image-path> [api-key]');
    process.exit(1);
  }

  const imagePath = path.resolve(args[0]);
  const providedApiKey = args[1];

  // 检查文件是否存在
  if (!fs.existsSync(imagePath)) {
    console.error(`错误：文件不存在：${imagePath}`);
    process.exit(1);
  }

  // 检查是否为图片文件
  const ext = path.extname(imagePath).toLowerCase();
  const imageExts = ['.png', '.jpg', '.jpeg', '.webp'];
  if (!imageExts.includes(ext)) {
    console.error(`错误：不支持的文件类型：${ext}`);
    console.log('支持的格式：.png, .jpg, .jpeg, .webp');
    process.exit(1);
  }

  // 获取 API Key
  let apiKey = getApiKey(providedApiKey);

  if (!apiKey) {
    const configFile = getConfigFilePath();
    console.error('错误：未找到 TinyPNG API Key');
    console.log('请通过以下方式之一提供 API Key:');
    console.log('1. 作为第二个参数传入：node compress-image.js <image-path> <api-key>');
    console.log(`2. 在 Git 仓库根目录的 .specify/configs.json 中配置 tinyPNGApiKey`);
    console.log(`（配置文件路径：${configFile}）`);
    console.log('3. 获取 API Key: https://tinypng.com/developers');
    process.exit(1);
  }

  // 如果提供了新的 API Key，保存到配置
  if (providedApiKey && providedApiKey !== readConfig().tinyPNGApiKey) {
    saveApiKey(providedApiKey);
  }

  try {
    console.log(`正在压缩图片：${imagePath}`);

    // 步骤 1: 调用压缩 API
    const compressResult = await compressImage(imagePath, apiKey);
    const outputUrl = compressResult.output?.url;

    if (!outputUrl) {
      throw new Error('压缩响应中未找到输出 URL');
    }

    console.log('✓ 图片压缩成功');
    console.log(`  原始大小：${(compressResult.input?.size / 1024).toFixed(2)} KB`);
    console.log(`  压缩后大小：${(compressResult.output?.size / 1024).toFixed(2)} KB`);
    console.log(
      `  压缩率：${compressResult.output?.ratio ? ((1 - compressResult.output.ratio) * 100).toFixed(1) : 'N/A'}%`,
    );

    // 步骤 2: 下载压缩后的图片
    console.log('正在下载压缩后的图片...');
    const compressedData = await downloadCompressedImage(outputUrl, apiKey);

    // 验证下载的数据
    if (!compressedData || compressedData.length === 0) {
      throw new Error('下载的压缩图片数据为空');
    }

    // 步骤 3: 保存压缩后的图片
    // 注意：这里直接覆盖原图，原图会被压缩后的版本替换
    // 如果需要保留原图，可以在这里先备份或使用不同的文件名
    try {
      // 先备份原图信息（用于错误恢复）
      const originalStats = fs.statSync(imagePath);
      const originalSize = originalStats.size;

      // 写入压缩后的图片（覆盖原图）
      fs.writeFileSync(imagePath, compressedData, { flag: 'w' });

      // 验证写入的文件
      const newStats = fs.statSync(imagePath);
      if (newStats.size === 0) {
        throw new Error('写入的文件大小为 0，可能写入失败');
      }

      console.log(`✓ 压缩后的图片已保存：${imagePath}`);
      console.log(`  原图已替换为压缩版本（原图大小：${(originalSize / 1024).toFixed(2)} KB）`);
    } catch (error) {
      throw new Error('保存压缩图片失败：' + error.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('压缩失败：', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { compressImage, downloadCompressedImage, getApiKey, saveApiKey };
