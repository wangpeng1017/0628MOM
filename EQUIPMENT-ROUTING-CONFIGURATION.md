# 设备管理系统路由配置说明

## 📋 路由映射表

以下是设备管理系统所有模块的路由配置，确保导航链接与实际文件名一致：

| 序号 | 模块名称 | 导航路由 | 实际文件 | 状态 |
|------|---------|---------|---------|------|
| 1 | 设备资产管理 | `equipment/asset-management.html` | `pages/equipment/asset-management.html` | ✅ |
| 2 | 维护维修管理 | `equipment/maintenance-repair.html` | `pages/equipment/maintenance-repair.html` | ✅ |
| 3 | 计划性维护 | `equipment/preventive-maintenance.html` | `pages/equipment/preventive-maintenance.html` | ✅ |
| 4 | 点巡检管理 | `equipment/inspection-management.html` | `pages/equipment/inspection-management.html` | ✅ |
| 5 | 备品备件管理 | `equipment/spare-parts-management.html` | `pages/equipment/spare-parts-management.html` | ✅ |
| 6 | 预测性维护 | `equipment/predictive-maintenance.html` | `pages/equipment/predictive-maintenance.html` | ✅ |
| 7 | 知识库管理 | `equipment/knowledge-base.html` | `pages/equipment/knowledge-base.html` | ✅ |
| 8 | OEE统计分析 | `equipment/oee-analysis.html` | `pages/equipment/oee-analysis.html` | ✅ |

## 📁 文件映射关系

### 开发文件名 → 路由文件名

部分模块在开发时使用了不同的文件名，需要复制到正确的路由文件名：

```
开发文件                              →  路由文件
─────────────────────────────────────────────────────────────
planned-maintenance.html              →  preventive-maintenance.html
inspection.html                       →  inspection-management.html
spare-parts.html                      →  spare-parts-management.html
predictive-maintenance-new.html       →  predictive-maintenance.html
knowledge-base-new.html               →  knowledge-base.html
oee-analysis-new.html                 →  oee-analysis.html
```

## 🔧 配置文件位置

### 主导航配置
- **文件**: `pages/equipment.html`
- **作用**: 设备管理模块的主导航页面
- **包含**: 8个模块的导航卡片和路由链接

### 顶层导航配置
- **文件**: `index.html`
- **作用**: 系统首页，包含设备管理入口

## ✅ 路由验证清单

使用以下命令验证所有路由文件是否存在：

```powershell
# 检查所有路由文件
Test-Path "pages\equipment\asset-management.html"
Test-Path "pages\equipment\maintenance-repair.html"
Test-Path "pages\equipment\preventive-maintenance.html"
Test-Path "pages\equipment\inspection-management.html"
Test-Path "pages\equipment\spare-parts-management.html"
Test-Path "pages\equipment\predictive-maintenance.html"
Test-Path "pages\equipment\knowledge-base.html"
Test-Path "pages\equipment\oee-analysis.html"
```

## 🚀 部署步骤

### 1. 执行文件替换脚本
```powershell
.\replace-files.ps1
```

### 2. 验证文件存在
```powershell
# 检查所有必需文件
ls pages\equipment\*-management.html
ls pages\equipment\preventive-maintenance.html
ls pages\equipment\predictive-maintenance.html
ls pages\equipment\knowledge-base.html
ls pages\equipment\oee-analysis.html
```

### 3. 提交到GitHub
```powershell
.\deploy-to-github.ps1
```

或手动执行：
```bash
git add .
git commit -m "feat: complete all equipment modules with correct routing"
git push origin main
```

## 📊 JavaScript文件映射

每个HTML页面对应的JavaScript文件：

| HTML文件 | JavaScript文件 | 状态 |
|---------|---------------|------|
| asset-management.html | `assets/js/equipment-asset-management.js` | ✅ |
| maintenance-repair.html | `assets/js/equipment-maintenance-repair.js` | ✅ |
| preventive-maintenance.html | `assets/js/equipment-planned-maintenance.js` | ✅ |
| inspection-management.html | `assets/js/equipment-inspection.js` | ✅ |
| spare-parts-management.html | `assets/js/equipment-spare-parts.js` | ✅ |
| predictive-maintenance.html | `assets/js/equipment-predictive-maintenance.js` | ✅ |
| knowledge-base.html | `assets/js/equipment-knowledge-base.js` | ✅ |
| oee-analysis.html | `assets/js/equipment-oee-analysis.js` | ✅ |

## 🎨 主题色配置

每个模块使用不同的主题色以便区分：

| 模块 | 主题色 | 颜色代码 |
|------|--------|---------|
| 设备资产管理 | 蓝色 | #3b82f6 |
| 维护维修管理 | 橙色 | #f97316 |
| 计划性维护 | 绿色 | #10b981 |
| 点巡检管理 | 橙色 | #f59e0b |
| 备品备件管理 | 紫色 | #8b5cf6 |
| 预测性维护 | 蓝色 | #3b82f6 |
| 知识库管理 | 绿色 | #10b981 |
| OEE统计分析 | 靛蓝色 | #6366f1 |

## 🔍 常见问题

### Q: 为什么有些文件名不一致？
A: 在开发过程中，部分模块使用了更直观的英文名称（如 `planned-maintenance`），但为了与导航路由保持一致，需要复制到路由指定的文件名（如 `preventive-maintenance`）。

### Q: 如何确认路由配置正确？
A: 
1. 检查 `pages/equipment.html` 中的所有 `href` 属性
2. 确保对应的HTML文件存在于 `pages/equipment/` 目录
3. 在浏览器中测试每个导航链接

### Q: 如果添加新模块需要注意什么？
A: 
1. 在 `pages/equipment.html` 添加导航卡片
2. 创建对应的HTML文件，文件名与路由一致
3. 创建对应的JavaScript文件
4. 更新本配置文档

## 📅 更新日志

- **2024-10-30**: 完成所有8个设备管理模块的路由配置
- **2024-10-30**: 创建自动化部署脚本
- **2024-10-30**: 添加路由配置文档

---

**维护者**: AI Assistant  
**最后更新**: 2024-10-30
