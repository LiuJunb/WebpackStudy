// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件( entry是一个函数 )
  entry: ()=>{
    // 好处是这里面通过for循环可以产生：多个页面多个入口
    return {
      main:'./src/main.js'
    }
  },
  output: {
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};