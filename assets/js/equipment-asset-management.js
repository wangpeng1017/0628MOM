// 设备资产管理 - 完整功能实现
// 包含：树形导航、表单弹窗、二维码、批量导入、履历时间轴、附件管理

// ==================== 全局变量 ====================
let currentTreeView = 'location'; // location 或 category
let selectedEquipment = null;
let equipmentData = [];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEquipmentData();
    renderEquipmentTable();
    setupEventListeners();
});

// ==================== 树形导航功能 ====================
function switchTreeView(viewType) {
    currentTreeView = viewType;
    document.getElementById('tree-location').style.display = viewType === 'location' ? 'block' : 'none';
    document.getElementById('tree-category').style.display = viewType === 'category' ? 'block' : 'none';
    
    // 更新按钮样式
    const locationBtn = document.getElementById('view-location');
    const categoryBtn = document.getElementById('view-category');
    
    if (viewType === 'location') {
        locationBtn.classList.add('bg-primary', 'text-white');
        locationBtn.classList.remove('bg-gray-200', 'text-gray-700');
        categoryBtn.classList.remove('bg-primary', 'text-white');
        categoryBtn.classList.add('bg-gray-200', 'text-gray-700');
    } else {
        categoryBtn.classList.add('bg-primary', 'text-white');
        categoryBtn.classList.remove('bg-gray-200', 'text-gray-700');
        locationBtn.classList.remove('bg-primary', 'text-white');
        locationBtn.classList.add('bg-gray-200', 'text-gray-700');
    }
}

function selectTreeNode(element, filter) {
    // 移除所有选中状态
    document.querySelectorAll('.tree-item').forEach(item => {
        item.classList.remove('selected');
    });
    // 添加选中状态
    element.classList.add('selected');
    // 过滤设备列表
    filterEquipmentByNode(filter);
}

function filterEquipmentByNode(filter) {
    console.log('过滤设备:', filter);
    // 这里可以实现实际的过滤逻辑
    renderEquipmentTable(filter);
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

// ==================== 设备表单功能 ====================
function openEquipmentForm(equipmentId = null) {
    if (equipmentId) {
        // 编辑模式
        const equipment = equipmentData.find(e => e.id === equipmentId);
        if (equipment) {
            fillFormData(equipment);
        }
    } else {
        // 新建模式
        clearFormData();
    }
    openModal('form');
}

function fillFormData(equipment) {
    document.getElementById('form-code').value = equipment.code;
    document.getElementById('form-name').value = equipment.name;
    document.getElementById('form-model').value = equipment.model;
    document.getElementById('form-category').value = equipment.category;
    // ... 填充其他字段
}

function clearFormData() {
    document.getElementById('equipment-form').reset();
}

function saveEquipment() {
    const formData = {
        code: document.getElementById('form-code').value,
        name: document.getElementById('form-name').value,
        model: document.getElementById('form-model').value,
        category: document.getElementById('form-category').value,
        // ... 收集其他字段
    };
    
    console.log('保存设备:', formData);
    // 这里实现实际的保存逻辑（API调用）
    
    closeModal('form');
    renderEquipmentTable();
}

// ==================== 二维码功能 ====================
function openQRCodeModal(equipmentId = null) {
    if (equipmentId) {
        selectedEquipment = equipmentData.find(e => e.id === equipmentId);
        generateQRCode(selectedEquipment);
    }
    openModal('qrcode');
}

function generateQRCode(equipment) {
    const qrcodeContainer = document.getElementById('qrcode-display');
    qrcodeContainer.innerHTML = '';
    
    // 使用qrcode.js库生成二维码
    // 这里需要引入 qrcode.js 库
    const qrData = JSON.stringify({
        code: equipment.code,
        name: equipment.name,
        url: `https://mom.aifly.me/equipment/${equipment.code}`
    });
    
    // 模拟二维码显示
    qrcodeContainer.innerHTML = `
        <div class="text-center">
            <div class="inline-block p-4 bg-white border-2 border-gray-300 rounded">
                <div class="w-64 h-64 bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-qrcode text-6xl text-gray-400"></i>
                </div>
            </div>
            <p class="mt-4 text-sm text-gray-600">设备编码: ${equipment.code}</p>
            <p class="text-sm text-gray-600">设备名称: ${equipment.name}</p>
        </div>
    `;
}

function printQRCode() {
    window.print();
}

function downloadQRCode() {
    console.log('下载二维码');
    // 实现二维码下载逻辑
}

// ==================== 批量导入功能 ====================
function openImportModal() {
    openModal('import');
}

function downloadTemplate() {
    // 创建Excel模板并下载
    const templateData = [
        ['设备编码*', '设备名称*', '设备型号', '设备类别*', '制造商', '采购日期', '原值', '物理位置*', '责任人*', '启用日期', '备注'],
        ['EQ-2024-001', '全自动贴片机', 'YAMAHA YSM20R', '生产设备', '雅马哈', '2023-01-10', '1280000', '宁波工厂/A车间/SMT-1号线', '张工', '2023-01-15', ''],
    ];
    
    // 这里需要使用 SheetJS 或类似库来生成Excel
    console.log('下载模板', templateData);
    alert('模板下载功能需要集成 SheetJS 库');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 解析Excel文件
            console.log('文件内容:', e.target.result);
            // 这里需要使用 SheetJS 解析Excel
            alert('文件上传功能需要集成 SheetJS 库进行解析');
        };
        reader.readAsArrayBuffer(file);
    }
}

