# 🚀 Tauri应用内更新 - 快速配置指南

## 📋 前置要求

- ✅ Tauri 2.0 项目
- ✅ Node.js 18+
- ✅ Rust 1.70+
- ✅ OpenSSL (用于生成密钥)

## ⚡ 快速开始

### 1. 生成密钥对

```bash
# 运行密钥生成脚本
./generate-keys.sh
```

这将生成：
- `keys/private.pem` - 私钥（用于签名更新包）
- `keys/public.pem` - 公钥（复制到配置文件中）

### 2. 配置更新端点

编辑 `src-tauri/tauri.conf.json`，将更新端点设置为：

```json
"updater": {
  "active": true,
  "endpoints": [
    "http://localhost:3000/updates?version={{current_version}}&target={{target}}"
  ],
  "dialog": true,
  "pubkey": "从keys/public.pem复制的公钥内容"
}
```

### 3. 启动测试服务器

```bash
# 启动模拟更新服务器
./start-test-server.sh
```

### 4. 测试更新功能

在另一个终端中运行：

```bash
# 启动Tauri应用
pnpm tauri dev
```

然后在应用中点击"检查更新"按钮测试功能。

## 🔧 生产环境配置

### 1. 更新服务器

您需要一个真实的更新服务器，返回以下格式的JSON：

```json
{
  "version": "0.2.0",
  "notes": "更新说明",
  "pub_date": "2024-01-01T00:00:00Z",
  "platforms": {
    "darwin-x86_64": {
      "signature": "RSA签名",
      "url": "https://your-server.com/app-v0.2.0.dmg"
    }
  }
}
```

### 2. 签名更新包

使用您的私钥签名更新包：

```bash
# 示例：签名DMG文件
openssl dgst -sha256 -sign keys/private.pem -out app-v0.2.0.dmg.sig app-v0.2.0.dmg
```

### 3. 配置HTTPS

在生产环境中，确保更新端点使用HTTPS：

```json
"endpoints": [
  "https://your-update-server.com/updates?version={{current_version}}&target={{target}}"
]
```

## 📁 文件说明

- `generate-keys.sh` - 生成RSA密钥对
- `start-test-server.sh` - 启动测试更新服务器
- `test-update.js` - 模拟更新服务器
- `tauri-updater-config-template.json` - 配置模板
- `update-server-example.json` - 更新响应示例

## 🚨 注意事项

1. **私钥安全**: 永远不要将私钥提交到版本控制系统
2. **HTTPS**: 生产环境必须使用HTTPS
3. **签名验证**: 确保正确配置公钥以验证更新包
4. **测试**: 在发布前充分测试更新流程

## 🆘 常见问题

### Q: 更新检查失败怎么办？
A: 检查网络连接、端点URL格式和公钥配置

### Q: 如何自定义更新对话框？
A: 在tauri.conf.json中设置 `"dialog": false`，然后在前端实现自定义UI

### Q: 支持哪些平台？
A: 支持所有Tauri支持的平台：Windows、macOS、Linux

## 📚 更多资源

- [Tauri更新器官方文档](https://tauri.app/v2/guides/distribution/updater/)
- [RSA密钥生成指南](https://tauri.app/v2/guides/distribution/updater/#generating-keys)
- [更新服务器实现示例](https://github.com/tauri-apps/tauri/tree/dev/examples/updater)

---

🎉 恭喜！您已经成功配置了Tauri应用内更新功能！
