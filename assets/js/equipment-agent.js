// 设备智能体 - JavaScript (深度增强版 - 集成Google Gemini)
let chatHistory = [];
let conversationContext = {
    currentTopic: null,
    diagnosisStep: 0,
    equipment: null,
    symptom: null,
    relatedCases: [],
    suggestedParts: [],
    diagnosisPath: []
};

// 语音识别状态
let isRecording = false;
let recognition = null;

// Google Gemini API配置
const GEMINI_API_KEY = 'AIzaSyACaQWzNKYvYUvAFNkL4lxWtrcevqNZZ8A';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// 系统提示词 - 设备维修专家角色
const SYSTEM_PROMPT = `你是一个专业的设备维修智能助手，具备以下能力：

1. **设备故障诊断**：能够通过多轮对话引导用户排查设备故障
2. **知识推荐**：根据问题推荐相关的维修案例、SOP文档和技术资料
3. **备件建议**：推荐可能需要的备件和库存信息
4. **专业指导**：提供专业的维修步骤和注意事项

你的回复应该：
- 简洁明了，重点突出
- 使用中文回复
- 包含具体的排查步骤
- 必要时提出澄清性问题
- 推荐相关案例和备件
- 使用专业但易懂的语言

当前可用的设备类型：注塑机、绕线机、伺服电机、液压系统、变频器、测试设备等。

请根据用户的问题，提供专业的诊断和建议。`;

// 固定使用真实LLM
const USE_REAL_LLM = true;

// 模拟向量数据库（RAG检索）
const vectorDatabase = {
    embeddings: new Map(),
    searchSimilar: function(query, topK = 3) {
        // 模拟语义相似度搜索
        const results = [];
        for (const [key, value] of Object.entries(knowledgeBase)) {
            const similarity = calculateSimilarity(query, key);
            if (similarity > 0.3) {
                results.push({ key, value, similarity });
            }
        }
        return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
    }
};

// 简单的相似度计算（实际应使用向量相似度）
function calculateSimilarity(query, text) {
    const queryWords = query.split('');
    const textWords = text.split('');
    let matches = 0;
    queryWords.forEach(word => {
        if (textWords.includes(word)) matches++;
    });
    return matches / Math.max(queryWords.length, textWords.length);
}

// 设备数据库（模拟）
const equipmentDatabase = {
    'TEST-401': {
        name: '老化测试台',
        type: '测试设备',
        location: 'A车间-测试区',
        status: '在用',
        lastMaintenance: '2024-10-15',
        nextMaintenance: '2024-11-15',
        runningHours: 3250,
        healthScore: 85
    },
    'INJ-205': {
        name: '注塑机',
        type: '成型设备',
        location: 'B车间-注塑区',
        status: '在用',
        lastMaintenance: '2024-10-20',
        nextMaintenance: '2024-11-20',
        runningHours: 5680,
        healthScore: 78
    }
};

// 备件库存数据库（模拟）
const sparePartsDatabase = {
    'BN-12345': {
        name: '温控传感器',
        stock: 8,
        location: 'A区-3货架-2层',
        minStock: 5,
        price: 350,
        lastUsed: '2024-10-25'
    },
    'BN-67890': {
        name: '张力传感器',
        stock: 2,
        location: 'B区-5货架-1层',
        minStock: 3,
        price: 580,
        lastUsed: '2024-10-28',
        warning: true
    }
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

// 调用Google Gemini API
async function callGeminiAPI(userMessage) {
    try {
        // 构建完整的用户消息（包含系统提示词）
        const fullUserMessage = `${SYSTEM_PROMPT}\n\n用户问题：${userMessage}`;
        
        // 构建对话历史（最近3轮，确保user和model交替）
        const recentHistory = chatHistory.slice(-6).filter(msg => msg.type !== 'system');
        const conversationHistory = [];
        
        for (let i = 0; i < recentHistory.length; i++) {
            const msg = recentHistory[i];
            conversationHistory.push({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content.replace(/<[^>]*>/g, '') }]
            });
        }
        
        // 添加当前用户消息
        conversationHistory.push({
            role: 'user',
            parts: [{ text: conversationHistory.length === 0 ? fullUserMessage : userMessage }]
        });
        
        console.log('发送到Gemini API的消息:', conversationHistory);
        
        // 调用Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversationHistory,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误响应:', errorText);
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Gemini API响应:', data);
        
        // 提取回复内容
        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            return formatGeminiResponse(aiResponse, userMessage);
        } else {
            console.error('API返回数据格式错误:', data);
            throw new Error('API返回数据格式错误');
        }
        
    } catch (error) {
        console.error('Gemini API调用失败:', error);
        // 降级到本地知识库
        return generateLocalResponse(userMessage);
    }
}

