/** 
 * @author Dswang
 * @origin Dswang
 * @name 短网址还原
 * @version 1.0.0
 * @description 获取短网址缩短之前的网址。基本支持所有短网址（不支持国内打不开的网址）
 * @rule ^网址还原 (.+)$
 * @priority 99999
 * @admin false
 */

/*
请先访问https://admin.alapi.cn/dashboard/ 获取token，然后通过 set ALAPI Token ? 设置
*/

const axios = require('axios');

module.exports = (s) => {
    
  s.middleware(async (meta, next) => {
    
    const message = meta.message.trim();
    const command = message.split(' ')[0];

    if (command === '还原短网址') {
      const shortUrl = message.split(' ')[1];
      if (!shortUrl) {
        await s.reply('请提供一个短网址！');
        return;
      }

      try {
        const response = await axios.get('https://v2.alapi.cn/api/url/query', {
          params: {
            token: {ALAPIToken},
            url: shortUrl,
          },
        });

        if (response.data.code === 200) {
          await s.reply(`还原后的网址：${response.data.data.long_url}`);
        } else {
          await s.reply('短网址还原失败，请稍后重试。');
        }
      } catch (error) {
        await s.reply('短网址还原失败，请稍后重试。');
      }
    } else {
      return next();
    }
  });
};

module.exports = async (s) => {
  
  const ALAPIStorage = new BncrDB('ALAPI');
  const ALAPIToken = await ALAPIStorage.get('Token');
  if (!ALAPIToken) return s.reply("请使用命令'set ALAPI Token ?,设置ALAPI的Token");

  const shortUrl = s.param(1);

  if (!shortUrl) {
    await s.reply('请提供一个短网址！');
    return;
  }

  try {
    const response = await axios.get('https://v2.alapi.cn/api/url/query', {
      params: {
        token: ALAPIToken,
        url: shortUrl,
      },
    });

    if (response.data.code === 200) {
      await s.reply(`还原后的网址：${response.data.data.long_url}`);
    } else {
      await s.reply('短网址还原失败，请稍后重试。');
    }
  } catch (error) {
    await s.reply('短网址还原失败，请稍后重试。');
  }
};