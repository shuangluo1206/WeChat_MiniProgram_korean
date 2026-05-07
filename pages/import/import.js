// 词汇导入测试页面
Page({
  data: {
    importing: false,
    stats: null
  },

  onLoad() {
    this.getStats();
  },

  // 获取统计信息
  async getStats() {
    wx.showLoading({ title: '加载中...' });

    try {
      const res = await wx.cloud.callFunction({
        name: 'importWords',
        data: { action: 'getStats' }
      });

      if (res.result.success) {
        this.setData({ stats: res.result.stats });
      }

      wx.hideLoading();
    } catch (err) {
      console.error('获取统计失败:', err);
      wx.hideLoading();
    }
  },

  // 批量导入
  async onImport() {
    // 读取词汇数据（使用完整词库：初中高级151个）
    const vocabData = require('../../scripts/korean_vocab_full.json');

    // 询问导入模式
    wx.showActionSheet({
      itemList: [
        '智能导入（跳过重复）',
        '完全替换（先清空再导入）'
      ],
      success: (res) => {
        const mode = res.tapIndex === 1 ? 'replace' : 'smart';

        const confirmMsg = mode === 'replace'
          ? `⚠️ 将清空所有现有数据，然后导入 ${vocabData.length} 个单词`
          : `将导入 ${vocabData.length} 个单词，已存在的会跳过`;

        wx.showModal({
          title: '确认导入',
          content: confirmMsg,
          success: async (modalRes) => {
            if (modalRes.confirm) {
              await this.doImport(vocabData, mode);
            }
          }
        });
      }
    });
  },

  // 执行导入
  async doImport(vocabData, mode) {
    this.setData({ importing: true });
    wx.showLoading({ title: '导入中...', mask: true });

    try {
      const result = await wx.cloud.callFunction({
        name: 'importWords',
        data: {
          action: 'batchImport',
          data: vocabData,
          mode: mode
        }
      });

      wx.hideLoading();
      this.setData({ importing: false });

      if (result.result.success) {
        const msg = mode === 'replace'
          ? `✅ 成功导入 ${result.result.imported} 个单词`
          : `✅ 导入 ${result.result.imported} 个，跳过 ${result.result.skipped} 个重复`;

        wx.showModal({
          title: '导入完成',
          content: msg,
          showCancel: false,
          success: () => {
            // 刷新统计
            this.getStats();
          }
        });
      } else {
        wx.showToast({
          title: '导入失败',
          icon: 'none'
        });
      }

    } catch (err) {
      console.error('导入失败:', err);
      wx.hideLoading();
      this.setData({ importing: false });
      wx.showToast({
        title: '导入失败: ' + err.message,
        icon: 'none',
        duration: 3000
      });
    }
  },

  // 清空数据（谨慎）
  async onClear() {
    wx.showModal({
      title: '危险操作',
      content: '确定要清空所有单词数据吗？此操作不可恢复！',
      confirmText: '确定清空',
      confirmColor: '#EF4444',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清空中...' });

          try {
            const result = await wx.cloud.callFunction({
              name: 'importWords',
              data: { action: 'clearAll' }
            });

            wx.hideLoading();

            if (result.result.success) {
              wx.showToast({
                title: result.result.message,
                icon: 'success'
              });

              // 刷新统计
              setTimeout(() => this.getStats(), 1000);
            }

          } catch (err) {
            console.error('清空失败:', err);
            wx.hideLoading();
          }
        }
      }
    });
  }
});
