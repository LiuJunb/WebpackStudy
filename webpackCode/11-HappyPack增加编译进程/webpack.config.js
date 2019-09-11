
const path = require('path');
const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

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
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/, 
        // 把对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例
        use: ['happypack/loader?id=css'],
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      // 注意：loaders 是 use 的别名
      loaders: [
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
      // ... 其它配置项
      threads: 5, // 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
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
      // ... 其它配置项
      threads: 5, // 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    })
 
  ]

};