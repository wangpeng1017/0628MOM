// 技改管理 - JavaScript
let currentView = 'projects';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['projects', 'approval', 'execution', 'acceptance'].includes(viewParam)) {
        currentView = viewParam;
    }
    switchView(currentView);
});

function switchView(viewType) {
    currentView = viewType;
    document.querySelectorAll('[id^="view-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    });
    document.getElementById(`view-${viewType}`).classList.remove('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    document.getElementById(`view-${viewType}`).classList.add('bg-primary', 'text-white');
    renderView(viewType);
}

function renderView(viewType) {
    const contentArea = document.getElementById('content-area');
    const views = {
        projects: `<div class="grid grid-cols-4 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">进行中项目</div>
                <div class="text-3xl font-bold text-blue-600">8</div>
                <div class="mt-3 text-sm text-gray-500">总预算 ¥2.5M</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">待审批项目</div>
                <div class="text-3xl font-bold text-orange-600">3</div>
                <div class="mt-3 text-sm text-gray-500">预估投资 ¥850K</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">本年完成</div>
                <div class="text-3xl font-bold text-green-600">15</div>
                <div class="mt-3 text-sm text-gray-500">实际投资 ¥3.2M</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">平均ROI</div>
                <div class="text-3xl font-bold text-green-600">28%</div>
                <div class="mt-3 text-sm text-gray-500">效益显著</div>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-6 border-b flex justify-between items-center">
                <h3 class="text-lg font-semibold">技改项目列表</h3>
                <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700">
                    <i class="fas fa-plus mr-2"></i>新建技改项目
                </button>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">老化测试台通道扩容</h4>
                                <div class="text-sm text-gray-600">项目编号: TR-2024-001 | 负责人: 小李</div>
                            </div>
                            <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">进行中</span>
                        </div>
                        <div class="grid grid-cols-4 gap-4 text-sm mb-3">
                            <div><span class="text-gray-600">预算:</span> <span class="font-medium">¥50,000</span></div>
                            <div><span class="text-gray-600">已用:</span> <span class="font-medium">¥32,000</span></div>
                            <div><span class="text-gray-600">进度:</span> <span class="font-medium">65%</span></div>
                            <div><span class="text-gray-600">预期收益:</span> <span class="font-medium text-green-600">效率提升100%</span></div>
                        </div>
                        <div class="flex justify-end gap-2">
                            <button class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">查看详情</button>
                            <button class="px-3 py-1 text-sm text-green-600 hover:text-green-800">更新进度</button>
                        </div>
                    </div>
                    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">注塑机自动化改造</h4>
                                <div class="text-sm text-gray-600">项目编号: TR-2024-002 | 负责人: 王工</div>
                            </div>
                            <span class="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">待审批</span>
                        </div>
                        <div class="grid grid-cols-4 gap-4 text-sm mb-3">
                            <div><span class="text-gray-600">预算:</span> <span class="font-medium">¥280,000</span></div>
                            <div><span class="text-gray-600">已用:</span> <span class="font-medium">¥0</span></div>
                            <div><span class="text-gray-600">进度:</span> <span class="font-medium">0%</span></div>
                            <div><span class="text-gray-600">预期收益:</span> <span class="font-medium text-green-600">人力节省50%</span></div>
                        </div>
                        <div class="flex justify-end gap-2">
                            <button class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">查看详情</button>
                            <button class="px-3 py-1 text-sm text-orange-600 hover:text-orange-800">审批</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        approval: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">审批流程管理</h3>
            <p class="text-gray-600">技改项目审批流程配置和审批记录...</p>
        </div>`,
        execution: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">执行跟踪</h3>
            <p class="text-gray-600">技改项目执行进度跟踪和成本核算...</p>
        </div>`,
        acceptance: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">验收评估</h3>
            <p class="text-gray-600">技改项目验收和效益评估...</p>
        </div>`
    };
    contentArea.innerHTML = views[viewType] || views.projects;
}
