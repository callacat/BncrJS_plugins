

/**作者
 * @author Dswang
 * @origin Dswang
 * @name 谷歌翻译
 * @version 1.0.0
 * @description 请先使用 npm i @iamtraction/google-translate 安装模块
 * @rule ^(翻译) (.+)$
 * @admin false
 * @public true
 * @priority 199
 * @disable false
 */

const translate = require('@iamtraction/google-translate');

module.exports = async (s) => {
  const command = s.param(1);
  const text = s.param(2);

  if (command === '翻译') {
    try {
      const result = await translate(text, { to: text.match(/[\u4e00-\u9fa5]/) ? 'en' : 'zh-CN' });
      await s.reply(result.text);
    } catch (error) {
      console.error('翻译插件出错:', error);
      await s.reply('抱歉，翻译过程中出现了错误。');
    }
  }
};