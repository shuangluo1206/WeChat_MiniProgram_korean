# HanCard-MVP 项目结构说明

## 📁 目录结构总览

```
HanCard-MVP/
├── cloudfunctions/          # 云函数
│   ├── importWords/         # 词汇批量导入
│   └── login/              # 用户登录
├── pages/                  # 页面
│   ├── import/             # 词汇管理页面
│   ├── learn/              # 学习页面（核心）
│   ├── calendar/           # 打卡日历
│   └── stats/              # 统计页面
├── utils/                  # 工具函数
│   └── memory.js           # 艾宾浩斯记忆算法
├── scripts/                # 开发工具脚本
│   ├── vocab_generator.py          # 词汇生成器
│   ├── vocab_converter.py          # 词汇格式转换
│   ├── batch_import.py             # 批量导入脚本
│   ├── korean_vocab_full.json      # 完整词库（151词）
│   └── README.md                   # 词库说明文档
├── app.js                  # 小程序入口
├── app.json                # 全局配置
├── app.wxss                # 全局样式
└── project.config.json     # 项目配置
```

---

## 🗂️ 详细说明

### 1️⃣ 云函数 `cloudfunctions/`

#### `importWords/` - 词汇批量导入
**功能**：
- 批量导入词汇到云数据库
- 智能去重（根据韩语单词）
- 完全替换模式

**使用**：
- 在管理页面 (`pages/import`) 调用
- 支持智能导入和完全替换两种模式

**文件**：
- `index.js` - 云函数逻辑
- `package.json` - 依赖配置

---

#### `login/` - 用户登录
**功能**：
- 获取用户openid
- 用于学习记录关联

**使用**：
- 小程序启动时自动调用 (`app.js`)

**文件**：
- `index.js` - 云函数逻辑
- `package.json` - 依赖配置

---

### 2️⃣ 页面 `pages/`

#### `learn/` - 学习页面 ⭐核心⭐
**功能**：
- 单词卡片展示
- 词源标注显示（汉字词/固有词/外来语）
- TOPIK例句展示
- 语音播放（Google TTS）
- 答题反馈
- 进度统计

**文件**：
- `learn.js` - 页面逻辑
- `learn.wxml` - 页面结构
- `learn.wxss` - 页面样式
- `learn.json` - 页面配置

**核心功能**：
```javascript
// 加载单词
loadTodayTasks()

// 播放发音（Google TTS）
playAudio()

// 答题
onAnswer(e)

// 下一个单词
nextWord()
```

---

#### `import/` - 词汇管理页面
**功能**：
- 查看词库统计
- 批量导入词汇
- 清空数据库
- 显示导入进度

**文件**：
- `import.js` - 页面逻辑
- `import.wxml` - 页面结构
- `import.wxss` - 页面样式
- `import.json` - 页面配置

**使用场景**：
- 首次导入词库
- 更新词库版本
- 开发调试

---

#### `calendar/` - 打卡日历
**功能**：
- 显示学习日历
- 连续打卡统计

**状态**：基础框架已建立，待完善

---

#### `stats/` - 统计页面
**功能**：
- 学习统计数据
- 已学单词数
- 掌握单词数

**状态**：基础框架已建立，待完善

---

### 3️⃣ 工具函数 `utils/`

#### `memory.js` - 艾宾浩斯记忆算法
**功能**：
- 计算下次复习时间
- 根据答题正确性调整复习间隔
- 记忆等级管理

**核心函数**：
```javascript
calculateNextReview(currentLevel, isCorrect)
// 返回: { nextLevel, nextReviewTime, status }
```

**使用**：
- 在 `pages/learn/learn.js` 中调用
- 提交答案时计算下次复习时间

---

### 4️⃣ 开发脚本 `scripts/`

#### `vocab_generator.py` - 词汇生成器 ⭐
**功能**：
- 生成带例句的韩语词汇
- 自动标注词源（汉字词/固有词/外来语）
- TOPIK分级
- 生成JSON格式数据

**使用**：
```bash
python3 vocab_generator.py
# 输出: korean_vocab_full.json
```

**可扩展**：
- 在脚本中添加新单词
- 自动生成对应格式

---

#### `vocab_converter.py` - 词汇格式转换
**功能**：
- 将文本格式转换为JSON
- 支持多种分隔符
- 批量添加默认字段

