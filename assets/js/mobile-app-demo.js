// 移动应用DEMO - JavaScript
let currentRole = 'operator';

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    switchRole('operator');
});

// 切换角色
function switchRole(role) {
    currentRole = role;
    
    // 更新按钮样式
    document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    });
    document.getElementById(`btn-${role}`).classList.remove('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    document.getElementById(`btn-${role}`).classList.add('bg-primary', 'text-white');
    
    // 渲染对应角色的工作台
    renderWorkspace(role);
}

// 渲染工作台内容
function renderWorkspace(role) {
    const content = document.getElementById('mobile-content');
    
    switch(role) {
        case 'operator':
            content.innerHTML = getOperatorWorkspace();
            break;
        case 'technician':
            content.innerHTML = getTechnicianWorkspace();
            break;
        case 'manager':
            content.innerHTML = getManagerWorkspace();
            break;
    }
}

// 操作员工作台
function getOperatorWorkspace() {
    return `
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 pb-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <i class="fas fa-user-hard-hat text-blue-600"></i>
                    </div>
                    <div>
                        <div class="text-sm opacity-90">操作员</div>
                        <div class="font-semibold">张三</div>
                    </div>
                </div>
                <button class="text-white">
                    <i class="fas fa-bell text-xl"></i>
                </button>
            </div>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div class="text-sm opacity-90 mb-1">今日任务</div>
                <div class="flex items-center gap-4">
                    <div>
                        <div class="text-2xl font-bold">3</div>
                        <div class="text-xs opacity-90">待巡检</div>
                    </div>
                    <div class="w-px h-8 bg-white opacity-30"></div>
                    <div>
                        <div class="text-2xl font-bold">1</div>
                        <div class="text-xs opacity-90">待处理</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="p-4">
            <div class="grid grid-cols-3 gap-3 mb-6">
                <button onclick="showFeature('扫码报修')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-qrcode text-red-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">扫码报修</div>
                </button>
                
                <button onclick="showFeature('设备SOP')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-book-open text-blue-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">设备SOP</div>
                </button>
                
                <button onclick="showFeature('巡检任务')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-clipboard-check text-green-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">巡检任务</div>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">我的巡检任务</h3>
                    <a href="#" class="text-xs text-blue-600">查看全部</a>
                </div>
                
                <div class="space-y-2">
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="font-medium text-sm text-gray-800">生产线A日常巡检</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-clock mr-1"></i>08:00 - 09:00
                                </div>
                            </div>
                            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">待执行</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-600">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>生产车间A区</span>
                        </div>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="font-medium text-sm text-gray-800">注塑机设备检查</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-clock mr-1"></i>14:00 - 15:00
                                </div>
                            </div>
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">已安排</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-600">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>注塑车间</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">设备状态</h3>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div class="text-2xl font-bold text-green-600">12</div>
                        <div class="text-xs text-gray-600">运行正常</div>
                    </div>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div class="text-2xl font-bold text-red-600">1</div>
                        <div class="text-xs text-gray-600">异常报警</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 维修员工作台
function getTechnicianWorkspace() {
    return `
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 pb-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <i class="fas fa-user-cog text-orange-600"></i>
                    </div>
                    <div>
                        <div class="text-sm opacity-90">维修员</div>
                        <div class="font-semibold">李工</div>
                    </div>
                </div>
                <button class="text-white">
                    <i class="fas fa-bell text-xl"></i>
                </button>
            </div>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div class="text-sm opacity-90 mb-1">工单统计</div>
                <div class="flex items-center gap-4">
                    <div>
                        <div class="text-2xl font-bold">5</div>
                        <div class="text-xs opacity-90">待处理</div>
                    </div>
                    <div class="w-px h-8 bg-white opacity-30"></div>
                    <div>
                        <div class="text-2xl font-bold">2</div>
                        <div class="text-xs opacity-90">进行中</div>
                    </div>
                    <div class="w-px h-8 bg-white opacity-30"></div>
                    <div>
                        <div class="text-2xl font-bold">15</div>
                        <div class="text-xs opacity-90">本周完成</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="p-4">
            <div class="grid grid-cols-3 gap-3 mb-6">
                <button onclick="showFeature('我的工单')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-clipboard-list text-orange-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">我的工单</div>
                </button>
                
                <button onclick="showFeature('扫码领料')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-qrcode text-blue-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">扫码领料</div>
                </button>
                
                <button onclick="showFeature('知识库')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-book text-purple-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">知识库</div>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">待办工单</h3>
                    <a href="#" class="text-xs text-blue-600">查看全部</a>
                </div>
                
                <div class="space-y-2">
                    <div class="bg-white border-l-4 border-red-500 shadow-sm rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">紧急</span>
                                    <span class="text-xs text-gray-500">#WO-2024-0628-001</span>
                                </div>
                                <div class="font-medium text-sm text-gray-800">注塑机A1主轴异响</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-clock mr-1"></i>2小时前
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-600">
                                <i class="fas fa-map-marker-alt mr-1"></i>生产车间A区
                            </span>
                            <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                立即处理
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white border-l-4 border-yellow-500 shadow-sm rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">普通</span>
                                    <span class="text-xs text-gray-500">#WO-2024-0628-002</span>
                                </div>
                                <div class="font-medium text-sm text-gray-800">冲压机B1定期保养</div>
                                <div class="text-xs text-gray-500 mt-1">
                                    <i class="fas fa-clock mr-1"></i>计划时间: 14:00
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-gray-600">
                                <i class="fas fa-map-marker-alt mr-1"></i>冲压车间
                            </span>
                            <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                                查看详情
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">常用工具</h3>
                </div>
                
                <div class="grid grid-cols-4 gap-2">
                    <button class="bg-white border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                        <i class="fas fa-tools text-gray-600 text-lg mb-1"></i>
                        <div class="text-xs text-gray-700">工具箱</div>
                    </button>
                    <button class="bg-white border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                        <i class="fas fa-camera text-gray-600 text-lg mb-1"></i>
                        <div class="text-xs text-gray-700">拍照</div>
                    </button>
                    <button class="bg-white border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                        <i class="fas fa-file-alt text-gray-600 text-lg mb-1"></i>
                        <div class="text-xs text-gray-700">报告</div>
                    </button>
                    <button class="bg-white border border-gray-200 rounded-lg p-2 text-center hover:shadow-md transition-shadow">
                        <i class="fas fa-history text-gray-600 text-lg mb-1"></i>
                        <div class="text-xs text-gray-700">历史</div>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 管理人员工作台
function getManagerWorkspace() {
    return `
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 pb-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <i class="fas fa-user-tie text-indigo-600"></i>
                    </div>
                    <div>
                        <div class="text-sm opacity-90">管理人员</div>
                        <div class="font-semibold">王经理</div>
                    </div>
                </div>
                <button class="text-white">
                    <i class="fas fa-bell text-xl"></i>
                </button>
            </div>
            
            <div class="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <div class="text-sm opacity-90 mb-1">今日概览</div>
                <div class="flex items-center gap-3">
                    <div>
                        <div class="text-2xl font-bold">78.5%</div>
                        <div class="text-xs opacity-90">OEE</div>
                    </div>
                    <div class="w-px h-8 bg-white opacity-30"></div>
                    <div>
                        <div class="text-2xl font-bold">3</div>
                        <div class="text-xs opacity-90">待审批</div>
                    </div>
                    <div class="w-px h-8 bg-white opacity-30"></div>
                    <div>
                        <div class="text-2xl font-bold">2</div>
                        <div class="text-xs opacity-90">预警</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="p-4">
            <div class="grid grid-cols-3 gap-3 mb-6">
                <button onclick="showFeature('OEE看板')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-chart-line text-teal-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">OEE看板</div>
                </button>
                
                <button onclick="showFeature('工单审批')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-check-circle text-orange-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">工单审批</div>
                </button>
                
                <button onclick="showFeature('报表速览')" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-file-chart-line text-purple-600 text-xl"></i>
                    </div>
                    <div class="text-xs text-gray-700 font-medium">报表速览</div>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">OEE关键指标</h3>
                    <a href="#" class="text-xs text-blue-600">详细报表</a>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-2xl font-bold text-indigo-600">78.5%</div>
                            <div class="text-xs text-gray-600 mt-1">综合OEE</div>
                            <div class="text-xs text-green-600 mt-1">
                                <i class="fas fa-arrow-up"></i> +2.3%
                            </div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-green-600">85.2%</div>
                            <div class="text-xs text-gray-600 mt-1">可用率</div>
                            <div class="text-xs text-green-600 mt-1">
                                <i class="fas fa-arrow-up"></i> +1.8%
                            </div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-blue-600">92.1%</div>
                            <div class="text-xs text-gray-600 mt-1">性能率</div>
                            <div class="text-xs text-yellow-600 mt-1">
                                <i class="fas fa-arrow-up"></i> +0.5%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">待审批事项</h3>
                    <a href="#" class="text-xs text-blue-600">查看全部</a>
                </div>
                
                <div class="space-y-2">
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="font-medium text-sm text-gray-800">备件采购申请</div>
                                <div class="text-xs text-gray-500 mt-1">申请人: 李工 | 金额: ¥15,800</div>
                            </div>
                            <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">待审批</span>
                        </div>
                        <div class="flex gap-2">
                            <button class="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                批准
                            </button>
                            <button class="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                                拒绝
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="font-medium text-sm text-gray-800">设备大修计划</div>
                                <div class="text-xs text-gray-500 mt-1">申请人: 张工 | 预算: ¥50,000</div>
                            </div>
                            <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">待审批</span>
                        </div>
                        <div class="flex gap-2">
                            <button class="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                批准
                            </button>
                            <button class="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                                拒绝
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-800">设备预警</h3>
                </div>
                
                <div class="space-y-2">
                    <div class="bg-red-50 border-l-4 border-red-500 rounded p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <i class="fas fa-exclamation-triangle text-red-600"></i>
                            <span class="font-medium text-sm text-red-800">注塑机A1温度异常</span>
                        </div>
                        <div class="text-xs text-gray-600">当前温度: 185°C (正常范围: 160-180°C)</div>
                    </div>
                    
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 rounded p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <i class="fas fa-exclamation-circle text-yellow-600"></i>
                            <span class="font-medium text-sm text-yellow-800">备件库存不足</span>
                        </div>
                        <div class="text-xs text-gray-600">液压油滤芯库存: 2个 (安全库存: 5个)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 显示功能提示
function showFeature(featureName) {
    alert(`${featureName}功能演示\n\n这是一个移动端DEMO页面，展示了${featureName}的界面设计。\n实际应用中，此功能将包含完整的交互逻辑和数据处理。`);
}
