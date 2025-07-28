/**
 * 数字工厂一体化平台 - 智能业务单据追踪AI助手
 * 版本: v1.0.0
 * 功能: 实现"一单到底"的业务流程追踪
 */

class DigitalFactoryAI {
    constructor() {
        this.isOpen = false;
        this.businessData = this.initBusinessData();
        this.init();
    }

    // 初始化AI助手
    init() {
        this.createAIButton();
        this.createAIDialog();
        this.bindEvents();
    }

    // 创建AI助手悬浮按钮
    createAIButton() {
        const button = document.createElement('div');
        button.id = 'ai-assistant-btn';
        button.className = `
            fixed bottom-5 right-5 w-14 h-14 bg-primary rounded-full 
            flex items-center justify-center cursor-pointer shadow-lg 
            hover:shadow-xl hover:scale-110 transition-all duration-300 z-50
        `;
        button.innerHTML = '<i class="fas fa-robot text-white text-xl"></i>';
        document.body.appendChild(button);
    }

    // 创建AI对话框
    createAIDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'ai-assistant-dialog';
        dialog.className = `
            fixed bottom-20 right-5 w-96 bg-white rounded-lg shadow-2xl
            border border-gray-200 hidden z-50 flex flex-col
        `;

        // 设置初始高度和最大高度
        this.setDialogHeight(dialog, false);
        
