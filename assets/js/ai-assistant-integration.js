/**
 * 数字工厂一体化平台 - AI助手通用集成脚本
 * 版本: v1.0.0
 * 用途: 为所有页面提供AI助手功能的快速集成
 */

// 动态加载AI助手样式
function loadAIAssistantStyles() {
    // 检查是否已经加载过样式
    if (document.getElementById('ai-assistant-styles')) {
        return;
    }

    const link = document.createElement('link');
    link.id = 'ai-assistant-styles';
    link.rel = 'stylesheet';
    
    // 根据当前页面路径确定样式文件路径
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        link.href = '../assets/css/ai-assistant.css';
    } else {
        link.href = 'assets/css/ai-assistant.css';
    }
    
    document.head.appendChild(link);
}

// 动态加载AI助手脚本
function loadAIAssistantScript() {
    // 检查是否已经加载过脚本
    if (window.digitalFactoryAI) {
        return;
    }

    const script = document.createElement('script');
    
    // 根据当前页面路径确定脚本文件路径
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        script.src = '../assets/js/ai-assistant.js';
    } else {
        script.src = 'assets/js/ai-assistant.js';
    }
    
    document.head.appendChild(script);
}

// 初始化AI助手
function initAIAssistant() {
    // 加载样式
    loadAIAssistantStyles();
    
    // 加载脚本
    loadAIAssistantScript();
}

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟100ms确保页面完全加载
    setTimeout(initAIAssistant, 100);
});

// 为页面添加AI助手的便捷方法
window.addAIAssistant = initAIAssistant;
