// 客服管理页面模块
import { loadCustomerServiceList } from '../api/customerService.js';

// 将函数暴露到全局作用域（保持兼容性）
window.filterCustomerServiceList = filterCustomerServiceList;
window.refreshCustomerServiceList = refreshCustomerServiceList;
window.showAddCustomerServiceModal = showAddCustomerServiceModal;
window.editCustomerService = editCustomerService;
window.deleteCustomerService = deleteCustomerService;
window.copyToClipboard = copyToClipboard;
window.getSceneTypeName = getSceneTypeName;
window.renderCustomerServiceList = renderCustomerServiceList;

export function getCustomerServiceTemplate() {
    return `
        <div class="customer-service">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">客服管理</h3>
                    <div class="card-description">管理客服人员账号和信息</div>
                </div>
                
                <div class="service-actions">
                    <button class="btn btn-primary" onclick="showAddCustomerServiceModal()">
                        <i class="fas fa-plus"></i>
                        添加客服
                    </button>
                    <button class="btn btn-secondary" onclick="refreshCustomerServiceList()">
                        <i class="fas fa-refresh"></i>
                        刷新列表
                    </button>
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="搜索客服名称..." id="customerServiceSearch" onkeyup="filterCustomerServiceList()">
                    </div>
                </div>
                
                <div class="service-list" id="customerServiceList">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        正在加载客服列表...
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initCustomerService() {
    console.log('Customer Service initialized');
    // 加载客服列表数据
    loadCustomerServiceList();
}

// 客服管理相关函数
let customerServiceData = []; // 存储客服列表数据

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

// 获取场景类型名称
export function getSceneTypeName(sceneType) {
    const sceneTypes = {
        0: '默认场景',
        1: '营销场景',
        2: '服务场景',
        3: '投诉场景'
    };
    return sceneTypes[sceneType] || '未知场景';
}

// 渲染客服列表
export function renderCustomerServiceList(data) {
    const listContainer = document.getElementById('customerServiceList');
    
    if (!data || data.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-headset"></i>
                <h3>暂无客服账号</h3>
                <p>点击上方"添加客服"按钮创建第一个客服账号</p>
            </div>
        `;
        return;
    }
    
    // 创建表格
    const tableHtml = `
        <div class="table-container">
            <table class="service-table">
                <thead>
                    <tr>
                        <th>头像</th>
                        <th>客服ID</th>
                        <th>客服名称</th>
                        <th>管理权限</th>
                        <th>场景类型</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(kf => `
                        <tr>
                            <td class="avatar-cell">
                                <div class="service-avatar">
                                    ${kf.avatar 
                                        ? `<img src="${kf.avatar}" alt="${kf.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                           <div class="default-avatar" style="display: none;">
                                               <i class="fas fa-user"></i>
                                           </div>`
                                        : `<div class="default-avatar">
                                               <i class="fas fa-user"></i>
                                           </div>`
                                    }
                                </div>
                            </td>
                            <td class="id-cell">
                                <code class="service-id" onclick="copyToClipboard('${kf.open_kfid}', this)" title="点击复制ID">${kf.open_kfid}</code>
                            </td>
                            <td class="name-cell">
                                <div class="service-name">${kf.name || '未命名客服'}</div>
                            </td>
                            <td class="privilege-cell">
                                <span class="privilege-badge ${kf.manage_privilege ? 'privilege-admin' : 'privilege-normal'}">
                                    <i class="fas ${kf.manage_privilege ? 'fa-crown' : 'fa-user'}"></i>
                                    ${kf.manage_privilege ? '管理员' : '普通'}
                                </span>
                            </td>
                            <td class="scene-cell">
                                <span class="scene-badge">
                                    ${getSceneTypeName(kf.scene_type)}
                                </span>
                            </td>
                            <td class="action-cell">
                                <div class="action-buttons">
                                    <button class="btn-action btn-edit" onclick="editCustomerService('${kf.open_kfid}')" title="编辑客服">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-action btn-delete" onclick="deleteCustomerService('${kf.open_kfid}', '${kf.name}')" title="删除客服">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="table-footer">
            <div class="table-info">
                共 ${data.length} 个客服账号
            </div>
        </div>
    `;
    
    listContainer.innerHTML = tableHtml;
}

// 设置客服数据（供API模块调用）
export function setCustomerServiceData(data) {
    customerServiceData = data;
}
