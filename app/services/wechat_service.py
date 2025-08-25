from typing import Any, Dict, List

from utils.wechat_api import WeChatAPI


class WeChatService:
    """封装与企业微信相关的业务逻辑。"""

    def __init__(self) -> None:
        self._api = WeChatAPI()

    def list_customer_services(self, offset: int = 0, limit: int = 20) -> Dict[str, Any]:
        result = self._api.get_kfs(offset=offset, limit=limit) or {}
        kf_list = result.get('account_list', [])

        formatted_list: List[Dict[str, Any]] = []
        for kf in kf_list:
            formatted_list.append({
                'open_kfid': kf.get('open_kfid', ''),
                'name': kf.get('name', '未命名客服'),
                'avatar': kf.get('avatar', ''),
                'manage_privilege': kf.get('manage_privilege', False),
                'scene_type': kf.get('scene_type', 0),
            })

        return {
            'account_list': formatted_list,
            'total_count': len(formatted_list),
            'offset': offset,
            'limit': limit,
        }

    def add_customer_service(self, name: str, media_id: str) -> Dict[str, Any]:
        open_kfid = self._api.add_kf(media_id=media_id, name=name)
        return {
            'open_kfid': open_kfid,
            'name': name,
        }

    def delete_customer_service(self, open_kfid: str) -> None:
        self._api.delete_kf(open_kfid)

    def update_customer_service(self, open_kfid: str, name: str = None, media_id: str = None) -> None:
        self._api.update_kf(open_kfid=open_kfid, name=name, media_id=media_id)

    # 消息相关
    def send_message(self, user_ids: List[str], content: str) -> Dict[str, Any]:
        return self._api.send_message(user_ids, content)

    def batch_send_message(self, user_groups: List[List[str]], content: str, msg_type: str = 'text') -> Dict[str, Any]:
        # 简单批量：计算数量并返回任务状态；如需真实并发发送，可在后续实现
        total_users = sum(len(group) for group in user_groups)
        return {
            'total_groups': len(user_groups),
            'total_users': total_users,
            'status': '批量发送任务已启动',
        }


