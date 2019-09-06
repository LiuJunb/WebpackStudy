

# 1.Webpack4 制作动态链接库

## 1.动态链接库DLL

Webpack构建时接入动态链接库的思想后，**会大大提升构建速度**。 原因在于包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会在重新编译，而是直接使用动态链接库中的代码。 由于动态链接库中大多数包含的是常用的第三方模块，例如 react、react-dom，只要不升级这些模块的版本，动态链接库就不用重新编译。

> 而Externals 用来告诉 Webpack 要构建的代码中使用了哪些不用被编译打包的模块，也就是说这些模版是外部环境提供的，Webpack 在打包时可以忽略它们。Externals 配置项也可以提升构建速度



Webpack 已经内置了对动态链接库的支持，需要通过2个内置的插件接入，它们分别是：

- DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
- DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。



## 2.制作动态链接库DLL

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
    "build": "webpack --mode production",
    "dll": "webpack --mode development --config webpack_dll.config.js"
  },
  "author": "liujun",
  "license": "ISC",
    
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "babel-loader": "^8.0.0-beta.0",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  },
    
  "dependencies": {
    "jquery": "^3.4.1"
  }
}

```

> 1.分别安装了开发的依赖 和 生成的依赖包
>
> 2.编写了3个打包的脚本，dll脚本在后面会用到



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
      }
    ]
  },
};
```

common.js

```js
import $ from 'jQuery'
// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法
const showHelloWorld =(content) => {
  // 2.使用了jQuery框架
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

2.执行打包命令

打开终端，在项目的根目录执行：`npm run dev` 命令，输出如下：

```json
PS F:\blog\webpack-study\webpackCode\10-制作动态链接库> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\10-制作动态链接库
> webpack --mode development

Hash: 62b8ceaadc72c1a00db8
Version: webpack 4.35.3
Time: 825ms
Built at: 2019-09-06 14:36:23
    Asset     Size  Chunks             Chunk Names
bundle.js  315 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[0] multi ./src/main.js 28 bytes {main} [built]
[./src/common.js] 419 bytes {main} [built]
[./src/main.js] 160 bytes {main} [built]
    + 1 hidden module
```

这意味着:

​	1.打包编译花费了` 825ms` 左右;

​	2.打包的` bundle.js `大小` 315 KiB` （ jquery框架已经打包到了 bundle.js 中）

  

### 2.制作jquery动态链接库

1.在项目的根目录新建` webpack_dll.config.js `文件,  这个是 Webpack的第二个配置文件（第一个配置文件是：`webpack.config.js`），这个第二个配置文件是专门用来打包动态链接库的。那么怎么使用第二配置文件？其实跟使用第一个配置文件是一样的，即在 `webpack `指令后面是` --config` 指定配置文件的全名。

执行第二个配置文件打包动态链接库：`webpack  --config webpack_dll.config.js`

webpack_dll.config.js

```js
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把项目需要所有的 jquery 相关的放到一个单独的动态链接库
    jquery: ['jQuery'], // 例如：vue: ['vue', 'vuex', 'vue-router']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，也就是 entry 中配置的 jquery
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 jquery 来说就是 _dll_jquery
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 jquery.manifest.json 中就有 "name": "_dll_jquery"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json'),
    }),
  ],
};
```

2.生成动态链接库

打开终端，在项目的根目录执行：`npm run dll` 命令( dll这脚本在上面的package.json有定义 )，输出如下：

```json
PS F:\blog\webpack-study\webpackCode\10-制作动态链接库> npm run dll

> testjsloader@1.0.0 dll F:\blog\webpack-study\webpackCode\10-制作动态链接库
> webpack --mode development --config webpack_dll.config.js

Hash: 7e4fbb76b6ab7556fa2d
Version: webpack 4.35.3
Time: 342ms
Built at: 2019-09-06 14:51:21
        Asset     Size  Chunks             Chunk Names
