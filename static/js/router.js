// 路由管理器
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = 'dashboard';
        this.pageContent = document.getElementById('pageContent');
        this.pageTitle = document.getElementById('pageTitle');
        this.breadcrumbPath = document.getElementById('breadcrumbPath');
        
        // 初始化路由
        this.initRoutes();
        
        // 监听浏览器后退/前进
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });
    }
    
    // 初始化路由配置
    initRoutes() {
        this.routes = {
            'dashboard': {
                title: '控制台',
                breadcrumb: '首页 / 控制台',
                template: this.getDashboardTemplate(),
                init: this.initDashboard
            },
            'customer-service': {
                title: '客服管理', 
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 客服管理',
                template: this.getCustomerServiceTemplate(),
                init: this.initCustomerService
            },
            'customer-manage': {
                title: '客户管理',
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 客户管理', 
                template: this.getCustomerManageTemplate(),
                init: this.initCustomerManage
            },
            'conversation-manage': {
                title: '回话管理',
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 回话管理',
                template: this.getConversationManageTemplate(), 
                init: this.initConversationManage
            }
        };
    }
    
    // 导航到指定页面
    navigateTo(page, pushState = true) {
        if (!this.routes[page]) {
            console.error(`Page ${page} not found`);
            return;
        }
        
        this.currentPage = page;
        const route = this.routes[page];
        
        // 更新页面内容
        this.pageContent.innerHTML = route.template;
        this.pageTitle.textContent = route.title;
        this.breadcrumbPath.innerHTML = route.breadcrumb;
        
        // 更新导航状态
        this.updateNavigation(page);
        
        // 更新浏览器历史
        if (pushState) {
            history.pushState({ page: page }, route.title, `#${page}`);
        }
        
        // 执行页面初始化函数
        if (route.init && typeof route.init === 'function') {
            route.init();
        }
        
        // 触发页面改变事件
        this.onPageChange(page);
    }
    
    // 更新导航栏状态
    updateNavigation(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }
    
    // 页面改变回调
    onPageChange(page) {
        console.log(`Navigated to: ${page}`);
        
        // 可以在这里添加页面切换动画、数据加载等逻辑
        // 添加页面切换动画
        this.pageContent.style.opacity = '0';
        setTimeout(() => {
            this.pageContent.style.opacity = '1';
        }, 100);
    }
    
    // 获取当前页面
    getCurrentPage() {
        return this.currentPage;
    }
    
    // 页面模板定义
    getDashboardTemplate() {
        return `
            <div class="dashboard">
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">25</div>
                            <div class="stat-label">在线客服</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">1,234</div>
                            <div class="stat-label">总客户数</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">89</div>
                            <div class="stat-label">进行中对话</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">95.8%</div>
                            <div class="stat-label">满意度</div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-left">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">最近活动</h3>
                            </div>
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-message"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">新消息提醒</div>
                                        <div class="activity-desc">客户张三发来新消息</div>
                                        <div class="activity-time">5分钟前</div>
                                    </div>
                                </div>
                                
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">新客户注册</div>
                                        <div class="activity-desc">李四完成了注册流程</div>
                                        <div class="activity-time">10分钟前</div>
                                    </div>
                                </div>
                                
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">服务评价</div>
                                        <div class="activity-desc">王五给出了5星好评</div>
                                        <div class="activity-time">15分钟前</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-right">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">快速操作</h3>
                            </div>
                            <div class="quick-actions">
                                <button class="action-item" onclick="router.navigateTo('customer-service')">
                                    <i class="fas fa-headset"></i>
                                    <span>客服管理</span>
                                </button>
                                <button class="action-item" onclick="router.navigateTo('customer-manage')">
                                    <i class="fas fa-users"></i>
                                    <span>客户管理</span>
                                </button>
                                <button class="action-item" onclick="router.navigateTo('conversation-manage')">
                                    <i class="fas fa-comments"></i>
                                    <span>回话管理</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCustomerServiceTemplate() {
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
    
    getCustomerManageTemplate() {
        return `
            <div class="customer-manage">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">客户管理</h3>
                        <div class="card-description">管理客户信息和数据</div>
                    </div>
                    
                    <div class="customer-actions">
                        <div class="search-bar">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索客户..." />
                        </div>
                        <button class="btn btn-primary">
                            <i class="fas fa-user-plus"></i>
                            添加客户
                        </button>
                    </div>
                    
                    <div class="customer-list">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>客户管理功能</h3>
                            <p>此页面将用于管理客户信息和相关数据</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getConversationManageTemplate() {
        return `
            <div class="conversation-manage">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">回话管理</h3>
                        <div class="card-description">管理客服对话记录和会话</div>
                    </div>
                    
                    <div class="conversation-actions">
                        <div class="filter-bar">
                            <select class="filter-select">
                                <option>全部状态</option>
                                <option>进行中</option>
                                <option>已结束</option>
                                <option>待处理</option>
                            </select>
                        </div>
                        <button class="btn btn-secondary">
                            <i class="fas fa-download"></i>
                            导出记录
                        </button>
                    </div>
                    
                    <div class="conversation-list">
                        <div class="empty-state">
                            <i class="fas fa-comment-dots"></i>
                            <h3>会话管理功能</h3>
                            <p>此页面将用于管理客服对话记录和会话状态</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 页面初始化函数
    initDashboard() {
        console.log('Dashboard initialized');
        // 可以在这里加载仪表板数据
    }
    
    initCustomerService() {
        console.log('Customer Service initialized');
        // 加载客服列表数据
        loadCustomerServiceList();
    }
    
    initCustomerManage() {
        console.log('Customer Manage initialized');
        // 可以在这里加载客户数据
    }
    
    initConversationManage() {
        console.log('Conversation Manage initialized');
        // 可以在这里加载会话数据
    }
}

// ================== 客服管理相关函数 ==================

let customerServiceData = []; // 存储客服列表数据

// 加载客服列表
async function loadCustomerServiceList() {
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
            customerServiceData = result.data.account_list || [];
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

// 渲染客服列表
function renderCustomerServiceList(data) {
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

// 获取场景类型名称
function getSceneTypeName(sceneType) {
    const sceneTypes = {
        0: '默认场景',
        1: '营销场景',
        2: '服务场景',
        3: '投诉场景'
    };
    return sceneTypes[sceneType] || '未知场景';
}

// 搜索过滤客服列表
function filterCustomerServiceList() {
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
function refreshCustomerServiceList() {
    loadCustomerServiceList();
}

// 显示添加客服模态框（暂时用alert替代）
function showAddCustomerServiceModal() {
    alert('添加客服功能将在后续实现');
}

// 编辑客服（暂时用alert替代）
function editCustomerService(openKfid) {
    alert(`编辑客服功能将在后续实现\n客服ID: ${openKfid}`);
}

// 删除客服（暂时用confirm替代）
function deleteCustomerService(openKfid, name) {
    const confirmed = confirm(`确定要删除客服 "${name}" 吗？\n此操作不可撤销。`);
    if (confirmed) {
        alert(`删除客服功能将在后续实现\n客服ID: ${openKfid}`);
    }
}

// 复制到剪贴板功能
async function copyToClipboard(text, element) {
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