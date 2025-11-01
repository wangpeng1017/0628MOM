// 技改管理模块 - JavaScript
let projects = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderTable();
    updateStatistics();
});

// 初始化样例数据
function initializeData() {
    projects = [
        {
            id: 'TR-2024-001',
            name: '老化测试台通道扩容',
            type: 'capacity',
            equipment: 'TEST-401老化测试台',
            budget: 50000,
            actualCost: 32000,
            progress: 65,
            manager: '小李',
            status: 'ongoing',
            startDate: '2024-09-01',
            endDate: '2024-11-30',
            background: '产品迭代导致测试通道数量成为生产瓶颈',
            goals: '测试效率提升100%，日产能提升至200台',
            createDate: '2024-08-15'
        },
        {
            id: 'TR-2024-002',
            name: '注塑机自动化改造',
            type: 'automation',
            equipment: 'INJ-205注塑机',
            budget: 280000,
            actualCost: 0,
            progress: 0,
            manager: '王工',
            status: 'pending',
            startDate: '2024-12-01',
            endDate: '2025-02-28',
            background: '人工上下料效率低，人力成本高',
            goals: '人力节省50%，生产效率提升30%',
            createDate: '2024-10-20'
        },
        {
            id: 'TR-2024-003',
            name: 'CNC加工中心精度提升',
            type: 'quality',
            equipment: 'CNC-501加工中心',
            budget: 120000,
            actualCost: 115000,
            progress: 100,
            manager: '赵工',
            status: 'completed',
            startDate: '2024-07-01',
            endDate: '2024-09-30',
            background: '加工精度不满足新产品要求',
            goals: '加工精度提升至±0.005mm',
            createDate: '2024-06-15'
        },
        {
            id: 'TR-2024-004',
            name: '焊接车间通风系统改造',
            type: 'safety',
            equipment: '焊接车间C区',
            budget: 180000,
            actualCost: 95000,
            progress: 55,
            manager: '李师傅',
            status: 'ongoing',
            startDate: '2024-10-01',
            endDate: '2024-12-31',
            background: '车间通风不良，影响员工健康',
            goals: '改善工作环境，符合安全标准',
            createDate: '2024-09-10'
        },
        {
            id: 'TR-2024-005',
            name: '空压机节能改造',
            type: 'energy',
            equipment: 'AIR-301空压机',
            budget: 85000,
            actualCost: 0,
            progress: 0,
            manager: '张工',
            status: 'approved',
            startDate: '2024-11-15',
            endDate: '2025-01-15',
            background: '空压机能耗高，运行成本大',
            goals: '能耗降低25%，年节省电费15万',
            createDate: '2024-10-25'
        }
    ];
    
    filteredData = [...projects];
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('projects-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = filteredData.map(project => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${project.id}</div>
                <div class="text-sm text-gray-500">${project.createDate}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${project.name}</div>
                <div class="text-xs text-gray-500 mt-1">${project.background.substring(0, 30)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge ${getTypeBadgeClass(project.type)}">${getTypeText(project.type)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${project.equipment}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-gray-900">¥${(project.budget / 1000).toFixed(0)}K</div>
                <div class="text-xs ${project.actualCost > project.budget ? 'text-red-600' : 'text-gray-500'}">
                    实际: ¥${(project.actualCost / 1000).toFixed(0)}K
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full ${getProgressColor(project.progress)}" style="width: ${project.progress}%"></div>
                    </div>
                    <span class="text-sm font-semibold">${project.progress}%</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${project.manager}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(project.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewDetail('${project.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateProgress('${project.id}')" class="text-green-600 hover:text-green-800 mr-3" title="更新进度">
                    <i class="fas fa-tasks"></i>
                </button>
                <button onclick="viewBudget('${project.id}')" class="text-purple-600 hover:text-purple-800" title="预算详情">
                    <i class="fas fa-dollar-sign"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 获取类型徽章样式
function getTypeBadgeClass(type) {
    const classMap = {
        'capacity': 'bg-blue-100 text-blue-700',
        'quality': 'bg-green-100 text-green-700',
        'safety': 'bg-red-100 text-red-700',
        'automation': 'bg-purple-100 text-purple-700',
        'energy': 'bg-yellow-100 text-yellow-700'
    };
    return classMap[type] || 'bg-gray-100 text-gray-700';
}

// 获取类型文本
function getTypeText(type) {
    const textMap = {
        'capacity': '产能提升',
        'quality': '质量改善',
        'safety': '安全改造',
        'automation': '自动化升级',
        'energy': '节能改造'
    };
    return textMap[type] || type;
}

// 获取进度条颜色
function getProgressColor(progress) {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-400';
}

// 获取状态徽章
function getStatusBadge(status) {
    const statusConfig = {
        'draft': { class: 'bg-gray-100 text-gray-700', icon: 'file', text: '草稿' },
        'pending': { class: 'bg-yellow-100 text-yellow-700', icon: 'hourglass-half', text: '待审批' },
        'approved': { class: 'bg-green-100 text-green-700', icon: 'check', text: '已批准' },
        'ongoing': { class: 'bg-blue-100 text-blue-700', icon: 'spinner', text: '进行中' },
        'completed': { class: 'bg-green-100 text-green-700', icon: 'check-circle', text: '已完成' },
        'closed': { class: 'bg-gray-100 text-gray-700', icon: 'archive', text: '已关闭' }
    };
    const config = statusConfig[status] || statusConfig['draft'];
    return `<span class="status-chip ${config.class}"><i class="fas fa-${config.icon}"></i> ${config.text}</span>`;
}

// 更新统计数据
function updateStatistics() {
    const ongoingCount = projects.filter(p => p.status === 'ongoing').length;
    const completedCount = projects.filter(p => p.status === 'completed').length;
    const totalInvestment = projects.reduce((sum, p) => sum + p.actualCost, 0);
    const pendingCount = projects.filter(p => p.status === 'pending').length;
    
    document.getElementById('metric-ongoing').textContent = ongoingCount;
    document.getElementById('metric-completed').textContent = completedCount;
    document.getElementById('metric-investment').textContent = `¥${(totalInvestment / 1000000).toFixed(1)}M`;
    document.getElementById('metric-pending').textContent = pendingCount;
}

// 筛选功能
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const typeFilter = document.getElementById('filter-type').value;
    
    filteredData = projects.filter(project => {
        const matchSearch = !searchTerm || 
            project.id.toLowerCase().includes(searchTerm) ||
            project.name.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || project.status === statusFilter;
        const matchType = !typeFilter || project.type === typeFilter;
        
        return matchSearch && matchStatus && matchType;
    });
    
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-type').value = '';
    filteredData = [...projects];
    renderTable();
}

// 模态窗口控制
function openProjectModal() {
    document.getElementById('project-modal').classList.add('show');
}

function openBudgetModal() {
    alert('预算管理功能：查看和管理所有项目的预算执行情况');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// 保存项目
function saveProject() {
    const name = document.getElementById('project-name').value;
    const type = document.getElementById('project-type').value;
    const equipment = document.getElementById('project-equipment').value;
    const background = document.getElementById('project-background').value;
    const goals = document.getElementById('project-goals').value;
    const budget = document.getElementById('project-budget').value;
    const manager = document.getElementById('project-manager').value;
    
    if (!name || !type || !equipment || !background || !goals || !budget || !manager) {
        alert('请填写所有必填项');
        return;
    }
    
    const projectId = 'TR-' + new Date().getFullYear() + '-' + 
                     (projects.length + 1).toString().padStart(3, '0');
    
    const projectInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 技改项目已提交审批
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

项目编号: ${projectId}
项目名称: ${name}
项目类型: ${getTypeText(type)}
关联设备: ${equipment}
预估费用: ¥${parseInt(budget).toLocaleString()}
项目负责人: ${manager}

━━━ 技改背景 ━━━
${background}

━━━ 预期目标 ━━━
${goals}

━━━ 审批流程 ━━━
1. 技术评估 - 设备经理
2. 财务审批 - 财务部
3. 管理层决策 - 总经理

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 项目申请已提交
📧 系统已发送审批通知
📊 可在【待审批】中查看进度
    `;
    
    alert(projectInfo);
    
    document.getElementById('project-form').reset();
    closeModal('project-modal');
}

// 查看详情
function viewDetail(id) {
    const project = projects.find(p => p.id === id);
    alert(`项目详情\n\n编号: ${project.id}\n名称: ${project.name}\n类型: ${getTypeText(project.type)}\n设备: ${project.equipment}\n预算: ¥${project.budget.toLocaleString()}\n实际: ¥${project.actualCost.toLocaleString()}\n进度: ${project.progress}%\n负责人: ${project.manager}\n状态: ${project.status}\n\n背景: ${project.background}\n目标: ${project.goals}`);
}

// 更新进度
function updateProgress(id) {
    const project = projects.find(p => p.id === id);
    const newProgress = prompt(`更新项目进度\n\n当前进度: ${project.progress}%\n请输入新的进度(0-100):`, project.progress);
    
    if (newProgress !== null && !isNaN(newProgress)) {
        const progress = Math.max(0, Math.min(100, parseInt(newProgress)));
        alert(`✅ 进度已更新！\n\n项目: ${project.name}\n新进度: ${progress}%`);
        // 这里可以更新数据并重新渲染
    }
}

// 查看预算
function viewBudget(id) {
    const project = projects.find(p => p.id === id);
    const variance = project.actualCost - project.budget;
    const variancePercent = ((variance / project.budget) * 100).toFixed(1);
    
    alert(`预算执行情况\n\n项目: ${project.name}\n\n预算金额: ¥${project.budget.toLocaleString()}\n实际花费: ¥${project.actualCost.toLocaleString()}\n预算偏差: ¥${variance.toLocaleString()} (${variancePercent}%)\n\n${variance > 0 ? '⚠️ 超出预算' : '✅ 预算内'}`);
}

// 导出数据
function exportData() {
    alert('导出技改项目数据...');
}