jquery.dll.js  314 KiB  jquery  [emitted]  jquery
Entrypoint jquery = jquery.dll.js
[0] dll jquery 12 bytes {jquery} [built]
    + 1 hidden module
```

打包之后的项目会多出（` jquery.dll.js ` 和 ` jquery.manifest.js `两个文件）, 目录结构如下：

```json
|-- node_modules
|-- package-lock.json
|-- package.json
|-- dist
|   |-- jquery.dll.js
|   |-- jquery.manifest.js
|-- src
|   |-- index.html
|   |-- common.js
|   `-- main.js
|-- webpack_dll.config.js
`-- webpack.config.js
```

`jquery.dll.js`  里面包含 jQuery 的运行环境，大概的代码如下：

```js
var _dll_jquery =(
  function(modules) { // webpackBootstrap
   	// The module cache
   	var installedModules = {};

   	// The require function
   	function __webpack_require__(moduleId) {

   		// Check if module is in cache
   		if(installedModules[moduleId]) {
   			return installedModules[moduleId].exports;
   		}
   		// Create a new module (and put it into the cache)
   		var module = installedModules[moduleId] = {
   			i: moduleId,
   			l: false,
   			exports: {}
   		};

   		// Execute the module function
   		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

   		// Flag the module as loaded
   		module.l = true;

   		// Return the exports of the module
   		return module.exports;
   	}

   	// Load entry module and return exports
   	return __webpack_require__(__webpack_require__.s = 0);
  }
)(
  {"./node_modules/jQuery/dist/jquery.js":(function(module, exports, __webpack_require__){
      eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!\n * jQuery JavaScript Library v3.4.1\n * https://jquery.com/\n *\n * Includes Sizzle.js\n * https://sizzlejs.com/\n *\n * Copyright JS Foundation and other contributors\n * Released under the MIT license\n * https://jquery.org/license\n *\n * Date: 2019-05-01T21:04Z\n */\n( function( global, factory ) {\n\n\t\"use strict\";\n\n\tif (  true && typeof module.exports === \"object\" ) {\n\n\t\t// For CommonJS and CommonJS-like environments where a proper `window`\n\t\t// is present, execute the factory and get jQuery.\n\t\t//
           
 .........
 .........
           
For environments that do not have a `window` with a `document`\n\t\t// (such as Node.js), window is not defined yet\n} )( typeof window !== \"undefined\" ? window : this, function( window, noGlobal ) {\n\n// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1\n// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses pull/557)\n// and CommonJS for browser emulators (#13566)\nif ( !noGlobal ) {\n\twindow.jQuery = window.$ = jQuery;\n}\n\n\n\n\nreturn jQuery;\n} );\n\n\n//# sourceURL=webpack://_dll_%5Bname%5D/./node_modules/jQuery/dist/jquery.js?");
    }),

    0:(function(module, exports, __webpack_require__) {
      eval("module.exports = __webpack_require__;\n\n//# sourceURL=webpack://_dll_%5Bname%5D/dll_jquery?");
    })
  }
 );
```

可见一个动态链接库文件中包含了大量模块的代码，这些模块存放在一个对象里，用对象的key作为索引 ID。 并且还通过 `_dll_jquery` 变量把自己暴露在了全局中，也就是可以通过 `window._dll_jquery` 可以访问到它里面包含的模块



`jquery.manifest.js `文件也是由 DllPlugin 生成出，用于描述动态链接库文件中包含哪些模块, 代码如下：

```js
{
  "name":"_dll_jquery",
  "content":{
    "./node_modules/jQuery/dist/jquery.js":{
      "id":"./node_modules/jQuery/dist/jquery.js",
      "buildMeta":{
        "providedExports":true
      }
    }
  }
}
```

打包后生成的这个两个文件，后面主要还是使用 `jquery.dll.js`  这个动态链接库



## 3.使用动态链接库DLL

index.html

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 动态链接库文件 和 bundle文件-->
<script src="../dist/jquery.dll.js"></script>
<script src="../dist/bundle.js"></script>
</body>
</html>
```

