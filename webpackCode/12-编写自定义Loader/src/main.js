console.log('aaaaa_xxxx')
console.log("bbbbb_xxxx")
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
// 3.通过 CommonJS 规范导入 CSS 模块
require('./main.css');
console.log("ccccc_xxxx")