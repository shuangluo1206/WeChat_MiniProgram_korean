// 云函数：批量导入韩语词汇
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data, mode } = event;

  // 批量导入词汇
  if (action === 'batchImport') {
    try {
      let importCount = 0;
      let skipCount = 0;

      // 模式1: 先清空再导入（完全替换）
      if (mode === 'replace') {
        console.log('模式：先清空再导入');

        // 清空原有数据
        const _ = db.command;
        await db.collection('words')
          .where({ _id: _.exists(true) })
          .remove();

        console.log('已清空原有数据');
      }

      // 模式2: 智能去重导入（默认）
      const shouldCheckDuplicate = mode !== 'replace';

      // 批量导入
      const batchSize = 100;

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);

        for (const word of batch) {
          // 检查是否已存在（根据韩语单词判断）
          if (shouldCheckDuplicate) {
            const existingWord = await db.collection('words')
              .where({ korean: word.korean })
              .get();

            if (existingWord.data.length > 0) {
              console.log(`跳过重复单词: ${word.korean}`);
              skipCount++;
              continue;
            }
          }

          // 添加单词
          await db.collection('words').add({ data: word });
          importCount++;
        }

        console.log(`已处理第 ${i + 1} - ${Math.min(i + batchSize, data.length)} 条`);
      }

      return {
        success: true,
        imported: importCount,
        skipped: skipCount,
        total: data.length,
        message: mode === 'replace'
          ? `已替换：成功导入 ${importCount} 个单词`
          : `成功导入 ${importCount} 个单词，跳过 ${skipCount} 个重复单词`
      };

    } catch (err) {
      console.error('导入失败:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  // 清空words集合（谨慎使用）
  if (action === 'clearAll') {
    try {
      const _ = db.command;
      const result = await db.collection('words')
        .where({
          _id: _.exists(true)
        })
        .remove();

      return {
        success: true,
        removed: result.stats.removed,
        message: `已删除 ${result.stats.removed} 条数据`
      };

    } catch (err) {
      console.error('清空失败:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  // 查询统计
  if (action === 'getStats') {
    try {
      const total = await db.collection('words').count();

      // 按难度分组统计
      const beginnerCount = await db.collection('words')
        .where({ level: 'beginner' })
        .count();

      const intermediateCount = await db.collection('words')
        .where({ level: 'intermediate' })
        .count();

      const advancedCount = await db.collection('words')
        .where({ level: 'advanced' })
        .count();

      // 按词源分组
      const hanjaCount = await db.collection('words')
        .where({ origin: 'hanja' })
        .count();

      const loanwordCount = await db.collection('words')
        .where({ origin: 'loanword' })
        .count();

      const nativeCount = await db.collection('words')
        .where({ origin: 'native' })
        .count();

      return {
        success: true,
        stats: {
          total: total.total,
          byLevel: {
            beginner: beginnerCount.total,
            intermediate: intermediateCount.total,
            advanced: advancedCount.total
          },
          byOrigin: {
            hanja: hanjaCount.total,
            loanword: loanwordCount.total,
            native: nativeCount.total
          }
        }
      };

    } catch (err) {
      console.error('统计失败:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }

  return {
    success: false,
    message: '未知操作'
  };
};
