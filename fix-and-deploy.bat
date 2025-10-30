@echo off
chcp 65001 >nul
echo ========================================
echo 修复路由并重新部署到Vercel
echo ========================================
echo.

echo 正在复制文件到正确的路由名称...
echo.

REM 复制新开发的三个模块
copy /Y "pages\equipment\predictive-maintenance-new.html" "pages\equipment\predictive-maintenance.html"
copy /Y "pages\equipment\knowledge-base-new.html" "pages\equipment\knowledge-base.html"
copy /Y "pages\equipment\oee-analysis-new.html" "pages\equipment\oee-analysis.html"

REM 复制之前的模块到正确的路由名称
copy /Y "pages\equipment\inspection.html" "pages\equipment\inspection-management.html"
copy /Y "pages\equipment\spare-parts.html" "pages\equipment\spare-parts-management.html"
copy /Y "pages\equipment\planned-maintenance.html" "pages\equipment\preventive-maintenance.html"

echo.
echo ✓ 文件复制完成
echo.

echo 正在删除临时文件...
del /F /Q "pages\equipment\predictive-maintenance-new.html" 2>nul
del /F /Q "pages\equipment\knowledge-base-new.html" 2>nul
del /F /Q "pages\equipment\oee-analysis-new.html" 2>nul
echo ✓ 临时文件已删除
echo.

echo 正在提交到Git...
git add .
git commit -m "fix: ensure all equipment module files match routing configuration for Vercel deployment"
echo.

echo 正在推送到GitHub (触发Vercel自动部署)...
git push origin main
echo.

echo ========================================
echo ✓ 完成！
echo ========================================
echo.
echo Vercel将自动检测到更新并开始部署
echo 请访问 Vercel 控制台查看部署进度
echo 部署完成后访问: https://mom.aifly.me
echo.
pause
