// 主应用类
import { initRouter } from './router.js';

class App {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        // 初始化应用
        this.init();
    }
    
    init() {
        // 初始化路由
        this.initRouter();
        
        // 初始化侧边栏
        this.initSidebar();
        
        // 初始化导航
        this.initNavigation();
        
        // 初始化响应式
        this.initResponsive();
        
        // 加载初始页面
        this.loadInitialPage();
        
        console.log('App initialized successfully');
        
        // 调试信息
        console.log('Sidebar element:', this.sidebar);
        console.log('Sidebar toggle element:', this.sidebarToggle);
        console.log('Main content element:', this.mainContent);
    }
    
    // 初始化路由
    initRouter() {
        initRouter();
    }
    
    // 初始化侧边栏
    initSidebar() {
        // 切换侧边栏
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }
        
        // 移动端菜单切换
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileSidebar();
            });
        }
        
        // 创建遮罩层
        this.createOverlay();
        
        // 恢复之前的侧边栏状态（仅桌面端）
        if (window.innerWidth > 768) {
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                this.collapseSidebar();
            }
        }
    }
    
    // 初始化导航
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                
                if (page && window.router) {
                    window.router.navigateTo(page);
                }
                
                // 移动端点击后收起侧边栏
                if (window.innerWidth <= 768) {
                    this.closeMobileSidebar();
                }
            });
            
            // 添加title属性用于工具提示
            const navText = link.querySelector('.nav-text');
            if (navText) {
                link.setAttribute('title', navText.textContent);
            }
        });
    }
    
    // 初始化响应式
    initResponsive() {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // 初始检查
        this.handleResize();
    }
    
    // 处理窗口大小变化
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 移动端：重置为默认状态
            this.sidebar.classList.remove('collapsed');
            this.mainContent.classList.remove('sidebar-collapsed');
        } else {
            // 桌面端：恢复之前的状态
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('sidebar-collapsed');
            }
            // 确保移动端状态被清除
            this.closeMobileSidebar();
        }
    }
    
    // 切换侧边栏
    toggleSidebar() {
        const isCollapsed = this.sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            this.expandSidebar();
        } else {
            this.collapseSidebar();
        }
        
        // 调试日志
        console.log('Sidebar toggled:', isCollapsed ? 'expanded' : 'collapsed');
    }
    
    // 收起侧边栏
    collapseSidebar() {
        this.sidebar.classList.add('collapsed');
        this.mainContent.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'true');
        console.log('Sidebar collapsed');
    }
    
    // 展开侧边栏
    expandSidebar() {
        this.sidebar.classList.remove('collapsed');
        this.mainContent.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'false');
        console.log('Sidebar expanded');
    }
    
    // 切换移动端侧边栏
    toggleMobileSidebar() {
        const isOpen = this.sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }
    
    // 打开移动端侧边栏
    openMobileSidebar() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭移动端侧边栏
    closeMobileSidebar() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 创建遮罩层
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        document.body.appendChild(this.overlay);
        
        // 点击遮罩层关闭侧边栏
        this.overlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });
    }
    
    // 加载初始页面
    loadInitialPage() {
        // 从URL hash获取初始页面
        const hash = window.location.hash.replace('#', '');
        const initialPage = hash || 'dashboard';
        
        if (window.router) {
            window.router.navigateTo(initialPage, false);
        }
    }
    
    // 显示加载状态
    showLoading(container = null) {
        const loadingHtml = `
            <div class="loading">
                加载中...
            </div>
        `;
        
        if (container) {
            container.innerHTML = loadingHtml;
        } else {
            document.getElementById('pageContent').innerHTML = loadingHtml;
        }
    }
    
    // 显示错误信息
    showError(message, container = null) {
        const errorHtml = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>出现错误</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">刷新页面</button>
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHtml;
        } else {
            document.getElementById('pageContent').innerHTML = errorHtml;
        }
    }
    
    // 显示成功提示
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${this.getNotificationColor(type)};
            z-index: 10000;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 自动移除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // 获取通知图标
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
    
    // 获取通知颜色
    getNotificationColor(type) {
        const colors = {
            success: '#52c41a',
            error: '#ff4d4f',
            warning: '#faad14',
            info: '#1677ff'
        };
        return colors[type] || colors.info;
    }
}

// 工具函数
const utils = {
    // 格式化日期
    formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleString('zh-CN');
    },
    
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // API请求封装
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }
};

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
    }
    
    /* Dashboard 样式 */
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
    }
    
    .stat-card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #1f2937;
    }
    
    .stat-label {
        font-size: 14px;
        color: #6b7280;
    }
    
    .dashboard-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
    }
    
    .activity-list {
        space-y: 16px;
    }
    
    .activity-item {
        display: flex;
        gap: 12px;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
    }
    
    .activity-title {
        font-weight: 500;
        margin-bottom: 4px;
    }
    
    .activity-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
    }
    
    .activity-time {
        font-size: 12px;
        color: #999;
    }
    
    .quick-actions {
        display: grid;
        gap: 12px;
    }
    
    .action-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .action-item:hover {
        border-color: #1677ff;
        background: #f6f9ff;
    }
    
    /* 页面特定样式 */
    .service-actions, .customer-actions, .conversation-actions {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        align-items: center;
    }
    
    .search-bar {
        position: relative;
        flex: 1;
    }
    
    .search-bar i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }
    
    .search-bar input {
        width: 100%;
        padding: 12px 12px 12px 40px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
    }
    
    .filter-bar select {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
    }
    
    @media (max-width: 768px) {
        .dashboard-content {
            grid-template-columns: 1fr;
        }
        
        .dashboard-stats {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// 当DOM加载完成时初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});