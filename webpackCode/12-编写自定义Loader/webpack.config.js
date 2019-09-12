
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
        // use: ['console-loader'], // 使用自定义的 console-loader
        use:[
          {
            loader: 'console-loader', // 使用自定义的 console-loader
            options: {
              clear:true // 给自定义的 console-loader 传递options参数
            }
          }
        ]
      }
    ]
  }
};