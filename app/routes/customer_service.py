from flask import Blueprint, request
from app.responses import success, fail
from app.services.wechat_service import WeChatService


customer_service_bp = Blueprint('customer_service', __name__, url_prefix='/api/customer_service')
service = WeChatService()


@customer_service_bp.get('/list')
def get_customer_service_list():
    try:
        offset = int(request.args.get('offset', 0))
        limit = int(request.args.get('limit', 20))

        data = service.list_customer_services(offset=offset, limit=limit)
        return success(data=data)
    except Exception as e:
        print(f"获取客服列表失败: {str(e)}")
        return fail(f'获取客服列表失败: {str(e)}', code='ServiceError', status=500)


@customer_service_bp.post('/add')
def add_customer_service():
    try:
        data = request.json or {}
        name = data.get('name', '').strip()
        media_id = data.get('media_id', '').strip()

        if not name:
            return fail('客服名称不能为空', code='ValidationError', status=400)

        result = service.add_customer_service(name=name, media_id=media_id)
        return success(data=result, message='客服账号创建成功')
    except Exception as e:
        print(f"添加客服失败: {str(e)}")
        return fail(f'添加客服失败: {str(e)}', code='ServiceError', status=500)


@customer_service_bp.delete('/delete/<open_kfid>')
def delete_customer_service(open_kfid: str):
    try:
        service.delete_customer_service(open_kfid)
        return success(message='客服账号删除成功')
    except Exception as e:
        print(f"删除客服失败: {str(e)}")
        return fail(f'删除客服失败: {str(e)}', code='ServiceError', status=500)


@customer_service_bp.put('/update/<open_kfid>')
def update_customer_service(open_kfid: str):
    try:
        data = request.json or {}
        name = data.get('name')
        media_id = data.get('media_id')
        service.update_customer_service(open_kfid=open_kfid, name=name, media_id=media_id)
        return success(message='客服账号修改成功')
    except Exception as e:
        print(f"修改客服失败: {str(e)}")
        return fail(f'修改客服失败: {str(e)}', code='ServiceError', status=500)


