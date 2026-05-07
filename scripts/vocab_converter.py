#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
韩语词汇表转换工具
支持多种文本格式转换为数据库JSON格式
"""

import json
import re

def parse_vocab_line(line):
    """
    解析不同格式的词汇行
    支持格式:
    - 안녕하세요 - 你好
    - 안녕하세요 你好
    - 안녕하세요	你好
    - 안녕하세요|你好
    """
    line = line.strip()
    if not line:
        return None

    # 尝试不同的分隔符
    separators = [' - ', '|', '\t', '  ']
    for sep in separators:
        if sep in line:
            parts = line.split(sep, 1)
            if len(parts) == 2:
                return {
                    'korean': parts[0].strip(),
                    'chinese': parts[1].strip()
                }

    return None

def convert_vocab_file(input_file, output_file):
    """
    将文本词汇表转换为JSON格式
    """
    vocabs = []

    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            vocab = parse_vocab_line(line)
            if vocab:
                # 添加默认字段
                vocab_entry = {
                    'korean': vocab['korean'],
                    'chinese': vocab['chinese'],
                    'pronunciation': '',  # 需要后续补充
                    'type': '名词',  # 默认类型
                    'imageUrl': f'https://source.unsplash.com/400x400/?{vocab["chinese"]}',
                    'audioUrl': '',
                    'category': '日常',
                    'level': 1
                }
                vocabs.append(vocab_entry)

    # 保存为JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(vocabs, f, ensure_ascii=False, indent=2)

    print(f'✅ 成功转换 {len(vocabs)} 个单词')
    print(f'📁 输出文件: {output_file}')
    return vocabs

def manual_input():
    """
    手动输入模式
    """
    print('=' * 50)
    print('韩语词汇手动录入模式')
    print('格式: 韩语 - 中文 (输入空行结束)')
    print('=' * 50)

    vocabs = []
    while True:
        line = input('输入词汇: ').strip()
        if not line:
            break

        vocab = parse_vocab_line(line)
        if vocab:
            vocab_entry = {
                'korean': vocab['korean'],
                'chinese': vocab['chinese'],
                'pronunciation': '',
                'type': '名词',
                'imageUrl': f'https://source.unsplash.com/400x400/?{vocab["chinese"]}',
                'audioUrl': '',
                'category': '日常',
                'level': 1
            }
            vocabs.append(vocab_entry)
            print(f'  ✓ 已添加: {vocab["korean"]} - {vocab["chinese"]}')
        else:
            print('  ✗ 格式错误，请使用: 韩语 - 中文')

    if vocabs:
        output_file = 'vocab_output.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(vocabs, f, ensure_ascii=False, indent=2)
        print(f'\n✅ 已保存 {len(vocabs)} 个单词到 {output_file}')
    else:
        print('\n⚠️  没有录入任何单词')

if __name__ == '__main__':
    import sys

    print('韩语词汇转换工具')
    print('-' * 50)
    print('用法1: python convert_vocab_to_json.py input.txt output.json')
    print('用法2: python convert_vocab_to_json.py (手动输入模式)')
    print('-' * 50)

    if len(sys.argv) >= 3:
        # 文件转换模式
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        convert_vocab_file(input_file, output_file)
    else:
        # 手动输入模式
        manual_input()
