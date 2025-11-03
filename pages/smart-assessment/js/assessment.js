// 全局变量保存图表实例
let radarChartInstance = null;

// 初始化评估系统
document.addEventListener('DOMContentLoaded', function() {
    // 加载示例数据
    loadSampleData();

    // 绑定事件监听器
    bindEventListeners();

    // 更新评估结果
    updateAssessmentResults();

    // 初始化报告列表
    updateReportList();

    // 设置初始视图
    const initialView = getInitialViewFromLocation();
    switchView(initialView);

    // 记录更新时间
    const updateLabel = document.getElementById('lastUpdated');
    if (updateLabel) {
        const now = new Date();
        const formatted = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
        updateLabel.textContent = formatted;
    }

    // 延迟初始化雷达图，确保容器已完全渲染
    setTimeout(() => {
        initRadarChart();
    }, 300);
});

// 初始化雷达图
function initRadarChart() {
    const chartDom = document.getElementById('radarChart');
    if (!chartDom) return;
    
    // 如果已存在实例，先销毁
    if (radarChartInstance) {
        radarChartInstance.dispose();
    }
    
    // 确保容器有明确的尺寸
    if (chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
        console.warn('Chart container has no size, retrying...');
        setTimeout(() => initRadarChart(), 100);
        return;
    }
    
    radarChartInstance = echarts.init(chartDom);
    const myChart = radarChartInstance;
    
    const option = {
        title: {
            text: '智能制造成熟度评估',
            subtext: '基于多维度数据分析',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: ['当前评估', '行业平均', '目标水平'],
            bottom: 10
        },
        radar: {
            indicator: [
                { name: '生产自动化', max: 5 },
                { name: '数据集成', max: 5 },
                { name: '智能决策', max: 5 },
                { name: '设备联网', max: 5 },
                { name: '质量管理', max: 5 },
                { name: '供应链协同', max: 5 }
            ],
            radius: '65%',
            splitNumber: 5,
            axisName: {
                color: '#333',
                fontSize: 12
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.2)'],
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(59, 130, 246, 0.5)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(59, 130, 246, 0.5)'
                }
            }
        },
        series: [
            {
                name: '智能制造成熟度',
                type: 'radar',
                data: [
                    {
                        value: [3.2, 2.8, 2.5, 3.5, 3.0, 2.0],
                        name: '当前评估',
                        areaStyle: {
                            color: 'rgba(59, 130, 246, 0.4)'
                        },
                        lineStyle: {
                            width: 2,
                            color: 'rgba(59, 130, 246, 0.8)'
                        },
                        itemStyle: {
                            color: '#3b82f6'
                        }
                    },
                    {
                        value: [3.5, 3.2, 2.8, 3.8, 3.5, 2.5],
                        name: '行业平均',
                        areaStyle: {
                            color: 'rgba(16, 185, 129, 0.2)'
                        },
                        lineStyle: {
                            width: 1,
                            type: 'dashed',
                            color: 'rgba(16, 185, 129, 0.8)'
                        },
                        itemStyle: {
                            color: '#10b981'
                        }
                    },
                    {
                        value: [4.5, 4.5, 4.0, 4.5, 4.2, 4.0],
                        name: '目标水平',
                        areaStyle: {
                            color: 'rgba(249, 115, 22, 0.1)'
                        },
                        lineStyle: {
                            width: 1,
                            type: 'dashed',
                            color: 'rgba(249, 115, 22, 0.8)'
                        },
                        itemStyle: {
                            color: '#f97316'
                        }
                    }
                ]
            }
        ]
    };

    myChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        if (radarChartInstance) {
            radarChartInstance.resize();
        }
    });
    
    // 立即调整一次大小，确保正确显示
    setTimeout(() => {
        if (radarChartInstance) {
            radarChartInstance.resize();
        }
    }, 100);
}

