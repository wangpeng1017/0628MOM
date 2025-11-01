// 闲置设备管理模块 - JavaScript
let idleEquipments = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    renderTable();
    updateStatistics();
});

// 初始化样例数据
function initializeData() {
    idleEquipments = [
        {
            id: 'IDLE-001',
            code: 'WLD-301',
            name: '半自动焊接机',
            category: '焊接',
            location: '焊接车间C区',
            reason: '产线升级',
            idleDays: 45,
            value: 180000,
            status: 'idle',
            condition: '设备功能完好，定期保养',
            registerDate: '2024-09-15'
        },
        {
            id: 'IDLE-002',
            code: 'CP-105',
            name: '液压冲床',
            category: '冲压',
            location: '冲压车间A区',
            reason: '产品停产',
            idleDays: 120,
            value: 350000,
            status: 'evaluating',
            condition: '液压系统需检修',
            registerDate: '2024-07-01'
        },
        {
            id: 'IDLE-003',
            code: 'ASM-208',
            name: '自动装配线',
            category: '装配',
            location: '装配车间B区',
            reason: '设备更新',
            idleDays: 30,
            value: 520000,
            status: 'transferring',
            condition: '状态良好，可直接使用',
            registerDate: '2024-10-01'
        },
        {
            id: 'IDLE-004',
            code: 'TEST-305',
            name: '电气测试台',
            category: '测试',
            location: '测试中心D区',
            reason: '产能过剩',
            idleDays: 60,
            value: 95000,
            status: 'idle',
            condition: '功能正常',
            registerDate: '2024-09-01'
        },
        {
            id: 'IDLE-005',
            code: 'CNC-402',
            name: 'CNC数控车床',
            category: '加工',
            location: '加工车间E区',
            reason: '产线升级',
            idleDays: 90,
            value: 680000,
            status: 'sealed',
            condition: '已封存保养',
            registerDate: '2024-08-01'
        }
    ];
    
    filteredData = [...idleEquipments];
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('idle-equipment-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = filteredData.map(equipment => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${equipment.code}</div>
                <div class="text-sm text-gray-500">${equipment.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${equipment.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge bg-blue-100 text-blue-700">${equipment.category}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${equipment.location}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${equipment.reason}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${equipment.idleDays > 90 ? 'text-red-600 font-semibold' : 'text-gray-900'}">
                ${equipment.idleDays}天
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ¥${(equipment.value / 1000).toFixed(0)}K
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(equipment.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewDetail('${equipment.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="quickTransfer('${equipment.id}')" class="text-green-600 hover:text-green-800 mr-3" title="申请调拨">
                    <i class="fas fa-exchange-alt"></i>
                </button>
                <button onclick="quickEvaluate('${equipment.id}')" class="text-purple-600 hover:text-purple-800" title="发起评估">
                    <i class="fas fa-clipboard-check"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 获取状态徽章
function getStatusBadge(status) {
    const statusConfig = {
        'idle': { class: 'bg-amber-100 text-amber-700', icon: 'warehouse', text: '闲置中' },
        'evaluating': { class: 'bg-purple-100 text-purple-700', icon: 'clipboard-check', text: '评估中' },
        'transferring': { class: 'bg-blue-100 text-blue-700', icon: 'exchange-alt', text: '调拨中' },
        'sealed': { class: 'bg-gray-100 text-gray-700', icon: 'archive', text: '已封存' }
    };
    const config = statusConfig[status] || statusConfig['idle'];
    return `<span class="status-chip ${config.class}"><i class="fas fa-${config.icon}"></i> ${config.text}</span>`;
}

// 更新统计数据
function updateStatistics() {
    const idleCount = idleEquipments.filter(e => e.status === 'idle').length;
    const totalValue = idleEquipments.reduce((sum, e) => sum + e.value, 0);
    const transferCount = idleEquipments.filter(e => e.status === 'transferring').length;
    const pendingEval = idleEquipments.filter(e => e.status === 'evaluating').length;
    
    document.getElementById('metric-idle-count').textContent = idleCount;
    document.getElementById('metric-total-value').textContent = `¥${(totalValue / 1000000).toFixed(1)}M`;
    document.getElementById('metric-transfer-count').textContent = transferCount;
    document.getElementById('metric-pending-eval').textContent = pendingEval;
}

// 筛选功能
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const categoryFilter = document.getElementById('filter-category').value;
    const locationFilter = document.getElementById('filter-location').value;
    
    filteredData = idleEquipments.filter(equipment => {
        const matchSearch = !searchTerm || 
            equipment.code.toLowerCase().includes(searchTerm) ||
            equipment.name.toLowerCase().includes(searchTerm);
        const matchStatus = !statusFilter || equipment.status === statusFilter;
        const matchCategory = !categoryFilter || equipment.category === categoryFilter;
        const matchLocation = !locationFilter || equipment.location.includes(locationFilter);
        
        return matchSearch && matchStatus && matchCategory && matchLocation;
    });
    
    renderTable();
}

// 重置筛选
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-location').value = '';
    filteredData = [...idleEquipments];
    renderTable();
}

// 模态窗口控制
function openIdleModal() {
    document.getElementById('idle-modal').classList.add('show');
}

function openTransferModal() {
    // 填充设备选项
    const select = document.getElementById('transfer-equipment');
    select.innerHTML = '<option value="">请选择闲置设备</option>' +
        idleEquipments.filter(e => e.status === 'idle').map(e => 
            `<option value="${e.id}">${e.code} - ${e.name}</option>`
        ).join('');
    document.getElementById('transfer-modal').classList.add('show');
}

function openEvaluationModal() {
    // 填充设备选项
    const select = document.getElementById('eval-equipment');
    select.innerHTML = '<option value="">请选择闲置设备</option>' +
        idleEquipments.filter(e => e.status === 'idle').map(e => 
            `<option value="${e.id}">${e.code} - ${e.name}</option>`
        ).join('');
    document.getElementById('evaluation-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// 保存闲置设备
function saveIdleEquipment() {
    const code = document.getElementById('idle-equipment-code').value;
    const name = document.getElementById('idle-equipment-name').value;
    const category = document.getElementById('idle-category').value;
    const location = document.getElementById('idle-location').value;
    const reason = document.getElementById('idle-reason').value;
    
    if (!code || !name || !category || !location || !reason) {
        alert('请填写所有必填项');
        return;
    }
    
    const idleId = 'IDLE-' + (idleEquipments.length + 1).toString().padStart(3, '0');
    
    alert(`✅ 闲置设备登记成功！\n\n设备编号: ${idleId}\n设备名称: ${name}\n已进入闲置资源池`);
    
    document.getElementById('idle-form').reset();
    closeModal('idle-modal');
}

// 提交调拨申请
function submitTransferRequest() {
    const equipmentId = document.getElementById('transfer-equipment').value;
    const department = document.getElementById('transfer-department').value;
    const applicant = document.getElementById('transfer-applicant').value;
    const targetLocation = document.getElementById('transfer-target-location').value;
    const purpose = document.getElementById('transfer-purpose').value;
    
    if (!equipmentId || !department || !applicant || !targetLocation || !purpose) {
        alert('请填写所有必填项');
        return;
    }
    
    const equipment = idleEquipments.find(e => e.id === equipmentId);
    const transferId = 'TR-' + new Date().getFullYear() + 
                      ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                      ('0' + new Date().getDate()).slice(-2) + 
                      '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    alert(`✅ 调拨申请提交成功！\n\n申请编号: ${transferId}\n设备: ${equipment.name}\n申请部门: ${department}\n\n申请已发送给资产管理员审批`);
    
    document.getElementById('transfer-form').reset();
    closeModal('transfer-modal');
}

// 提交评估申请
function submitEvaluation() {
    const equipmentId = document.getElementById('eval-equipment').value;
    const evalType = document.getElementById('eval-type').value;
    const assessor = document.getElementById('eval-assessor').value;
    
    if (!equipmentId || !evalType || !assessor) {
        alert('请填写所有必填项');
        return;
    }
    
    const equipment = idleEquipments.find(e => e.id === equipmentId);
    const evalId = 'EVAL-' + new Date().getFullYear() + 
                   ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                   ('0' + new Date().getDate()).slice(-2) + 
                   '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    alert(`✅ 评估任务创建成功！\n\n评估编号: ${evalId}\n设备: ${equipment.name}\n评估类型: ${evalType}\n评估人: ${assessor}\n\n已发送通知给评估人员`);
    
    document.getElementById('evaluation-form').reset();
    closeModal('evaluation-modal');
}

// 快捷操作
function viewDetail(id) {
    const equipment = idleEquipments.find(e => e.id === id);
    alert(`设备详情\n\n编码: ${equipment.code}\n名称: ${equipment.name}\n类别: ${equipment.category}\n位置: ${equipment.location}\n闲置原因: ${equipment.reason}\n闲置时长: ${equipment.idleDays}天\n资产价值: ¥${equipment.value.toLocaleString()}\n状态: ${equipment.status}\n设备状况: ${equipment.condition}`);
}

function quickTransfer(id) {
    const equipment = idleEquipments.find(e => e.id === id);
    document.getElementById('transfer-equipment').value = id;
    openTransferModal();
}

function quickEvaluate(id) {
    const equipment = idleEquipments.find(e => e.id === id);
    document.getElementById('eval-equipment').value = id;
    openEvaluationModal();
}

// 导出数据
function exportData() {
    alert('导出闲置设备数据...');
}
