from flask import Blueprint, request
from app.responses import success, fail
from app.services.wechat_service import WeChatService


message_bp = Blueprint('message', __name__, url_prefix='/api')
service = WeChatService()


@message_bp.post('/send_message')
def send_message():
    data = request.json or {}
    user_ids = data.get('user_ids', [])
    content = (data.get('content') or '').strip()

    if not user_ids:
        return fail('用户ID列表不能为空', code='ValidationError', status=400)
    if not content:
        return fail('消息内容不能为空', code='ValidationError', status=400)

    try:
        result = service.send_message(user_ids=user_ids, content=content)
        return success(data=result, message='消息发送成功')
    except Exception as e:
        return fail(str(e), code='ServiceError', status=500)


@message_bp.post('/batch_send_message')
def batch_send_message():
    data = request.json or {}
    user_groups = data.get('user_groups', [])
    content = (data.get('content') or '').strip()
    msg_type = data.get('msg_type', 'text')

    if not user_groups:
        return fail('用户组列表不能为空', code='ValidationError', status=400)
    if not content:
        return fail('消息内容不能为空', code='ValidationError', status=400)

    try:
        result = service.batch_send_message(user_groups=user_groups, content=content, msg_type=msg_type)
        message = f"批量消息发送任务已启动，预计发送给 {result.get('total_users', 0)} 个用户"
        return success(data=result, message=message)
    except Exception as e:
        return fail(str(e), code='ServiceError', status=500)


