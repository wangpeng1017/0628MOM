// 产业验厂管理系统 JavaScript

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadRecentProjects();
    loadTodoList();
    loadProjectsTable();
    loadPlanningTable();
    generateProjectCode();
    loadNCRTable();
    loadReportsTable();
    loadSupplierRanking();
    loadExecutionChecklist(); // 加载检查项执行数据
    
    // 延迟初始化图表，确保DOM已加载
    setTimeout(() => {
        initRadarComparison();
        initNCRTop5Chart();
    }, 100);

    // 根据URL参数设置初始视图
    const initialView = getQueryParam('view') || 'overview';
    switchView(initialView);
});

// 初始化系统
function initializeSystem() {
    console.log('产业验厂管理系统初始化完成');
    loadSOPTemplates();
}

// 视图切换
function switchView(viewName) {
    // 隐藏所有视图
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 显示目标视图
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
    
    // 如果切换到统计分析视图，重新初始化图表
    if (viewName === 'analytics') {
        setTimeout(() => {
            initRadarComparison();
            initNCRTop5Chart();
        }, 100);
    }
    
    // 无内部侧边栏时无需设置激活项；此逻辑仅在存在内部菜单时生效
    if (typeof event !== 'undefined' && event && event.target) {
        document.querySelectorAll('.sub-nav-item').forEach(item => item.classList.remove('active'));
        const btn = event.target.closest('.sub-nav-item');
        if (btn) btn.classList.add('active');
    }
}

// 获取URL查询参数
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

