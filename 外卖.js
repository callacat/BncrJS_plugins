/**
 * @author Dswang
 * @name 外卖图片插件
 * @origin Dswang
 * @version 1.0.0
 * @description 根据关键词回复不同的外卖图片
 * @rule ^(外卖|饿了么|美团)$
 * @admin false
 * @public false
 * @priority 1
 * @disable false
 */

const elm = 'https://img.dsdog.tk/file/20c633c82055be3d6fbd9.jpg';
const mt = 'https://img.dsdog.tk/file/16b892707f0bba9f50279.jpg';

const images = {
  '外卖': [
    {
      url: elm,
      description: '饿了么'
    },
    {
      url: mt,
      description: '美团每周三有大额优惠券'
    }
  ],
  '饿了么': [
    {
      url: elm,
      description: '饿了么'
    }
  ],
  '美团': [
    {
      url: mt,
      description: '美团每周三有大额优惠券'
    }
  ]
};

module.exports = async s => {
  const keyword = s.param(1);
  const imageUrls = images[keyword];
  
  if (imageUrls) {
    for (const { url, description } of imageUrls) {
      await s.reply({
        type: 'image',
        path: url,
        msg: description
      });
    }
  } else {
    await s.reply('获取外卖红包失败，请联系管理');
  }
};