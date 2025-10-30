// 点巡检管理模块 - JavaScript
let currentView = 'routes';
let inspectionRoutes = [];
let inspectionPlans = [];
let inspectionTasks = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderView();
    updateStatistics();
});

// 初始化样例数据
function initializeData() {
    // 巡检路线数据
    inspectionRoutes = [
        {
            id: 'ROUTE-001',
            name: '一号冲压车间巡检路线',
            description: '覆盖冲压车间所有关键设备',
            equipmentPoints: [
                { equipmentId: 'CP-101', equipmentName: '冲床CP-101', checkItems: ['油位检查', '异响检查', '温度测量', '安全装置检查', '漏油检查'] },
                { equipmentId: 'CP-102', equipmentName: '冲床CP-102', checkItems: ['油位检查', '异响检查', '温度测量'] },
                { equipmentId: 'CP-103', equipmentName: '冲床CP-103', checkItems: ['油位检查', '异响检查', '温度测量'] },
                { equipmentId: 'CP-104', equipmentName: '冲床CP-104', checkItems: ['油位检查', '异响检查', '温度测量'] },
                { equipmentId: 'CP-105', equipmentName: '冲床CP-105', checkItems: ['油位检查', '异响检查', '温度测量', '漏油检查'] }
            ],
            estimatedTime: 45,
            createTime: '2024-06-20 09:00:00',
            status: 'active'
        },
        {
            id: 'ROUTE-002',
            name: '二号装配车间白班巡检',
            description: '装配车间白班设备巡检',
            equipmentPoints: [
                { equipmentId: 'ASM-201', equipmentName: '装配机ASM-201', checkItems: ['气压检查', '运行速度', '精度检查', '润滑状态'] },
                { equipmentId: 'ASM-202', equipmentName: '装配机ASM-202', checkItems: ['气压检查', '运行速度', '精度检查'] },
                { equipmentId: 'CONV-201', equipmentName: '传送带CONV-201', checkItems: ['运行状态', '张紧度', '异响'] },
                { equipmentId: 'TEST-201', equipmentName: '检测台TEST-201', checkItems: ['校准状态', '测量精度', '环境温湿度'] }
            ],
            estimatedTime: 30,
            createTime: '2024-06-21 10:00:00',
            status: 'active'
        },
        {
            id: 'ROUTE-003',
            name: '质检中心设备巡检',
            description: '质检中心精密检测设备巡检',
            equipmentPoints: [
                { equipmentId: 'QC-301', equipmentName: '检测设备QC-301', checkItems: ['校准状态', '测量精度', '环境温度', '环境湿度'] },
                { equipmentId: 'QC-302', equipmentName: '检测设备QC-302', checkItems: ['校准状态', '测量精度'] },
                { equipmentId: 'CAL-301', equipmentName: '校准台CAL-301', checkItems: ['设备状态', '标准件检查'] }
            ],
            estimatedTime: 25,
            createTime: '2024-06-22 11:00:00',
            status: 'active'
        }
    ];

    // 巡检计划数据
    inspectionPlans = [
        {
            id: 'PLAN-001',
            name: '冲压车间日常巡检计划',
            routeId: 'ROUTE-001',
            routeName: '一号冲压车间巡检路线',
            frequency: 'daily',
            frequencyText: '每日2次',
            assignees: ['李师傅'],
            active: true,
            createTime: '2024-06-20 09:00:00'
        },
        {
            id: 'PLAN-002',
            name: '装配车间白班巡检计划',
            routeId: 'ROUTE-002',
            routeName: '二号装配车间白班巡检',
            frequency: 'shift',
            frequencyText: '每班次1次',
            assignees: ['王师傅'],
            active: true,
            createTime: '2024-06-21 10:00:00'
        },
        {
            id: 'PLAN-003',
            name: '质检中心周检计划',
            routeId: 'ROUTE-003',
            routeName: '质检中心设备巡检',
            frequency: 'weekly',
            frequencyText: '每周1次',
            assignees: ['陈师傅'],
            active: true,
            createTime: '2024-06-22 11:00:00'
        }
    ];

    // 巡检任务数据
    inspectionTasks = [
        {
            id: 'TASK-001',
            code: 'INS-2024-001',
            routeId: 'ROUTE-001',
            routeName: '一号冲压车间巡检路线',
            planId: 'PLAN-001',
            scheduledDate: '2024-06-28',
            scheduledTime: '08:00',
            assignee: '李师傅',
            status: 'completed',
            startTime: '2024-06-28 08:05:00',
            endTime: '2024-06-28 08:50:00',
            totalPoints: 5,
            completedPoints: 5,
            abnormalCount: 0,
            createTime: '2024-06-28 08:00:00'
        },
        {
            id: 'TASK-002',
            code: 'INS-2024-002',
            routeId: 'ROUTE-002',
            routeName: '二号装配车间白班巡检',
            planId: 'PLAN-002',
            scheduledDate: '2024-06-28',
            scheduledTime: '10:00',
            assignee: '王师傅',
            status: 'in_progress',
            startTime: '2024-06-28 10:05:00',
            endTime: null,
            totalPoints: 4,
            completedPoints: 2,
            abnormalCount: 0,
            createTime: '2024-06-28 10:00:00'
        },
        {
            id: 'TASK-003',
            code: 'INS-2024-003',
            routeId: 'ROUTE-001',
            routeName: '一号冲压车间巡检路线',
            planId: 'PLAN-001',
            scheduledDate: '2024-06-28',
            scheduledTime: '14:00',
            assignee: '李师傅',
            status: 'abnormal',
            startTime: '2024-06-28 14:05:00',
            endTime: '2024-06-28 14:50:00',
            totalPoints: 5,
            completedPoints: 5,
            abnormalCount: 1,
            createTime: '2024-06-28 14:00:00'
        },
        {
            id: 'TASK-004',
            code: 'INS-2024-004',
            routeId: 'ROUTE-003',
            routeName: '质检中心设备巡检',
            planId: 'PLAN-003',
            scheduledDate: '2024-06-28',
            scheduledTime: '16:00',
            assignee: '陈师傅',
            status: 'completed',
            startTime: '2024-06-28 15:55:00',
            endTime: '2024-06-28 16:20:00',
            totalPoints: 3,
            completedPoints: 3,
            abnormalCount: 0,
            createTime: '2024-06-28 16:00:00'
        },
        {
            id: 'TASK-005',
            code: 'INS-2024-005',
            routeId: 'ROUTE-001',
            routeName: '一号冲压车间巡检路线',
            planId: 'PLAN-001',
            scheduledDate: '2024-06-28',
            scheduledTime: '18:00',
            assignee: '李师傅',
            status: 'pending',
            startTime: null,
            endTime: null,
            totalPoints: 5,
            completedPoints: 0,
            abnormalCount: 0,
            createTime: '2024-06-28 18:00:00'
        }
    ];

    filteredData = getCurrentViewData();
}

