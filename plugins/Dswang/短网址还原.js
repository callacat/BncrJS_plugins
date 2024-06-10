/**
 * @author Dswang
 * @name 短网址还原
 * @team Dswang & SmartAI
 * @version 1.2.0
 * @description 获取短网址缩短之前的网址。基本支持所有短网址
 * @rule ^网址还原 (.+)$
 * @priority 99999
 * @admin false
 * @public false
 * @classification ["工具"]
 */

const axios = require('axios');

module.exports = async s => {
  await sysMethod.testModule(['axios'], { install: true });
  
  // 获取用户输入的短网址
  const shortUrl = s.param(1);

  if (!shortUrl) {
    await s.reply('请提供一个短网址！');
    return;
  }

  try {
    // 发送请求，并设置 maxRedirects 为 0，表示不自动跟随重定向
    const response = await axios.get(shortUrl, { maxRedirects: 0 });

    // 如果响应状态码为301或302，表示有重定向
    if (response.status === 301 || response.status === 302) {
      // 返回重定向的网址，即 response.headers.location
      await s.reply(`还原后的网址：${response.headers.location}`);
    } else {
      // 如果没有重定向，直接回复“短网址还原失败，请直接访问”
      await s.reply('短网址还原失败，请直接访问');
    }
  } catch (error) {
    // 如果发生错误，则返回错误信息
    if (error.response && (error.response.status === 301 || error.response.status === 302)) {
      // 返回重定向的网址
      await s.reply(`还原后的网址：${error.response.headers.location}`);
    } else {
      await s.reply('短网址还原失败，请稍后重试。');
    }
  }
};
