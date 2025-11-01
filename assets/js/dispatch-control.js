// 调度总控平台 - JavaScript
let currentModule = 'delivery-stats';
let tasksData = [];
let chartsInstances = {};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('调度总控平台已加载');
    
    // 检查内容区是否存在
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('内容区元素未找到！');
        return;
    }
    
    initializeData();
    
    // 从URL参数获取模块名称
    const urlParams = new URLSearchParams(window.location.search);
    const moduleName = urlParams.get('module') || 'delivery-stats';
    
    console.log('加载模块:', moduleName);
    showModule(moduleName);
    startRealTimeUpdate();
});

// 初始化模拟数据
function initializeData() {
    tasksData = [
        {
            id: 'TASK-2024-001',
            material: '电解液-A型',
            materialCode: 'MAT-001',
            from: '仓储A区-3货架',
            to: '车间B-工位05',
            device: 'AGV-001',
            priority: 'high',
            status: 'executing',
            progress: 65,
            createTime: '2024-11-01 13:15:00'
        },
        {
            id: 'TASK-2024-002',
            material: '正极片',
            materialCode: 'MAT-002',
            from: '仓储B区-5货架',
            to: '车间A-工位12',
            device: 'AGV-003',
            priority: 'medium',
            status: 'pending',
            progress: 0,
            createTime: '2024-11-01 13:20:00'
        },
        {
            id: 'TASK-2024-003',
            material: '隔膜材料',
            materialCode: 'MAT-003',
            from: '仓储C区-2货架',
            to: '车间C-工位08',
            device: 'AGV-005',
            priority: 'high',
            status: 'executing',
            progress: 85,
            createTime: '2024-11-01 13:10:00'
        },
        {
            id: 'TASK-2024-004',
            material: '负极片',
            materialCode: 'MAT-004',
            from: '仓储A区-7货架',
            to: '车间B-工位03',
            device: 'Forklift-002',
            priority: 'low',
            status: 'completed',
            progress: 100,
            createTime: '2024-11-01 12:50:00'
        },
        {
            id: 'TASK-2024-005',
            material: '铝壳',
            materialCode: 'MAT-005',
            from: '仓储D区-1货架',
            to: '车间A-工位15',
            device: 'AGV-007',
            priority: 'medium',
            status: 'executing',
            progress: 40,
            createTime: '2024-11-01 13:25:00'
        }
    ];
}

// 模块切换
function showModule(moduleName, event) {
    console.log('showModule 被调用，模块名:', moduleName);
    currentModule = moduleName;
    
    // 更新菜单激活状态（只在有event时执行）
    if (event) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('bg-cyan-50', 'text-cyan-600');
            item.classList.add('text-gray-700');
        });
        
        const menuItem = event.target.closest('.menu-item');
        if (menuItem) {
            menuItem.classList.add('bg-cyan-50', 'text-cyan-600');
            menuItem.classList.remove('text-gray-700');
        }
    }
    
    // 获取内容区
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('showModule: 内容区未找到');
        return false;
    }
    
    // 根据模块名称加载对应内容
    console.log('正在获取模块内容...');
    const moduleContent = getModuleContent(moduleName);
    console.log('模块内容长度:', moduleContent ? moduleContent.length : 0);
    
    if (moduleContent) {
        contentArea.innerHTML = moduleContent;
        console.log('内容已插入到页面');
    } else {
        console.error('模块内容为空');
    }
    
    // 如果是图表模块，初始化图表
    if (['delivery-stats', 'equipment-utilization', 'delivery-rate', 'call-response', 'alarm-stats'].includes(moduleName)) {
        setTimeout(() => initializeCharts(), 100);
    }
    
    // 如果是任务相关模块，渲染表格
    if (['delivery-stats', 'task-assignment', 'task-query'].includes(moduleName)) {
        setTimeout(() => renderTasksTable(), 100);
    }
    
    return false;
}