// 加载近期验厂计划
function loadRecentProjects() {
    const container = document.getElementById('recentProjects');
    if (!container) return;
    
    const projects = [
        {
            id: 'INS-2025-001',
            supplier: '阳光电源股份有限公司',
            type: '储能产品',
            date: '2025-11-15',
            status: 'scheduled',
            auditor: '张明',
            progress: 0
        },
        {
            id: 'INS-2025-002',
            supplier: '隆基绿能科技股份有限公司',
            type: '光伏组件',
            date: '2025-11-20',
            status: 'in-progress',
            auditor: '李华',
            progress: 45
        },
        {
            id: 'INS-2025-003',
            supplier: '宁德时代新能源科技股份有限公司',
            type: '储能产品',
            date: '2025-11-25',
            status: 'scheduled',
            auditor: '王芳',
            progress: 0
        }
    ];
    
    container.innerHTML = projects.map(project => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewProjectDetail('${project.id}')">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-semibold text-gray-800">${project.id}</span>
                    <span class="status-badge status-${project.status}">${getStatusText(project.status)}</span>
                </div>
                <span class="text-xs text-gray-500">
                    <i class="far fa-calendar mr-1"></i>${project.date}
                </span>
            </div>
            <h4 class="font-medium text-gray-800 mb-2">${project.supplier}</h4>
            <div class="flex items-center justify-between text-sm text-gray-600">
                <span><i class="fas fa-tag mr-1 text-blue-500"></i>${project.type}</span>
                <span><i class="fas fa-user mr-1 text-green-500"></i>${project.auditor}</span>
            </div>
            ${project.progress > 0 ? `
                <div class="mt-3">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>进度</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 加载待办事项
function loadTodoList() {
    const container = document.getElementById('todoList');
    if (!container) return;
    
    const todos = [
        {
            title: '审核INS-2025-002检查表',
            priority: 'high',
            dueDate: '今天',
            type: 'review'
        },
        {
            title: '提交验厂报告INS-2024-098',
            priority: 'high',
            dueDate: '明天',
            type: 'report'
        },
        {
            title: '跟进不符合项NCR-2024-156',
            priority: 'medium',
            dueDate: '本周',
            type: 'ncr'
        },
        {
            title: '安排下月验厂计划',
            priority: 'low',
            dueDate: '下周',
            type: 'planning'
        }
    ];
    
    const typeIcons = {
        review: 'fa-clipboard-check text-blue-500',
        report: 'fa-file-alt text-green-500',
        ncr: 'fa-exclamation-triangle text-orange-500',
        planning: 'fa-calendar-alt text-purple-500'
    };
    
    container.innerHTML = todos.map(todo => `
        <div class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <i class="fas ${typeIcons[todo.type]} mt-1"></i>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">${todo.title}</p>
                <div class="flex items-center space-x-2 mt-1">
                    <span class="text-xs text-gray-500">${todo.dueDate}</span>
                    <span class="text-xs priority-${todo.priority}">
                        <i class="fas fa-flag"></i>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// 加载项目列表表格
function loadProjectsTable() {
    const tbody = document.getElementById('projectsTable');
    if (!tbody) return;
    
    const projects = [
        {
            id: 'INS-2025-001',
            supplier: '阳光电源股份有限公司',
            type: '储能产品',
            date: '2025-11-15 ~ 2025-11-17',
            status: 'scheduled',
            auditor: '张明'
        },
        {
            id: 'INS-2025-002',
            supplier: '隆基绿能科技股份有限公司',
            type: '光伏组件',
            date: '2025-11-10 ~ 2025-11-12',
            status: 'in-progress',
            auditor: '李华'
        },
        {
            id: 'INS-2024-098',
            supplier: '天合光能股份有限公司',
            type: '光伏组件',
            date: '2024-10-20 ~ 2024-10-22',
            status: 'completed',
            auditor: '王芳'
        },
        {
            id: 'INS-2024-097',
            supplier: '比亚迪股份有限公司',
            type: '储能产品',
            date: '2024-10-15 ~ 2024-10-17',
            status: 'completed',
            auditor: '刘强'
        },
        {
            id: 'INS-2025-003',
            supplier: '宁德时代新能源科技股份有限公司',
            type: '综合验厂',
            date: '2025-11-25 ~ 2025-11-27',
            status: 'draft',
            auditor: '陈静'
        }
    ];
    
    tbody.innerHTML = projects.map(project => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600 cursor-pointer hover:underline" onclick="viewProjectDetail('${project.id}')">${project.id}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-800">${project.supplier}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${project.type}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${project.date}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${project.status}">${getStatusText(project.status)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${project.auditor}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewProjectDetail('${project.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="far fa-eye"></i> 查看
                </button>
                <button onclick="editProject('${project.id}')" class="text-green-600 hover:text-green-900 mr-3">
                    <i class="far fa-edit"></i> 编辑
                </button>
                <button onclick="deleteProject('${project.id}')" class="text-red-600 hover:text-red-900">
                    <i class="far fa-trash-alt"></i> 删除
                </button>
            </td>
        </tr>
    `).join('');
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'draft': '草稿',
        'scheduled': '已计划',
        'in-progress': '进行中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 生成项目编号
function generateProjectCode() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const code = `INS-${year}-${randomNum}`;
    
    const codeInput = document.getElementById('projectCode');
    if (codeInput) {
        codeInput.value = code;
    }
}

// 显示创建项目模态框
function showCreateProject() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        generateProjectCode();
    }
}

// 关闭创建项目模态框
function closeCreateProject() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

// 提交创建项目
function submitCreateProject() {
    const supplierName = document.getElementById('supplierName')?.value;
    const inspectionType = document.getElementById('inspectionType')?.value;
    
    if (!supplierName) {
        showToast('请输入供应商名称', 'warning');
        return;
    }
    
    if (!inspectionType) {
        showToast('请选择验厂类型', 'warning');
        return;
    }
    
    showToast('验厂项目创建成功', 'success');
    closeCreateProject();
    
    // 刷新项目列表
    setTimeout(() => {
        loadProjectsTable();
        loadRecentProjects();
    }, 500);
}

// 查看项目详情
function viewProjectDetail(projectId) {
    const modal = document.getElementById('projectDetailModal');
    const content = document.getElementById('projectDetailContent');
    
    if (!modal || !content) return;
    
    // 模拟项目详情数据
    const projectData = {
        'INS-2025-001': {
            id: 'INS-2025-001',
            supplier: '阳光电源股份有限公司',
            type: '储能产品验厂',
            status: 'scheduled',
            startDate: '2025-11-15',
            endDate: '2025-11-17',
            auditor: '张明',
            team: ['张明', '李华', '王芳'],
            scope: ['信息化系统运行评估', '数据安全审计', '生产流程数字化检测'],
            address: '安徽省合肥市高新区习友路3666号',
            contact: '刘经理',
            phone: '0551-65658888'
        },
        'INS-2025-002': {
            id: 'INS-2025-002',
            supplier: '隆基绿能科技股份有限公司',
            type: '光伏组件验厂',
            status: 'in-progress',
            startDate: '2025-11-10',
            endDate: '2025-11-12',
            auditor: '李华',
            team: ['李华', '王芳', '刘强'],
            scope: ['信息化系统运行评估', '生产流程数字化检测'],
            address: '陕西省西安市经济技术开发区尚稷路8369号',
            contact: '张经理',
            phone: '029-81566666'
        }
    };
    
    const project = projectData[projectId] || projectData['INS-2025-001'];
    
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">基本信息</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">项目编号：</span>
                            <span class="font-medium text-gray-800">${project.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">供应商名称：</span>
                            <span class="font-medium text-gray-800">${project.supplier}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">验厂类型：</span>
                            <span class="font-medium text-gray-800">${project.type}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">项目状态：</span>
                            <span class="status-badge status-${project.status}">${getStatusText(project.status)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">时间安排</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">开始日期：</span>
                            <span class="font-medium text-gray-800">${project.startDate}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">结束日期：</span>
                            <span class="font-medium text-gray-800">${project.endDate}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">审核团队</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">审核组长：</span>
                            <span class="font-medium text-gray-800">${project.auditor}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">团队成员：</span>
                            <div class="mt-2 flex flex-wrap gap-2">
                                ${project.team.map(member => `
                                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">${member}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">联系信息</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">联系人：</span>
                            <span class="font-medium text-gray-800">${project.contact}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">联系电话：</span>
                            <span class="font-medium text-gray-800">${project.phone}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">地址：</span>
                            <p class="font-medium text-gray-800 mt-1">${project.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 class="font-semibold text-gray-700 mb-3">审核范围</h4>
            <div class="flex flex-wrap gap-2">
                ${project.scope.map(item => `
                    <span class="px-3 py-1 bg-teal-100 text-teal-700 rounded text-sm">${item}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

// 关闭项目详情
function closeProjectDetail() {
    const modal = document.getElementById('projectDetailModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

// 编辑项目
function editProject(projectId) {
    showToast(`正在编辑项目 ${projectId}...`, 'info');
    console.log('编辑项目:', projectId);
}

// 删除项目
function deleteProject(projectId) {
    if (confirm(`确定要删除项目 ${projectId} 吗？`)) {
        showToast(`项目 ${projectId} 已删除`, 'success');
        setTimeout(() => {
            loadProjectsTable();
        }, 500);
    }
}

// 显示Toast提示
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 获取Toast图标
function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 加载验厂计划列表
function loadPlanningTable() {
    const tbody = document.getElementById('planningTable');
    if (!tbody) return;
    
    const plans = [
        {
            id: 'PLAN-2025-001',
            supplier: '阳光电源股份有限公司',
            type: '储能产品',
            scope: '信息化系统, 数据安全',
            date: '2025-11-15 ~ 2025-11-17',
            status: 'scheduled'
        },
        {
            id: 'PLAN-2025-002',
            supplier: '隆基绿能科技股份有限公司',
            type: '光伏组件',
            scope: '信息化系统, 数字化流程',
            date: '2025-11-20 ~ 2025-11-22',
            status: 'scheduled'
        },
        {
            id: 'PLAN-2025-003',
            supplier: '宁德时代新能源科技股份有限公司',
            type: '储能产品',
            scope: '数据安全, 数字化流程',
            date: '2025-11-25 ~ 2025-11-27',
            status: 'draft'
        },
        {
            id: 'PLAN-2025-004',
            supplier: '天合光能股份有限公司',
            type: '光伏组件',
            scope: '信息化系统, 数据安全, 数字化流程',
            date: '2025-12-01 ~ 2025-12-03',
            status: 'draft'
        },
        {
            id: 'PLAN-2025-005',
            supplier: '比亚迪股份有限公司',
            type: '综合验厂',
            scope: '信息化系统, 数据安全, 数字化流程',
            date: '2025-12-05 ~ 2025-12-07',
            status: 'draft'
        },
        {
            id: 'PLAN-2024-098',
            supplier: '晶科能源股份有限公司',
            type: '光伏组件',
            scope: '信息化系统, 数字化流程',
            date: '2024-10-20 ~ 2024-10-22',
            status: 'completed'
        }
    ];
    
    tbody.innerHTML = plans.map(plan => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600 cursor-pointer hover:underline">${plan.id}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-800">${plan.supplier}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${plan.type}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-600">${plan.scope}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${plan.date}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${plan.status}">${getStatusText(plan.status)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewPlanDetail('${plan.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="far fa-eye"></i> 查看
                </button>
                ${plan.status !== 'completed' ? `
                    <button onclick="editPlan('${plan.id}')" class="text-green-600 hover:text-green-900 mr-3">
                        <i class="far fa-edit"></i> 编辑
                    </button>
                    <button onclick="deletePlan('${plan.id}')" class="text-red-600 hover:text-red-900">
                        <i class="far fa-trash-alt"></i> 删除
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// 查看计划详情
function viewPlanDetail(planId) {
    showToast(`正在加载计划 ${planId} 详情...`, 'info');
}

// 编辑计划
function editPlan(planId) {
    showToast(`正在编辑计划 ${planId}...`, 'info');
}

// 删除计划
function deletePlan(planId) {
    if (confirm(`确定要删除计划 ${planId} 吗？`)) {
        showToast(`计划 ${planId} 已删除`, 'success');
        setTimeout(() => {
            loadPlanningTable();
        }, 500);
    }
}

// 选择验厂类型
function selectInspectionType(type) {
    const typeNames = {
        'photovoltaic': '光伏组件验厂',
        'energy-storage': '储能产品验厂',
        'epc': '电站EPC验厂'
    };
    
    showToast(`已选择：${typeNames[type]}`, 'info');
    
    // 自动填充验厂类型并打开创建项目模态框
    setTimeout(() => {
        showCreateProject();
        const typeSelect = document.getElementById('inspectionType');
        if (typeSelect) {
            typeSelect.value = type;
        }
    }, 300);
}

// 切换模板模块展开/收起
function toggleTemplateModule(moduleId) {
    const content = document.getElementById(`${moduleId}-content`);
    const icon = document.getElementById(`${moduleId}-icon`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// 加载SOP模板
function loadSOPTemplates() {
    loadITSystemChecklist();
    loadDataSecurityChecklist();
    loadDigitalProcessChecklist();
}

// 加载工厂信息化系统检查表
function loadITSystemChecklist() {
    const container = document.getElementById('itSystemChecklist');
    if (!container) return;
    
    const checklist = [
        { id: 1, item: 'MES系统是否覆盖关键生产工序？', category: 'MES系统', required: true },
        { id: 2, item: 'MES系统数据采集的实时性如何？', category: 'MES系统', required: true },
        { id: 3, item: 'ERP系统物料管理是否准确？', category: 'ERP系统', required: true },
        { id: 4, item: 'ERP与MES系统集成情况如何？', category: 'ERP系统', required: false },
        { id: 5, item: '是否有系统化的数据备份与恢复机制？', category: '数据管理', required: true },
        { id: 6, item: '系统操作权限管理是否规范？', category: '权限管理', required: true },
        { id: 7, item: '是否定期进行系统性能优化？', category: '系统维护', required: false },
        { id: 8, item: '系统故障响应时间是否符合要求？', category: '系统维护', required: true },
        { id: 9, item: '是否有完整的系统操作日志？', category: '日志管理', required: true },
        { id: 10, item: '系统用户培训是否到位？', category: '培训管理', required: false },
        { id: 11, item: 'WMS仓储管理系统运行情况', category: 'WMS系统', required: false },
        { id: 12, item: 'QMS质量管理系统数据完整性', category: 'QMS系统', required: true },
        { id: 13, item: '生产计划系统APS运行效率', category: 'APS系统', required: false },
        { id: 14, item: '设备管理系统EAM维护记录', category: 'EAM系统', required: false },
        { id: 15, item: '系统间数据接口稳定性', category: '系统集成', required: true }
    ];
    
    container.innerHTML = checklist.map(item => `
        <div class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" class="mt-1 form-checkbox text-blue-600">
            <div class="flex-1">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-800">${item.item}</span>
                    ${item.required ? '<span class="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">必填</span>' : ''}
                </div>
                <p class="text-xs text-gray-500 mt-1">类别：${item.category}</p>
            </div>
        </div>
    `).join('');
}

// 加载数据安全审计检查表
function loadDataSecurityChecklist() {
    const container = document.getElementById('dataSecurityChecklist');
    if (!container) return;
    
    const checklist = [
        { id: 1, item: '是否制定了明确的数据安全管理政策？', category: '政策制度', required: true },
        { id: 2, item: '生产核心数据（如工艺参数）的访问权限是否受控？', category: '访问控制', required: true },
        { id: 3, item: '客户资料等敏感信息是否进行加密存储？', category: '数据加密', required: true },
        { id: 4, item: '是否有定期的网络安全漏洞扫描和渗透测试？', category: '安全测试', required: true },
        { id: 5, item: '数据备份策略是否完善？', category: '数据备份', required: true },
        { id: 6, item: '是否有数据泄露应急预案？', category: '应急管理', required: true },
        { id: 7, item: '员工数据安全意识培训是否定期开展？', category: '安全培训', required: false },
        { id: 8, item: '第三方供应商数据访问是否受控？', category: '第三方管理', required: true },
        { id: 9, item: '是否通过ISO27001等信息安全认证？', category: '认证体系', required: false },
        { id: 10, item: '数据删除和销毁流程是否规范？', category: '数据生命周期', required: false },
        { id: 11, item: '是否有完整的安全审计日志？', category: '审计追溯', required: true },
        { id: 12, item: '移动设备和远程访问安全策略', category: '移动安全', required: false }
    ];
    
    container.innerHTML = checklist.map(item => `
        <div class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" class="mt-1 form-checkbox text-orange-600">
            <div class="flex-1">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-800">${item.item}</span>
                    ${item.required ? '<span class="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">必填</span>' : ''}
                </div>
                <p class="text-xs text-gray-500 mt-1">类别：${item.category}</p>
            </div>
        </div>
    `).join('');
}

// 加载生产流程数字化检查表
function loadDigitalProcessChecklist() {
    const container = document.getElementById('digitalProcessChecklist');
    if (!container) return;
    
    const checklist = [
        { id: 1, item: '关键工序（如焊接、层压）的自动化程度如何？', category: '自动化水平', required: true },
        { id: 2, item: '是否采用SPC（统计过程控制）对关键质量参数进行监控？', category: '质量控制', required: true },
        { id: 3, item: '设备OEE（综合效率）数据是否实时采集与分析？', category: '设备管理', required: true },
        { id: 4, item: '是否具备产品全生命周期的追溯能力（从原材料到成品）？', category: '追溯管理', required: true },
        { id: 5, item: '生产计划与实际执行的偏差率是多少？', category: '计划管理', required: true },
        { id: 6, item: '是否实现了生产过程的无纸化作业？', category: '数字化作业', required: false },
        { id: 7, item: 'AGV/AMR等智能物流设备应用情况', category: '智能物流', required: false },
        { id: 8, item: '机器视觉检测系统覆盖率', category: '智能检测', required: false },
        { id: 9, item: '生产数据看板实时性和准确性', category: '数据可视化', required: true },
        { id: 10, item: '预测性维护系统应用情况', category: '设备维护', required: false },
        { id: 11, item: '能源管理系统（EMS）运行状况', category: '能源管理', required: false },
        { id: 12, item: '工艺参数自动调整和优化能力', category: '智能优化', required: false },
        { id: 13, item: '生产异常自动报警和处理机制', category: '异常管理', required: true },
        { id: 14, item: '产线换型时间和柔性生产能力', category: '柔性制造', required: false },
        { id: 15, item: '数字孪生技术应用情况', category: '数字孪生', required: false },
        { id: 16, item: 'AI/ML在质量预测中的应用', category: '人工智能', required: false },
        { id: 17, item: '供应链协同平台集成度', category: '供应链协同', required: false },
        { id: 18, item: '生产数据与财务系统集成情况', category: '系统集成', required: true }
    ];
    
    container.innerHTML = checklist.map(item => `
        <div class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input type="checkbox" class="mt-1 form-checkbox text-green-600">
            <div class="flex-1">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-800">${item.item}</span>
                    ${item.required ? '<span class="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">必填</span>' : ''}
                </div>
                <p class="text-xs text-gray-500 mt-1">类别：${item.category}</p>
            </div>
        </div>
    `).join('');
}

// 创建自定义模板
function createCustomTemplate() {
    showToast('自定义模板功能开发中...', 'info');
}

// ========== 验厂执行功能 ==========

// 开始验厂
function startInspection() {
    showToast('开始验厂执行...', 'info');
    loadExecutionChecklist();
}

// 加载执行检查表
function loadExecutionChecklist() {
    const container = document.getElementById('executionChecklist');
    if (!container) return;
    
    const items = [
        // 已完成检查项 (仅保留3条示例)
        { id: 1, item: 'MES系统是否覆盖关键生产工序？', status: 'completed', result: '符合', evidence: '已上传照片3张', category: '信息化系统' },
        { id: 2, item: 'MES系统数据采集的实时性如何？', status: 'completed', result: '符合', evidence: '已上传照片2张', category: '信息化系统' },
        { id: 3, item: 'ERP系统物料管理是否准确？', status: 'completed', result: '符合', evidence: '已上传照片2张', category: '信息化系统' },
        
        // 待执行检查项
        { id: 4, item: 'ERP与MES系统集成情况如何？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 5, item: '是否有系统化的数据备份与恢复机制？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 6, item: '系统操作权限管理是否规范？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 7, item: '是否定期进行系统性能优化？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 8, item: '系统故障响应时间是否符合要求？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 9, item: '是否有完整的系统操作日志？', status: 'pending', result: '', evidence: '', category: '信息化系统' },
        { id: 10, item: '数据安全管理政策是否明确？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 11, item: '生产核心数据访问权限是否受控？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 12, item: '客户资料是否进行加密存储？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 13, item: '是否有定期的网络安全漏洞扫描？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 14, item: '数据备份策略是否完善？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 15, item: '是否有数据泄露应急预案？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 16, item: '网络防火墙配置是否合理？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 17, item: '是否实施了数据分级分类管理？', status: 'pending', result: '', evidence: '', category: '数据安全' },
        { id: 18, item: '关键工序的自动化程度如何？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 19, item: '是否采用SPC对关键质量参数进行监控？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 20, item: '设备OEE数据是否实时采集与分析？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 21, item: '是否具备产品全生命周期追溯能力？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 22, item: '生产计划与实际执行的偏差率是多少？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 23, item: '是否实现了生产过程的无纸化作业？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 24, item: '生产数据看板实时性和准确性如何？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 25, item: '生产异常自动报警和处理机制是否完善？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 26, item: '生产数据与财务系统集成情况如何？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 27, item: '是否建立了数字化工艺文件管理系统？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 28, item: '质量检验数据是否自动采集和分析？', status: 'pending', result: '', evidence: '', category: '数字化流程' },
        { id: 29, item: '供应商管理系统是否完善？', status: 'pending', result: '', evidence: '', category: '供应链管理' },
        { id: 30, item: '采购订单是否实现电子化管理？', status: 'pending', result: '', evidence: '', category: '供应链管理' },
        { id: 31, item: '库存管理是否实时可视化？', status: 'pending', result: '', evidence: '', category: '供应链管理' },
        { id: 32, item: '物料追溯系统是否覆盖全流程？', status: 'pending', result: '', evidence: '', category: '供应链管理' },
        { id: 33, item: '质量管理体系是否通过ISO认证？', status: 'pending', result: '', evidence: '', category: '质量管理' },
        { id: 34, item: '不良品追溯机制是否完善？', status: 'pending', result: '', evidence: '', category: '质量管理' },
        { id: 35, item: '质量数据分析工具是否有效使用？', status: 'pending', result: '', evidence: '', category: '质量管理' },
        { id: 36, item: '设备预防性维护计划是否执行到位？', status: 'pending', result: '', evidence: '', category: '设备管理' },
        { id: 37, item: '设备运行状态是否实时监控？', status: 'pending', result: '', evidence: '', category: '设备管理' },
        { id: 38, item: '设备维修记录是否完整？', status: 'pending', result: '', evidence: '', category: '设备管理' },
        { id: 39, item: '能源消耗数据是否实时采集？', status: 'pending', result: '', evidence: '', category: '能源管理' },
        { id: 40, item: '是否建立能源管理系统？', status: 'pending', result: '', evidence: '', category: '能源管理' }
    ];
    
    container.innerHTML = items.map(item => `
        <div class="border border-gray-200 rounded-lg p-4 ${item.status === 'completed' ? 'bg-green-50' : 'bg-white'}">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">${item.category}</span>
                        <span class="text-xs text-gray-400">#${item.id}</span>
                    </div>
                    <p class="font-medium text-gray-800">${item.item}</p>
                    ${item.status === 'completed' ? `
                        <div class="mt-2 flex items-center space-x-4">
                            <span class="text-sm px-2 py-1 ${item.result === '符合' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded">${item.result}</span>
                            <span class="text-xs text-gray-500"><i class="fas fa-camera mr-1"></i>${item.evidence}</span>
                        </div>
                    ` : `
                        <div class="mt-3 flex items-center space-x-2">
                            <button onclick="markAsCompliant(${item.id})" class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                                <i class="fas fa-check mr-1"></i>符合
                            </button>
                            <button onclick="markAsNonCompliant(${item.id})" class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                <i class="fas fa-times mr-1"></i>不符合
                            </button>
                            <button onclick="uploadPhoto()" class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                                <i class="fas fa-camera mr-1"></i>拍照
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

// 标记为符合
function markAsCompliant(itemId) {
    showToast(`检查项 #${itemId} 已标记为符合`, 'success');
    loadExecutionChecklist();
}

// 标记为不符合
function markAsNonCompliant(itemId) {
    showToast(`检查项 #${itemId} 已标记为不符合，请创建NCR`, 'warning');
    createNCR();
}

// 上传照片
function uploadPhoto() {
    showToast('照片上传功能开发中...', 'info');
}

// 保存进度
function saveProgress() {
    showToast('验厂进度已保存', 'success');
}

// ========== 不符合项管理功能 ==========

// 加载NCR表格
function loadNCRTable() {
    const tbody = document.getElementById('ncrTable');
    if (!tbody) return;
    
    const ncrs = [
        {
            id: 'NCR-2025-001',
            description: '数据备份机制不完善',
            severity: '中',
            department: '信息中心',
            status: 'pending',
            dueDate: '2025-11-20'
        },
        {
            id: 'NCR-2025-002',
            description: '生产数据访问权限管理不规范',
            severity: '高',
            department: '生产部',
            status: 'in-progress',
            dueDate: '2025-11-15'
        },
        {
            id: 'NCR-2024-098',
            description: '设备OEE数据采集不及时',
            severity: '低',
            department: '设备部',
            status: 'closed',
            dueDate: '2024-10-30'
        }
    ];
    
    const severityColors = {
        '高': 'bg-red-100 text-red-700',
        '中': 'bg-orange-100 text-orange-700',
        '低': 'bg-yellow-100 text-yellow-700'
    };
    
    const statusMap = {
        'pending': { text: '待整改', class: 'bg-red-100 text-red-700' },
        'in-progress': { text: '整改中', class: 'bg-orange-100 text-orange-700' },
        'verifying': { text: '待验证', class: 'bg-blue-100 text-blue-700' },
        'closed': { text: '已关闭', class: 'bg-green-100 text-green-700' }
    };
    
    tbody.innerHTML = ncrs.map(ncr => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600 cursor-pointer hover:underline" onclick="viewNCRDetail('${ncr.id}')">${ncr.id}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-800">${ncr.description}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs px-2 py-1 rounded ${severityColors[ncr.severity]}">${ncr.severity}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${ncr.department}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs px-2 py-1 rounded ${statusMap[ncr.status].class}">${statusMap[ncr.status].text}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${ncr.dueDate}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewNCRDetail('${ncr.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="far fa-eye"></i> 查看
                </button>
                ${ncr.status !== 'closed' ? `
                    <button onclick="updateNCR('${ncr.id}')" class="text-green-600 hover:text-green-900">
                        <i class="far fa-edit"></i> 更新
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// 生成NCR编号
function generateNCRCode() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NCR-${year}-${randomNum}`;
}

// 显示创建NCR模态框
function showCreateNCR() {
    const modal = document.getElementById('createNCRModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        
        // 生成NCR编号
        const ncrCodeInput = document.getElementById('ncrCode');
        if (ncrCodeInput) {
            ncrCodeInput.value = generateNCRCode();
        }
        
        // 设置默认截止日期（7天后）
        const dueDateInput = document.getElementById('ncrDueDate');
        if (dueDateInput) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            dueDateInput.value = dueDate.toISOString().split('T')[0];
        }
    }
}

// 关闭创建NCR模态框
function closeCreateNCR() {
    const modal = document.getElementById('createNCRModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
        
        // 清空表单
        document.getElementById('ncrProject').value = '';
        document.getElementById('ncrDescription').value = '';
        document.getElementById('ncrSeverity').value = '';
        document.getElementById('ncrDepartment').value = '';
        document.getElementById('ncrRequirement').value = '';
    }
}

// 提交创建NCR
function submitCreateNCR() {
    const project = document.getElementById('ncrProject')?.value;
    const description = document.getElementById('ncrDescription')?.value;
    const severity = document.getElementById('ncrSeverity')?.value;
    const department = document.getElementById('ncrDepartment')?.value;
    const dueDate = document.getElementById('ncrDueDate')?.value;
    
    // 表单验证
    if (!project) {
        showToast('请选择关联项目', 'warning');
        return;
    }
    if (!description || description.trim() === '') {
        showToast('请输入问题描述', 'warning');
        return;
    }
    if (!severity) {
        showToast('请选择严重程度', 'warning');
        return;
    }
    if (!department || department.trim() === '') {
        showToast('请输入责任部门', 'warning');
        return;
    }
    if (!dueDate) {
        showToast('请选择整改截止日期', 'warning');
        return;
    }
    
    const ncrCode = document.getElementById('ncrCode')?.value;
    showToast(`不符合项 ${ncrCode} 创建成功`, 'success');
    closeCreateNCR();
    
    // 刷新NCR列表
    setTimeout(() => {
        loadNCRTable();
    }, 500);
}

// 创建NCR
function createNCR() {
    showCreateNCR();
}

// 查看NCR详情
function viewNCRDetail(ncrId) {
    const modal = document.getElementById('ncrDetailModal');
    const content = document.getElementById('ncrDetailContent');
    
    if (!modal || !content) return;
    
    // 模拟NCR详情数据
    const ncrData = {
        id: ncrId,
        project: 'INS-2025-001',
        supplier: '阳光电源股份有限公司',
        description: '数据备份机制不完善，缺少异地备份和定期恢复演练',
        severity: '中',
        department: '信息中心',
        status: 'in-progress',
        createDate: '2025-11-01',
        dueDate: '2025-11-20',
        requirement: '1. 建立完整的数据备份策略\n2. 实施异地备份方案\n3. 每月进行恢复演练\n4. 保留备份日志记录',
        progress: '已完成备份策略制定，正在实施异地备份方案',
        timeline: [
            { date: '2025-11-01', action: '创建NCR', user: '张明', status: 'completed' },
            { date: '2025-11-05', action: '责任部门确认', user: '李经理', status: 'completed' },
            { date: '2025-11-10', action: '提交整改方案', user: '李经理', status: 'completed' },
            { date: '2025-11-15', action: '整改实施中', user: '信息中心', status: 'in-progress' }
        ]
    };
    
    const severityColors = {
        '高': 'bg-red-100 text-red-700',
        '中': 'bg-orange-100 text-orange-700',
        '低': 'bg-yellow-100 text-yellow-700'
    };
    
    const statusMap = {
        'pending': { text: '待整改', class: 'bg-red-100 text-red-700' },
        'in-progress': { text: '整改中', class: 'bg-orange-100 text-orange-700' },
        'verifying': { text: '待验证', class: 'bg-blue-100 text-blue-700' },
        'closed': { text: '已关闭', class: 'bg-green-100 text-green-700' }
    };
    
    content.innerHTML = `
        <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">基本信息</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">NCR编号：</span>
                            <span class="font-medium text-gray-800">${ncrData.id}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">关联项目：</span>
                            <span class="font-medium text-blue-600">${ncrData.project}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">供应商：</span>
                            <span class="font-medium text-gray-800">${ncrData.supplier}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">严重程度：</span>
                            <span class="px-2 py-1 rounded text-xs ${severityColors[ncrData.severity]}">${ncrData.severity}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">当前状态：</span>
                            <span class="px-2 py-1 rounded text-xs ${statusMap[ncrData.status].class}">${statusMap[ncrData.status].text}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">时间信息</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">创建日期：</span>
                            <span class="font-medium text-gray-800">${ncrData.createDate}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">截止日期：</span>
                            <span class="font-medium text-red-600">${ncrData.dueDate}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">责任部门：</span>
                            <span class="font-medium text-gray-800">${ncrData.department}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">问题描述</h4>
                    <p class="text-sm text-gray-800">${ncrData.description}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-700 mb-3">整改要求</h4>
                    <p class="text-sm text-gray-800 whitespace-pre-line">${ncrData.requirement}</p>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-700 mb-2">整改进度</h4>
                    <p class="text-sm text-gray-800">${ncrData.progress}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 class="font-semibold text-gray-700 mb-3">处理时间线</h4>
            <div class="space-y-3">
                ${ncrData.timeline.map(item => `
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 rounded-full mt-2 ${item.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}"></div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-800">${item.action}</span>
                                <span class="text-xs text-gray-500">${item.date}</span>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">操作人：${item.user}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

// 关闭NCR详情
function closeNCRDetail() {
    const modal = document.getElementById('ncrDetailModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

// 从详情页更新NCR
function updateNCRFromDetail() {
    showToast('NCR状态更新成功', 'success');
    closeNCRDetail();
    setTimeout(() => {
        loadNCRTable();
    }, 500);
}

// 更新NCR
function updateNCR(ncrId) {
    viewNCRDetail(ncrId);
}

// ========== 验厂报告功能 ==========

// 加载报告表格
function loadReportsTable() {
    const tbody = document.getElementById('reportsTable');
    if (!tbody) return;
    
    const reports = [
        {
            id: 'RPT-2025-001',
            project: 'INS-2025-001',
            supplier: '阳光电源股份有限公司',
            date: '2025-11-10',
            score: 85,
            status: 'completed'
        },
        {
            id: 'RPT-2024-098',
            project: 'INS-2024-098',
            supplier: '天合光能股份有限公司',
            date: '2024-10-25',
            score: 92,
            status: 'completed'
        }
    ];
    
    tbody.innerHTML = reports.map(report => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600">${report.id}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-800">${report.project}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-800">${report.supplier}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600">${report.date}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-lg font-bold ${report.score >= 90 ? 'text-green-600' : report.score >= 80 ? 'text-blue-600' : 'text-orange-600'}">${report.score}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">已完成</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewReport('${report.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="far fa-eye"></i> 查看
                </button>
                <button onclick="downloadReport('${report.id}', 'pdf')" class="text-green-600 hover:text-green-900 mr-3">
                    <i class="far fa-file-pdf"></i> PDF
                </button>
                <button onclick="downloadReport('${report.id}', 'word')" class="text-blue-800 hover:text-blue-900">
                    <i class="far fa-file-word"></i> Word
                </button>
            </td>
        </tr>
    `).join('');
}

// 生成验厂报告
function generateInspectionReport() {
    showToast('正在生成验厂报告...', 'info');
    setTimeout(() => {
        showToast('验厂报告生成成功', 'success');
        loadReportsTable();
    }, 2000);
}

// 查看报告
function viewReport(reportId) {
    const modal = document.getElementById('reportViewModal');
    const content = document.getElementById('reportViewContent');
    
    if (!modal || !content) return;
    
    // 模拟报告数据
    const reportData = {
        id: reportId,
        project: 'INS-2025-001',
        supplier: '阳光电源股份有限公司',
        date: '2025-11-10',
        auditor: '张明',
        score: 85,
        summary: '该供应商在信息化系统和数字化流程方面表现良好，但在数据安全管理方面存在一定不足，需要加强数据备份和权限管理。',
        scores: [
            { category: '信息化系统运行评估', score: 90, total: 100 },
            { category: '数据安全审计', score: 75, total: 100 },
            { category: '生产流程数字化检测', score: 88, total: 100 }
        ],
        strengths: [
            'MES系统覆盖全面，数据采集实时准确',
            'ERP系统运行稳定，物料管理规范',
            '生产自动化程度高，关键工序实现智能化',
            'SPC质量控制体系完善'
        ],
        weaknesses: [
            '数据备份机制不完善，缺少异地备份',
            '生产数据访问权限管理不够严格',
            '部分设备OEE数据采集不及时'
        ],
        ncrs: [
            { id: 'NCR-2025-001', description: '数据备份机制不完善', severity: '中' },
            { id: 'NCR-2025-002', description: '生产核心数据访问权限管理不规范', severity: '高' }
        ]
    };
    
    content.innerHTML = `
        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">${reportData.supplier}</h2>
                    <p class="text-gray-600">验厂报告 - ${reportData.id}</p>
                </div>
                <div class="text-center">
                    <div class="text-5xl font-bold text-teal-600">${reportData.score}</div>
                    <p class="text-sm text-gray-600 mt-1">综合得分</p>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-3">基本信息</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">报告编号：</span>
                        <span class="font-medium text-gray-800">${reportData.id}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">关联项目：</span>
                        <span class="font-medium text-blue-600">${reportData.project}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">生成日期：</span>
                        <span class="font-medium text-gray-800">${reportData.date}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">审核组长：</span>
                        <span class="font-medium text-gray-800">${reportData.auditor}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-3">各模块得分</h4>
                <div class="space-y-3">
                    ${reportData.scores.map(item => `
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-700">${item.category}</span>
                                <span class="font-semibold ${item.score >= 85 ? 'text-green-600' : item.score >= 70 ? 'text-blue-600' : 'text-orange-600'}">${item.score}/${item.total}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${item.score}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-gray-700 mb-3">综合评价</h4>
            <p class="text-sm text-gray-800 leading-relaxed">${reportData.summary}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-green-700 mb-3"><i class="fas fa-check-circle mr-2"></i>优势项</h4>
                <ul class="space-y-2">
                    ${reportData.strengths.map(item => `
                        <li class="text-sm text-gray-800 flex items-start">
                            <i class="fas fa-check text-green-600 mr-2 mt-1"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="bg-orange-50 p-4 rounded-lg">
                <h4 class="font-semibold text-orange-700 mb-3"><i class="fas fa-exclamation-triangle mr-2"></i>改进项</h4>
                <ul class="space-y-2">
                    ${reportData.weaknesses.map(item => `
                        <li class="text-sm text-gray-800 flex items-start">
                            <i class="fas fa-times text-orange-600 mr-2 mt-1"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-semibold text-red-700 mb-3"><i class="fas fa-clipboard-list mr-2"></i>不符合项（NCR）</h4>
            <div class="space-y-2">
                ${reportData.ncrs.map(ncr => `
                    <div class="bg-white p-3 rounded border border-red-200">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-blue-600">${ncr.id}</span>
                            <span class="text-xs px-2 py-1 rounded ${ncr.severity === '高' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}">${ncr.severity}</span>
                        </div>
                        <p class="text-sm text-gray-800 mt-1">${ncr.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

// 关闭报告查看
function closeReportView() {
    const modal = document.getElementById('reportViewModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
}

// 从查看页下载报告
function downloadReportFromView(format) {
    showToast(`正在生成${format.toUpperCase()}格式报告...`, 'info');
    setTimeout(() => {
        showToast(`${format.toUpperCase()}报告下载成功`, 'success');
    }, 1500);
}

// 下载报告
function downloadReport(reportId, format) {
    showToast(`正在生成${format.toUpperCase()}格式报告...`, 'info');
    setTimeout(() => {
        showToast(`${format.toUpperCase()}报告下载成功`, 'success');
    }, 1500);
}

// ========== 统计分析功能 ==========

// 加载供应商排名
function loadSupplierRanking() {
    const container = document.getElementById('supplierRanking');
    if (!container) return;
    
    const suppliers = [
        { name: '天合光能股份有限公司', score: 92, rank: 1 },
        { name: '隆基绿能科技股份有限公司', score: 88, rank: 2 },
        { name: '阳光电源股份有限公司', score: 85, rank: 3 },
        { name: '宁德时代新能源科技股份有限公司', score: 82, rank: 4 },
        { name: '比亚迪股份有限公司', score: 78, rank: 5 }
    ];
    
    container.innerHTML = suppliers.map(supplier => `
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full ${supplier.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-200'} flex items-center justify-center">
                    <span class="font-bold ${supplier.rank <= 3 ? 'text-white' : 'text-gray-600'}">${supplier.rank}</span>
                </div>
                <span class="font-medium text-gray-800">${supplier.name}</span>
            </div>
            <div class="flex items-center space-x-4">
                <div class="text-right">
                    <p class="text-2xl font-bold ${supplier.score >= 90 ? 'text-green-600' : supplier.score >= 80 ? 'text-blue-600' : 'text-orange-600'}">${supplier.score}</p>
                    <p class="text-xs text-gray-500">综合得分</p>
                </div>
                <div class="w-32">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${supplier.score}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化雷达图对比
function initRadarComparison() {
    const chartDom = document.getElementById('radarComparison');
    if (!chartDom || typeof echarts === 'undefined') return;
    
    const myChart = echarts.init(chartDom);
    const option = {
        title: {
            text: '供应商能力对比分析'
        },
        legend: {
            data: ['天合光能', '隆基绿能', '阳光电源']
        },
        radar: {
            indicator: [
                { name: '信息化系统', max: 100 },
                { name: '数据安全', max: 100 },
                { name: '数字化流程', max: 100 },
                { name: '自动化水平', max: 100 },
                { name: '质量管理', max: 100 },
                { name: '供应链协同', max: 100 }
            ]
        },
        series: [{
            name: '供应商能力对比',
            type: 'radar',
            data: [
                {
                    value: [95, 90, 88, 92, 94, 85],
                    name: '天合光能'
                },
                {
                    value: [88, 85, 90, 87, 89, 82],
                    name: '隆基绿能'
                },
                {
                    value: [85, 82, 85, 88, 86, 78],
                    name: '阳光电源'
                }
            ]
        }]
    };
    
    myChart.setOption(option);
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 初始化不符合项TOP5图表
function initNCRTop5Chart() {
    const chartDom = document.getElementById('ncrTop5Chart');
    if (!chartDom || typeof echarts === 'undefined') return;
    
    const myChart = echarts.init(chartDom);
    const option = {
        title: {
            text: '常见不符合项统计'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['数据备份机制', '权限管理', 'OEE数据采集', '数据加密', '应急预案']
        },
        series: [{
            name: '出现次数',
            type: 'bar',
            data: [15, 12, 10, 8, 6],
            itemStyle: {
                color: '#14b8a6'
            }
        }]
    };
    
    myChart.setOption(option);
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// 导出函数到全局作用域
window.switchView = switchView;
window.showCreateProject = showCreateProject;
window.closeCreateProject = closeCreateProject;
window.submitCreateProject = submitCreateProject;
window.viewProjectDetail = viewProjectDetail;
window.closeProjectDetail = closeProjectDetail;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.viewPlanDetail = viewPlanDetail;
window.editPlan = editPlan;
window.deletePlan = deletePlan;
window.selectInspectionType = selectInspectionType;
window.toggleTemplateModule = toggleTemplateModule;
window.createCustomTemplate = createCustomTemplate;
window.startInspection = startInspection;
window.markAsCompliant = markAsCompliant;
window.markAsNonCompliant = markAsNonCompliant;
window.uploadPhoto = uploadPhoto;
window.saveProgress = saveProgress;
window.showCreateNCR = showCreateNCR;
window.closeCreateNCR = closeCreateNCR;
window.submitCreateNCR = submitCreateNCR;
window.createNCR = createNCR;
window.viewNCRDetail = viewNCRDetail;
window.closeNCRDetail = closeNCRDetail;
window.updateNCRFromDetail = updateNCRFromDetail;
window.updateNCR = updateNCR;
window.generateInspectionReport = generateInspectionReport;
window.viewReport = viewReport;
window.closeReportView = closeReportView;
window.downloadReportFromView = downloadReportFromView;
window.downloadReport = downloadReport;
