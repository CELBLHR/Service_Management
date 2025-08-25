from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import hashlib
import base64
import json
import time
import random
import string
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad, pad
import xml.etree.ElementTree as ET
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域访问

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('wechat_callback.log'),
        logging.StreamHandler()
    ]
)

# 配置信息 - 需要替换为你的实际配置
CORP_ID = "ww81e2e7902594be7e"  # 企业ID
TOKEN = "4Zf9EMdmCyOl98Y91hCB3D"      # 回调URL验证的Token
ENCODING_AES_KEY = "RE1MSHdQ4ar12EFA7ntsKR8rpkj0j4OMbpInNLSexu7"  # 消息加解密密钥

class WXBizMsgCrypt:
    """企业微信消息加解密类"""
    
    def __init__(self, token, encoding_aes_key, corp_id):
        self.token = token
        self.encoding_aes_key = encoding_aes_key
        self.corp_id = corp_id
        
        try:
            # AES密钥：Base64解码EncodingAESKey + "="
            self.aes_key = base64.b64decode(encoding_aes_key + "=")
            if len(self.aes_key) != 32:
                raise ValueError("AES密钥长度必须为32字节")
        except Exception as e:
            logging.error(f"AES密钥初始化失败: {e}")
            raise ValueError("无效的EncodingAESKey")
    
    def _generate_signature(self, token, timestamp, nonce, encrypt_msg):
        """生成签名"""
        sort_list = [token, timestamp, nonce, encrypt_msg]
        sort_list.sort()
        sha = hashlib.sha1()
        sha.update("".join(sort_list).encode('utf-8'))
        return sha.hexdigest()
    
    def _decrypt(self, encrypt_msg):
        """解密消息"""
        try:
            # Base64解码
            cipher_text = base64.b64decode(encrypt_msg)
            
            # IV是AES密钥的前16字节（企业微信规范）
            iv = self.aes_key[:16]
            
            # AES解密 - CBC模式
            cipher = AES.new(self.aes_key, AES.MODE_CBC, iv)
            decrypted = cipher.decrypt(cipher_text)
            
            # 手动去除PKCS#7填充
            pad_num = decrypted[-1]
            if isinstance(pad_num, str):
                pad_num = ord(pad_num)
            decrypted = decrypted[:-pad_num]
            
            # 解析解密后的数据结构
            # 数据结构：16字节随机字符串 + 4字节消息长度(网络字节序) + 消息内容 + 企业ID
            
            # 跳过16字节随机字符串
            content = decrypted[16:]
            
            # 获取消息长度（网络字节序，大端序）
            import struct
            msg_len = struct.unpack('>I', content[:4])[0]  # >I表示大端序无符号整数
            
            # 提取消息内容
            msg_content = content[4:4+msg_len]
            
            # 提取企业ID
            from_corp_id = content[4+msg_len:]
            
            # 转换为字符串
            msg_content = msg_content.decode('utf-8')
            from_corp_id = from_corp_id.decode('utf-8')
            
            # 验证企业ID
            if from_corp_id != self.corp_id:
                logging.error(f"企业ID不匹配: 期望{self.corp_id}, 实际{from_corp_id}")
                raise ValueError("企业ID不匹配")
                
            logging.info("解密成功")
            return msg_content
            
        except Exception as e:
            logging.error(f"解密失败: {e}")
            return None
    
    def _encrypt(self, msg_content):
        """加密消息"""
        try:
            # 生成16字节随机字符串
            random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
            
            # 获取消息字节数
            msg_bytes = msg_content.encode('utf-8')
            msg_len = len(msg_bytes)
            
            # 构造待加密内容：16字节随机串 + 4字节消息长度(网络字节序) + 消息内容 + 企业ID
            import struct
            content = (
                random_str.encode('utf-8') + 
                struct.pack('>I', msg_len) +  # 网络字节序（大端序）
                msg_bytes + 
                self.corp_id.encode('utf-8')
            )
            
            # PKCS#7填充
            content = pad(content, AES.block_size)
            
            # IV使用AES密钥的前16字节（企业微信规范）
            iv = self.aes_key[:16]
            
            # AES加密
            cipher = AES.new(self.aes_key, AES.MODE_CBC, iv)
            encrypted = cipher.encrypt(content)
            
            # Base64编码
            return base64.b64encode(encrypted).decode('utf-8')
            
        except Exception as e:
            logging.error(f"加密失败: {e}")
            return None

