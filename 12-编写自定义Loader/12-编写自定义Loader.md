

# 1.Webpack4 自定义 Loader



## 1.Loader

Loader 就像是一个翻译员，能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译。

以下面处理 CSS 文件为例：

1. CSS 源代码会先交给 css-loader  处理，找出 CSS 中依赖的资源、压缩 CSS 等；
2. 把 css-loader 输出的 CSS 交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码(  JS模块 )；

简单的使用案例：

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

一个 Loader 的职责是单一的，只需要完成一种转换。

 如果一个源文件需要经历多步转换才能正常使用，就通过多个 Loader 去转换。 

在调用多个 Loader 去转换一个文件时，每个 Loader 会链式的顺序执行， 第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果会传给下一个接着处理，最后的 Loader 将处理后的最终结果返回给Webpack。



## 2.Loader的使用

下面将回顾一下CSS Loader的使用方法：

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

例如：

```js
use: ['style-loader', 'css-loader']  
	等于 
use: [{ loader:'style-loader',options:{} }, 'css-loader']
	等于 
use: [ { loader:'style-loader',options:{} }, {loader:'css-loader', options: {} } ]
```

```js
use: ['style-loader', 'css-loader']  
 	等于
loaders: ['style-loader', 'css-loader']
 	等于
loaders: ['style-loader', { loader:'css-loader', options: {} }]
```



main.css

```css
body {
  background-color: pink;
}
```

common.js

```js
function showHelloWorld(content) {
  console.log("aaaaa_xxxx")
  alert('hello world')
  console.log("bbbbb_xxxx")
}
console.log("ccccc_xxxx")
// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;
```



main.js

