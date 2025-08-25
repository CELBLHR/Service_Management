import requests

def get_access_token():
    """获取access_token测试企业微信连接"""
    url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
    params = {
        'corpid': 'ww81e2e7902594be7e',  # 你的企业ID
        'corpsecret': '6UXqSIEzfF29VUJZJ87zjLRNpR4MKE1J6sGQ6oSnW94'  # 你的应用Secret
    }
    
    response = requests.get(url, params=params)
    result = response.json()
    
    if result.get('errcode') == 0:
        print("✅ 企业微信API连接成功！")
        print(f"Access Token: {result['access_token']}")
        return result['access_token']
    else:
        print("❌ 连接失败:", result)
        return None

# 运行测试
if __name__ == '__main__':
    get_access_token()