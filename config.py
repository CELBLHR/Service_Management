class Config:
    # 企业微信配置
    WECHAT_CORP_ID = 'wwc02b06afb8257767'      # 替换为你的企业ID
    WECHAT_SECRET = '4S6u3Q0jyHoOLo2ic0-O9GUEOD7CworO0aS0JXcqZLE'        # 替换为你的应用Secret
    WECHAT_AGENT_ID = 1000002                 # 替换为你的应用AgentId
    
    # Flask配置
    # SECRET_KEY = '6gOwC3Az2h4SIbI0xTzXFamAr1sxTt461IJI8gXJtDejMyCqtydViZ1sWT2_8dhoTejwSQGuI2apXBX6RugcPBpaAhyREO_nBL5ODSbnawRmnaaxbg9vnuXCaUp16A0i2l_jlyS3XXmowjVbRG5K2MUPD-BP9U95aUbAQvi7GOAw_m76aPe-o53spf3wp_27f5A6breXBkYT-s5AGNOooQ'
    DEBUG = True
    
    # API基础URL
    WECHAT_API_BASE = 'https://qyapi.weixin.qq.com/cgi-bin'