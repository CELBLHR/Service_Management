from flask import Flask, render_template, request, jsonify
from config import Config
from utils.wechat_api import WeChatAPI

app = Flask(__name__)
app.config.from_object(Config)

# 创建微信API实例
wechat_api = WeChatAPI()

@app.route('/')
def index():
    """主页 - 使用新的模板系统"""
    return render_template('index.html')

# ================== API路由 ==================

@app.route('/api/departments')
def get_departments():
    """获取部门列表API"""
    try:
        departments = wechat_api.get_departments()
        return jsonify({
            'success': True,
            'data': departments
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/users')
def get_users():
    """获取用户列表API"""
    department_id = request.args.get('department_id', 1)
    try:
        users = wechat_api.get_users(department_id)
        return jsonify({
            'success': True,
            'data': users
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/send_message', methods=['POST'])
def send_message():
    """发送消息API"""
    data = request.json
    user_ids = data.get('user_ids', [])
    content = data.get('content', '')
    
    if not user_ids:
        return jsonify({
            'success': False,
            'error': '用户ID列表不能为空'
        }), 400
    
    if not content.strip():
        return jsonify({
            'success': False,
            'error': '消息内容不能为空'
        }), 400
    
    try:
        result = wechat_api.send_message(user_ids, content)
        return jsonify({
            'success': True,
            'data': result,
            'message': '消息发送成功'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/batch_send_message', methods=['POST'])
def batch_send_message():
    """批量发送消息API"""
    data = request.json
    user_groups = data.get('user_groups', [])
    content = data.get('content', '')
    msg_type = data.get('msg_type', 'text')
    
    if not user_groups:
        return jsonify({
            'success': False,
            'error': '用户组列表不能为空'
        }), 400
    
    if not content.strip():
        return jsonify({
            'success': False,
            'error': '消息内容不能为空'
        }), 400
    
    try:
        # 这里可以实现批量发送逻辑
        # 为了演示，我们先简单处理
        total_users = sum(len(group) for group in user_groups)
        
        return jsonify({
            'success': True,
            'data': {
                'total_groups': len(user_groups),
                'total_users': total_users,
                'status': '批量发送任务已启动'
            },
            'message': f'批量消息发送任务已启动，预计发送给 {total_users} 个用户'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ================== 页面路由（为了SEO和直接访问） ==================

@app.route('/customer-service')
def customer_service():
    """客服管理页面"""
    return render_template('index.html')

@app.route('/customer-manage')
def customer_manage():
    """客户管理页面"""
    return render_template('index.html')

@app.route('/conversation-manage')
def conversation_manage():
    """回话管理页面"""
    return render_template('index.html')

# ================== 错误处理 ==================

@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({
        'success': False,
        'error': '页面未找到'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    return jsonify({
        'success': False,
        'error': '服务器内部错误'
    }), 500

# ================== 开发辅助功能 ==================

@app.route('/api/test')
def api_test():
    """API测试接口"""
    return jsonify({
        'success': True,
        'message': 'API服务正常',
        'timestamp': __import__('datetime').datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("========================================")
    print("企业微信管理平台启动中...")
    print("访问地址: http://localhost:5000")
    print("API测试: http://localhost:5000/api/test")
    print("========================================")
    app.run(debug=True, host='0.0.0.0', port=5000)