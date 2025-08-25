import os
from flask import Flask
from config import Config


def create_app() -> Flask:
    """应用工厂：创建并配置 Flask 应用实例。"""
    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static'),
        template_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates'),
    )
    app.config.from_object(Config)

    # 注册基础蓝图
    from app.routes.home import home_bp
    from app.routes.health import health_bp
    from app.routes.customer_service import customer_service_bp
    from app.routes.message import message_bp
    app.register_blueprint(home_bp)
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(customer_service_bp)
    app.register_blueprint(message_bp)

    # 注册错误处理器
    from app.errors import register_error_handlers
    register_error_handlers(app)

    return app


