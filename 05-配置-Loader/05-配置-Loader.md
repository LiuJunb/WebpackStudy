

# 1.Webpack4 配置 Loader



## 1.Module

`module` 配置如何处理模块, 它的值是一个对象，常用的值有 `noParse 和 rules` 。其中 `noParse` 是用来指定哪些资源不需要解析，提高编译性能；`rules` 是用来定义多个规则，这些规则用来匹配对应的模块，然后给对应的模块应用指定的loader,`rules` 接收的是一个数组，数组存放的是 `rule ` 对象;

> rule 对象常用的属性：test,  use,  include,  exclude,  loader, loaders,  options,  enforce ....



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
            // 5.use是应用指定的loader，别名是 loaders
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

> use: ['style-loader', 'css-loader']  的全写是 use: [ { loader: 'style-loader' },  { loader: 'css-loader' } ]

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

index.html

```html
<html><head>
  <meta charset="UTF-8">
<!-- Webpack 中 style-loade r插入的 style 样式-->    
<style type="text/css">body {
  background-color: pink;
}</style></head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="../dist/bundle.js"></script>

</body></html>
```

总结：

Loader 可以看作是文件转换功能的翻译员，配置里的 `module.rules` 数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。

 如上配置告诉 Webpack 在遇到以 `.css` 结尾的文件时先使用 `css-loader` 读取 CSS 文件，再交给 `style-loader` 把 CSS 内容注入到 JavaScript 里。 在配置 Loader 时需要注意的是：

- `use` 属性的值需要是一个由 Loader 名称组成的数组，Loader 的执行顺序是由后到前的；

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)

## 4.配置css Loader参数

[css Loader Options 可以接收的参数：](https://webpack.js.org/loaders/css-loader/#options)

| Name                 | Type                        | Default | Description                                        |
| :------------------- | :-------------------------- | :------ | :------------------------------------------------- |
| **url**              | `{Boolean\|Function}`       | `true`  | Enable/Disable`url()` handling                     |
| **import**           | `{Boolean\|Function}`       | `true`  | Enable/Disable @import handling                    |
| **modules**          | `{Boolean\|String\|Object}` | `false` | Enable/Disable CSS Modules and setup their options |
| **sourceMap**        | `{Boolean}`                 | `false` | Enable/Disable Sourcemaps                          |
| **importLoaders**    | `{Number}`                  | `0`     | Number of loaders applied before CSS loader        |
| **localsConvention** | `{String}`                  | `asIs`  | Setup style of exported classnames                 |
| **onlyLocals**       | `{Boolean}`                 |         |                                                    |



webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        // 注意：loaders 是 use 的别名,下面的loaders也可以改成use
        loaders: [
          {
            loader: 'style-loader',
            options: {
              
            }
          },
          {
            loader: 'css-loader',
            // 给每一个 loader 传递参数  
            options: {
              url: true,
              import: true
            }
          }
        ]
      }
    ]
  }
};
```



## 5.配置 scss Loader

[SCSS](http://sass-lang.com/) 可以让你用更灵活的方式写 CSS。 它是一种 CSS 预处理器，语法和 CSS 相似，但加入了变量、逻辑、等编程元素。SCSS 又叫 SASS，区别在于 SASS 语法类似 Ruby，而 SCSS 语法类似 CSS，对于熟悉 CSS 的前端工程师来说会更喜欢 SCSS。



使用 SCSS 可以提升编码效率，但是必须把 SCSS 源代码编译成可以直接在浏览器环境下运行的 CSS 代码。 SCSS 官方提供了多种语言实现的**编译器**，由于本书更倾向于前端工程师使用的技术栈，所以主要来介绍下 [node-sass](https://github.com/sass/node-sass)。

**node-sass 编译器**核心模块是由 C++ 编写，再用 Node.js 封装了一层，以供给其它 Node.js 调用。

新建一个项目

```json
|-- package.json
|-- src
|   |       `-- common.js
|   |       `-- index.html
|   |       `-- main.scss
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
    "node-sass": "^4.12.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  }
}

```

> 1.scripts 属性里编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版
>
> 2.开发依赖了style-loader  css-loader    `node-sass  sass-loader`      webpack   webpack-cli

webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/, 
        // 注意:use 的别名 是 loaders。下面3个加载的执行顺序是 3 2 1
        use: [
          // 1.不用传递参数可以简写
          'style-loader',
          {
            loader: 'css-loader',
            // 2.给css-loader传递参数
            options: {
              url: true,
              import: true
            }
          },
          // 3.使用sass加载器
          'sass-loader'
        ], 
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。上面的use接收了3个加载器，加载器执行的顺序是：sass-loader -> css-loader -> style-loader

main.scss

```css
// 这里使用 scss 的语法，定义了一个变量
$color: pink;
body {
  background-color: $color;
}
```

main.js

```js
// 1.通过 CommonJS 规范导入 showHelloWorld 函数
const showHelloWorld = require('./common.js');
// 2.执行 showHelloWorld 函数
showHelloWorld('Webpack的安装和使用');
// 3.通过 CommonJS 规范导入 SCSS 模块
require('./main.scss');
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
npm install style-loader@0.23.1  --save-dev
npm install css-loader@3.0.0  --save-dev

npm install node-sass@4.12.0  --save-dev   // 把 scss 编译成 css
npm install sass-loader@7.1.0  --save-dev  // 加载 scss 文件，把scss文件转成commonjs模块
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
|   |-- main.scss
|   `-- main.js
`-- webpack.config.js

```

打包之后的 `index.html` 文件的部分内容：

