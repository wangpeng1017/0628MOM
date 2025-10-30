@echo off
chcp 65001 >nul
echo ========================================
echo 提交点巡检管理模块更新
echo ========================================
echo.

echo 正在添加文件...
git add pages\equipment\inspection-management.html
git add assets\js\equipment-inspection.js
echo 完成！
echo.

echo 正在提交...
git commit -m "feat: update inspection management module with left sidebar navigation

- Move view switching buttons to left sidebar as secondary menu
- Rename menu items: 巡检路线, 巡检计划, 巡检任务, 巡检报告
- Update page title dynamically based on active view
- Improve navigation UX with sidebar layout"
echo 完成！
echo.

echo 正在推送到GitHub...
git push origin main
echo 完成！
echo.

echo ========================================
echo 部署完成！
echo Vercel将自动部署更新
echo ========================================
pause
