
const path = require('path');
const ConsolePlugin = require('./plugins/console-plugin.js');
const WebpackLifeCyclePlugin = require('./plugins/watch-webpack-lifecycle-plugin.js');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    filename: 'bundle.js',
    // 2. 指定输出文件存放的目录（默认是dist目录）
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new ConsolePlugin({
      show:false
    }),
    new WebpackLifeCyclePlugin()
  ]
};