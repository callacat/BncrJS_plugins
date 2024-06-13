/**
 * @author Dswang
 * @name 短网址生成
 * @team Dswang & SmartAI
 * @version 1.1.0
 * @description 短网址生成插件，可以自定义短网址类型。去 https://alapi.cn/ 申请token
 * @rule ^(缩|短网址生成) (.+)$
 * @priority 99999
 * @admin false
 * @public true
 * @classification ["工具"]
 * @disable false
 */
const axios = require('axios');

const jsonSchema = BncrCreateSchema.object({
  token: BncrCreateSchema.string()
    .setTitle('设置token')
    .setDescription('配置你的请求token')
    .setDefault(''),
  type: BncrCreateSchema.string()
    .setTitle('设置短网址类型')
    .setDescription('选择短网址类型')
    .setEnum(['dwzmk', 'kfurl', 'u5kcn', 'suoim', 'm6zcn', 'syam', 'dyam', 'u6vcn'])  // 示例类型，实际可以从文档中查询到更多类型
    .setDefault('')
});

const ConfigDB = new BncrPluginConfig(jsonSchema);

module.exports = async s => {
  await sysMethod.testModule(['axios', 'input'], { install: true });
  await ConfigDB.get();

  const userConfig = ConfigDB.userConfig;
  if (!Object.keys(userConfig).length) {
    return s.reply('请先前往前端web界面配置插件。');
  }

  const { token, type } = userConfig;
  const longUrl = s.param(2);

  if (!token) {
    return s.reply('请先配置请求token。');
  }

  try {
    const response = await axios.post('https://v2.alapi.cn/api/url', {
      token,
      url: longUrl,
      type: type || undefined
    });

    if (response.data && response.data.data) {
      return s.reply(`短网址生成成功：${response.data.data.short_url}`);
    } else {
      return s.reply('短网址生成失败，请稍后再试。');
    }
  } catch (error) {
    console.error('发生错误:', error);
    return s.reply('抱歉，发生了错误，请稍后再试。');
  }
};
