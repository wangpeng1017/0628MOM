// 设备智能体 - JavaScript
let chatHistory = [];
let conversationContext = {
    currentTopic: null,
    diagnosisStep: 0,
    equipment: null,
    symptom: null
};

// 模拟AI回复的知识库（增强版）
const knowledgeBase = {
    '注塑机温度控制异常': {
        diagnosis: '注塑机温度控制异常可能由以下原因引起：',
        steps: [
            '1. 检查温控传感器是否正常工作',
            '2. 检查加热圈是否损坏',
            '3. 检查温控器参数设置是否正确',
            '4. 检查电气接线是否松动'
        ],
        cases: [
            { title: 'XX品牌注塑机温控故障案例', similarity: '95%' },
            { title: '加热圈老化导致温度不稳定', similarity: '88%' }
        ],
        parts: ['温控传感器', '加热圈', '温控器模块']
    },
    '伺服电机定位不准': {
        diagnosis: '伺服电机定位不准通常与编码器或参数设置有关：',
        steps: [
            '1. 检查编码器信号线是否受干扰',
            '2. 检查机械连接是否松动',
            '3. 重新校准编码器零点',
            '4. 检查伺服驱动器参数设置'
        ],
        cases: [
            { title: '伺服电机编码器干扰问题排查', similarity: '92%' },
            { title: '机械传动间隙导致定位误差', similarity: '85%' }
        ],
        parts: ['编码器', '伺服驱动器', '联轴器']
    },
    '液压系统压力不足': {
        diagnosis: '液压系统压力不足可能的原因：',
        steps: [
            '1. 检查液压油油位是否充足',
            '2. 检查液压泵是否正常工作',
            '3. 检查溢流阀设定压力',
            '4. 检查管路是否有泄漏'
        ],
        cases: [
            { title: '液压泵磨损导致压力下降', similarity: '90%' },
            { title: '溢流阀卡滞故障处理', similarity: '82%' }
        ],
        parts: ['液压油', '液压泵', '溢流阀', '密封件']
    },
    '变频器报警': {
        diagnosis: '变频器报警代码E03通常表示过流保护：',
        steps: [
            '1. 检查电机负载是否过大',
            '2. 检查变频器参数设置是否合理',
            '3. 检查电机绝缘是否良好',
            '4. 检查变频器散热是否正常'
        ],
        cases: [
            { title: '变频器过流保护故障分析', similarity: '94%' },
            { title: '电机匝间短路导致过流', similarity: '87%' }
        ],
        parts: ['变频器', '电机', '散热风扇']
    },
    '绕线机断线': {
        diagnosis: '绕线机频繁断线问题分析：',
        followUpQuestions: [
            '断线主要发生在启动、高速运行还是停止阶段？',
            '断线位置是固定的还是随机的？',
            '最近是否更换过线材或调整过参数？'
        ],
        steps: [
            '1. 检查张力控制器设置和实时张力值',
            '2. 检查过线导轮是否光滑无毛刺',
            '3. 检查绕线程序参数是否合理',
            '4. 检查张力传感器及其线路'
        ],
        cases: [
            { title: 'XX绕线机高速断线问题解决方案', similarity: '92%' },
            { title: '张力控制器故障导致断线', similarity: '88%' },
            { title: '传感器线路干扰引起张力波动', similarity: '85%' }
        ],
        parts: ['张力控制器', '张力传感器', '过线导轮', '信号线']
    }
};

// 发送消息
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    input.value = '';
    
    // 显示输入中状态
    showTypingIndicator();
    
    // 模拟AI思考延迟
    setTimeout(() => {
        hideTypingIndicator();
        generateAIResponse(message);
    }, 1500);
}

