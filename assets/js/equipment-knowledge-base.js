// 知识库管理模块 - JavaScript
let currentView = 'cases';
let knowledgeItems = [];
let sopDocuments = [];
let expertKnowledge = [];
let filteredData = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取视图类型
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['cases', 'sop', 'fta', 'expert'].includes(viewParam)) {
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
    // 更新按钮样式
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`view-${currentView}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-gray-700');
        activeBtn.classList.add('bg-primary', 'text-white');
    }
    
    // 隐藏所有视图
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    
    // 显示当前视图
    const currentViewElement = document.getElementById(`${currentView}-view`);
    if (currentViewElement) {
        currentViewElement.classList.remove('hidden');
    }
}

// 初始化样例数据
function initializeData() {
    // 维修案例数据
    knowledgeItems = [
        {
            id: 'KB-001',
            type: 'case',
            category: '电气',
            title: '伺服电机定位不准问题排查与解决',
            keywords: ['伺服电机', '定位', '编码器', '干扰'],
            summary: '针对XX品牌伺服电机编码器干扰导致定位不准的问题，详细描述排查步骤和解决方案',
            content: '故障现象：伺服电机运行时出现定位不准，重复定位精度下降。\n\n排查步骤：\n1. 检查参数设置是否正确\n2. 检查机械连接是否松动\n3. 重点排查编码器信号线是否受变频器干扰\n\n解决方案：\n发现编码器屏蔽线接地不规范，重新处理接地后问题解决。建议使用双绞屏蔽线缆。',
            equipment: '装配机ASM-201',
            author: '李工',
            createTime: '2024-10-15 14:30:00',
            updateTime: '2024-10-20 09:15:00',
            views: 156,
            rating: 5.0,
            ratingCount: 12,
            status: 'published',
            attachments: ['编码器接线图.jpg', '解决方案视频.mp4']
        },
        {
            id: 'KB-002',
            type: 'case',
            category: '机械',
            title: '冲床液压系统漏油故障维修案例',
            keywords: ['冲床', '液压', '漏油', '密封件'],
            summary: '冲床液压管接头渗油问题的诊断与维修过程记录',
            content: '故障现象：CP-105号冲床安全光幕前地面发现油渍。\n\n诊断过程：\n1. 检查液压油箱液位，发现略有下降\n2. 检查各液压管路，发现主缸进油管接头处有渗油\n3. 拆检发现O型密封圈老化开裂\n\n维修措施：\n更换同规格O型密封圈，清洁接头螺纹，按规定力矩拧紧。维修后试机正常，无渗漏。',
            equipment: '冲床CP-105',
            author: '王维修',
            createTime: '2024-10-18 10:20:00',
            updateTime: '2024-10-18 10:20:00',
            views: 89,
            rating: 4.8,
            ratingCount: 8,
            status: 'published',
            attachments: ['漏油现场照片.jpg', '密封圈规格.pdf']
        },
        {
            id: 'KB-003',
            type: 'case',
            category: '控制',
            title: 'PLC通讯故障快速定位方法',
            keywords: ['PLC', '通讯', 'Profinet', '故障'],
            summary: 'PLC与触摸屏通讯中断故障的排查技巧和解决方法',
            content: '故障现象：触摸屏显示"通讯中断"，无法控制设备。\n\n快速定位方法：\n1. 检查网线连接是否松动\n2. 使用ping命令测试网络连通性\n3. 检查PLC的IP地址设置\n4. 检查交换机端口指示灯状态\n\n常见原因：\n- 网线接触不良（占60%）\n- IP地址冲突（占25%）\n- 交换机端口故障（占10%）\n- PLC模块故障（占5%）',
            equipment: '测试台TEST-401',
            author: '赵工',
            createTime: '2024-10-22 16:45:00',
            updateTime: '2024-10-22 16:45:00',
            views: 124,
            rating: 4.9,
            ratingCount: 10,
            status: 'published',
            attachments: ['网络拓扑图.png']
        }
    ];

    // SOP文档数据
    sopDocuments = [
        {
            id: 'SOP-001',
            code: 'SOP-EQ-CP-001',
            name: '冲床日常保养作业指导书',
            equipment: '冲床系列',
            version: 'v2.1',
            updateTime: '2024-09-15',
            status: 'active',
            author: '设备部',
            content: '1. 每日保养项目\n2. 每周保养项目\n3. 每月保养项目\n4. 安全注意事项'
        },
        {
            id: 'SOP-002',
            code: 'SOP-EQ-ASM-001',
            name: '装配机操作规程',
            equipment: '装配机系列',
            version: 'v1.5',
            updateTime: '2024-10-01',
            status: 'active',
            author: '设备部',
            content: '1. 开机前检查\n2. 操作步骤\n3. 关机程序\n4. 异常处理'
        },
        {
            id: 'SOP-003',
            code: 'SOP-EQ-WLD-001',
            name: '焊接机安全操作规程',
            equipment: '焊接机系列',
            version: 'v3.0',
            updateTime: '2024-10-10',
            status: 'active',
            author: '安全部',
            content: '1. 安全防护要求\n2. 操作前准备\n3. 焊接参数设置\n4. 应急处理'
        }
    ];

    // 专家知识数据
    expertKnowledge = [
        {
            id: 'EXP-001',
            category: '液压',
            title: '液压系统压力波动的深层原因分析',
            summary: '资深液压专家分享30年经验，深入分析液压系统压力波动的各种原因及解决思路',
            author: '张总工',
            authorTitle: '高级工程师',
            experience: '30年液压系统经验',
            createTime: '2024-10-05',
            views: 234,
            rating: 5.0,
            ratingCount: 18
        },
        {
            id: 'EXP-002',
            category: '电气',
            title: '变频器参数调试的独门技巧',
            summary: '变频器调试专家分享快速调试方法，大幅缩短调试时间',
            author: '李专家',
            authorTitle: '电气高级工程师',
            experience: '25年变频器应用经验',
            createTime: '2024-10-12',
            views: 189,
            rating: 4.9,
            ratingCount: 15
        }
    ];

    filteredData = getCurrentViewData();
}

function getCurrentViewData() {
    switch(currentView) {
        case 'cases': return knowledgeItems;
        case 'sop': return sopDocuments;
        case 'fta': return [];
        case 'expert': return expertKnowledge;
        default: return [];
    }
}

function switchView(viewType) {
    currentView = viewType;
    
    // 更新按钮样式
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`view-${viewType}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-gray-700');
        activeBtn.classList.add('bg-primary', 'text-white');
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
        case 'cases': renderCasesView(); break;
        case 'sop': renderSOPView(); break;
        case 'fta': break; // 故障树视图是交互式的
        case 'expert': renderExpertView(); break;
    }
}