function getCurrentViewData() {
    switch(currentView) {
        case 'routes': return inspectionRoutes;
        case 'plans': return inspectionPlans;
        case 'tasks': return inspectionTasks;
        case 'reports': return inspectionTasks;
        default: return [];
    }
}

function switchView(viewType) {
    currentView = viewType;
    
    // 更新左侧导航菜单样式
    document.querySelectorAll('[id^="nav-"]').forEach(btn => {
        btn.classList.remove('bg-orange-50', 'text-orange-700', 'font-medium');
        btn.classList.add('text-gray-700');
    });
    const activeNav = document.getElementById(`nav-${viewType}`);
    if (activeNav) {
        activeNav.classList.remove('text-gray-700');
        activeNav.classList.add('bg-orange-50', 'text-orange-700', 'font-medium');
    }
    
    // 更新页面标题
    const titles = {
        'routes': '巡检路线',
        'plans': '巡检计划',
        'tasks': '巡检任务',
        'reports': '巡检报告'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[viewType] || '巡检管理';
    }
    
    // 切换视图内容
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    document.getElementById(`${viewType}-view`).classList.remove('hidden');
    
    filteredData = getCurrentViewData();
    renderView();
}

function renderView() {
    switch(currentView) {
        case 'routes': renderRoutesView(); break;
        case 'plans': renderPlansView(); break;
        case 'tasks': renderTasksView(); break;
        case 'reports': renderReportsView(); break;
    }
}

