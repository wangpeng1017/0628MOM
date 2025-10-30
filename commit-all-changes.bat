@echo off
chcp 65001 >nul
echo ========================================
echo 提交所有变更到GitHub
echo ========================================
echo.

echo 步骤1: 查看当前状态...
git status
echo.

echo 步骤2: 添加所有文件...
git add .
echo.

echo 步骤3: 提交变更...
git commit -m "feat: update inspection management with left sidebar navigation and ensure all routing files are correct"
echo.

echo 步骤4: 推送到GitHub...
git push origin main
echo.

echo ========================================
echo 完成！
echo ========================================
pause
