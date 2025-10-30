// OEE统计分析模块 - JavaScript
let currentView = 'dashboard';
let timeRange = 'week';
let devices = [];
let lossData = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderView();
    updateMetrics();
    initializeCharts();
});

// 初始化样例数据
function initializeData() {
    // 设备OEE数据
    devices = [
        {
            id: 'DEV-001',
            name: '冲床CP-101',
            workshop: '冲压',
            line: 'A线',
            oee: 82.5,
            availability: 90.0,
            performance: 92.5,
            quality: 99.0,
            rank: 1
        },
        {
            id: 'DEV-002',
            name: '装配机ASM-201',
            workshop: '装配',
            line: 'B线',
            oee: 78.3,
            availability: 85.0,
            performance: 91.0,
            quality: 101.2,
            rank: 2
        },
        {
            id: 'DEV-003',
            name: '焊接机WLD-301',
            workshop: '焊接',
            line: 'C线',
            oee: 75.2,
            availability: 85.0,
            performance: 90.5,
            quality: 97.8,
            rank: 3
        },
        {
            id: 'DEV-004',
            name: 'CNC加工中心CNC-501',
            workshop: '加工',
            line: 'A线',
            oee: 72.8,
            availability: 82.0,
            performance: 89.0,
            quality: 99.8,
            rank: 4
        },
        {
            id: 'DEV-005',
            name: '测试台TEST-401',
            workshop: '测试',
            line: 'B线',
            oee: 68.5,
            availability: 78.0,
            performance: 88.0,
            quality: 99.9,
            rank: 5
        }
    ];

    // 六大损失数据
    lossData = [
        {
            id: 'LOSS-001',
            type: '故障损失',
            category: 'availability',
            timeMinutes: 245,
            percentage: 28.5,
            description: '设备故障导致的停机时间',
            topReasons: ['液压系统故障', '电气控制故障', '传感器故障']
        },
        {
            id: 'LOSS-002',
            type: '换型调试损失',
            category: 'availability',
            timeMinutes: 180,
            percentage: 20.9,
            description: '产品切换和调试导致的停机',
            topReasons: ['模具更换', '参数调整', '首件检验']
        },
        {
            id: 'LOSS-003',
            type: '短暂停止损失',
            category: 'performance',
            timeMinutes: 156,
            percentage: 18.1,
            description: '短暂停机和空转',
            topReasons: ['物料等待', '质检等待', '人员离岗']
        },
        {
            id: 'LOSS-004',
            type: '速度降低损失',
            category: 'performance',
            timeMinutes: 125,
            percentage: 14.5,
            description: '实际速度低于标准速度',
            topReasons: ['设备老化', '操作不熟练', '工艺限制']
        },
        {
            id: 'LOSS-005',
            type: '过程废品损失',
            category: 'quality',
            timeMinutes: 98,
            percentage: 11.4,
            description: '生产过程中的不良品',
            topReasons: ['参数偏移', '原料问题', '设备精度']
        },
        {
            id: 'LOSS-006',
            type: '启动废品损失',
            category: 'quality',
            timeMinutes: 56,
            percentage: 6.5,
            description: '开机调试阶段的废品',
            topReasons: ['预热不足', '参数未稳定', '首件不合格']
        }
    ];

    filteredData = getCurrentViewData();
}

function getCurrentViewData() {
    switch(currentView) {
        case 'dashboard': return devices;
        case 'trend': return devices;
        case 'loss': return lossData;
        case 'reports': return [];
        default: return [];
    }
}

function switchView(viewType) {
    currentView = viewType;
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    document.getElementById(`view-${viewType}`).classList.remove('bg-white', 'text-gray-700');
    document.getElementById(`view-${viewType}`).classList.add('bg-primary', 'text-white');
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    document.getElementById(`${viewType}-view`).classList.remove('hidden');
    filteredData = getCurrentViewData();
    renderView();
    
    // 重新初始化图表
    if (viewType === 'trend') {
        initializeTrendCharts();
    } else if (viewType === 'loss') {
        initializeLossCharts();
    }
}

function renderView() {
    switch(currentView) {
        case 'dashboard': renderDashboardView(); break;
        case 'trend': break; // 趋势视图主要是图表
        case 'loss': renderLossView(); break;
        case 'reports': break; // 报表视图是静态的
    }
}

