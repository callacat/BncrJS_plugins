/**
 * @author Aming
 * @name ip变动重启
 * @origin 红灯区
 * @version 1.0.0
 * @description ip变动重启,多拨慎用!
 * @rule ^ip检测$
 * @priority 1000
 * @admin true
 * @public false
 * @disable false
 * @cron 0 *\/1 * * * *

*/
/* 使用前先对机器人说 npm i public-ip */
const AmTool = require('./mod/AmTool');
const sysDB = new BncrDB('system');
module.exports = async s => {
    const ipv4 = (await import('public-ip')).publicIpv4;
    const v4DB = await sysDB.get('publicIpv4');
    const nowV4ip = await ipv4();

    let logs = `上次ip:${(v4DB && AmTool.Masking(v4DB, 5, 6)) || '空'}\n`;
    logs += `本次ip:${(nowV4ip && AmTool.Masking(nowV4ip, 5, 6)) || '空'}\n`;
    let open = false;
    if (v4DB && v4DB !== nowV4ip) {
        logs += '重启中...';
        open = true;
    }
    await sysDB.set('publicIpv4', nowV4ip);
    await s.reply(logs);
    open && (s.getFrom() === 'cron' ? sysMethod.inline('重启') : s.inlineSugar('重启'));
};
