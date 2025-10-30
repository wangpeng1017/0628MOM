# 设备管理剩余模块开发指南

## 📋 当前状态

**已完成**: 2/4 模块 (50%)
- ✅ 维护维修管理 (`pages/equipment/maintenance-repair.html`)
- ✅ 计划性维护管理 (`pages/equipment/planned-maintenance.html`)

**待开发**: 2/4 模块 (50%)
- ⏳ 点巡检管理 (`pages/equipment/inspection.html` - 需重构)
- ⏳ 备品备件管理 (`pages/equipment/spare-parts.html` - 需创建)

---

## 🎯 下一步开发任务

### 任务1: 点巡检管理模块

#### 需求来源
**文档**: `e:\trae\0628MOM\设备管理需求文档.md` 第4.4节 (第201-262行)

#### 核心功能要求

**1. 巡检路线与计划 (4.4.1)**
- 巡检路线定义（电子地图拖拽，设备点串联）
- 巡检计划配置（按班次/天/周频率）
- 标准化检查项目（定性：正常/异常，定量：数值范围）
- 指派特定岗位或人员

**2. 移动化任务执行 (4.4.2)**
- 任务自动推送到手机APP
- 扫码确认到位（防止漏检、假检）
- 引导式检查（检查表形式）
- 拍照、录音、录像记录
- 离线执行支持

**3. 异常发现与闭环 (4.4.3)**
- 一键上报异常
- 异常转报修（直接进入维修流程）
- 缩短问题发现到处理时间

**4. 数据分析 (4.4.4)**
- 巡检报告自动生成
- 异常统计分析（TOP10、常见类型）
- 参数趋势分析（温度、压力等）

#### 业务流程示例
**场景**: 操作工小王执行白班"一号冲压车间"日常巡检
1. 计划制定：设备主管预设巡检路线和计划
2. 任务接收：小王在APP看到巡检任务
3. 开始巡检：点击开始，显示第一台设备
4. 扫码签到：扫描设备二维码确认到位
5. 执行检查：按检查表逐项检查（油位、温度、异响等）
6. 发现异常：温度超标，拍照上传，标注异常
7. 转报修：严重异常一键转为报修单
8. 继续巡检：完成所有设备检查
9. 提交完成：系统生成巡检报告

#### 参照模块
- **维护维修管理**: 工单流转逻辑、状态管理
- **计划性维护**: 日历视图、任务列表、筛选功能

#### 建议实现

**视图结构**:
```
- 路线视图: 展示所有巡检路线（左侧列表 + 右侧路线详情）
- 计划视图: 巡检计划列表（频率、执行人、关联路线）
- 任务视图: 今日/本周巡检任务（待执行/执行中/已完成）
- 报告视图: 巡检报告和异常统计
```

**关键数据结构**:
```javascript
// 巡检路线
{
  id, name, description, 
  equipmentPoints: [{equipmentId, equipmentName, checkItems: [...]}],
  estimatedTime, createTime
}

// 巡检计划
{
  id, name, routeId, frequency, 
  assignees: [...], active, createTime
}

// 巡检任务
{
  id, code, routeId, planId, 
  scheduledDate, assignee, status,
  checkResults: [{itemId, result, value, photos, abnormal}],
  startTime, endTime, createTime
}
```

**样例数据** (至少3条):
- 一号冲压车间日常巡检路线 (5个设备点)
- 二号装配车间白班巡检计划 (每日执行)
- 今日巡检任务 (3条: 2已完成, 1进行中)

---

### 任务2: 备品备件管理模块

#### 需求来源
**文档**: `e:\trae\0628MOM\设备管理需求文档.md` 第4.5节 (第263-317行)

#### 核心功能要求

**1. 备件电子台账 (4.5.1)**
- 一物一码（条码/二维码标识）
- 详细信息：名称、规格、材质、供应商、价格、存放位置
- 关联设备（设备备件BOM）
- 附件管理（图片、图纸）

**2. 出入库管理 (4.5.2)**
- 多种业务类型：采购入库、领用出库、退料入库、盘点、调拨、报废
- 移动化扫码作业
- 与工单联动（维修工程师扫码领料，自动关联工单）
- 成本追溯链条

**3. 库存预警 (4.5.3)**
- 安全库存、最小库存、最大库存阈值
- 自动预警（低于安全库存时通知）
- 智能补货建议（基于历史消耗）
- ABC分类分析（重点监控A类备件）
- 呆滞料分析（长期未动用的物料）

#### 业务流程示例

**入库流程**:
1. 采购到货：一批传感器到货
2. 扫码入库：仓库管理员扫描采购订单号
3. 逐一扫描：扫描每个备件包装条码，输入数量
4. 上架确认：系统推荐货位，确认上架，库存增加

**出库流程**:
1. 现场需求：维修工程师需要更换传感器
2. 查询库存：通过APP确认仓库有库存
3. 扫码领料：出示维修工单二维码
4. 扫码出库：仓库管理员扫描工单码 + 备件码
5. 自动关联：库存减1，成本计入工单

**预警流程**:
1. 触发预警：出库后库存低于安全库存
2. 生成申请：系统自动生成采购申请单
3. 进入审批：采购审批流程

#### 参照模块
- **维护维修管理**: 与工单联动逻辑
- **计划性维护**: 列表管理、筛选功能

#### 建议实现

**视图结构**:
```
- 台账视图: 备件列表（名称、规格、库存、位置、状态）
- 出入库视图: 出入库记录列表（类型、备件、数量、操作人、时间）
- 库存视图: 库存看板（总量、预警、呆滞、ABC分类）
- 预警视图: 库存预警列表（低于安全库存的备件）
```

