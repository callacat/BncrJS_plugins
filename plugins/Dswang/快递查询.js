/**
 * @author Dswang
 * @name 快递查询
 * @team Dswang & SmartAI
 * @version 1.0.0
 * @description 快递查询插件。去 https://alapi.cn/ 申请token
 * @rule ^快递查询\s+(\S+)(?:\s+(\S+))?$
 * @admin fasle
 * @public true
 * @priority 9999
 * @disable false
 * @classification ["工具"]
 */

const axios = require('axios');

const jsonSchema = BncrCreateSchema.object({
  token: BncrCreateSchema.string()
    .setTitle('设置token')
    .setDescription('配置你的请求token')
    .setDefault('')
});

const ConfigDB = new BncrPluginConfig(jsonSchema);
module.exports = async s => {
  await ConfigDB.get();

  const userConfig = ConfigDB.userConfig;
  if (!Object.keys(userConfig).length) {
    return s.reply('请先前往前端web界面配置插件。');
  }

  const { token } = userConfig;
  const number = s.param(1);
  const com = s.param(2) || ''; // 快递公司编号，默认为空

  if (!token) {
    return s.reply('请先配置请求token。');
  }

  if (!number) {
    return s.reply('请提供快递单号。');
  }

  try {
    const response = await axios.post('https://v2.alapi.cn/api/kd', {
      token,
      number,
      com
    });

    if (response.data && response.data.data && response.data.data.info) {
      const info = response.data.data.info.slice(0, 3); // 取最新三条信息
      let replyMessage = '最新快递信息:\n';
      info.forEach(item => {
        replyMessage += `时间: ${item.time}\n状态: ${item.status_desc}\n内容: ${item.content}\n\n`;
      });
      return s.reply(replyMessage);
    } else {
      return s.reply('未能获取到快递信息，请稍后再试。');
    }
  } catch (error) {
    console.error('发生错误:', error);
    return s.reply('抱歉，发生了错误，请稍后再试。');
  }
};
