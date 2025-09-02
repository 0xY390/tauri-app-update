#!/bin/bash

# 启动Tauri更新测试服务器

echo "🚀 启动Tauri更新测试服务器..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    echo "   您可以从 https://nodejs.org 下载安装"
    exit 1
fi

# 检查端口是否被占用
PORT=3000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 端口 $PORT 已被占用"
    echo "   请关闭占用该端口的程序，或者修改 test-update.js 中的端口号"
    exit 1
fi

echo "✅ 端口 $PORT 可用"
echo "📋 启动测试服务器..."

# 启动服务器
node test-update.js

echo ""
echo "💡 使用说明:"
echo "1. 在另一个终端中运行: pnpm tauri dev"
echo "2. 在tauri.conf.json中配置更新端点为: http://localhost:3000/updates?version={{current_version}}&target={{target}}"
echo "3. 在应用中点击'检查更新'按钮测试功能"
echo ""
echo "按 Ctrl+C 停止测试服务器"
