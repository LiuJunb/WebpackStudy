
function showHelloWorld(content) {
  console.log("aaaaa_xxxx")
  alert('hello world')
  console.log("bbbbb_xxxx")
}
console.log("ccccc_xxxx")
// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;