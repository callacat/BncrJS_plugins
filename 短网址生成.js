/** 
 * @author Dswang
 * @origin Dswang
 * @name 网址缩短
 * @version 1.0.0
 * @description 网址缩短插件
 * @rule ^(缩|网址缩短) (.+)$
 * @priority 99999
 * @admin false
 */

const axios = require('axios');

module.exports = async (s) => {
  const urlToShorten = s.param(2);

  try {
    const response = await axios.get('https://api.uomg.com/api/long2dwz', {
      params: {
        dwzapi: 'urlcn',
        url: urlToShorten,
      },
    });

    if (response.data.code === 1) {
        s.reply(`缩短后的网址：${response.data.ae_url}`);
    } else {
        s.reply('抱歉，无法缩短此网址。');
    }
  } catch (error) {
    s.reply('抱歉，发生了错误，请稍后再试。');
  }
};