// 闲置设备管理 - JavaScript
let currentView = 'pool';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam && ['pool', 'evaluation', 'transfer', 'disposal'].includes(viewParam)) {
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
        pool: `<div class="grid grid-cols-4 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">闲置设备总数</div>
                <div class="text-3xl font-bold text-gray-800">28</div>
                <div class="mt-3 text-sm text-gray-500"><i class="fas fa-arrow-up text-orange-600 mr-1"></i>较上月 +3台</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">闲置资产价值</div>
                <div class="text-3xl font-bold text-gray-800">¥2.8M</div>
                <div class="mt-3 text-sm text-gray-500">占总资产 12.5%</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">本月调拨</div>
                <div class="text-3xl font-bold text-green-600">5</div>
                <div class="mt-3 text-sm text-gray-500">节省采购成本 ¥180K</div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="text-sm text-gray-600 mb-1">待处置设备</div>
                <div class="text-3xl font-bold text-red-600">8</div>
                <div class="mt-3 text-sm text-gray-500">需尽快评估处理</div>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border">
            <div class="p-6 border-b"><h3 class="text-lg font-semibold">闲置设备资源池</h3></div>
            <div class="p-6"><p class="text-gray-600">闲置设备列表展示区域...</p></div>
        </div>`,
        evaluation: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">设备评估管理</h3>
            <p class="text-gray-600">设备评估流程和记录...</p>
        </div>`,
        transfer: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">调拨管理</h3>
            <p class="text-gray-600">设备调拨申请和审批流程...</p>
        </div>`,
        disposal: `<div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">处置管理</h3>
            <p class="text-gray-600">设备处置申请和执行记录...</p>
        </div>`
    };
    contentArea.innerHTML = views[viewType] || views.pool;
}