# 初始化加解密工具
msg_crypt = WXBizMsgCrypt(TOKEN, ENCODING_AES_KEY, CORP_ID)

@app.route('/wechat/callback', methods=['GET', 'POST'])
def wechat_callback():
    """企业微信回调接口"""
    
    # 记录访问IP和时间
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    logging.info(f"收到请求 - IP: {client_ip}, Method: {request.method}, Time: {datetime.now()}")
    
    if request.method == 'GET':
        # URL验证
        return verify_url()
    elif request.method == 'POST':
        # 接收消息和事件
        return receive_message()

def verify_url():
    """验证回调URL"""
    try:
        # 获取URL参数
        msg_signature = request.args.get('msg_signature')
        timestamp = request.args.get('timestamp')
        nonce = request.args.get('nonce')
        echostr = request.args.get('echostr')
        
        if not all([msg_signature, timestamp, nonce, echostr]):
            return "参数不完整", 400
        
        # 验证签名
        signature = msg_crypt._generate_signature(TOKEN, timestamp, nonce, echostr)
        
        if signature != msg_signature:
            return "签名验证失败", 403
        
        # 解密echostr
        decrypted_echo = msg_crypt._decrypt(echostr)
        if decrypted_echo is None:
            return "解密失败", 500
        
        return decrypted_echo
        
    except Exception as e:
        print(f"URL验证失败: {e}")
        return "验证失败", 500

def receive_message():
    """接收消息和事件"""
    try:
        # 获取请求参数
        msg_signature = request.args.get('msg_signature')
        timestamp = request.args.get('timestamp') 
        nonce = request.args.get('nonce')
        
        if not all([msg_signature, timestamp, nonce]):
            return "参数不完整", 400
        
        # 获取加密的消息体
        data = request.get_data().decode('utf-8')
        if not data:
            return "消息体为空", 400
            
        # 解析XML
        root = ET.fromstring(data)
        encrypt_msg = root.find('Encrypt').text
        
        # 验证签名
        signature = msg_crypt._generate_signature(TOKEN, timestamp, nonce, encrypt_msg)
        if signature != msg_signature:
            return "签名验证失败", 403
        
        # 解密消息
        decrypted_msg = msg_crypt._decrypt(encrypt_msg)
        if decrypted_msg is None:
            return "解密失败", 500
        
        # 解析消息内容
        msg_root = ET.fromstring(decrypted_msg)
        msg_type = msg_root.find('MsgType').text
        
        print(f"收到消息类型: {msg_type}")
        print(f"消息内容: {decrypted_msg}")
        
        # 根据消息类型处理
        response_msg = handle_message(msg_root)
        
        if response_msg:
            # 加密响应消息
            encrypted_response = msg_crypt._encrypt(response_msg)
            if encrypted_response:
                # 生成响应签名
                response_signature = msg_crypt._generate_signature(TOKEN, timestamp, nonce, encrypted_response)
                
                # 构造响应XML
                response_xml = f'''<xml>
<Encrypt><![CDATA[{encrypted_response}]]></Encrypt>
<MsgSignature><![CDATA[{response_signature}]]></MsgSignature>
<TimeStamp>{timestamp}</TimeStamp>
<Nonce><![CDATA[{nonce}]]></Nonce>
</xml>'''
                return response_xml
        
        return "success"
        
    except Exception as e:
        print(f"接收消息失败: {e}")
        return "处理失败", 500

