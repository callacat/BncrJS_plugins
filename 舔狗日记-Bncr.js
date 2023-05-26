/**作者
 * @author yanyu
 * @name 舔狗日记
 * @origin 烟雨阁
 * @version 1.0.5
 * @description 舔狗日记
 * @rule ^(舔狗|我舔)$
 * @admin flase
 * @public false
 * @priority 9999
 * @disable false
 * @service false
 */

const request = require('request');
//接口地址 https://www.tianapi.com/apiview/180

module.exports = async s => {
    const TIANAPIStorage = new BncrDB('TIANAPI');
    const TIANAPIToken = await TIANAPIStorage.get('Token');
    if (!TIANAPIToken) return s.reply("请使用命令'set TIANAPI Token ?,设置TIANAPI的Token");

    code = s.param(1);
    //you code
    request.post({
        url: 'https://apis.tianapi.com/tiangou/index',
        form: {
            key: TIANAPIToken
        }
    },async function (err, response, tianapi_data) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.parse(tianapi_data);
            var list = data.result;
            data =
            list.content
        }
        await s.reply(data);
        //console.log(data);
    })
    //插件运行结束时 如果返回 'next' ，则继续向下匹配插件 否则只运行当前插件
    return 'next'  //继续向下匹配插件
}