
const path = require('path');
module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    filename: 'bundle.js',
    // 2. 指定输出文件存放的目录（默认是dist目录）
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配 .css 结尾的文件,注意test的值不是一个字符串，而是一个正则
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   presets: [
            //     '@babel/preset-env'
            //   ],
            //   plugins: ['@babel/transform-runtime']
            // }
          }
        ],
      }
    ]
  }
};