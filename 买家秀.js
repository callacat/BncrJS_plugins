/**作者
 * @author Doraemon
 * @name 买家秀
 * @origin 红灯区
 * @version 1.0.0
 * @description 🔍买家秀，18🈲️ 原作者 YuanKK
 * @platform HumanTG
 * @rule ^(买家秀)$
 * @admin true
 * @disable false
 */

 const request = require('request');
 const fs = require('fs');
 
 module.exports = async s => {
    const sleepSync = (ms) => {
        const end = new Date().getTime() + ms;
        while (new Date().getTime() < end) { /* do nothing */ }
      }

    let msgId = '';
    s.delMsg(s.getMsgId())
    for (let i = 0; i <= 20; i++) {
        let jpgURL = `https://api.uomg.com/api/rand.img3?format=images`,
            open = false;
        ["tgBot", "HumanTG"].includes(s.getFrom()) && (jpgURL = await writeToJpg(jpgURL)), open = true;   /* 存储图片 */
        i === 0 && (msgId = await s.reply({
            type: 'image',
            path: jpgURL
        }));
        sleepSync(2000)
        if (i > 0 && s.getFrom() === 'HumanTG') {
            await s.Bridge.editImage({
                type: 'image',
                path: jpgURL,
                groupId: s.getGroupId(),
                userId: s.getUserId(),
                msgId: msgId
            });
        }
        open && fs.unlinkSync(jpgURL);
    }
    s.delMsg(msgId)
 };

 async function writeToJpg(url) {
    const paths = path.join(process.cwd(), `BncrData/public/${randomUUID().split('-').join('') + '.jpg'}`);
    return new Promise((resolve) => {
        request(url).pipe(
            fs.createWriteStream(paths)
        ).on('finish', () => {
            resolve(paths);
        });
    });
}
 