**使用**：
```bash
python3 vocab_converter.py input.txt output.json
```

**输入格式**：
```
안녕하세요 - 你好
고양이 - 猫
```

---

#### `batch_import.py` - 批量导入脚本
**功能**：
- 通过API直接导入云数据库
- 需要AppID和Secret

**使用**：
```bash
# 配置好AppID和Secret后
python3 batch_import.py
```

**注意**：可选工具，推荐使用小程序内的管理页面导入

---

#### `korean_vocab_full.json` - 完整词库 ⭐
**内容**：
- 151个韩语单词
- 168个TOPIK例句
- 完整词源标注
- 初中高三级分类

**数据结构**：
```json
{
  "korean": "학교",
  "chinese": "学校",
  "pronunciation": "hak-gyo",
  "type": "名词",
  "origin": "hanja",
  "etymology": "學校",
  "sourceLanguage": "chinese",
  "level": "beginner",
  "topikLevel": "1-2",
  "category": "地点",
  "imageUrl": "...",
  "audioUrl": "",
  "examples": [
    {
      "korean": "학교에 갑니다.",
      "chinese": "去学校。"
    }
  ]
}
```

---

#### `README.md` - 词库说明文档
**内容**：
- 词库统计信息
- 分类明细
- 使用方法
- 扩展计划

---

### 5️⃣ 配置文件

#### `app.js` - 小程序入口
**功能**：
- 初始化云开发
- 获取用户openid
- 全局变量配置

**关键配置**：
```javascript
wx.cloud.init({
  env: 'cloud1-d1g7vzv6g4cf5a6f0'
})
```

---

#### `app.json` - 全局配置
**内容**：
- 页面路由
- 导航栏样式（粉白配色）
- 云开发配置

---

#### `app.wxss` - 全局样式
**内容**：
- 粉白配色主题
- 通用按钮样式
- 进度条样式

---

#### `project.config.json` - 项目配置
**内容**：
- AppID
- 云环境ID
- 编译设置

---

## 🚀 核心功能实现

### 语音播放（Google TTS）
**位置**：`pages/learn/learn.js`

```javascript
playAudio() {
  var ttsUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q='
    + encodeURIComponent(koreanText);
  this.audioContext.src = ttsUrl;
  this.audioContext.play();
}
```

**优点**：
- 免费无限制
- 无需API Key
- 发音质量好

---

### 智能导入
**位置**：`cloudfunctions/importWords/index.js`

```javascript
// 检查单词是否已存在
const existingWord = await db.collection('words')
  .where({ korean: word.korean })
  .get();

if (existingWord.data.length > 0) {
  skipCount++;  // 跳过重复
  continue;
}
```

---

### 词源显示
**位置**：`pages/learn/learn.wxml`

```xml
<view class="etymology-info" wx:if="{{currentWord.etymology}}">
  <text class="etymology-label">
    {{currentWord.origin === 'hanja' ? '汉字词' : '外来语'}}:
  </text>
  <text class="etymology-text">{{currentWord.etymology}}</text>
</view>
```

---

## 📊 数据流转

```
词汇生成
  ↓
vocab_generator.py
  ↓
korean_vocab_full.json
  ↓
管理页面导入
  ↓
云数据库 words集合
  ↓
学习页面读取
  ↓
用户学习
  ↓
learning_records集合（记录）
```

---

## 🔧 开发命令

### 生成新词汇
```bash
cd scripts
python3 vocab_generator.py
```

### 导入词汇
1. 打开小程序
2. 进入 `pages/import` 管理页面
3. 点击"批量导入词汇"

### 上传云函数
```
右键 cloudfunctions/importWords
→ 上传并部署：云端安装依赖
```

---

## 📈 项目规模

- **总代码行数**: ~2000行
- **页面数量**: 4个
- **云函数**: 2个
- **词汇量**: 151个
- **例句数**: 168个

---

## 🎯 核心优势

1. ✅ **零成本**
   - Google TTS免费
   - Unsplash图片免费
   - 云开发免费额度

2. ✅ **专业级词库**
   - TOPIK分级
   - 词源标注
   - 实用例句

3. ✅ **可扩展**
   - Python生成器
   - 模块化设计
   - 清晰架构

4. ✅ **易维护**
   - 代码注释完整
   - 文档齐全
   - 结构清晰

---

**版本**: v1.0
**最后更新**: 2026-05-06
