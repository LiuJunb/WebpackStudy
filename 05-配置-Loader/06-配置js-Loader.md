

# 1.Webpack4 配置JS Loader

## 1.JS兼容介绍

ECMAScript 6.0 是2015年发布的下一代 JavaScript 语言标准，它引入了**新的语法和 API** 来提升开发效率。

虽然目前部分浏览器和 Node.js 已经支持 ES6，但由于它们对 ES6 所有的标准支持不全，这导致在开发中不敢全面地使用 ES6。

通常我们需要把采用 ES6 编写的代码转换成目前已经支持良好的 ES5 代码，这包含2件事：

1. 把新的 ES6 语法用 ES5 实现，例如 ES6 的 `class` 语法用 ES5 的 `prototype` 实现，需要用到：@babel/preset-env。
2. 给新的 API 注入 polyfill ，例如项目使用 `fetch` API 时，只有注入对应的 polyfill 后，才能在低版本浏览器中正常运行，需要用到： @babel/polyfill 。



**ES6新增语法(@babel/preset-env )：**

> let     const     解构数组    解构对象    模板字符串   展开运算符  箭头函数   Class  extends   导入模块  ...

**ES6新增API( @babel/polyfill)：**

> Promise   fetch   Set  Map  WeakMap    
>
>  Array.from  Array.of   Array.prototype.fill   Array.prototype.findIndex  Array.prototype.copyWithin   Array.prototype.entries   Array.prototype.keys    Array.prototype.find    Array.prototype.values    Array.prototype.includes  
>
> String.prototype.includes     String.prototype.repeat  String.prototype.startsWith   String.prototype.endsWith  
>
> Number.EPSILON   Number.isInteger  Number.isSafeInteger   Number.isFinite   Number.isNaN() 
>
> Math.acosh  Math.hypot  Math.imul   Math.sign  Math.trunc
>
> Object.assign   ....  



## 2.Babel

