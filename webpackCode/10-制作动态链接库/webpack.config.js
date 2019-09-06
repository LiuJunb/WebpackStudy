
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = {
  entry: ['./src/main.js'],
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
            options: {
              // 2.使用bable,新语法转成es5语法
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ],
      }
    ]
  },
  // externals: {
  //   // 把导入语句里的 LJquery 替换成运行环境里的全局变量 jQuery
  //   jQuery: 'jQuery'
  // },
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    // new DllReferencePlugin({
    //   // 描述 react 动态链接库的文件内容
    //   manifest: require('./dist/react.manifest.json'),
    // }),
    new DllReferencePlugin({
      // 描述 jquery 动态链接库的文件内容
      manifest: require('./dist/jquery.manifest.json'),
    }),
  ],
};