// 快捷问题
function quickQuestion(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

// 添加消息到聊天区
function addMessage(content, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    if (type === 'user') {
        messageDiv.className = 'flex items-start gap-3 justify-end';
        messageDiv.innerHTML = `
            <div class="message-bubble bg-primary text-white rounded-lg p-4">
                <div class="text-sm">${content}</div>
            </div>
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-gray-600"></i>
            </div>
        `;
    } else {
        messageDiv.className = 'flex items-start gap-3';
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-white"></i>
            </div>
            <div class="message-bubble bg-gray-100 rounded-lg p-4">
                <div class="text-sm text-gray-800">${content}</div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatHistory.push({ content, type, timestamp: new Date() });
}

// 显示输入中指示器
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex items-start gap-3';
    typingDiv.innerHTML = `
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-white"></i>
        </div>
        <div class="message-bubble bg-gray-100 rounded-lg p-4">
            <div class="typing-indicator flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 隐藏输入中指示器
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// 生成AI回复
function generateAIResponse(userMessage) {
    let response = '';
    let matchedKnowledge = null;
    let matchedKey = null;
    
    // 增强的关键词匹配
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (userMessage.includes(key.split('').slice(0, 4).join('')) || 
            userMessage.includes('温度') && key.includes('温度') ||
            userMessage.includes('伺服') && key.includes('伺服') ||
            userMessage.includes('液压') && key.includes('液压') ||
            userMessage.includes('变频器') && key.includes('变频器') ||
            userMessage.includes('绕线') && key.includes('绕线') ||
            userMessage.includes('断线') && key.includes('断线')) {
            matchedKnowledge = value;
            matchedKey = key;
            conversationContext.currentTopic = key;
            conversationContext.diagnosisStep = 1;
            break;
        }
    }
    
    // 检查是否是对多轮对话的回复
    if (conversationContext.currentTopic && conversationContext.diagnosisStep > 0) {
        if (userMessage.includes('高速') || userMessage.includes('运行')) {
            response = generateFollowUpResponse(userMessage);
            addMessage(response, 'ai');
            return;
        }
    }
    
    if (matchedKnowledge) {
        // 构建详细回复
        response = `
            <div class="space-y-3">
                <p class="font-medium text-gray-900">🔍 ${matchedKnowledge.diagnosis}</p>
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="font-medium text-blue-900 mb-2">📋 排查步骤：</p>
                    ${matchedKnowledge.steps.map(step => `<p class="text-sm text-blue-800">${step}</p>`).join('')}
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                    <p class="font-medium text-green-900 mb-2">📚 相关案例推荐：</p>
                    ${matchedKnowledge.cases.map(c => `
                        <div class="flex justify-between items-center text-sm mb-1">
                            <span class="text-green-800">• ${c.title}</span>
                            <span class="text-green-600 font-medium">${c.similarity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="bg-purple-50 p-3 rounded-lg">
                    <p class="font-medium text-purple-900 mb-2">🔧 可能需要的备件：</p>
                    <div class="flex flex-wrap gap-2">
                        ${matchedKnowledge.parts.map(part => `
                            <span class="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">${part}</span>
                        `).join('')}
                    </div>
                </div>
                <p class="text-sm text-gray-600 mt-3">💡 如需更详细的指导，请告诉我具体的故障现象或上传现场照片。</p>
            </div>
        `;
    } else if (userMessage.includes('保养周期') || userMessage.includes('多久')) {
        response = `
            <p>根据设备型号和使用情况，保养周期建议如下：</p>
            <ul class="mt-2 space-y-1 text-sm">
                <li>• 日常点检：每班次</li>
                <li>• 一级保养：每周</li>
                <li>• 二级保养：每月</li>
                <li>• 三级保养：每季度</li>
            </ul>
            <p class="mt-3 text-sm text-gray-600">请提供具体的设备编号，我可以查询该设备的详细保养计划。</p>
        `;
    } else if (userMessage.includes('库存') || userMessage.includes('备件')) {
        response = `
            <p>正在查询备件库存信息...</p>
            <div class="mt-3 bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700">请提供备件编号或名称，我可以帮您查询：</p>
                <ul class="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• 当前库存数量</li>
                    <li>• 存放位置</li>
                    <li>• 最近领用记录</li>
                    <li>• 预警状态</li>
                </ul>
            </div>
        `;
    } else {
        response = `
            <p>我理解您的问题了。让我为您分析一下：</p>
            <p class="mt-2">基于您的描述，我建议：</p>
            <ol class="mt-2 space-y-1 text-sm list-decimal list-inside">
                <li>先检查设备的基本运行参数是否正常</li>
                <li>查看设备最近的维修保养记录</li>
                <li>如果问题持续，建议联系专业工程师现场诊断</li>
            </ol>
            <p class="mt-3 text-sm text-gray-600">您能提供更多细节吗？比如：</p>
            <ul class="mt-1 space-y-1 text-sm text-gray-600">
                <li>• 设备型号和编号</li>
                <li>• 具体的故障现象</li>
                <li>• 故障发生的时间和频率</li>
            </ul>
        `;
    }
    
    addMessage(response, 'ai');
}

// 生成多轮对话的跟进回复
function generateFollowUpResponse(userMessage) {
    let response = '';
    
    if (userMessage.includes('高速') && conversationContext.currentTopic === '绕线机断线') {
        conversationContext.diagnosisStep = 2;
        response = `
            <div class="space-y-3">
                <p class="font-medium text-gray-900">✅ 了解了，高速运行时断线。</p>
                <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <p class="font-semibold text-indigo-900 mb-2">🎯 智能诊断与推荐</p>
                    <div class="space-y-2 text-sm">
                        <div class="bg-white p-3 rounded">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">相似度 92%</span>
                                <span class="font-medium text-gray-900">Top 1 案例</span>
                            </div>
                            <p class="text-gray-700">XX绕线机高速断线问题解决方案</p>
                            <p class="text-xs text-gray-500 mt-1">摘要：与张力控制器设置有关</p>
                        </div>
                        <div class="bg-white p-3 rounded">
                            <div class="font-medium text-gray-900 mb-1">📄 SOP文档</div>
                            <p class="text-gray-700">XX绕线机张力系统调试标准作业程序</p>
                        </div>
                    </div>
                </div>
                <div class="bg-yellow-50 p-3 rounded-lg">
                    <p class="font-medium text-yellow-900 mb-2">💡 诊断引导</p>
                    <p class="text-sm text-yellow-800 mb-2">高速断线最常见的三个原因：</p>
                    <ol class="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                        <li>张力过大或不稳</li>
                        <li>过线导轮不光滑</li>
                        <li>绕线程序参数问题</li>
                    </ol>
                    <p class="text-sm text-yellow-900 mt-3 font-medium">🔧 建议您首先检查张力控制器，实时张力值是多少？</p>
                </div>
                <div class="flex gap-2 mt-3">
                    <button onclick="quickAnswer('张力值不稳定，在50-100g之间跳动')" class="px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors">
                        张力不稳定
                    </button>
                    <button onclick="quickAnswer('张力正常，稳定在80g左右')" class="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        张力正常
                    </button>
                </div>
            </div>
        `;
    } else if (userMessage.includes('张力') && userMessage.includes('不稳')) {
        conversationContext.diagnosisStep = 3;
        response = `
            <div class="space-y-3">
                <p class="font-medium text-gray-900">🎯 张力波动大通常是由于张力传感器或其线路故障。</p>
                <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <p class="font-semibold text-red-900 mb-2">🔍 重点排查</p>
                    <div class="space-y-2 text-sm text-red-800">
                        <p>✓ 检查传感器连接线是否有松动或磨损</p>
                        <p>✓ 检查信号线屏蔽层是否完好</p>
                        <p>✓ 检查传感器本体是否有机械损伤</p>
                    </div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="font-medium text-blue-900 mb-2">📐 技术资料</p>
                    <button class="text-sm text-blue-700 hover:text-blue-900 underline">
                        <i class="fas fa-file-pdf mr-1"></i>查看该传感器的电气图纸
                    </button>
                </div>
                <div class="bg-purple-50 p-3 rounded-lg">
                    <p class="font-medium text-purple-900 mb-2">🔧 可能需要的备件</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span class="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">张力传感器</span>
                        <span class="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">屏蔽信号线</span>
                        <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">库存: 2个</span>
                    </div>
                </div>
                <div class="bg-green-50 p-3 rounded-lg mt-3">
                    <p class="text-sm text-green-800">💬 如果问题解决，请告诉我结果，我会帮您记录到知识库中。</p>
                </div>
            </div>
        `;
    }
    
    return response;
}

// 快速回答（用于多轮对话的快捷按钮）
function quickAnswer(answer) {
    document.getElementById('user-input').value = answer;
    sendMessage();
}

// 保存对话为知识案例
function saveAsKnowledge() {
    if (chatHistory.length < 4) {
        alert('对话内容太少，无法生成知识案例');
        return;
    }
    
    const caseData = {
        problem: conversationContext.currentTopic,
        equipment: conversationContext.equipment,
        symptom: conversationContext.symptom,
        conversation: chatHistory,
        timestamp: new Date()
    };
    
    // 模拟保存到后台
    console.log('保存知识案例:', caseData);
    
    addMessage(`
        <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p class="font-semibold text-green-900 mb-2">✅ 知识案例已生成</p>
            <p class="text-sm text-green-800">本次诊断对话已自动整理为维修案例草稿，已提交给设备主管审核。</p>
            <p class="text-xs text-green-700 mt-2">审核通过后将加入知识库，帮助更多工程师。</p>
        </div>
    `, 'ai');
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('设备智能体已就绪 - 增强版');
    
    // 添加保存知识按钮到页面（可选）
    const headerButtons = document.querySelector('.flex.items-center.gap-3');
    if (headerButtons && chatHistory.length > 0) {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700';
        saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>保存为知识';
        saveBtn.onclick = saveAsKnowledge;
        // headerButtons.appendChild(saveBtn);
    }
});
