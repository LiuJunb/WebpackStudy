
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
        test: /\.css$/, 
        // 注意：loaders 是 use 的别名
        loaders: [
          {
            loader: 'style-loader',
            options: {
              
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              import: true
            }
          }
        ], // 给css-loader传递参数 ?minimize
      }
    ]
  }
};