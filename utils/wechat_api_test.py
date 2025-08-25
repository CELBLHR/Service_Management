import requests
import wechat_api
"""测试各类接口"""
# def get_access_token():
#     """获取access_token测试企业微信连接"""
#     url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
#     params = {
#         'corpid': 'ww81e2e7902594be7e',  # 你的企业ID
#         'corpsecret': '6UXqSIEzfF29VUJZJ87zjLRNpR4MKE1J6sGQ6oSnW94'  # 你的应用Secret
#     }
#
#     response = requests.get(url, params=params)
#     result = response.json()
#
#     if result.get('errcode') == 0:
#         print("✅ 企业微信API连接成功！")
#         print(f"Access Token: {result['access_token']}")
#         return result['access_token']
#     else:
#         print("❌ 连接失败:", result)
#         return None

# 运行测试
if __name__ == '__main__':
    # get_access_token()
    wechat_api=wechat_api.WeChatAPI()

    # media10=wechat_api.upload_temporary_media("image","10.png")
    # media9=wechat_api.upload_temporary_media("image","9.png")
    # result=wechat_api.add_kf(media_id=media10['media_id'],name="测试4")
    # result = wechat_api.delete_kf("wkkU8wMgAAx15FRocuzbuaOEmuiFghmA")
    # res=wechat_api.update_kf(open_kfid=result,name="测试3",media_id=media9['media_id'])
    # url=wechat_api.get_kf_url(open_kfid="wkkU8wMgAAw11_84c2rC8ODXiVcbIMbA")
    # result=wechat_api.get_kfs()
    # result=wechat_api.get_servers_list("wkkU8wMgAASoQ_Yf6yiWlRHUWXfVU3TA")
    # result=wechat_api.add_server(open_kfid="wkkU8wMgAAw11_84c2rC8ODXiVcbIMbA",userid_list=["ZhangJiaJun"])
    # result = wechat_api.delete_server(open_kfid="wkkU8wMgAAw11_84c2rC8ODXiVcbIMbA", userid_list=["ZhangJiaJun"])

    print(result)