function renderDashboardView() {
    const tbody = document.getElementById('oee-ranking-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(device => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBadgeClass(device.rank)} font-semibold">
                    ${device.rank}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${device.name}</div>
                <div class="text-sm text-gray-500">${device.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${device.workshop}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full ${getOEEColor(device.oee)}" style="width: ${device.oee}%"></div>
                    </div>
                    <span class="text-sm font-semibold ${getOEETextColor(device.oee)}">${device.oee.toFixed(1)}%</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${device.availability.toFixed(1)}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${device.performance.toFixed(1)}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${device.quality.toFixed(1)}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewDeviceDetail('${device.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="analyzeLoss('${device.id}')" class="text-purple-600 hover:text-purple-800" title="损失分析">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderLossView() {
    const container = document.getElementById('loss-details-container');
    if (!container) return;
    
    container.innerHTML = lossData.map(loss => `
        <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
                <h4 class="font-semibold text-gray-800">${loss.type}</h4>
                <span class="badge ${getLossCategoryBadgeClass(loss.category)}">
                    ${getLossCategoryText(loss.category)}
                </span>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-gray-600">损失时间</span>
                    <span class="font-semibold text-gray-900">${loss.timeMinutes}分钟</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">占比</span>
                    <span class="font-semibold text-red-600">${loss.percentage.toFixed(1)}%</span>
                </div>
            </div>
            <p class="text-xs text-gray-600 mb-3">${loss.description}</p>
            <div class="pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500 mb-2">主要原因：</p>
                <div class="flex flex-wrap gap-1">
                    ${loss.topReasons.map(reason => `
                        <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">${reason}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function getRankBadgeClass(rank) {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700';
    if (rank === 2) return 'bg-gray-100 text-gray-700';
    if (rank === 3) return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
}

function getOEEColor(oee) {
    if (oee >= 80) return 'bg-green-500';
    if (oee >= 70) return 'bg-yellow-500';
    if (oee >= 60) return 'bg-orange-500';
    return 'bg-red-500';
}

function getOEETextColor(oee) {
    if (oee >= 80) return 'text-green-600';
    if (oee >= 70) return 'text-yellow-600';
    if (oee >= 60) return 'text-orange-600';
    return 'text-red-600';
}

function getLossCategoryBadgeClass(category) {
    const classMap = {
        'availability': 'bg-red-100 text-red-700',
        'performance': 'bg-yellow-100 text-yellow-700',
        'quality': 'bg-blue-100 text-blue-700'
    };
    return classMap[category] || 'bg-gray-100 text-gray-700';
}

function getLossCategoryText(category) {
    const textMap = {
        'availability': '时间损失',
        'performance': '性能损失',
        'quality': '质量损失'
    };
    return textMap[category] || '其他';
}

function updateMetrics() {
    const avgOEE = devices.reduce((sum, d) => sum + d.oee, 0) / devices.length;
    const avgAvailability = devices.reduce((sum, d) => sum + d.availability, 0) / devices.length;
    const avgPerformance = devices.reduce((sum, d) => sum + d.performance, 0) / devices.length;
    const avgQuality = devices.reduce((sum, d) => sum + d.quality, 0) / devices.length;
    
    document.getElementById('metric-oee').textContent = avgOEE.toFixed(1) + '%';
    document.getElementById('metric-availability').textContent = avgAvailability.toFixed(1) + '%';
    document.getElementById('metric-performance').textContent = avgPerformance.toFixed(1) + '%';
    document.getElementById('metric-quality').textContent = avgQuality.toFixed(1) + '%';
}

function initializeCharts() {
    // OEE趋势图
    const trendChart = echarts.init(document.getElementById('oee-trend-chart'));
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['OEE', '时间稼动率', '性能稼动率', '质量合格率'] },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value', min: 60, max: 100, name: '百分比(%)' },
        series: [
            { name: 'OEE', data: [72, 73, 75, 74, 76, 75, 75], type: 'line', smooth: true, itemStyle: { color: '#6366f1' } },
            { name: '时间稼动率', data: [83, 84, 85, 84, 86, 85, 85], type: 'line', smooth: true, itemStyle: { color: '#10b981' } },
            { name: '性能稼动率', data: [88, 89, 90, 90, 91, 90, 90], type: 'line', smooth: true, itemStyle: { color: '#3b82f6' } },
            { name: '质量合格率', data: [97, 97, 98, 98, 98, 98, 98], type: 'line', smooth: true, itemStyle: { color: '#8b5cf6' } }
        ]
    });

    // OEE构成雷达图
    const compositionChart = echarts.init(document.getElementById('oee-composition-chart'));
    compositionChart.setOption({
        tooltip: {},
        radar: {
            indicator: [
                { name: '时间稼动率', max: 100 },
                { name: '性能稼动率', max: 100 },
                { name: '质量合格率', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: [
                {
                    value: [85, 90.5, 97.8],
                    name: '当前OEE构成',
                    itemStyle: { color: '#6366f1' }
                },
                {
                    value: [90, 95, 99],
                    name: '目标OEE构成',
                    itemStyle: { color: '#10b981' }
                }
            ]
        }]
    });
}

function initializeTrendCharts() {
    // OEE历史趋势
    const historyChart = echarts.init(document.getElementById('oee-history-chart'));
    historyChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['OEE'] },
        xAxis: { type: 'category', data: Array.from({length: 30}, (_, i) => `${i+1}日`) },
        yAxis: { type: 'value', min: 60, max: 100, name: 'OEE(%)' },
        series: [{
            name: 'OEE',
            data: Array.from({length: 30}, () => 70 + Math.random() * 15),
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(99, 102, 241, 0.2)' },
            itemStyle: { color: '#6366f1' }
        }]
    });

    // 三要素趋势
    const availabilityChart = echarts.init(document.getElementById('availability-trend-chart'));
    availabilityChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value', min: 70, max: 100 },
        series: [{
            data: [83, 84, 85, 84, 86, 85, 85],
            type: 'line',
            smooth: true,
            itemStyle: { color: '#10b981' }
        }]
    });

    const performanceChart = echarts.init(document.getElementById('performance-trend-chart'));
    performanceChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value', min: 80, max: 100 },
        series: [{
            data: [88, 89, 90, 90, 91, 90, 90],
            type: 'line',
            smooth: true,
            itemStyle: { color: '#3b82f6' }
        }]
    });

    const qualityChart = echarts.init(document.getElementById('quality-trend-chart'));
    qualityChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value', min: 95, max: 100 },
        series: [{
            data: [97, 97, 98, 98, 98, 98, 98],
            type: 'line',
            smooth: true,
            itemStyle: { color: '#8b5cf6' }
        }]
    });
}

