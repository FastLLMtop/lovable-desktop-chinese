#!/usr/bin/env bash
set -e

APP_PATH="/Applications/Lovable.app"
CONTENTS_PATH="$APP_PATH/Contents"
INFO_PLIST="$CONTENTS_PATH/Info.plist"
INFO_PLIST_BAK="$CONTENTS_PATH/Info.plist.bak"
RESOURCES_PATH="$CONTENTS_PATH/Resources"
ASAR_FILE="$RESOURCES_PATH/app.asar"
BACKUP_FILE="$RESOURCES_PATH/app.asar.bak"

echo "=========================================================="
echo "    Lovable macOS 桌面端官方原版一键还原脚本"
echo "    Powered by FastLLM.top (https://fastllm.top)"
echo "=========================================================="

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ 未检测到备份文件 $BACKUP_FILE，无法自动还原。"
    exit 1
fi

echo "[1/5] 关闭正在运行的 Lovable 进程..."
killall Lovable 2>/dev/null || true
sleep 1

echo "[2/5] 恢复官方原版 app.asar..."
cp -f "$BACKUP_FILE" "$ASAR_FILE"

echo "[3/5] 恢复官方原版 Info.plist..."
if [ -f "$INFO_PLIST_BAK" ]; then
    cp -f "$INFO_PLIST_BAK" "$INFO_PLIST"
else
    ORIG_HASH=$(python3 -c '
import struct, hashlib
with open("'"$BACKUP_FILE"'", "rb") as f:
    buf = f.read(16)
    _, _, _, json_len = struct.unpack("<IIII", buf)
    f.seek(16)
    header_json = f.read(json_len)
    print(hashlib.sha256(header_json).hexdigest())
')
    plutil -replace "ElectronAsarIntegrity.Resources/app\.asar.hash" -string "$ORIG_HASH" "$INFO_PLIST"
fi

echo "[4/5] 修复权限并重新签名..."
xattr -cr "$APP_PATH"
codesign --force --deep --sign - "$APP_PATH"

echo "[5/5] 验证签名..."
codesign -v "$APP_PATH"

echo "=========================================================="
echo "🎉 已成功还原为官方英文原版！正在启动 Lovable..."
echo "=========================================================="
open "$APP_PATH"
