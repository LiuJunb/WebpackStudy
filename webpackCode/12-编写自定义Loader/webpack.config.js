
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    filename: 'bundle.js',
    // 2. 指定输出文件存放的目录（默认是dist目录）
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  },
  resolveLoader:{
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules','./loaders/'],
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'],
      },
      {  
        test: /\.js$/,// 匹配 .js 结尾的文件,注意test的值不是一个字符串，而是一个正则
        use:{
            loader: 'console-loader', // 使用自定义 console-loader
            options: { // 自定义 console-loader 加载器
              // 如果为true 就会把js中所有的console.log语法删除
              // 如果为false则不就会删除
              clear: true
            }
          }
        
      }
    ]
  }
};