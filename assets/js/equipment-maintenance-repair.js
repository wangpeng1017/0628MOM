// 维护维修管理 - 完整功能实现
// 包含：看板视图切换、工单管理、派工调度、进度更新、知识库、统计分析

// ==================== 全局变量 ====================
let currentBoardView = 'kanban';
let workOrderData = [];
let filteredWorkOrders = [];
let currentPage = 1;
let pageSize = 10;
let selectedWorkOrders = [];
let knowledgeBaseData = [];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeWorkOrderData();
    initializeKnowledgeBase();
    renderWorkOrderTable();
    updateStatistics();
    updateBoardCounters();
    setupEventListeners();
});

// ==================== 事件监听器设置 ====================
function setupEventListeners() {
    document.getElementById('filter-code')?.addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('filter-status')?.addEventListener('change', applyFilters);
    document.getElementById('filter-priority')?.addEventListener('change', applyFilters);
    document.getElementById('filter-fault')?.addEventListener('change', applyFilters);
    document.getElementById('board-search')?.addEventListener('input', debounce(handleBoardSearch, 300));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 看板视图切换 ====================
function switchBoardView(viewType) {
    currentBoardView = viewType;
    ['kanban', 'list', 'calendar'].forEach(type => {
        const btn = document.getElementById(`view-${type}`);
        if (btn) {
            if (type === viewType) {
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('bg-gray-200', 'text-gray-700');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        }
    });
}

function handleBoardSearch() {
    const searchTerm = document.getElementById('board-search')?.value.toLowerCase() || '';
    if (searchTerm) {
        filteredWorkOrders = workOrderData.filter(wo => 
            wo.code.toLowerCase().includes(searchTerm) ||
            wo.equipmentName.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredWorkOrders = [...workOrderData];
    }
    renderWorkOrderTable();
    updateBoardCounters();
}

function filterByStatus(status) {
    document.getElementById('filter-status').value = status;
    applyFilters();
}

function filterByPriority(priority) {
    document.getElementById('filter-priority').value = priority;
    applyFilters();
}

function resetPriorityFilter() {
    document.getElementById('filter-priority').value = '';
    applyFilters();
}

// ==================== 筛选器功能 ====================
function applyFilters() {
    const codeFilter = document.getElementById('filter-code')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value || '';
    const priorityFilter = document.getElementById('filter-priority')?.value || '';
    const faultFilter = document.getElementById('filter-fault')?.value || '';
    
    filteredWorkOrders = workOrderData.filter(wo => {
        const matchCode = !codeFilter || wo.code.toLowerCase().includes(codeFilter) || wo.equipmentName.toLowerCase().includes(codeFilter);
        const matchStatus = !statusFilter || wo.status === statusFilter;
        const matchPriority = !priorityFilter || wo.priority === priorityFilter;
        const matchFault = !faultFilter || wo.faultType === faultFilter;
        return matchCode && matchStatus && matchPriority && matchFault;
    });
    
    currentPage = 1;
    renderWorkOrderTable();
    updateBoardCounters();
}

function resetFilters() {
    document.getElementById('filter-code').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-fault').value = '';
    filteredWorkOrders = [...workOrderData];
    currentPage = 1;
    renderWorkOrderTable();
    updateBoardCounters();
}

// ==================== 模态窗口管理 ====================
function openModal(modalType) {
    const modal = document.getElementById(`modal-${modalType}`);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalType) {
    const modal = document.getElementById(`modal-${modalType}`);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ==================== 工单表单功能 ====================
function openWorkOrderForm(workOrderId = null) {
    if (workOrderId) {
        const workOrder = workOrderData.find(wo => wo.id === workOrderId);
        if (workOrder) fillWorkOrderForm(workOrder);
    } else {
        clearWorkOrderForm();
        document.getElementById('form-code').value = generateWorkOrderCode();
    }
    openModal('form');
}

function fillWorkOrderForm(workOrder) {
    document.getElementById('form-code').value = workOrder.code;
    document.getElementById('form-trigger').value = workOrder.trigger;
    document.getElementById('form-equipment').value = workOrder.equipmentName;
    document.getElementById('form-priority').value = workOrder.priority;
    document.getElementById('form-fault').value = workOrder.faultType;
    document.getElementById('form-repair-type').value = workOrder.repairType;
    document.getElementById('form-description').value = workOrder.faultDescription;
    document.getElementById('form-applicant').value = workOrder.applicant;
}

function clearWorkOrderForm() {
    document.getElementById('workorder-form').reset();
}

function generateWorkOrderCode() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `WO-${dateStr}-${random}`;
}

function saveWorkOrder() {
    const formData = {
        id: Date.now(),
        code: document.getElementById('form-code').value,
        trigger: document.getElementById('form-trigger').value,
        equipmentName: document.getElementById('form-equipment').value,
        priority: document.getElementById('form-priority').value,
        faultType: document.getElementById('form-fault').value,
        repairType: document.getElementById('form-repair-type').value,
        faultDescription: document.getElementById('form-description').value,
        applicant: document.getElementById('form-applicant').value || '当前用户',
        status: 'waiting_response',
        createTime: new Date().toISOString(),
        timeline: [{
            type: 'create',
            title: '工单创建',
            description: '工单已创建，等待响应',
            operator: document.getElementById('form-applicant').value || '当前用户',
            time: new Date().toLocaleString('zh-CN')
        }]
    };
    
    workOrderData.unshift(formData);
    filteredWorkOrders = [...workOrderData];
    closeModal('form');
    renderWorkOrderTable();
    updateStatistics();
    updateBoardCounters();
    alert('工单创建成功！');
}

// ==================== 工单详情功能 ====================
function openWorkOrderDetail(workOrderId) {
    const workOrder = workOrderData.find(wo => wo.id === workOrderId);
    if (workOrder) {
        renderWorkOrderDetail(workOrder);
        openModal('detail');
    }
}

function renderWorkOrderDetail(workOrder) {
    document.getElementById('detail-code').textContent = workOrder.code;
    document.getElementById('detail-status').textContent = getStatusText(workOrder.status);
    document.getElementById('detail-status').className = `status-chip ${getStatusClass(workOrder.status)}`;
    document.getElementById('detail-priority').textContent = getPriorityText(workOrder.priority);
    document.getElementById('detail-priority').className = `status-chip ${getPriorityClass(workOrder.priority)}`;
    document.getElementById('detail-repair-type').textContent = getRepairTypeText(workOrder.repairType);
    document.getElementById('detail-trigger').textContent = getTriggerText(workOrder.trigger);
    document.getElementById('detail-equipment-code').textContent = workOrder.equipmentCode || 'N/A';
    document.getElementById('detail-equipment-name').textContent = workOrder.equipmentName;
    document.getElementById('detail-workshop').textContent = workOrder.workshop || 'N/A';
    document.getElementById('detail-line').textContent = workOrder.line || 'N/A';
    document.getElementById('detail-start-date').textContent = workOrder.equipmentStartDate || 'N/A';
    document.getElementById('detail-applicant').textContent = workOrder.applicant;
    document.getElementById('detail-manager').textContent = workOrder.manager || '待指派';
    document.getElementById('detail-engineer').textContent = workOrder.engineer || '待指派';
    document.getElementById('detail-sla-response').textContent = workOrder.slaResponse || '10分钟';
    document.getElementById('detail-sla-fix').textContent = workOrder.slaFix || '4小时';
    document.getElementById('detail-fault-type').textContent = getFaultTypeText(workOrder.faultType);
    document.getElementById('detail-fault-description').textContent = workOrder.faultDescription;
    renderWorkOrderTimeline(workOrder);
    renderSparePartsList(workOrder);
    renderWorkOrderAttachments(workOrder);
    renderAcceptanceInfo(workOrder);
}

function switchDetailTab(tabName, button) {
    document.querySelectorAll('.detail-tab').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    button.classList.add('active');
}

function renderWorkOrderTimeline(workOrder) {
    const timelineContainer = document.getElementById('detail-timeline');
    const timeline = workOrder.timeline || [{
        type: 'create',
        title: '工单创建',
        description: '工单已创建，等待响应',
        operator: workOrder.applicant,
        time: workOrder.createTime ? new Date(workOrder.createTime).toLocaleString('zh-CN') : 'N/A'
    }];
    
    timelineContainer.innerHTML = timeline.map(item => `
        <div class="timeline-item">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold text-gray-800">${item.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${item.description}</p>
                    <p class="text-xs text-gray-500 mt-1">操作人：${item.operator}</p>
                </div>
                <span class="text-xs text-gray-500 whitespace-nowrap ml-4">${item.time}</span>
            </div>
        </div>
    `).join('');
}

function renderSparePartsList(workOrder) {
    const spareBody = document.getElementById('detail-spare-body');
    const spareParts = workOrder.spareParts || [];
    
    if (spareParts.length === 0) {
        spareBody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">暂无备件消耗记录</td></tr>';
    } else {
        spareBody.innerHTML = spareParts.map(part => `
            <tr>
                <td class="px-4 py-2">${part.code}</td>
                <td class="px-4 py-2">${part.name}</td>
                <td class="px-4 py-2">${part.quantity}</td>
                <td class="px-4 py-2">${part.receiver}</td>
                <td class="px-4 py-2">${part.time}</td>
                <td class="px-4 py-2">${part.remark || '-'}</td>
            </tr>
        `).join('');
    }
}

function renderWorkOrderAttachments(workOrder) {
    const attachmentList = document.getElementById('detail-attachment-list');
    const attachments = workOrder.attachments || [];
    
    if (attachments.length === 0) {
        attachmentList.innerHTML = '<p class="text-center text-gray-500 py-8">暂无附件</p>';
    } else {
        attachmentList.innerHTML = attachments.map(file => `
            <div class="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div class="flex items-center gap-3">
                    <i class="fas fa-file-pdf text-xl text-red-600"></i>
                    <div>
                        <p class="font-medium text-sm">${file.name}</p>
                        <p class="text-xs text-gray-500">上传时间: ${file.uploadTime} | 大小: ${file.size}</p>
                    </div>
                </div>
                <button onclick="downloadWorkOrderAttachment('${file.id}')" class="text-primary hover:text-blue-700">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
    }
}

function renderAcceptanceInfo(workOrder) {
    const acceptanceContent = document.getElementById('detail-acceptance-content');
    const feedbackContent = document.getElementById('detail-feedback');
    
    if (workOrder.acceptance) {
        acceptanceContent.innerHTML = `
            <div class="flex justify-between"><span class="text-gray-500">验收人:</span><span class="font-medium">${workOrder.acceptance.inspector}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">验收时间:</span><span class="font-medium">${workOrder.acceptance.time}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">验收结果:</span><span class="badge ${workOrder.acceptance.result === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${workOrder.acceptance.result === 'pass' ? '通过' : '不通过'}</span></div>
        `;
    } else {
        acceptanceContent.innerHTML = '<p class="text-gray-500">待验收</p>';
    }
    
    if (workOrder.feedback) {
        feedbackContent.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-gray-600">满意度评分:</span>
                <div class="flex gap-1">
                    ${Array(5).fill(0).map((_, i) => `<i class="fas fa-star ${i < workOrder.feedback.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`).join('')}
                </div>
            </div>
            <p class="text-sm text-gray-700 mt-2">${workOrder.feedback.comment}</p>
        `;
    } else {
        feedbackContent.innerHTML = '<p class="text-gray-500">暂无评价</p>';
    }
}

// ==================== 派工功能 ====================
function openAssignModal() {
    const selected = getSelectedWorkOrders();
    if (selected.length === 0) {
        alert('请先选择要派工的工单');
        return;
    }
    document.getElementById('assign-selected-count').textContent = selected.length;
    openModal('assign');
}

function assignWorkOrder() {
    const engineer = document.getElementById('assign-engineer').value;
    if (!engineer) {
        alert('请选择工程师');
        return;
    }
    
    const selected = getSelectedWorkOrders();
    const engineerName = document.querySelector(`#assign-engineer option[value="${engineer}"]`).textContent;
    
    selected.forEach(wo => {
        wo.status = 'in_progress';
        wo.engineer = engineerName;
        wo.timeline = wo.timeline || [];
        wo.timeline.push({
            type: 'assign',
            title: '工单派工',
            description: `已派工给 ${engineerName}`,
            operator: '调度员',
            time: new Date().toLocaleString('zh-CN')
        });
    });
    
    closeModal('assign');
    renderWorkOrderTable();
    updateStatistics();
    updateBoardCounters();
    clearSelection();
    alert(`成功派工 ${selected.length} 个工单`);
}

// ==================== 进度更新功能 ====================
function openProgressModal(workOrderId = null) {
    if (workOrderId) {
        selectedWorkOrders = [workOrderId];
    } else {
        const selected = getSelectedWorkOrders();
        if (selected.length === 0) {
            alert('请先选择要更新的工单');
            return;
        }
    }
    openModal('progress');
}

function updateProgress() {
    const status = document.getElementById('progress-status').value;
    const remark = document.getElementById('progress-remark').value;
    
    if (!status) {
        alert('请选择工单状态');
        return;
    }
    
    const workOrders = selectedWorkOrders.length > 0 
        ? workOrderData.filter(wo => selectedWorkOrders.includes(wo.id))
        : getSelectedWorkOrders();
    
    workOrders.forEach(wo => {
        wo.status = status;
        wo.timeline = wo.timeline || [];
        wo.timeline.push({
            type: 'progress',
            title: '进度更新',
            description: remark || `状态更新为: ${getStatusText(status)}`,
            operator: wo.engineer || '当前用户',
            time: new Date().toLocaleString('zh-CN')
        });
    });
    
    closeModal('progress');
    renderWorkOrderTable();
    updateStatistics();
    updateBoardCounters();
    clearSelection();
    alert('进度更新成功');
}

// ==================== 知识库功能 ====================
function openKnowledgeModal() {
    renderKnowledgeList();
    openModal('knowledge');
}

function searchKnowledge() {
    const searchTerm = document.getElementById('knowledge-search')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('knowledge-type')?.value || '';
    
    let filtered = knowledgeBaseData;
    
    if (searchTerm) {
        filtered = filtered.filter(kb => 
            kb.title.toLowerCase().includes(searchTerm) ||
            kb.symptom.toLowerCase().includes(searchTerm) ||
            kb.solution.toLowerCase().includes(searchTerm)
        );
    }
    
    if (typeFilter) {
        filtered = filtered.filter(kb => kb.faultType === typeFilter);
    }
    
    renderKnowledgeList(filtered);
}

function renderKnowledgeList(data = knowledgeBaseData) {
    const listContainer = document.getElementById('knowledge-list');
    
    if (data.length === 0) {
        listContainer.innerHTML = '<p class="text-center text-gray-500 py-8">暂无知识库记录</p>';
        return;
    }
    
    listContainer.innerHTML = data.map(kb => `
        <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="viewKnowledgeDetail('${kb.id}')">
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-800">${kb.title}</h4>
                <span class="badge ${getFaultTypeClass(kb.faultType)}">${getFaultTypeText(kb.faultType)}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2"><strong>故障现象:</strong> ${kb.symptom}</p>
            <p class="text-sm text-gray-600 mb-2"><strong>解决方案:</strong> ${kb.solution}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span><i class="fas fa-user mr-1"></i>${kb.author}</span>
                <span><i class="fas fa-clock mr-1"></i>${kb.createTime}</span>
            </div>
        </div>
    `).join('');
}

function viewKnowledgeDetail(kbId) {
    const kb = knowledgeBaseData.find(k => k.id === kbId);
    if (kb) {
        alert(`知识库详情:\n\n标题: ${kb.title}\n故障类型: ${getFaultTypeText(kb.faultType)}\n故障现象: ${kb.symptom}\n解决方案: ${kb.solution}`);
    }
}

function exportKnowledge() {
    alert('知识库导出功能开发中...');
}

// ==================== 工单列表渲染 ====================
function renderWorkOrderTable() {
    const tbody = document.getElementById('workorder-tbody');
    const dataToRender = filteredWorkOrders.length > 0 ? filteredWorkOrders : workOrderData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = dataToRender.slice(start, end);
    
    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">暂无工单数据</td></tr>';
        updatePagination(0);
        return;
    }
    
    tbody.innerHTML = pageData.map(wo => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3">
                <input type="checkbox" class="rounded workorder-checkbox" data-id="${wo.id}" onchange="updateSelectedCount()">
            </td>
            <td class="px-4 py-3">
                <div class="font-medium text-primary cursor-pointer hover:text-blue-700" onclick="openWorkOrderDetail(${wo.id})">${wo.code}</div>
                <div class="text-xs text-gray-500">${wo.createTime ? new Date(wo.createTime).toLocaleString('zh-CN') : 'N/A'}</div>
            </td>
            <td class="px-4 py-3">
                <div class="font-medium text-gray-800">${wo.equipmentName}</div>
                <div class="text-xs text-gray-500">${wo.equipmentCode || 'N/A'} | ${wo.workshop || 'N/A'}</div>
            </td>
            <td class="px-4 py-3">
                <div class="text-sm text-gray-700">${wo.faultDescription.substring(0, 40)}${wo.faultDescription.length > 40 ? '...' : ''}</div>
                <div class="mt-1"><span class="badge ${getFaultTypeClass(wo.faultType)}">${getFaultTypeText(wo.faultType)}</span></div>
            </td>
            <td class="px-4 py-3">
                <span class="badge ${getRepairTypeClass(wo.repairType)}">${getRepairTypeText(wo.repairType)}</span>
            </td>
            <td class="px-4 py-3">
                <div class="text-sm text-gray-700">${wo.engineer || '待指派'}</div>
                <div class="mt-1"><span class="badge ${getStatusClass(wo.status)}">${getStatusText(wo.status)}</span></div>
                <div class="mt-1"><span class="badge ${getPriorityClass(wo.priority)}">${getPriorityText(wo.priority)}</span></div>
            </td>
            <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="text-xs text-gray-600">正常</span>
                </div>
            </td>
            <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                    <button onclick="openWorkOrderDetail(${wo.id})" class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="openWorkOrderForm(${wo.id})" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="openProgressModal(${wo.id})" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="更新进度">
                        <i class="fas fa-clock-rotate-left"></i>
                    </button>
                    <button onclick="deleteWorkOrder(${wo.id})" class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination(dataToRender.length);
}

// ==================== 分页功能 ====================
function updatePagination(totalCount) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    
    document.getElementById('pagination-range').textContent = totalCount > 0 ? `${start} - ${end}` : '0 - 0';
    document.getElementById('pagination-total').textContent = totalCount;
    
    const pagesContainer = document.getElementById('pagination-pages');
    let pagesHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `<button class="px-3 py-1 ${i === currentPage ? 'bg-primary text-white' : 'border'} rounded text-sm hover:bg-gray-50" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += `<span class="px-2">...</span>`;
        }
    }
    
    pagesContainer.innerHTML = pagesHTML;
}

function changePage(direction) {
    const dataToRender = filteredWorkOrders.length > 0 ? filteredWorkOrders : workOrderData;
    const totalPages = Math.ceil(dataToRender.length / pageSize);
    
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    }
    
    renderWorkOrderTable();
}

function goToPage(page) {
    currentPage = page;
    renderWorkOrderTable();
}

// ==================== 选择功能 ====================
function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('.workorder-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.workorder-checkbox:checked');
    const count = checkboxes.length;
    document.getElementById('selected-count').textContent = count;
    document.getElementById('bulk-actions').classList.toggle('hidden', count === 0);
}

function getSelectedWorkOrders() {
    const checkboxes = document.querySelectorAll('.workorder-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    return workOrderData.filter(wo => ids.includes(wo.id));
}

function clearSelection() {
    document.querySelectorAll('.workorder-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('select-all').checked = false;
    updateSelectedCount();
}

// ==================== 批量操作 ====================
function bulkDispatch() {
    openAssignModal();
}

function bulkExport() {
    const selected = getSelectedWorkOrders();
    console.log('批量导出', selected);
    alert(`准备导出 ${selected.length} 个工单`);
}

function exportWorkOrders() {
    alert('导出功能开发中...');
}

function deleteWorkOrder(workOrderId) {
    if (confirm('确定要删除这个工单吗？')) {
        const index = workOrderData.findIndex(wo => wo.id === workOrderId);
        if (index > -1) {
            workOrderData.splice(index, 1);
            filteredWorkOrders = [...workOrderData];
            renderWorkOrderTable();
            updateStatistics();
            updateBoardCounters();
            alert('工单已删除');
        }
    }
}

// ==================== 统计功能 ====================
function updateStatistics() {
    const total = workOrderData.length;
    const urgent = workOrderData.filter(wo => wo.priority === 'urgent' && wo.status !== 'closed').length;
    const closed = workOrderData.filter(wo => wo.status === 'closed').length;
    
    document.getElementById('metric-total').textContent = total;
    document.getElementById('metric-urgent').textContent = urgent;
    document.getElementById('metric-closed').textContent = closed;
    document.getElementById('metric-response').textContent = '15分钟';
}

function updateBoardCounters() {
    const dataToCount = filteredWorkOrders.length > 0 ? filteredWorkOrders : workOrderData;
    
    const statusCounts = {
        waiting_response: 0,
        pending_dispatch: 0,
        in_progress: 0,
        pending_acceptance: 0,
        closed: 0
    };
    
    const priorityCounts = {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
    };
    
    dataToCount.forEach(wo => {
        if (statusCounts.hasOwnProperty(wo.status)) {
            statusCounts[wo.status]++;
        }
        if (priorityCounts.hasOwnProperty(wo.priority)) {
            priorityCounts[wo.priority]++;
        }
    });
    
    Object.keys(statusCounts).forEach(status => {
        const el = document.getElementById(`status-${status}`);
        if (el) el.textContent = statusCounts[status];
    });
    
    Object.keys(priorityCounts).forEach(priority => {
        const el = document.getElementById(`priority-${priority}`);
        if (el) el.textContent = priorityCounts[priority];
    });
}

// ==================== 辅助函数 ====================
function getStatusText(status) {
    const map = {
        waiting_response: '待响应',
        pending_dispatch: '待派工',
        in_progress: '进行中',
        waiting_material: '待料',
        pending_acceptance: '待验收',
        closed: '已关闭'
    };
    return map[status] || status;
}

function getStatusClass(status) {
    const map = {
        waiting_response: 'bg-orange-100 text-orange-700',
        pending_dispatch: 'bg-yellow-100 text-yellow-700',
        in_progress: 'bg-blue-100 text-blue-700',
        waiting_material: 'bg-amber-100 text-amber-700',
        pending_acceptance: 'bg-purple-100 text-purple-700',
        closed: 'bg-green-100 text-green-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
}

function getPriorityText(priority) {
    const map = {
        urgent: '紧急',
        high: '高',
        medium: '中',
        low: '低'
    };
    return map[priority] || priority;
}

function getPriorityClass(priority) {
    const map = {
        urgent: 'bg-red-100 text-red-700',
        high: 'bg-orange-100 text-orange-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-green-100 text-green-700'
    };
    return map[priority] || 'bg-gray-100 text-gray-700';
}

function getRepairTypeText(type) {
    const map = {
        component_replacement: '关键元件更换',
        spare_parts: '备品备件更换',
        tool_repair: '工器具维修'
    };
    return map[type] || type;
}

function getRepairTypeClass(type) {
    const map = {
        component_replacement: 'bg-blue-100 text-blue-700',
        spare_parts: 'bg-green-100 text-green-700',
        tool_repair: 'bg-purple-100 text-purple-700'
    };
    return map[type] || 'bg-gray-100 text-gray-700';
}

function getFaultTypeText(type) {
    const map = {
        electrical: '电气故障',
        mechanical: '机械故障',
        calibration: '校准问题',
        software: '软件故障'
    };
    return map[type] || type;
}

function getFaultTypeClass(type) {
    const map = {
        electrical: 'bg-red-100 text-red-700',
        mechanical: 'bg-blue-100 text-blue-700',
        calibration: 'bg-yellow-100 text-yellow-700',
        software: 'bg-purple-100 text-purple-700'
    };
    return map[type] || 'bg-gray-100 text-gray-700';
}

function getTriggerText(trigger) {
    const map = {
        manual: 'PC人工报修',
        mobile: '移动端扫码',
        iot: 'IoT自动报修',
        inspection: '巡检转报修'
    };
    return map[trigger] || trigger;
}

function uploadWorkOrderAttachment() {
    document.getElementById('workorder-attachment-input').click();
}

function handleWorkOrderAttachment(event) {
    const file = event.target.files[0];
    if (file) {
        alert(`附件 "${file.name}" 上传成功`);
    }
}

function downloadWorkOrderAttachment(fileId) {
    console.log('下载附件:', fileId);
    alert('附件下载功能开发中...');
}

function openSpareApply() {
    alert('备件申请功能开发中...');
}

// ==================== 数据初始化 ====================
function initializeWorkOrderData() {
    workOrderData = [
        {
            id: 1,
            code: 'WO-20250130-001',
            equipmentCode: 'EQ-2024-001',
            equipmentName: '全自动贴片机',
            workshop: 'A车间',
            line: 'SMT-1号线',
            faultDescription: '温控系统故障，温度无法控制，影响生产',
            faultType: 'electrical',
            repairType: 'component_replacement',
            priority: 'urgent',
            status: 'in_progress',
            trigger: 'iot',
            applicant: '张操作员',
            engineer: '李工',
            createTime: '2025-01-30T14:25:30',
            timeline: [
                {
                    type: 'assign',
                    title: '工单派工',
                    description: '已派工给李工，预计到场时间: 立即',
                    operator: '调度员',
                    time: '2025-01-30 14:30:00'
                },
                {
                    type: 'create',
                    title: '工单创建',
                    description: 'IoT自动报修，温控系统异常告警',
                    operator: '张操作员',
                    time: '2025-01-30 14:25:30'
                }
            ]
        },
        {
            id: 2,
            code: 'WO-20250130-002',
            equipmentCode: 'EQ-2024-019',
            equipmentName: '逆变器老化测试台',
            workshop: 'B车间',
            line: '测试区',
            faultDescription: '测试精度偏差，需要重新校准',
            faultType: 'calibration',
            repairType: 'spare_parts',
            priority: 'high',
            status: 'pending_dispatch',
            trigger: 'inspection',
            applicant: '王巡检员',
            createTime: '2025-01-30T10:15:00',
            timeline: [
                {
                    type: 'create',
                    title: '工单创建',
                    description: '巡检发现测试精度偏差',
                    operator: '王巡检员',
                    time: '2025-01-30 10:15:00'
                }
            ]
        },
        {
            id: 3,
            code: 'WO-20250129-015',
            equipmentCode: 'EQ-2024-033',
            equipmentName: '组件层压机',
            workshop: 'D车间',
            line: '组件线-2',
            faultDescription: '液压系统压力不稳定，已完成维修',
            faultType: 'mechanical',
            repairType: 'component_replacement',
            priority: 'medium',
            status: 'closed',
            trigger: 'manual',
            applicant: '赵工程师',
            engineer: '王工',
            createTime: '2025-01-29T09:00:00',
            completionTime: '2025-01-29T16:30:00',
            acceptance: {
                inspector: '赵工程师',
                time: '2025-01-29 16:45:00',
                result: 'pass',
                remark: '设备运行正常，压力稳定'
            },
            feedback: {
                rating: 5,
                comment: '维修及时，服务专业，设备恢复正常运行'
            },
            timeline: [
                {
                    type: 'close',
                    title: '工单关闭',
                    description: '验收通过，工单关闭',
                    operator: '赵工程师',
                    time: '2025-01-29 16:45:00'
                },
                {
                    type: 'complete',
                    title: '维修完成',
                    description: '更换液压泵，系统测试正常',
                    operator: '王工',
                    time: '2025-01-29 16:30:00'
                },
                {
                    type: 'start',
                    title: '开始维修',
                    description: '到场检查，确认液压泵故障',
                    operator: '王工',
                    time: '2025-01-29 10:00:00'
                },
                {
                    type: 'assign',
                    title: '工单派工',
                    description: '已派工给王工',
                    operator: '调度员',
                    time: '2025-01-29 09:15:00'
                },
                {
                    type: 'create',
                    title: '工单创建',
                    description: 'PC人工报修，液压系统异常',
                    operator: '赵工程师',
                    time: '2025-01-29 09:00:00'
                }
            ]
        }
    ];
    
    filteredWorkOrders = [...workOrderData];
}

function initializeKnowledgeBase() {
    knowledgeBaseData = [
        {
            id: 'KB001',
            title: '贴片机温控系统故障处理',
            faultType: 'electrical',
            symptom: '温度传感器失效，温度显示异常或无法控制',
            solution: '1. 检查传感器连接线路 2. 更换温度传感器 3. 校准温控模块 4. 测试温度控制精度',
            author: '李工',
            createTime: '2024-12-15',
            referenceCount: 8
        },
        {
            id: 'KB002',
            title: '液压系统压力不稳定排查',
            faultType: 'mechanical',
            symptom: '液压压力波动大，设备运行不稳定',
            solution: '1. 检查液压油油位和质量 2. 检查液压泵工作状态 3. 清洗或更换滤芯 4. 检查压力阀设定值',
            author: '王工',
            createTime: '2024-11-20',
            referenceCount: 12
        },
        {
            id: 'KB003',
            title: '测试设备校准偏差处理',
            faultType: 'calibration',
            symptom: '测试数据与标准值偏差超出允许范围',
            solution: '1. 使用标准件进行校准 2. 调整测试参数 3. 更新校准系数 4. 记录校准结果',
            author: '赵工',
            createTime: '2024-10-08',
            referenceCount: 15
        },
        {
            id: 'KB004',
            title: 'PLC程序异常重启',
            faultType: 'software',
            symptom: 'PLC程序运行中突然停止或重启',
            solution: '1. 检查电源稳定性 2. 备份并重新下载程序 3. 检查程序逻辑错误 4. 更新PLC固件版本',
            author: '孙工',
            createTime: '2024-09-12',
            referenceCount: 6
        }
    ];
}
