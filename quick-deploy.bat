@echo off
chcp 65001 >nul
echo ========================================
echo 设备管理系统 - 快速部署到GitHub
echo ========================================
echo.

echo 步骤1: 复制文件到正确的路由名称...
copy /Y "pages\equipment\predictive-maintenance-new.html" "pages\equipment\predictive-maintenance.html"
copy /Y "pages\equipment\knowledge-base-new.html" "pages\equipment\knowledge-base.html"
copy /Y "pages\equipment\oee-analysis-new.html" "pages\equipment\oee-analysis.html"
copy /Y "pages\equipment\inspection.html" "pages\equipment\inspection-management.html"
copy /Y "pages\equipment\spare-parts.html" "pages\equipment\spare-parts-management.html"
copy /Y "pages\equipment\planned-maintenance.html" "pages\equipment\preventive-maintenance.html"
echo 完成！
echo.

echo 步骤2: 添加所有文件到Git...
git add .
echo 完成！
echo.

echo 步骤3: 提交更改...
git commit -m "feat: complete all 8 equipment management modules - predictive maintenance, knowledge base, OEE analysis with correct routing configuration"
echo 完成！
echo.

echo 步骤4: 推送到GitHub...
git push origin main
echo 完成！
echo.

echo ========================================
echo 部署完成！
echo GitHub: https://github.com/wangpeng1017/0628MOM
echo ========================================
pause
