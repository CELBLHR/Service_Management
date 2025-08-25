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
                breadcrumb: '首页',
                template: this.getDashboardTemplate(),
                init: this.initDashboard
            },
            'customer-service': {
                title: '客服管理', 
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')">首页</a> / 客服管理',
                template: this.getCustomerServiceTemplate(),
                init: this.initCustomerService
            },
            'customer-manage': {
                title: '客户管理',
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')">首页</a> / 客户管理', 
                template: this.getCustomerManageTemplate(),
                init: this.initCustomerManage
            },
            'conversation-manage': {
                title: '回话管理',
                breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')">首页</a> / 回话管理',
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
                        <div class="card-description">管理客服人员和消息发送</div>
                    </div>
                    
                    <div class="service-actions">
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            添加客服
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-paper-plane"></i>
                            群发消息
                        </button>
                    </div>
                    
                    <div class="service-list">
                        <div class="empty-state">
                            <i class="fas fa-headset"></i>
                            <h3>客服管理功能</h3>
                            <p>此页面将用于管理客服人员和消息发送功能</p>
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
        // 可以在这里加载客服数据
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