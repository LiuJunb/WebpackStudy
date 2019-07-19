

# 1.Webpack4 配置TS Loader

[TypeScript](http://www.typescriptlang.org/) 是 JavaScript 的一个超集，主要提供了类型检查系统和对 ES6 语法的支持，但不支持新的 API。 目前没有任何环境支持运行原生的 TypeScript 代码，必须通过构建把它转换成 JavaScript 代码后才能运行。

TypeScript 官方提供了能把 TypeScript 转换成 JavaScript 的编译器:`typescript` 。 你需要在当前项目根目录下新建一个用于配置编译选项的 `tsconfig.json` 文件( 不是必须的 )，编译器`typescript` `默认会读取和使用这个文件，配置文件内容大致如下：

[tsconfig.js更多的配置](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

```json
{
  "compilerOptions": {
    "module": "commonjs", // 编译出的代码采用的模块规范
    "target": "es5", // 编译出的代码采用 ES 的哪个版本
    "sourceMap": true, // 输出 Source Map 方便调试
    "importHelpers": true // 减少代码的冗余，类似：@babel/plugin-transform-runtime
  },
  "exclude": [ // 不编译这些目录里的文件
    "node_modules"
  ]
}
```

通过 `npm install  typescript -save-dev` 安装编译器到本地项目



新建一个项目

```json
|-- package.json
|-- tsconfig.js
|-- src
|   |       `-- common.ts
|   |       `-- index.html
|           `-- main.ts
`-- webpack.config.js
```



tsconfig.js  编译器的配置文件

```json
// 1.typescript 编译器的配置文件：
{
  // 2.编译的参数
  "compilerOptions": {
    "module": "commonjs", // 编译出的代码采用的模块规范
    "target": "es5", // 编译出的代码采用 ES 的哪个版本
    "sourceMap": true, // 输出 Source Map 方便调试
    "importHelpers": true // 减少代码的冗余，类似：@babel/plugin-transform-runtime
  },
  // 3.排除项 
  "exclude": [ // 不编译这些目录里的文件
    "node_modules"
  ]
}
```



package.json

```json
{
  "name": "testtsloader",
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
    "awesome-typescript-loader": "^5.2.1",
    "typescript": "^3.5.3",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  },
  "dependencies": {}
}

```

> 1.scripts 属性里编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版
>
> 2.使用的开发依赖有：`awesome-typescript-loader  typescript`  webpack   webpack-cli



webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  resolve: {
    // 执行import { showHelloWorld } from './common'; 
    // 先尝试 ts 后缀的 TypeScript 源码文件，在尝试 js 后缀 JavaScript 源码文件
    extensions: ['.ts', '.js'] 
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use:['awesome-typescript-loader']
        // 1.该 Loader 是把 TypeScript 转换成 JavaScript, 只负责新语法的转换，新增的API不会自动添加polyfill
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  devtool: 'source-map',// 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};
```

`use `接收一个`数组`，`数组`中可存放`字符串和对象`，并且use的别名是 loaders；如果不用`use`也可直写`loader`



main.ts

```js
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
import { showHelloWorld } from './common';
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
```



common.ts

```js

export const showHelloWorld = (content:string) => {
  alert('hello world')
}


// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法
class Person {
  // 定义一个变量
  private name: string
  constructor(name: string){
    this.name = 'person'
  }
  testSet() {

  }
}
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

本地安装 webpack 和 用到的loader

```json
npm install webpack@4.35.3  --save-dev
npm install webpack-cli@3.3.6  --save-dev

npm install awesome-typescript-loader@5.2.1  --save-dev // 负责 将 TS 转换成 ES5语法
npm install typescript@3.5.3  --save-dev  // 负责编译 TS 文件为 JS 文件
```



在项目的根目录，执行脚本构建项目

`npm run dev`

打包后输出的结果

```json
|-- dist
|   |-- bundle.js
|   |-- bundle.js.map
|-- node_modules
|-- package-lock.json
|-- package.json
|-- tsconfig.js
|-- src
|   |-- common.ts
|   |-- index.html
|   `-- main.ts
`-- webpack.config.js

```

打包之后的 `bundle.js` 文件的部分内容：

```js
/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.showHelloWorld = function (content) {
    alert('hello world');
};
// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = 'person';
    }
    Person.prototype.testSet = function () {
    };
    return Person;
}());


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
var common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
// 2.执行 showHelloWorld 函数
common_1.showHelloWorld('Webpack的安装和使用');


/***/ })

/******/ });
```



总结：

上面webpack.config.js配置中的use通过正则 /\.ts$/ 匹配所有以 .ts为后缀的 TS文件，再使用`awesome-typescript-loade` 去处理。具体处理流程如下：

1.通过`awesome-typescript-loade` 把 TypeScript 转换成 JavaScript( 新增的语法会转换为ES5，新增API不会 )
2.typescript  是一个编译器，把 TypeScript 转换成 JavaScript 的编译器。

