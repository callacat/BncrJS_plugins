/**
 * @author Dswang
 * @name 摸鱼
 * @team Dswang & SmartAI
 * @version 1.0.0
 * @description 摸鱼人日历，可以自定义接口
 * @rule ^(摸鱼)$
 * @priority 99999
 * @admin false
 * @public false
 * @classification ["工具"]
 * @disable false
 */

const axios = require('axios');

const jsonSchema = BncrCreateSchema.object({
  apiUrl: BncrCreateSchema.string()
    .setTitle('自定义API接口')
    .setDescription('设置用于生成摸鱼的API接口')
    .setDefault('https://api.vvhan.com/api/moyu')
});

const ConfigDB = new BncrPluginConfig(jsonSchema);

module.exports = async s => {
  await sysMethod.testModule(['axios'], { install: true });
  await ConfigDB.get();

  const userConfig = ConfigDB.userConfig;
  if (!Object.keys(userConfig).length) {
    return s.reply('请先前往前端web界面配置插件。');
  }

  const apiUrl = userConfig.apiUrl || 'https://api.vvhan.com/api/moyu';

  try {
    const response = await axios.get(apiUrl);

    await s.reply({
      type: 'image',
      path: response.request.res.responseUrl // 直接使用响应URL
    });
  } catch (error) {
    if (error.code === 'EAI_AGAIN') {
      await s.reply('无法连接到摸鱼图片生成服务，请检查网络连接或稍后再试。');
    } else {
      console.error('发生错误:', error);
      await s.reply('抱歉，发生了错误，请稍后再试。');
    }
  }
};
