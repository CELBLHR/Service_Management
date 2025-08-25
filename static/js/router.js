// 路由管理器 - 重构版本
import { Router } from './router/index.js';
import { routes } from './router/routes.js';

// 创建路由实例
let router;

// 初始化路由
function initRouter() {
    router = new Router();
    router.setRoutes(routes);
    window.router = router;
}

// 导出路由实例
export { router, initRouter };

// 页面初始化函数（保持兼容性）
export function initDashboard() {
    console.log('Dashboard initialized');
    // 可以在这里加载仪表板数据
}

export function initCustomerService() {
    console.log('Customer Service initialized');
    // 加载客服列表数据
    if (typeof loadCustomerServiceList === 'function') {
        loadCustomerServiceList();
    }
}

export function initCustomerManage() {
    console.log('Customer Manage initialized');
    // 可以在这里加载客户数据
}

export function initConversationManage() {
    console.log('Conversation Manage initialized');
    // 可以在这里加载会话数据
}

// 客服管理相关函数（保持兼容性）
let customerServiceData = []; // 存储客服列表数据

// 导入API函数和页面函数
import { loadCustomerServiceList } from './api/customerService.js';
import { renderCustomerServiceList, getSceneTypeName } from './pages/customerService.js';

// 设置客服数据（供API模块调用）
export function setCustomerServiceData(data) {
    customerServiceData = data;
}

// 搜索过滤客服列表
export function filterCustomerServiceList() {
    const searchInput = document.getElementById('customerServiceSearch');
    const keyword = searchInput.value.toLowerCase().trim();
    
    if (!keyword) {
        renderCustomerServiceList(customerServiceData);
        return;
    }
    
    const filteredData = customerServiceData.filter(kf => {
        return kf.name.toLowerCase().includes(keyword) || 
               kf.open_kfid.toLowerCase().includes(keyword);
    });
    
    renderCustomerServiceList(filteredData);
}

// 刷新客服列表
export function refreshCustomerServiceList() {
    loadCustomerServiceList();
}

// 显示添加客服模态框（暂时用alert替代）
export function showAddCustomerServiceModal() {
    alert('添加客服功能将在后续实现');
}

// 编辑客服（暂时用alert替代）
export function editCustomerService(openKfid) {
    alert(`编辑客服功能将在后续实现\n客服ID: ${openKfid}`);
}

// 删除客服（暂时用confirm替代）
export function deleteCustomerService(openKfid, name) {
    const confirmed = confirm(`确定要删除客服 "${name}" 吗？\n此操作不可撤销。`);
    if (confirmed) {
        alert(`删除客服功能将在后续实现\n客服ID: ${openKfid}`);
    }
}

// 复制到剪贴板功能
export async function copyToClipboard(text, element) {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // 显示复制成功的视觉反馈
        element.classList.add('copied');
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
        
        // 显示提示消息（可选）
        if (window.app && window.app.showSuccess) {
            window.app.showSuccess('客服ID已复制到剪贴板');
        }
        
    } catch (err) {
        console.error('复制失败:', err);
        // 降级提示
        alert(`客服ID: ${text}\n（请手动复制）`);
    }
}

// 将函数暴露到全局作用域（保持兼容性）
window.filterCustomerServiceList = filterCustomerServiceList;
window.refreshCustomerServiceList = refreshCustomerServiceList;
window.showAddCustomerServiceModal = showAddCustomerServiceModal;
window.editCustomerService = editCustomerService;
window.deleteCustomerService = deleteCustomerService;
window.copyToClipboard = copyToClipboard;
window.getSceneTypeName = getSceneTypeName;
window.renderCustomerServiceList = renderCustomerServiceList;