// 渲染任务列表
function renderTasksTable() {
    const tbody = document.getElementById('tasks-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = tasksData.map(task => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${task.id}</div>
                <div class="text-xs text-gray-500">${task.createTime}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${task.material}</div>
                <div class="text-xs text-gray-500">${task.materialCode}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-xs text-gray-700">
                    <div class="flex items-center mb-1">
                        <i class="fas fa-map-marker-alt text-green-500 mr-1"></i>
                        ${task.from}
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>
                        ${task.to}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">${task.device}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getPriorityBadge(task.priority)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getStatusBadge(task.status, task.progress)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewTaskDetail('${task.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                ${task.status !== 'completed' ? `
                    <button onclick="adjustTask('${task.id}')" class="text-green-600 hover:text-green-800 mr-3" title="调整任务">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="cancelTask('${task.id}')" class="text-red-600 hover:text-red-800" title="取消任务">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// 获取优先级徽章
function getPriorityBadge(priority) {
    const config = {
        'high': { class: 'bg-red-100 text-red-700', icon: 'arrow-up', text: '高' },
        'medium': { class: 'bg-yellow-100 text-yellow-700', icon: 'minus', text: '中' },
        'low': { class: 'bg-gray-100 text-gray-700', icon: 'arrow-down', text: '低' }
    };
    const c = config[priority] || config['medium'];
    return `<span class="badge ${c.class}"><i class="fas fa-${c.icon}"></i> ${c.text}</span>`;
}

// 获取状态徽章
function getStatusBadge(status, progress) {
    const config = {
        'pending': { class: 'bg-gray-100 text-gray-700', icon: 'clock', text: '待执行' },
        'executing': { class: 'bg-blue-100 text-blue-700', icon: 'spinner fa-spin', text: '执行中' },
        'completed': { class: 'bg-green-100 text-green-700', icon: 'check-circle', text: '已完成' },
        'failed': { class: 'bg-red-100 text-red-700', icon: 'times-circle', text: '失败' }
    };
    const c = config[status] || config['pending'];
    
    if (status === 'executing') {
        return `
            <div>
                <span class="status-chip ${c.class}"><i class="fas fa-${c.icon}"></i> ${c.text}</span>
                <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${progress}%"></div>
                </div>
                <div class="text-xs text-gray-500 mt-0.5">${progress}%</div>
            </div>
        `;
    }
    
    return `<span class="status-chip ${c.class}"><i class="fas fa-${c.icon}"></i> ${c.text}</span>`;
}

// 初始化图表
function initializeCharts() {
    // 配送任务趋势图
    const tasksChartEl = document.getElementById('chart-tasks');
    if (tasksChartEl) {
        const tasksChart = echarts.init(tasksChartEl);
        tasksChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['任务总数', '完成数', '延迟数']
        },
        xAxis: {
            type: 'category',
            data: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '任务总数',
                type: 'line',
                data: [45, 52, 61, 58, 63, 56],
                smooth: true,
                itemStyle: { color: '#06b6d4' }
            },
            {
                name: '完成数',
                type: 'line',
                data: [42, 49, 58, 55, 60, 53],
                smooth: true,
                itemStyle: { color: '#10b981' }
            },
            {
                name: '延迟数',
                type: 'line',
                data: [3, 3, 3, 3, 3, 3],
                smooth: true,
                itemStyle: { color: '#ef4444' }
            }
        ]
        });
        chartsInstances.tasks = tasksChart;
    }

    // 设备利用率排名
    const utilizationChartEl = document.getElementById('chart-utilization');
    if (utilizationChartEl) {
        const utilizationChart = echarts.init(utilizationChartEl);
    utilizationChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'value',
            max: 100
        },
        yAxis: {
            type: 'category',
            data: ['AGV-001', 'AGV-003', 'AGV-005', 'Forklift-001', 'AGV-007']
        },
        series: [{
            type: 'bar',
            data: [92, 88, 85, 78, 75],
            itemStyle: {
                color: function(params) {
                    const colors = ['#10b981', '#10b981', '#06b6d4', '#f59e0b', '#f59e0b'];
                    return colors[params.dataIndex];
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
            }
        }]
        });
        chartsInstances.utilization = utilizationChart;
    }

    // 送达率分析
    const deliveryChartEl = document.getElementById('chart-delivery');
    if (deliveryChartEl) {
        const deliveryChart = echarts.init(deliveryChartEl);
    deliveryChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                formatter: '{b}\n{c}%'
            },
            data: [
                { value: 96.8, name: '按时送达', itemStyle: { color: '#10b981' } },
                { value: 2.5, name: '轻微延迟', itemStyle: { color: '#f59e0b' } },
                { value: 0.7, name: '严重延迟', itemStyle: { color: '#ef4444' } }
            ]
        }]
        });
        chartsInstances.delivery = deliveryChart;
    }

    // 呼叫应答时效
    const callsChartEl = document.getElementById('chart-calls');
    if (callsChartEl) {
        const callsChart = echarts.init(callsChartEl);
        callsChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value',
                name: '分钟'
            },
            series: [{
                name: '平均响应时间',
                type: 'bar',
                data: [2.5, 2.3, 2.1, 2.4, 2.2, 1.9, 2.0],
                itemStyle: { color: '#8b5cf6' }
            }]
        });
        chartsInstances.calls = callsChart;
    }

    // 设备运行时长分布
    const equipmentTimeChartEl = document.getElementById('chart-equipment-time');
    if (equipmentTimeChartEl) {
        const equipmentTimeChart = echarts.init(equipmentTimeChartEl);
        equipmentTimeChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['0-2小时', '2-4小时', '4-6小时', '6-8小时', '8小时以上']
            },
            xAxis: {
                type: 'category',
                data: ['AGV', '叉车', '输送线', '堆垛机']
            },
            yAxis: {
                type: 'value',
                name: '设备数量'
            },
            series: [
                {
                    name: '0-2小时',
                    type: 'bar',
                    stack: 'total',
                    data: [2, 1, 0, 1],
                    itemStyle: { color: '#ef4444' }
                },
                {
                    name: '2-4小时',
                    type: 'bar',
                    stack: 'total',
                    data: [3, 2, 1, 1],
                    itemStyle: { color: '#f59e0b' }
                },
                {
                    name: '4-6小时',
                    type: 'bar',
                    stack: 'total',
                    data: [2, 1, 2, 1],
                    itemStyle: { color: '#06b6d4' }
                },
                {
                    name: '6-8小时',
                    type: 'bar',
                    stack: 'total',
                    data: [2, 1, 1, 0],
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: '8小时以上',
                    type: 'bar',
                    stack: 'total',
                    data: [1, 0, 1, 1],
                    itemStyle: { color: '#8b5cf6' }
                }
            ]
        });
        chartsInstances.equipmentTime = equipmentTimeChart;
    }

    // 送达率趋势
    const deliveryTrendChartEl = document.getElementById('chart-delivery-trend');
    if (deliveryTrendChartEl) {
        const deliveryTrendChart = echarts.init(deliveryTrendChartEl);
        deliveryTrendChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['送达率', '目标线']
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月']
            },
            yAxis: {
                type: 'value',
                min: 90,
                max: 100,
                name: '送达率(%)'
            },
            series: [
                {
                    name: '送达率',
                    type: 'line',
                    data: [95.2, 96.1, 95.8, 96.5, 97.2, 96.8, 97.5, 96.9, 97.8, 96.2],
                    smooth: true,
                    itemStyle: { color: '#10b981' },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                                { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                            ]
                        }
                    }
                },
                {
                    name: '目标线',
                    type: 'line',
                    data: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
                    lineStyle: { type: 'dashed', color: '#ef4444' },
                    itemStyle: { color: '#ef4444' }
                }
            ]
        });
        chartsInstances.deliveryTrend = deliveryTrendChart;
    }

    // 报警分类占比
    const alarmTypeChartEl = document.getElementById('chart-alarm-type');
    if (alarmTypeChartEl) {
        const alarmTypeChart = echarts.init(alarmTypeChartEl);
        alarmTypeChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%'
                },
                data: [
                    { value: 35, name: '路径阻塞', itemStyle: { color: '#ef4444' } },
                    { value: 28, name: '设备故障', itemStyle: { color: '#f59e0b' } },
                    { value: 18, name: '通信异常', itemStyle: { color: '#06b6d4' } },
                    { value: 12, name: '电量不足', itemStyle: { color: '#8b5cf6' } },
                    { value: 7, name: '其他', itemStyle: { color: '#6b7280' } }
                ]
            }]
        });
        chartsInstances.alarmType = alarmTypeChart;
    }

    // 报警高发时段
    const alarmTimeChartEl = document.getElementById('chart-alarm-time');
    if (alarmTimeChartEl) {
        const alarmTimeChart = echarts.init(alarmTimeChartEl);
        alarmTimeChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            xAxis: {
                type: 'category',
                data: ['0-2时', '2-4时', '4-6时', '6-8时', '8-10时', '10-12时', 
                       '12-14时', '14-16时', '16-18时', '18-20时', '20-22时', '22-24时']
            },
            yAxis: {
                type: 'value',
                name: '报警次数'
            },
            series: [{
                name: '报警次数',
                type: 'bar',
                data: [2, 1, 3, 5, 12, 15, 8, 18, 14, 10, 6, 3],
                itemStyle: {
                    color: function(params) {
                        return params.value > 15 ? '#ef4444' : params.value > 10 ? '#f59e0b' : '#06b6d4';
                    }
                }
            }]
        });
        chartsInstances.alarmTime = alarmTimeChart;
    }
}

// 查看任务详情
function viewTaskDetail(taskId) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;
    
    alert(`任务详情\n\n任务编号: ${task.id}\n物料: ${task.material} (${task.materialCode})\n起点: ${task.from}\n终点: ${task.to}\n执行设备: ${task.device}\n优先级: ${task.priority}\n状态: ${task.status}\n进度: ${task.progress}%\n创建时间: ${task.createTime}`);
}

// 调整任务
function adjustTask(taskId) {
    alert(`调整任务 ${taskId}\n\n可调整项：\n- 优先级\n- 执行设备\n- 配送路径`);
}

// 取消任务
function cancelTask(taskId) {
    if (confirm(`确定要取消任务 ${taskId} 吗？`)) {
        alert('任务已取消');
        // 实际应用中这里会调用API
    }
}

// 创建任务
function createTask() {
    openModal('create-task-modal');
}

// 批量分配
function batchAssign() {
    openModal('batch-assign-modal');
}

// 打开大屏展示
function openBigScreen() {
    openModal('bigscreen-modal');
}

// 刷新数据
function refreshData() {
    alert('正在刷新数据...');
    // 模拟数据刷新
    setTimeout(() => {
        renderTasksTable();
        Object.values(chartsInstances).forEach(chart => {
            chart.resize();
        });
        alert('数据刷新完成');
    }, 500);
}

// 导出报表
function exportReport() {
    alert('导出调度报表\n\n包含内容：\n- 任务统计\n- 设备利用率\n- 送达率分析\n- 异常报警汇总');
}

// 区域管理
function manageArea(type) {
    const titles = {
        'delivery': '发料区管理',
        'storage': '存放区管理',
        'waiting': '待运位置管理'
    };
    document.getElementById('area-modal-title').textContent = titles[type];
    openModal('area-modal');
}

