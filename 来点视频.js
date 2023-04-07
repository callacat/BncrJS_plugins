/**作者
 * @author Doraemon
 * @name 来点视频
 * @origin 红灯区
 * @version 1.0.0
 * @description 1
 * @platform HumanTG
 * @rule ^(来点视频)$
 * @admin true
 * @disable false
 */

 const axios = require('axios').default;
 
 module.exports = async s => {
     let msgId = '';
     s.delMsg(s.getMsgId())
 
     const sleepSync = (ms) => {
         const end = new Date().getTime() + ms;
         while (new Date().getTime() < end) { /* do nothing */ }
     }
 
     for (let i = 0; i <= 20; i++) {
 
         try {
             const url =  `https://pf129.com/xjj/get/get1.php`;
             const response = await axios.get(url);
 
             if (response.status === 200) {
                 let url = response.data;
 
                 i === 0 && (msgId = await s.reply({
                     type: 'video',
                     path: url
                 }));
                 sleepSync(3000)
                 if (i > 0 && s.getFrom() === 'HumanTG') {
                     await s.Bridge.editImage({
                         type: 'image',
                         path: url,
                         groupId: s.getGroupId(),
                         userId: s.getUserId(),
                         msgId: msgId
                     });
                 }
             } else {
                 console.log("发生错误");
             }
         } catch (error) {
             console.log("发生错误 " + error.message);
         }
     }
     s.delMsg(msgId)
  };
  
 