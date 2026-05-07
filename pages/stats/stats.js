// pages/stats/stats.js
Page({
  data: {
    // 基础统计
    learnedWords: 0,
    masteredWords: 0,
    continuousDays: 0,

    // 进度
    masteryPercent: 0,
    bookProgress: 0,

    // 本周统计
    weekNewWords: 0,
    weekReviewCount: 0,
    weekTotalTime: '0分钟',
    weekCompletionRate: 0,

    // 设置
    dailyGoal: 20
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  /**
   * 加载统计数据
   */
  async loadStats() {
    try {
      wx.showLoading({ title: '加载中...' });

      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 1. 获取用户基础统计
      const statsRes = await db.collection('user_stats')
        .where({ _openid: openid })
        .get();

      if (statsRes.data.length > 0) {
        const stats = statsRes.data[0];

        this.setData({
          learnedWords: stats.learnedWords || 0,
          masteredWords: stats.masteredWords || 0,
          continuousDays: stats.continuousDays || 0,
          dailyGoal: stats.dailyGoal || 20
        });

        // 计算掌握度
        const masteryPercent = stats.learnedWords > 0
          ? Math.round((stats.masteredWords / stats.learnedWords) * 100)
          : 0;

        // 计算词书进度（假设总词数500）
        const totalWords = 500;
        const bookProgress = Math.round((stats.learnedWords / totalWords) * 100);

        this.setData({
          masteryPercent,
          bookProgress
        });
      }

      // 2. 获取本周统计
      const weekStart = this.getWeekStart();
      const now = Date.now();

      // 本周新学单词
      const weekNewRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          createTime: _.gte(weekStart).and(_.lte(now))
        })
        .count();

      // 本周复习次数
      const weekReviewRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          lastReview: _.gte(weekStart).and(_.lte(now))
        })
        .field({ reviewCount: true })
        .get();

      const totalReviews = weekReviewRes.data.reduce((sum, r) => sum + (r.reviewCount || 0), 0);

      // 本周完成率（简化计算：假设每天目标20词）
      const daysInWeek = 7;
      const expectedTotal = daysInWeek * this.data.dailyGoal;
      const weekCompletionRate = Math.min(100, Math.round((weekNewRes.total / expectedTotal) * 100));

      // 本周学习时长（简化：每个单词约30秒）
      const totalSeconds = (weekNewRes.total + totalReviews) * 30;
      const weekTotalTime = this.formatTime(totalSeconds);

      this.setData({
        weekNewWords: weekNewRes.total,
        weekReviewCount: totalReviews,
        weekTotalTime,
        weekCompletionRate
      });

      wx.hideLoading();

    } catch (err) {
      console.error('加载统计失败', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 获取本周起始时间戳
   */
  getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
  },

  /**
   * 格式化时间（秒 → 分钟/小时）
   */
  formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}分钟`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}小时${minutes}分钟`;
    }
  },

  /**
   * 设置每日目标
   */
  setDailyGoal() {
    const goals = [10, 20, 30, 50];
    wx.showActionSheet({
      itemList: goals.map(g => `${g} 词/天`),
      success: async (res) => {
        const newGoal = goals[res.tapIndex];

        try {
          const db = wx.cloud.database();
          const openid = getApp().globalData.openid;

          await db.collection('user_stats')
            .where({ _openid: openid })
            .update({
              data: { dailyGoal: newGoal }
            });

          this.setData({ dailyGoal: newGoal });

          wx.showToast({
            title: '设置成功',
            icon: 'success'
          });

        } catch (err) {
          console.error('设置目标失败', err);
          wx.showToast({
            title: '设置失败',
            icon: 'none'
          });
        }
      }
    });
  },

  /**
   * 切换词书
   */
  changeWordBook() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none'
    });
  }
});
