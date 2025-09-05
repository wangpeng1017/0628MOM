# EMS 能源管理模块 开发说明（基于 emsprd.md）

## 1. 设计目标
- 严格对齐 emsprd.md 的 3.1/3.2/3.3/3.4/3.7 中对能源模块的功能要求，构建 Demo 级可演示页面。
- 按现有技术栈与风格实现（HTML5 + Tailwind + FontAwesome + 原生 JS），响应式适配。

## 2. 页面与功能映射
- 能源看板（pages/energy-park/energy-dashboard.html）
  - 3.1 核心指标、趋势、分类占比、项目简介、累计效益
  - 3.4.1 预设看板聚合核心图卡
- 能耗分析（pages/energy-park/energy-analysis.html）
  - 3.4.2 分项（饼图）、比较（柱状）、查询（折线）与仪表监测（参数列表）
  - 3.2 分项计量说明、异常告警服务（说明性卡片）
- 能耗报表（pages/energy-park/energy-reports.html）
  - 3.4.4 日/月/年报生成与导出 CSV
- 能源大屏（pages/energy-park/bigscreen.html）
  - 3.4.3 大屏与 3.7 一张图聚合（深色主题、科技感）

## 3. 数据与接口预留
- 模拟数据：在页面脚本中内联或基于 assets/js/energy-park-utils.js 的导出/格式化封装。
- API 占位（示例）：
  - GET /api/ems/overview?period=day|month
  - GET /api/ems/analysis?type=share|compare|trend
  - GET /api/ems/meters?point=...
  - GET /api/ems/reports?type=daily|monthly|annual&scope=...

## 4. 导航调整
- index.html 的 energy-park 子菜单已更新为：
  - 能源看板 / 能耗分析 / 能耗报表 / 能源大屏 / AI预测与调度 / 双碳管理 / 新能源管理 / 设备能耗控制

## 5. UI/UX
- 蓝灰企业级配色与卡片式布局；Tailwind 响应式网格；FontAwesome 图标
- 图表区域先以渐变占位，后续可替换 ECharts/Chart.js

## 6. 对照检查
- 详见 ENERGY-EMS-PRD-GAP-CHECKLIST.md

## 7. 后续建议
- 引入 ECharts 完成折线/柱状/饼图的真实图表，支持悬停提示、图例联动
- 增强仪表监测列表，覆盖三相全量参数与时间戳
- 结合“智慧能源一张图”接入轻量地图或 SVG 拓扑交互

