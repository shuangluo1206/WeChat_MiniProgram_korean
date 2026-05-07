// pages/calendar/calendar.js
Page({
  data: {
    // 日历数据
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    calendarDays: [],

    // 统计数据
    continuousDays: 0,
    todayProgress: 0,
    monthCheckInDays: 0,
    monthNewWords: 0,
    monthReviewCount: 0,

    // 打卡记录
    checkInDates: []
  },

  onLoad() {
    this.loadCalendarData();
  },

  onShow() {
    this.loadCalendarData();
  },

  /**
   * 加载日历数据
   */
  async loadCalendarData() {
    try {
      wx.showLoading({ title: '加载中...' });

      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 1. 获取用户统计
      const statsRes = await db.collection('user_stats')
        .where({ _openid: openid })
        .get();

      if (statsRes.data.length > 0) {
        const stats = statsRes.data[0];
        this.setData({
          continuousDays: stats.continuousDays || 0
        });

        // 计算今日完成度
        const dailyGoal = stats.dailyGoal || 20;
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayLearned = await db.collection('learning_records')
          .where({
            _openid: openid,
            createTime: _.gte(todayStart)
          })
          .count();

        const progress = Math.min(100, Math.round((todayLearned.total / dailyGoal) * 100));
        this.setData({ todayProgress: progress });
      }

      // 2. 获取本月打卡记录
      const monthStart = new Date(this.data.currentYear, this.data.currentMonth - 1, 1).getTime();
      const monthEnd = new Date(this.data.currentYear, this.data.currentMonth, 0, 23, 59, 59).getTime();

      const checkInRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          createTime: _.gte(monthStart).and(_.lte(monthEnd))
        })
        .field({ createTime: true })
        .get();

      // 提取打卡日期（去重）
      const checkInDates = [...new Set(
        checkInRes.data.map(record => {
          const date = new Date(record.createTime);
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        })
      )];

      this.setData({
        checkInDates,
        monthCheckInDays: checkInDates.length
      });

      // 3. 获取本月新学单词数
      const newWordsRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          createTime: _.gte(monthStart).and(_.lte(monthEnd))
        })
        .count();

      // 4. 获取本月复习次数
      const reviewRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          lastReview: _.gte(monthStart).and(_.lte(monthEnd))
        })
        .field({ reviewCount: true })
        .get();

      const totalReviews = reviewRes.data.reduce((sum, record) => sum + (record.reviewCount || 0), 0);

      this.setData({
        monthNewWords: newWordsRes.total,
        monthReviewCount: totalReviews
      });

      // 5. 生成日历
      this.generateCalendar();

      wx.hideLoading();

    } catch (err) {
      console.error('加载日历失败', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 生成日历
   */
  generateCalendar() {
    const { currentYear, currentMonth, checkInDates } = this.data;

    // 当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);

    // 当月天数
    const daysInMonth = lastDay.getDate();

    // 第一天是星期几（0=周日）
    const firstDayWeek = firstDay.getDay();

    // 生成日历数组
    const calendarDays = [];

    // 填充前面的空白
    for (let i = 0; i < firstDayWeek; i++) {
      calendarDays.push({
        day: '',
        date: '',
        isChecked: false,
        isToday: false
      });
    }

    // 填充日期
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth}-${day}`;
      const isToday = dateStr === todayStr;
      const isChecked = checkInDates.includes(dateStr);

      calendarDays.push({
        day,
        date: dateStr,
        isChecked,
        isToday
      });
    }

    this.setData({ calendarDays });
  },

  /**
   * 上一月
   */
  prevMonth() {
    let { currentYear, currentMonth } = this.data;

    if (currentMonth === 1) {
      currentYear -= 1;
      currentMonth = 12;
    } else {
      currentMonth -= 1;
    }

    this.setData({ currentYear, currentMonth });
    this.loadCalendarData();
  },

  /**
   * 下一月
   */
  nextMonth() {
    let { currentYear, currentMonth } = this.data;

    if (currentMonth === 12) {
      currentYear += 1;
      currentMonth = 1;
    } else {
      currentMonth += 1;
    }

    this.setData({ currentYear, currentMonth });
    this.loadCalendarData();
  }
});