[Babel](https://babeljs.io/docs/en/) 是一个JavaScript **编译器**

Babel是一个工具链，主要用于将ECMAScript 2015+代码转换为当前和旧版浏览器或环境中的向后兼容版本的JavaScript。以下是Babel可以为您做的主要事情：

- 转换语法
- 目标环境中缺少Polyfill功能（通过[@ babel / polyfill](https://babeljs.io/docs/en/babel-polyfill)）
- 源代码转换（codemods）
- 和更多！（看看这些[视频](https://babeljs.io/videos.html)的灵感）

下面是用 Babel编译器编译 JavaScript 的案例： 

```js
// Babel 编译前: ES6 箭头函数
[1, 2, 3].map((n) => n + 1);

// Babel 编译后: 箭头函数转换成es5语法的函数
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

> 有关编译器的精彩教程，请查看[超级微型编译器](https://github.com/thejameskyle/the-super-tiny-compiler)，它还解释了Babel本身如何在高级别上工作。



## 3.配置JS Loader

新建一个项目

```json
|-- package.json
|-- src
|   |       `-- common.js
|   |       `-- index.html
|           `-- main.js
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
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  },
  "dependencies": {
  }
}

```

> 1.scripts 属性里编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版
>
> 2.使用的开发依赖有：`babel-loader@8.0.0-beta.0  @babel/core  @babel/preset-env`  webpack  webpack-cli



webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: ['./src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 1.匹配 .css 结尾的文件,注意test的值不是一个字符串，而是一个正则
        exclude: /(node_modules|bower_components)/, // 2.排除这两个文件不需要打包
        // 3.使用babel-loader编译js代码
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ],
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。



main.js

```js
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
```



common.js

```js
// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法
const showHelloWorld =(content) => {
  alert(new Person().name)
}

// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法
class Person {
  constructor(){
    this.name = 'person'
  }

  testSet() {
    //3.Set Promise 和 fetch 是es6新增的API。目的是要把es6新的API 添加补丁垫片 polyfill
    let set= new Set([1,2,3])
    new Promise((resove,reject)=>{
      fetch('')
    })
  }
}

// 4.通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;
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

```
npm install webpack@4.35.3  --save-dev
npm install webpack-cli@3.3.6  --save-dev

npm install babel-loader@8.0.0-beta.0  --save-dev  // 负责把调用babel来进行代码的转换
npm install @babel/core@7.5.5  --save-dev  // babel的核心库
npm install @babel/preset-env@7.5.5  --save-dev  // 负责把es6语法的代码转换成es5

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
|   `-- main.js
`-- webpack.config.js

```

打包之后的 `bundle.js` 文件的部分内容：

```js
"./src/common.js":(function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n

// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法\nvar showHelloWorld = function showHelloWorld(content) {\n  alert(new Person().name);\n}; 
     
// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法\n\n\nvar Person =\n/*#__PURE__*/\nfunction () {\n  function Person() {\n    _classCallCheck(this, Person);\n\n    this.name = 'person';\n  }\n\n  _createClass(Person, [{\n    key: \"testSet\",\n    value: function testSet() {\n      
     
//3.Set Promise 和 fetch 是es6新增的API。目的是要把es6新的API 添加补丁垫片 polyfill\n      var set = new Set([1, 2, 3]);\n      new Promise(function (resove, reject) {\n        fetch('');\n      });\n    }\n  }]);\n\n  return Person;\n}(); // 通过 CommonJS 规范导出 showHelloWorld 函数\n\n\nmodule.exports = showHelloWorld;\n\n//# sourceURL=webpack:///./src/common.js?");

/***/ }),
```

通过上面打包后的结果可以看出：

1.箭头函数 转换成 function函数；2.class定义的类 转换成function构造函数类定义；3.新增加的API还是原样输出。所以说上面的编译后的代码还是不能直接运行在旧浏览器上，因为新增加的API旧浏览器不兼容。 



## 4.配置 Polyfill

Polyfill ： 填充工具，垫片，也可说是补丁

该[@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)模块，包括[核心的JS](https://github.com/zloirock/core-js)和一个自定义的[再生运行](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)模拟一个完整的ES2015 +环境。

这意味着您可以使用新的API:  `Promise`或`WeakMap`静态方法，如`Array.from`或`Object.assign`，实例方法一样`Array.prototype.includes`，和生成器函数（前提是你使用的[再生器](https://babeljs.io/docs/en/babel-plugin-transform-regenerator)插件）。polyfill增加了全局范围以及原生原型，就像`String`这样做。

对于 library/tool 来说，这可能太多了。如果您不需要像这样的实例方法`Array.prototype.includes`，则可以使用[transform runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)插件而不是完全污染全局范围`@babel/polyfill`。

更进一步，如果您确切知道需要填充的功能，可以直接从[core-js中获取它们](https://github.com/zloirock/core-js#commonjs)。

由于我们正在构建应用程序，我们可以安装`@babel/polyfill`：

```sh
npm install --save @babel/polyfill
```

> 请注意该`--save`选项，而不是`--save-dev`因为这是需要在源代码之前运行的polyfill。



项目中集成 @babelPolyfill 的三种方式

When used alongside [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env),

- If `useBuiltIns: 'usage'` is specified in `.babelrc` then do not include `@babel/polyfill` in either `webpack.config.js` entry array nor source. Note, `@babel/polyfill` still needs to be installed.

- If `useBuiltIns: 'entry'` is specified in `.babelrc` then include `@babel/polyfill` at the top of the entry point to your application via `require` or `import` as discussed above.

- If `useBuiltIns` key is not specified or it is explicitly set with `useBuiltIns: false` in your .babelrc, add `@babel/polyfill` directly to the entry array in your `webpack.config.js`.  like :

  > module.exports = {
  > entry: ["@babel/polyfill", "./app/js"],
  > };



因为没有在` .babelrc`文件中配置过 `useBuiltIns  `属性, 所以下面案例将采用第三种，：

webpack.config.js

```js
const path = require('path');
module.exports = {
  // 4.采用第三种集成：@babel/Polyfill  
  entry: ['@babel/polyfill', './src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 1.匹配 .css 结尾的文件,注意test的值不是一个字符串，而是一个正则
        exclude: /(node_modules|bower_components)/, // 2.排除这两个文件不需要打包
        // 3.使用babel-loader编译js代码
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        ],
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。

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
|   `-- main.js
`-- webpack.config.js

```

打包之后的 `bundle.js` 文件的部分内容：

```js
// 1.这里的代码是polyfill垫片添加的部分补丁

"./node_modules/core-js/modules/_microtask.js":(function(module, exports, __webpack_require__) {

eval("var global = __webpack_require__(/*! ./_global */ \"./node_modules/core-js/modules/_global.js\");\nvar macrotask = __webpack_require__(/*! ./_task */ \"./node_modules/core-js/modules/_task.js\").set;\nvar Observer = global.MutationObserver || global.WebKitMutationObserver;\nvar process = global.process;\n
     
   var Promise = global.Promise;\nvar isNode = __webpack_require__(/*! ./_cof */ \"./node_modules/core-js/modules/_cof.js\")(process) == 'process';\n\nmodule.exports = function () {\n  var head, last, notify;\n\n  var flush = function () {\n    var parent, fn;\n    if (isNode && (parent = process.domain)) parent.exit();\n    while (head) {\n      fn = head.fn;\n      head = head.next;\n      try {\n        fn();\n      } catch (e) {\n        if (head) notify();\n        else last = undefined;\n        throw e;\n      }\n    } last = undefined;\n    if (parent) parent.enter();\n  };\n\n  // Node.js\n  if (isNode) {\n    notify = function () {\n      process.nextTick(flush);\n    };\n  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339\n  } else if (Observer && !(global.navigator && global.navigator.standalone)) {\n    var toggle = true;\n    var node = document.createTextNode('');\n    new Observer(flush).observe(node, { characterData: true ....................?");
/***/ }),

  "./node_modules/core-js/modules/_new-promise-capability.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/_new-promise-capability.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// 25.4.1.5 NewPromiseCapability(C)\nvar aFunction = __webpack_require__(/*! ./_a-function */ \"./node_modules/core-js/modules/_a-function.js\");\n\nfunction PromiseCapability(C) {\n  var resolve, reject;\n  this.promise = new C(function ($$resolve, $$reject) {\n    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');\n    resolve = $$resolve;\n    reject = $$reject;\n  });\n  this.resolve = aFunction(resolve);\n  this.reject = aFunction(reject);\n}\n\nmodule.exports.f = function (C) {\n  return new PromiseCapability(C);\n};\n\n\n//# sourceURL=webpack:///./node_modules/core-js/modules/_new-promise-capability.js?");

/***/ }),

    
    
// 2.这里的代码是bale 转换后的输出
"./src/common.js": (function(module, exports, __webpack_require__) {
"use strict";
eval("
// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法\nvar showHelloWorld = function showHelloWorld(content) {\n  alert(new Person().name);\n}; 
     
// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法\n\n\nvar Person =\n/*#__PURE__*/\nfunction () {\n  function Person() {\n    _classCallCheck(this, Person);\n\n    this.name = 'person';\n  }\n\n  _createClass(Person, [{\n    key: \"testSet\",\n    value: function testSet() {\n      
     
//3.Set Promise 和 fetch 是es6新增的API。目的是要把es6新的API 添加补丁垫片 polyfill\n      var set = new Set([1, 2, 3]);\n      new Promise(function (resove, reject) {\n        fetch('');\n      });\n    }\n  }]);\n\n  return Person;\n}(); // 通过 CommonJS 规范导出 showHelloWorld 函数\n\n\nmodule.exports = showHelloWorld;\n\n//# sourceURL=webpack:///./src/common.js?");

/***/ }),
```



通过上面打包后的结果可以看出：

1.箭头函数 转换成 function函数；2.class定义的类 转换成function构造函数类定义；3.ES6新增加的API 垫片polyfill自定代替实现了。所以这个版本编译出来的js代码可以兼容旧版本的浏览器。



## 5.Babel 配置 Plugins

https://babeljs.io/docs/en/babel-plugin-transform-runtime

Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`。 默认情况下会被添加到每一个需要它的文件中

你可以引入 **@babel/plugin-transform-runtime** 作为一个独立模块( 简称： transform-runtime )，来避免重复引入，可以**优化打包后的代码**， 因为 `@babel/plugin-transform-runtime` 可以使编译时使用的所有**辅助代码**从这里引用，优化打包的代码。

`@babel/plugin-transform-runtime` 是 Babel 官方提供的一个插件，作用是减少冗余代码。 Babel 在把 ES6 代码转换成 ES5 代码时通常需要一些 ES5 写的辅助函数来完成新语法的实现，例如在转换 `class extent`语法时会在转换后的 ES5 代码里注入 `_extent` 辅助函数用于实现继承：

```js
function _extent(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

这会导致每个使用了 `class extent` 语法的文件都被注入重复的`_extent` 辅助函数代码，`@babel/transform-runtime` 的作用在于不把辅助函数内容注入到文件里，而是注入一条导入语句：

```js
var _extent = require('@babel/runtime/helpers/_extent');
```

这样能减小 Babel 编译出来的代码的文件大小。

同时需要注意的是由于 `@babel/plugin-transform-runtime` 注入了 `require('babel-runtime/helpers/_extent')` 语句到编译后的代码里，需要安装 `@babel/runtime` 依赖到你的项目后，代码才能正常运行。 也就是说 `@babel/plugin-transform-runtime` 和 `@babel/runtime` 需要配套使用，使用了 `@babel/plugin-transform-runtime` 后一定需要 `@babel/runtime`。



注意：

> bable 7.x 版本以后使用的是： @babel/plugin-transform-runtime  和  @babel/runtime
>
> bable 7.x 版本以前使用的是： babel-plugin-transform-runtime    和   babel-runtime



安装该插件

```json
npm install @babel/plugin-transform-runtime@7.5.5 --save-dev
npm install @babel/runtime@7.5.5 --save
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
    "@babel/plugin-transform-runtime": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "babel-loader": "^8.0.0-beta.0",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  },
  "dependencies": {
    "@babel/polyfill": "^7.4.4",
    "@babel/runtime": "^7.5.5"
  }
}

