// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    // 指定服务的ip
    host: "localhost",
    // 指定服务的端口
    port: 9000,
    // 进行http的代理
    // proxy: {
    //   "/api": "http://localhost:3000"
    // }
  }
};