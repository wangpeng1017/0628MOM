// 备品备件管理模块 - JavaScript
let currentView = 'inventory';
let spareParts = [];
let transactions = [];
let alerts = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取视图类型
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['inventory', 'transactions', 'alerts', 'analysis'].includes(viewParam)) {
        currentView = viewParam;
    }
    
    initializeData();
    
    // 初始化视图显示状态
    initializeViewDisplay();
    
    renderView();
    updateStatistics();
});

// 初始化视图显示状态
function initializeViewDisplay() {
    // 隐藏所有视图
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    
    // 显示当前视图
    const currentViewElement = document.getElementById(`${currentView}-view`);
    if (currentViewElement) {
        currentViewElement.classList.remove('hidden');
    }
    
    // 更新页面标题
    const titles = {
        'inventory': '备件台账',
        'transactions': '出入库管理',
        'alerts': '库存预警',
        'analysis': '备件分析'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[currentView] || '备件管理';
    }
}

// 初始化样例数据
function initializeData() {
    // 备件台账数据
    spareParts = [
        {
            id: 'SP-001',
            code: 'SENSOR-TEMP-001',
            name: '温度传感器',
            specification: 'PT100 0-200°C',
            category: '传感器',
            currentStock: 5,
            safetyStock: 10,
            minStock: 5,
            maxStock: 30,
            unitPrice: 280.00,
            location: 'A区-01货架-03层',
            supplier: '正泰电气',
            relatedEquipment: ['冲床CP-101', '冲床CP-102'],
            lastInboundDate: '2024-06-15',
            lastOutboundDate: '2024-06-25',
            status: 'low',
            createTime: '2024-01-10'
        },
        {
            id: 'SP-002',
            code: 'FILTER-HYD-002',
            name: '液压油滤芯',
            specification: 'HX-160×20',
            category: '液压',
            currentStock: 20,
            safetyStock: 15,
            minStock: 10,
            maxStock: 40,
            unitPrice: 156.00,
            location: 'B区-05货架-02层',
            supplier: '贺德克液压',
            relatedEquipment: ['冲床CP-103', '冲床CP-104', '冲床CP-105'],
            lastInboundDate: '2024-06-20',
            lastOutboundDate: '2024-06-26',
            status: 'normal',
            createTime: '2024-01-10'
        },
        {
            id: 'SP-003',
            code: 'MOTOR-SRV-003',
            name: '伺服电机',
            specification: 'SGMJV-08ADA6S 750W',
            category: '电气',
            currentStock: 2,
            safetyStock: 5,
            minStock: 3,
            maxStock: 10,
            unitPrice: 3200.00,
            location: 'C区-10货架-01层',
            supplier: '安川电机',
            relatedEquipment: ['装配机ASM-201', '装配机ASM-202'],
            lastInboundDate: '2024-06-10',
            lastOutboundDate: '2024-06-28',
            status: 'critical',
            createTime: '2024-01-10'
        },
        {
            id: 'SP-004',
            code: 'BEARING-SKF-004',
            name: '深沟球轴承',
            specification: 'SKF 6205-2RS1',
            category: '机械',
            currentStock: 45,
            safetyStock: 20,
            minStock: 15,
            maxStock: 50,
            unitPrice: 85.00,
            location: 'A区-03货架-04层',
            supplier: 'SKF轴承',
            relatedEquipment: ['传送带CONV-201'],
            lastInboundDate: '2024-06-22',
            lastOutboundDate: '2024-06-24',
            status: 'normal',
            createTime: '2024-01-10'
        },
        {
            id: 'SP-005',
            code: 'VALVE-PNU-005',
            name: '电磁阀',
            specification: '4V210-08 DC24V',
            category: '气动',
            currentStock: 8,
            safetyStock: 12,
            minStock: 8,
            maxStock: 25,
            unitPrice: 165.00,
            location: 'B区-07货架-03层',
            supplier: '亚德客气动',
            relatedEquipment: ['装配机ASM-201', '装配机ASM-202'],
            lastInboundDate: '2024-06-18',
            lastOutboundDate: '2024-06-27',
            status: 'low',
            createTime: '2024-01-10'
        }
    ];

    // 出入库记录数据
    transactions = [
        {
            id: 'TXN-001',
            code: 'IN-2024-001',
            type: 'inbound',
            typeText: '采购入库',
            sparePartId: 'SP-002',
            sparePartName: '液压油滤芯',
            quantity: 10,
            unitPrice: 156.00,
            totalAmount: 1560.00,
            operator: '张仓管',
            relatedWorkOrder: null,
            fromLocation: '供应商',
            toLocation: 'B区-05货架-02层',
            remark: '定期采购补货',
            createTime: '2024-06-20 09:30:00'
        },
        {
            id: 'TXN-002',
            code: 'OUT-2024-002',
            type: 'outbound',
            typeText: '领用出库',
            sparePartId: 'SP-001',
            sparePartName: '温度传感器',
            quantity: 1,
            unitPrice: 280.00,
            totalAmount: 280.00,
            operator: '李维修',
            relatedWorkOrder: 'WO-2024-056',
            fromLocation: 'A区-01货架-03层',
            toLocation: '冲床CP-101',
            remark: '维修更换',
            createTime: '2024-06-25 14:20:00'
        },
        {
            id: 'TXN-003',
            code: 'OUT-2024-003',
            type: 'outbound',
            typeText: '领用出库',
            sparePartId: 'SP-002',
            sparePartName: '液压油滤芯',
            quantity: 2,
            unitPrice: 156.00,
            totalAmount: 312.00,
            operator: '王维修',
            relatedWorkOrder: 'WO-2024-058',
            fromLocation: 'B区-05货架-02层',
            toLocation: '冲床CP-103',
            remark: '保养更换',
            createTime: '2024-06-26 10:15:00'
        },
        {
            id: 'TXN-004',
            code: 'OUT-2024-004',
            type: 'outbound',
            typeText: '领用出库',
            sparePartId: 'SP-003',
            sparePartName: '伺服电机',
            quantity: 1,
            unitPrice: 3200.00,
            totalAmount: 3200.00,
            operator: '赵维修',
            relatedWorkOrder: 'WO-2024-060',
            fromLocation: 'C区-10货架-01层',
            toLocation: '装配机ASM-201',
            remark: '故障更换',
            createTime: '2024-06-28 11:45:00'
        },
        {
            id: 'TXN-005',
            code: 'IN-2024-005',
            type: 'inbound',
            typeText: '采购入库',
            sparePartId: 'SP-004',
            sparePartName: '深沟球轴承',
            quantity: 20,
            unitPrice: 85.00,
            totalAmount: 1700.00,
            operator: '张仓管',
            relatedWorkOrder: null,
            fromLocation: '供应商',
            toLocation: 'A区-03货架-04层',
            remark: '定期采购补货',
            createTime: '2024-06-22 15:00:00'
        }
    ];

    // 库存预警数据
    alerts = spareParts.filter(part => part.status === 'low' || part.status === 'critical').map(part => ({
        id: part.id,
        sparePartId: part.id,
        sparePartCode: part.code,
        sparePartName: part.name,
        currentStock: part.currentStock,
        safetyStock: part.safetyStock,
        alertLevel: part.status === 'critical' ? 'critical' : 'warning',
        alertLevelText: part.status === 'critical' ? '严重不足' : '库存不足',
        suggestedQuantity: part.safetyStock - part.currentStock + 5,
        status: 'pending',
        createTime: new Date().toISOString().split('T')[0] + ' 08:00:00'
    }));

    filteredData = getCurrentViewData();
}