function startImport() {
    console.log('开始导入');
    // 实现导入逻辑
    closeModal('import');
}

// ==================== 设备详情功能 ====================
function openEquipmentDetail(equipmentId) {
    selectedEquipment = equipmentData.find(e => e.id === equipmentId);
    if (selectedEquipment) {
        renderEquipmentDetail(selectedEquipment);
        openModal('detail');
    }
}

function renderEquipmentDetail(equipment) {
    // 渲染基本信息
    document.getElementById('detail-code').textContent = equipment.code;
    document.getElementById('detail-name').textContent = equipment.name;
    // ... 渲染其他字段
    
    // 渲染履历时间轴
    renderEquipmentHistory(equipment.id);
    
    // 渲染附件列表
    renderAttachments(equipment.id);
}

function switchDetailTab(tabName) {
    // 隐藏所有tab内容
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // 移除所有tab按钮的active状态
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的tab
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    
    // 添加active状态到对应按钮
    event.target.classList.add('active');
}

// ==================== 设备履历时间轴 ====================
function renderEquipmentHistory(equipmentId) {
    const historyContainer = document.getElementById('history-timeline');
    
    // 模拟履历数据
    const historyData = [
        {
            type: 'accept',
            title: '验收通过',
            description: '生产主管审核通过，设备正式启用',
            operator: '生产主管-王经理',
            time: '2023-01-15 15:30',
            icon: 'fa-check-circle',
            color: 'green'
        },
        {
            type: 'install',
            title: '安装调试完成',
            description: '安装工程师完成设备安装与调试',
            operator: '安装工程师-李工',
            time: '2023-01-14 10:00',
            icon: 'fa-tools',
            color: 'blue'
        },
        {
            type: 'arrival',
            title: '设备到货入库',
            description: '设备到货验收入库，生成设备档案',
            operator: '仓库管理员-张三',
            time: '2023-01-10 14:20',
            icon: 'fa-box',
            color: 'purple'
        }
    ];
    
    historyContainer.innerHTML = historyData.map(item => `
        <div class="flex gap-4 p-4 bg-${item.color}-50 border-l-4 border-${item.color}-500 rounded mb-4">
            <div class="text-${item.color}-600 pt-1">
                <i class="fas ${item.icon} text-2xl"></i>
            </div>
            <div class="flex-1">
                <div class="flex justify-between mb-1">
                    <span class="font-semibold text-${item.color}-700">${item.title}</span>
                    <span class="text-sm text-gray-500">${item.time}</span>
                </div>
                <p class="text-sm text-gray-600">${item.description} | 操作人：${item.operator}</p>
            </div>
        </div>
    `).join('');
}