```



项目集成 ` transform-runtime`  的插件

webpack.config.js

```js

const path = require('path');
module.exports = {
  // 1.使用了垫片: 兼容新增API  
  entry: ['@babel/polyfill', './src/main.js'],
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
              ],
              // 3.优化打包的代码   
              plugins: ['@babel/transform-runtime']
            }
          }
        ],
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。



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
|   `-- main.js
`-- webpack.config.js

```



## 6.Babel-Loader参数

第一种写法：

webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
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
            // 1.Babel-Loader参数  
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: ['@babel/transform-runtime']
            }
          }
        ],
      }
    ]
  }
};
```



第二种写法：

webpack.config.js

```js
const path = require('path');
module.exports = {
  entry: ['@babel/polyfill', './src/main.js'],
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
            // 1.Babel-Loader参数  
            // options: {
            //   presets: [
            //     '@babel/preset-env'
            //   ],
            //   plugins: ['@babel/transform-runtime']
            // }
          }
        ],
      }
    ]
  }
};
```



在项目根目录新建一个：bable.config.js 文件

```
|-- dist
|   |-- bundle.js
|-- node_modules
|-- package-lock.json
|-- package.json
|-- bable.config.js
|-- src
|   |-- common.js
|   |-- index.html
|   `-- main.js
`-- webpack.config.js
```

