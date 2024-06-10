/**
 * @author Dswang
 * @name 翻译
 * @team Dswang & SmartAI
 * @version 1.4.1
 * @description 使用不同翻译API进行翻译，并支持代理配置
 * @rule ^翻译 (.+)$
 * @admin false
 * @public false
 * @priority 199
 * @classification ["工具"]
 */
const bingTranslate = require('bing-translate-api');
const { HttpsProxyAgent } = require('https-proxy-agent');

const jsonSchema = BncrCreateSchema.object({
  apiProvider: BncrCreateSchema.string()
    .setTitle('选择翻译API')
    .setDescription('选择用于翻译的API')
    .setEnum(['bing-translate'])
    .setEnumNames(['Bing Translate'])
    .setDefault('bing-translate'),
  proxy: BncrCreateSchema.object({
    host: BncrCreateSchema.string().setTitle('代理主机').setDefault(''),
    port: BncrCreateSchema.number().setTitle('代理端口').setDefault(0),
    protocol: BncrCreateSchema.string().setTitle('代理协议').setEnum(['http', 'https', 'socks5']).setDefault('http')
  }).setTitle('代理配置')
});

const ConfigDB = new BncrPluginConfig(jsonSchema);

module.exports = async s => {
  await sysMethod.testModule(['bing-translate-api', 'input'], { install: true });
  await sysMethod.testModule(['https-proxy-agent', 'input'], { install: true });
  await ConfigDB.get();

  const userConfig = ConfigDB.userConfig;
  if (!Object.keys(userConfig).length) {
    return s.reply('请先前往前端web界面配置插件。');
  }

  const apiProvider = userConfig.apiProvider || 'bing-translate';
  const proxyConfig = userConfig.proxy;
  const text = s.param(1);

  let axiosConfig = {};
  if (proxyConfig && proxyConfig.host && proxyConfig.port) {
    axiosConfig = {
      agent: new HttpsProxyAgent(`${proxyConfig.protocol}://${proxyConfig.host}:${proxyConfig.port}`)
    };
  }

  try {
    let translatedText;

    switch (apiProvider) {
      case 'bing-translate':
        const fromLangBing = text.match(/[\u4e00-\u9fa5]/) ? 'zh-Hans' : 'en';
        const toLangBing = fromLangBing === 'zh-Hans' ? 'en' : 'zh-Hans';
        const bingResult = await bingTranslate.translate(text, fromLangBing, toLangBing, true, axiosConfig);
        translatedText = bingResult.translation;
        break;
      default:
        throw new Error('Unsupported API provider');
    }

    await s.reply('原文：' + text + '\n翻译：' + translatedText);
  } catch (error) {
    console.error('翻译插件出错:', error);
    await s.reply('抱歉，翻译过程中出现了错误。');
  }
};