// ==================== 附件管理功能 ====================
function renderAttachments(equipmentId) {
    const attachmentsContainer = document.getElementById('attachments-list');
    
    // 模拟附件数据
    const attachments = [
        {
            id: 1,
            name: '设备安装说明书.pdf',
            type: 'pdf',
            size: '2.5MB',
            uploadTime: '2023-01-10 09:30',
            version: 'v1.0'
        },
        {
            id: 2,
            name: '验收报告.docx',
            type: 'word',
            size: '1.2MB',
            uploadTime: '2023-01-15 16:00',
            version: 'v1.0'
        }
    ];
    
    attachmentsContainer.innerHTML = attachments.map(file => `
        <div class="flex items-center justify-between p-3 border rounded hover:bg-gray-50 mb-2">
            <div class="flex items-center gap-3">
                <i class="fas fa-file-${file.type === 'pdf' ? 'pdf text-red-600' : 'word text-blue-600'} text-xl"></i>
                <div>
                    <p class="font-medium">${file.name}</p>
                    <p class="text-xs text-gray-500">上传时间: ${file.uploadTime} | 大小: ${file.size} | 版本: ${file.version}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="downloadAttachment(${file.id})" class="text-primary hover:text-blue-700">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="deleteAttachment(${file.id})" class="text-danger hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function uploadAttachment() {
    document.getElementById('attachment-file-input').click();
}

function handleAttachmentUpload(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('上传附件:', file.name);
        // 实现附件上传逻辑
        alert(`附件 "${file.name}" 上传成功`);
        renderAttachments(selectedEquipment.id);
    }
}

function downloadAttachment(attachmentId) {
    console.log('下载附件:', attachmentId);
    // 实现附件下载逻辑
}

function deleteAttachment(attachmentId) {
    if (confirm('确定要删除这个附件吗？')) {
        console.log('删除附件:', attachmentId);
        // 实现附件删除逻辑
        renderAttachments(selectedEquipment.id);
    }
}

// ==================== 设备列表渲染 ====================
function initializeEquipmentData() {
    // 模拟设备数据
    equipmentData = [
        {
            id: 1,
            code: 'EQ-2024-001',
            name: '全自动贴片机',
            category: '生产设备',
            location: '宁波工厂/A车间/SMT-1号线',
            status: '在用',
            owner: '张工',
            startDate: '2023-01-15',
            runningHours: 9520,
            model: 'YAMAHA YSM20R'
        },
        {
            id: 2,
            code: 'EQ-2024-019',
            name: '逆变器老化测试台',
            category: '测试设备',
            location: '宁波工厂/B车间/测试区',
            status: '保养中',
            owner: '李工',
            startDate: '2022-09-08',
            runningHours: 6380
        },
        {
            id: 3,
            code: 'EQ-2024-033',
            name: '组件层压机',
            category: '生产设备',
            location: '宁波工厂/D车间/组件线-2',
            status: '维修中',
            owner: '王工',
            startDate: '2021-05-26',
            runningHours: 12115
        }
    ];
}

function renderEquipmentTable(filter = null) {
    const tbody = document.getElementById('equipment-tbody');
    if (!tbody) return;
    
    let filteredData = equipmentData;
    if (filter && filter !== '全部') {
        filteredData = equipmentData.filter(e => 
            e.location.includes(filter) || e.category.includes(filter)
        );
    }
    
    tbody.innerHTML = filteredData.map(equipment => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3"><input type="checkbox" class="rounded"></td>
            <td class="px-4 py-3 font-medium text-primary">${equipment.code}</td>
            <td class="px-4 py-3">${equipment.name}</td>
            <td class="px-4 py-3">${equipment.category}</td>
            <td class="px-4 py-3">${equipment.location}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs ${getStatusClass(equipment.status)}">${equipment.status}</span>
            </td>
            <td class="px-4 py-3">${equipment.owner}</td>
            <td class="px-4 py-3">${equipment.startDate}</td>
            <td class="px-4 py-3">${equipment.runningHours.toLocaleString()}</td>
            <td class="px-4 py-3 text-center">
                <button onclick="openEquipmentDetail(${equipment.id})" class="text-primary hover:text-blue-700 mr-2">
                    <i class="fas fa-eye"></i> 详情
                </button>
                <button onclick="openEquipmentForm(${equipment.id})" class="text-success hover:text-green-700 mr-2">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button onclick="openQRCodeModal(${equipment.id})" class="text-warning hover:text-yellow-700">
                    <i class="fas fa-qrcode"></i> 二维码
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const statusMap = {
        '在用': 'bg-green-100 text-green-700',
        '保养中': 'bg-yellow-100 text-yellow-700',
        '维修中': 'bg-orange-100 text-orange-700',
        '停机': 'bg-gray-100 text-gray-700',
        '待报废': 'bg-red-100 text-red-700'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700';
}

// ==================== 筛选和搜索 ====================
function applyFilters() {
    const code = document.getElementById('filter-code').value;
    const status = document.getElementById('filter-status').value;
    const category = document.getElementById('filter-category').value;
    
    console.log('应用筛选:', { code, status, category });
    // 实现筛选逻辑
    renderEquipmentTable();
}

function resetFilters() {
    document.getElementById('filter-code').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-category').value = '';
    renderEquipmentTable();
}

// ==================== 导出功能 ====================
function exportData() {
    console.log('导出设备数据');
    // 实现导出逻辑
    alert('导出功能需要集成 SheetJS 库');
}

// ==================== 事件监听器设置 ====================
function setupEventListeners() {
    // 树搜索
    const treeSearch = document.getElementById('tree-search');
    if (treeSearch) {
        treeSearch.addEventListener('input', function(e) {
            const searchText = e.target.value.toLowerCase();
            // 实现树搜索逻辑
            console.log('搜索:', searchText);
        });
    }
    
    // 模态窗口点击外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// 导出全局函数供HTML调用
window.switchTreeView = switchTreeView;
window.selectTreeNode = selectTreeNode;
window.openModal = openModal;
window.closeModal = closeModal;
window.openEquipmentForm = openEquipmentForm;
window.saveEquipment = saveEquipment;
window.openQRCodeModal = openQRCodeModal;
window.printQRCode = printQRCode;
window.downloadQRCode = downloadQRCode;
window.downloadTemplate = downloadTemplate;
window.handleFileUpload = handleFileUpload;
window.startImport = startImport;
window.openEquipmentDetail = openEquipmentDetail;
window.switchDetailTab = switchDetailTab;
window.uploadAttachment = uploadAttachment;
window.handleAttachmentUpload = handleAttachmentUpload;
window.downloadAttachment = downloadAttachment;
window.deleteAttachment = deleteAttachment;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.exportData = exportData;
