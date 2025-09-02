#!/bin/bash

# Tauri更新器密钥生成脚本
# 这个脚本会生成RSA密钥对，用于签名和验证更新包

echo "🔑 正在生成Tauri更新器密钥对..."

# 创建keys目录
mkdir -p keys

# 生成私钥
echo "📝 生成私钥..."
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048

if [ $? -eq 0 ]; then
    echo "✅ 私钥生成成功: keys/private.pem"
else
    echo "❌ 私钥生成失败"
    exit 1
fi

# 生成公钥
echo "📝 生成公钥..."
openssl rsa -pubout -in keys/private.pem -out keys/public.pem

if [ $? -eq 0 ]; then
    echo "✅ 公钥生成成功: keys/public.pem"
else
    echo "❌ 公钥生成失败"
    exit 1
fi

# 显示公钥内容
echo ""
echo "🔐 公钥内容 (请复制到tauri.conf.json的pubkey字段):"
echo "=================================================="
cat keys/public.pem
echo "=================================================="

echo ""
echo "📋 重要提示:"
echo "1. 私钥 (keys/private.pem) 用于签名更新包，请妥善保管"
echo "2. 公钥内容已显示在上方，请复制到 tauri.conf.json 的 pubkey 字段"
echo "3. 不要将私钥提交到版本控制系统"
echo "4. 建议将 keys/  目录添加到 .gitignore 文件中"

# 检查是否已存在.gitignore
if [ -f .gitignore ]; then
    if ! grep -q "keys/" .gitignore; then
        echo "" >> .gitignore
        echo "# Tauri更新器密钥" >> .gitignore
        echo "keys/" >> .gitignore
        echo "✅ 已将 keys/ 添加到 .gitignore 文件"
    fi
else
    echo "# Tauri更新器密钥" > .gitignore
    echo "keys/" >> .gitignore
    echo "✅ 已创建 .gitignore 文件并添加 keys/ 目录"
fi

echo ""
echo "🎉 密钥生成完成！"