function getCurrentViewData() {
    switch(currentView) {
        case 'inventory': return spareParts;
        case 'transactions': return transactions;
        case 'alerts': return alerts;
        case 'analysis': return spareParts;
        default: return [];
    }
}

function switchView(viewType) {
    currentView = viewType;
    
    // 更新页面标题
    const titles = {
        'inventory': '备件台账',
        'transactions': '出入库管理',
        'alerts': '库存预警',
        'analysis': '备件分析'
    };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = titles[viewType] || '备件管理';
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
        case 'inventory': renderInventoryView(); break;
        case 'transactions': renderTransactionsView(); break;
        case 'alerts': renderAlertsView(); break;
        case 'analysis': renderAnalysisView(); break;
    }
}

function renderInventoryView() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(part => `
        <tr class="hover:bg-gray-50 ${part.status === 'critical' ? 'bg-red-50' : part.status === 'low' ? 'bg-yellow-50' : ''}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${part.code}</div>
                <div class="text-sm text-gray-500">${part.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${part.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${part.specification}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge bg-blue-100 text-blue-700">${part.category}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${part.currentStock < part.safetyStock ? 'text-red-600 font-semibold' : 'text-gray-900'}">${part.currentStock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${part.safetyStock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥${part.unitPrice.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${part.location}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStockStatusBadge(part.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewPartDetail('${part.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editPart('${part.id}')" class="text-green-600 hover:text-green-800 mr-3" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePart('${part.id}')" class="text-red-600 hover:text-red-800" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderTransactionsView() {
    const tbody = document.getElementById('transactions-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(txn => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${txn.code}</div>
                <div class="text-sm text-gray-500">${txn.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge ${txn.type === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                    <i class="fas fa-arrow-${txn.type === 'inbound' ? 'down' : 'up'}"></i> ${txn.typeText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.sparePartName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥${txn.totalAmount.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.operator}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.relatedWorkOrder || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${txn.createTime.split(' ')[0]}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewTransactionDetail('${txn.id}')" class="text-blue-600 hover:text-blue-800" title="查看详情">
                    <i class="fas fa-eye"></i>
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
                    <h4 class="font-semibold text-gray-800 mb-1">${alert.sparePartName}</h4>
                    <p class="text-sm text-gray-600">${alert.sparePartCode}</p>
                </div>
                <span class="badge ${alert.alertLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                    <i class="fas fa-exclamation-triangle"></i> ${alert.alertLevelText}
                </span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p class="text-sm text-gray-600">当前库存</p>
                    <p class="text-2xl font-bold ${alert.alertLevel === 'critical' ? 'text-red-600' : 'text-yellow-600'}">${alert.currentStock}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">安全库存</p>
                    <p class="text-2xl font-bold text-gray-700">${alert.safetyStock}</p>
                </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-sm text-gray-600">建议补货：<span class="font-semibold text-purple-600">${alert.suggestedQuantity}个</span></span>
                <button onclick="createPurchaseRequest('${alert.sparePartId}')" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
                    <i class="fas fa-shopping-cart mr-1"></i>生成采购申请
                </button>
            </div>
        </div>
    `).join('');
}

