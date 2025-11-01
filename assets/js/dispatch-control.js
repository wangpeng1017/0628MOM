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
function showModule(moduleName) {
    console.log('showModule 被调用，模块名:', moduleName);
    currentModule = moduleName;
    
    // 更新菜单激活状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('bg-cyan-50', 'text-cyan-600');
        item.classList.add('text-gray-700');
    });
    
    event?.target?.closest('.menu-item')?.classList.add('bg-cyan-50', 'text-cyan-600');
    event?.target?.closest('.menu-item')?.classList.remove('text-gray-700');
    
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
    const tasksChart = echarts.init(document.getElementById('chart-tasks'));
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

    // 设备利用率排名
    const utilizationChart = echarts.init(document.getElementById('chart-utilization'));
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

    // 送达率分析
    const deliveryChart = echarts.init(document.getElementById('chart-delivery'));
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

    // 呼叫应答时效
    const callsChart = echarts.init(document.getElementById('chart-calls'));
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
                    <div id="chart-runtime" style="height: 350px;"></div>
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
                    <div id="chart-alarm-types" style="height: 300px;"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-area text-orange-600 mr-2"></i>报警高发时段
                    </h3>
                    <div id="chart-alarm-timeline" style="height: 300px;"></div>
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
function getNearbyDispatchContent() { return getDefaultModuleContent('nearby-dispatch'); }
function getTaskQueryContent() { return getDefaultModuleContent('task-query'); }
function getExceptionHandlingContent() { return getDefaultModuleContent('exception-handling'); }
function getFaultAvoidanceContent() { return getDefaultModuleContent('fault-avoidance'); }

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
