import requests
import time
from config import Config

class WeChatAPI:
    def __init__(self):
        self.corp_id = Config.WECHAT_CORP_ID
        self.secret = Config.WECHAT_SECRET
        self.agent_id = Config.WECHAT_AGENT_ID
        self.base_url = Config.WECHAT_API_BASE
        
        self.access_token = None
        self.token_expires_at = 0
    
    def get_access_token(self):
        """获取access_token，带缓存机制"""
        # 如果token还有效，直接返回
        if self.access_token and time.time() < self.token_expires_at:
            return self.access_token
        
        # 获取新token
        url = f"{self.base_url}/gettoken"
        params = {
            'corpid': self.corp_id,
            'corpsecret': self.secret
        }
        
        response = requests.get(url, params=params)
        result = response.json()
        
        if result.get('errcode') == 0:
            self.access_token = result['access_token']
            # token有效期7200秒，提前10分钟刷新
            self.token_expires_at = time.time() + result['expires_in'] - 600
            return self.access_token
        else:
            raise Exception(f"获取access_token失败: {result}")
    
    def get_departments(self):
        """获取部门列表"""
        token = self.get_access_token()
        url = f"{self.base_url}/department/list"
        params = {'access_token': token}
        
        response = requests.get(url, params=params)
        result = response.json()
        
        if result.get('errcode') == 0:
            return result['department']
        else:
            raise Exception(f"获取部门列表失败: {result}")
    
    def get_users(self, department_id=1):
        """获取客服列表"""
        token = self.get_access_token()
        url = f"{self.base_url}/kf/account/list"
        params = {
            'access_token': token,
        }
        
        response = requests.post(url, params=params)
        result = response.json()
        
        if result.get('errcode') == 0:
            return result
        else:
            raise Exception(f"获取客服列表失败: {result}")
    
    def send_message(self, user_ids, content):
        """发送消息给指定用户"""
        token = self.get_access_token()
        url = f"{self.base_url}/message/send"
        
        data = {
            'touser': '|'.join(user_ids),  # 用户ID列表，用|分隔
            'msgtype': 'text',
            'agentid': self.agent_id,
            'text': {
                'content': content
            }
        }
        
        response = requests.post(
            url, 
            params={'access_token': token},
            json=data
        )
        result = response.json()
        
        if result.get('errcode') == 0:
            return result
        else:
            raise Exception(f"发送消息失败: {result}")