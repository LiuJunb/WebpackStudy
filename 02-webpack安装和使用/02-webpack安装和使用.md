# 1.Webpack安装

在用 Webpack 执行构建任务时需要通过 `webpack` 可执行文件去启动构建任务，所以需要安装 `webpack` 可执行文件。 (  例如：`webpack --config webpack.config.js`  )

在安装 Webpack工具前请确保你的系统安装了5.0.0及以上版本的 [Node.js](https://nodejs.org/)。因为`webpack`在执行打包压缩等时是依赖`node.js`的，没有`node.js`就不能使用`Webpack`

> 注意：`node`、`nodejs`、`node.js`是同一个东西，只是名字不同而已，而`npm`只是`nodejs`的一个模块



## 1.全局安装Webpack

安装到`全局`后你可以在任何地方共用一个 Webpack 可执行文件( 也就是说可以直接在终端使用webpack的命名 ,例如：`webpack --config webpack.config.js`)，而不用各个项目重复安装，安装方式如下：

```json
npm i -g webpack  # i 是 install的简写； -g 是全局安装
```

全局安装的目的是：直接打开终端就可以使用Webpack命令，而不需要进入到指定的项目下。



` webpack -v `查看Webpack是否安装成功

```json
$ webpack -v
4.35.3
```



如果有下面提示，因为在webpack 3中，Webpack本身和它的Webpack-CLI以前都是在同一个包中，但在第4版中，它们已经将两者分开来更好地管理它们, 所以在全局安装Webpack 4.x 以后要单独安装Webpack-CLI，

执行： `npm install -g webpack-cli`

```json
$ webpack -v
One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:
 - webpack-cli (https://github.com/webpack/webpack-cli)
   The original webpack full-featured CLI.
We will use "npm" to install the CLI via "npm install -D".
Do you want to install 'webpack-cli' (yes/no):

```



## 2.项目中安装Webpack

要安装 Webpack 到项目中，可按照你的需要选择以下任意命令运行：

```json
# npm i -D 是 npm install --save-dev 的简写，是指安装模块并保存到 package.json 的 devDependencies
# 安装最新稳定版
npm i -D webpack

# 安装指定版本
npm i -D webpack@<version>

# 安装最新体验版本
npm i -D webpack@beta
```

安装完后你可以通过这些途径运行安装到本项目的 Webpack：

- 在项目根目录下对应的命令行里通过 `node_modules/.bin/webpack` 运行 Webpack 可执行文件。

- 在 [Npm Script](http://webpack.wuhaolin.cn/1入门/常见的构建工具及对比/npm_script.md) 里定义的任务会优先使用本项目下的 Webpack，代码如下：

  ```json
  "scripts": {
      "start": "webpack --config webpack.config.js" # 优先运行项目中的webpack，项目下没有则运行全局安全的webpack
  }
  ```



## 3.使用Webpack

新建一个 HelloWorld 项目，目录结构如下图

```
|-- src
|   |                               `-- common.js
|   |                               `-- index.html
|                                   `-- main.js
`-- webpack.config.js
```



`webpack.config.js` 是项目中 Webpack 的配置文件：

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

console.log(__dirname)  // 表示当前执行脚本所在目录的绝对路劲，是node的全局变量
console.log(path.resolve(__dirname, '/dist')) // 表示当前执行脚本所在目录的绝对路劲下的dist目录

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    // 4.把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```



`main.js`是 Webpack 打包入口文件:

```js
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
```



`common.js` 是项目存放公共代码文件：

```js

function showHelloWorld(content) {
  alert('hello world')
}

// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;
```



`index.html` 是项目的首页：

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



一切文件就绪，在项目根目录下执行 `webpack` 命令运行 Webpack 构建，你会发现目录下多出一个 `dist`目录，里面有个 `bundle.js` 文件， `bundle.js` 文件是一个可执行的 JavaScript 文件，它包含页面所依赖的两个模块 `main.js` 和 `common.js` 及内置的 `webpackBootstrap` 启动函数。 这时你用浏览器打开 `index.html` 网页将会看到：弹出 `Webpack的安装和使用`的对话框



以下是控制台的输出:（在执行webpack的时候，至少全局已安装Webpack）

```json
liujun@DESKTOP-SAM0OS0 MINGW64 /f/blog/webpack-study/webpackCode/01-安装和使用Webpack
$ webpack

F:\blog\webpack-study\webpackCode\01-安装和使用Webpack
F:\dist
Hash: 0a352db1fa065d884973
Version: webpack 4.35.3
Time: 370ms
Built at: 2019-07-11 10:19:07
    Asset        Size  Chunks             Chunk Names
bundle.js  1010 bytes       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/main.js 148 bytes {0} [built]
[1] ./src/common.js 138 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

```



打包后输出的目录结构：( 多出了一个bundle.js 文件 )

```
|-- dist
|                                   `-- bundle.js
|-- src
|   |                               `-- common.js
|   |                               `-- index.html
|                                   `-- main.js
`-- webpack.config.js

```



## 4.总结

Webpack 是一个打包模块化 JavaScript 的工具，它会从 `main.js` 出发，识别出源码中的模块化导入语句， 递归的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。 从 Webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持。从从 Webpack4 开始需要单独安装从 Webpack-CLI工具



