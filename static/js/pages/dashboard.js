// 控制台页面模块
export function getDashboardTemplate() {
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

export function initDashboard() {
    console.log('Dashboard initialized');
    // 可以在这里加载仪表板数据
}
