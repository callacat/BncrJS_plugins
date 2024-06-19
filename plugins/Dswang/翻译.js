/**
 * @author Dswang
 * @name 翻译
 * @team Dswang & SmartAI
 * @version 1.7.0
 * @description 使用不同翻译API进行翻译，并支持代理配置
 * @rule ^翻译 (.+)$
 * @admin false
 * @public true
 * @priority 199
 * @classification ["工具"]
 */
const bingTranslate = require('bing-translate-api');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const jsonSchema = BncrCreateSchema.object({
  apiProvider: BncrCreateSchema.string()
    .setTitle('选择翻译API')
    .setDescription('选择用于翻译的API')
    .setEnum(['bing-translate', 'deeplx-translate'])
    .setEnumNames(['Bing', 'DeepLx'])
    .setDefault('deeplx-translate'),
  deeplApiUrl: BncrCreateSchema.string().setTitle('DeepLx API URL').setDescription('自定义 DeepLx API 地址').setDefault('https://api.deeplx.org'),
  deeplApiKey: BncrCreateSchema.string().setTitle('DeepLx API Key').setDescription('DeepLx API Key'),
  proxy: BncrCreateSchema.object({
    host: BncrCreateSchema.string().setTitle('代理主机').setDefault(''),
    port: BncrCreateSchema.number().setTitle('代理端口').setDefault(0),
    protocol: BncrCreateSchema.string().setTitle('代理协议').setEnum(['http', 'https', 'socks5']).setDefault('http')
  }).setTitle('代理配置').setDescription('可选')
});

const ConfigDB = new BncrPluginConfig(jsonSchema);

module.exports = async s => {
  await sysMethod.testModule(['bing-translate-api', 'axios', 'https-proxy-agent'], { install: true });
  await ConfigDB.get();

  const userConfig = ConfigDB.userConfig;
  if (!Object.keys(userConfig).length) {
    return s.reply('请先前往前端web界面配置插件。');
  }

  const apiProvider = userConfig.apiProvider || 'bing-translate';
  const proxyConfig = userConfig.proxy;
  let deeplxApiUrl = userConfig.deeplApiUrl || 'https://api.deeplx.org';
  const deeplxApiKey = userConfig.deeplApiKey;
  const text = s.param(1);

  // 确保 deeplxApiUrl 不以 / 结尾
  if (deeplxApiUrl.endsWith('/')) {
    deeplxApiUrl = deeplxApiUrl.slice(0, -1);
  }

  // 确保 deeplxApiUrl 不包含 /translate 路径
  if (deeplxApiUrl.endsWith('/translate')) {
    deeplxApiUrl = deeplxApiUrl.slice(0, -10);
  }

  let axiosConfig = {};
  if (proxyConfig && proxyConfig.host && proxyConfig.port) {
    axiosConfig = {
      httpsAgent: new HttpsProxyAgent(`${proxyConfig.protocol}://${proxyConfig.host}:${proxyConfig.port}`)
    };
  }

  try {
    let translatedText;
    const isChinese = /[\u4e00-\u9fa5]/.test(text);

    switch (apiProvider) {
      case 'bing-translate':
        const fromLangBing = isChinese ? 'zh-Hans' : 'en';
        const toLangBing = isChinese ? 'en' : 'zh-Hans';
        const bingResult = await bingTranslate.translate(text, fromLangBing, toLangBing, true, axiosConfig);
        translatedText = bingResult.translation;
        break;

      case 'deeplx-translate':
        const fromLangDeeplx = 'auto';
        const toLangDeeplx = isChinese ? 'EN' : 'ZH';
        let deeplxApiEndpoint = deeplxApiUrl;
        if (deeplxApiKey) {
          deeplxApiEndpoint = `${deeplxApiUrl}/${deeplxApiKey}`;
        }
        deeplxApiEndpoint += '/translate';
        const deeplxResponse = await axios.post(
          deeplxApiEndpoint,
          {
            text: text,
            source_lang: fromLangDeeplx,
            target_lang: toLangDeeplx
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            ...axiosConfig
          }
        );

        console.log('DeepLx API 响应:', deeplxResponse.data);

        if (deeplxResponse.data && deeplxResponse.data.data) {
          translatedText = deeplxResponse.data.data;
        } else {
          throw new Error('DeepLx API 返回了意外的响应格式: ' + JSON.stringify(deeplxResponse.data));
        }
        break;

      default:
        throw new Error('Unsupported API provider');
    }

    await s.reply('原文：' + text + '\n翻译：' + translatedText);
  } catch (error) {
    console.error('翻译插件出错:', error);
    await s.reply('抱歉，翻译过程中出现了错误。错误详情: ' + error.message);
  }
};
