/** 
 * @author Dswang
 * @origin Dswang
 * @name 短网址还原
 * @version 1.1.0
 * @description 获取短网址缩短之前的网址。基本支持所有短网址
 * @rule ^网址还原 (.+)$
 * @priority 99999
 * @admin false
 */

// 引入request模块
const request = require('request');

module.exports = async (s) => {
  
  // 获取用户输入的短网址
  const shortUrl = s.param(1);

  if (!shortUrl) {
    await s.reply('请提供一个短网址！');
    return;
  }

  try {
    // 发送请求，并设置followRedirect为false，表示不自动跟随重定向
    request({ url: shortUrl, followRedirect: false }, (err, res, body) => {
      // 如果没有错误，并且响应状态码为301或302，表示有重定向
      if (!err && (res.statusCode === 301 || res.statusCode === 302)) {
        // 返回重定向的网址，即res.headers.location
        s.reply(`还原后的网址：${res.headers.location}`);
      } else {
        // 如果有错误或者没有重定向，直接回复“短网址还原失败，请直接访问”
        s.reply('短网址还原失败，请直接访问');
      }
    });
  } catch (error) {
    // 如果发生错误，则返回错误信息
    s.reply('短网址还原失败，请稍后重试。');
  }
};
