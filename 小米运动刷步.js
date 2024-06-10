/**
 * @author Dswang
 * @name 小米运动刷步
 * @team Dswang & SmartAI
 * @version 1.0.1
 * @description 一个用于刷新用户步数的插件，请先下载并注册小米运动（Zepp Life）后绑定微信运动。来自https://linux.do/t/topic/99835
 * @rule ^刷新步数 (清空(账|帐)(号|户))?$
 * @rule ^刷新步数 ([1-9]\d*)?$
 * @admin false
 * @public false
 * @priority 9999
 * @classification ["工具"]
 */

const axios = require('axios');

module.exports = async s => {
  await sysMethod.testModule(['axios', 'input'], { install: true });
  const userId = s.getUserId();
  const userDb = new BncrDB('Dswang_userSteps');
  // console.log(s.param(1),s.param(2))

  // 检查是否为清空账号操作
    if (/^ 清空(账|帐)(号|户)$/.test(s.param(1))) {
    await userDb.del(userId);
    return s.reply('账户信息已清空');
    }


  let userData = await userDb.get(userId);

  if (!userData) {
    // 提醒用户输入账号
    await s.reply('第一次使用，请输入你的账号（邮箱或手机号）\n公开群请撤回手机号保护隐私\n输入q取消：');
    const accountInput = await s.waitInput(() => {}, 15, 'q');
    if (!accountInput || accountInput.getMsg().toLowerCase() === 'q') return s.reply('操作已取消');

    const account = accountInput.getMsg();
    // 验证账号格式
    if (!isValidAccount(account)) {
      return s.reply('账号格式错误，请输入正确的邮箱或手机号格式');
    }

    // 提醒用户输入密码
    await s.reply('请输入你的密码(输入q取消)：');
    const passwordInput = await s.waitInput(() => {}, 15, 'q');
    if (!passwordInput || passwordInput.getMsg().toLowerCase() === 'q') return s.reply('操作已取消');

    const password = passwordInput.getMsg();

    // 提醒用户输入步数
    await s.reply('请输入要设置的步数（具体正整数或 "?" 随机生成）：');
    const stepsInput = await s.waitInput(() => {}, 15, 'q');
    if (!stepsInput || stepsInput.getMsg().toLowerCase() === 'q') return s.reply('操作已取消');

    let steps = stepsInput.getMsg();

    // 处理步数
    if (!isValidSteps(steps)) {
      return s.reply('步数参数错误，请输入具体正整数或 "?"');
    }

    // 发送请求
    const result = await sendStepsRequest(account, password, steps, s);
    if (result) {
      // 仅在成功时保存用户数据到数据库
      await userDb.set(userId, { account, password });
      await s.reply('已保存用户信息，可发送“刷新步数 清空账号”删除用户信息');
    }
  } else {
    const { account, password } = userData;
    let steps = s.param(1) || '?';

    // 处理步数
    if (!isValidSteps(steps)) {
      return s.reply('步数参数错误，请输入具体正整数或 "?"');
    }

    // 发送请求
    await sendStepsRequest(account, password, steps, s);
  }
};

function isValidAccount(account) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{11}$/;
  return emailPattern.test(account) || phonePattern.test(account);
}

function isValidSteps(steps) {
  return steps === '?' || /^[1-9]\d*$/.test(steps);
}

async function sendStepsRequest(account, password, steps, s) {
  const params = { account, password, steps };

  try {
    const response = await axios.get('https://steps.api.030101.xyz/api', { params });
    const data = response.data;

    if (data.status === 'success') {
      await s.reply(`${data.message}，一天内不建议多次使用`);
      return true;
    } else if (data.message.includes('密码错误')) {
      await s.reply(`错误: ${data.message}，要不修改密码再试？`);
      return false;
    } else {
      await s.reply(`错误: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error('请求失败:', error);
    await s.reply('请求失败，请检查日志以获取更多信息');
    return false;
  }
}
