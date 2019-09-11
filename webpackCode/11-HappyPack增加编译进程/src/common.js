import $ from 'jQuery'
// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法
const showHelloWorld =(content) => {
  $('body').css({
    background:'pink'
  })
}
// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;