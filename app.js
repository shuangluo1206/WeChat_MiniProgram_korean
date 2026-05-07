// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-d1g7vzv6g4cf5a6f0',  // 你的云环境ID
        traceUser: true,
      });
    }

    // 获取用户信息
    this.globalData.openid = null;
    this.getOpenId();

    // 自动初始化词汇库（仅首次运行）
    this.initVocabIfNeeded();
  },

  // 获取用户openid
  async getOpenId() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login'
      });
      this.globalData.openid = res.result.openid;
    } catch (err) {
      console.error('获取openid失败', err);
    }
  },

  // 自动初始化词汇库
  async initVocabIfNeeded() {
    try {
      console.log('检查词汇库是否需要初始化...');

      const res = await wx.cloud.callFunction({
        name: 'initVocab'
      });

      if (res.result.success) {
        console.log(res.result.message);

        // 如果刚刚完成初始化，提示用户
        if (res.result.needInit === false && res.result.count > 0) {
          wx.showToast({
            title: `已加载 ${res.result.count} 个单词`,
            icon: 'success',
            duration: 2000
          });
        }
      }
    } catch (err) {
      console.error('初始化词汇库失败:', err);
    }
  },

  globalData: {
    openid: null,
    // 配色方案（粉白配色）
    colors: {
      primary: '#F5A3B5',        // 主粉色
      lightPink: '#FFF0F3',       // 浅粉背景
      darkPink: '#D67889',        // 深粉文字
      white: '#FFFFFF',           // 纯白
      bgGray: '#FFF9FA',          // 浅灰背景
      textGray: '#6B7280',        // 灰色文字
      success: '#10B981',         // 绿色（答对）
      error: '#EF4444'            // 红色（答错）
    }
  }
});