function renderCasesView() {
    const container = document.getElementById('cases-container');
    if (!container) return;
    container.innerHTML = filteredData.map(item => `
        <div class="knowledge-card bg-white rounded-lg shadow-sm p-6 cursor-pointer" onclick="viewKnowledgeDetail('${item.id}')">
            <div class="flex items-start justify-between mb-3">
                <span class="badge bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-700">
                    ${item.category}
                </span>
                <div class="flex items-center gap-1">
                    ${renderStars(item.rating)}
                    <span class="text-xs text-gray-500 ml-1">(${item.ratingCount})</span>
                </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">${item.title}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">${item.summary}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${item.keywords.map(kw => `<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">#${kw}</span>`).join('')}
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span><i class="fas fa-user mr-1"></i>${item.author}</span>
                    <span><i class="fas fa-eye mr-1"></i>${item.views}</span>
                </div>
                <span class="text-xs text-gray-500">${item.createTime.split(' ')[0]}</span>
            </div>
        </div>
    `).join('');
}

function renderSOPView() {
    const tbody = document.getElementById('sop-tbody');
    if (!tbody) return;
    tbody.innerHTML = filteredData.map(sop => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${sop.code}</div>
                <div class="text-sm text-gray-500">${sop.id}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">${sop.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sop.equipment}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge bg-blue-100 text-blue-700">${sop.version}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sop.updateTime}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge bg-green-100 text-green-700">
                    <i class="fas fa-check-circle"></i> 有效
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="viewSOPDetail('${sop.id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="查看">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="downloadSOP('${sop.id}')" class="text-green-600 hover:text-green-800 mr-3" title="下载">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="editSOP('${sop.id}')" class="text-gray-600 hover:text-gray-800" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderExpertView() {
    const container = document.getElementById('expert-container');
    if (!container) return;
    container.innerHTML = filteredData.map(expert => `
        <div class="knowledge-card bg-white rounded-lg shadow-sm p-6 cursor-pointer" onclick="viewExpertDetail('${expert.id}')">
            <div class="flex items-start justify-between mb-3">
                <span class="badge bg-${getCategoryColor(expert.category)}-100 text-${getCategoryColor(expert.category)}-700">
                    ${expert.category}
                </span>
                <div class="flex items-center gap-1">
                    ${renderStars(expert.rating)}
                    <span class="text-xs text-gray-500 ml-1">(${expert.ratingCount})</span>
                </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${expert.title}</h3>
            <p class="text-sm text-gray-600 mb-4">${expert.summary}</p>
            
            <div class="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-user-tie text-blue-600 text-xl"></i>
                </div>
                <div>
                    <p class="font-semibold text-gray-800">${expert.author}</p>
                    <p class="text-xs text-gray-600">${expert.authorTitle}</p>
                    <p class="text-xs text-blue-600">${expert.experience}</p>
                </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-xs text-gray-500"><i class="fas fa-eye mr-1"></i>${expert.views} 次浏览</span>
                <span class="text-xs text-gray-500">${expert.createTime}</span>
            </div>
        </div>
    `).join('');
}

function getCategoryColor(category) {
    const colorMap = {
        '电气': 'blue',
        '机械': 'green',
        '液压': 'purple',
        '气动': 'orange',
        '控制': 'red'
    };
    return colorMap[category] || 'gray';
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star rating-star text-xs"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt rating-star text-xs"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star rating-star text-xs"></i>';
    }
    
    return stars;
}

function updateStatistics() {
    const totalKnowledge = knowledgeItems.length + sopDocuments.length + expertKnowledge.length;
    document.getElementById('metric-total-knowledge').textContent = totalKnowledge;
    document.getElementById('metric-cases').textContent = knowledgeItems.length;
    document.getElementById('metric-sop').textContent = sopDocuments.length;
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const ratingFilter = parseInt(document.getElementById('filter-rating').value) || 0;
    
    let data = getCurrentViewData();
    
    if (searchTerm) {
        data = data.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    }
    
    if (categoryFilter) {
        data = data.filter(item => item.category === categoryFilter);
    }
    
    if (ratingFilter > 0) {
        data = data.filter(item => item.rating >= ratingFilter);
    }
    
    filteredData = data;
    renderView();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-rating').value = '';
    filteredData = getCurrentViewData();
    renderView();
}

function viewKnowledgeDetail(id) {
    const item = knowledgeItems.find(k => k.id === id);
    if (!item) return;
    
    const content = document.getElementById('knowledge-detail-content');
    content.innerHTML = `
        <div class="space-y-6">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <span class="badge bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-700">
                        ${item.category}
                    </span>
                    <div class="flex items-center gap-1">
                        ${renderStars(item.rating)}
                        <span class="text-sm text-gray-500 ml-2">${item.rating} (${item.ratingCount}人评价)</span>
                    </div>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">${item.title}</h2>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span><i class="fas fa-user mr-1"></i>${item.author}</span>
                    <span><i class="fas fa-calendar mr-1"></i>${item.createTime}</span>
                    <span><i class="fas fa-eye mr-1"></i>${item.views} 次浏览</span>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
                ${item.keywords.map(kw => `<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">#${kw}</span>`).join('')}
            </div>
            
            <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm font-semibold text-blue-800 mb-2">适用设备</p>
                <p class="text-sm text-gray-700">${item.equipment}</p>
            </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-3">详细内容</h3>
                <div class="prose max-w-none">
                    <pre class="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">${item.content}</pre>
                </div>
            </div>
            
            ${item.attachments && item.attachments.length > 0 ? `
            <div>
                <h3 class="text-lg font-semibold mb-3">附件</h3>
                <div class="space-y-2">
                    ${item.attachments.map(att => `
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <i class="fas fa-file text-blue-600"></i>
                            <span class="flex-1 text-sm text-gray-700">${att}</span>
                            <button class="text-blue-600 hover:text-blue-800 text-sm">
                                <i class="fas fa-download mr-1"></i>下载
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="flex gap-3 pt-4 border-t">
                <button onclick="rateKnowledge('${item.id}')" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    <i class="fas fa-star mr-2"></i>评价
                </button>
                <button onclick="shareKnowledge('${item.id}')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <i class="fas fa-share mr-2"></i>分享
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('knowledge-detail-modal').classList.add('show');
}

function viewSOPDetail(id) {
    const sop = sopDocuments.find(s => s.id === id);
    if (!sop) return;
    alert(`查看SOP详情：${sop.name}\n\n${sop.content}`);
}

function viewExpertDetail(id) {
    const expert = expertKnowledge.find(e => e.id === id);
    if (!expert) return;
    alert(`专家知识详情：${expert.title}\n\n作者：${expert.author} (${expert.authorTitle})\n${expert.experience}\n\n${expert.summary}`);
}

function loadFTA() {
    const deviceId = document.getElementById('fta-device-select').value;
    if (!deviceId) {
        document.getElementById('fta-diagram').innerHTML = `
            <i class="fas fa-sitemap text-6xl mb-4"></i>
            <p>请选择设备查看故障树</p>
        `;
        return;
    }
    
    document.getElementById('fta-diagram').innerHTML = `
        <div class="text-left">
            <h4 class="text-lg font-semibold mb-4">${deviceId} 故障树分析</h4>
            <div class="space-y-4">
                <div class="p-4 bg-red-50 border-l-4 border-red-500">
                    <p class="font-semibold text-red-800">顶层故障：设备停机</p>
                </div>
                <div class="ml-8 space-y-2">
                    <div class="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                        <p class="font-semibold text-yellow-800">中层原因：电气故障</p>
                        <ul class="ml-6 mt-2 text-sm text-gray-700 list-disc">
                            <li>电源故障</li>
                            <li>控制器故障</li>
                            <li>传感器故障</li>
                        </ul>
                    </div>
                    <div class="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                        <p class="font-semibold text-yellow-800">中层原因：机械故障</p>
                        <ul class="ml-6 mt-2 text-sm text-gray-700 list-disc">
                            <li>轴承磨损</li>
                            <li>传动带断裂</li>
                            <li>润滑不足</li>
                        </ul>
                    </div>
                    <div class="p-3 bg-yellow-50 border-l-4 border-yellow-500">
                        <p class="font-semibold text-yellow-800">中层原因：液压故障</p>
                        <ul class="ml-6 mt-2 text-sm text-gray-700 list-disc">
                            <li>油泵故障</li>
                            <li>管路泄漏</li>
                            <li>阀门卡滞</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openKnowledgeModal() {
    document.getElementById('knowledge-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function saveKnowledge() {
    const type = document.getElementById('knowledge-type').value;
    const category = document.getElementById('knowledge-category').value;
    const title = document.getElementById('knowledge-title').value;
    const keywords = document.getElementById('knowledge-keywords').value;
    const reviewer = document.getElementById('knowledge-reviewer').value;
    const content = document.getElementById('knowledge-content').value;
    
    // 验证必填项
    if (!type || !category || !title || !reviewer || !content) {
        alert('请填写所有必填项（知识类型、分类、标题、审核人、内容）');
        return;
    }
    
    // 生成知识编号
    const knowledgeId = 'KB-' + new Date().getFullYear() + 
                        ('0' + (new Date().getMonth() + 1)).slice(-2) + 
                        ('0' + new Date().getDate()).slice(-2) + 
                        '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // 构建知识信息
    const knowledgeInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 知识已提交审核
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 知识编号: ${knowledgeId}
📂 知识类型: ${getTypeText(type)}
🏷️  分类: ${category}类
📝 标题: ${title}
🔑 关键词: ${keywords || '无'}

━━━ 审核信息 ━━━
👤 审核人: ${reviewer}
📅 提交时间: ${new Date().toLocaleString('zh-CN')}
⏳ 审核状态: 待审核

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 知识已成功提交
📧 系统已发送审核通知给 ${reviewer}
📊 可在【知识管理-待审核】中查看审核进度
    `;
    
    alert(knowledgeInfo);
    
    // 清空表单
    document.getElementById('knowledge-form').reset();
    closeModal('knowledge-modal');
}

function getTypeText(type) {
    const typeMap = {
        'case': '维修案例',
        'sop': 'SOP文档',
        'expert': '专家知识'
    };
    return typeMap[type] || type;
}

function rateKnowledge(id) { alert(`为知识 ${id} 评分`); }
function shareKnowledge(id) { alert(`分享知识 ${id}`); }
function downloadSOP(id) { alert(`下载SOP ${id}`); }
function editSOP(id) { alert(`编辑SOP ${id}`); }
function exportKnowledge() { alert('导出知识库'); }
