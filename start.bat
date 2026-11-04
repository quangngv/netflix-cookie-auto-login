@echo off
chcp 65001 >nul 2>&1
title 🎬 Netflix Cookie Auto Login
color 0C

echo.
echo  ███╗   ██╗███████╗████████╗███████╗██╗     ██╗██╗  ██╗
echo  ████╗  ██║██╔════╝╚══██╔══╝██╔════╝██║     ██║╚██╗██╔╝
echo  ██╔██╗ ██║█████╗     ██║   █████╗  ██║     ██║ ╚███╔╝ 
echo  ██║╚██╗██║██╔══╝     ██║   ██╔══╝  ██║     ██║ ██╔██╗ 
echo  ██║ ╚████║███████╗   ██║   ██║     ███████╗██║██╔╝ ██╗
echo  ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝     ╚══════╝╚═╝╚═╝  ╚═╝
echo.
echo  Cookie Auto Login - Server ^& Extension
echo  ──────────────────────────────────────────
echo  By Soumek Xaynguyen
echo.

:: Kiểm tra Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo  [!] Node.js chưa được cài đặt!
    echo  [!] Tải Node.js tại: https://nodejs.org
    echo.
    pause
    start https://nodejs.org
    exit /b
)

:: Hiện phiên bản
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  [✓] Node.js %NODE_VER% detected
echo.

:: Cài dependencies nếu chưa có
if not exist "node_modules" (
    echo  [*] Đang cài đặt dependencies...
    echo.
    npm install
    echo.
    if %errorlevel% neq 0 (
        color 0E
        echo  [!] Lỗi cài đặt! Kiểm tra kết nối mạng.
        pause
        exit /b
    )
    echo  [✓] Cài đặt hoàn tất!
) else (
    echo  [✓] Dependencies đã sẵn sàng
)

echo.
echo  ──────────────────────────────────────────
echo  [*] Đang khởi động server...
echo  [*] Web UI:  http://localhost:3000
echo  [*] Extension: Mở chrome://extensions
echo       → Load unpacked → chọn thư mục "extension"
echo  ──────────────────────────────────────────
echo.

:: Mở Chrome sau 2 giây (đợi server khởi động)
start "" cmd /c "timeout /t 2 /nobreak >nul & start chrome http://localhost:3000"

:: Chạy server (giữ cửa sổ CMD mở)
echo  [✓] Server đang chạy! Nhấn Ctrl+C để dừng.
echo.
node server.js

