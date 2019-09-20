

# 1.Webpack4 自定义 Plugins



## 1.Plugin

Webpack 通过 Plugin 机制让其更加灵活，以适应各种应用场景。

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件。除此之外 Plugin 还可以广播自定义事件和监听自定义广播（例如，多个Plugin插件之间的通讯就可以通过定义自定义广播事件）。通过 Webpack 提供的 API 可以在构建的合适时机去改变输出的结果。



1)一个最基础的 Plugin 的代码是这样的：

```js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {
    })
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

2)在使用这个 Plugin 时，相关配置代码如下：

```js
const BasicPlugin = require('./BasicPlugin.js');
module.export = {
  plugins:[
    new BasicPlugin(options),
  ]
}
```

Webpack 启动后，在读取配置的过程中会先执行 `new BasicPlugin(options)` 初始化一个 BasicPlugin 获得其实例，接着初始化 compiler 对象后，再调用 `basicPlugin.apply(compiler)` 给插件实例传入 compiler 对象。 插件实例在获取到 compiler 对象后，就可以通过 `compiler.plugin(事件名称, 回调函数)` 监听到 Webpack 广播出来的事件（或者监听到自定义广播的事件）。 并且可以通过 compiler 对象去操作 Webpack。



**Compiler 和 Compilation**

在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：

- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。



## 2.Plugin的使用

下面将回顾 CSS Loader的使用方法：

新建一个项目

```json
|-- package.json
|-- src
|   |       `-- common.js
|   |       `-- index.html 
|   |       `-- main.css
|           `-- main.js
`-- webpack.config.js
```



package.json

```json
{
  "name": "testcssloader",
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
    "css-loader": "^3.0.0",
    "style-loader": "^0.23.1",
      
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  }
}
```

> scripts 属性里面编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版

webpack.config.js