// 人员管理
function managePersonnel(type) {
    const titles = {
        'ledger': '人员台账',
        'qualification': '资质管理',
        'training': '培训管理'
    };
    document.getElementById('personnel-modal-title').textContent = titles[type];
    openModal('personnel-modal');
}

// 基础管理
function manageBasic(type) {
    const titles = {
        'cart': '料车管理',
        'box': '料箱管理',
        'station': '工位管理'
    };
    document.getElementById('basic-modal-title').textContent = titles[type];
    openModal('basic-modal');
}

// 打开模态窗口
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

// 关闭模态窗口
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// 关闭所有模态窗口
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// ESC键关闭模态窗口
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// 点击模态窗口背景关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// 实时数据更新
function startRealTimeUpdate() {
    setInterval(() => {
        // 模拟实时更新指标
        const metrics = {
            tasks: Math.floor(Math.random() * 20) + 150,
            utilization: (Math.random() * 10 + 85).toFixed(1),
            delivery: (Math.random() * 3 + 95).toFixed(1),
            calls: Math.floor(Math.random() * 10) + 25,
            alarms: Math.floor(Math.random() * 5) + 3
        };
        
        document.getElementById('metric-tasks').textContent = metrics.tasks;
        document.getElementById('metric-utilization').textContent = metrics.utilization + '%';
        document.getElementById('metric-delivery').textContent = metrics.delivery + '%';
        document.getElementById('metric-calls').textContent = metrics.calls;
        document.getElementById('metric-alarms').textContent = metrics.alarms;
    }, 5000); // 每5秒更新一次
}

// 窗口大小改变时重新调整图表
window.addEventListener('resize', () => {
    Object.values(chartsInstances).forEach(chart => {
        chart.resize();
    });
});

// 获取模块内容
function getModuleContent(moduleName) {
    // 使用switch语句进行惰性加载
    switch(moduleName) {
        // 一、数据分析与展示层
        case 'delivery-stats':
            return getDeliveryStatsContent();
        case 'equipment-utilization':
            return getEquipmentUtilizationContent();
        case 'delivery-rate':
            return getDeliveryRateContent();
        case 'call-response':
            return getCallResponseContent();
        case 'alarm-stats':
            return getAlarmStatsContent();
        
        // 二、业务执行层 - 任务优化配置
        case 'task-assignment':
            return getTaskAssignmentContent();
        case 'nearby-dispatch':
            return getNearbyDispatchContent();
        case 'task-query':
            return getTaskQueryContent();
        case 'exception-handling':
            return getExceptionHandlingContent();
        case 'fault-avoidance':
            return getFaultAvoidanceContent();
        
        // 二、业务执行层 - 物流追溯管理
        case 'agv-tracking':
            return getAgvTrackingContent();
        case 'material-tracking':
            return getMaterialTrackingContent();
        case 'container-tracking':
            return getContainerTrackingContent();
        case 'call-tracking':
            return getCallTrackingContent();
        
        // 二、业务执行层 - 动态监控
        case 'material-monitor':
            return getMaterialMonitorContent();
        case 'equipment-monitor':
            return getEquipmentMonitorContent();
        case 'exception-monitor':
            return getExceptionMonitorContent();
        case 'bigscreen-display':
            return getBigscreenDisplayContent();
        
        // 二、业务执行层 - 信息查询
        case 'delivery-records':
            return getDeliveryRecordsContent();
        case 'plan-material':
            return getPlanMaterialContent();
        case 'route-query':
            return getRouteQueryContent();
        case 'alarm-query':
            return getAlarmQueryContent();
        
        // 三、资源管理层 - 存放区管理
        case 'issue-area':
            return getIssueAreaContent();
        case 'storage-area':
            return getStorageAreaContent();
        case 'waiting-area':
            return getWaitingAreaContent();
        case 'remaining-area':
            return getRemainingAreaContent();
        case 'area-change':
            return getAreaChangeContent();
        
        // 三、资源管理层 - 人员管理
        case 'staff-ledger':
            return getStaffLedgerContent();
        case 'staff-maintenance':
            return getStaffMaintenanceContent();
        case 'staff-query':
            return getStaffQueryContent();
        case 'qualification-mgmt':
            return getQualificationMgmtContent();
        case 'training-mgmt':
            return getTrainingMgmtContent();
        
        // 三、资源管理层 - 基础管理
        case 'delivery-permission':
            return getDeliveryPermissionContent();
        case 'material-order':
            return getMaterialOrderContent();
        case 'cart-mgmt':
            return getCartMgmtContent();
        case 'box-mgmt':
            return getBoxMgmtContent();
        case 'workstation-mgmt':
            return getWorkstationMgmtContent();
        case 'workshop-mgmt':
            return getWorkshopMgmtContent();
        
        // 默认
        default:
            return getDefaultModuleContent(moduleName);
    }
}

