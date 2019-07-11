# Webpack4 配置Entry

`entry`是配置模块的入口，可抽象成输入，Webpack 执行构建的第一步将从入口开始搜寻及递归解析出所有入口依赖的模块。

`entry` 配置是**必填的**，若不填则将导致 Webpack 报错退出。

简单的配置代码：(   在 webpack.config.js 文件下 配置  )

```js
module.exports = {
  // 1.JavaScript 执行入口文件
  entry: './src/main.js',
  .......
    
};
```



## 1.Entry的类型

Entry 类型可以是以下三种中的一种 或者 相互组合：

| 类型   | 例子                                                         | 含义                                 |
| ------ | ------------------------------------------------------------ | ------------------------------------ |
| string | `'./app/entry'`                                              | 入口模块的文件路径，可以是相对路径。 |
| array  | `['./app/entry1', './app/entry2']`                           | 入口模块的文件路径，可以是相对路径。 |
| object | `{ a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2']}` | 配置多个入口，每个入口生成一个 Chunk |

如果是 `array` 类型，则搭配 `output.library` 配置项使用时，只有数组里的最后一个入口文件的模块会被导出。



**什么是Chunk？**

Chunk是代码块的意思，Webpack在执行构建的时候，会把多个模块合并为一个文件，该文件就称为Chunk。

Webpack 会为每个生成的 Chunk 取一个名称，Chunk 的名称和 Entry 的配置有关：

- 如果 `entry` 是一个 `string` 或 `array`，就只会生成一个 Chunk，这时 Chunk 的名称是 `main`；
- 如果 `entry` 是一个 `object`，就可能会出现多个 Chunk，这时 Chunk 的名称是 `object` 键值对里键的名称。



## 2.字符串类型Entry 

新建一个项目，目录结构如下图

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

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    // 4.输出 bundle.js 文件都放到 dist 目录下
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
<script src="../dist/main.js"></script>
</body>
</html>
```



执行`webpack`命令打包后输出的目录结构：( 多出了一个main.js 文件 )

```
|-- dist
|                   `-- main.js
|-- src
|   |               `-- common.js
|   |               `-- index.html
|                   `-- main.js
`-- webpack.config.js

```

注意：

>  Webpack3执行 webpack 命令后打包出来的 main.js 文件是没有压缩的；
>
> Webpack4执行 webpack 命令打包出来的main.js文件是压缩过，想打包后的文件没压缩可执行下面命令：
>
> `webpack --mode development`  打包后没压缩
>
> `webpack --mode production`   打包后压缩
>
> `webpack`   打包后压缩



## 3.数组类型Entry

新建一个项目，目录结构如下图

```
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.js
|   `-- myjQuery.js
`-- webpack.config.js
```



