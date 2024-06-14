/**
 * @author Dswang
 * @name 自动回复
 * @team Dswang & SmartAI
 * @version 1.0.1
 * @description 自动回复插件。参考傻妞自动回复功能。仅支持文本
 * @rule ^(reply)\s+(\S+)\s+([\s\S]+)$
 * @rule ^(reply)\s+(\S+)\s+(del)$
 * @rule ^(reply)\s+(list)$
 * @rule ^(reply)\s+(empty)$
 * @rule ^(\S+)$
 * @admin false
 * @priority 9
 * @classification ["自动回复"]
 * @public false
 * @disable false
 */

module.exports = async (s) => {
  const sysDB = new BncrDB('Dswang_autoReplyDB');

  const commandType = s.param(1);
  const keyword = s.param(2);
  const replyContent = s.param(3);

  // console.log(`Received command: ${commandType}, Keyword: ${keyword}, ReplyContent: ${replyContent}`);

  if (commandType === 'reply') {
    if (keyword === 'list') {
      await handleListKeywords(s);
    } else if (keyword === 'empty') {
      await handleEmptyKeywords(s);
    } else if (replyContent === 'del') {
      await handleDelReply(s, keyword);
    } else {
      await handleAddReply(s, keyword, replyContent);
    }
  } else {
    await handleGetReply(s, commandType);
  }

  async function handleAddReply(s, keyword, reply) {
    if (!(await s.isAdmin())) {
      // console.log('User does not have admin privileges');
      return s.reply('你没有权限执行此操作');
    }

    const result = await setReply(keyword, reply);
    // console.log(`Set reply result for keyword ${keyword}: ${result}`);
    s.reply(result ? '设置成功' : '设置失败');
  }

  async function handleDelReply(s, keyword) {
    if (!(await s.isAdmin())) {
      // console.log('User does not have admin privileges');
      return s.reply('你没有权限执行此操作');
    }

    const result = await deleteReply(keyword);
    // console.log(`Delete reply result for keyword ${keyword}: ${result}`);
    s.reply(result ? '删除成功' : '删除失败');
  }
  async function handleGetReply(s, keyword) {
      const reply = await getReply(keyword);
    // console.log(`Get reply for keyword ${keyword}: ${reply}`);
      if (reply) {
      // console.log(`Replying with: ${reply}`);
        await s.reply(reply);
      }
      else {
         return "next";
      }
  }

  async function handleListKeywords(s) {
    const keys = await sysDB.keys();
    // console.log(`Listing keywords: ${keys}`);
    if (keys.length > 0) {
      s.reply(`当前关键词列表:\n${keys.join('\n')}`);
    } else {
      s.reply('当前没有关键词');
    }
  }

  async function handleEmptyKeywords(s) {
    if (!(await s.isAdmin())) {
      // console.log('User does not have admin privileges');
      return s.reply('你没有权限执行此操作');
    }

    try {
      const keys = await sysDB.keys();
      for (const key of keys) {
        await sysDB.del(key);
      }
      // console.log('All keywords cleared');
      s.reply('所有关键词已清空');
    } catch (e) {
      // console.error('清空失败:', e);
      s.reply('清空失败');
    }
  }

  async function setReply(keyword, reply) {
    try {
      await sysDB.set(keyword, reply);
      return true;
    } catch (e) {
      console.error('设置失败:', e);
      return false;
    }
  }

  async function deleteReply(keyword) {
    try {
      await sysDB.del(keyword);
      return true;
    } catch (e) {
      console.error('删除失败:', e);
      return false;
    }
  }

  async function getReply(keyword) {
    try {
      return await sysDB.get(keyword);
    } catch (e) {
      console.error('获取失败:', e);
      return null;
    }
  }
};
