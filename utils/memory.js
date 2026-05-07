// utils/memory.js - 艾宾浩斯记忆算法

/**
 * 复习时间间隔（毫秒）
 * 基于艾宾浩斯遗忘曲线设计
 */
const REVIEW_INTERVALS = [
  5 * 60 * 1000,              // 5分钟
  30 * 60 * 1000,             // 30分钟
  12 * 60 * 60 * 1000,        // 12小时
  1 * 24 * 60 * 60 * 1000,    // 1天
  2 * 24 * 60 * 60 * 1000,    // 2天
  4 * 24 * 60 * 60 * 1000,    // 4天
  7 * 24 * 60 * 60 * 1000,    // 7天
  15 * 24 * 60 * 60 * 1000,   // 15天
];

/**
 * 计算下次复习时间
 * @param {number} currentLevel - 当前记忆等级（0-7）
 * @param {boolean} isCorrect - 本次是否答对
 * @returns {object} { nextLevel, nextReviewTime, status }
 */
function calculateNextReview(currentLevel, isCorrect) {
  if (!isCorrect) {
    // 答错了，重置到第一级
    return {
      nextLevel: 0,
      nextReviewTime: Date.now() + REVIEW_INTERVALS[0],
      status: 'learning'
    };
  }

  // 答对了，升级
  const nextLevel = Math.min(currentLevel + 1, REVIEW_INTERVALS.length - 1);

  // 如果达到最高级（连续答对8次），标记为已掌握
  if (nextLevel >= REVIEW_INTERVALS.length - 1) {
    return {
      nextLevel: nextLevel,
      nextReviewTime: Date.now() + REVIEW_INTERVALS[nextLevel],
      status: 'mastered'
    };
  }

  return {
    nextLevel: nextLevel,
    nextReviewTime: Date.now() + REVIEW_INTERVALS[nextLevel],
    status: 'learning'
  };
}

/**
 * 判断单词是否需要复习
 * @param {number} nextReviewTime - 下次复习时间戳
 * @returns {boolean}
 */
function needsReview(nextReviewTime) {
  return Date.now() >= nextReviewTime;
}

/**
 * 获取记忆等级描述
 * @param {number} level - 记忆等级
 * @returns {string}
 */
function getLevelDescription(level) {
  const descriptions = [
    '初识',      // 0
    '有点印象',  // 1
    '基本记住',  // 2
    '比较熟悉',  // 3
    '很熟悉',    // 4
    '熟练',      // 5
    '非常熟练',  // 6
    '完全掌握'   // 7
  ];
  return descriptions[level] || '未知';
}

/**
 * 获取熟练度星级（1-5星）
 * @param {number} level - 记忆等级
 * @returns {number}
 */
function getProficiencyStars(level) {
  if (level >= 7) return 5;
  if (level >= 5) return 4;
  if (level >= 3) return 3;
  if (level >= 1) return 2;
  return 1;
}

module.exports = {
  REVIEW_INTERVALS,
  calculateNextReview,
  needsReview,
  getLevelDescription,
  getProficiencyStars
};
