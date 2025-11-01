// 调度总控平台 - JavaScript
let currentTab = 'analytics';
let tasksData = [];
let chartsInstances = {};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('调度总控平台已加载');
    initializeData();
    renderTasksTable();
    initializeCharts();
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

// Tab切换（适配左侧导航）
function switchTab(tabName) {
    currentTab = tabName;
    
    // 隐藏所有Tab内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // 移除所有导航项的active状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'text-cyan-600', 'font-semibold');
        item.classList.add('text-gray-700');
    });
    
    // 显示选中的Tab内容
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // 激活选中的导航项
    const activeNav = document.getElementById(`nav-${tabName}`);
    activeNav.classList.add('active', 'text-cyan-600', 'font-semibold');
    activeNav.classList.remove('text-gray-700');
    
    // 如果切换到数据分析Tab，刷新图表
    if (tabName === 'analytics') {
        setTimeout(() => {
            Object.values(chartsInstances).forEach(chart => {
                chart.resize();
            });
        }, 100);
    }
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
