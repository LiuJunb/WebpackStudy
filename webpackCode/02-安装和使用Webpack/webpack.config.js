// 1.从 node环境 中导入 path 模块
const path = require('path');

console.log(__dirname)  // 表示当前执行脚本所在目录的绝对路劲，是node的全局变量
console.log(path.resolve(__dirname, '/dist')) // 表示当前执行脚本所在目录的绝对路劲 下的 dist 目录

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    // 4.把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};