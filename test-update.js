#!/usr/bin/env node

/**
 * Tauri更新服务器模拟器
 * 用于测试应用内更新功能
 */

import * as url from 'url';
import * as http from 'http';
import * as fs from 'fs';

const signature = 'dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVUcWZ1eVgvT1ZoUFEyc1NYdHI0TytaT3Jyck10T1dsTFN6RWhzUGVZTjR0TjBRWklscjFuVDVOU1NWa25PYytxRFhPamZCeGdLSG50S0RrakI4MDYvOWlldXJuMjRtR0E0PQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzU2ODg0NjYzCWZpbGU6dGF1cmktYXBwLXVwZGF0ZV8wLjEuMV9hYXJjaDY0LmRtZwoveUc0dUdIdHZCYTNFVklnWDBDUWZwN21HTVZvMlkxenNjaDluNTZJdElFV2hXNVprM2ZtUUlwM2x3eGVLYjlNOVBKVmVWYmdNRExlUFRQSmZmejNEZz09Cg=='
const downloadUrl = 'http://localhost:3000/downloads/tauri-app-update_0.1.1_aarch64.dmg'
// 模拟的更新数据
const updateData = {
  "version": "0.1.1",
  "notes": "新版本发布！包含以下改进：\n- 优化了应用内更新功能\n- 改进了用户界面设计\n- 修复了已知问题\n- 提升了整体性能",
  "pub_date": new Date().toISOString(),
  "platforms": {
    "darwin-x86_64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    },
    "darwin-aarch64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    },
    "linux-x86_64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    },
    "linux-aarch64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    },
    "windows-x86_64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    },
    "windows-aarch64": {
      "version": "0.1.1",
      "signature": signature,
      "url": downloadUrl,
    }
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 处理更新检查请求
  if (parsedUrl.pathname === '/updates' && req.method === 'GET') {
    const currentVersion = parsedUrl.query.version || '0.1.0';
    const target = parsedUrl.query.target || 'darwin-x86_64';

    console.log(`检查更新 - 当前版本: ${currentVersion}, 目标平台: ${target}`);

    // 模拟版本比较逻辑
    if (currentVersion !== updateData.version) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updateData, null, 2));
      console.log('✅ 返回更新信息', updateData);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No updates available' }));
      console.log('ℹ️ 无可用更新');
    }
    return;
  }

  // 处理下载请求（模拟）
  if (parsedUrl.pathname.startsWith('/downloads/') && req.method === 'GET') {
    const filename = parsedUrl.pathname.split('/').pop();
    console.log(`📥 下载请求: ${filename}`);

    // 检查文件是否存在
    const filePath = `./downloads/${filename}`;
    if (!fs.existsSync(filePath)) {
      console.log(`❌ 文件不存在: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Encoding', 'identity');
      res.end(`File not found: ${filename}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`
    });

    // 读取并返回文件内容
    res.end(fs.readFileSync(filePath));
    console.log(`✅ 文件发送成功: ${filename}`);
    return;
  }

  // 默认响应
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Tauri更新服务器模拟器</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
            code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>🚀 Tauri更新服务器模拟器</h1>
        <p>这是一个用于测试Tauri应用内更新功能的模拟服务器。</p>
        
        <h2>📋 可用的端点</h2>
        
        <div class="endpoint">
            <h3>检查更新</h3>
            <p><code>GET /updates?version={current_version}&target={platform}</code></p>
            <p>示例: <code>GET /updates?version=0.1.0&target=darwin-x86_64</code></p>
        </div>
        
        <div class="endpoint">
            <h3>下载更新包</h3>
            <p><code>GET /downloads/{filename}</code></p>
            <p>示例: <code>GET /downloads/app-v0.1.1.dmg</code></p>
        </div>
        
        <h2>🔧 配置说明</h2>
        <p>在您的 <code>tauri.conf.json</code> 中，将更新端点设置为：</p>
        <pre><code>"endpoints": [
  "http://localhost:3000/updates?version={{current_version}}&target={{target}}"
]</code></pre>
        
        <h2>⚠️ 注意事项</h2>
        <ul>
            <li>这是一个模拟服务器，仅用于开发测试</li>
            <li>在生产环境中，请使用HTTPS和真实的签名</li>
            <li>确保更新端点返回正确的JSON格式</li>
        </ul>
        
        <hr>
        <p><small>服务器运行时间: ${new Date().toLocaleString()}</small></p>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Tauri更新服务器模拟器已启动`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`📋 更新端点: http://localhost:${PORT}/updates`);
  console.log(`📥 下载端点: http://localhost:${PORT}/downloads/`);
  console.log(`\n💡 提示: 在tauri.conf.json中配置更新端点为: http://localhost:${PORT}/updates?version={{current_version}}&target={{target}}`);
  console.log(`\n按 Ctrl+C 停止服务器`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});
