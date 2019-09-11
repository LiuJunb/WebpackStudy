

# 1.Webpack4 增加编译进程

## 1.HappyPack

在用Webpack构建项目时有大量文件需要解析和处理，构建过程是文件读写和计算密集型的操作（特别是当文件数量变多后），Webpack 构建慢的问题会显得严重。 

运行在 Node.js 之上的 Webpack 是**单线程**模型的，也就是说 Webpack 需要处理的任务需要一件件挨着做，不能多个事情一起做。

文件读写和计算操作是无法避免的，那能不能让 Webpack 同一时刻处理多个任务，发挥多核 CPU 电脑的威力，以提升构建速度呢？

[HappyPack](https://github.com/amireh/happypack) 就能让 Webpack 做到这点，它把任务分解给多个**子进程**去并发的执行，子进程处理完后再把结果发送给主进程。

> 由于 JavaScript 是**单线程**模型，要想发挥多核 CPU 的能力，只能通过**多进程**去实现，而无法通过**多线程**实现。



## 2.提升Webpack构建速度

### 1.新建一个项目

```js
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- index.html
|   |-- common.js
|   `-- main.js
`-- webpack.config.js
```

package.json

```json
{
  "name": "testjsloader",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "author": "liujun",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "babel-loader": "^8.0.0-beta.0",
      
    "css-loader": "^3.2.0",
    "style-loader": "^1.0.0",
      
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6",
      
    "happypack": "^5.0.1"
  },
  "dependencies": {
    "jquery": "^3.4.1"
  }
}


```

> 1.分别安装了开发的依赖 和 生成的依赖包（ 本文主要是介绍：happypack 开发依赖包提升构建速度 ）
>
> 2.编写了2个打包的脚本



webpack.config.js

```js

const path = require('path');
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
      },
      {
        test: /\.css$/, 
        // 注意：loaders 是use 的别名
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
```

common.js

```js
import $ from 'jQuery'
// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法
const showHelloWorld =(content) => {
  $('body').css({
    background:'pink'
  })
}
// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;
```

main.js

```js
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
```

index.html

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="../dist/bundle.js"></script>
</body>
</html>
```

2.打开终端，在项目的根目录执行：`npm run dev` 命令就可以开始打包





### 2.使用HappyPack提升构建速度

webpack.config.js

```js

const path = require('path');
const HappyPack = require('happypack');
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
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
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
      ]
      // ... 其它配置项
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
    })
 
  ]

};
```

2.打开终端，在项目的根目录执行：`npm run dev` 命令就可以开始打包,   就会看到以下由 HappyPack 输出的日志：

```json
PS F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程
> webpack --mode development

Happy[babel]: Version: 5.0.1. Threads: 3
Happy[babel]: All set; signaling webpack to proceed.
Happy[css]: Version: 5.0.1. Threads: 3
Happy[css]: All set; signaling webpack to proceed.
.....
.....
```

说明你的 HappyPack 配置生效了，并且可以得知 HappyPack 分别启动了3个**子进程**去并行的处理任务。



### 3.指定HappyPack的子进程数

在new  HappyPack ( {  } ) 插件的时候，除了可以传入 `id` 和 `loaders` 两个参数外，HappyPack 还支持`threads` , `threads` 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。

webpack.config.js

```js
const path = require('path');
const HappyPack = require('happypack');
module.exports = {
  entry: ['./src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/, 
        use: ['happypack/loader?id=css'],
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      ],
      // ... 其它配置项
      threads: 5 // 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
    }),
    new HappyPack({
      id: 'css',
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
      ],
      // ... 其它配置项
      threads: 5 // 代表开启几个子进程去处理这一类型的文件，默认是3个，类型必须是整数。
    })
 
  ]

};
```

2.打开终端，在项目的根目录执行：`npm run dev` 命令就可以开始打包,   就会看到以下由 HappyPack 输出的日志：

```json
PS F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程
> webpack --mode development

Happy[babel]: Version: 5.0.1. Threads: 5
Happy[babel]: All set; signaling webpack to proceed.
Happy[css]: Version: 5.0.1. Threads: 5
Happy[css]: All set; signaling webpack to proceed.
```

说明你的 HappyPack 配置生效了，并且可以得知 HappyPack 分别启动了5个**子进程**去并行的处理任务。



### 4.HappyPack共享子进程

在new  HappyPack ( {  } ) 插件的时候，除了可以传入 `id` , `loaders` 和 `threads` 参数外，HappyPack 还支持`threadPool,` `threadPool`  代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。

webpack.config.js

```js

const path = require('path');
const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  entry: ['./src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/, 
        use: ['happypack/loader?id=css'],
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      ],
      // ... 其它配置项
      threads: 5, 
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'css',
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
      ], 
      // ... 其它配置项
      threads: 5, 
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    })
 
  ]

};
```

打开终端，在项目的根目录执行：`npm run dev` 命令, 这时你会看到控制台有一串日志输出： 

```
PS F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\11-HappyPack增加编译进程
> webpack --mode development

Happy[babel]: Version: 5.0.1. Threads: 5
Happy[babel]: All set; signaling webpack to proceed.
Happy[css]: Version: 5.0.1. Threads: 5
Happy[css]: All set; signaling webpack to proceed.
```



总结：

在整个 Webpack 构建流程中，最耗时的流程可能就是 Loader 对文件的转换操作了，因为要转换的文件数据巨多，而且这些转换操作都只能一个个挨着处理。

HappyPack 的核心原理就是把这部分任务分解到多个进程去并行处理，从而减少了总的构建时间。

从前面的使用中可以看出所有需要通过 Loader 处理的文件都先交给了 `happypack/loader` 去处理，收集到了这些文件的处理权后 HappyPack 就好统一分配了。

每通过 `new HappyPack()` 实例化一个 HappyPack 其实就是告诉 HappyPack 核心调度器如何通过一系列 Loader 去转换一类文件，并且可以指定如何给这类转换操作分配子进程。

核心调度器的逻辑代码在主进程中，也就是运行着 Webpack 的进程中，核心调度器会把一个个任务分配给当前空闲的子进程，子进程处理完毕后把结果发送给核心调度器，它们之间的数据交换是通过进程间通信 API 实现的。

核心调度器收到来自子进程处理完毕的结果后会通知 Webpack 该文件处理完毕。

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