// 加载示例数据
function loadSampleData() {
    // 数据治理表格数据
    const governanceData = [
        { id: 1, name: '设备联网率', source: 'MES系统', status: '已同步', action: '查看' },
        { id: 2, name: 'OEE指标', source: 'SCADA系统', status: '待同步', action: '同步' },
        { id: 3, name: '质量合格率', source: 'QMS系统', status: '同步中', action: '刷新' },
        { id: 4, name: '生产计划达成率', source: 'ERP系统', status: '已同步', action: '查看' },
        { id: 5, name: '设备故障率', source: 'EAM系统', status: '同步失败', action: '重试' }
    ];

    // 渲染数据治理表格
    const tableBody = document.getElementById('dataGovernanceTable');
    if (tableBody) {
        tableBody.innerHTML = governanceData.map(item => `
            <tr class="hover:bg-gray-50" data-id="${item.id}">
                <td class="py-2 px-4 border">${item.name}</td>
                <td class="py-2 px-4 border">${item.source}</td>
                <td class="py-2 px-4 border">
                    <span class="status badge ${getStatusBadgeClass(item.status)}">
                        ${item.status}
                    </span>
                </td>
                <td class="py-2 px-4 border">
                    <button class="text-blue-500 hover:text-blue-700" onclick="handleAction('${item.action.toLowerCase()}', ${item.id})">
                        ${item.action}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 更新评估结果
    updateAssessmentResults();
}

// 获取状态徽章样式
function getStatusBadgeClass(status) {
    const statusMap = {
        '已同步': 'badge-success',
        '待同步': 'badge-warning',
        '同步中': 'badge-info',
        '同步失败': 'badge-error'
    };
    return statusMap[status] || 'badge-default';
}

// 处理操作按钮点击
function handleAction(action, id) {
    console.log(`执行操作: ${action}, ID: ${id}`);
    // 这里可以添加具体的操作逻辑
    if (action === '同步' || action === '重试') {
        // 模拟同步操作
        const statusElement = document.querySelector(`tr[data-id="${id}"] .status`);
        if (statusElement) {
            statusElement.textContent = '同步中';
            statusElement.className = 'status badge badge-info';
            
            // 模拟异步操作
            setTimeout(() => {
                statusElement.textContent = '已同步';
                statusElement.className = 'status badge badge-success';
                showToast('数据同步成功', 'success');
            }, 1500);
        }
    }
}

// 更新评估结果
function updateAssessmentResults() {
    const resultContainer = document.getElementById('assessmentResult');
    if (!resultContainer) return;
    
    const results = [
        { title: '总体成熟度', value: 'L2.8', progress: 56, level: '中等', trend: 'up' },
        { title: '生产自动化', value: 'L3.2', progress: 64, level: '良好', trend: 'up' },
        { title: '数据集成', value: 'L2.8', progress: 56, level: '中等', trend: 'up' },
        { title: '智能决策', value: 'L2.5', progress: 50, level: '中等', trend: 'down' },
        { title: '设备联网', value: 'L3.5', progress: 70, level: '良好', trend: 'up' },
        { title: '质量管理', value: 'L3.0', progress: 60, level: '中等', trend: 'stable' },
        { title: '供应链协同', value: 'L2.0', progress: 40, level: '待提升', trend: 'up' }
    ];
    
    resultContainer.innerHTML = results.map(item => `
        <div class="space-y-1">
            <div class="flex justify-between text-sm">
                <span class="font-medium">${item.title}</span>
                <div class="flex items-center">
                    <span class="font-bold mr-2">${item.value}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full ${getLevelBadgeClass(item.level)}">
                        ${item.level}
                    </span>
                </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: ${item.progress}%"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
                <span>L1 初始级</span>
                <span>L5 优化级</span>
            </div>
        </div>
    `).join('');
    
    // 更新差距分析
    updateGapAnalysis();
}

// 获取等级徽章样式
function getLevelBadgeClass(level) {
    const levelMap = {
        '优秀': 'bg-green-100 text-green-800',
        '良好': 'bg-blue-100 text-blue-800',
        '中等': 'bg-yellow-100 text-yellow-800',
        '待提升': 'bg-orange-100 text-orange-800',
        '不足': 'bg-red-100 text-red-800'
    };
    return levelMap[level] || 'bg-gray-100 text-gray-800';
}

// 更新差距分析
function updateGapAnalysis() {
    const gapAnalysis = document.getElementById('gapAnalysis');
    if (!gapAnalysis) return;
    
    const gaps = [
        { 
            title: '数据集成能力', 
            current: 'L2.8', 
            target: 'L4.0', 
            gap: '1.2',
            impact: '高',
            recommendations: [
                '实施企业级数据中台',
                '建立统一的数据标准与规范',
                '提升数据质量管控能力'
            ]
        },
        { 
            title: '智能决策支持', 
            current: 'L2.5', 
            target: 'L3.5', 
            gap: '1.0',
            impact: '中',
            recommendations: [
                '部署高级分析工具',
                '建立预测性维护模型',
                '培养数据分析人才'
            ]
        },
        { 
            title: '供应链协同', 
            current: 'L2.0', 
            target: 'L3.0', 
            gap: '1.0',
            impact: '高',
            recommendations: [
                '建立供应商协同平台',
                '实施供应链可视化',
                '优化库存管理策略'
            ]
        }
    ];
    
    gapAnalysis.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">差距领域</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当前水平</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目标水平</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">差距</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影响程度</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">改进建议</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${gaps.map(gap => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${gap.title}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gap.current}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gap.target}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">-${gap.gap}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${gap.impact === '高' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${gap.impact}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                <ul class="list-disc pl-4 space-y-1">
                                    ${gap.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 绑定事件监听器
function bindEventListeners() {
    // 文件导入按钮
    const importBtn = document.getElementById('importBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file);
            }
        });
    }
    
    // 视图切换（如果存在标签页按钮）
    const viewTabs = document.querySelectorAll('.view-tab');
    if (viewTabs.length > 0) {
        viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-view-target');
                switchView(target);
                updateURLHash(target);
            });
        });
    }

    // 监听 hash 变化（iframe 场景也能触发）
    window.addEventListener('hashchange', () => {
        const view = getInitialViewFromLocation();
        switchView(view);
    });
}

// 获取初始视图（优先 query，其次 hash）
function getInitialViewFromLocation() {
    const url = new URL(window.location.href);
    const allowedViews = ['overview', 'data-integration', 'assessment', 'reports', 'management'];
    const queryView = url.searchParams.get('view');

    let hashView = null;
    if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash.startsWith('view=')) {
            hashView = hash.split('=')[1];
        } else {
            hashView = hash;
        }
    }

    const finalView = queryView || hashView || 'overview';
    return allowedViews.includes(finalView) ? finalView : 'overview';
}

// 切换视图
function switchView(targetView = 'overview') {
    const sections = document.querySelectorAll('.assessment-section');
    const tabs = document.querySelectorAll('.view-tab');
    let resolvedView = 'overview';

    sections.forEach(section => {
        if (section.dataset.view === targetView) {
            section.classList.remove('hidden');
            resolvedView = targetView;
        } else {
            section.classList.add('hidden');
        }
    });

    // 只在标签页存在时更新激活状态
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            if (tab.dataset.viewTarget === resolvedView) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // 更新当前视图标题
    const currentTitle = document.getElementById('currentViewTitle');
    if (currentTitle) {
        const viewTitles = {
            'overview': '评估概览',
            'data-integration': '数据集成与治理',
            'assessment': '智能评估与诊断',
            'reports': '报告管理',
            'management': '系统管理'
        };
        currentTitle.textContent = viewTitles[resolvedView] || '评估概览';
    }

    // 在切换到评估视图时，确保图表尺寸正确
    if (resolvedView === 'assessment') {
        setTimeout(() => {
            initRadarChart();
            // 再次调整大小以确保正确显示
            setTimeout(() => {
                if (radarChartInstance) {
                    radarChartInstance.resize();
                }
            }, 200);
        }, 100);
    }
}

// 更新地址栏
function updateURLHash(view) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    history.replaceState(null, '', url.toString());
}

// 数字补零
function padZero(value) {
    return value.toString().padStart(2, '0');
}

// 处理文件上传
function handleFileUpload(file) {
    console.log('上传文件:', file.name);
    // 这里可以添加文件上传逻辑
    showToast(`已选择文件: ${file.name}`, 'info');
    
    // 模拟文件处理
    setTimeout(() => {
        showToast('文件上传成功，正在处理数据...', 'success');
        
        // 模拟数据处理完成
        setTimeout(() => {
            showToast('数据处理完成，已更新评估结果', 'success');
            updateAssessmentResults();
        }, 1500);
    }, 1000);
}

// 显示手动录入模态框
function showManualEntry() {
    const modal = document.getElementById('manualEntryModal');
    if (!modal) {
        console.error('Modal not found');
        return;
    }
    
    // 生成动态表单
    const form = document.getElementById('manualEntryForm');
    if (!form) {
        console.error('Form container not found');
        return;
    }
    
    form.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">评估维度</label>
                <select id="dimensionSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">选择评估维度</option>
                    <option value="production">生产自动化</option>
                    <option value="data">数据集成</option>
                    <option value="decision">智能决策</option>
                    <option value="equipment">设备联网</option>
                    <option value="quality">质量管理</option>
                    <option value="supply">供应链协同</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">成熟度等级</label>
                <select id="levelSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">选择成熟度等级</option>
                    <option value="1">L1 - 初始级</option>
                    <option value="2">L2 - 可重复</option>
                    <option value="3">L3 - 已定义</option>
                    <option value="4">L4 - 可预测</option>
                    <option value="5">L5 - 优化级</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">评估说明</label>
                <textarea id="descriptionText" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24" placeholder="请填写评估依据和说明..."></textarea>
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">评估得分</label>
                <input type="number" id="scoreInput" min="0" max="5" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入0-5之间的分数">
            </div>
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">上传附件</label>
                <div class="mt-1 flex items-center">
                    <label class="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-upload mr-2"></i>选择文件
                        <input type="file" id="fileUpload" class="hidden" accept=".pdf,.jpg,.jpeg,.png">
                    </label>
                    <span class="ml-3 text-sm text-gray-500">支持PDF、JPG、PNG格式</span>
                </div>
                <div id="fileNameDisplay" class="mt-2 text-sm text-gray-600"></div>
            </div>
        </div>
    `;
    
    // 添加文件选择事件监听
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            const display = document.getElementById('fileNameDisplay');
            if (fileName && display) {
                display.innerHTML = `<i class="fas fa-file mr-2 text-blue-500"></i>已选择: ${fileName}`;
            }
        });
    }
    
    // 显示模态框
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    
    // 强制重绘以触发动画
    setTimeout(() => {
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }
    }, 10);
    
    console.log('Modal displayed successfully');
    console.log('Form HTML:', form.innerHTML.substring(0, 100));
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('manualEntryModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    modal.classList.add('hidden');
}