**关键数据结构**:
```javascript
// 备件台账
{
  id, code, name, specification, 
  category, supplier, price, 
  location, stockQuantity, safetyStock,
  relatedEquipment: [...], createTime
}

// 出入库记录
{
  id, type, sparePartId, quantity,
  operator, relatedWorkOrder, 
  fromLocation, toLocation, 
  cost, remark, createTime
}

// 库存预警
{
  id, sparePartId, currentStock, safetyStock,
  alertLevel, status, createTime
}
```

**样例数据** (至少3条):
- 温度传感器 (库存: 5, 安全库存: 10, 预警中)
- 液压油滤芯 (库存: 20, 安全库存: 15, 正常)
- 伺服电机 (库存: 2, 安全库存: 5, 预警中)

---

## 🎨 统一设计规范

### 布局规范
- **全宽布局**: 不使用左侧面板，内容区占满全屏
- **顶部区域**: 标题 + 视图切换 + 操作按钮
- **统计卡片**: 4个关键指标横向排列
- **筛选器**: 关键词搜索 + 下拉筛选 + 日期范围
- **主内容**: 列表/日历/看板等多视图

### 配色规范
- **点巡检**: 橙色主题 (#f59e0b) - 代表检查和预警
- **备品备件**: 紫色主题 (#8b5cf6) - 代表库存和物料

### 交互规范
- **模态窗口**: 详情、表单、操作确认
- **状态徽章**: 不同状态用不同颜色
- **操作按钮**: 图标 + 文字，hover效果
- **友好提示**: Alert确认和成功提示

---

## 💻 技术规范

### 文件命名
```
pages/equipment/inspection.html          # 点巡检管理
assets/js/equipment-inspection.js        # 点巡检JS

pages/equipment/spare-parts.html         # 备品备件管理
assets/js/equipment-spare-parts.js       # 备品备件JS
```

### 代码结构
```javascript
// 全局变量
let currentView = 'list';
let inspectionRoutes = [];
let inspectionPlans = [];
let inspectionTasks = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 10;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderView();
    updateStatistics();
    setupEventListeners();
});

// 视图切换
function switchView(viewType) { ... }

// 数据渲染
function renderRouteView() { ... }
function renderPlanView() { ... }
function renderTaskView() { ... }

// 筛选功能
function applyFilters() { ... }
function resetFilters() { ... }

// 模态窗口
function openModal(modalType) { ... }
function closeModal(modalType) { ... }

// CRUD操作
function createRoute() { ... }
function updateRoute(id) { ... }
function deleteRoute(id) { ... }

// 辅助函数
function getStatusText(status) { ... }
function getStatusClass(status) { ... }
function updateStatistics() { ... }

// 数据初始化
function initializeData() {
    // 初始化样例数据
}
```

---

## 📝 开发清单

### 点巡检管理
- [ ] 创建HTML页面结构
- [ ] 实现路线管理功能
- [ ] 实现计划管理功能
- [ ] 实现任务列表功能
- [ ] 实现异常处理功能
- [ ] 添加样例数据
- [ ] 测试所有功能
- [ ] 编写完成报告

### 备品备件管理
- [ ] 创建HTML页面结构
- [ ] 实现台账管理功能
- [ ] 实现出入库功能
- [ ] 实现库存预警功能
- [ ] 实现ABC分类功能
- [ ] 添加样例数据
- [ ] 测试所有功能
- [ ] 编写完成报告

---

## 🚀 快速开始命令

### 新会话开始时
```
参考维护维修管理的逻辑，继续开发点巡检管理和备品备件管理模块。

需求文档: e:\trae\0628MOM\设备管理需求文档.md
- 点巡检管理: 第4.4节 (201-262行)
- 备品备件管理: 第4.5节 (263-317行)

参照已完成模块:
- pages/equipment/maintenance-repair.html
- pages/equipment/planned-maintenance.html

请按照EQUIPMENT-NEXT-MODULES-GUIDE.md的指南开发。
```

---

## 📚 参考资料

### 已完成模块
1. **维护维修管理**
   - HTML: `pages/equipment/maintenance-repair.html`
   - JS: `assets/js/equipment-maintenance-repair.js`
   - 报告: `MAINTENANCE-REPAIR-LAYOUT-OPTIMIZATION.md`

2. **计划性维护管理**
   - HTML: `pages/equipment/planned-maintenance.html`
   - JS: `assets/js/equipment-planned-maintenance.js`
   - 报告: `EQUIPMENT-PLANNED-MAINTENANCE-COMPLETION.md`

### 需求文档
- **主文档**: `设备管理需求文档.md`
- **点巡检**: 第4.4节 (201-262行)
- **备品备件**: 第4.5节 (263-317行)

### 总结文档
- **模块总结**: `EQUIPMENT-MODULES-SUMMARY.md`
- **开发指南**: `EQUIPMENT-NEXT-MODULES-GUIDE.md` (本文档)

---

## ✅ 验收标准

### 功能完整性
- ✅ 所有核心功能都已实现
- ✅ 样例数据完整可用
- ✅ 所有交互都有响应
- ✅ 模态窗口正常工作

### 代码质量
- ✅ 代码结构清晰
- ✅ 命名规范统一
- ✅ 注释完整
- ✅ 无明显bug

### 用户体验
- ✅ 界面美观
- ✅ 操作流畅
- ✅ 提示友好
- ✅ 响应式布局

### 文档完整
- ✅ 完成报告
- ✅ 功能说明
- ✅ 样例数据说明
- ✅ 使用指南

---

**创建时间**: 2025-01-30  
**适用版本**: v1.0.0  
**下次会话**: 继续开发点巡检和备品备件模块  
**预计完成**: 2个模块，约2,400行代码
