#!/bin/bash

# 添加修改的文件
git add assets/js/equipment-oee-analysis.js
git add "OEE图表修复说明.md"
git add pages/equipment.html
git add pages/equipment/mobile-app.html
git add assets/js/mobile-app-demo.js
git add index.html
git add "移动应用模块说明.md"

# 提交更改
git commit -m "feat: 新增移动应用模块和修复OEE图表显示问题

OEE图表修复:
- 修复页面加载时未初始化趋势和损失视图图表的问题
- 优化图表实例管理，使用getInstanceByDom避免重复创建
- 添加DOM元素存在性检查，提高代码健壮性
- 使用setTimeout延迟初始化确保DOM完全渲染
- 修复涉及的图表：OEE历史趋势、三要素趋势、六大损失柏拉图、损失饼图

移动应用模块:
- 在设备管理模块添加移动应用入口
- 在左侧导航菜单中添加移动应用菜单项
- 创建移动应用DEMO页面，支持三种角色工作台展示
- 实现操作员工作台：扫码报修、设备SOP、巡检任务
- 实现维修员工作台：我的工单、扫码领料、知识库查询
- 实现管理人员工作台：OEE看板、工单审批、报表速览
- 采用移动端UI设计，模拟真实手机界面效果
- 创建完整的功能说明文档"

# 推送到远程仓库
git push origin main

echo "提交完成！"