function renderRoutesView() {
    const container = document.getElementById('routes-container');
    if (!container) return;
    container.innerHTML = filteredData.map(route => `
        <div class="route-card" onclick="viewRouteDetail('${route.id}')">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">${route.name}</h4>
                    <p class="text-sm text-gray-600">${route.description}</p>
                </div>
                <span class="badge bg-orange-100 text-orange-700">
                    <i class="fas fa-map-marker-alt"></i> ${route.equipmentPoints.length}个点
                </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span><i class="fas fa-clock mr-1"></i>约${route.estimatedTime}分钟</span>
                <span><i class="fas fa-calendar mr-1"></i>${route.createTime.split(' ')[0]}</span>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                <span class="text-xs ${route.status === 'active' ? 'text-green-600' : 'text-gray-500'}">
                    <i class="fas fa-circle mr-1"></i>${route.status === 'active' ? '启用中' : '已停用'}
                </span>
                <div class="flex gap-2">
                    <button onclick="event.stopPropagation(); editRoute('${route.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-edit mr-1"></i>编辑
                    </button>
                    <button onclick="event.stopPropagation(); deleteRoute('${route.id}')" class="text-red-600 hover:text-red-800 text-sm">
                        <i class="fas fa-trash mr-1"></i>删除
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPlansView() {
    const tbody = document.getElementById('plans-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(plan => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${plan.name}</div>
                <div class="text-sm text-gray-500">${plan.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plan.routeName}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge bg-blue-100 text-blue-700">${plan.frequencyText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plan.assignees.join(', ')}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-chip ${plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                    <i class="fas fa-circle"></i> ${plan.active ? '启用' : '停用'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewPlanDetail('${plan.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editPlan('${plan.id}')" class="text-green-600 hover:text-green-800 mr-3" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePlan('${plan.id}')" class="text-red-600 hover:text-red-800" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderTasksView() {
    const tbody = document.getElementById('tasks-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(task => `
        <tr class="hover:bg-gray-50 ${task.status === 'abnormal' ? 'bg-red-50' : ''}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${task.code}</div>
                <div class="text-sm text-gray-500">${task.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.routeName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.assignee}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.scheduledTime}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.startTime ? task.startTime.split(' ')[1] : '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.completedPoints}/${task.totalPoints}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${task.abnormalCount > 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}">${task.abnormalCount}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(task.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewTaskDetail('${task.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                ${task.status === 'pending' ? `<button onclick="startTask('${task.id}')" class="text-green-600 hover:text-green-800 mr-3" title="开始巡检"><i class="fas fa-play"></i></button>` : ''}
                ${task.status === 'abnormal' ? `<button onclick="handleAbnormal('${task.id}')" class="text-red-600 hover:text-red-800" title="处理异常"><i class="fas fa-exclamation-triangle"></i></button>` : ''}
            </td>
        </tr>
    `).join('');
}

function renderReportsView() {
    const abnormalStats = document.getElementById('abnormal-stats');
    const trendCharts = document.getElementById('trend-charts');
    if (abnormalStats) {
        abnormalStats.innerHTML = `
            <h4 class="text-sm font-semibold text-gray-700 mb-3">设备异常率 TOP5</h4>
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-700">冲床CP-105</span>
                <div class="flex items-center gap-2">
                    <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-red-500" style="width: 60%"></div>
                    </div>
                    <span class="text-sm font-semibold text-red-600">3次</span>
                </div>
            </div>
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-700">装配机ASM-201</span>
                <div class="flex items-center gap-2">
                    <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-red-500" style="width: 40%"></div>
                    </div>
                    <span class="text-sm font-semibold text-red-600">2次</span>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600">
                    <div class="flex justify-between mb-2">
                        <span>总异常数：</span>
                        <span class="font-semibold">5个</span>
                    </div>
                    <div class="flex justify-between">
                        <span>异常发现率：</span>
                        <span class="font-semibold">12.5%</span>
                    </div>
                </div>
            </div>
        `;
    }
    if (trendCharts) {
        trendCharts.innerHTML = `
            <h4 class="text-sm font-semibold text-gray-700 mb-3">近7天完成率趋势</h4>
            <div class="grid grid-cols-7 gap-2 mb-4">
                ${[85, 90, 88, 92, 95, 89, 92].map((rate, index) => `
                    <div class="text-center">
                        <div class="h-24 bg-gray-100 rounded-lg flex items-end mb-2">
                            <div class="w-full bg-orange-500 rounded-lg transition-all" style="height: ${rate}%"></div>
                        </div>
                        <div class="text-xs text-gray-600">6/${22 + index}</div>
                        <div class="text-xs font-semibold text-orange-600">${rate}%</div>
                    </div>
                `).join('')}
            </div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-gray-600">平均完成率：</span><span class="font-semibold">90.1%</span></div>
                <div class="flex justify-between"><span class="text-gray-600">最高完成率：</span><span class="font-semibold text-green-600">95%</span></div>
                <div class="flex justify-between"><span class="text-gray-600">最低完成率：</span><span class="font-semibold text-red-600">85%</span></div>
            </div>
        `;
    }
}

function getStatusBadge(status) {
    const statusConfig = {
        'pending': { class: 'bg-blue-100 text-blue-700', icon: 'clock', text: '待执行' },
        'in_progress': { class: 'bg-yellow-100 text-yellow-700', icon: 'spinner', text: '进行中' },
        'completed': { class: 'bg-green-100 text-green-700', icon: 'check-circle', text: '已完成' },
        'abnormal': { class: 'bg-red-100 text-red-700', icon: 'exclamation-triangle', text: '发现异常' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return `<span class="status-chip ${config.class}"><i class="fas fa-${config.icon}"></i> ${config.text}</span>`;
}

function updateStatistics() {
    const todayTasks = inspectionTasks.filter(t => t.scheduledDate === '2024-06-28');
    const completed = todayTasks.filter(t => t.status === 'completed').length;
    const inProgress = todayTasks.filter(t => t.status === 'in_progress').length;
    const abnormal = todayTasks.filter(t => t.status === 'abnormal').length;
    document.getElementById('metric-today-tasks').textContent = todayTasks.length;
    document.getElementById('metric-completed').textContent = completed;
    document.getElementById('metric-in-progress').textContent = inProgress;
    document.getElementById('metric-abnormal').textContent = abnormal;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const assigneeFilter = document.getElementById('filter-assignee').value;
    const dateFilter = document.getElementById('filter-date').value;
    let data = getCurrentViewData();
    if (searchTerm) data = data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    if (statusFilter && currentView === 'tasks') data = data.filter(item => item.status === statusFilter);
    if (assigneeFilter) data = data.filter(item => {
        if (currentView === 'tasks') return item.assignee === assigneeFilter;
        if (currentView === 'plans') return item.assignees.includes(assigneeFilter);
        return true;
    });
    if (dateFilter && currentView === 'tasks') data = data.filter(item => item.scheduledDate === dateFilter);
    filteredData = data;
    renderView();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-assignee').value = '';
    document.getElementById('filter-date').value = '';
    filteredData = getCurrentViewData();
    renderView();
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function openRouteModal() {
    openModal('route-modal');
}

function openPlanModal() {
    const routeSelect = document.getElementById('plan-route');
    if (routeSelect) {
        routeSelect.innerHTML = '<option value="">请选择路线</option>' + 
            inspectionRoutes.map(route => `<option value="${route.id}">${route.name}</option>`).join('');
    }
    openModal('plan-modal');
}

function openTaskModal() {
    alert('开始巡检功能：在移动端APP中扫描设备二维码开始巡检任务');
}

function saveRoute() {
    const name = document.getElementById('route-name').value;
    if (!name) { alert('请填写路线名称'); return; }
    alert('路线保存成功！');
    closeModal('route-modal');
}

function savePlan() {
    const name = document.getElementById('plan-name').value;
    const routeId = document.getElementById('plan-route').value;
    if (!name || !routeId) { alert('请填写必填项'); return; }
    alert('计划保存成功！');
    closeModal('plan-modal');
}

function viewRouteDetail(id) {
    const route = inspectionRoutes.find(r => r.id === id);
    if (!route) return;
    alert(`路线详情：\n名称：${route.name}\n设备点：${route.equipmentPoints.length}个\n预计时长：${route.estimatedTime}分钟`);
}

function editRoute(id) { alert(`编辑路线：${id}`); }
function deleteRoute(id) { if (confirm('确定要删除这条路线吗？')) alert(`路线 ${id} 已删除`); }
function viewPlanDetail(id) {
    const plan = inspectionPlans.find(p => p.id === id);
    if (!plan) return;
    alert(`计划详情：\n名称：${plan.name}\n路线：${plan.routeName}\n频率：${plan.frequencyText}`);
}
function editPlan(id) { alert(`编辑计划：${id}`); }
function deletePlan(id) { if (confirm('确定要删除这个计划吗？')) alert(`计划 ${id} 已删除`); }
function viewTaskDetail(id) {
    const task = inspectionTasks.find(t => t.id === id);
    if (!task) return;
    alert(`任务详情：\n编号：${task.code}\n路线：${task.routeName}\n执行人：${task.assignee}\n状态：${task.status}`);
}
function startTask(id) { alert(`开始巡检任务：${id}`); }
function handleAbnormal(id) { alert(`处理异常：${id}`); }
function exportData() { alert('导出数据功能'); }
