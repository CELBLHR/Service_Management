import os

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

    #获取access_token
    def get_access_token(self):
        """获取access_token，带缓存机制"""
        # 如果token还有效，直接返回
        if self.access_token and time.time() < self.token_expires_at:
            return self.access_token
        
        try:
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
                # 企业微信API错误，返回完整错误信息
                raise Exception(f"企业微信API错误: {result}")
        except requests.exceptions.RequestException as e:
            # 网络请求错误，包含详细的连接信息
            raise Exception(f"网络请求失败: {str(e)}")
        except Exception as e:
            # 其他错误
            raise Exception(f"获取access_token失败: {str(e)}")

    #获取部门列表
    def get_departments(self):
        """获取部门列表"""
        try:
            token = self.get_access_token()
            url = f"{self.base_url}/department/list"
            params = {'access_token': token}
            
            response = requests.get(url, params=params)
            result = response.json()
            
            if result.get('errcode') == 0:
                return result['department']
            else:
                # 企业微信API错误，返回完整错误信息
                raise Exception(f"企业微信API错误: {result}")
        except requests.exceptions.RequestException as e:
            # 网络请求错误，包含详细的连接信息
            raise Exception(f"网络请求失败: {str(e)}")
        except Exception as e:
            # 其他错误
            raise Exception(f"获取部门列表失败: {str(e)}")


    #发送消息给指定用户
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

    #添加客服账号
    def add_kf(self,media_id,name="test",):
        token = self.get_access_token()
        url = f"{self.base_url}/kf/account/add"
        params = {'access_token': token}
        data={
            "name": name,
            "media_id": media_id
        }
        response = requests.post(
            url,
            params=params,
            json=data,  # 使用json参数自动序列化并设置Content-Type
        )
        result = response.json()

        if result.get('errcode') == 0:
            return result['open_kfid']
        else:
            raise Exception(f"添加客服账号失败: {result}")


    #删除客服账号
    def delete_kf(self,open_kfid):
        token = self.get_access_token()
        url = f"{self.base_url}/kf/account/del"
        params = {'access_token': token}
        data = {
            "open_kfid": open_kfid,
        }
        response = requests.post(
            url,
            params=params,
            json=data,  # 使用json参数自动序列化
        )
        result = response.json()
        if result.get('errcode') == 0:
            return "ok"
        else:
            raise Exception(f"删除客服账号{open_kfid}失败: {result}")
        pass

    #修改客服账号
    def update_kf(self,open_kfid,name=None,media_id=None):
        token = self.get_access_token()
        url = f"{self.base_url}/kf/account/update"
        params = {'access_token': token}
        data={
            "open_kfid": open_kfid,
            "name": name,
            "media_id": media_id
        }
        if not name:
            data.pop('name', None)
        if not media_id:
            data.pop('media_id', None)
        response = requests.post(
            url,
            params=params,
            json=data,  # 使用json参数自动序列化并设置Content-Type
        )
        result = response.json()

        if result.get('errcode') == 0:
            return "ok"
        else:
            raise Exception(f"修改客服账号失败: {result}")


    # 获取客服列表
    def get_kfs(self,offset=0,limit=10):
        """获取客服列表"""
        try:
            token = self.get_access_token()
            url = f"{self.base_url}/kf/account/list"
            params = {
                'access_token': token,
            }
            data={
                "offset": offset,#偏移量
                "limit": limit#返回客服数量最大值，这两个参数适用于客服太多时分页显示
            }
            response = requests.post(url, params=params,json=data)
            result = response.json()

            if result.get('errcode') == 0:
                return result
            else:
                # 企业微信API错误，返回完整错误信息
                raise Exception(f"企业微信API错误: {result}")
        except requests.exceptions.RequestException as e:
            # 网络请求错误，包含详细的连接信息
            raise Exception(f"网络请求失败: {str(e)}")
        except Exception as e:
            # 其他错误
            raise Exception(f"获取客服列表失败: {str(e)}")

    #获取客服账号链接
    def get_kf_url(self,open_kfid,scene=None):
        """获取客服账号链接"""
        token = self.get_access_token()
        url = f"{self.base_url}/kf/add_contact_way"
        params = {
            'access_token': token,
        }
        data={
            "open_kfid": open_kfid,
            "scene": scene
        }
        if not scene:
            data.pop('scene', None)
        response = requests.post(url, params=params,json=data)
        result = response.json()

        if result.get('errcode') == 0:
            return result['url']
        else:
            raise Exception(f"获取客服链接失败: {result}")


    #添加招待人员
    def add_server(self,open_kfid,userid_list):
        """添加招待人员"""
        token = self.get_access_token()
        url = f"{self.base_url}/kf/servicer/add"
        params = {
            'access_token': token,
        }
        data={
            "open_kfid": open_kfid,
            "userid_list": userid_list
        }
        response = requests.post(url, params=params,json=data)
        result = response.json()

        if result.get('errcode') == 0:
            return result['result_list']
        else:
            raise Exception(f"添加招待人员: {result}")

    #删除招待人员
    def delete_server(self,open_kfid,userid_list):
        """删除招待人员"""
        token = self.get_access_token()
        url = f"{self.base_url}/kf/servicer/del"
        params = {
            'access_token': token,
        }
        data={
            "open_kfid": open_kfid,
            "userid_list": userid_list
        }
        response = requests.post(url, params=params,json=data)
        result = response.json()

        if result.get('errcode') == 0:
            return result['result_list']
        else:
            raise Exception(f"删除招待人员: {result}")
        pass

    #获取招待人员列表
    def get_servers_list(self,open_kfid):
        """获取招待人员列表"""
        token = self.get_access_token()
        url = f"{self.base_url}/kf/servicer/list"
        params = {
            'access_token': token,
            "open_kfid": open_kfid,
        }
        response = requests.get(url, params=params)
        result = response.json()

        if result.get('errcode') == 0:
            return result
        else:
            raise Exception(f"获取招待人员列表失败: {result}")
        pass

    #上传临时素材
    def upload_temporary_media(self,media_type,file_path):
        # 验证文件是否存在
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"文件不存在: {file_path}")

        # 验证媒体类型
        valid_types = ['image', 'voice', 'video', 'file']
        if media_type not in valid_types:
            raise ValueError(f"不支持的媒体类型: {media_type}，支持的类型: {valid_types}")

        # 构建请求URL
        token = self.get_access_token()
        url = f"{self.base_url}/media/upload"
        params = {
            'access_token': token,
            "type":media_type
        }

        try:
            # 读取文件并上传
            with open(file_path, 'rb') as file:
                files = {
                    'media': (
                        os.path.basename(file_path),  # filename
                        file,  # file content
                        'application/octet-stream'  # content-type
                    )
                }

                response = requests.post(url, params=params, files=files)
                result = response.json()

                # 检查响应
                if result.get('errcode') != 0:
                    raise Exception(f"上传失败: {result.get('errmsg', '未知错误')}")

                return result

        except Exception as e:
            raise Exception(f"上传过程中发生错误: {str(e)}")