`webpack.config.js` 是项目中 Webpack 的配置文件：

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: ['./src/main.js', './src/myjQuery.js'],
  output: {
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```



`main.js`是 Webpack 第一个打包入口文件:

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



`myJQuery.js` 是第二个打包入口文件：

```js
alert("我是myJQuery.js文件")
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
<script src="../dist/main.js"></script>
</body>
</html>
```



执行`webpack --mode development`命令打包后输出的目录结构：( 多出了一个main.js 文件 )

```
|-- dist
|   `-- main.js
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.js
|   `-- myjQuery.js
`-- webpack.config.js

```

查看打包后的main.js文件的简单源码代码：

```js
# 2.modules 是下面传递过来的参数 
(function(modules) { // webpackBootstrap

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
   
   // ......
   // ......
   // ......

 	// Load entry module and return exports
    # 3.使用 __webpack_require__ 去加载 index 为 0 的模块，并且返回该模块导出的内容
    # index 为 0 的模块就是 main.js 对应的文件，也就是执行入口模块
    # __webpack_require__.s 的含义是启动模块对应的 index
 	return __webpack_require__(__webpack_require__.s = 0);
 })

# 1.这个对象会被传递到上面的modules中( 在webpack3以前这个是一个数组，webpack4以后变成了对象 )
 ({

  "./src/common.js":(function(module, exports) {
    eval("\r\nfunction showHelloWorld(content) {\r\n  alert('hello world')\r\n}\r\n\r\n// 通过 CommonJS 规范导出 showHelloWorld 函数\r\nmodule.exports = showHelloWorld;\n\n//# sourceURL=webpack:///./src/common.js?");
  }),
  
  # 6.main.js加载__webpack_require__('./common.js') 
  # 7.加载完common.js后调用 showHelloWorld() 函数
  "./src/main.js":(function(module, exports, __webpack_require__) {
    eval("// 1.通过 CommonJS 规范导入 showHelloWorld 函数\r\nconst showHelloWorld = __webpack_require__(/*! ./common.js */ \"./src/common.js\");\r\n// 2.执行 showHelloWorld 函数\r\nshowHelloWorld('Webpack的安装和使用');\n\n//# sourceURL=webpack:///./src/main.js?");
  }),

  # 9.执行myjQuery.js 中的 alert 函数    
  "./src/myjQuery.js":(function(module, exports) {
    eval("alert(\"我是myJQuery.js文件\")\n\n//# sourceURL=webpack:///./src/myjQuery.js?");
  }),
      
  # 4.加载 是入口模块（因为配置了entry为数据，下面加载入口会有多个）
  0:(function(module, exports, __webpack_require__) {
     # 5.第一个入口，加载__webpack_require__('./src/main.js')
     # 8.第二个入口，加载__webpack_require__('./src/myjQuery.js') 并声明导出
    eval("__webpack_require__(/*! ./src/main.js */\"./src/main.js\");\nmodule.exports = __webpack_require__(/*! ./src/myjQuery.js */\"./src/myjQuery.js\");\n\n\n//# sourceURL=webpack:///multi_./src/main.js_./src/myjQuery.js?");
  })

});
```

上面的源码只是从打包后里抽取的核心代码，其中代码执行的顺序上面标有序号。其中entry配置为`数组和字符串的区别就是第4步加载的入口个数`。如果是数组，将会有多个加载的入口，如果为字符串将会只有一个加载的入口。



注意：

webpack3 以前 modules 接收的参数是数组；webpack4 中的 modules 接收的参数是对象；



## 4.对象类型Entry

### 1.对象简单语法

webpack.config.js` 是项目中 Webpack 的配置文件：

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件是一个对象( 全写 )
  entry: {
    main:'./src/main.js'
  },
  output: {
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

上面这种写法是下面这种写法的全写：

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件( 简写 )
  entry: './src/main.js',
  output: {
    // 4.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```



### 2.对象标准语法

> 语法：entry: {   [entryChunkName: string]: string   |   Array<string>   }

新建一个项目，目录结构如下图

```json
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.js
|   `-- myjQuery.js
`-- webpack.config.js
```



webpack.config.js` 是项目中 Webpack 的配置文件：

```js

const path = require('path');

module.exports = {
  // app  是指定入口代码块的名称（打包输出的文件默认以这个命名）
  // './src/main.js'  是加载的入口文件   
  entry: {
    app:'./src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  }
};
```

其它文件的内容和上面保持不变

执行`webpack --mode development`命令打包后输出的目录结构：( 多出了一个app.js 文件 )

```
|-- dist
|   `-- app.js
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.js
|   `-- myjQuery.js
`-- webpack.config.js
```



### 3.多页面多入口语法

webpack.config.js` 是项目中 Webpack 的配置文件：

```js

const path = require('path');

module.exports = {
  // home  是指定第一个入口代码块的名称（打包输出的文件默认以这个命名）
  // about 是指定第二个入口代码块的名称（打包输出的文件默认以这个命名）
  entry: {
    home:'./src/main.js',
    about:'./src/myjQuery.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  }
};
```

其它文件的内容和上面保持不变

执行`webpack --mode development`命令打包后输出的目录结构：( 多出了about.js  和 home.js文件 )

```
|-- dist
|   |-- about.js
|   `-- home.js
|-- src
|   |-- common.js
|   |-- index.html
|   |-- main.js
|   `-- myjQuery.js
`-- webpack.config.js
```



## 5.函数类型(动态)的Entry

entry 也可以接收一个函数，好处是在函数里面可以通过for循环可以产生：多个页面多个入口

```js
const path = require('path');

module.exports = {
  // 1.JavaScript 执行入口文件( entry是一个函数 )
  entry: () => {
    // 2.好处是这里面通过for循环可以产生：多个页面多个入口
    return {
      main:'./src/main.js'
    }
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  }
};
```

其它文件的内容和上面保持不变，这个打包后和《2.字符串类型Entry》的案例一样

[源码下载地址](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)

