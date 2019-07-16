# 1.Webpack4 配置 Loader



## 1.Module

`module` 配置如何处理模块, 它的值是一个对象，常用的值有 `noParse 和 rules` 。其中 `noParse` 是用来指定哪些资源不需要解析，提高编译性能；`rules` 是用来定义多个规则，这些规则用来匹配对应的模块，然后给对应的模块应用指定的loader,`rules` 接收的是一个数组，数组存放的是 `rule ` 对象;

> rule 对象常用的属性：test,  use,  include,  exclude,  loader,  options,  enforce ....



简单的使用案例：

```js
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  },
  // 1.Webpack 的modules模块  
  module： {
    // 2.指定哪些资源不需要解析，提高编译性能
   	noParse: () => {
      return /jquery|chartjs/.test(content);  
    },
    // 3.定义多个规则来匹配对应的模块，然后给对应的模块应用指定的loader    
    rules: [
    	{
            // 4.匹配对应的文件
            test: '/\.js$/',
            // 5.应用指定的loader
            use: [
                
            ]
            //....
            //....
        }
    ]
    
  }  
};
```



## 2.配置Loader

`rules` 配置模块的读取和解析规则，通常用来配置 Loader。其类型是一个数组，数组里每一项 Rule 都描述了如何去处理部分文件。 配置一项 `rules` 时大致通过以下方式：

1. 条件匹配：通过 `test` 、 `include` 、 `exclude` 三个配置项来命中 Loader 要应用规则的文件。
2. 应用规则：对选中后的文件通过 `use` 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时还可以分别给 Loader 传入参数。
3. 重置顺序：一组 Loader 的执行顺序默认是从右到左执行，通过 `enforce` 选项可以让其中一个 Loader 的执行顺序放到最前或者最后。

```js
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  },
  // 1.Webpack 的modules模块  
  module： {
    // 2.定义多个规则来匹配对应的模块，然后给对应的模块应用指定的loader    
    rules: [
    	{
            // 3.正则匹配对应的文件
            test: '/\.css$/',
            // 4.应用指定的loader,下面使用了两个loader，先执行css-loader
            use: [
               'style-loader', 
    		   'css-loader'
            ]
            //....
            //....
        }
    ]
    
  }  
};
```



## 3.配置css Loader

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

main.css

```css
body {
  background-color: pink;
}
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



本地安装 webpack 和 用到的loader

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

打包之后的 `bundle.js` 文件的部分内容：

```js
 (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {
 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		// Flag the module as loaded
 		module.l = true;
 		// Return the exports of the module
 		return module.exports;
 	}
 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
 })
({
  // 加载main.css样式 模块
  "./node_modules/css-loader/dist/cjs.js!./src/main.css":(function(module, exports, __webpack_require__) {

      eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"body {\\r\\n  background-color: pink;\\r\\n}\", \"\"]);\n\n\n//# sourceURL=webpack:///./src/main.css?./node_modules/css-loader/dist/cjs.js");

   }),  

  "./node_modules/css-loader/dist/runtime/api.js":(function(module, exports, __webpack_require__) {
    ......
  }),

  "./node_modules/style-loader/lib/addStyles.js":(function(module, exports, __webpack_require__) {
    .....
  }),
      
  // style-loader 添加样式
  "./node_modules/style-loader/lib/urls.js":(function(module, exports) {
    ........
 }),

  // 2.    
  "./src/common.js":(function(module, exports) {
	.....
  }),
      
  // 3.css-loader 加载样式
  "./src/main.css":(function(module, exports, __webpack_require__) {
	.....
 }),

  // 1.加载的入口文件    
  "./src/main.js":(function(module, exports, __webpack_require__) {

    eval("// 1.通过 CommonJS 规范导入 showHelloWorld 函数\r\nconst showHelloWorld = __webpack_require__(/*! ./common.js */ \"./src/common.js\");\r\n// 2.执行 showHelloWorld 函数\r\nshowHelloWorld('Webpack的安装和使用');\r\n// 3.通过 CommonJS 规范导入 CSS 模块\r\n__webpack_require__(/*! ./main.css */ \"./src/main.css\");\n\n//# sourceURL=webpack:///./src/main.js?");

  })

});
```



Loader 可以看作是文件转换功能的翻译员，配置里的 `module.rules` 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。

 如上配置告诉 Webpack 在遇到以 `.css` 结尾的文件时先使用 `css-loader` 读取 CSS 文件，再交给 `style-loader` 把 CSS 内容注入到 JavaScript 里。 在配置 Loader 时需要注意的是：

- `use` 属性的值需要是一个由 Loader 名称组成的数组，Loader 的执行顺序是由后到前的；

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)

## 4.配置css Loader参数



## 5.配置 scss Loader



## 6.配置js Loader



