/**
 * @author Dswang
 * @team Dswang & SmartAI
 * @name 定时消息推送插件
 * @version 1.0.0
 * @description 有bug，暂时不要使用。支持多个定时任务，允许配置多个推送目标，支持个人和群组，注意：修改文件后重启无界生效
 * @priority 9999
 * @classification ["工具", "定时任务"]
 * @service false
 * @public fasle
 */

/// <reference path="../../@types/Bncr.d.ts" />

// 定义jsonSchema
const jsonSchema = BncrCreateSchema.object({
  schedules: BncrCreateSchema.array(
    BncrCreateSchema.object({
      name: BncrCreateSchema.string().setTitle('任务名称').setDescription('定时任务名称').setDefault('默认任务'),
      time: BncrCreateSchema.string().setTitle('定时时间').setDescription('使用cron格式设置时间').setDefault('0 8 * * *'),
      message: BncrCreateSchema.string().setTitle('推送消息').setDescription('定时任务触发时推送的消息').setDefault('这是定时推送的消息'),
      type: BncrCreateSchema.string().setTitle('消息类型').setDescription('推送消息的类型').setDefault('text').setEnum(['text', 'image', 'video']),
      path: BncrCreateSchema.string().setTitle('文件路径').setDescription('非text类型消息的文件路径，支持网络路径').setDefault(''),
      targets: BncrCreateSchema.array(
        BncrCreateSchema.object({
          platform: BncrCreateSchema.string().setTitle('平台').setDefault('tgBot'),
          userId: BncrCreateSchema.string().setTitle('用户ID').setDefault(''),
          groupId: BncrCreateSchema.string().setTitle('群组ID').setDefault('')
        })
      ).setTitle('推送目标').setDefault([{ platform: 'tgBot', userId: '123456789' }])
    })
  ).setTitle('定时任务列表').setDescription(`设置完成后重启生效`).setDefault([])
});

// 创建配置DB
const ConfigDB = new BncrPluginConfig(jsonSchema);

// 初始化定时任务
async function initSchedules() {
  await ConfigDB.get();
  const userConfig = ConfigDB.userConfig;

  userConfig.schedules.forEach(config => {
    const { name, time, message, type, path, targets } = config;
    sysMethod.cron.newCron(time, async () => {
      console.log(`定时任务 "${name}" 触发，时间: ${time}`);
      for (const target of targets) {
        if (type === 'text') {
          await sysMethod.push({
            platform: target.platform,
            groupId: target.groupId || '',
            userId: target.userId || '',
            msg: message,
            type: type
          });
        } else {
          await sysMethod.push({
            platform: target.platform,
            groupId: target.groupId || '',
            userId: target.userId || '',
            msg: message,
            path: path,
            type: type
          });
        }
        console.log(`消息已推送到平台: ${target.platform}, 用户ID: ${target.userId}, 群组ID: ${target.groupId}`);
      }
    });
    console.log(`已设置定时任务 "${name}"：${time}`);
  });
}

// 插件加载时初始化定时任务
initSchedules().catch(err => {
  console.error('初始化定时任务失败:', err);
});

module.exports = {};