// 提交手动录入数据
function submitManualEntry() {
    // 获取表单数据
    const dimension = document.getElementById('dimensionSelect')?.value;
    const level = document.getElementById('levelSelect')?.value;
    const description = document.getElementById('descriptionText')?.value;
    const score = document.getElementById('scoreInput')?.value;
    
    // 验证表单
    if (!dimension) {
        showToast('请选择评估维度', 'warning');
        return;
    }
    
    if (!level && !score) {
        showToast('请选择成熟度等级或输入评估得分', 'warning');
        return;
    }
    
    if (!description) {
        showToast('请填写评估说明', 'warning');
        return;
    }
    
    // 显示提交成功
    showToast('评估数据已提交', 'success');
    closeModal();
    
    // 模拟数据更新
    setTimeout(() => {
        updateAssessmentResults();
        showToast('评估结果已更新', 'success');
    }, 1000);
}

// 生成报告
function generateReport() {
    showToast('正在生成评估报告...', 'info');
    
    // 模拟报告生成
    setTimeout(() => {
        showToast('评估报告生成成功', 'success');
        updateReportList();
    }, 2000);
}

// 更新报告列表
function updateReportList() {
    const reportList = document.getElementById('reportList');
    if (!reportList) return;
    
    const reports = [
        { id: 1, name: '2025年Q3智能制造成熟度评估报告', date: '2025-09-15', status: '已完成' },
        { id: 2, name: '2025年Q2智能制造成熟度评估报告', date: '2025-06-15', status: '已完成' },
        { id: 3, name: '2025年Q1智能制造成熟度评估报告', date: '2025-03-15', status: '已完成' },
        { id: 4, name: '2024年智能制造成熟度年度报告', date: '2024-12-31', status: '已完成' }
    ];
    
    reportList.innerHTML = reports.map(report => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a href="#" class="text-blue-600 hover:text-blue-900">${report.name}</a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${report.date}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${report.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="viewReport(${report.id})">
                    <i class="far fa-eye"></i> 查看
                </button>
                <button class="text-green-600 hover:text-green-900 mr-3" onclick="downloadReport(${report.id}, 'pdf')">
                    <i class="far fa-file-pdf"></i> PDF
                </button>
                <button class="text-blue-800 hover:text-blue-900" onclick="downloadReport(${report.id}, 'word')">
                    <i class="far fa-file-word"></i> Word
                </button>
            </td>
        </tr>
    `).join('');
}

// 查看报告
function viewReport(id) {
    console.log('查看报告:', id);
    showToast(`正在加载报告 #${id}...`, 'info');
    // 这里可以添加查看报告的逻辑
}

// 下载报告
function downloadReport(id, format) {
    console.log(`下载报告 #${id}，格式: ${format}`);
    showToast(`正在生成${format.toUpperCase()}格式报告...`, 'info');
    // 这里可以添加下载报告的逻辑
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 显示能力详情弹窗
function showCapabilityDetail(capabilityType) {
    const modal = document.getElementById('capabilityDetailModal');
    const title = document.getElementById('capabilityDetailTitle');
    const content = document.getElementById('capabilityDetailContent');
    
    const capabilityData = {
        production: {
            title: '生产自动化能力详情',
            level: 'L3.2',
            trend: '↑0.3',
            description: '自动排程与柔性执行体系逐步完善',
            details: [
                { label: '自动化排程覆盖率', value: '85%', status: 'good' },
                { label: 'MES系统集成度', value: '92%', status: 'good' },
                { label: '柔性生产能力', value: '78%', status: 'normal' },
                { label: '设备自动化率', value: '88%', status: 'good' }
            ],
            improvements: [
                '继续推进智能排程算法优化',
                '提升产线切换效率',
                '加强设备互联互通'
            ]
        },
        data: {
            title: '数据集成能力详情',
            level: 'L2.8',
            trend: '待提升',
            description: '需统一数据模型与治理机制',
            details: [
                { label: '数据源接入数量', value: '12个系统', status: 'good' },
                { label: '数据质量得分', value: '72分', status: 'normal' },
                { label: '实时数据同步率', value: '68%', status: 'warning' },
                { label: '数据标准化程度', value: '65%', status: 'warning' }
            ],
            improvements: [
                '建立统一数据模型标准',
                '完善数据治理流程',
                '提升数据质量监控能力'
            ]
        },
        decision: {
            title: '智能决策能力详情',
            level: 'L2.5',
            trend: '关键差距',
            description: '预测性维护与AI分析仍处试点阶段',
            details: [
                { label: 'AI模型部署数量', value: '3个', status: 'warning' },
                { label: '预测准确率', value: '75%', status: 'normal' },
                { label: '智能决策覆盖率', value: '45%', status: 'warning' },
                { label: '算法优化频率', value: '季度', status: 'normal' }
            ],
            improvements: [
                '扩大AI应用场景覆盖',
                '提升预测模型准确率',
                '建立持续优化机制'
            ]
        },
        supply: {
            title: '供应链协同能力详情',
            level: 'L2.0',
            trend: '紧急',
            description: '需补齐可视化、协同计划与供应商画像能力',
            details: [
                { label: '供应商协同平台覆盖率', value: '35%', status: 'danger' },
                { label: '供应链可视化程度', value: '42%', status: 'warning' },
                { label: '协同计划准确率', value: '58%', status: 'warning' },
                { label: '供应商画像完整度', value: '30%', status: 'danger' }
            ],
            improvements: [
                '上线供应商协同门户',
                '建立供应链可视化平台',
                '完善供应商评估体系'
            ]
        }
    };
    
    const data = capabilityData[capabilityType];
    if (!data) return;
    
    title.textContent = data.title;
    
    const statusColors = {
        good: 'text-green-600 bg-green-50',
        normal: 'text-blue-600 bg-blue-50',
        warning: 'text-orange-600 bg-orange-50',
        danger: 'text-red-600 bg-red-50'
    };
    
    content.innerHTML = `
        <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-500">当前成熟度等级</p>
                    <p class="text-3xl font-bold text-blue-600 mt-1">${data.level}</p>
                </div>
                <span class="text-lg ${data.trend.includes('↑') ? 'text-green-600' : 'text-orange-600'}">${data.trend}</span>
            </div>
            <p class="text-sm text-gray-600 mt-3">${data.description}</p>
        </div>
        
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">关键指标</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${data.details.map(item => `
                    <div class="border border-gray-200 rounded-lg p-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">${item.label}</span>
                            <span class="text-xs px-2 py-1 rounded ${statusColors[item.status]}">${item.value}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div>
            <h4 class="font-semibold text-gray-800 mb-3">改进建议</h4>
            <ul class="space-y-2">
                ${data.improvements.map((item, index) => `
                    <li class="flex items-start space-x-2">
                        <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full mt-0.5">${index + 1}</span>
                        <span class="text-sm text-gray-600">${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

// 关闭能力详情弹窗
function closeCapabilityDetail() {
    const modal = document.getElementById('capabilityDetailModal');
    modal.style.display = 'none';
    modal.classList.add('hidden');
}

// 编辑能力评估
function editCapability() {
    closeCapabilityDetail();
    showManualEntry();
    showToast('已切换到编辑模式', 'info');
}

// 显示模板管理器
function showTemplateManager() {
    const modal = document.getElementById('templateManagerModal');
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
}

// 关闭模板管理器
function closeTemplateManager() {
    const modal = document.getElementById('templateManagerModal');
    modal.style.display = 'none';
    modal.classList.add('hidden');
}

// 选择模板
function selectTemplate(templateType) {
    const templates = {
        standard: '标准评估报告模板',
        executive: '高管摘要报告模板',
        detailed: '详细技术报告模板'
    };
    
    showToast(`已选择：${templates[templateType]}`, 'success');
    
    // 更新选中状态
    document.querySelectorAll('#templateManagerModal .fa-check-circle, #templateManagerModal .fa-circle').forEach(icon => {
        icon.className = 'fas fa-circle text-gray-300 text-xl';
    });
    
    event.target.closest('.cursor-pointer').querySelector('i').className = 'fas fa-check-circle text-green-500 text-xl';
}

// 创建新模板
function createNewTemplate() {
    showToast('模板创建功能开发中...', 'info');
    closeTemplateManager();
}

// 导出函数到全局作用域
window.showManualEntry = showManualEntry;
window.closeModal = closeModal;
window.submitManualEntry = submitManualEntry;
window.generateReport = generateReport;
window.viewReport = viewReport;
window.downloadReport = downloadReport;
window.handleAction = handleAction;
window.switchView = switchView;
window.initRadarChart = initRadarChart;
window.showCapabilityDetail = showCapabilityDetail;
window.closeCapabilityDetail = closeCapabilityDetail;
window.editCapability = editCapability;
window.showTemplateManager = showTemplateManager;
window.closeTemplateManager = closeTemplateManager;
window.selectTemplate = selectTemplate;
window.createNewTemplate = createNewTemplate;
