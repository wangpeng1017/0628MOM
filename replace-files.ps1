# 替换新开发的三个模块文件
Copy-Item "pages\equipment\predictive-maintenance-new.html" "pages\equipment\predictive-maintenance.html" -Force
Copy-Item "pages\equipment\knowledge-base-new.html" "pages\equipment\knowledge-base.html" -Force
Copy-Item "pages\equipment\oee-analysis-new.html" "pages\equipment\oee-analysis.html" -Force

# 复制之前开发的文件到正确的路由名称
Copy-Item "pages\equipment\inspection.html" "pages\equipment\inspection-management.html" -Force
Copy-Item "pages\equipment\spare-parts.html" "pages\equipment\spare-parts-management.html" -Force
Copy-Item "pages\equipment\planned-maintenance.html" "pages\equipment\preventive-maintenance.html" -Force

# 删除临时文件
Remove-Item "pages\equipment\predictive-maintenance-new.html" -Force
Remove-Item "pages\equipment\knowledge-base-new.html" -Force
Remove-Item "pages\equipment\oee-analysis-new.html" -Force

Write-Host "Files replaced successfully!"
Write-Host "All equipment module files are now correctly named for routing!"
