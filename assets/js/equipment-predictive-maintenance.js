// 预测性维护模块 - JavaScript
let currentView = 'dashboard';
let devices = [];
let alerts = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取视图类型
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['dashboard', 'alerts', 'diagnosis', 'models'].includes(viewParam)) {
        currentView = viewParam;
    }
    
    initializeData();
    
    // 初始化视图显示状态
    initializeViewDisplay();
    
    renderView();
    updateStatistics();
    initializeCharts();
});

// 初始化视图显示状态
function initializeViewDisplay() {
    // 更新按钮样式
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`view-${currentView}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-gray-700');
        activeBtn.classList.add('bg-primary', 'text-white');
    }
    
    // 隐藏所有视图
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    
    // 显示当前视图
    const currentViewElement = document.getElementById(`${currentView}-view`);
    if (currentViewElement) {
        currentViewElement.classList.remove('hidden');
    }
}

// 初始化样例数据
function initializeData() {
    // 设备健康监测数据
    devices = [
        {
            id: 'DEV-001',
            code: 'CP-101',
            name: '冲床CP-101',
            healthIndex: 92,
            alertType: null,
            rul: null,
            rulDays: null,
            lastUpdate: '2024-10-30 14:30:00',
            status: 'healthy',
            location: '冲压车间A区',
            vibration: 2.3,
            temperature: 45.2,
            pressure: 6.5,
            current: 12.3
        },
        {
            id: 'DEV-002',
            code: 'ASM-201',
            name: '装配机ASM-201',
            healthIndex: 88,
            alertType: null,
            rul: null,
            rulDays: null,
            lastUpdate: '2024-10-30 14:28:00',
            status: 'healthy',
            location: '装配车间B区',
            vibration: 1.8,
            temperature: 42.5,
            pressure: 5.8,
            current: 10.5
        },
        {
            id: 'DEV-003',
            code: 'WLD-301',
            name: '焊接机WLD-301',
            healthIndex: 68,
            alertType: 'vibration',
            rul: '轴承剩余寿命约15天',
            rulDays: 15,
            lastUpdate: '2024-10-30 14:32:00',
            status: 'warning',
            location: '焊接车间C区',
            vibration: 4.8,
            temperature: 52.1,
            pressure: 6.2,
            current: 15.2
        },
        {
            id: 'DEV-004',
            code: 'TEST-401',
            name: '测试台TEST-401',
            healthIndex: 45,
            alertType: 'temperature',
            rul: '冷却系统剩余寿命约5天',
            rulDays: 5,
            lastUpdate: '2024-10-30 14:35:00',
            status: 'critical',
            location: '测试中心D区',
            vibration: 3.2,
            temperature: 78.5,
            pressure: 5.5,
            current: 18.7
        },
        {
            id: 'DEV-005',
            code: 'CNC-501',
            name: 'CNC加工中心CNC-501',
            healthIndex: 75,
            alertType: 'current',
            rul: '主轴电机剩余寿命约20天',
            rulDays: 20,
            lastUpdate: '2024-10-30 14:25:00',
            status: 'warning',
            location: '加工车间E区',
            vibration: 2.9,
            temperature: 48.3,
            pressure: 6.0,
            current: 22.5
        }
    ];

    // 预警数据
    alerts = devices.filter(d => d.status === 'warning' || d.status === 'critical').map(d => ({
        id: d.id,
        deviceCode: d.code,
        deviceName: d.name,
        healthIndex: d.healthIndex,
        alertType: d.alertType,
        alertLevel: d.status === 'critical' ? 'critical' : 'warning',
        alertLevelText: d.status === 'critical' ? '严重' : '注意',
        rul: d.rul,
        rulDays: d.rulDays,
        diagnosis: getDiagnosisText(d.alertType),
        suggestion: getSuggestionText(d.alertType),
        createTime: d.lastUpdate
    }));

    filteredData = getCurrentViewData();
}

function getDiagnosisText(alertType) {
    const diagnosisMap = {
        'vibration': '振动频谱分析显示，特征频率能量持续上升，匹配轴承内圈点蚀故障模式',
        'temperature': '温度持续超过正常范围，冷却系统效率下降，可能存在散热器堵塞或冷却液不足',
        'pressure': '压力波动异常，液压系统可能存在泄漏或油泵性能下降',
        'current': '电流波动增大，电机负载异常，可能存在机械卡滞或轴承磨损'
    };
    return diagnosisMap[alertType] || '系统检测到异常，建议人工复核';
}

function getSuggestionText(alertType) {
    const suggestionMap = {
        'vibration': '建议在15天内安排停机维护，更换轴承，避免非计划停机',
        'temperature': '建议立即检查冷却系统，清洁散热器，检查冷却液液位',
        'pressure': '建议检查液压系统密封件，检查油泵性能，必要时更换',
        'current': '建议检查机械传动部件，检查轴承状态，进行润滑保养'
    };
    return suggestionMap[alertType] || '建议安排专业工程师进行现场诊断';
}

function getCurrentViewData() {
    switch(currentView) {
        case 'dashboard': return devices;
        case 'alerts': return alerts;
        case 'diagnosis': return devices;
        case 'models': return [];
        default: return [];
    }
}

function switchView(viewType) {
    currentView = viewType;
    
    // 更新按钮样式
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`view-${viewType}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-gray-700');
        activeBtn.classList.add('bg-primary', 'text-white');
    }
    
    // 切换视图内容
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    const targetView = document.getElementById(`${viewType}-view`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
    
    filteredData = getCurrentViewData();
    renderView();
}

