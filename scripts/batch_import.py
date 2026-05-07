#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
韩语词汇批量导入云数据库工具
直接将生成的词汇数据插入到微信云数据库
"""

import json
import requests
import time
from typing import List, Dict

class CloudDBImporter:
    """微信云数据库导入工具"""

    def __init__(self, env_id: str, access_token: str):
        """
        初始化
        :param env_id: 云环境ID，如 cloud1-d1g7vzv6g4cf5a6f0
        :param access_token: 小程序access_token
        """
        self.env_id = env_id
        self.access_token = access_token
        self.base_url = "https://api.weixin.qq.com/tcb"

    def batch_insert(self, collection: str, data: List[Dict]) -> bool:
        """
        批量插入数据到云数据库
        :param collection: 集合名称，如 'words'
        :param data: 要插入的数据列表
        """
        # 微信云数据库API每次最多插入100条
        batch_size = 100
        total = len(data)

        print(f"📦 准备导入 {total} 条数据到集合 '{collection}'")

        for i in range(0, total, batch_size):
            batch = data[i:i+batch_size]

            # 构造请求
            url = f"{self.base_url}/databaseadd"
            params = {
                "access_token": self.access_token
            }

            payload = {
                "env": self.env_id,
                "query": f"db.collection('{collection}').add({{data: {json.dumps(batch, ensure_ascii=False)}}})"
            }

            # 发送请求
            response = requests.post(url, params=params, json=payload)
            result = response.json()

            if result.get('errcode') == 0:
                print(f"✅ 成功导入第 {i+1}-{min(i+batch_size, total)} 条")
            else:
                print(f"❌ 导入失败: {result.get('errmsg')}")
                return False

            # 避免请求过快
            time.sleep(0.5)

        print(f"🎉 全部导入完成！共 {total} 条数据")
        return True

def get_access_token(appid: str, secret: str) -> str:
    """
    获取小程序access_token
    :param appid: 小程序AppID
    :param secret: 小程序AppSecret
    """
    url = "https://api.weixin.qq.com/cgi-bin/token"
    params = {
        "grant_type": "client_credential",
        "appid": appid,
        "secret": secret
    }

    response = requests.get(url, params=params)
    result = response.json()

    if 'access_token' in result:
        return result['access_token']
    else:
        raise Exception(f"获取access_token失败: {result.get('errmsg')}")

# ================== 使用示例 ==================

if __name__ == '__main__':
    print("=" * 60)
    print("韩语词汇批量导入工具")
    print("=" * 60)

    # 配置信息（需要从微信公众平台获取）
    CONFIG = {
        "appid": "wxc0db54094bccfcf0",        # 你的小程序AppID
        "secret": "你的AppSecret",              # ⚠️ 需要填写
        "env_id": "cloud1-d1g7vzv6g4cf5a6f0", # 云环境ID
        "collection": "words"                  # 集合名称
    }

    print("\n⚠️  使用前请确保：")
    print("1. 已在微信公众平台获取AppSecret")
    print("2. 已配置上方CONFIG中的secret字段")
    print("3. 云数据库已创建'words'集合")
    print()

    confirm = input("确认配置完成？(y/n): ")
    if confirm.lower() != 'y':
        print("❌ 已取消")
        exit()

    try:
        # 获取access_token
        print("\n🔑 获取access_token...")
        access_token = get_access_token(CONFIG['appid'], CONFIG['secret'])
        print(f"✅ 获取成功: {access_token[:20]}...")

        # 读取要导入的数据
        print("\n📖 读取词汇数据...")
        with open('korean_vocab_professional.json', 'r', encoding='utf-8') as f:
            vocab_data = json.load(f)
        print(f"✅ 读取成功: {len(vocab_data)} 条数据")

        # 创建导入器并导入
        print("\n📤 开始导入...")
        importer = CloudDBImporter(CONFIG['env_id'], access_token)
        success = importer.batch_insert(CONFIG['collection'], vocab_data)

        if success:
            print("\n🎊 导入完成！可以在云开发控制台查看数据")
        else:
            print("\n❌ 导入失败，请检查错误信息")

    except Exception as e:
        print(f"\n❌ 发生错误: {str(e)}")
