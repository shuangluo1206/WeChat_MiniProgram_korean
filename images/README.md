# TabBar图标说明

## 缺少的图标文件

微信小程序的TabBar需要6个图标（每个标签2个状态）：

### 图标规格要求
```
尺寸：81px × 81px（推荐）或 64px × 64px
格式：PNG
大小：< 40KB
```

### 需要的6个图标

1. **tab_learn.png** - 学习图标（未选中，灰色）
2. **tab_learn_active.png** - 学习图标（选中，粉色）
3. **tab_calendar.png** - 日历图标（未选中，灰色）
4. **tab_calendar_active.png** - 日历图标（选中，粉色）
5. **tab_stats.png** - 统计图标（未选中，灰色）
6. **tab_stats_active.png** - 统计图标（选中，粉色）

---

## 方案1: 使用emoji生成简易图标（5分钟）⭐

最简单的方式是用emoji转图标：

1. 访问：https://emoji-to-png.com
2. 生成3个emoji对应的PNG：
   - 📚 (学习)
   - 📅 (日历)
   - 📊 (统计)
3. 下载后放入 `images/` 文件夹
4. 复制一份，用图片编辑器改颜色（粉色版本）

---

## 方案2: 从免费图标网站下载（10分钟）

**推荐网站**：
- https://www.flaticon.com
- https://www.iconfinder.com

**搜索关键词**：
- learn / study / book
- calendar / date
- chart / statistics / analytics

**筛选条件**：
- 格式：PNG
- 风格：Line / Outline（线条风格）
- 尺寸：选择81px或更大

**下载后**：
1. 重命名为对应的文件名
2. 放入 `images/` 文件夹

---

## 方案3: 我生成一个临时的纯文字TabBar（1分钟）

如果你暂时不想找图标，我可以改成纯文字的TabBar（无图标）。

要这样做吗？回复"用文字TabBar"，我立刻改。

---

## 当前状态

✅ TabBar已临时禁用，项目可以运行
📂 images/ 文件夹已创建
⏳ 等待你添加图标文件

**添加完图标后，告诉我，我帮你恢复TabBar配置！**