function renderView() {
    switch(currentView) {
        case 'dashboard': renderDashboardView(); break;
        case 'alerts': renderAlertsView(); break;
        case 'diagnosis': renderDiagnosisView(); break;
        case 'models': break; // 模型视图是静态的
    }
}

function renderDashboardView() {
    const tbody = document.getElementById('dashboard-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(device => `
        <tr class="hover:bg-gray-50 ${device.status === 'critical' ? 'bg-red-50' : device.status === 'warning' ? 'bg-yellow-50' : ''}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${device.code}</div>
                <div class="text-sm text-gray-500">${device.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${device.name}</div>
                <div class="text-xs text-gray-500">${device.location}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full ${getHealthColor(device.healthIndex)}" style="width: ${device.healthIndex}%"></div>
                    </div>
                    <span class="text-sm font-semibold ${getHealthTextColor(device.healthIndex)}">${device.healthIndex}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${device.alertType ? `<span class="badge ${getAlertTypeBadgeClass(device.alertType)}">${getAlertTypeText(device.alertType)}</span>` : '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${device.rulDays && device.rulDays < 10 ? 'text-red-600 font-semibold' : 'text-gray-900'}">
                ${device.rul || '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${device.lastUpdate.split(' ')[0]}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(device.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewDeviceDetail('${device.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="createMaintenanceOrder('${device.id}')" class="text-green-600 hover:text-green-800" title="创建工单">
                    <i class="fas fa-wrench"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAlertsView() {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    container.innerHTML = filteredData.map(alert => `
        <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 ${alert.alertLevel === 'critical' ? 'border-red-500' : 'border-yellow-500'}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">${alert.deviceName}</h4>
                    <p class="text-sm text-gray-600">${alert.deviceCode}</p>
                </div>
                <span class="badge ${alert.alertLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                    <i class="fas fa-exclamation-triangle"></i> ${alert.alertLevelText}
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">健康指数</p>
                    <p class="text-2xl font-bold ${getHealthTextColor(alert.healthIndex)}">${alert.healthIndex}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">预警类型</p>
                    <p class="text-sm font-semibold mt-1">${getAlertTypeText(alert.alertType)}</p>
                </div>
            </div>

            <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-600 font-semibold mb-1">AI诊断</p>
                <p class="text-sm text-gray-700">${alert.diagnosis}</p>
            </div>

            <div class="mb-4 p-3 bg-green-50 rounded-lg">
                <p class="text-xs text-green-600 font-semibold mb-1">建议措施</p>
                <p class="text-sm text-gray-700">${alert.suggestion}</p>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-600">剩余寿命：<span class="font-semibold ${alert.rulDays < 10 ? 'text-red-600' : 'text-blue-600'}">${alert.rul}</span></span>
                <button onclick="createMaintenanceOrder('${alert.id}')" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    <i class="fas fa-wrench mr-1"></i>创建维修工单
                </button>
            </div>
        </div>
    `).join('');
}

function renderDiagnosisView() {
    const select = document.getElementById('diagnosis-device-select');
    if (select) {
        select.innerHTML = '<option value="">请选择设备</option>' + 
            devices.map(d => `<option value="${d.id}">${d.name} (${d.code})</option>`).join('');
    }
}

function getHealthColor(index) {
    if (index >= 80) return 'bg-green-500';
    if (index >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
}

function getHealthTextColor(index) {
    if (index >= 80) return 'text-green-600';
    if (index >= 60) return 'text-yellow-600';
    return 'text-red-600';
}

function getAlertTypeBadgeClass(type) {
    const classMap = {
        'vibration': 'bg-purple-100 text-purple-700',
        'temperature': 'bg-red-100 text-red-700',
        'pressure': 'bg-orange-100 text-orange-700',
        'current': 'bg-blue-100 text-blue-700'
    };
    return classMap[type] || 'bg-gray-100 text-gray-700';
}

function getAlertTypeText(type) {
    const textMap = {
        'vibration': '振动异常',
        'temperature': '温度异常',
        'pressure': '压力异常',
        'current': '电流异常'
    };
    return textMap[type] || '未知';
}

function getStatusBadge(status) {
    const statusConfig = {
        'healthy': { class: 'bg-green-100 text-green-700', icon: 'check-circle', text: '健康' },
        'warning': { class: 'bg-yellow-100 text-yellow-700', icon: 'exclamation-triangle', text: '注意' },
        'critical': { class: 'bg-red-100 text-red-700', icon: 'times-circle', text: '异常' }
    };
    const config = statusConfig[status] || statusConfig['healthy'];
    return `<span class="status-chip ${config.class}"><i class="fas fa-${config.icon}"></i> ${config.text}</span>`;
}

function updateStatistics() {
    const totalDevices = devices.length;
    const healthyCount = devices.filter(d => d.status === 'healthy').length;
    const warningCount = devices.filter(d => d.status === 'warning').length;
    const criticalCount = devices.filter(d => d.status === 'critical').length;
    
    document.getElementById('metric-total-devices').textContent = totalDevices;
    document.getElementById('metric-healthy').textContent = healthyCount;
    document.getElementById('metric-warning').textContent = warningCount;
    document.getElementById('metric-critical').textContent = criticalCount;
}

function initializeCharts() {
    // 设备健康分布饼图
    const healthChart = echarts.init(document.getElementById('health-distribution-chart'));
    healthChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            type: 'pie',
            radius: '50%',
            data: [
                { value: 78, name: '健康', itemStyle: { color: '#10b981' } },
                { value: 5, name: '注意', itemStyle: { color: '#f59e0b' } },
                { value: 2, name: '异常', itemStyle: { color: '#ef4444' } }
            ]
        }]
    });

    // 预警趋势折线图
    const trendChart = echarts.init(document.getElementById('alert-trend-chart'));
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['10-24', '10-25', '10-26', '10-27', '10-28', '10-29', '10-30'] },
        yAxis: { type: 'value' },
        series: [{
            data: [3, 4, 5, 6, 5, 7, 7],
            type: 'line',
            smooth: true,
            itemStyle: { color: '#f59e0b' }
        }]
    });

    // 故障类型分布柱状图
    const faultChart = echarts.init(document.getElementById('fault-type-chart'));
    faultChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['振动', '温度', '压力', '电流'] },
        yAxis: { type: 'value' },
        series: [{
            data: [3, 2, 1, 1],
            type: 'bar',
            itemStyle: { color: '#3b82f6' }
        }]
    });
}

