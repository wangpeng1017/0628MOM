# OEE统计分析图表显示修复说明

## 问题描述
OEE统计分析页面中的"趋势分析"和"六大损失"视图的图表不显示。

## 问题原因
1. **初始化时机问题**：页面加载时只初始化了dashboard视图的图表，没有初始化趋势分析和六大损失视图的图表
2. **图表实例重复创建**：每次切换视图时都会创建新的图表实例，导致内存泄漏和显示异常
3. **DOM渲染时序问题**：在DOM元素完全渲染之前就初始化图表，导致图表容器尺寸为0

## 修复内容

### 1. 页面加载时初始化对应视图的图表
**文件**: `assets/js/equipment-oee-analysis.js`

在 `DOMContentLoaded` 事件处理函数中添加了根据当前视图初始化对应图表的逻辑：

```javascript
// 延迟初始化当前视图的图表，确保DOM已经渲染完成
setTimeout(() => {
    if (currentView === 'trend') {
        initializeTrendCharts();
    } else if (currentView === 'loss') {
        initializeLossCharts();
    }
}, 100);
```

### 2. 优化图表实例管理
修改了以下函数，使用 `echarts.getInstanceByDom()` 来获取已存在的图表实例，避免重复创建：

- `initializeTrendCharts()` - 趋势分析图表初始化
  - OEE历史趋势图
  - 时间稼动率趋势图
  - 性能稼动率趋势图
  - 质量合格率趋势图

- `initializeLossCharts()` - 六大损失图表初始化
  - 损失柏拉图
  - 损失分类饼图

修改示例：
```javascript
// 修改前
const historyChart = echarts.init(document.getElementById('oee-history-chart'));

// 修改后
const historyChartDom = document.getElementById('oee-history-chart');
if (!historyChartDom) return;
const historyChart = echarts.getInstanceByDom(historyChartDom) || echarts.init(historyChartDom);
```

### 3. 添加DOM元素检查
在每个图表初始化前都添加了DOM元素存在性检查，避免因元素不存在导致的错误。

### 4. 优化视图切换逻辑
在 `switchView()` 函数中保持了延迟初始化的逻辑，确保视图切换后图表能正确显示：

```javascript
// 延迟初始化图表，确保DOM已经渲染完成
setTimeout(() => {
    if (viewType === 'trend') {
        initializeTrendCharts();
    } else if (viewType === 'loss') {
        initializeLossCharts();
    }
}, 100);
```

## 测试验证

### 测试步骤
1. 打开OEE统计分析页面：`pages/equipment/oee-analysis.html`
2. 默认显示"集中看板"视图，检查图表是否正常显示
3. 点击"趋势分析"按钮，检查以下图表：
   - OEE历史趋势图（30天数据）
   - 时间稼动率趋势图（周数据）
   - 性能稼动率趋势图（周数据）
   - 质量合格率趋势图（周数据）
4. 点击"六大损失"按钮，检查以下图表：
   - 六大损失柏拉图（柱状图+折线图组合）
   - 损失类型分布饼图
5. 在各视图间来回切换，确保图表每次都能正确显示
6. 使用URL参数直接访问特定视图，如：
   - `?view=trend` - 直接打开趋势分析
   - `?view=loss` - 直接打开六大损失

### 预期结果
- 所有图表都能正常显示
- 图表数据正确渲染
- 视图切换流畅，无闪烁或错误
- 图表交互功能正常（tooltip、legend等）

## 技术要点

1. **ECharts实例管理**：使用 `getInstanceByDom()` 避免重复创建实例
2. **异步渲染**：使用 `setTimeout` 确保DOM完全渲染
3. **防御性编程**：添加DOM元素存在性检查
4. **视图状态管理**：正确处理不同视图的初始化时机

## 相关文件
- `pages/equipment/oee-analysis.html` - OEE统计分析页面
- `assets/js/equipment-oee-analysis.js` - OEE分析JavaScript逻辑

## 修复日期
2025-10-31
