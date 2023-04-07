/**
 * @author victor_li&薛定谔的大灰机
 * @name 点歌
 * @origin VICTOR
 * @version 1.0.0
 * @description 点歌插件，适配千寻插件和xyo插件，需在千寻适配器和xyo适配器中添加以下代码;薛定谔的大灰机@ISDHJ优化文件名输出
 * @rule ^点歌 ([^\n]+)$
 * @admin false
 * @disable false

wxQianxun.js在102行break和default中间添加如下代码:
            case 'music':
            	let name = JSON.parse(replyInfo.msg)['name']
            	let author = JSON.parse(replyInfo.msg)['singer']
            	let imageUrl = JSON.parse(replyInfo.msg)['picUrl']
            	let musicUrl = encodeURI(JSON.parse(replyInfo.msg)['musicUrl'])
            	console.log(musicUrl)
            	body = {
            		type: "Q0014",
            		data: {
            			wxid: to_Wxid,
            			name: name,
            			author: author,
            			app: "",
            			jumpUrl: musicUrl,
            			musicUrl: musicUrl,
            			imageUrl: imageUrl
            		}
            	};
            	break;

wxXyo.js在107行break和default中间添加如下代码:
	            case 'music':
            	let name = JSON.parse(replyInfo.msg)['name']
            	let author = JSON.parse(replyInfo.msg)['singer']
            	let imageUrl = JSON.parse(replyInfo.msg)['picUrl']
            	let musicUrl = encodeURI(JSON.parse(replyInfo.msg)['musicUrl'])
			body = {
				to_wxid: to_Wxid,
                    title: name,
                    desc: author,
                    url: musicUrl,
                    dataurl: musicUrl,
                    thumburl: imageUrl,
                    api: "SendMusicLinkMsg"
                };
                break;
                
【说明】添加完后重启无界即可享用
 */

const request = require('request');
const { randomUUID } = require('crypto')
const path = require('path');
const fs = require('fs');

 
module.exports = async s => {
	/** Code Encryption Block[419fd178b7a37c9eae7b7426c4a04203459af74a9c48a0b85bfe4091d93751f350ac6f53afbdb22a68594b4d5fd4c9de1d2b2066c5503f7c625065fd3bb1a223909cc2605eea773b656fb1d4eff7ecfded3a2aa3620fb137444faf2001932fb913f67d62c2aa0a80523bd19d7ba24eab3024bc8fc347cdc8037a9eca412b0ce43a78d95eca52f9fa9b7a40a6100777982b6cd793c42f77fd4f3b3b55decdc5dc1d3d6070b561bf52f28cb6ded77827aedc88ece88fc88f573076fb2431e11063c7b2ec3a592e78eb8de45880c5175eba542e6db2fb9e7e285b65bd68e702e5d3cb8e884d9c43ea4537c54283943024d53d90521c31e58b1e3f36a0df0de04df24172cd27f255fd8872b98d2e31ab04d2c31ca5b44dd3af3dd1ea3cff9ba052758bb5a4b28a192eb9f58c52e9310ec72f09c66bab6e986b3e7badc6a2f3dc3f59d1509ae10a0fabd28255610aad877cf9048e3e735b70f0a2134d431f3ac8778af40a2cd7b6af8f2ca3ded0ca4583b5e23fcca02525e7d5505d3793940e17bed1a4db83ce3ffe5347b63ca6c8ddccab23696db07cfbe41638f8af79e062d36859a6c2a8f261b2936a879c5bdf06f88977900ab534a2b7d367d249262a195390eb1277a7bb5c0350deca8a0ac7c09960febce8d8d79240f5f523672fb31b822903bfdb212e3b89ed9828b7bbf55e1f66dc67eed091e9ba7db9590c9cfcc2cc77a64107d0bafa139aa2a1dfcddf6a7469be438553dba919e4aefbc59f729c1cf9e0712549eb10156b0f537dfffdab86e2ec361a170bf750eebb7299077150f7eb91b4f191e9887b06b336fc698380103390db41aa1f46f7d0a085df3644ef56c6f9939af34eb2f38c7e2fe47f4de8282dbef5eac72339aa178d3a03c1b356a277ac5928cbed895cec2d3bd9a14d8b100b456fef5100fe09126aba9032495a9de786a08132d8cf307ff223bb6af8ba5cf7f7a7f301f8b633bcd8b8b2f50f33a82a8500de2afd02576757a94a1bd8cca4a2766d2d9d2ecfeb221c99f08a852e43ec07e816bf6e18277f546ff0541795ddaa79e135b67d2725275fd554fef95bd087a786176b6d1dbfbb543b9a690aad1c6a05f6c20605af19b0e12962fcf93a2195588e46f4da022afe64fa41b9eebdeee7ca01ef79c4a26c51b5fbb06c9e4534707cc17dff92820025e19e792191af74b6e7a26a181fc01ddc7d241cae9edde104717ebce4d51d020ca6c107ab2c865cd0b6b747d4798de4d4000445d6e87dab8eed8ce1e8696aec01fcdc6834f1a16f58af8ee586ea8f355cd3bfa5370840be4ce3662008a648f1cd11a093b6c81b357aabafd997c1c151f43d6f2e7d194d1018c1cdfcebca70fec8d176fd31cfdb2285db249d61215a3b161d47bc20236814961a54aa5c7d2af39db2317e26f102d2e538d189f4196f641205395271f26acd03023a23546f899aa232453e7208dd8fd3e8a76309cd7082f42a5699576e371e913e9a153e83f4b456b35430a85f5c5172253651e8eb929f680ab5b8091a335790e632779b7fe0a1b6160c3123c21382ff6d28fbe5b7d0bfc63d0e68eeaed0535f976ffd6378624696bf09445a65ae91e939f22d9cdb4727e2205bb93fe72125fabab4ad8e0de2d621f1368a87d80ca50d14751d046fc199f1bbf606fac92addfb838a9aeae9db372207a780eceb0357c14115c3c4fcf2c98d3089682f35bddbe785fbd0a93807b161329db37c220a160d991ed8cb2f3e7b40758cd56b3944ff189213e07a041cbcd2dcabdc0fa3652d8c09fffc4ddd9a650beed952abbd81d0888d] */
}

async function writeTovideo(url, data) {
    // console.log(`正在下载文件`)
    const paths = path.join(process.cwd(), `BncrData/public/${data.name}.mp3`);
    return new Promise((resolve, reject) => {
        let stream = request(url).pipe(
            fs.createWriteStream(paths)
        );
        stream.on('finish', () => {
            resolve(paths);
        });
    });
};