        dialog.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-primary rounded-t-lg">
                <div class="flex items-center">
                    <i class="fas fa-robot text-white text-lg mr-2"></i>
                    <h3 class="text-white font-semibold">智能单据追踪</h3>
                </div>
                <button id="ai-close-btn" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="flex-1 p-4 overflow-hidden flex flex-col">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        请输入业务单据编号
                    </label>
                    <div class="flex">
                        <input 
                            type="text" 
                            id="ai-input" 
                            placeholder="例如: DM202501001" 
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                        <button 
                            id="ai-search-btn" 
                            class="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-blue-700 transition-colors"
                        >
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-y-auto" id="ai-results">
                    <div class="text-center text-gray-500 mt-8">
                        <i class="fas fa-search text-3xl mb-2"></i>
                        <p>输入单据编号开始追踪</p>
                        <div class="mt-4 text-xs text-left">
                            <p class="font-semibold mb-2">支持的单据类型:</p>
                            <ul class="space-y-1">
                                <li>• DM开头 - 需求计划</li>
                                <li>• MPS开头 - 主生产计划</li>
                                <li>• WO开头 - 生产工单</li>
                                <li>• PO开头 - 采购订单</li>
                                <li>• SO开头 - 销售订单</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }

    // 绑定事件
    bindEvents() {
        // AI按钮点击事件
        document.getElementById('ai-assistant-btn').addEventListener('click', () => {
            this.toggleDialog();
        });

        // 关闭按钮事件
        document.getElementById('ai-close-btn').addEventListener('click', () => {
            this.closeDialog();
        });

        // 搜索按钮事件
        document.getElementById('ai-search-btn').addEventListener('click', () => {
            this.searchDocument();
        });

        // 输入框回车事件
        document.getElementById('ai-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchDocument();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDialog();
            }
        });

        // 点击外部区域关闭
        document.addEventListener('click', (e) => {
            const dialog = document.getElementById('ai-assistant-dialog');
            const button = document.getElementById('ai-assistant-btn');

            if (this.isOpen && !dialog.contains(e.target) && !button.contains(e.target)) {
                this.closeDialog();
            }
        });

        // 窗口大小变化时调整对话框高度
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                const dialog = document.getElementById('ai-assistant-dialog');
                const results = document.getElementById('ai-results');
                const hasResults = results && results.innerHTML.includes('业务流程追踪');
                this.setDialogHeight(dialog, hasResults);
            }
        });
    }

    // 切换对话框显示状态
    toggleDialog() {
        if (this.isOpen) {
            this.closeDialog();
        } else {
            this.openDialog();
        }
    }

    // 打开对话框
    openDialog() {
        const dialog = document.getElementById('ai-assistant-dialog');
        dialog.classList.remove('hidden');
        dialog.classList.add('animate-fade-in');
        this.isOpen = true;
        
        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('ai-input').focus();
        }, 100);
    }

    // 关闭对话框
    closeDialog() {
        const dialog = document.getElementById('ai-assistant-dialog');
        dialog.classList.add('hidden');
        dialog.classList.remove('animate-fade-in');
        this.isOpen = false;
    }

    // 搜索单据
    searchDocument() {
        const input = document.getElementById('ai-input');
        const query = input.value.trim().toUpperCase();
        
        if (!query) {
            this.showError('请输入单据编号');
            return;
        }

        // 显示加载状态
        this.showLoading();

        // 模拟API调用延迟
        setTimeout(() => {
            const timeline = this.getDocumentTimeline(query);
            if (timeline.length > 0) {
                this.displayTimeline(timeline);
            } else {
                this.showError('未找到相关单据信息');
            }
        }, 800);
    }

    // 显示加载状态
    showLoading() {
        const results = document.getElementById('ai-results');
        results.innerHTML = `
            <div class="text-center text-gray-500 mt-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>正在追踪单据流程...</p>
            </div>
        `;
    }

    // 显示错误信息
    showError(message) {
        const results = document.getElementById('ai-results');
        const dialog = document.getElementById('ai-assistant-dialog');

        // 恢复默认高度
        this.setDialogHeight(dialog, false);

        results.innerHTML = `
            <div class="text-center text-red-500 mt-8">
                <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                <p>${message}</p>
            </div>
        `;
    }

    // 获取单据时间线
    getDocumentTimeline(docNumber) {
        // 根据单据编号前缀确定起始类型
        const prefix = docNumber.substring(0, 2);
        let timeline = [];

        if (prefix === 'DM') {
            timeline = this.businessData.demandTimeline[docNumber] || [];
        } else if (prefix === 'MP') {
            timeline = this.businessData.mpsTimeline[docNumber] || [];
        } else if (prefix === 'WO') {
            timeline = this.businessData.workOrderTimeline[docNumber] || [];
        } else if (prefix === 'PO') {
            timeline = this.businessData.purchaseTimeline[docNumber] || [];
        } else if (prefix === 'SO') {
            timeline = this.businessData.salesTimeline[docNumber] || [];
        }

        return timeline;
    }

    // 显示时间线
    displayTimeline(timeline) {
        const results = document.getElementById('ai-results');
        const dialog = document.getElementById('ai-assistant-dialog');

        // 调整对话框高度以适应搜索结果
        this.setDialogHeight(dialog, true);

        let html = `
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold text-gray-800">业务流程追踪</h4>
                    <span class="text-xs text-gray-500">${timeline.length}个节点</span>
                </div>
        `;

        timeline.forEach((item, index) => {
            const statusColor = this.getStatusColor(item.status);
            const statusIcon = this.getStatusIcon(item.status);
            const isLastItem = index === timeline.length - 1;

            html += `
                <div class="timeline-item relative flex items-start cursor-pointer hover:bg-blue-50 rounded-md transition-colors group"
                     onclick="digitalFactoryAI.navigateToDocument('${item.type}', '${item.docNumber}')"
                     title="点击查看 ${item.type} ${item.docNumber} 详情">
                    <!-- 时间线左侧：图标和连接线 -->
                    <div class="timeline-left flex-shrink-0 relative flex flex-col items-center">
                        <!-- 状态图标 -->
                        <div class="timeline-icon w-8 h-8 ${statusColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-10 relative">
                            <i class="${statusIcon} text-white text-xs"></i>
                        </div>
                        <!-- 连接线 -->
                        ${!isLastItem ? `
                            <div class="timeline-connector absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300"
                                 style="top: 32px; bottom: -24px;"></div>
                        ` : ''}
                    </div>

                    <!-- 时间线右侧：内容区域 -->
                    <div class="timeline-content flex-1 min-w-0 ml-4 pb-6">
                        <div class="flex items-center justify-between mb-1">
                            <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">${item.type}</p>
                            <span class="text-xs text-gray-500">${item.time}</span>
                        </div>
                        <div class="flex items-center space-x-2 mb-1">
                            <p class="text-sm text-blue-600 font-medium group-hover:underline">${item.docNumber}</p>
                            <i class="fas fa-external-link-alt text-xs text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                        </div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-gray-500">负责人: ${item.person}</span>
                            <span class="text-xs ${statusColor.replace('bg-', 'text-')} font-medium">${item.status}</span>
                        </div>
                        ${item.data ? `<p class="text-xs text-gray-400 mb-1">${item.data}</p>` : ''}
                        <div class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-mouse-pointer mr-1"></i>点击查看详情
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        results.innerHTML = html;
    }

    // 获取状态颜色
    getStatusColor(status) {
        switch (status) {
            case '已完成': return 'bg-green-500';
            case '进行中': return 'bg-orange-500';
            case '已取消': return 'bg-red-500';
            case '待开始': return 'bg-gray-400';
            default: return 'bg-blue-500';
        }
    }

    // 获取状态图标
    getStatusIcon(status) {
        switch (status) {
            case '已完成': return 'fas fa-check';
            case '进行中': return 'fas fa-clock';
            case '已取消': return 'fas fa-times';
            case '待开始': return 'fas fa-pause';
            default: return 'fas fa-circle';
        }
    }

    // 设置对话框高度
    setDialogHeight(dialog, hasResults = false) {
        const viewportHeight = window.innerHeight;
        const topOffset = 20; // 距离顶部20px
        const bottomOffset = 100; // 距离底部100px (考虑AI按钮的位置)

        if (hasResults) {
            // 有搜索结果时，使用更大的高度
            const maxHeight = viewportHeight - topOffset - bottomOffset;
            const optimalHeight = Math.min(maxHeight, 700); // 最大700px
            dialog.style.height = `${optimalHeight}px`;
            dialog.style.bottom = `${bottomOffset}px`;
            dialog.style.top = 'auto';
        } else {
            // 无搜索结果时，使用较小的固定高度
            dialog.style.height = '400px';
            dialog.style.bottom = '100px';
            dialog.style.top = 'auto';
        }

        // 移动端适配
        if (window.innerWidth <= 640) {
            dialog.style.height = `${viewportHeight - 120}px`;
            dialog.style.bottom = '80px';
            dialog.style.left = '20px';
            dialog.style.right = '20px';
            dialog.style.width = 'auto';
        }
    }

    // 导航到具体单据页面
    navigateToDocument(type, docNumber) {
        // 根据单据类型导航到对应模块
        const moduleMap = {
            '需求计划': {
                url: 'pages/planning/demand-management.html',
                module: 'planning',
                title: '需求管理'
            },
            '主生产计划': {
                url: 'pages/planning/mps-management.html',
                module: 'planning',
                title: 'MPS管理'
            },
            '生产工单': {
                url: 'pages/production/work-orders.html',
                module: 'production',
                title: '工单管理'
            },
            '物料需求': {
                url: 'pages/planning/mrp-management.html',
                module: 'planning',
                title: 'MRP管理'
            },
            '采购订单': {
                url: 'pages/inventory/receiving-inbound.html',
                module: 'inventory',
                title: '收货入库'
            },
            '收货入库': {
                url: 'pages/inventory/receiving-inbound.html',
                module: 'inventory',
                title: '收货入库'
            },
            '成品入库': {
                url: 'pages/inventory/product-inbound.html',
                module: 'inventory',
                title: '成品入库'
            },
            '销售订单': {
                url: 'pages/inventory/product-outbound.html',
                module: 'inventory',
                title: '成品出库'
            },
            '成品出库': {
                url: 'pages/inventory/product-outbound.html',
                module: 'inventory',
                title: '成品出库'
            }
        };

        const config = moduleMap[type];
        if (config) {
            // 显示导航提示
            this.showNavigationFeedback(type, docNumber);

            // 执行导航
            this.navigateToPage(config, docNumber);
        }
    }

    // 页面导航核心逻辑
    navigateToPage(config, docNumber) {
        const urlWithParams = `${config.url}?doc=${docNumber}`;

        // 优先使用主页面的全局导航函数
        if (this.tryNavigateWithGlobalFunction(config, urlWithParams)) {
            return;
        }

        // 检查是否在主页面框架中运行
        if (window.top && window.top !== window.self) {
            // 在iframe中运行，调用顶级窗口的导航函数
            this.navigateInTopWindow(config, urlWithParams);
        } else if (window.parent && window.parent !== window) {
            // 在父窗口中运行，调用父窗口的导航函数
            this.navigateInParentWindow(config, urlWithParams);
        } else {
            // 在顶级窗口中运行，直接调用本地函数
            this.navigateInCurrentWindow(config, urlWithParams);
        }
    }

    // 尝试使用全局导航函数
    tryNavigateWithGlobalFunction(config, urlWithParams) {
        try {
            // 检查顶级窗口是否有全局导航函数
            if (window.top && window.top.navigateToDocumentPage) {
                window.top.navigateToDocumentPage(config.module, urlWithParams, config.title);
                console.log(`使用顶级窗口全局导航函数: ${config.module} -> ${urlWithParams}`);
                return true;
            }

            // 检查父窗口是否有全局导航函数
            if (window.parent && window.parent.navigateToDocumentPage) {
                window.parent.navigateToDocumentPage(config.module, urlWithParams, config.title);
                console.log(`使用父窗口全局导航函数: ${config.module} -> ${urlWithParams}`);
                return true;
            }

            // 检查当前窗口是否有全局导航函数
            if (window.navigateToDocumentPage) {
                window.navigateToDocumentPage(config.module, urlWithParams, config.title);
                console.log(`使用当前窗口全局导航函数: ${config.module} -> ${urlWithParams}`);
                return true;
            }
        } catch (error) {
            console.warn('全局导航函数调用失败:', error);
        }

        return false;
    }

    // 在顶级窗口中导航
    navigateInTopWindow(config, urlWithParams) {
        try {
            // 首先切换到对应模块
            if (window.top.switchModule) {
                window.top.switchModule(config.module);
                console.log(`切换到模块: ${config.module}`);
            }

            // 然后加载具体页面
            setTimeout(() => {
                if (window.top.loadSubPage) {
                    window.top.loadSubPage(urlWithParams, config.title);
                    console.log(`加载页面: ${urlWithParams}`);
                } else {
                    console.warn('顶级窗口中未找到loadSubPage函数');
                    this.fallbackNavigation(urlWithParams);
                }
            }, 100);
        } catch (error) {
            console.error('顶级窗口导航失败:', error);
            this.fallbackNavigation(urlWithParams);
        }
    }

    // 在父窗口中导航
    navigateInParentWindow(config, urlWithParams) {
        try {
            // 首先切换到对应模块
            if (window.parent.switchModule) {
                window.parent.switchModule(config.module);
                console.log(`在父窗口切换到模块: ${config.module}`);
            }

            // 然后加载具体页面
            setTimeout(() => {
                if (window.parent.loadSubPage) {
                    window.parent.loadSubPage(urlWithParams, config.title);
                    console.log(`在父窗口加载页面: ${urlWithParams}`);
                } else {
                    console.warn('父窗口中未找到loadSubPage函数');
                    this.fallbackNavigation(urlWithParams);
                }
            }, 100);
        } catch (error) {
            console.error('父窗口导航失败:', error);
            this.fallbackNavigation(urlWithParams);
        }
    }

    // 在当前窗口中导航
    navigateInCurrentWindow(config, urlWithParams) {
        if (window.switchModule && window.loadSubPage) {
            // 首先切换到对应模块
            window.switchModule(config.module);
            console.log(`在当前窗口切换到模块: ${config.module}`);

            // 然后加载具体页面
            setTimeout(() => {
                window.loadSubPage(urlWithParams, config.title);
                console.log(`在当前窗口加载页面: ${urlWithParams}`);
            }, 100);
        } else {
            console.warn('当前窗口中未找到导航函数');
            this.fallbackNavigation(urlWithParams);
        }
    }

    // 备用导航方案
    fallbackNavigation(urlWithParams) {
        console.log('使用备用导航方案，在新标签页中打开:', urlWithParams);
        window.open(urlWithParams, '_blank');
    }



    // 显示导航反馈
    showNavigationFeedback(type, docNumber) {
        const results = document.getElementById('ai-results');
        if (!results) return;

        // 在结果区域顶部添加导航提示
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg';
        feedbackDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-arrow-right text-blue-600"></i>
                <span class="text-sm text-blue-800">
                    正在导航到 <strong>${type}</strong> - <strong>${docNumber}</strong>
                </span>
            </div>
        `;

        // 插入到结果区域的开头
        const firstChild = results.firstChild;
        if (firstChild) {
            results.insertBefore(feedbackDiv, firstChild);
        } else {
            results.appendChild(feedbackDiv);
        }

        // 3秒后移除提示
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.remove();
            }
        }, 3000);
    }

    // 初始化业务数据
    initBusinessData() {
        return {
            // 需求计划时间线
            demandTimeline: {
                'DM202501001': [
                    {
                        time: '2025-01-15 09:00',
                        type: '需求计划',
                        docNumber: 'DM202501001',
                        status: '已完成',
                        person: '计划员张三',
                        data: '需求数量: 100台 变频器-5KW'
                    },
                    {
                        time: '2025-01-15 14:00',
                        type: '主生产计划',
                        docNumber: 'MPS202501001',
                        status: '已完成',
                        person: '计划主管李四',
                        data: '计划产量: 100台, 计划完成: 2025-01-25'
                    },
                    {
                        time: '2025-01-16 08:00',
                        type: '生产工单',
                        docNumber: 'WO202501001',
                        status: '进行中',
                        person: '生产主管王五',
                        data: '当前进度: 65%, 预计完成: 2025-01-24'
                    },
                    {
                        time: '2025-01-16 08:30',
                        type: '物料需求',
                        docNumber: 'MR202501001',
                        status: '已完成',
                        person: '物料员赵六',
                        data: '需求物料: 电容器100个, IC芯片100个'
                    },
                    {
                        time: '2025-01-16 09:00',
                        type: '采购订单',
                        docNumber: 'PO202501001',
                        status: '已完成',
                        person: '采购员孙七',
                        data: '采购金额: ¥25,000, 供应商: 深圳电子'
                    },
                    {
                        time: '2025-01-17 10:00',
                        type: '收货入库',
                        docNumber: 'IN202501001',
                        status: '已完成',
                        person: '仓管员周八',
                        data: '入库数量: 100套, 质检合格率: 100%'
                    },
                    {
                        time: '2025-01-24 16:00',
                        type: '成品入库',
                        docNumber: 'FIN202501001',
                        status: '待开始',
                        person: '仓管员钱九',
                        data: '预计入库: 100台, 质检状态: 待检'
                    },
                    {
                        time: '2025-01-25 09:00',
                        type: '销售订单',
                        docNumber: 'SO202501001',
                        status: '待开始',
                        person: '销售员吴十',
                        data: '客户: 上海电力公司, 交付日期: 2025-01-28'
                    },
                    {
                        time: '2025-01-25 14:00',
                        type: '成品出库',
                        docNumber: 'OUT202501001',
                        status: '待开始',
                        person: '物流员郑一',
                        data: '出库数量: 100台, 运输方式: 物流配送'
                    }
                ],
                'DM202501002': [
                    {
                        time: '2025-01-16 10:00',
                        type: '需求计划',
                        docNumber: 'DM202501002',
                        status: '已完成',
                        person: '计划员张三',
                        data: '需求数量: 50台 变频器-10KW'
                    },
                    {
                        time: '2025-01-16 15:00',
                        type: '主生产计划',
                        docNumber: 'MPS202501002',
                        status: '进行中',
                        person: '计划主管李四',
                        data: '计划产量: 50台, 计划完成: 2025-01-30'
                    },
                    {
                        time: '2025-01-17 08:00',
                        type: '生产工单',
                        docNumber: 'WO202501002',
                        status: '待开始',
                        person: '生产主管王五',
                        data: '排产计划: 2025-01-20开始'
                    }
                ]
            },

            // 主生产计划时间线
            mpsTimeline: {
                'MPS202501001': [
                    {
                        time: '2025-01-15 09:00',
                        type: '需求计划',
                        docNumber: 'DM202501001',
                        status: '已完成',
                        person: '计划员张三',
                        data: '需求来源: 客户订单'
                    },
                    {
                        time: '2025-01-15 14:00',
                        type: '主生产计划',
                        docNumber: 'MPS202501001',
                        status: '已完成',
                        person: '计划主管李四',
                        data: '当前节点: 计划制定完成'
                    },
                    {
                        time: '2025-01-16 08:00',
                        type: '生产工单',
                        docNumber: 'WO202501001',
                        status: '进行中',
                        person: '生产主管王五',
                        data: '工单状态: 生产中'
                    }
                ]
            },

            // 生产工单时间线
            workOrderTimeline: {
                'WO202501001': [
                    {
                        time: '2025-01-15 14:00',
                        type: '主生产计划',
                        docNumber: 'MPS202501001',
                        status: '已完成',
                        person: '计划主管李四',
                        data: '计划来源'
                    },
                    {
                        time: '2025-01-16 08:00',
                        type: '生产工单',
                        docNumber: 'WO202501001',
                        status: '进行中',
                        person: '生产主管王五',
                        data: '当前工序: SMT贴片, 进度: 65%'
                    },
                    {
                        time: '2025-01-16 08:15',
                        type: '首件检验',
                        docNumber: 'IPQC202501001',
                        status: '已完成',
                        person: '质检员李检',
                        data: '首件检验合格'
                    },
                    {
                        time: '2025-01-17 14:30',
                        type: '过程检验',
                        docNumber: 'IPQC202501002',
                        status: '进行中',
                        person: '质检员王检',
                        data: '巡检进行中'
                    }
                ]
            },

            // 采购订单时间线
            purchaseTimeline: {
                'PO202501001': [
                    {
                        time: '2025-01-16 08:30',
                        type: '物料需求',
                        docNumber: 'MR202501001',
                        status: '已完成',
                        person: '物料员赵六',
                        data: '需求来源'
                    },
                    {
                        time: '2025-01-16 09:00',
                        type: '采购订单',
                        docNumber: 'PO202501001',
                        status: '已完成',
                        person: '采购员孙七',
                        data: '当前状态: 已下单'
                    },
                    {
                        time: '2025-01-17 10:00',
                        type: '收货入库',
                        docNumber: 'IN202501001',
                        status: '已完成',
                        person: '仓管员周八',
                        data: '收货完成, 质检合格'
                    }
                ]
            },

            // 销售订单时间线
            salesTimeline: {
                'SO202501001': [
                    {
                        time: '2025-01-14 14:00',
                        type: '客户询价',
                        docNumber: 'INQ202501001',
                        status: '已完成',
                        person: '销售员吴十',
                        data: '客户: 上海电力公司'
                    },
                    {
                        time: '2025-01-15 09:00',
                        type: '需求计划',
                        docNumber: 'DM202501001',
                        status: '已完成',
                        person: '计划员张三',
                        data: '需求确认'
                    },
                    {
                        time: '2025-01-25 09:00',
                        type: '销售订单',
                        docNumber: 'SO202501001',
                        status: '待开始',
                        person: '销售员吴十',
                        data: '合同金额: ¥150,000'
                    },
                    {
                        time: '2025-01-25 14:00',
                        type: '成品出库',
                        docNumber: 'OUT202501001',
                        status: '待开始',
                        person: '物流员郑一',
                        data: '预计发货: 2025-01-26'
                    }
                ]
            }
        };
    }
}

// 全局实例
let digitalFactoryAI;

// 页面加载完成后初始化AI助手
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否在iframe中运行，如果是则不初始化AI助手
    // 只在顶级窗口中初始化AI助手，避免重复显示
    if (window.self === window.top) {
        digitalFactoryAI = new DigitalFactoryAI();
        console.log('AI助手已在顶级窗口中初始化');
    } else {
        console.log('检测到iframe环境，跳过AI助手初始化');
    }
});