function initializeLossCharts() {
    // 损失柏拉图
    const paretoChart = echarts.init(document.getElementById('loss-pareto-chart'));
    const sortedLoss = [...lossData].sort((a, b) => b.percentage - a.percentage);
    let cumulative = 0;
    const cumulativeData = sortedLoss.map(loss => {
        cumulative += loss.percentage;
        return cumulative;
    });
    
    paretoChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['损失时间', '累计占比'] },
        xAxis: [
            { type: 'category', data: sortedLoss.map(l => l.type) }
        ],
        yAxis: [
            { type: 'value', name: '时间(分钟)' },
            { type: 'value', name: '累计占比(%)', min: 0, max: 100 }
        ],
        series: [
            {
                name: '损失时间',
                type: 'bar',
                data: sortedLoss.map(l => l.timeMinutes),
                itemStyle: { color: '#6366f1' }
            },
            {
                name: '累计占比',
                type: 'line',
                yAxisIndex: 1,
                data: cumulativeData,
                itemStyle: { color: '#ef4444' }
            }
        ]
    });

    // 损失饼图
    const pieChart = echarts.init(document.getElementById('loss-pie-chart'));
    pieChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            type: 'pie',
            radius: '50%',
            data: lossData.map(loss => ({
                value: loss.timeMinutes,
                name: loss.type
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    });
}

function applyFilters() {
    const workshopFilter = document.getElementById('filter-workshop').value;
    const lineFilter = document.getElementById('filter-line').value;
    const shiftFilter = document.getElementById('filter-shift').value;
    
    let data = getCurrentViewData();
    
    if (workshopFilter) {
        data = data.filter(item => item.workshop === workshopFilter);
    }
    
    if (lineFilter) {
        data = data.filter(item => item.line === lineFilter);
    }
    
    filteredData = data;
    renderView();
}

function resetFilters() {
    document.getElementById('filter-workshop').value = '';
    document.getElementById('filter-line').value = '';
    document.getElementById('filter-shift').value = '';
    filteredData = getCurrentViewData();
    renderView();
}

function changeTimeRange() {
    timeRange = document.getElementById('time-range-select').value;
    alert(`切换时间范围：${timeRange}`);
    // 重新加载数据和图表
}

function viewDeviceDetail(id) {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    alert(`设备详情：\n名称：${device.name}\nOEE：${device.oee}%\n时间稼动率：${device.availability}%\n性能稼动率：${device.performance}%\n质量合格率：${device.quality}%`);
}

function analyzeLoss(id) {
    alert(`分析设备 ${id} 的损失构成`);
}

function generateReport(type) {
    alert(`生成${type}报表`);
}

function openCustomReportBuilder() {
    alert('打开自定义报表设计器');
}

function refreshData() {
    alert('刷新数据...');
    location.reload();
}

function exportReport() {
    alert('导出OEE分析报告');
}
