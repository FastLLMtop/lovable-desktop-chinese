#!/usr/bin/env bash
set -e

APP_PATH="/Applications/Lovable.app"
CONTENTS_PATH="$APP_PATH/Contents"
INFO_PLIST="$CONTENTS_PATH/Info.plist"
INFO_PLIST_BAK="$CONTENTS_PATH/Info.plist.bak"
RESOURCES_PATH="$CONTENTS_PATH/Resources"
ASAR_FILE="$RESOURCES_PATH/app.asar"
BACKUP_FILE="$RESOURCES_PATH/app.asar.bak"
RELEASE_URL="https://github.com/FastLLMtop/lovable-desktop-chinese/releases/download/v1.0.0/app.asar"

echo "=========================================================="
echo "    Lovable macOS 桌面端深度汉化一键安装脚本"
echo "    Powered by FastLLM.top (https://fastllm.top)"
echo "=========================================================="

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 未检测到 $APP_PATH，请先安装 Lovable 桌面端应用程序。"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || echo "")"
TEMP_DIR=""

if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/app.asar" ]; then
    SOURCE_ASAR="$SCRIPT_DIR/app.asar"
    echo "📦 使用本地汉化文件: $SOURCE_ASAR"
else
    TEMP_DIR=$(mktemp -d)
    SOURCE_ASAR="$TEMP_DIR/app.asar"
    echo "⬇️ 正在从 GitHub Release 下载最新汉化核心..."
    curl -fsSL --progress-bar "$RELEASE_URL" -o "$SOURCE_ASAR"
fi

echo "[1/6] 关闭正在运行的 Lovable 进程..."
killall Lovable 2>/dev/null || true
sleep 1

echo "[2/6] 备份官方原版核心..."
if [ ! -f "$BACKUP_FILE" ]; then
    cp "$ASAR_FILE" "$BACKUP_FILE"
    echo "  原版 ASAR 备份至: $BACKUP_FILE"
fi
if [ ! -f "$INFO_PLIST_BAK" ]; then
    cp "$INFO_PLIST" "$INFO_PLIST_BAK"
    echo "  原版 Info.plist 备份至: $INFO_PLIST_BAK"
fi

echo "[3/6] 安装汉化核心包..."
cp -f "$SOURCE_ASAR" "$ASAR_FILE"

echo "[4/6] 计算并同步 ASAR 头部哈希校验..."
NEW_HASH=$(python3 -c '
import struct, hashlib
with open("'"$ASAR_FILE"'", "rb") as f:
    buf = f.read(16)
    _, _, _, json_len = struct.unpack("<IIII", buf)
    f.seek(16)
    header_json = f.read(json_len)
    print(hashlib.sha256(header_json).hexdigest())
')
echo "  新 ASAR 头部哈希: $NEW_HASH"
plutil -replace "ElectronAsarIntegrity.Resources/app\.asar.hash" -string "$NEW_HASH" "$INFO_PLIST"

echo "[5/6] 修复 macOS 权限并重签名..."
xattr -cr "$APP_PATH"
codesign --force --deep --sign - "$APP_PATH"

echo "[6/6] 验证代码签名..."
codesign -v "$APP_PATH"
echo "  签名验证通过！"

if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

echo "=========================================================="
echo "🎉 汉化安装成功！正在启动 Lovable..."
echo "👉 体验高并发顶模 API，请访问 FastLLM.top (https://fastllm.top)"
echo "=========================================================="
open "$APP_PATH"
