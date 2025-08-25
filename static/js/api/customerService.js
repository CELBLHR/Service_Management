// 客服相关API调用模块
import { renderCustomerServiceList, setCustomerServiceData } from '../pages/customerService.js';

// 加载客服列表
export async function loadCustomerServiceList() {
    const listContainer = document.getElementById('customerServiceList');
    
    try {
        // 显示加载状态
        listContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                正在加载客服列表...
            </div>
        `;
        
        // 调用API获取客服列表
        const response = await fetch('/api/customer_service/list');
        const result = await response.json();
        
        if (result.success) {
            const customerServiceData = result.data.account_list || [];
            setCustomerServiceData(customerServiceData);
            renderCustomerServiceList(customerServiceData);
        } else {
            throw new Error(result.error || '获取客服列表失败');
        }
        
    } catch (error) {
        console.error('加载客服列表失败:', error);
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="color: #ff4d4f;"></i>
                <h3>加载失败</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadCustomerServiceList()">
                    <i class="fas fa-refresh"></i>
                    重新加载
                </button>
            </div>
        `;
    }
}
