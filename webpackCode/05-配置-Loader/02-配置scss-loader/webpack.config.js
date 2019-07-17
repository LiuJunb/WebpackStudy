
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/, 
        // 注意:use 的别名 是 loaders。下面3个加载的执行顺序是 3 2 1
        use: [
          // 1.不用传递参数可以简写
          'style-loader',
          {
            loader: 'css-loader',
            // 2.给css-loader传递参数
            options: {
              url: true,
              import: true
            }
          },
          // 3.使用sass加载器
          'sass-loader'
        ], 
      }
    ]
  }
};