# Service Management System

> 基于 Flask 的企业微信客服管理系统，采用模块化架构设计，支持客服账号管理、消息发送等功能。

## 📋 项目概述

本项目是一个企业微信客服管理系统，提供客服账号的增删改查、消息批量发送、客服会话管理等功能。项目采用前后端分离的架构设计，后端使用 Flask 框架，前端使用原生 JavaScript 模块化开发。

## 🏗️ 架构设计

### 后端架构
- **Flask App Factory Pattern**: 使用应用工厂模式创建 Flask 应用实例
- **Blueprint 模块化**: 按功能模块划分路由，提高代码可维护性
- **Service Layer**: 业务逻辑层，封装企业微信 API 调用
- **统一响应格式**: 标准化的 API 响应结构
- **全局错误处理**: 集中化的异常处理和错误响应

### 前端架构
- **ES6 模块化**: 使用现代 JavaScript 模块语法
- **组件化设计**: 按功能模块组织 JavaScript 代码
- **CSS 模块化**: 按用途分类的样式文件组织
- **响应式设计**: 支持多种设备屏幕尺寸

## 📁 项目结构

```
Service_Management/
├── app/                          # 应用核心目录
│   ├── __init__.py              # Flask 应用工厂
│   ├── errors.py                # 全局错误处理
│   ├── responses.py             # 统一响应格式
│   ├── routes/                  # 路由模块
│   │   ├── home.py             # 首页路由
│   │   ├── health.py           # 健康检查
│   │   ├── customer_service.py # 客服管理 API
│   │   └── message.py          # 消息发送 API
│   └── services/                # 业务逻辑层
│       └── wechat_service.py   # 企业微信服务
├── static/                       # 静态资源
│   ├── css/                     # 样式文件
│   │   ├── base.css            # 基础样式（重置、变量、工具类）
│   │   ├── components.css      # 通用组件样式
│   │   ├── layout.css          # 布局样式
│   │   ├── pages.css           # 页面特定样式
│   │   └── sidebar.css         # 侧边栏样式
│   └── js/                      # JavaScript 文件
│       ├── app.js              # 主应用逻辑
│       ├── router.js           # 路由兼容层
│       ├── api/                # API 调用模块
│       │   └── customerService.js
│       ├── pages/              # 页面模块
│       │   ├── dashboard.js    # 控制台页面
│       │   ├── customerService.js
│       │   ├── customerManage.js
│       │   └── conversationManage.js
│       └── router/             # 路由核心
│           ├── index.js        # 路由类
│           └── routes.js       # 路由配置
├── templates/                    # HTML 模板
│   ├── base.html               # 基础模板
│   └── index.html              # 首页模板
├── utils/                       # 工具模块
│   ├── wechat_api.py           # 企业微信 API 封装
│   └── wechat_api_test.py      # API 测试脚本
├── config.py                    # 配置文件
├── app.py                      # 原始应用文件（已重构）
├── wsgi.py                     # WSGI 入口点
└── README.md                   # 项目说明文档
```

## 🚀 核心功能

### 1. 客服账号管理
- 客服账号列表查询
- 新增客服账号
- 编辑客服信息
- 删除客服账号
- 客服权限管理

### 2. 消息管理
- 单用户消息发送
- 批量消息发送
- 消息发送状态跟踪

### 3. 会话管理
- 客服会话记录
- 会话状态监控
- 会话统计分析

### 4. 系统管理
- 用户权限控制
- 系统配置管理
- 操作日志记录

## 🛠️ 技术栈

### 后端技术
- **Python 3.8+**: 主要开发语言
- **Flask 2.0+**: Web 框架
- **Flask Blueprint**: 模块化路由
- **requests**: HTTP 客户端库
- **企业微信 API**: 第三方服务集成

### 前端技术
- **原生 JavaScript**: 无框架依赖
- **ES6 模块**: 现代模块化语法
- **CSS3**: 样式和动画
- **Font Awesome**: 图标库
- **响应式设计**: 移动端适配

### 开发工具
- **Git**: 版本控制
- **VS Code**: 代码编辑器
- **Chrome DevTools**: 前端调试

## 🔧 安装和运行

### 环境要求
- Python 3.8+
- pip 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd Service_Management
```

2. **安装依赖**
```bash
pip install flask requests
```

3. **配置环境**
```bash
# 复制配置文件模板
cp config.py.example config.py

# 编辑配置文件，填入企业微信配置
vim config.py
```

4. **运行项目**
```bash
# 开发模式
python wsgi.py

# 或使用 Flask 开发服务器
export FLASK_APP=wsgi.py
export FLASK_ENV=development
flask run
```

### 配置说明

在 `config.py` 中配置以下参数：

```python
class Config:
    WECHAT_CORP_ID = "your_corp_id"
    WECHAT_SECRET = "your_secret"
    WECHAT_AGENT_ID = "your_agent_id"
    WECHAT_API_BASE = "https://qyapi.weixin.qq.com/cgi-bin"
```

## 📚 开发指南

### 代码规范

#### Python 代码
- 使用 PEP 8 代码风格
- 函数和类添加文档字符串
- 异常处理要具体明确
- 使用类型注解（可选）

#### JavaScript 代码
- 使用 ES6+ 语法
- 模块导入导出要明确
- 函数命名要语义化
- 添加必要的注释

#### CSS 代码
- 使用 CSS 变量定义主题
- 类名使用 BEM 命名规范
- 响应式设计优先
- 避免过度嵌套

### 模块开发

#### 添加新的 API 路由
1. 在 `app/routes/` 下创建新的路由文件
2. 在 `app/__init__.py` 中注册 Blueprint
3. 实现相应的业务逻辑

#### 添加新的前端页面
1. 在 `static/js/pages/` 下创建页面模块
2. 在 `static/js/router/routes.js` 中添加路由配置
3. 实现页面模板和初始化逻辑

#### 添加新的样式
1. 根据用途选择合适的 CSS 文件
2. 使用 CSS 变量保持一致性
3. 添加响应式断点

### 错误处理

项目采用分层错误处理机制：

1. **API 层**: 捕获网络异常，返回详细错误信息
2. **Service 层**: 处理业务逻辑异常
3. **路由层**: 统一异常格式，返回标准错误响应
4. **前端层**: 显示用户友好的错误信息

## 🔍 调试和测试

### 后端调试
- 使用 Flask 调试模式
- 查看控制台日志输出
- 使用 Postman 测试 API

### 前端调试
- 使用浏览器开发者工具
- 查看控制台错误信息
- 使用 Network 面板检查请求

### 企业微信 API 测试
```bash
python utils/wechat_api_test.py
```

## 📈 性能优化

### 后端优化
- Access Token 缓存机制
- 数据库连接池（如需要）
- API 响应缓存

### 前端优化
- JavaScript 模块懒加载
- CSS 样式按需加载
- 图片资源压缩

## 🔒 安全考虑

- 敏感配置信息使用环境变量
- API 接口添加访问控制
- 用户输入数据验证
- HTTPS 传输加密

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目链接: [https://github.com/username/repository]

## 🙏 致谢

- 感谢企业微信提供的 API 服务
- 感谢 Flask 社区的支持
- 感谢所有贡献者的付出

---

**注意**: 本项目正在持续开发中，部分功能可能尚未完全实现。如有问题或建议，请提交 Issue 或联系项目维护者。