function loadDiagnosisData() {
    const deviceId = document.getElementById('diagnosis-device-select').value;
    if (!deviceId) {
        document.getElementById('diagnosis-content').classList.add('hidden');
        return;
    }

    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    document.getElementById('diagnosis-content').classList.remove('hidden');

    // 振动频谱图
    const vibrationChart = echarts.init(document.getElementById('vibration-spectrum-chart'));
    vibrationChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: Array.from({length: 50}, (_, i) => i * 10) },
        yAxis: { type: 'value', name: '幅值' },
        series: [{
            data: Array.from({length: 50}, () => Math.random() * 100),
            type: 'line',
            smooth: true,
            itemStyle: { color: '#8b5cf6' }
        }]
    });

    // 温度趋势图
    const tempChart = echarts.init(document.getElementById('temperature-trend-chart'));
    tempChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: Array.from({length: 24}, (_, i) => `${i}:00`) },
        yAxis: { type: 'value', name: '温度(°C)' },
        series: [{
            data: Array.from({length: 24}, () => 40 + Math.random() * 20),
            type: 'line',
            smooth: true,
            itemStyle: { color: '#ef4444' }
        }]
    });

    // 诊断结果
    const resultDiv = document.getElementById('diagnosis-result');
    resultDiv.innerHTML = `
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-2">设备基本信息</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div><span class="text-gray-600">设备编码：</span><span class="font-semibold">${device.code}</span></div>
                <div><span class="text-gray-600">设备名称：</span><span class="font-semibold">${device.name}</span></div>
                <div><span class="text-gray-600">健康指数：</span><span class="font-semibold ${getHealthTextColor(device.healthIndex)}">${device.healthIndex}</span></div>
                <div><span class="text-gray-600">位置：</span><span class="font-semibold">${device.location}</span></div>
            </div>
        </div>
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 class="font-semibold text-yellow-800 mb-2">实时监测数据</h4>
            <div class="grid grid-cols-4 gap-3 text-sm">
                <div><span class="text-gray-600">振动：</span><span class="font-semibold">${device.vibration} mm/s</span></div>
                <div><span class="text-gray-600">温度：</span><span class="font-semibold">${device.temperature} °C</span></div>
                <div><span class="text-gray-600">压力：</span><span class="font-semibold">${device.pressure} MPa</span></div>
                <div><span class="text-gray-600">电流：</span><span class="font-semibold">${device.current} A</span></div>
            </div>
        </div>
        ${device.alertType ? `
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 class="font-semibold text-red-800 mb-2">AI诊断结果</h4>
            <p class="text-sm text-gray-700 mb-2">${getDiagnosisText(device.alertType)}</p>
            <p class="text-sm text-gray-700"><strong>建议：</strong>${getSuggestionText(device.alertType)}</p>
        </div>
        ` : '<div class="p-4 bg-green-50 border border-green-200 rounded-lg"><p class="text-sm text-green-700">设备运行正常，未发现异常</p></div>'}
    `;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const alertTypeFilter = document.getElementById('filter-alert-type').value;
    
    let data = getCurrentViewData();
    
    if (searchTerm) {
        data = data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    }
    
    if (statusFilter) {
        data = data.filter(item => item.status === statusFilter);
    }
    
    if (alertTypeFilter) {
        data = data.filter(item => item.alertType === alertTypeFilter);
    }
    
    filteredData = data;
    renderView();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-alert-type').value = '';
    filteredData = getCurrentViewData();
    renderView();
}

