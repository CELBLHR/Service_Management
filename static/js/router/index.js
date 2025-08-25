// 轻路由核心模块
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = 'dashboard';
        this.pageContent = document.getElementById('pageContent');
        this.pageTitle = document.getElementById('pageTitle');
        this.breadcrumbPath = document.getElementById('breadcrumbPath');
        
        // 初始化路由配置
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
        // 路由配置将从 routes.js 导入
        this.routes = {};
    }
    
    // 设置路由配置
    setRoutes(routes) {
        this.routes = routes;
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
        this.pageContent.innerHTML = route.template();
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
}

// 导出Router类
export { Router };
