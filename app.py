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


# ================== 客服管理相关API ==================

@app.route('/api/customer_service/list')
def get_customer_service_list():
    """获取客服列表API"""
    try:
        # 获取分页参数
        offset = int(request.args.get('offset', 0))
        limit = int(request.args.get('limit', 20))
        
        # 调用微信API获取客服列表
        result = wechat_api.get_kfs(offset=offset, limit=limit)
        
        # 处理返回数据
        if result:
            kf_list = result.get('account_list', [])
            
            # 格式化客服数据
            formatted_list = []
            for kf in kf_list:
                formatted_kf = {
                    'open_kfid': kf.get('open_kfid', ''),
                    'name': kf.get('name', '未命名客服'),
                    'avatar': kf.get('avatar', ''),  # 头像URL
                    'manage_privilege': kf.get('manage_privilege', False),  # 管理权限
                    'scene_type': kf.get('scene_type', 0)  # 场景类型
                }
                formatted_list.append(formatted_kf)
            
            return jsonify({
                'success': True,
                'data': {
                    'account_list': formatted_list,
                    'total_count': len(formatted_list),
                    'offset': offset,
                    'limit': limit
                }
            })
        else:
            return jsonify({
                'success': True,
                'data': {
                    'account_list': [],
                    'total_count': 0,
                    'offset': offset,
                    'limit': limit
                }
            })
            
    except Exception as e:
        print(f"获取客服列表失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'获取客服列表失败: {str(e)}'
        }), 500

@app.route('/api/customer_service/add', methods=['POST'])
def add_customer_service():
    """添加客服账号API"""
    try:
        data = request.json
        name = data.get('name', '')
        media_id = data.get('media_id', '')
        
        if not name:
            return jsonify({
                'success': False,
                'error': '客服名称不能为空'
            }), 400
        
        # 调用微信API添加客服
        open_kfid = wechat_api.add_kf(media_id=media_id, name=name)
        
        return jsonify({
            'success': True,
            'data': {
                'open_kfid': open_kfid,
                'name': name
            },
            'message': '客服账号创建成功'
        })
        
    except Exception as e:
        print(f"添加客服失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'添加客服失败: {str(e)}'
        }), 500

@app.route('/api/customer_service/delete/<open_kfid>', methods=['DELETE'])
def delete_customer_service(open_kfid):
    """删除客服账号API"""
    try:
        result = wechat_api.delete_kf(open_kfid)
        
        return jsonify({
            'success': True,
            'message': '客服账号删除成功'
        })
        
    except Exception as e:
        print(f"删除客服失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'删除客服失败: {str(e)}'
        }), 500

@app.route('/api/customer_service/update/<open_kfid>', methods=['PUT'])
def update_customer_service(open_kfid):
    """修改客服账号API"""
    try:
        data = request.json
        name = data.get('name')
        media_id = data.get('media_id')
        
        result = wechat_api.update_kf(open_kfid=open_kfid, name=name, media_id=media_id)
        
        return jsonify({
            'success': True,
            'message': '客服账号修改成功'
        })
        
    except Exception as e:
        print(f"修改客服失败: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'修改客服失败: {str(e)}'
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
    print("客服列表: http://localhost:5000/api/customer_service/list")
    print("========================================")
    app.run(debug=True, host='0.0.0.0', port=5000)