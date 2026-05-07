// pages/learn/learn.js
const { calculateNextReview } = require('../../utils/memory.js');

Page({
  data: {
    currentWord: null,        // 当前单词
    currentIndex: 0,          // 当前索引
    totalCount: 0,            // 总数量
    wordsList: [],            // 单词列表
    isLoading: true,          // 加载状态
    isCompleted: false,       // 是否完成

    // 统计数据
    newWordsCount: 0,         // 新学单词数
    reviewWordsCount: 0,      // 复习单词数
    correctCount: 0,          // 答对数量
    wrongCount: 0,            // 答错数量

    // 音频
    audioContext: null
  },

  onLoad() {
    this.audioContext = wx.createInnerAudioContext();
    this.loadTodayTasks();
  },

  /**
   * 加载今日学习任务
   */
  async loadTodayTasks() {
    try {
      wx.showLoading({ title: '加载中...' });

      const db = wx.cloud.database();

      // 简化版：直接读取所有单词（测试用）
      const res = await db.collection('words').get();

      console.log('读取到的单词数据：', res.data);

      if (res.data.length === 0) {
        wx.showToast({
          title: '单词库是空的',
          icon: 'none'
        });
        this.setData({ isLoading: false, isCompleted: true });
        wx.hideLoading();
        return;
      }

      this.setData({
        wordsList: res.data,
        totalCount: res.data.length,
        currentWord: res.data[0],
        newWordsCount: res.data.length,
        reviewWordsCount: 0,
        isLoading: false
      });

      console.log('=== 调试：第一个单词的完整数据 ===');
      console.log('currentWord:', this.data.currentWord);
      console.log('字段名列表:', Object.keys(res.data[0]));

      wx.hideLoading();

    } catch (err) {
      console.error('加载单词失败：', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败：' + err.errMsg,
        icon: 'none',
        duration: 3000
      });

      this.setData({ isLoading: false });
    }
  },

  /**
   * 加载今日学习任务（原版，暂时注释）
   */
  async loadTodayTasks_OLD() {
    try {
      wx.showLoading({ title: '加载中...' });

      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 1. 获取用户每日目标
      const userRes = await db.collection('user_stats')
        .where({ _openid: openid })
        .get();

      const dailyGoal = userRes.data[0]?.dailyGoal || 20;

      // 2. 获取今日已学的新词数量
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const learnedRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          createTime: _.gte(todayStart)
        })
        .count();

      const learnedToday = learnedRes.total;
      const newWordsNeeded = Math.max(0, dailyGoal - learnedToday);

      // 3. 获取需要复习的单词
      const now = Date.now();
      const reviewRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          status: 'learning',
          nextReview: _.lte(now)
        })
        .get();

      const reviewWords = reviewRes.data;

      // 4. 如果需要新词，获取未学单词
      let newWords = [];
      if (newWordsNeeded > 0) {
        const learnedIdsRes = await db.collection('learning_records')
          .where({ _openid: openid })
          .field({ wordId: true })
          .get();

        const learnedWordIds = learnedIdsRes.data.map(r => r.wordId);

        const newWordsRes = await db.collection('words')
          .where({
            _id: _.nin(learnedWordIds)
          })
          .limit(newWordsNeeded)
          .get();

        newWords = newWordsRes.data;
      }

      // 5. 合并任务列表
      const wordsList = [...newWords, ...reviewWords];

      if (wordsList.length === 0) {
        wx.showToast({
          title: '今日任务已完成',
          icon: 'success'
        });
        this.setData({ isCompleted: true, isLoading: false });
        return;
      }

      this.setData({
        wordsList,
        totalCount: wordsList.length,
        currentWord: wordsList[0],
        newWordsCount: newWords.length,
        reviewWordsCount: reviewWords.length,
        isLoading: false
      });

      wx.hideLoading();

    } catch (err) {
      console.error('加载任务失败', err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 播放发音
   */
  playAudio() {
    var currentWord = this.data.currentWord;

    if (!currentWord || !currentWord.korean) {
      wx.showToast({
        title: '无法播放',
        icon: 'none'
      });
      return;
    }

    // 如果有预存的音频URL，使用预存的
    if (currentWord.audioUrl) {
      this.audioContext.src = currentWord.audioUrl;
      this.audioContext.play();
      return;
    }

    // 否则使用在线TTS（Google翻译TTS - 免费且无需API Key）
    try {
      var koreanText = currentWord.korean;
      var ttsUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=' + encodeURIComponent(koreanText);

      this.audioContext.src = ttsUrl;
      this.audioContext.play();

      console.log('播放TTS:', koreanText);
    } catch (err) {
      console.error('TTS播放失败:', err);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
    }
  },

  /**
   * 用户答题
   */
  async onAnswer(e) {
    var isCorrect = e.currentTarget.dataset.answer === 'true';
    var currentWord = this.data.currentWord;
    var currentIndex = this.data.currentIndex;

    console.log('onAnswer触发，答案:', isCorrect, '当前索引:', currentIndex);

    // 更新统计
    if (isCorrect) {
      this.setData({
        correctCount: this.data.correctCount + 1
      });
    } else {
      this.setData({
        wrongCount: this.data.wrongCount + 1
      });
    }

    // 暂时跳过数据库写入，先让导航功能正常
    // await this.submitAnswer(currentWord._id, isCorrect);

    // 下一个单词
    this.nextWord();
  },

  /**
   * 提交答案到数据库
   */
  async submitAnswer(wordId, isCorrect) {
    try {
      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 查询学习记录
      const recordRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          wordId: wordId
        })
        .get();

      if (recordRes.data.length === 0) {
        // 新单词，创建记录
        const nextReview = calculateNextReview(0, isCorrect);

        await db.collection('learning_records').add({
          data: {
            _openid: openid,
            wordId: wordId,
            status: nextReview.status,
            level: nextReview.nextLevel,
            nextReview: nextReview.nextReviewTime,
            correctCount: isCorrect ? 1 : 0,
            wrongCount: isCorrect ? 0 : 1,
            reviewCount: 1,
            createTime: Date.now()
          }
        });

      } else {
        // 已有记录，更新
        const record = recordRes.data[0];
        const nextReview = calculateNextReview(record.level, isCorrect);

        await db.collection('learning_records').doc(record._id).update({
          data: {
            level: nextReview.nextLevel,
            nextReview: nextReview.nextReviewTime,
            status: nextReview.status,
            correctCount: isCorrect ? _.inc(1) : record.correctCount,
            wrongCount: isCorrect ? record.wrongCount : _.inc(1),
            reviewCount: _.inc(1),
            lastReview: Date.now()
          }
        });
      }

      // 更新用户统计
      await this.updateUserStats();

    } catch (err) {
      console.error('提交答案失败', err);
    }
  },

  /**
   * 更新用户统计
   */
  async updateUserStats() {
    try {
      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 获取最新统计
      const learnedRes = await db.collection('learning_records')
        .where({ _openid: openid })
        .count();

      const masteredRes = await db.collection('learning_records')
        .where({
          _openid: openid,
          status: 'mastered'
        })
        .count();

      // 更新或创建用户统计
      const statsRes = await db.collection('user_stats')
        .where({ _openid: openid })
        .get();

      if (statsRes.data.length === 0) {
        await db.collection('user_stats').add({
          data: {
            _openid: openid,
            learnedWords: learnedRes.total,
            masteredWords: masteredRes.total,
            continuousDays: 1,
            dailyGoal: 20,
            createTime: Date.now()
          }
        });
      } else {
        await db.collection('user_stats').doc(statsRes.data[0]._id).update({
          data: {
            learnedWords: learnedRes.total,
            masteredWords: masteredRes.total
          }
        });
      }

    } catch (err) {
      console.error('更新统计失败', err);
    }
  },

  /**
   * 下一个单词
   */
  nextWord() {
    var currentIndex = this.data.currentIndex;
    var wordsList = this.data.wordsList;
    var totalCount = this.data.totalCount;

    console.log('nextWord触发');
    console.log('当前索引:', currentIndex);
    console.log('总数量:', totalCount);
    console.log('wordsList长度:', wordsList.length);
    console.log('下一个单词索引:', currentIndex + 1);
    console.log('下一个单词数据:', wordsList[currentIndex + 1]);

    if (currentIndex + 1 >= totalCount) {
      // 完成所有任务
      console.log('所有单词已完成');
      this.setData({ isCompleted: true });
      this.updateContinuousDays();
      return;
    }

    // 显示下一个单词
    var nextWordData = wordsList[currentIndex + 1];
    console.log('即将设置的单词:', nextWordData);

    this.setData({
      currentIndex: currentIndex + 1,
      currentWord: nextWordData
    });

    console.log('setData完成后的currentWord:', this.data.currentWord);
    console.log('setData完成后的currentIndex:', this.data.currentIndex);
  },

  /**
   * 更新连续打卡天数
   */
  async updateContinuousDays() {
    try {
      const db = wx.cloud.database();
      const _ = db.command;
      const openid = getApp().globalData.openid;

      // 这里简化处理，实际需要判断昨天是否打卡
      await db.collection('user_stats')
        .where({ _openid: openid })
        .update({
          data: {
            continuousDays: _.inc(1),
            lastCheckInDate: Date.now()
          }
        });

    } catch (err) {
      console.error('更新打卡天数失败', err);
    }
  },

  /**
   * 暂停学习
   */
  onPause() {
    wx.showModal({
      title: '暂停学习',
      content: '确定要暂停吗？进度会保存',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  },

  /**
   * 继续学习
   */
  onContinue() {
    // 重新加载任务
    this.setData({
      isCompleted: false,
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0
    });
    this.loadTodayTasks();
  },

  /**
   * 分享成绩
   */
  onShare() {
    const { newWordsCount, reviewWordsCount, correctCount } = this.data;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onUnload() {
    this.audioContext.destroy();
  }
});
