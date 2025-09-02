# Tauri App Update

这是一个使用Tauri 2.0和Vue 3构建的桌面应用程序，集成了应用内更新功能。

## 功能特性

- 🚀 基于Tauri 2.0的跨平台桌面应用
- 🎨 现代化的Vue 3用户界面
- 🔄 内置应用内更新功能
- 📱 响应式设计，支持多种屏幕尺寸

## 应用内更新功能

### 配置说明

应用内更新功能已经集成到项目中，但需要您进行一些配置：

1. **更新端点配置**
   在 `src-tauri/tauri.conf.json` 中，您需要配置更新服务器端点：
   ```json
   "updater": {
     "active": true,
     "endpoints": [
       "https://your-update-server.com/{{target}}/{{current_version}}"
     ],
     "dialog": true,
     "pubkey": "YOUR_PUBLIC_KEY_HERE"
   }
   ```

2. **公钥配置**
   您需要生成一个公钥/私钥对，并将公钥放在配置中。私钥用于签名更新包。

### 更新服务器要求

您的更新服务器需要返回符合Tauri更新格式的JSON响应：

```json
{
  "version": "0.2.0",
  "notes": "新版本更新说明",
  "pub_date": "2024-01-01T00:00:00Z",
  "platforms": {
    "darwin-x86_64": {
      "signature": "签名",
      "url": "https://example.com/app-v0.2.0.dmg"
    },
    "linux-x86_64": {
      "signature": "签名",
      "url": "https://example.com/app-v0.2.0.AppImage"
    },
    "windows-x86_64": {
      "signature": "签名",
      "url": "https://example.com/app-v0.2.0.msi"
    }
  }
}
```

### 生成密钥对

使用以下命令生成密钥对：

```bash
# 生成私钥
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# 生成公钥
openssl rsa -pubout -in private.pem -out public.pem

# 查看公钥内容（复制到tauri.conf.json中）
cat public.pem
```

## 开发

### 前置要求

- Node.js 18+
- pnpm
- Rust 1.70+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm tauri dev
```

### 构建

```bash
pnpm tauri build
```

## 项目结构

```
tauri-app-update/
├── src/                 # Vue前端代码
│   ├── App.vue         # 主应用组件
│   └── main.ts         # 应用入口
├── src-tauri/          # Tauri后端代码
│   ├── src/
│   │   ├── lib.rs      # 主要逻辑
│   │   └── main.rs     # 应用入口
│   ├── Cargo.toml      # Rust依赖配置
│   └── tauri.conf.json # Tauri配置
└── package.json        # 前端依赖配置
```

## 更新流程

1. 用户点击"检查更新"按钮
2. 应用向配置的更新端点发送请求
3. 如果有新版本，自动下载并安装
4. 安装完成后应用自动重启

## 注意事项

- 确保更新服务器支持HTTPS
- 正确配置公钥以验证更新包
- 测试更新流程在目标平台上的兼容性
- 建议在发布前充分测试更新功能

## 许可证

MIT