```js
console.log('aaaaa_xxxx')
console.log("bbbbb_xxxx")
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
// 3.通过 CommonJS 规范导入 CSS 模块
require('./main.css');
console.log("ccccc_xxxx")
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

查看打包之后的部分  bundle.js 文件

```js
.......
.......

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\r\nfunction showHelloWorld(content) {\r\n  console.log(\"aaaaa_xxxx\")\r\n  alert('hello world')\r\n  console.log(\"bbbbb_xxxx\")\r\n}\r\nconsole.log(\"ccccc_xxxx\")\r\n// 通过 CommonJS 规范导出 showHelloWorld 函数\r\nmodule.exports = showHelloWorld;\n\n//# sourceURL=webpack:///./src/common.js?");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./main.css */ \"./node_modules/css-loader/dist/cjs.js!./src/main.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}\n\n//# sourceURL=webpack:///./src/main.css?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("console.log('aaaaa_xxxx')\r\nconsole.log(\"bbbbb_xxxx\")\r\n// 1.通过 CommonJS 规范导入 showHelloWorld 函数\r\nconst showHelloWorld = __webpack_require__(/*! ./common.js */ \"./src/common.js\");\r\n// 2.执行 showHelloWorld 函数\r\nshowHelloWorld('Webpack的安装和使用');\r\n// 3.通过 CommonJS 规范导入 CSS 模块\r\n__webpack_require__(/*! ./main.css */ \"./src/main.css\");\r\nconsole.log(\"ccccc_xxxx\")\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });
```

从上面打包后的 bundle.js 可以看出 main.js  和  common.js 这两个文件中的 console.log(）控制台输出语句也被打包了，那么本地打开index.html文件，查看控制台输出如下：

```
aaaaa_xxxx
main.js:2 bbbbb_xxxx
common.js:7 ccccc_xxxx
common.js:3 aaaaa_xxxx
common.js:5 bbbbb_xxxx
main.js:9 ccccc_xxxx
```

那么如果我们在打包的时候不想打包 console.log(）控制台输出语句 怎么办呢？这个时候可以使用别人写好的插件`UglifyJsPlugin`，其实也可以自定义一个**删除 console.log()控制台输出语句** 的Loader。下面就开始演示如何自定义一个自己的 Loader

## 2.自定义Loader

一个 Loader 的职责是单一的，只需要完成一种转换。

那么下面将编写一个` console-loader` 加载器来**删除 console.log()控制台输出语句**



### 1.定义一个console-loader

1.新建一个loaders文件夹

```json
|-- dist
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- loaders
|   |   | -- console-loader.js
|   |-- common.js
|   |-- index.html
|   |-- main.css
|   `-- main.js
`-- webpack.config.js
```

2.自定义一个 console-loader

console-loader.js

```js
module.exports = function (content) {
  console.log('----------------------')
  console.log(content) // content 是每一个node的模块（就是js文件，包含其它loader自动生成的js文件）
  console.log('----------------------')
  return content;
};
```

一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。 这个导出的函数的工作就是获得处理前的原内容content，对原内容content执行处理后，返回处理后的内容。

> 上面的 console-loader 就是简单的打印出获得处理前的原内容content。



3.在webpack的配置文件使用 console-loader

webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  // 1.配置 Webpack 如何寻找 Loader
  resolveLoader:{
    // 2.去哪些目录下寻找 Loader，有先后顺序之分，先去node_modules寻找，再去./loaders/下寻找
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
        use: ['console-loader'],
      }
    ]
  }
};
```

ResolveLoader 用于配置 Webpack 如何寻找 Loader。 默认情况下只会去 `node_modules` 目录下寻找，为了让 Webpack 加载放在本地项目中的 Loader 需要修改 `resolveLoader.modules`。



4.在根目录执行打包命令：`npm run dev`， 然后控制台输出如下：

```js
PS F:\blog\webpack-study\webpackCode\12-编写自定义Loader> npm run dev

> testcssloader@1.0.0 dev F:\blog\webpack-study\webpackCode\12-编写自定义Loader
> webpack --mode development

----------------------
console.log('aaaaa_xxxx')
console.log("bbbbb_xxxx")
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
// 3.通过 CommonJS 规范导入 CSS 模块
require('./main.css');
console.log("ccccc_xxxx")
----------------------
----------------------

function showHelloWorld(content) {
  console.log("aaaaa_xxxx")
  alert('hello world')
  console.log("bbbbb_xxxx")
}
console.log("ccccc_xxxx")
// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;
----------------------
----------------------
"use strict";

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], "{").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names

。。。。。
。。。。。


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}
----------------------
----------------------

/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page
location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

        // blank or null?
        if (!css || typeof css !== "string") {
          return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	。。。。。
    。。。。。

        // send back the fixed css
        return fixedCss;
};

----------------------
```

从上面的控制台输出可以看出，自定义的 console-loader 加载器已经被执行。

控制台已经打印出所有需要处理的每一个JS模块的内容

> JS模块的内容包含：main.js 模块的内容 ， commont.js模块的内容  ,  css-loader 加载器处理css后的js模块 的内容 和  style-loader 处理css之后的js模块的内容 

### 2.实现console-loader的功能

编写一个正则来匹配每一个JS模块内容中所有的 console.log(‘’xxxx“）字符串， 如果匹配上后全部替换成空字符串

console-loader.js

```js
const loaderUtils = require('loader-utils');

// 1.是否覆盖js文件中所有console的: loader
function repalceConsole(content){
   // 2.正则来匹配 console.log() 语句
   var regex = /console.log(.+)/g
   // 3.替换 console.log() 语句为空格
   content=content.replace(regex,'')
    
  // 4.\r\n 代表时换行符号
  var pre = '// 这个注解是：console-loader 自动添加的注释\r\n'
  // 5.在每个模块内容的前面添加一行注释 pre
  return pre + content
}

module.exports = function (content) {
  console.log('----------------------')
  console.log(content) // content 是每一个node的模块（就是js文件，包含其它loader自动生成的js文件）
  console.log('----------------------')
  // return content;
  return repalceConsole(content);
};
```



在项目的根目录执行:`npm run dev` , 然后查看  bundle.js  部分的代码：

```js
。。。。。
。。。。。

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// 这个注解是：console-loader 自动添加的注释\r\n\r\nfunction showHelloWorld(content) {\r\n  \r\n  alert('hello world')\r\n  \r\n}\r\n\r\n// 通过 CommonJS 规范导出 showHelloWorld 函数\r\nmodule.exports = showHelloWorld;\n\n//# sourceURL=webpack:///./src/common.js?");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./main.css */ \"./node_modules/css-loader/dist/cjs.js!./src/main.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}\n\n//# sourceURL=webpack:///./src/main.css?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// 这个注解是：console-loader 自动添加的注释\r\n\r\n\r\n// 1.通过 CommonJS 规范导入 showHelloWorld 函数\r\nconst showHelloWorld = __webpack_require__(/*! ./common.js */ \"./src/common.js\");\r\n// 2.执行 showHelloWorld 函数\r\nshowHelloWorld('Webpack的安装和使用');\r\n// 3.通过 CommonJS 规范导入 CSS 模块\r\n__webpack_require__(/*! ./main.css */ \"./src/main.css\");\r\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });
```

细看上面 bundle.js 的代码可以发现。

1）main.js 等模块前面都自动添加了自定义注释

2）main.js 等模块中的 console.log() 语句都被替换成了空格



### 3.接收自定Loader的options参数

在webpack.config.js中使用 console-loader加载器的时候，传递一个options参数。

webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  resolveLoader:{
    // 1.去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules','./loaders/'],
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'],
      },
      {  
        test: /\.js$/,
        use:{
            loader: 'console-loader', // 2.使用自定义 console-loader
            options: { // 3.自定义 console-loader 加载器
              // 4.如果为true 就会把js中所有的console.log语法删除
              // 5.如果为false则不就会删除
              clear: true 
            }
          }
        
      }
    ]
  }
};
```



直接使用 loader-utils 工具来获取 console-loader 加载器传入的 options 参数：

console-loader.js

```js
// 1.loader-utils 是加载器的工具类
const loaderUtils = require('loader-utils');

// 2.是否覆盖js文件中所有console的: loader
function repalceConsole(content,_this){
  // 3.获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(_this);  
  console.log(options) // { clear: true }
   if(options.clear){
    var regex = /console.log(.+)/g
    content=content.replace(regex,'')
   }
  // \r\n 代表时换行符号
  var pre = '// 这个注解是：console-loader 自动添加的注释\r\n'
  return pre + content
}

module.exports = function (content) {
  console.log('----------------------')
  console.log(content) // content 是每一个node的模块（就是js文件，包含其它loader自动生成的js文件）
  console.log('----------------------')
  // 4.this 是webpack提供给加载器的上下文 loaderContext
  return repalceConsole(content, this);
};
```

在项目的根目录执行 `npm run dev` 即可使用该 console-loader 加载器处理 console.log()  的语法

