bable.config.js

```js
module.exports = function (api) {
  api.cache(true);
  console.log(api)
  
  const presets = [ 
    '@babel/preset-env'
   ];

  const plugins = [ 
    '@babel/transform-runtime'
   ];

  return {
    presets,
    plugins
  };
}
```

或者

```js
module.exports = function (api) {
  api.cache(true);
  console.log(api)

  const presets = [ 
    [
      '@babel/preset-env',
      // 给 @bable/preset-env 添加 option 参数
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        useBuiltIns: false, // 配置 @babel/polyfill 在entry中引入
      }
    ]
   ];

  const plugins = [ 
    '@babel/transform-runtime'
   ];

  return {
    presets,
    plugins
  };
}
```



总结：

上面webpack.config.js配置中的use通过正则 `/\.js$/` 匹配所有以 `.js为后缀的 JS文件，再使用Bable-Loader 去处理。具体处理流程如下：

1. 通过 bable-loader 去调用Bable处理 JS代码的转换。
2. @babel/preset-env 会自动把ES6新的语法自动转成ES5的语法。
3. @babel/transform-runtime 可以使编译时使用的所有**辅助代码**从这里引用，优化打包的代码
4. @babel/polyfill 会自动把ES6新的API 添加垫片来兼容旧浏览器。

