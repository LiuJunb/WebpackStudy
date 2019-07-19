
const path = require('path');
module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  resolve: {
    // 执行import { showHelloWorld } from './common'; 
    // 先尝试 ts 后缀的 TypeScript 源码文件，在尝试 js 后缀 JavaScript 源码文件
    extensions: ['.ts', '.js'] 
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use:['awesome-typescript-loader']
        // 1.该 Loader 是把 TypeScript 转换成 JavaScript, 只负责新语法的转换，新增的API不会自动添加polyfill
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};