def handle_message(msg_root):
    """处理具体消息"""
    msg_type = msg_root.find('MsgType').text
    from_user = msg_root.find('FromUserName').text
    to_user = msg_root.find('ToUserName').text
    
    if msg_type == 'text':
        # 处理文本消息
        content = msg_root.find('Content').text
        print(f"收到文本消息: {content} (来自: {from_user})")
        
        # 简单的回复逻辑
        reply_content = f"收到您的消息: {content}"
        return create_text_reply(from_user, to_user, reply_content)
        
    elif msg_type == 'event':
        # 处理事件消息
        event = msg_root.find('Event').text
        print(f"收到事件: {event} (来自: {from_user})")
        
        if event == 'subscribe':
            # 关注事件
            reply_content = "欢迎关注我们的企业应用！"
            return create_text_reply(from_user, to_user, reply_content)
        elif event == 'unsubscribe':
            # 取消关注事件
            print(f"用户 {from_user} 取消关注")
        elif event == 'click':
            # 菜单点击事件
            event_key = msg_root.find('EventKey').text
            print(f"菜单点击事件: {event_key}")
            
    elif msg_type == 'image':
        # 处理图片消息
        pic_url = msg_root.find('PicUrl').text
        media_id = msg_root.find('MediaId').text
        print(f"收到图片消息: {pic_url} (MediaId: {media_id})")
        
        reply_content = "收到您发送的图片"
        return create_text_reply(from_user, to_user, reply_content)
    
    return None

def create_text_reply(to_user, from_user, content):
    """创建文本回复消息"""
    timestamp = int(time.time())
    
    reply_xml = f'''<xml>
<ToUserName><![CDATA[{to_user}]]></ToUserName>
<FromUserName><![CDATA[{from_user}]]></FromUserName>
<CreateTime>{timestamp}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[{content}]]></Content>
</xml>'''
    
    return reply_xml

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    return jsonify({
        "status": "ok", 
        "timestamp": int(time.time()),
        "server_time": datetime.now().isoformat(),
        "client_ip": client_ip,
        "config": {
            "corp_id": CORP_ID[:6] + "***" if CORP_ID != "your_corp_id" else "未配置",
            "token_configured": TOKEN != "your_token",
            "aes_key_configured": ENCODING_AES_KEY != "your_encoding_aes_key"
        }
    })

@app.route('/test', methods=['GET'])
def test_endpoint():
    """测试接口"""
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    headers = dict(request.headers)
    
    return jsonify({
        "message": "测试接口访问成功！",
        "client_ip": client_ip,
        "timestamp": datetime.now().isoformat(),
        "headers": headers,
        "url": request.url,
        "method": request.method
    })

@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    logging.warning(f"404错误 - IP: {client_ip}, URL: {request.url}")
    return jsonify({"error": "接口不存在", "code": 404}), 404

@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    logging.error(f"500错误 - IP: {client_ip}, Error: {str(error)}")
    return jsonify({"error": "服务器内部错误", "code": 500}), 500

def check_config():
    """检查配置是否完整"""
    issues = []
    
    if CORP_ID == "your_corp_id":
        issues.append("❌ CORP_ID 未配置")
    else:
        print(f"✅ CORP_ID: {CORP_ID[:6]}***")
    
    if TOKEN == "your_token":
        issues.append("❌ TOKEN 未配置")
    else:
        print(f"✅ TOKEN: {TOKEN[:6]}***")
        
    if ENCODING_AES_KEY == "your_encoding_aes_key":
        issues.append("❌ ENCODING_AES_KEY 未配置")
    else:
        print(f"✅ ENCODING_AES_KEY: {ENCODING_AES_KEY[:6]}***")
    
    if issues:
        print("\n⚠️  配置问题:")
        for issue in issues:
            print(f"   {issue}")
        print("\n请在代码中正确配置这些参数！\n")
        return False
    
    print("✅ 所有配置检查通过！\n")
    return True

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 企业微信回调服务器启动...")
    print("=" * 50)
    
    # 检查配置
    config_ok = check_config()
    
    print("📡 本地访问地址:")
    print(f"   http://localhost:5000/wechat/callback")
    print(f"   http://127.0.0.1:5000/wechat/callback")
    
    print("\n🌐 外网访问方案:")
    print("   1. 使用 ngrok: ngrok http 5000")
    print("   2. 使用 frp: 需要云服务器")
    print("   3. 路由器端口转发: 需要公网IP")
    
    print("\n🔧 测试接口:")
    print(f"   健康检查: http://localhost:5000/health")
    print(f"   测试接口: http://localhost:5000/test")
    
    print("\n📝 日志文件: wechat_callback.log")
    
    if not config_ok:
        print("\n⚠️  警告: 配置未完成，请先配置相关参数！")
    
    print("=" * 50)
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except Exception as e:
        print(f"\n❌ 启动失败: {e}")
        logging.error(f"服务器启动失败: {e}")