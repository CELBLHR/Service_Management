from flask import Blueprint, render_template


home_bp = Blueprint('home', __name__)


@home_bp.route('/')
def index():
    return render_template('index.html')


# 页面直达（SEO/直链）
@home_bp.route('/customer-service')
def customer_service_page():
    return render_template('index.html')


@home_bp.route('/customer-manage')
def customer_manage_page():
    return render_template('index.html')


@home_bp.route('/conversation-manage')
def conversation_manage_page():
    return render_template('index.html')

# 模块测试页面
@home_bp.route('/test-modules')
def test_modules_page():
    return render_template('test_modules.html')


