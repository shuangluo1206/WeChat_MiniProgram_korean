# 获取云环境ID的方法

## 在微信开发者工具中查看

1. **打开云开发控制台**
   ```
   点击顶部"云开发"按钮
   ```

2. **查看环境列表**
   - 左上角会显示环境名称
   - 鼠标悬停或点击，能看到完整的环境ID

   ```
   格式：cloud-xxx-xxxxxxx
   或：cloud1-xxxxx
   ```

3. **复制环境ID**
   - 例如：`cloud1-2g4dwa`

---

## 然后在 project.config.json 中添加

找到 `"cloudfunctionRoot": "cloudfunctions/"` 这一行，在下面添加：

```json
{
  "cloudfunctionRoot": "cloudfunctions/",
  "cloudfunctionList": [
    {
      "name": "login",
      "envId": "你的环境ID"  ← 替换成你刚复制的ID
    }
  ],
  "setting": {
    ...
  }
}
```

---

## 或者更简单：设置默认环境

在 project.config.json 最后面添加：

```json
{
  ...其他配置,
  "cloudbaseRoot": "./cloudbase",
  "cloudfunctionList": [],
  "cloudEnv": "你的环境ID"  ← 替换成你的环境ID
}
```

保存后，重新上传云函数。
