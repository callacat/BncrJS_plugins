/**
 * @author Masato
 * @name BingChat
 * @origin Masato
 * @version 1.0.5
 * @description 必应搜索聊天AI机器人越狱版，本插件由Bncr_ChatGPT插件修改而来
 * @rule ^(bing) ([\s\S]+)$
 * @rule ^(bimg) ([\s\S]+)$
 * @admin false
 * @public false
 * @priority 9999
 * @disable false
 */

/* 
使用命令'set BingChat Token ?'设置Token
输入'bing ?'进行与BingChat互动。
脚本为每个用户创建单独的会话，可以保持上下文进行调教
输入'bing 清空上下文'将清空会话,重新创建新的会话
输入'bimg ?'使用Bing Image Creator生成图片

必应Token获取方法：
使用最新版本的 Microsoft Edge打开bing.com/chat并确认能看到聊天功能
方法一：按F12或直接打开开发者模式，点击Application/应用程序，点击左侧Storage/存储下的Cookie，
展开找到https://www.bing.com 项，在右侧列表Name/名称项下找到"_U"，_U的value/值即为必应Token（有效期目前是14天）。
方法二：按F12或直接打开开发者模式，点击Console/控制台，运行如下代码，执行后即在您的剪切板存储了必应Token
copy(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("_U=")).split("=")[1]);

本插件基于@waylaidwanderer/chatgpt-api和bimg包实现
*/

let api = {};

module.exports = async s => {
    await sysMethod.testModule(['@waylaidwanderer/chatgpt-api', 'bimg'], { install: true });
    const BingChatStorage = new BncrDB('BingChat');
    const userToken = await BingChatStorage.get('Token');
    if (!userToken) return s.reply("请使用命令'set BingChat Token ?,设置BingChat的Token");
	if (s.param(1) === 'bimg') {
		process.env.BING_IMAGE_COOKIE = userToken;
		const { generateImagesLinks } = await import('bimg');
		try {
			let num = 4;   //设置返回图片的数量，最多4张
			let imageLinks = await generateImagesLinks(s.param(2));
			if (imageLinks) {
				for (let i = 0; i < num; i++) {
					let url = imageLinks[i];
					await s.reply({
						type: 'image', 
						path: url,
					});
					await sysMethod.sleep(1);
				}
				return;
			}
		} catch(e) {
			return await s.reply(e);
		}
	}
    if (!api?.sendMessage) {
        const { BingAIClient } = await import('@waylaidwanderer/chatgpt-api');
        api = new BingAIClient({ userToken: userToken });
        console.log('初始化BingChat...');
    }
    let platform = s.getFrom(),
        userId = s.getUserId(),
		suggestion = {},
		query = s.param(2);
    if (query === '清空上下文') {
        await BingChatStorage.del(`${platform}:${userId}`);
        return s.reply('清空上下文成功...');
    }
    let opt = {
		toneStyle: 'creative',
        timeoutMs: 2 * 60 * 1000,
    };
    /* 获取上下文 */
    const getUesrInfo = await BingChatStorage.get(`${platform}:${userId}`);
    if (getUesrInfo) {
        opt['jailbreakConversationId'] = getUesrInfo.jailbreakConversationId;
        opt['parentMessageId'] = getUesrInfo.parentMessageId;
		suggestion = getUesrInfo.suggestion;
        console.log('读取会话...');
    } else {
        console.log('创建新的会话...');
		opt['jailbreakConversationId'] = true;
    }
	if (query === '1' || query === '2' || query === '3') {
		if (Object.keys(suggestion).length > 0) {
			query = suggestion[query];
		} else {
			return s.reply('建议问题不存在！');
		}
	}
    let res = {},
        maxNum = 2,
		str = ``,
        logs = ``;
    s.reply(`Let me see...`);
    do {
        try {
            res = await api.sendMessage(query, opt);
            if (!res?.response) {
                logs += `未获取到消息,去重试...\n`;
                continue;
            }
			let reference = res.details.adaptiveCards[0].body[0].text;
            if (reference.includes("[1]:")) {
                reference = "\n\n相关信息:\n" + reference.split('\n\n', 1);
            } else {
                reference = "";
            }
			let suggestedResponses = res.details.suggestedResponses;
			for (let i = 0; i < suggestedResponses.length; i++) {
				let item = suggestedResponses[i];
				let index = i + 1;
				str += `\n>${index}、${item.text}\n`;
				suggestion[index] = item.text;
			}
            logs += `回复:\n${res.response}${reference}\n\n***\n你可以通过输入序号快速追问我以下建议问题：\n${str}***`;
            break;
        } catch (e) {
            logs += '会话出现错误,尝试重新创建会话...\n';
            if (maxNum === 1) logs += '如果持续出现错误,请考虑Token是否过期,或者在控制台查看错误!\n';
            console.log('Bncr_BingChat.js:', e);
            await sysMethod.sleep(1);
        }
    } while (maxNum-- > 1);
    if (!logs) return;
    await s.reply(`触发消息:\n${s.getMsg()}\n\n${logs}`);
    // console.log('res', res);
    if (!res?.messageId && !res?.jailbreakConversationId) return;
    /* 存储上下文 */
    await BingChatStorage.set(`${platform}:${userId}`, {
        jailbreakConversationId: res.jailbreakConversationId,
        parentMessageId: res.messageId,
		suggestion
    });
};