```js

const path = require('path');
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
        test: /\.css$/, // 匹配 .css 结尾的文件,注意test的值不是一个字符串，而是一个正则
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。



main.css

```css
body {
  background-color: pink;
}
```

common.js

```js
function showHelloWorld(content) {
  alert('hello world')
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
// 3.通过 CommonJS 规范导入 CSS 模块
require('./main.css');
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

本地安装 webpack 和 用到的 loader

```
npm install webpack@4.35.3  --save-dev
npm install webpack-cli@3.3.6  --save-dev
npm install style-loader@0.23.1  --save-dev
npm install css-loader@3.0.0  --save-dev
```

在项目的根目录，执行脚本构建项目

`npm run dev`

打包后输出的结果

```json
|-- dist
|   |-- bundle.js
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.css
|   `-- main.js
`-- webpack.config.js

```



## 2.自定义Plugin

Webpack4 Plugin 的API文档：  https://webpack.js.org/api/compiler-hooks/#hooks

### 1.定义一个console-plugin

该插件是负责：控制台打印 Webpack 使用了的插件。

1.新建一个 plugins 文件夹

```json
|-- dist
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- plugins 
|   |   | -- console-plugin.js
|   |-- common.js
|   |-- index.html
|   |-- main.css
|   `-- main.js
`-- webpack.config.js
```

2.自定义一个 console-plugin

console-plugin.js

```js
/**
 * 这个插件的作用是:控制台打印项目中所用到的 plugin
 */
class ConsolePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
    this.show = options.show || true
    if(this.show === false){
      console.log('===============start===================')
      console.log('constructor.options=',options) // constructor.options= { show: true }
    }
  }

  // Webpack 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    // compiler.options 是拿到webpack.config.js配置文件中所有的配置
    let plugins = compiler.options.plugins // 获取所有的 plugins
    plugins.forEach((plugin,index)=>{
      if(this.show === false) console.log(index+') plugin=', plugin) // 0) plugin= ConsolePlugin {}
    })
    if(this.show === false) console.log('===============end===================')
  }
}

// 导出 Plugin
module.exports = ConsolePlugin;
```



3.在webpack的配置文件使用 console-plugin

webpack.config.js

```js

const path = require('path');
const ConsolePlugin = require('./plugins/console-plugin.js');
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
      show:true
    })
  ]
};
```



4.在根目录执行打包命令：`npm run dev`， 然后控制台输出如下：

```json
PS F:\blog\webpack-study\webpackCode\13-编写自定义Plugin> webpack --mode development
===============start===================
constructor.options= { show: true }
0) plugin= ConsolePlugin { show: true }
===============end===================
Hash: 9747b37b4f5b09e2dd2d
Version: webpack 4.39.3
Time: 328ms
Built at: 2019-09-20 10:58:10
    Asset      Size  Chunks             Chunk Names
bundle.js  24.2 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./src/main.css] 178 bytes {main} [built]
[./src/common.js] 152 bytes {main} [built]
[./src/main.css] 1.05 KiB {main} [built]
[./src/main.js] 254 bytes {main} [built]
    + 3 hidden modules
```



### 2.定义一个watch-webpack-lifecycle-plugin

该插件是：负责监控 Webpack 构建的生命周期

1.新建一个 plugins 文件夹

```json
|-- dist
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- plugins 
|   |   | -- console-plugin.js
|   |   | -- watch-webpack-lifecycle-plugin.js
|   |-- common.js
|   |-- index.html
|   |-- main.css
|   `-- main.js
`-- webpack.config.js
```

2.自定义一个 watch-webpack-lifecycle-plugin

watch-webpack-lifecycle-plugin.js

```js
/**
 * 这个插件的作用是:监控 Webpack 构建的生命周期的 plugin
 */
class WebpackLifeCyclePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack4 以前的写法（会调用 WebpackLifeCyclePlugin 实例的 apply 方法给插件实例传入 compiler 对象）
  // apply(compiler){
  //   // 1.当依赖的文件发生变化时会触发 watch-run 事件
  //   compiler.plugin('watch-run', (watching, callback) => {
  //     console.log('============watch-run'+'============')
  //     // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  //     callback();
  //   });
  //   // 2.第一个编译完成
  //   compiler.plugin('after-compile', (stats) => {
  //     console.log('============after-compile'+'============')
  //   });
  //   // 3.确定好要输出哪些文件，执行文件输出，可以在这里获取和修改输出内容
  //   compiler.plugin('emit', (compilation, callback) => {
  //     console.log('============emit'+'============')

  //     // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  //     // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
  //       callback()
  //   });
  //   // 4.完成一次构建任务
  //   compiler.plugin('done', (stats) => {
  //     console.log('============done'+'============')
  //   });
  //   // 5.构建失败
  //   compiler.plugin('failed', (err) => {
  //     console.log('============failed'+'============')
  //   });

  // }

  // Webpack4 以后的写法 （ 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象）
  apply(compiler){
    let MyPlugin = 'WebpackLifeCyclePlugin'
    // 1.读取配置的 Entrys，为每个 Entry 实例化一个对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备。
    compiler.hooks.entryOption.tap(MyPlugin, (context, entry) => {
      console.log('============entry-option'+'============')
    });
    // 2.当依赖的文件发生变化时会触发 watch-run 事件
    compiler.hooks.watchRun.tapAsync(MyPlugin, (watching, callback) => {
      console.log('============watch-run'+'============')
      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      callback();
    });
    // 3.第一个编译完成
    compiler.hooks.afterCompile.tap(MyPlugin, (stats) => {
      console.log('============after-compile'+'============')
    });
    // 4.确定好要输出哪些文件，执行文件输出，可以在这里获取和修改输出内容
    compiler.hooks.emit.tapAsync(MyPlugin, (compilation, callback) => {
      console.log('============emit'+'============')

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
        callback()
    });
    // 5.完成一次构建任务
    compiler.hooks.done.tap(MyPlugin, (stats) => {
      console.log('============done'+'============')
    });
    // 6.构建失败
    compiler.hooks.failed.tap(MyPlugin, (err) => {
      console.log('============failed'+'============')
    });

  }
}

// 导出 Plugin
module.exports = WebpackLifeCyclePlugin;
```



3.在webpack的配置文件使用 watch-webpack-lifecycle-plugin

webpack.config.js

```js

const path = require('path');
const ConsolePlugin = require('./plugins/console-plugin.js');
// 1.导入WebpackLifeCyclePlugin插件
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
    // 2.使用该插件 
    new WebpackLifeCyclePlugin()
  ]
};
```



4.在根目录执行打包命令：`npm run dev`， 然后控制台输出如下：

```js
PS F:\blog\webpack-study\webpackCode\13-编写自定义Plugin> npm run dev

> testcssloader@1.0.0 build F:\blog\webpack-study\webpackCode\13-编写自定义Plugin
> webpack --mode production

============entry-option============
============after-compile============
============emit============
============done============
Hash: 665b3555f35155c730f0
Version: webpack 4.39.3
Time: 261ms
Built at: 2019-09-20 11:36:11
    Asset      Size  Chunks             Chunk Names
bundle.js  6.94 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/main.js 254 bytes {0} [built]
[1] ./src/common.js 152 bytes {0} [built]
[2] ./src/main.css 1.05 KiB {0} [built]
[3] ./node_modules/css-loader/dist/cjs.js!./src/main.css 178 bytes {0} [built]
    + 3 hidden modules
```



### 3.自定义Hooks钩子

上面的案例只是监听了 Webpack 生命周期中的 Hooks 钩子函数的回调，下面将编写自定义Hooks 和 监听自定的Hooks事件

Webpack 的 Plugin 的API文档： https://webpack.js.org/api/plugins/#custom-hooks 

console-plugin.js

```js
const SyncHook = require('tapable').SyncHook;
/**
 * 这个插件的作用是:控制台打印项目中所用到的 plugin
 */
class ConsolePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
    .......
    .......
  }

  // Webpack 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    ......
    ......
  
    // 1.判断该 Hook 是否已经存在
    // Within the `apply` method...
    if (compiler.hooks.myCustomHook) throw new Error('myCustomHook Already in use');
    // 2.自定义 myCustomHook， ['arg0', 'arg1', 'arg2']表明触发这个myCustomHook需要传递3个参数
    compiler.hooks.myCustomHook = new SyncHook(['arg0', 'arg1', 'arg2']);
    // 3.监听 自定义 myCustomHook 的事件，如果一旦有自定义 myCustomHook事件触发将会回调下面的函数
    compiler.hooks.myCustomHook.tap('WebpackLifeCyclePlugin', (a,b,c) => {
      console.log('============myCustomHook1'+'============'+a,b,c)
    });
    
  }
}

// 导出 Plugin
module.exports = ConsolePlugin;
```



watch-webpack-lifecycle-plugin.js

```js
// const SyncHook = require('tapable').SyncHook;

class WebpackLifeCyclePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack4 以后的写法 （ 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象）
  apply(compiler){
    let MyPlugin = 'WebpackLifeCyclePlugin'
    ......
    ......
    
    // 6.构建失败
    compiler.hooks.failed.tap(MyPlugin, (err) => {
      console.log('============failed'+'============')
    });
      
      
    // 7.自定义一个hook
    // Within the `apply` method...
    // if (compiler.hooks.myCustomHook) throw new Error('myCustomHook Already in use');
    // compiler.hooks.myCustomHook = new SyncHook(['arg0', 'arg1', 'arg2']);

    // 8.监听自定义的hook （ 必须先监听后触发 ）
    compiler.hooks.myCustomHook.tap(MyPlugin, (a,b,c) => {
      console.log('============myCustomHook2'+'============'+a,b,c)
    });
    // 9.触发自定义的hook ( 传递3个参数 )
    // Wherever/whenever you'd like to trigger the hook...
    compiler.hooks.myCustomHook.call('a1', 'b1', 'c1');

    
  }
}

// 导出 Plugin
module.exports = WebpackLifeCyclePlugin;
```



在根目录执行打包命令：`npm run dev`， 然后控制台输出如下：

```json
PS F:\blog\webpack-study\webpackCode\13-编写自定义Plugin> npm run dev

> testcssloader@1.0.0 dev F:\blog\webpack-study\webpackCode\13-编写自定义Plugin
> webpack --mode development

============myCustomHook1============a1 b1 c1
============myCustomHook2============a1 b1 c1
============entry-option============
============after-compile============
============emit============
============done============
Hash: 9747b37b4f5b09e2dd2d
Version: webpack 4.39.3
Time: 292ms
Built at: 2019-09-20 12:47:29
    Asset      Size  Chunks             Chunk Names
bundle.js  24.2 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/css-loader/dist/cjs.js!./src/main.css] 178 bytes {main} [built]
[./src/common.js] 152 bytes {main} [built]
[./src/main.css] 1.05 KiB {main} [built]
[./src/main.js] 254 bytes {main} [built]
    + 3 hidden modules
```