function renderAnalysisView() {
    const abcAnalysis = document.getElementById('abc-analysis');
    const stagnantAnalysis = document.getElementById('stagnant-analysis');
    
    if (abcAnalysis) {
        const totalValue = spareParts.reduce((sum, part) => sum + (part.currentStock * part.unitPrice), 0);
        const sortedParts = [...spareParts].sort((a, b) => (b.currentStock * b.unitPrice) - (a.currentStock * a.unitPrice));
        
        let accumulatedValue = 0;
        const abcCategories = { A: [], B: [], C: [] };
        
        sortedParts.forEach(part => {
            const partValue = part.currentStock * part.unitPrice;
            accumulatedValue += partValue;
            const percentage = (accumulatedValue / totalValue) * 100;
            
            if (percentage <= 70) abcCategories.A.push(part);
            else if (percentage <= 90) abcCategories.B.push(part);
            else abcCategories.C.push(part);
        });
        
        abcAnalysis.innerHTML = `
            <div class="space-y-4">
                <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-red-700">A类备件（重点管理）</h5>
                        <span class="badge bg-red-100 text-red-700">${abcCategories.A.length}种</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">占库存价值约70%，需重点监控</p>
                    <div class="text-xs text-gray-500">${abcCategories.A.slice(0, 3).map(p => p.name).join('、')}</div>
                </div>
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-yellow-700">B类备件（一般管理）</h5>
                        <span class="badge bg-yellow-100 text-yellow-700">${abcCategories.B.length}种</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">占库存价值约20%，定期检查</p>
                    <div class="text-xs text-gray-500">${abcCategories.B.slice(0, 2).map(p => p.name).join('、')}</div>
                </div>
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-green-700">C类备件（简化管理）</h5>
                        <span class="badge bg-green-100 text-green-700">${abcCategories.C.length}种</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">占库存价值约10%，简化管理</p>
                    <div class="text-xs text-gray-500">${abcCategories.C.slice(0, 2).map(p => p.name).join('、')}</div>
                </div>
            </div>
        `;
    }
    
    if (stagnantAnalysis) {
        const today = new Date();
        const stagnantParts = spareParts.filter(part => {
            const lastOutbound = new Date(part.lastOutboundDate);
            const daysSinceLastUse = Math.floor((today - lastOutbound) / (1000 * 60 * 60 * 24));
            return daysSinceLastUse > 90;
        });
        
        stagnantAnalysis.innerHTML = `
            <div class="space-y-4">
                <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-gray-700">呆滞料统计</h5>
                        <span class="badge bg-gray-100 text-gray-700">${stagnantParts.length}种</span>
                    </div>
                    <p class="text-sm text-gray-600">超过90天未使用的备件</p>
                </div>
                ${stagnantParts.length > 0 ? stagnantParts.map(part => {
                    const lastOutbound = new Date(part.lastOutboundDate);
                    const daysSinceLastUse = Math.floor((today - lastOutbound) / (1000 * 60 * 60 * 24));
                    const stagnantValue = part.currentStock * part.unitPrice;
                    
                    return `
                        <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <h5 class="font-semibold text-orange-700">${part.name}</h5>
                                <span class="text-xs text-orange-600">${daysSinceLastUse}天未使用</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-sm">
                                <div><span class="text-gray-600">库存数量：</span><span class="font-semibold">${part.currentStock}</span></div>
                                <div><span class="text-gray-600">占用资金：</span><span class="font-semibold">¥${stagnantValue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    `;
                }).join('') : '<p class="text-sm text-gray-600 text-center py-4">暂无呆滞料</p>'}
            </div>
        `;
    }
}

function getStockStatusBadge(status) {
    const statusConfig = {
        'normal': { class: 'bg-green-100 text-green-700', icon: 'check-circle', text: '正常' },
        'low': { class: 'bg-yellow-100 text-yellow-700', icon: 'exclamation-circle', text: '库存不足' },
        'critical': { class: 'bg-red-100 text-red-700', icon: 'exclamation-triangle', text: '严重不足' },
        'excess': { class: 'bg-blue-100 text-blue-700', icon: 'info-circle', text: '库存过剩' }
    };
    const config = statusConfig[status] || statusConfig['normal'];
    return `<span class="status-chip ${config.class}"><i class="fas fa-${config.icon}"></i> ${config.text}</span>`;
}

function updateStatistics() {
    const totalParts = spareParts.length;
    const totalValue = spareParts.reduce((sum, part) => sum + (part.currentStock * part.unitPrice), 0);
    const alertCount = spareParts.filter(part => part.status === 'low' || part.status === 'critical').length;
    const monthlyUsage = transactions.filter(t => t.type === 'outbound').reduce((sum, t) => sum + t.totalAmount, 0);
    
    document.getElementById('metric-total-parts').textContent = totalParts;
    document.getElementById('metric-total-value').textContent = `¥${(totalValue / 1000000).toFixed(1)}M`;
    document.getElementById('metric-alerts').textContent = alertCount;
    document.getElementById('metric-monthly-usage').textContent = `¥${(monthlyUsage / 1000).toFixed(0)}K`;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    let data = getCurrentViewData();
    
    if (searchTerm) {
        data = data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    }
    
    if (categoryFilter && currentView === 'inventory') {
        data = data.filter(item => item.category === categoryFilter);
    }
    
    if (statusFilter && currentView === 'inventory') {
        data = data.filter(item => item.status === statusFilter);
    }
    
    filteredData = data;
    renderView();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    filteredData = getCurrentViewData();
    renderView();
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function openSparePartModal() {
    openModal('spare-part-modal');
}

function openInboundModal() {
    const select = document.getElementById('inbound-part');
    if (select) {
        select.innerHTML = '<option value="">请选择备件</option>' + 
            spareParts.map(part => `<option value="${part.id}">${part.name} (${part.code})</option>`).join('');
    }
    openModal('inbound-modal');
}

function openOutboundModal() {
    const select = document.getElementById('outbound-part');
    if (select) {
        select.innerHTML = '<option value="">请选择备件</option>' + 
            spareParts.map(part => `<option value="${part.id}">${part.name} (${part.code}) - 库存:${part.currentStock}</option>`).join('');
    }
    openModal('outbound-modal');
}

function saveSparePart() {
    const code = document.getElementById('part-code').value;
    const name = document.getElementById('part-name').value;
    if (!code || !name) { alert('请填写必填项'); return; }
    alert('备件保存成功！');
    closeModal('spare-part-modal');
}

function saveInbound() {
    const partId = document.getElementById('inbound-part').value;
    const quantity = document.getElementById('inbound-quantity').value;
    if (!partId || !quantity) { alert('请填写必填项'); return; }
    alert('入库成功！');
    closeModal('inbound-modal');
}

function saveOutbound() {
    const partId = document.getElementById('outbound-part').value;
    const quantity = document.getElementById('outbound-quantity').value;
    const receiver = document.getElementById('outbound-receiver').value;
    if (!partId || !quantity || !receiver) { alert('请填写必填项'); return; }
    alert('出库成功！');
    closeModal('outbound-modal');
}

function viewPartDetail(id) {
    const part = spareParts.find(p => p.id === id);
    if (!part) return;
    alert(`备件详情：\n名称：${part.name}\n编码：${part.code}\n库存：${part.currentStock}\n安全库存：${part.safetyStock}`);
}

function editPart(id) { alert(`编辑备件：${id}`); }
function deletePart(id) { if (confirm('确定要删除这个备件吗？')) alert(`备件 ${id} 已删除`); }
function viewTransactionDetail(id) {
    const txn = transactions.find(t => t.id === id);
    if (!txn) return;
    alert(`出入库详情：\n单据：${txn.code}\n类型：${txn.typeText}\n备件：${txn.sparePartName}\n数量：${txn.quantity}`);
}
function createPurchaseRequest(partId) { alert(`生成采购申请：${partId}`); }
function exportData() { alert('导出数据功能'); }
