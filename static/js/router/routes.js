// 路由配置模块
import { getDashboardTemplate, initDashboard } from '../pages/dashboard.js';
import { getCustomerServiceTemplate, initCustomerService } from '../pages/customerService.js';
import { getCustomerManageTemplate, initCustomerManage } from '../pages/customerManage.js';
import { getConversationManageTemplate, initConversationManage } from '../pages/conversationManage.js';

// 路由配置表
export const routes = {
    'dashboard': {
        title: '控制台',
        breadcrumb: '首页 / 控制台',
        template: getDashboardTemplate,
        init: initDashboard
    },
    'customer-service': {
        title: '客服管理', 
        breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 客服管理',
        template: getCustomerServiceTemplate,
        init: initCustomerService
    },
    'customer-manage': {
        title: '客户管理',
        breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 客户管理', 
        template: getCustomerManageTemplate,
        init: initCustomerManage
    },
    'conversation-manage': {
        title: '回话管理',
        breadcrumb: '<a href="#" onclick="router.navigateTo(\'dashboard\')" style="color: #1677ff; text-decoration: none;">首页</a> / 回话管理',
        template: getConversationManageTemplate, 
        init: initConversationManage
    }
};
