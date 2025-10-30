# 设备管理系统完整部署脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "设备管理系统 - GitHub部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤1: 替换文件到正确的路由名称
Write-Host "步骤1: 替换文件到正确的路由名称..." -ForegroundColor Yellow

# 替换新开发的三个模块文件
Copy-Item "pages\equipment\predictive-maintenance-new.html" "pages\equipment\predictive-maintenance.html" -Force
Copy-Item "pages\equipment\knowledge-base-new.html" "pages\equipment\knowledge-base.html" -Force
Copy-Item "pages\equipment\oee-analysis-new.html" "pages\equipment\oee-analysis.html" -Force

# 复制之前开发的文件到正确的路由名称
Copy-Item "pages\equipment\inspection.html" "pages\equipment\inspection-management.html" -Force
Copy-Item "pages\equipment\spare-parts.html" "pages\equipment\spare-parts-management.html" -Force
Copy-Item "pages\equipment\planned-maintenance.html" "pages\equipment\preventive-maintenance.html" -Force

Write-Host "✓ 文件替换完成" -ForegroundColor Green
Write-Host ""

# 步骤2: 删除临时文件
Write-Host "步骤2: 清理临时文件..." -ForegroundColor Yellow
Remove-Item "pages\equipment\predictive-maintenance-new.html" -Force -ErrorAction SilentlyContinue
Remove-Item "pages\equipment\knowledge-base-new.html" -Force -ErrorAction SilentlyContinue
Remove-Item "pages\equipment\oee-analysis-new.html" -Force -ErrorAction SilentlyContinue
Write-Host "✓ 临时文件清理完成" -ForegroundColor Green
Write-Host ""

# 步骤3: Git操作
Write-Host "步骤3: 提交到GitHub..." -ForegroundColor Yellow

# 添加所有文件
Write-Host "  - 添加所有变更文件..." -ForegroundColor Gray
git add .

# 提交
Write-Host "  - 创建提交..." -ForegroundColor Gray
git commit -m "feat: complete all 8 equipment management modules

- Predictive Maintenance: AI-powered health monitoring and RUL prediction
- Knowledge Base: maintenance cases, SOP documents, and expert knowledge
- OEE Analysis: comprehensive efficiency analysis with six big losses
- Fixed routing: ensure all module files match navigation routes
- Updated file names for proper routing configuration

All 8 equipment management modules are now complete:
1. Asset Management
2. Maintenance & Repair
3. Preventive Maintenance (Planned Maintenance)
4. Inspection Management
5. Spare Parts Management
6. Predictive Maintenance
7. Knowledge Base
8. OEE Analysis"

# 推送到GitHub
Write-Host "  - 推送到GitHub..." -ForegroundColor Gray
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ 部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "已完成的模块:" -ForegroundColor White
Write-Host "  1. ✓ 设备资产管理 (asset-management.html)" -ForegroundColor Green
Write-Host "  2. ✓ 维护维修管理 (maintenance-repair.html)" -ForegroundColor Green
Write-Host "  3. ✓ 计划性维护 (preventive-maintenance.html)" -ForegroundColor Green
Write-Host "  4. ✓ 点巡检管理 (inspection-management.html)" -ForegroundColor Green
Write-Host "  5. ✓ 备品备件管理 (spare-parts-management.html)" -ForegroundColor Green
Write-Host "  6. ✓ 预测性维护 (predictive-maintenance.html)" -ForegroundColor Green
Write-Host "  7. ✓ 知识库管理 (knowledge-base.html)" -ForegroundColor Green
Write-Host "  8. ✓ OEE统计分析 (oee-analysis.html)" -ForegroundColor Green
Write-Host ""
Write-Host "GitHub仓库: https://github.com/wangpeng1017/0628MOM" -ForegroundColor Cyan
Write-Host ""