```html
<html><head>
  <meta charset="UTF-8">
<style type="text/css">body {
  background-color: pink; }
</style></head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="../dist/bundle.js"></script>

</body></html>
```

总结：

上面webpack.config.js配置中的use通过正则 `/\.scss$/` 匹配所有以 `.scss` 为后缀的 SCSS 文件，再分别使用3个 Loader 去处理。具体处理流程如下：

1. 通过 sass-loader 把 SCSS 源码转换为 CSS 代码，再把 CSS 代码交给 css-loader 去处理。
2. css-loader 会找出 CSS 代码中的 `@import` 和 `url()` 这样的导入语句，告诉 Webpack 依赖这些资源。同时还支持 CSS Modules、压缩 CSS 等功能。处理完后再把结果交给 style-loader 去处理。
3. style-loader 会把 CSS 代码转换成字符串后，注入到 JavaScript 代码中去，通过 JavaScript 去给 DOM 增加样式。如果你想把 CSS 代码提取到一个单独的文件而不是和 JavaScript 混在一起，可以使 ExtractTextPlugin 插件。



## 6.配置PostCss Loader

[PostCSS](http://postcss.org/) 也是一个` CSS 预处理工具`，和 SCSS 不同的地方在于它通过`插件机制可以灵活的扩展其支持的特性`，而不是像 SCSS 那样语法是固定的。

 PostCSS 的用处非常多，包括给 `CSS 自动加前缀、使用下一代 CSS 语法`等，目前越来越多的人开始用它，它很可能会成为 CSS 预处理器的最终赢家。

> PostCSS 和 CSS 的关系就像 Babel 和 JavaScript 的关系，它们解除了语法上的禁锢，通过插件机制来扩展语言本身，用工程化手段给语言带来了更多的可能性。



PostCSS 全部采用 JavaScript 编写，运行在 Node.js 之上，即提供了给 JavaScript 代码调用的模块，也提供了可执行的文件。 在 PostCSS 启动时，会从目录下的 `postcss.config.js` 文件中读取所需配置，所以需要新建该文件，文件内容大致如下：

```js
module.exports = {
  plugins: [
    // 需要使用的插件列表
    require('postcss-cssnext')
  ]
}
```

> 可以使用  npm install --save-dev  postcss-cssnext



其中的 [postcss-cssnext](http://cssnext.io/) 插件可以让你使用下一代 CSS 语法编写代码，再通过 PostCSS 转换成目前的浏览器可识别的 CSS，并且该插件还包含给 CSS 自动加前缀的功能。

> 目前 Chrome 等现代浏览器已经能完全支持 cssnext 中的所有语法，也就是说按照 cssnext 语法写的 CSS 在不经过转换的情况下也能在浏览器中直接运行。

新建一个项目

```json
|-- package.json
|-- postcss.config.js
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
    "postcss-cssnext": "^3.1.0",
    "postcss-loader": "^3.0.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  }
}

```

> 1.scripts 属性里编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版
>
> 2.使用的开发依赖有：css-loader ` postcss-cssnext   postcss-loader `  style-loader  webpack  webpack-cli



postcss.config.js

```js
module.exports = {
  plugins: [
    // 需要使用的插件列表
    require('postcss-cssnext')
  ]
}
```



webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  }
};
```

`use `接收一个`数组`，`数组`中可以存放`字符串和对象`，并且use的别名是 loaders。



main.css

```css
/* 1.使用下一代 CSS 语法, 定义变量 */
:root {
  --red: red;
}
body {
  background-color:var(--red);
  /* 2.这个属性会自动添加前缀 */
  display: flex;
}
```

虽然使用 PostCSS 后文件后缀还是 .css 但这些文件必须先交给 postcss-loader 处理一遍后再交给 css-loader

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

本地安装 webpack 和 用到的loader

```
npm install webpack@4.35.3  --save-dev
npm install webpack-cli@3.3.6  --save-dev
npm install style-loader@0.23.1  --save-dev
npm install css-loader@3.0.0  --save-dev

npm install postcss-cssnext@3.1.0  --save-dev  // 插件可以让你使用下一代 CSS 语法编写代码
npm install postcss-loaderr@3.0.0  --save-dev  // 文件后缀是.css的须先交给postcss-loader处理
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
|-- postcss.config.js
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.css
|   `-- main.js
`-- webpack.config.js

```

打包之后的 `index.html` 文件的部分内容：

```html
<html><head>
  <meta charset="UTF-8">
<style type="text/css">/* 1.使用下一代 CSS 语法, 定义变量 */
body {
  background-color:red;
  /* 2.这个属性会自动添加前缀 */
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}</style></head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="../dist/bundle.js"></script>

</body></html>
```



总结：

上面webpack.config.js配置中的use通过正则 `/\.css$/` 匹配所有以 `.css` 为后缀的 SCSS 文件，再分别使用3个 Loader 去处理。具体处理流程如下：

1. 通过 postcss-loader 先处理一般 CSS 代码，再把 CSS 代码交给 css-loader 去处理。
2. css-loader 会找出 CSS 代码中的 `@import` 和 `url()` 这样的导入语句，告诉 Webpack 依赖这些资源。同时还支持 CSS Modules、压缩 CSS 等功能。处理完后再把结果交给 style-loader 去处理。
3. style-loader 会把 CSS 代码转换成字符串后，注入到 JavaScript 代码中去，通过 JavaScript 去给 DOM 增加样式。如果你想把 CSS 代码提取到一个单独的文件而不是和 JavaScript 混在一起，可以使 ExtractTextPlugin 插件。



## 7.配置js Loader



