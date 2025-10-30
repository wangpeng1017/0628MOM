# Vercel 部署问题修复指南

## 🔴 当前问题

**线上环境**: https://mom.aifly.me  
**状态**: 显示旧版本的计划性维护页面  
**原因**: 文件名与路由配置不匹配

## 📋 问题分析

### 路由配置 (pages/equipment.html)
```
preventive-maintenance.html     ← 导航指向这个文件
inspection-management.html      ← 导航指向这个文件
spare-parts-management.html     ← 导航指向这个文件
predictive-maintenance.html     ← 导航指向这个文件
knowledge-base.html             ← 导航指向这个文件
oee-analysis.html               ← 导航指向这个文件
```

### 当前GitHub仓库中的文件
```
✅ planned-maintenance.html          (需要复制为 preventive-maintenance.html)
✅ inspection.html                   (需要复制为 inspection-management.html)
✅ spare-parts.html                  (需要复制为 spare-parts-management.html)
✅ predictive-maintenance-new.html   (需要重命名为 predictive-maintenance.html)
✅ knowledge-base-new.html           (需要重命名为 knowledge-base.html)
✅ oee-analysis-new.html             (需要重命名为 oee-analysis.html)
```

## ✅ 解决方案

### 方法1: 使用自动化脚本（推荐）

双击运行：
```
fix-and-deploy.bat
```

这个脚本会：
1. ✅ 复制所有文件到正确的路由名称
2. ✅ 删除临时的 `-new.html` 文件
3. ✅ 提交到 Git
4. ✅ 推送到 GitHub
5. ✅ 触发 Vercel 自动部署

### 方法2: 手动执行

在CMD中执行：

```bash
# 1. 复制文件
copy /Y "pages\equipment\predictive-maintenance-new.html" "pages\equipment\predictive-maintenance.html"
copy /Y "pages\equipment\knowledge-base-new.html" "pages\equipment\knowledge-base.html"
copy /Y "pages\equipment\oee-analysis-new.html" "pages\equipment\oee-analysis.html"
copy /Y "pages\equipment\inspection.html" "pages\equipment\inspection-management.html"
copy /Y "pages\equipment\spare-parts.html" "pages\equipment\spare-parts-management.html"
copy /Y "pages\equipment\planned-maintenance.html" "pages\equipment\preventive-maintenance.html"

# 2. 删除临时文件
del /F /Q "pages\equipment\predictive-maintenance-new.html"
del /F /Q "pages\equipment\knowledge-base-new.html"
del /F /Q "pages\equipment\oee-analysis-new.html"

# 3. 提交并推送
git add .
git commit -m "fix: ensure all equipment module files match routing for Vercel"
git push origin main
```

## 🔄 Vercel 自动部署流程

1. **GitHub 推送** → 代码推送到 main 分支
2. **Vercel 检测** → Vercel 自动检测到更新
3. **开始构建** → Vercel 开始构建项目
4. **部署上线** → 构建完成后自动部署到 mom.aifly.me
5. **完成** → 通常需要 1-3 分钟

## 📊 部署后验证

### 1. 检查 Vercel 控制台
- 访问: https://vercel.com/dashboard
- 查看最新部署状态
- 确认部署成功

### 2. 测试线上环境
访问以下URL确认更新：

```
https://mom.aifly.me/pages/equipment.html
https://mom.aifly.me/pages/equipment/preventive-maintenance.html
https://mom.aifly.me/pages/equipment/inspection-management.html
https://mom.aifly.me/pages/equipment/spare-parts-management.html
https://mom.aifly.me/pages/equipment/predictive-maintenance.html
https://mom.aifly.me/pages/equipment/knowledge-base.html
https://mom.aifly.me/pages/equipment/oee-analysis.html
```

### 3. 清除浏览器缓存
如果仍显示旧版本：
- 按 `Ctrl + Shift + R` 强制刷新
- 或清除浏览器缓存后重新访问

## 🎯 预期结果

部署成功后，所有8个设备管理模块应该都能正常访问：

1. ✅ 设备资产管理
2. ✅ 维护维修管理
3. ✅ 计划性维护 (preventive-maintenance.html)
4. ✅ 点巡检管理 (inspection-management.html)
5. ✅ 备品备件管理 (spare-parts-management.html)
6. ✅ 预测性维护 (predictive-maintenance.html) - 新开发
7. ✅ 知识库管理 (knowledge-base.html) - 新开发
8. ✅ OEE统计分析 (oee-analysis.html) - 新开发

## 🚨 如果仍然有问题

### 检查清单：
- [ ] GitHub 仓库是否包含所有正确命名的文件？
- [ ] Vercel 项目是否关联到正确的 GitHub 仓库？
- [ ] Vercel 部署分支是否设置为 `main`？
- [ ] Vercel 部署是否成功（无错误）？
- [ ] 浏览器缓存是否已清除？

### 联系 Vercel 支持
如果以上都正常但仍有问题：
1. 在 Vercel 控制台查看部署日志
2. 检查是否有构建错误
3. 尝试手动触发重新部署

---

**创建时间**: 2024-10-30  
**状态**: 待执行修复