// 1. 配送任务统计模块
function getDeliveryStatsContent() {
    return `
        <div>
            <!-- 统计卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">配送任务</p>
                            <p class="text-3xl font-bold text-cyan-600" id="metric-tasks">165</p>
                        </div>
                        <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-tasks text-cyan-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm text-gray-500">完成率</span>
                        <span class="text-sm font-medium text-success">94.2%</span>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">设备利用率</p>
                            <p class="text-3xl font-bold text-green-600" id="metric-utilization">94.9%</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-robot text-green-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm text-gray-500">AGV 运行中</span>
                        <span class="text-sm font-medium text-success">12/15</span>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">送达及时率</p>
                            <p class="text-3xl font-bold text-blue-600" id="metric-delivery">96.2%</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-shipping-fast text-blue-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm text-gray-500">平均耗时</span>
                        <span class="text-sm font-medium text-success">8.5min</span>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">呼叫应答</p>
                            <p class="text-3xl font-bold text-purple-600" id="metric-calls">33</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-phone-volume text-purple-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm text-gray-500">平均响应</span>
                        <span class="text-sm font-medium text-success">2.3min</span>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">异常报警</p>
                            <p class="text-3xl font-bold text-orange-600" id="metric-alarms">5</p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm text-gray-500">待处理</span>
                        <span class="text-sm font-medium text-danger">3 条</span>
                    </div>
                </div>
            </div>

            <!-- 数据分析图表 -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-line text-cyan-600 mr-2"></i>配送任务趋势
                    </h3>
                    <div id="chart-tasks" style="height: 300px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-robot text-green-600 mr-2"></i>设备利用率排名
                    </h3>
                    <div id="chart-utilization" style="height: 300px;"></div>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">配送任务列表</h2>
                    <div class="flex gap-2">
                        <button onclick="createTask()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                            <i class="fas fa-plus mr-2"></i>新建任务
                        </button>
                        <button onclick="batchAssign()" class="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            <i class="fas fa-users mr-2"></i>批量分配
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料信息</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">起点→终点</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">执行设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">优先级</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody id="tasks-tbody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 2. 设备利用率分析模块
function getEquipmentUtilizationContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">设备利用率分析</h2>
                <p class="text-sm text-gray-600">统计AGV、叉车、输送线等物流设备的运行时长、闲置时长、负载率</p>
            </div>

            <!-- 设备概览卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">总设备数</h3>
                        <i class="fas fa-robot text-cyan-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">28</p>
                    <p class="text-sm text-gray-500 mt-2">在线: 25 | 离线: 3</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">平均利用率</h3>
                        <i class="fas fa-chart-pie text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">87.3%</p>
                    <p class="text-sm text-success mt-2">↑ 5.2% 较昨日</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">运行设备</h3>
                        <i class="fas fa-play-circle text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">18</p>
                    <p class="text-sm text-gray-500 mt-2">闲置: 7 | 维护: 3</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">今日任务</h3>
                        <i class="fas fa-tasks text-purple-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-purple-600">342</p>
                    <p class="text-sm text-gray-500 mt-2">完成: 287 | 进行中: 55</p>
                </div>
            </div>

            <!-- 图表区域 -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar text-green-600 mr-2"></i>设备利用率排名
                    </h3>
                    <div id="chart-utilization" style="height: 350px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-clock text-blue-600 mr-2"></i>设备运行时长分布
                    </h3>
                    <div id="chart-equipment-time" style="height: 350px;"></div>
                </div>
            </div>

            <!-- 设备详细列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">设备利用率详情</h2>
                    <div class="flex gap-2">
                        <select class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option>全部设备</option>
                            <option>AGV</option>
                            <option>叉车</option>
                            <option>输送线</option>
                        </select>
                        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                            <i class="fas fa-download mr-2"></i>导出报表
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">利用率</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">运行时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">闲置时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-001</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: 95%"></div>
                                        </div>
                                        <span class="text-sm font-medium text-green-600">95%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">7.6h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">0.4h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">42</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        <i class="fas fa-circle text-xs mr-1"></i>运行中
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-eye"></i></button>
                                    <button class="text-green-600 hover:text-green-800"><i class="fas fa-chart-line"></i></button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-003</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: 92%"></div>
                                        </div>
                                        <span class="text-sm font-medium text-green-600">92%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">7.4h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">0.6h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">38</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        <i class="fas fa-circle text-xs mr-1"></i>运行中
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-eye"></i></button>
                                    <button class="text-green-600 hover:text-green-800"><i class="fas fa-chart-line"></i></button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Forklift-002</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">叉车</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: 78%"></div>
                                        </div>
                                        <span class="text-sm font-medium text-yellow-600">78%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">6.2h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1.8h</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">25</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                        <i class="fas fa-circle text-xs mr-1"></i>闲置
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-eye"></i></button>
                                    <button class="text-green-600 hover:text-green-800"><i class="fas fa-chart-line"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 3. 送达率统计模块
function getDeliveryRateContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">送达率统计</h2>
                <p class="text-sm text-gray-600">监控物料从仓储出库到产线签收的送达及时率，按物料类型、产线工位、时间段生成送达率报表</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">总送达率</h3>
                        <i class="fas fa-shipping-fast text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">96.8%</p>
                    <p class="text-sm text-success mt-2">↑ 1.2% 较上周</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">按时送达</h3>
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">1,245</p>
                    <p class="text-sm text-gray-500 mt-2">今日配送任务</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">轻微延迟</h3>
                        <i class="fas fa-clock text-yellow-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-yellow-600">32</p>
                    <p class="text-sm text-gray-500 mt-2">延迟 < 10分钟</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">严重延迟</h3>
                        <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-red-600">9</p>
                    <p class="text-sm text-gray-500 mt-2">延迟 ≥ 10分钟</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-pie text-blue-600 mr-2"></i>送达率分布
                    </h3>
                    <div id="chart-delivery" style="height: 300px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-line text-green-600 mr-2"></i>送达率趋势
                    </h3>
                    <div id="chart-delivery-trend" style="height: 300px;"></div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">按工位送达率统计</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工位编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">配送次数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">按时送达</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">延迟次数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">送达率</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均耗时</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">车间A-工位05</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">142</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">138</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">4</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm font-medium text-green-600">97.2%</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">7.8min</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 4. 呼叫应答统计模块
function getCallResponseContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">呼叫应答统计</h2>
                <p class="text-sm text-gray-600">分析生产缺料呼叫的发起频次、响应时长、处理完成率</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">今日呼叫</h3>
                        <i class="fas fa-phone-volume text-purple-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-purple-600">87</p>
                    <p class="text-sm text-gray-500 mt-2">已处理: 84 | 处理中: 3</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">平均响应</h3>
                        <i class="fas fa-stopwatch text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">2.3</p>
                    <p class="text-sm text-gray-500 mt-2">分钟</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">完成率</h3>
                        <i class="fas fa-check-double text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">96.6%</p>
                    <p class="text-sm text-success mt-2">↑ 0.8% 较昨日</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">超时呼叫</h3>
                        <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-orange-600">3</p>
                    <p class="text-sm text-gray-500 mt-2">响应 > 5分钟</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar text-purple-600 mr-2"></i>呼叫应答时效
                    </h3>
                    <div id="chart-calls" style="height: 300px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-list-ol text-blue-600 mr-2"></i>TOP工位呼叫排名
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">1</span>
                                <span class="font-medium text-gray-900">车间B-工位03</span>
                            </div>
                            <span class="text-lg font-bold text-red-600">28次</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">2</span>
                                <span class="font-medium text-gray-900">车间A-工位12</span>
                            </div>
                            <span class="text-lg font-bold text-orange-600">22次</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">3</span>
                                <span class="font-medium text-gray-900">车间C-工位08</span>
                            </div>
                            <span class="text-lg font-bold text-yellow-600">18次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 5. 报警统计模块
function getAlarmStatsContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">报警统计</h2>
                <p class="text-sm text-gray-600">汇总设备故障、物料异常、环境超限等报警类型的发生频次、处理时长</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">总报警数</h3>
                        <i class="fas fa-bell text-red-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-red-600">45</p>
                    <p class="text-sm text-gray-500 mt-2">今日累计</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">设备故障</h3>
                        <i class="fas fa-tools text-orange-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-orange-600">18</p>
                    <p class="text-sm text-gray-500 mt-2">占比 40%</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">物料异常</h3>
                        <i class="fas fa-box text-yellow-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-yellow-600">15</p>
                    <p class="text-sm text-gray-500 mt-2">占比 33%</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">环境超限</h3>
                        <i class="fas fa-temperature-high text-purple-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-purple-600">12</p>
                    <p class="text-sm text-gray-500 mt-2">占比 27%</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">待处理</h3>
                        <i class="fas fa-hourglass-half text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">7</p>
                    <p class="text-sm text-gray-500 mt-2">需立即处理</p>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-pie text-red-600 mr-2"></i>报警分类占比
                    </h3>
                    <div id="chart-alarm-type" style="height: 300px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-area text-orange-600 mr-2"></i>报警高发时段
                    </h3>
                    <div id="chart-alarm-time" style="height: 300px;"></div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">报警记录</h2>
                    <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 text-sm">
                        <i class="fas fa-filter mr-2"></i>筛选
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警源</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警内容</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">处理时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">14:25:30</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">设备故障</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV-005</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电量不足，需充电</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">5min</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已处理</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 6. 任务分配模块
function getTaskAssignmentContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">任务分配</h2>
                <p class="text-sm text-gray-600">基于生产需求、设备状态、库存水位等数据，自动分配仓储下架、物流转运、车间配送任务</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">待分配任务</h3>
                        <i class="fas fa-hourglass-start text-orange-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-orange-600">23</p>
                    <p class="text-sm text-gray-500 mt-2">优先级高: 8</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">可用设备</h3>
                        <i class="fas fa-robot text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">15</p>
                    <p class="text-sm text-gray-500 mt-2">AGV: 10 | 叉车: 5</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">今日已分配</h3>
                        <i class="fas fa-check-circle text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">187</p>
                    <p class="text-sm text-success mt-2">↑ 12% 较昨日</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">平均分配时长</h3>
                        <i class="fas fa-clock text-purple-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-purple-600">1.2</p>
                    <p class="text-sm text-gray-500 mt-2">分钟</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">待分配任务列表</h2>
                    <div class="flex gap-2">
                        <button onclick="autoAssign()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 text-sm">
                            <i class="fas fa-magic mr-2"></i>智能分配
                        </button>
                        <button onclick="manualAssign()" class="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700 text-sm">
                            <i class="fas fa-hand-pointer mr-2"></i>手动分配
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    <input type="checkbox" class="rounded">
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料信息</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">起点→终点</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">优先级</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">推荐设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4"><input type="checkbox" class="rounded"></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TASK-2024-156</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium text-gray-900">电解液-B型</div>
                                    <div class="text-xs text-gray-500">MAT-025 | 200L</div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">仓储A区 → 车间B-工位08</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">高</span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">AGV-003 (距离最近)</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3">
                                        <i class="fas fa-check-circle"></i> 分配
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
// 7. 就近调配模块
function getNearbyDispatchContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">就近调配</h2>
                <p class="text-sm text-gray-600">基于设备实时位置和任务地点，智能匹配最近的可用设备，优化配送效率</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- 地图区域 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-map text-blue-600 mr-2"></i>设备位置分布
                    </h3>
                    <div class="bg-gray-100 rounded-lg flex items-center justify-center" style="height: 400px;">
                        <div class="text-center text-gray-500">
                            <i class="fas fa-map-marked-alt text-6xl mb-4"></i>
                            <p>车间地图视图</p>
                            <p class="text-sm">显示AGV、叉车实时位置</p>
                        </div>
                    </div>
                </div>

                <!-- 调配建议 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-lightbulb text-yellow-600 mr-2"></i>智能调配建议
                    </h3>
                    <div class="space-y-4">
                        <div class="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h4 class="font-semibold text-gray-800">任务 TASK-2024-178</h4>
                                    <p class="text-sm text-gray-600">仓储B区 → 车间A-工位12</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">推荐</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">推荐设备:</span>
                                    <span class="font-medium text-gray-900">AGV-005</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">距离:</span>
                                    <span class="font-medium text-green-600">15m</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">预计耗时:</span>
                                    <span class="font-medium text-gray-900">2.5分钟</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">节省时间:</span>
                                    <span class="font-medium text-green-600">↓ 3.2分钟</span>
                                </div>
                            </div>
                            <button class="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                                <i class="fas fa-check mr-2"></i>采纳建议
                            </button>
                        </div>

                        <div class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h4 class="font-semibold text-gray-800">任务 TASK-2024-179</h4>
                                    <p class="text-sm text-gray-600">仓储A区 → 车间C-工位05</p>
                                </div>
                                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">可选</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">推荐设备:</span>
                                    <span class="font-medium text-gray-900">AGV-008</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">距离:</span>
                                    <span class="font-medium text-blue-600">28m</span>
                                </div>
                            </div>
                            <button class="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                <i class="fas fa-check mr-2"></i>采纳建议
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 设备状态列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">可用设备列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前位置</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">电量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-005</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 text-sm text-gray-700">仓储B区-通道3</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">空闲</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">85%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-location-arrow"></i> 调配
                                    </button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-008</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间A-工位区</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">空闲</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">92%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-location-arrow"></i> 调配
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
// 8. 任务查看/查询模块
function getTaskQueryContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">任务查看/查询</h2>
                <p class="text-sm text-gray-600">查询历史任务、实时任务状态，支持多维度筛选和导出</p>
            </div>

            <!-- 搜索筛选区 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">任务编号</label>
                        <input type="text" placeholder="输入任务编号" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">任务状态</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500">
                            <option value="">全部状态</option>
                            <option value="pending">待执行</option>
                            <option value="executing">执行中</option>
                            <option value="completed">已完成</option>
                            <option value="failed">失败</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500">
                            <option value="today">今天</option>
                            <option value="week">本周</option>
                            <option value="month">本月</option>
                            <option value="custom">自定义</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>

            <!-- 统计概览 -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">总任务数</div>
                    <div class="text-2xl font-bold text-gray-900">1,245</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">待执行</div>
                    <div class="text-2xl font-bold text-orange-600">23</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">执行中</div>
                    <div class="text-2xl font-bold text-blue-600">45</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">已完成</div>
                    <div class="text-2xl font-bold text-green-600">1,172</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">失败</div>
                    <div class="text-2xl font-bold text-red-600">5</div>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">任务列表</h2>
                    <button class="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700 text-sm">
                        <i class="fas fa-download mr-2"></i>导出Excel
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料信息</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">路线</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">执行设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">完成时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody id="tasks-tbody" class="bg-white divide-y divide-gray-200">
                            <!-- 动态生成 -->
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div class="text-sm text-gray-600">显示 1-20 条，共 1,245 条</div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">上一页</button>
                        <button class="px-3 py-1 bg-primary text-white rounded">1</button>
                        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
                        <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">下一页</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
// 9. 异常处理模块
function getExceptionHandlingContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">异常处理</h2>
                <p class="text-sm text-gray-600">实时监控任务异常，快速响应处理，保障物流顺畅</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-600">待处理异常</h3>
                        <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-red-600">8</p>
                    <p class="text-sm text-gray-500 mt-2">需立即处理: 3</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-600">处理中</h3>
                        <i class="fas fa-spinner text-yellow-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-yellow-600">5</p>
                    <p class="text-sm text-gray-500 mt-2">平均处理: 12分钟</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-600">今日已处理</h3>
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">42</p>
                    <p class="text-sm text-success mt-2">↑ 15% 较昨日</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-sm font-medium text-gray-600">平均响应时间</h3>
                        <i class="fas fa-clock text-blue-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600">3.5</p>
                    <p class="text-sm text-gray-500 mt-2">分钟</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">异常列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">异常编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">异常类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">相关任务</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发生时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EXC-2024-089</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">路径阻塞</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">TASK-2024-156</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV-003</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">高</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">待处理</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3">
                                        <i class="fas fa-wrench"></i> 处理
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
// 10. 故障规避模块
function getFaultAvoidanceContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">故障规避</h2>
                <p class="text-sm text-gray-600">预测设备故障风险，提前规避，确保物流系统稳定运行</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">高风险设备</h3>
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-red-600">2</p>
                    <p class="text-sm text-gray-500 mt-2">建议立即维护</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">中风险设备</h3>
                        <i class="fas fa-exclamation-circle text-yellow-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-yellow-600">5</p>
                    <p class="text-sm text-gray-500 mt-2">需关注监控</p>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">健康设备</h3>
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600">18</p>
                    <p class="text-sm text-gray-500 mt-2">运行正常</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">设备健康状态</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">健康评分</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">风险等级</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预测故障</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议措施</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-012</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span class="text-sm font-medium text-red-600">45分</span>
                                        <div class="ml-2 w-24 bg-gray-200 rounded-full h-2">
                                            <div class="bg-red-600 h-2 rounded-full" style="width: 45%"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">高风险</span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">电池老化</td>
                                <td class="px-6 py-4 text-sm text-gray-700">立即更换电池</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-tools"></i> 维护
                                    </button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-007</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span class="text-sm font-medium text-yellow-600">68分</span>
                                        <div class="ml-2 w-24 bg-gray-200 rounded-full h-2">
                                            <div class="bg-yellow-600 h-2 rounded-full" style="width: 68%"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">中风险</span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-700">传感器异常</td>
                                <td class="px-6 py-4 text-sm text-gray-700">检查传感器</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-eye"></i> 查看
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 默认模块内容（占位）
function getDefaultModuleContent(moduleName) {
    const moduleNames = {
        'delivery-rate': '送达率统计',
        'call-response': '呼叫应答统计',
        'alarm-stats': '报警统计',
        'task-assignment': '任务分配',
        'nearby-dispatch': '就近调配',
        'task-query': '任务查看/查询',
        'exception-handling': '异常处理',
        'fault-avoidance': '故障规避',
        'agv-tracking': 'AGV运行追溯',
        'material-tracking': '物料配送追溯',
        'container-tracking': '料箱料车追溯',
        'call-tracking': '物料呼叫追溯',
        'material-monitor': '物料监控',
        'equipment-monitor': '物流设备监控',
        'exception-monitor': '异常监控',
        'bigscreen-display': '大屏展示',
        'delivery-records': '配送记录查询',
        'plan-material': '计划物料查询',
        'route-query': '路线查询',
        'alarm-query': '异常报警查询',
        'issue-area': '发料区管理',
        'storage-area': '存放区管理',
        'waiting-area': '待运位置管理',
        'remaining-area': '剩余区域查看',
        'area-change': '信息变更',
        'staff-ledger': '人员台账',
        'staff-maintenance': '人员维护',
        'staff-query': '人员查询',
        'qualification-mgmt': '资质管理',
        'training-mgmt': '培训管理',
        'delivery-permission': '配送权限',
        'material-order': '物料和工单管理',
        'cart-mgmt': '料车管理',
        'box-mgmt': '料箱管理',
        'workstation-mgmt': '工位管理',
        'workshop-mgmt': '车间管理'
    };
    
    const title = moduleNames[moduleName] || '功能模块';
    
    return `
        <div class="flex items-center justify-center h-96">
            <div class="text-center">
                <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${title}</h2>
                <p class="text-gray-600">该模块功能正在开发中...</p>
                <p class="text-sm text-gray-500 mt-2">敬请期待</p>
            </div>
        </div>
    `;
}

// 11. AGV运行追溯模块
function getAgvTrackingContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">AGV运行追溯</h2>
                <p class="text-sm text-gray-600">实时追踪AGV运行轨迹、任务执行历史，全程可视化管理</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-route text-blue-600 mr-2"></i>运行历史记录
                </h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AGV编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">起点→终点</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">耗时</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-005</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">TASK-2024-156</td>
                                <td class="px-6 py-4 text-sm text-gray-700">仓储A区 → 车间B-工位08</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">5分32秒</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已完成</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 12. 物料配送追溯模块
function getMaterialTrackingContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">物料配送追溯</h2>
                <p class="text-sm text-gray-600">追踪物料从仓储到工位的全流程，实现物料配送透明化管理</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">物料编号</label>
                        <input type="text" placeholder="输入物料编号" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>今天</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">配送追溯记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">批次号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">起点→终点</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">配送时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MAT-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">BATCH-20241101</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">200L</td>
                                <td class="px-6 py-4 text-sm text-gray-700">仓储A区 → 车间B-工位08</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已送达</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 13. 料箱料车追溯模块
function getContainerTrackingContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">料箱料车追溯</h2>
                <p class="text-sm text-gray-600">追踪料箱、料车的使用情况和流转记录</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">料箱/料车编号</label>
                        <input type="text" placeholder="输入编号" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>全部</option>
                            <option>料箱</option>
                            <option>料车</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">流转记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前位置</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">装载物料</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用次数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BOX-001</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">料箱</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B-工位08</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">156次</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">使用中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 14. 物料呼叫追溯模块
function getCallTrackingContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">物料呼叫追溯</h2>
                <p class="text-sm text-gray-600">追踪工位物料呼叫记录，分析呼叫响应效率</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">工位</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>全部工位</option>
                            <option>车间A-工位01</option>
                            <option>车间B-工位08</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>今天</option>
                            <option>本周</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">呼叫记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">呼叫时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工位</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">响应时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">送达时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:20</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">车间B-工位08</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">200L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">1.5分钟</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已完成</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 15. 物料监控模块
function getMaterialMonitorContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">物料监控</h2>
                <p class="text-sm text-gray-600">实时监控物料库存水位、消耗速度，预警物料短缺风险</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">库存充足</h3>
                    <p class="text-3xl font-bold text-green-600">45</p>
                    <p class="text-sm text-gray-500 mt-2">种物料</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">库存预警</h3>
                    <p class="text-3xl font-bold text-yellow-600">8</p>
                    <p class="text-sm text-gray-500 mt-2">需补充</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">库存不足</h3>
                    <p class="text-3xl font-bold text-red-600">3</p>
                    <p class="text-sm text-gray-500 mt-2">紧急补充</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">今日消耗</h3>
                    <p class="text-3xl font-bold text-blue-600">1,245</p>
                    <p class="text-sm text-gray-500 mt-2">单位</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">物料库存监控</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前库存</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">安全库存</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">今日消耗</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预计可用天数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MAT-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,200L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">500L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">200L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">6天</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">充足</span>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 bg-red-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MAT-025</td>
                                <td class="px-6 py-4 text-sm text-gray-700">正极材料-B型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">150kg</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">500kg</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">80kg</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">1.8天</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">不足</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 16. 物流设备监控模块
function getEquipmentMonitorContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">物流设备监控</h2>
                <p class="text-sm text-gray-600">实时监控AGV、叉车等物流设备的运行状态和位置</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">总设备数</div>
                    <div class="text-2xl font-bold text-gray-900">25</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">运行中</div>
                    <div class="text-2xl font-bold text-green-600">18</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">空闲</div>
                    <div class="text-2xl font-bold text-blue-600">5</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">充电中</div>
                    <div class="text-2xl font-bold text-yellow-600">1</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="text-sm text-gray-600 mb-1">故障</div>
                    <div class="text-2xl font-bold text-red-600">1</div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">设备实时状态</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前位置</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前任务</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">电量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">速度</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AGV-005</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B-通道3</td>
                                <td class="px-6 py-4 text-sm text-blue-600">TASK-2024-156</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">85%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1.2 m/s</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">运行中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 17. 异常监控模块
function getExceptionMonitorContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">异常监控</h2>
                <p class="text-sm text-gray-600">实时监控系统异常，快速发现并响应问题</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">严重异常</h3>
                    <p class="text-3xl font-bold text-red-600">2</p>
                    <p class="text-sm text-gray-500 mt-2">需立即处理</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-orange-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">一般异常</h3>
                    <p class="text-3xl font-bold text-orange-600">5</p>
                    <p class="text-sm text-gray-500 mt-2">需关注</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-yellow-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">轻微异常</h3>
                    <p class="text-3xl font-bold text-yellow-600">12</p>
                    <p class="text-sm text-gray-500 mt-2">可延后处理</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">今日已处理</h3>
                    <p class="text-3xl font-bold text-green-600">38</p>
                    <p class="text-sm text-gray-500 mt-2">平均15分钟</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">实时异常列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发生时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">异常类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">相关设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50 bg-red-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 15:30</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">路径阻塞</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV-012</td>
                                <td class="px-6 py-4 text-sm text-gray-700">通道3有障碍物</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">严重</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">处理中</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-eye"></i> 查看
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 18. 大屏展示模块
function getBigscreenDisplayContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">大屏展示</h2>
                <p class="text-sm text-gray-600">调度总控数据大屏，适合会议室和指挥中心展示</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="text-center py-12">
                    <i class="fas fa-tv text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">大屏展示模式</h3>
                    <p class="text-gray-600 mb-6">全屏展示调度总控关键指标和实时数据</p>
                    <button onclick="window.open(window.location.href + '?fullscreen=true', '_blank')" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-cyan-600 text-lg">
                        <i class="fas fa-expand mr-2"></i>进入大屏模式
                    </button>
                </div>
                <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-chart-line text-blue-600 mr-2"></i>实时数据看板
                        </h4>
                        <p class="text-sm text-gray-600">展示配送任务、设备状态、异常情况等关键指标</p>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-map text-green-600 mr-2"></i>电子地图
                        </h4>
                        <p class="text-sm text-gray-600">显示设备实时位置和运行轨迹</p>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-800 mb-2">
                            <i class="fas fa-bell text-red-600 mr-2"></i>异常预警
                        </h4>
                        <p class="text-sm text-gray-600">实时显示系统异常和报警信息</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 19. 配送记录查询模块
function getDeliveryRecordsContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">配送记录查询</h2>
                <p class="text-sm text-gray-600">查询历史配送记录，支持多维度筛选和数据导出</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">任务编号</label>
                        <input type="text" placeholder="任务编号" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">物料</label>
                        <input type="text" placeholder="物料名称" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>今天</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700">
                            <i class="fas fa-download mr-2"></i>导出
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">配送记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">起点→终点</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">执行设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">完成时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">耗时</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TASK-2024-156</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 text-sm text-gray-700">仓储A区 → 车间B-工位08</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV-005</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">14:20</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">5分32秒</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 20. 计划物料查询模块
function getPlanMaterialContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">计划物料查询</h2>
                <p class="text-sm text-gray-600">查询生产计划对应的物料需求和配送计划</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">工单号</label>
                        <input type="text" placeholder="输入工单号" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">物料编号</label>
                        <input type="text" placeholder="输入物料编号" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">计划物料列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工单号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">需求数量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">已配送</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">计划配送时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WO-2024-001</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">MAT-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">500L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">300L</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 16:00</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">配送中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 21. 路线查询模块
function getRouteQueryContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">路线查询</h2>
                <p class="text-sm text-gray-600">查询物流配送路线信息和优化建议</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">起点</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>仓储A区</option>
                            <option>仓储B区</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">终点</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>车间A-工位01</option>
                            <option>车间B-工位08</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询路线
                        </button>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">推荐路线</h3>
                    <div class="space-y-3">
                        <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-semibold text-gray-800">路线A（最短）</span>
                                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">推荐</span>
                            </div>
                            <div class="text-sm text-gray-600">
                                <div>距离: <span class="font-medium text-gray-900">120m</span></div>
                                <div>预计耗时: <span class="font-medium text-gray-900">3.5分钟</span></div>
                                <div>途经: 通道1 → 通道3 → 目标工位</div>
                            </div>
                        </div>
                        <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-semibold text-gray-800">路线B（备选）</span>
                            </div>
                            <div class="text-sm text-gray-600">
                                <div>距离: <span class="font-medium text-gray-900">150m</span></div>
                                <div>预计耗时: <span class="font-medium text-gray-900">4.2分钟</span></div>
                                <div>途经: 通道2 → 通道4 → 目标工位</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">路线地图</h3>
                    <div class="bg-gray-100 rounded-lg flex items-center justify-center" style="height: 300px;">
                        <div class="text-center text-gray-500">
                            <i class="fas fa-map text-6xl mb-4"></i>
                            <p>路线可视化地图</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 22. 异常报警查询模块
function getAlarmQueryContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">异常报警查询</h2>
                <p class="text-sm text-gray-600">查询历史异常报警记录，分析异常趋势</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">报警类型</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>全部类型</option>
                            <option>路径阻塞</option>
                            <option>设备故障</option>
                            <option>通信异常</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">严重程度</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>全部</option>
                            <option>严重</option>
                            <option>一般</option>
                            <option>轻微</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>今天</option>
                            <option>本周</option>
                            <option>本月</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-green-700">
                            <i class="fas fa-download mr-2"></i>导出
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">报警记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报警类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">相关设备</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">处理时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:25</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">路径阻塞</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">AGV-003</td>
                                <td class="px-6 py-4 text-sm text-gray-700">通道3有障碍物</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">严重</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">8分钟</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已处理</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 23. 发料区管理模块
function getIssueAreaContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">发料区管理</h2>
                <p class="text-sm text-gray-600">管理物料发放区域的配置和使用情况</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">总发料区</h3>
                    <p class="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">使用中</h3>
                    <p class="text-3xl font-bold text-green-600">8</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">空闲</h3>
                    <p class="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">利用率</h3>
                    <p class="text-3xl font-bold text-purple-600">67%</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">发料区列表</h2>
                    <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 text-sm">
                        <i class="fas fa-plus mr-2"></i>新增发料区
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前物料</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ISSUE-A01</td>
                                <td class="px-6 py-4 text-sm text-gray-700">发料区A-01</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">500kg</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">使用中</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fas fa-edit"></i></button>
                                    <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 24. 存放区管理模块
function getStorageAreaContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">存放区管理</h2>
                <p class="text-sm text-gray-600">管理物料存放区域的配置和库存情况</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">总存放区</h3>
                    <p class="text-3xl font-bold text-gray-900">20</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">使用中</h3>
                    <p class="text-3xl font-bold text-green-600">16</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">空闲</h3>
                    <p class="text-3xl font-bold text-blue-600">4</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">利用率</h3>
                    <p class="text-3xl font-bold text-purple-600">80%</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">存放区列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前存量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">STORE-A01</td>
                                <td class="px-6 py-4 text-sm text-gray-700">存放区A-01</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1000kg</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">750kg</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">正常</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 25. 待运位置管理模块
function getWaitingAreaContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">待运位置管理</h2>
                <p class="text-sm text-gray-600">管理物料待运区域的配置和使用情况</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">待运位置列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前物料</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">等待时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WAIT-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">待运位-01</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">5分钟</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">待运</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 26. 剩余区域查看模块
function getRemainingAreaContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">剩余区域查看</h2>
                <p class="text-sm text-gray-600">查看未分配和空闲的区域资源</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">未分配区域</h3>
                    <p class="text-4xl font-bold text-blue-600 mb-2">8</p>
                    <p class="text-sm text-gray-600">可用于新增配置</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">空闲区域</h3>
                    <p class="text-4xl font-bold text-green-600 mb-2">12</p>
                    <p class="text-sm text-gray-600">已配置但未使用</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">总可用</h3>
                    <p class="text-4xl font-bold text-purple-600 mb-2">20</p>
                    <p class="text-sm text-gray-600">剩余可用区域总数</p>
                </div>
            </div>
        </div>
    `;
}

