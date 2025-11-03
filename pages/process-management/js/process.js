// 产业验厂管理系统 JavaScript

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadRecentProjects();
    loadTodoList();
    loadProjectsTable();
    generateProjectCode();
    loadNCRTable();
    loadReportsTable();
    loadSupplierRanking();
    initRadarComparison();
    initNCRTop5Chart();
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
    
    // 更新导航激活状态
    document.querySelectorAll('.sub-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.sub-nav-item')?.classList.add('active');
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
    showToast(`正在加载项目 ${projectId} 详情...`, 'info');
    console.log('查看项目详情:', projectId);
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
        { id: 1, item: 'MES系统是否覆盖关键生产工序？', status: 'completed', result: '符合', evidence: '已上传照片' },
        { id: 2, item: 'ERP系统物料管理是否准确？', status: 'completed', result: '符合', evidence: '已上传照片' },
        { id: 3, item: '是否有系统化的数据备份与恢复机制？', status: 'pending', result: '', evidence: '' },
        { id: 4, item: '系统操作权限管理是否规范？', status: 'pending', result: '', evidence: '' }
    ];
    
    container.innerHTML = items.map(item => `
        <div class="border border-gray-200 rounded-lg p-4 ${item.status === 'completed' ? 'bg-green-50' : ''}">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <p class="font-medium text-gray-800">${item.item}</p>
                    ${item.status === 'completed' ? `
                        <div class="mt-2 flex items-center space-x-4">
                            <span class="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">${item.result}</span>
                            <span class="text-xs text-gray-500"><i class="fas fa-camera mr-1"></i>${item.evidence}</span>
                        </div>
                    ` : `
                        <div class="mt-3 flex items-center space-x-2">
                            <button onclick="markAsCompliant(${item.id})" class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">符合</button>
                            <button onclick="markAsNonCompliant(${item.id})" class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">不符合</button>
                            <button onclick="uploadPhoto()" class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"><i class="fas fa-camera mr-1"></i>拍照</button>
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

// 显示创建NCR模态框
function showCreateNCR() {
    showToast('创建不符合项功能开发中...', 'info');
}

// 创建NCR
function createNCR() {
    showCreateNCR();
}

// 查看NCR详情
function viewNCRDetail(ncrId) {
    showToast(`正在加载NCR ${ncrId} 详情...`, 'info');
}

// 更新NCR
function updateNCR(ncrId) {
    showToast(`正在更新NCR ${ncrId}...`, 'info');
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
    showToast(`正在加载报告 ${reportId}...`, 'info');
}

// 下载报告
function downloadReport(reportId, format) {
    showToast(`正在生成${format.toUpperCase()}格式报告...`, 'info');
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
window.editProject = editProject;
window.deleteProject = deleteProject;
window.selectInspectionType = selectInspectionType;
window.toggleTemplateModule = toggleTemplateModule;
window.createCustomTemplate = createCustomTemplate;
window.startInspection = startInspection;
window.markAsCompliant = markAsCompliant;
window.markAsNonCompliant = markAsNonCompliant;
window.uploadPhoto = uploadPhoto;
window.saveProgress = saveProgress;
window.showCreateNCR = showCreateNCR;
window.createNCR = createNCR;
window.viewNCRDetail = viewNCRDetail;
window.updateNCR = updateNCR;
window.generateInspectionReport = generateInspectionReport;
window.viewReport = viewReport;
window.downloadReport = downloadReport;