webpack.config.js

```js

const path = require('path');
// 1.导入webpack内置的DllReferencePlugin插件
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

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

  plugins: [
    // 2.告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 3.描述 jquery 动态链接库的文件内容
      manifest: require('./dist/jquery.manifest.json'),
    }),
      
  ],
};
```



打开终端，在项目的根目录执行：`npm run dev` 命令, 这时你会看到控制台有一串日志输出： 

```json
PS F:\blog\webpack-study\webpackCode\10-制作动态链接库> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\10-制作动态链接库
> webpack --mode development

Hash: cfdf84d74164433fbc45
Version: webpack 4.35.3
Time: 566ms
Built at: 2019-09-06 15:16:24
    Asset      Size  Chunks             Chunk Names
bundle.js  6.02 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[0] multi ./src/main.js 28 bytes {main} [built]
[./node_modules/jQuery/dist/jquery.js] delegated ./node_modules/jQuery/dist/jquery.js from dll-reference _dll_jquery 42 bytes {main} [built]
[./src/common.js] 419 bytes {main} [built]
[./src/main.js] 160 bytes {main} [built]
[dll-reference _dll_jquery] external "_dll_jquery" 42 bytes {main} [built]
```

这意味着使用动态链接库确实提升了构建速度:

​	1.打包编译花费了` 566ms` 左右;

​	2.打包的 `bundle.js `大小` 6.02 KiB `

​	3.jquery框架没有直接打包到bundle.js中, 而是打包了引用动态链接库的代码

​	4.最后需要单独在index.html引入jquery.dll.js动态链接库



## 4.Externals VS DLL

之前讲过webpack的配置项Externals ：它也可以优化打包提升webpack的构建速度，下面使用 Externals 配置项来打包一下项目，看看性能怎么样：

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
      }
    ]
  },
  externals: {
    // 把导入语句里的 jQuery 替换成运行环境里的全局变量 jQuery
    jQuery: 'jQuery'
  },
};
```

打开终端，在项目的根目录执行：`npm run dev` 命令, 这时你会看到控制台有一串日志输出： 

```
PS F:\blog\webpack-study\webpackCode\10-制作动态链接库> npm run dev

> testjsloader@1.0.0 dev F:\blog\webpack-study\webpackCode\10-制作动态链接库
> webpack --mode development

Hash: f48148a013d5462d7132
Version: webpack 4.35.3
Time: 540ms
Built at: 2019-09-06 15:32:05
    Asset      Size  Chunks             Chunk Names
bundle.js  5.29 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[0] multi ./src/main.js 28 bytes {main} [built]
[./src/common.js] 419 bytes {main} [built]
[./src/main.js] 160 bytes {main} [built]
[jQuery] external "jQuery" 42 bytes {main} [built]
```

这意味着使用 Externals 配置项确实提升了构建速度（与DLL的构建速度差不多）:

​	1.打包编译花费了` 540ms` 左右;

​	2.打包的 `bundle.js `大小`  5.29 KiB `

​	3.jquery框架没有打包到bundle.js中（代码中import导入的jQuery其实是全局变量中的jQuery）

​	4.最后需要单独在index.html中使用 script 标签引入jquery.js 框架



结论：

1.当在`webpack.config.js`中配置`Externals` 项时，Externals 项用来告诉 Webpack 构建时代码中使用了哪些不用被打包的模块。Externals可以对`某一个第三方框架 或者 库`放到运行环境的全局变量中。例如：vue放到到运行环境的全局变量中 或者 vuex放到到运行环境的全局变量中。

2.DLL可以对`某一类第三方的框架和库`打包到一个动态库中。例如：vue-router 、vuex 、vue 等打包到一个vue.dll.js中。

3.无论是使用`Externals` 配置项还是使用`DLL动态链接库`的方式都可以提高Webpack构建速度。



[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







