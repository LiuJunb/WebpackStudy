
const path = require('path');
// 1.导入提取css的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  // entry: './src/main.js',
  entry: {
    app: ['./src/main.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        // 2.提取模块中的css
        use: ExtractTextPlugin.extract({
          // 处理当 CSS 没有被提取的部分，即当 allChunks: false
          fallback: "style-loader",
          // 将css资源转换成一个 CSS 导出模块
          use: "css-loader"
        }),
      }
    ]
  },
  plugins: [
    // 3.提取模块中的css
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: '[id]-[name]-[hash:8].css',
    })
  ]
};