// 27. 信息变更模块
function getAreaChangeContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">信息变更</h2>
                <p class="text-sm text-gray-600">管理区域信息的变更记录和审批流程</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">变更记录</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更对象</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变更内容</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-11-01 14:30</td>
                                <td class="px-6 py-4 text-sm text-gray-700">区域配置</td>
                                <td class="px-6 py-4 text-sm text-gray-700">发料区A-01</td>
                                <td class="px-6 py-4 text-sm text-gray-700">容量调整: 500kg → 600kg</td>
                                <td class="px-6 py-4 text-sm text-gray-700">张三</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">已生效</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 28. 人员台账模块
function getStaffLedgerContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">人员台账</h2>
                <p class="text-sm text-gray-600">管理物流相关人员的基本信息和工作记录</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">总人数</h3>
                    <p class="text-3xl font-bold text-gray-900">45</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">在岗</h3>
                    <p class="text-3xl font-bold text-green-600">38</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">休假</h3>
                    <p class="text-3xl font-bold text-yellow-600">5</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">离职</h3>
                    <p class="text-3xl font-bold text-gray-600">2</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">人员列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">岗位</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">入职时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">张三</td>
                                <td class="px-6 py-4 text-sm text-gray-700">物流调度员</td>
                                <td class="px-6 py-4 text-sm text-gray-700">物流部</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2023-01-15</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">在岗</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 29. 人员维护模块
function getStaffMaintenanceContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">人员维护</h2>
                <p class="text-sm text-gray-600">维护和更新人员基本信息</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">人员信息编辑</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">工号</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" value="EMP-001">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" value="张三">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">岗位</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>物流调度员</option>
                            <option>仓库管理员</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">部门</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>物流部</option>
                            <option>仓储部</option>
                        </select>
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">保存</button>
                    <button class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                </div>
            </div>
        </div>
    `;
}

// 30. 人员查询模块
function getStaffQueryContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">人员查询</h2>
                <p class="text-sm text-gray-600">查询人员信息和工作记录</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">工号/姓名</label>
                        <input type="text" placeholder="输入工号或姓名" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">部门</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>全部部门</option>
                            <option>物流部</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600">
                            <i class="fas fa-search mr-2"></i>查询
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">查询结果</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">岗位</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系方式</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">张三</td>
                                <td class="px-6 py-4 text-sm text-gray-700">物流调度员</td>
                                <td class="px-6 py-4 text-sm text-gray-700">物流部</td>
                                <td class="px-6 py-4 text-sm text-gray-700">138****1234</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 31. 资质管理模块
function getQualificationMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">资质管理</h2>
                <p class="text-sm text-gray-600">管理调度人员的技能资质认证与过期提醒</p>
            </div>
            
            <!-- 统计卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">总资质数</p>
                            <p class="text-3xl font-bold text-cyan-600">45</p>
                        </div>
                        <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-certificate text-cyan-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">有效资质</p>
                            <p class="text-3xl font-bold text-green-600">38</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">即将过期</p>
                            <p class="text-3xl font-bold text-orange-600">5</p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">已过期</p>
                            <p class="text-3xl font-bold text-red-600">2</p>
                        </div>
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-times-circle text-red-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 资质列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">
                        <i class="fas fa-list text-cyan-600 mr-2"></i>资质列表
                    </h2>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                            <i class="fas fa-plus mr-2"></i>新增资质
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">人员信息</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">资质类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">证书编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">有效期至</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">张三</div>
                                    <div class="text-xs text-gray-500">工号: EMP-001</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">高价值物料操作</div>
                                    <div class="text-xs text-gray-500">电解液配送资质</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">CERT-2023-001</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2025-01-14</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        <i class="fas fa-check-circle mr-1"></i>有效
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-800" title="续期">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">李四</div>
                                    <div class="text-xs text-gray-500">工号: EMP-002</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">设备运维资质</div>
                                    <div class="text-xs text-gray-500">AGV维护操作</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">CERT-2023-005</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2024-12-20</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                                        <i class="fas fa-exclamation-triangle mr-1"></i>即将过期
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-orange-600 hover:text-orange-800" title="续期">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 32. 培训管理模块
function getTrainingMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">培训管理</h2>
                <p class="text-sm text-gray-600">规划调度业务培训计划，跟踪培训执行与考核结果</p>
            </div>
            
            <!-- 统计卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">培训计划</p>
                            <p class="text-3xl font-bold text-cyan-600">12</p>
                        </div>
                        <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-calendar-alt text-cyan-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">参训人次</p>
                            <p class="text-3xl font-bold text-green-600">156</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-users text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">通过率</p>
                            <p class="text-3xl font-bold text-blue-600">94.2%</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-chart-line text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">培训时长</p>
                            <p class="text-3xl font-bold text-purple-600">328</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-clock text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 培训计划列表 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">
                        <i class="fas fa-graduation-cap text-cyan-600 mr-2"></i>培训计划列表
                    </h2>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                            <i class="fas fa-plus mr-2"></i>新建计划
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">培训编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">培训主题</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">讲师</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">培训时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参训人数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRN-2024-001</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium text-gray-900">AGV调度系统操作培训</div>
                                    <div class="text-xs text-gray-500">智能调度系统基础操作</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">王工程师</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">2024-11-05 14:00</div>
                                    <div class="text-xs text-gray-500">时长: 4小时</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">15人</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        <i class="fas fa-check-circle mr-1"></i>已完成
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-green-600 hover:text-green-800" title="考核结果">
                                        <i class="fas fa-clipboard-check"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TRN-2024-002</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium text-gray-900">安全操作规范培训</div>
                                    <div class="text-xs text-gray-500">高价值物料安全操作</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">李主管</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">2024-11-08 09:00</div>
                                    <div class="text-xs text-gray-500">时长: 3小时</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">20人</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                        <i class="fas fa-clock mr-1"></i>进行中
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="text-orange-600 hover:text-orange-800" title="编辑">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 33. 配送权限模块
function getDeliveryPermissionContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">配送权限</h2>
                <p class="text-sm text-gray-600">管理人员和设备的配送权限配置</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">权限配置</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">对象</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">权限范围</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">张三</td>
                                <td class="px-6 py-4 text-sm text-gray-700">人员</td>
                                <td class="px-6 py-4 text-sm text-gray-700">全部区域</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">启用</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800"><i class="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 34. 物料和工单管理模块
function getMaterialOrderContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">物料和工单管理</h2>
                <p class="text-sm text-gray-600">管理物料信息和生产工单</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">工单列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工单号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">产品</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">物料需求</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WO-2024-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">锂电池-A型</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1000</td>
                                <td class="px-6 py-4 text-sm text-gray-700">电解液、正极材料等</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">进行中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 35. 料车管理模块
function getCartMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">料车管理</h2>
                <p class="text-sm text-gray-600">管理料车的配置、使用和维护</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">总料车数</h3>
                    <p class="text-3xl font-bold text-gray-900">30</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">使用中</h3>
                    <p class="text-3xl font-bold text-green-600">22</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">空闲</h3>
                    <p class="text-3xl font-bold text-blue-600">7</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">维修中</h3>
                    <p class="text-3xl font-bold text-yellow-600">1</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">料车列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">料车编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前位置</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用次数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CART-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">标准料车</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B-工位08</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">256次</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">使用中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 36. 料箱管理模块
function getBoxMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">料箱管理</h2>
                <p class="text-sm text-gray-600">管理料箱的配置、使用和维护</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">总料箱数</h3>
                    <p class="text-3xl font-bold text-gray-900">150</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">使用中</h3>
                    <p class="text-3xl font-bold text-green-600">120</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">空闲</h3>
                    <p class="text-3xl font-bold text-blue-600">28</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-sm font-medium text-gray-600 mb-2">维修中</h3>
                    <p class="text-3xl font-bold text-yellow-600">2</p>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">料箱列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">料箱编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规格</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前位置</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用次数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BOX-001</td>
                                <td class="px-6 py-4 text-sm text-gray-700">标准料箱</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B-工位08</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">156次</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">使用中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 37. 工位管理模块
function getWorkstationMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">工位管理</h2>
                <p class="text-sm text-gray-600">管理生产工位的配置和状态</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800">工位列表</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工位编号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工位名称</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属车间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前任务</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WS-B08</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B-工位08</td>
                                <td class="px-6 py-4 text-sm text-gray-700">车间B</td>
                                <td class="px-6 py-4 text-sm text-gray-700">WO-2024-001</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">生产中</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 38. 车间管理模块
function getWorkshopMgmtContent() {
    return `
        <div>
            <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-2">车间管理</h2>
                <p class="text-sm text-gray-600">管理生产车间的配置和运行状态</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">车间A</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">工位数:</span>
                            <span class="font-medium text-gray-900">15</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">运行中:</span>
                            <span class="font-medium text-green-600">12</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">利用率:</span>
                            <span class="font-medium text-blue-600">80%</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">车间B</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">工位数:</span>
                            <span class="font-medium text-gray-900">20</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">运行中:</span>
                            <span class="font-medium text-green-600">18</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">利用率:</span>
                            <span class="font-medium text-blue-600">90%</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">车间C</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">工位数:</span>
                            <span class="font-medium text-gray-900">10</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">运行中:</span>
                            <span class="font-medium text-green-600">7</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">利用率:</span>
                            <span class="font-medium text-blue-600">70%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
