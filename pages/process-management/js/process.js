// 产业验厂管理系统 JavaScript

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadRecentProjects();
    loadTodoList();
    loadProjectsTable();
    generateProjectCode();
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

// 导出函数到全局作用域
window.switchView = switchView;
window.showCreateProject = showCreateProject;
window.closeCreateProject = closeCreateProject;
window.submitCreateProject = submitCreateProject;
window.viewProjectDetail = viewProjectDetail;
window.editProject = editProject;
window.deleteProject = deleteProject;
