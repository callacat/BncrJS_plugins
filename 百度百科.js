/**
 * @author victor_li
 * @name 百度百科
 * @origin VICTOR
 * @version 1.0.0
 * @description 百度百科
 * @rule ^(百度百科|百科)([^\n]+)$
 * @admin false
 * @disable false
 */

const request = require('request');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const axios = require("axios").default

module.exports = async s => {
	/** Code Encryption Block[be188605b2af9d5e9f0e7db22a9634fc0f0460567cb3f537e8b369e4af2241c12afb06dcdbea26b2953a5cbde863da747f1061b035985c9bc028b9c288d15d9be9bc64cd2886e51bdd876a1254bfd1f1230e30c210876ce885957007cd950de799b03b6fbdcf7836f78493303e2ecd26a79fe4df965fc5aeba82a1e5868b64d4b56d4ba0a5c0914b9aae2c8d4a7b4aec7c4451243862d8ea9c6ff53f8be57ead7ec0053eec355b2f175ad729a0fc61c6e054cdcdf8ff565cb55913da1243a882b1369a367564ae63c922caae5838c3aa8b9ec036233c161205d411087d6a497608100f662b223e252f4993ccea85e820962e66d09264b9f85fc076cea16a5bb51dfd1c351d92a66977451771db5d57cb956827e95423d28827e0573802be58576da3934d3cebbdd765c448c3340af753ce3be2135ca61dc355394f5fa353b23781ef5019a2d33a0a61df84f4f8024bb5b15e61bb0bdc3389d79978e6ce07ade2e450da65a52ca5aae27181b72c58414917b4b9022f1cd6e31f4d6d33a1731fea22cdc09f88da13872d934e64d2924a1eeb7c021baa43f68fad57055f650bfdcbc23cb3cac7bf6c709bfa1fb96ff29b305291a5769a8d0531d0c19310f0ed6c32f78e128657ac43997c5be9fb76f2f30d02a323ea2503c8d0456c23d49e1ad84ba0f558fe7abb382a6dcb8485574e90ee13f75ecb0f869d5c6480fbd323df46cb142828aabf73ebb893719719e004466cb8358d6ba7f8a06474884acd9f06deb2d5ebc4ecdfed6e0fa9cafcbe1af9721fe8aa6e095a3123f1cbce5a1b72777d4e13137f4d3146c6f85e49f4b580b63ba43b32cdf9a8172c6a7e73e8b5b5555fcf455227ad17bdec3ff008a42f4a46b6196b79e98bd8e5ff13c753445b639e037f55c23b96020655ed823025790ee3bc7de5f91246d5d0d702e339157345c51b72ca6da5114be1e2dac555ef5b38d2e14d2a40a84fb289c2b24b34f40e7c42318a60eca651548a406a827daba880df06e9de61b5f20bc1f84e46c6f9ec60a45075016fda2809549cecf60388cc4b5242c7f22133264d12b13943ed125d78eab1925e2fa788c3411d3f9fabb0db10239fc418436454b8215f18aba581c989d71c62] */	
}
async function writeToJpg(url) {
    const paths = path.join(process.cwd(), `BncrData/public/${randomUUID().split('-').join('') + '.png'}`);
    return new Promise((resolve, reject) => {
        let stream = request(url).pipe(
            fs.createWriteStream(paths)
        );
        stream.on('finish', () => {
            resolve(paths);
        });
    });
};