// 格式化Gemini的回复
function formatGeminiResponse(aiResponse, userMessage) {
    // 检查是否需要添加相关案例和备件推荐
    let formattedResponse = `<div class="space-y-3">`;
    
    // AI回复内容
    formattedResponse += `<div class="text-gray-800">${aiResponse.replace(/\n/g, '<br>')}</div>`;
    
    // 尝试匹配知识库，添加相关案例
    const matchedKnowledge = findMatchingKnowledge(userMessage);
    if (matchedKnowledge) {
        // 添加相关案例
        if (matchedKnowledge.cases && matchedKnowledge.cases.length > 0) {
            formattedResponse += `
                <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    <p class="font-medium text-green-900 mb-2">📚 相关案例推荐：</p>
                    ${matchedKnowledge.cases.map(c => `
                        <div class="flex justify-between items-center text-sm mb-1">
                            <span class="text-green-800">• ${c.title}</span>
                            <span class="text-green-600 font-medium">${c.similarity}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // 添加备件推荐
        if (matchedKnowledge.parts && matchedKnowledge.parts.length > 0) {
            formattedResponse += `
                <div class="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                    <p class="font-medium text-purple-900 mb-2">🔧 可能需要的备件：</p>
                    <div class="flex flex-wrap gap-2">
                        ${matchedKnowledge.parts.map(part => `
                            <span class="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">${part}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    formattedResponse += `</div>`;
    return formattedResponse;
}

// 查找匹配的知识库条目
function findMatchingKnowledge(userMessage) {
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (userMessage.includes(key.split('').slice(0, 4).join('')) || 
            userMessage.includes('温度') && key.includes('温度') ||
            userMessage.includes('伺服') && key.includes('伺服') ||
            userMessage.includes('液压') && key.includes('液压') ||
            userMessage.includes('变频器') && key.includes('变频器') ||
            userMessage.includes('绕线') && key.includes('绕线') ||
            userMessage.includes('断线') && key.includes('断线')) {
            return value;
        }
    }
    return null;
}

// 本地知识库回复（降级方案）
function generateLocalResponse(userMessage) {
    let matchedKnowledge = findMatchingKnowledge(userMessage);
    
    if (matchedKnowledge) {
        return `
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
            </div>
        `;
    }
    
    return `
        <p>我理解您的问题了。让我为您分析一下：</p>
        <p class="mt-2">基于您的描述，我建议：</p>
        <ol class="mt-2 space-y-1 text-sm list-decimal list-inside">
            <li>先检查设备的基本运行参数是否正常</li>
            <li>查看设备最近的维修保养记录</li>
            <li>如果问题持续，建议联系专业工程师现场诊断</li>
        </ol>
        <p class="mt-3 text-sm text-gray-600">您能提供更多细节吗？比如设备型号、具体故障现象等。</p>
    `;
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    input.value = '';
    
    // 显示输入中状态
    showTypingIndicator();
    
    try {
        // 使用真实的Gemini API
        const response = await callGeminiAPI(message);
        
        hideTypingIndicator();
        addMessage(response, 'ai');
        
    } catch (error) {
        console.error('消息发送失败:', error);
        hideTypingIndicator();
        addMessage('<p class="text-red-600">⚠️ 抱歉，AI服务暂时不可用，请稍后重试。</p>', 'ai');
    }
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
        // 检查是否包含备件编号
        const partIdMatch = userMessage.match(/BN-\d+/);
        if (partIdMatch) {
            response = querySparePartStock(partIdMatch[0]);
        } else {
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
                    <p class="mt-2 text-xs text-gray-500">示例：查询备件BN-12345的库存</p>
                </div>
            `;
        }
    } else if (userMessage.includes('设备') && (userMessage.includes('查询') || userMessage.includes('信息'))) {
        // 检查是否包含设备编号
        const equipIdMatch = userMessage.match(/TEST-\d+|INJ-\d+|CNC-\d+/);
        if (equipIdMatch) {
            response = queryEquipmentInfo(equipIdMatch[0]);
        } else {
            response = `
                <p>请提供设备编号，我可以帮您查询：</p>
                <ul class="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• 设备基本信息</li>
                    <li>• 运行状态和健康评分</li>
                    <li>• 保养周期</li>
                    <li>• 累计运行时长</li>
                </ul>
                <p class="mt-2 text-xs text-gray-500">示例：查询设备TEST-401的信息</p>
            `;
        }
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

// 初始化语音识别
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('user-input').value = transcript;
            isRecording = false;
            updateVoiceButton();
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            isRecording = false;
            updateVoiceButton();
            addMessage('<p class="text-red-600">⚠️ 语音识别失败，请重试或使用文字输入。</p>', 'ai');
        };
        
        recognition.onend = function() {
            isRecording = false;
            updateVoiceButton();
        };
    }
}

// 切换语音输入
function toggleVoiceInput() {
    if (!recognition) {
        alert('您的浏览器不支持语音识别功能');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
        isRecording = false;
    } else {
        recognition.start();
        isRecording = true;
        addMessage('<p class="text-blue-600">🎤 正在听您说话...</p>', 'ai');
    }
    updateVoiceButton();
}

// 更新语音按钮状态
function updateVoiceButton() {
    const voiceBtn = document.querySelector('[title="语音输入"]');
    if (voiceBtn) {
        if (isRecording) {
            voiceBtn.classList.add('bg-red-500', 'text-white');
            voiceBtn.classList.remove('bg-gray-100', 'text-gray-600');
        } else {
            voiceBtn.classList.remove('bg-red-500', 'text-white');
            voiceBtn.classList.add('bg-gray-100', 'text-gray-600');
        }
    }
}

// 图像上传和识别
function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageData = event.target.result;
                processImage(imageData, file.name);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// 处理图像
function processImage(imageData, fileName) {
    // 显示用户上传的图片
    addMessage(`
        <div class="space-y-2">
            <p>📷 已上传图片: ${fileName}</p>
            <img src="${imageData}" class="max-w-xs rounded-lg shadow-md" alt="上传的图片">
        </div>
    `, 'user');
    
    // 显示分析中状态
    showTypingIndicator();
    
    // 模拟图像识别分析
    setTimeout(() => {
        hideTypingIndicator();
        const analysisResult = analyzeImage(fileName);
        addMessage(analysisResult, 'ai');
    }, 2000);
}

// 图像分析（模拟AI视觉识别）
function analyzeImage(fileName) {
    // 模拟不同类型的故障识别
    const randomType = Math.floor(Math.random() * 4);
    let result = '';
    
    switch(randomType) {
        case 0:
            result = `
                <div class="space-y-3">
                    <p class="font-medium text-gray-900">🔍 图像识别结果</p>
                    <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <p class="font-semibold text-red-900 mb-2">⚠️ 检测到液压油泄漏</p>
                        <div class="space-y-1 text-sm text-red-800">
                            <p>• 置信度: 94%</p>
                            <p>• 泄漏位置: 管接头处</p>
                            <p>• 严重程度: 中等</p>
                        </div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="font-medium text-blue-900 mb-2">💡 建议措施</p>
                        <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>立即停机检查</li>
                            <li>检查管接头密封件</li>
                            <li>必要时更换O型圈或密封垫</li>
                        </ol>
                    </div>
                    <div class="bg-purple-50 p-3 rounded-lg">
                        <p class="font-medium text-purple-900 mb-2">🔧 推荐备件</p>
                        <div class="flex gap-2">
                            <span class="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">O型圈套装</span>
                            <span class="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">液压油</span>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 1:
            result = `
                <div class="space-y-3">
                    <p class="font-medium text-gray-900">🔍 图像识别结果</p>
                    <div class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <p class="font-semibold text-orange-900 mb-2">⚡ 检测到接触器烧毁</p>
                        <div class="space-y-1 text-sm text-orange-800">
                            <p>• 置信度: 89%</p>
                            <p>• 损坏部位: 主触点</p>
                            <p>• 可能原因: 过载或接触不良</p>
                        </div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <p class="font-medium text-green-900 mb-2">📚 相关案例</p>
                        <p class="text-sm text-green-800">• 接触器频繁烧毁故障分析 (相似度 91%)</p>
                    </div>
                </div>
            `;
            break;
        case 2:
            result = `
                <div class="space-y-3">
                    <p class="font-medium text-gray-900">🔍 图像识别结果</p>
                    <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <p class="font-semibold text-yellow-900 mb-2">🔩 检测到轴承异常磨损</p>
                        <div class="space-y-1 text-sm text-yellow-800">
                            <p>• 置信度: 87%</p>
                            <p>• 磨损类型: 点蚀</p>
                            <p>• 建议: 尽快更换</p>
                        </div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <p class="font-medium text-blue-900 mb-2">🎯 诊断分析</p>
                        <p class="text-sm text-blue-800">轴承点蚀通常由润滑不良或异物进入引起，建议检查润滑系统。</p>
                    </div>
                </div>
            `;
            break;
        default:
            result = `
                <div class="space-y-3">
                    <p class="font-medium text-gray-900">🔍 图像识别结果</p>
                    <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                        <p class="font-semibold text-gray-900 mb-2">ℹ️ 图像分析完成</p>
                        <p class="text-sm text-gray-700">未检测到明显的故障特征。如需更准确的分析，请：</p>
                        <ul class="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                            <li>确保照片清晰，光线充足</li>
                            <li>聚焦在故障部位</li>
                            <li>提供多角度照片</li>
                        </ul>
                    </div>
                </div>
            `;
    }
    
    return result;
}

// 查询设备信息
function queryEquipmentInfo(equipmentId) {
    const equipment = equipmentDatabase[equipmentId];
    if (!equipment) {
        return `<p class="text-red-600">未找到设备编号 ${equipmentId} 的信息</p>`;
    }
    
    return `
        <div class="space-y-3">
            <p class="font-medium text-gray-900">📋 设备信息查询结果</p>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span class="text-gray-600">设备名称：</span>
                        <span class="font-medium text-gray-900">${equipment.name}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">设备类型：</span>
                        <span class="font-medium text-gray-900">${equipment.type}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">安装位置：</span>
                        <span class="font-medium text-gray-900">${equipment.location}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">运行状态：</span>
                        <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">${equipment.status}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">累计运行：</span>
                        <span class="font-medium text-gray-900">${equipment.runningHours}小时</span>
                    </div>
                    <div>
                        <span class="text-gray-600">健康评分：</span>
                        <span class="font-medium ${equipment.healthScore >= 80 ? 'text-green-600' : 'text-orange-600'}">${equipment.healthScore}分</span>
                    </div>
                    <div>
                        <span class="text-gray-600">上次保养：</span>
                        <span class="font-medium text-gray-900">${equipment.lastMaintenance}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">下次保养：</span>
                        <span class="font-medium text-blue-600">${equipment.nextMaintenance}</span>
                    </div>
                </div>
            </div>
            <p class="text-sm text-gray-600">💡 如需查看详细履历或维修记录，请访问设备台账模块。</p>
        </div>
    `;
}

// 查询备件库存
function querySparePartStock(partId) {
    const part = sparePartsDatabase[partId];
    if (!part) {
        return `<p class="text-red-600">未找到备件编号 ${partId} 的信息</p>`;
    }
    
    const stockStatus = part.stock <= part.minStock ? 'warning' : 'normal';
    
    return `
        <div class="space-y-3">
            <p class="font-medium text-gray-900">🔧 备件库存查询结果</p>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">备件名称：</span>
                        <span class="font-medium text-gray-900">${part.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">当前库存：</span>
                        <span class="font-bold ${stockStatus === 'warning' ? 'text-red-600' : 'text-green-600'}">${part.stock} 个</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">安全库存：</span>
                        <span class="font-medium text-gray-900">${part.minStock} 个</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">存放位置：</span>
                        <span class="font-medium text-blue-600">${part.location}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">单价：</span>
                        <span class="font-medium text-gray-900">¥${part.price}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">最近领用：</span>
                        <span class="font-medium text-gray-900">${part.lastUsed}</span>
                    </div>
                </div>
                ${part.warning ? `
                    <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                        <p class="text-sm text-red-700">⚠️ 库存不足，建议补货</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 设备智能体已就绪 - LLM大语言模型集成版');
    console.log('✓ LLM大语言模型');
    console.log('✓ RAG检索引擎');
    console.log('✓ 图像识别');
    console.log('✓ 语音交互');
    console.log('✓ 知识图谱');
    console.log('✓ 多轮对话');
    
    // 初始化语音识别
    initSpeechRecognition();
    
    // 绑定图片上传按钮
    const imageBtn = document.querySelector('[title="上传图片"]');
    if (imageBtn) {
        imageBtn.onclick = uploadImage;
    }
    
    // 绑定语音按钮
    const voiceBtn = document.querySelector('[title="语音输入"]');
    if (voiceBtn) {
        voiceBtn.onclick = toggleVoiceInput;
    }
    
    // 显示欢迎消息，说明AI功能
    setTimeout(() => {
        addMessage(`
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-500">
                <p class="font-semibold text-indigo-900 mb-2">🚀 LLM大语言模型已就绪</p>
                <p class="text-sm text-indigo-800 mb-2">我现在由LLM大语言模型驱动，能够：</p>
                <ul class="text-sm text-indigo-700 space-y-1 ml-4">
                    <li>• 更智能的故障诊断和分析</li>
                    <li>• 更自然的多轮对话</li>
                    <li>• 更准确的解决方案推荐</li>
                    <li>• 结合本地知识库的增强回复</li>
                </ul>
                <p class="text-xs text-indigo-600 mt-3">💡 请描述您遇到的设备问题，我会为您提供专业的诊断建议</p>
            </div>
        `, 'ai');
    }, 1000);
});