function viewDeviceDetail(id) {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    const content = document.getElementById('device-detail-content');
    content.innerHTML = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-600">设备编码</p>
                    <p class="font-semibold">${device.code}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">设备名称</p>
                    <p class="font-semibold">${device.name}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">健康指数</p>
                    <p class="font-semibold ${getHealthTextColor(device.healthIndex)}">${device.healthIndex}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">状态</p>
                    <p>${getStatusBadge(device.status)}</p>
                </div>
            </div>
            ${device.rul ? `
            <div class="p-4 bg-yellow-50 rounded-lg">
                <p class="text-sm font-semibold text-yellow-800">剩余寿命预测</p>
                <p class="text-sm text-gray-700 mt-1">${device.rul}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('device-detail-modal').classList.add('show');
}

function createMaintenanceOrder(id) {
    // 获取设备信息
    const device = devices.find(d => d.id === id);
    if (!device) {
        alert('无法获取设备信息');
        return;
    }

    // 如果设备没有预警，提示用户
    if (!device.alertType) {
        alert('该设备运行正常，暂无需创建维修工单');
        return;
    }

    // AI分析结果
    const aiAnalysis = {
        'vibration': {
            faultPart: '轴承组件',
            faultReason: '轴承内圈点蚀，振动频谱特征频率能量持续上升',
            suggestedAction: '建议在' + device.rulDays + '天内安排停机维护，更换轴承',
            priority: device.rulDays < 10 ? '紧急' : '高',
            estimatedTime: '4小时',
            requiredParts: ['深沟球轴承 6205-2RS', '润滑脂', '密封圈'],
            assignTo: '机械维修班-李师傅'
        },
        'temperature': {
            faultPart: '冷却系统',
            faultReason: '冷却系统效率下降，散热器堵塞或冷却液不足',
            suggestedAction: '立即检查冷却系统，清洁散热器，检查冷却液液位',
            priority: '紧急',
            estimatedTime: '2小时',
            requiredParts: ['冷却液', '散热器清洗剂', '密封垫'],
            assignTo: '设备维修班-王工'
        },
        'pressure': {
            faultPart: '液压系统密封组件',
            faultReason: '液压系统密封件老化，存在泄漏风险',
            suggestedAction: '检查液压系统密封件，检查油泵性能，必要时更换',
            priority: '高',
            estimatedTime: '3小时',
            requiredParts: ['O型圈 NBR-90', '液压油 HM46', '密封件套装'],
            assignTo: '液压维修班-张师傅'
        },
        'current': {
            faultPart: '主轴电机',
            faultReason: '电机负载异常，可能存在机械卡滞或轴承磨损',
            suggestedAction: '检查机械传动部件，检查轴承状态，进行润滑保养',
            priority: device.rulDays < 15 ? '高' : '中',
            estimatedTime: '3小时',
            requiredParts: ['电机轴承', '润滑油', '碳刷'],
            assignTo: '电气维修班-陈工'
        }
    };

    const analysis = aiAnalysis[device.alertType];
    if (!analysis) {
        alert('AI分析数据不可用');
        return;
    }

    // 生成工单编号
    const workOrderNo = 'WO-' + new Date().getFullYear() + 
                        ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                        ('0' + new Date().getDate()).slice(-2) + 
                        '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // 构建工单信息
    const orderInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 智能预见性维修工单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 工单编号: ${workOrderNo}
🏭 设备名称: ${device.name}
📟 设备编码: ${device.code}
📍 设备位置: ${device.location}
🎯 优先级: ${analysis.priority}
📊 健康指数: ${device.healthIndex}

━━━ AI 故障分析 ━━━
🔍 故障部位: ${analysis.faultPart}
📊 故障原因: ${analysis.faultReason}
⏰ 剩余寿命: ${device.rul}
⚠️  预警类型: ${getAlertTypeText(device.alertType)}

━━━ 维修建议 ━━━
💡 建议措施: ${analysis.suggestedAction}
⏱️  预计工时: ${analysis.estimatedTime}
🔧 所需备件: ${analysis.requiredParts.join('、')}

━━━ 工单派发 ━━━
👷 派发给: ${analysis.assignTo}
📅 创建时间: ${new Date().toLocaleString('zh-CN')}
📱 通知方式: 短信、APP推送

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 工单将自动派发给维修工程师
📊 可在【设备管理-维修管理】中查看详情
    `;

    // 显示工单信息
    if (confirm(orderInfo + '\n\n是否确认创建此维修工单？')) {
        // 模拟创建工单
        alert('✅ 维修工单创建成功！\n\n工单编号: ' + workOrderNo + '\n已自动派发给: ' + analysis.assignTo + '\n\n系统已发送通知给相关维修人员');
        
        // 可选：跳转到维修工单页面
        // window.location.href = 'maintenance-management.html?order=' + workOrderNo;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function refreshData() {
    alert('刷新数据...');
    location.reload();
}

function exportReport() {
    alert('导出预测性维护报告');
}
