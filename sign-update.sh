#!/bin/bash

# Tauri更新包签名脚本
# 使用私钥对更新包进行签名

if [ $# -ne 1 ]; then
    echo "用法: $0 <更新包路径>"
    echo "示例: $0 ./downloads/tauri-app-update_0.2.0_aarch64.dmg"
    exit 1
fi

UPDATE_FILE="$1"

if [ ! -f "$UPDATE_FILE" ]; then
    echo "❌ 错误: 文件 '$UPDATE_FILE' 不存在"
    exit 1
fi

if [ ! -f "keys/private.pem" ]; then
    echo "❌ 错误: 私钥文件 'keys/private.pem' 不存在"
    echo "请先运行 ./generate-keys.sh 生成密钥对"
    exit 1
fi

echo "🔐 正在签名更新包: $UPDATE_FILE"

# 计算文件的SHA256哈希
echo "📝 计算文件哈希..."
HASH=$(openssl dgst -sha256 -binary "$UPDATE_FILE" | base64)

if [ $? -ne 0 ]; then
    echo "❌ 哈希计算失败"
    exit 1
fi

echo "✅ 文件哈希: $HASH"

# 使用私钥签名哈希
echo "🔏 使用私钥签名..."
SIGNATURE=$(echo -n "$HASH" | openssl dgst -sha256 -sign keys/private.pem | base64)

if [ $? -ne 0 ]; then
    echo "❌ 签名失败"
    exit 1
fi

echo "✅ 签名完成!"
echo ""
echo "🔐 签名结果:"
echo "=================================================="
echo "$SIGNATURE"
echo "=================================================="
echo ""
echo "📋 使用说明:"
echo "1. 将上述签名复制到更新服务器的配置中"
echo "2. 确保更新包文件可以通过配置的URL访问"
echo "3. 签名用于验证更新包的完整性和真实性"
echo ""
echo "💡 提示: 您可以将此签名添加到 update-server-example.json 中"
