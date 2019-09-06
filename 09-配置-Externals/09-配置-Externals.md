

# 1.Webpack4 配置 Externals

Externals 配置项用来告诉 Webpack 要构建的代码中使用了哪些不用被打包的模块，也就是说这些模版是外部环境提供的，Webpack 在打包时可以忽略它们。

1.有些 JavaScript 运行环境可能内置了一些全局变量或者模块，例如在你的 HTML BODY标签里通过以下代码：

```js
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
```

引入 jquery 后，全局变量 `jQuery` 就会被注入到网页的 JavaScript 运行环境里。就可以直接通过window.$来访问jQuery对象。



2.当运行环境内置了jQuery全局变量（即在body中使用script标签引入了jquery框架），如果同时又使用模块化的方式安装并使用了 jQuery（npm install jquery --save），可能这个时候就会出现重复引用框架的问题。

```js
import $ from 'jQuery';
$('body');
```

当构建后你会发现输出的 ` bundle.js` 里包含的 jQuery 库的内容，这导致 jQuery 库出现了2次，浪费加载流量，最好是  ` bundle.js`里不会包含 jQuery 库的内容。那这个时候就用用上 `Externals ` 的配置项了



简单的使用案例：

webpack.config.js

```js

const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  externals: {
    // 把导入语句里的 LJquery 替换成运行环境里的全局变量 jQuery
    LJquery: 'jQuery'
  },
};
```

## 1.模块化安装jQuery



1.新建一个项目

```js
|-- index.html
|-- node_modules
|-- package-lock.json
|-- package.json
|-- src
|   |-- common.js
|   `-- main.js
`-- webpack.config.js
```

package.json

```json
{
  "name": "testdevserver",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server",
    "build": "webpack --mode production"
  },
  "author": "liujun",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2"
  },
  "dependencies": {
    "jquery": "^3.4.1"
  }
}

```

> 1.安装HTTP服务器开发工具：
>
> `npm install  jquery@3.4.1  --save`
>
> `npm install  webpack-dev-server@3.7.2  --save-dev `
>
> 2.编写启动服务器脚本：
>
> `"dev": "webpack-dev-server"  或者  "dev": "webpack-dev-server --hot --devtool source-map"`
>
> 3.编写项目打包脚本：`"build": "webpack --mode production"`



webpack.config.js

```js


const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    // 1.指定服务的ip
    host: "localhost",

    // 2.指定服务的端口
    port: 9000,

    // 3.开发环境进行http的代理
    proxy: {
      // 匹配 url 路径的开头
      '/api': {
        // 1.路劲只要是/api开头的url都代理到下面这个网站。
        // 例如：fetch('/api/xxxx') 会代理到 https://news-at.zhihu.com/api/xxxx
        // 例如：fetch('http://localhost:9000/api/xxxx') 这种写法会代理失败
        target: 'https://news-at.zhihu.com',
        ws: true, // 2.允许代理 websockets 协议
        changeOrigin: true //3.需要虚拟托管的站点要设计为true。建议设为 true，开发时大部分情况都是虚拟托管的站点
      }
    }
  }
};
```

common.js

```js

// 导入node_modules中的jquery框架
let $ = require('jQuery')
function get(content) {
  // 2.使用jQuery的 ajax 发起网络请求
  $.ajax({
    url:"/api/4/news/latest",
    success:function(result){
       console.log('result=', result)
    },
    error:function(error){
      console.log('error=', error)
    }
  })
}
```

main.js

```js
// 1.通过 CommonJS 规范导入 get 函数
const get = require('./common.js');
// 2.执行 get 函数
get();
```

index.html

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--1.导入 Webpack 输出的 JavaScript 文件-->
<!-- <script src="../dist/main.js"></script> -->

<!--2.导入 DevServer 输出的 JavaScript 文件-->
<script src="bundle.js"></script>
</body>
</html>
```

2.启动本地HTTP服务

打开终端，在项目的根目录执行：`npm run dev` 命令,  DevServer 就启动了，这时你会看到控制台有一串日志输出： 

```json
PS F:\blog\webpack-study\webpackCode\09-配置-Externals> npm run dev

> testdevserver@1.0.0 dev F:\blog\webpack-study\webpackCode\09-配置-Externals
> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:9000/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from F:\blog\webpack-study\webpackCode\09-配
[./src/main.js] 89 bytes {main} [built]
    + 19 hidden modules
    ....
    ....
i ｢wdm｣: Compiled successfully.
```

这意味着 DevServer 启动的 HTTP 服务器监听在 `http://localhost:9000/` ，DevServer 启动后会一直驻留在后台保持运行，访问这个`http://localhost:9000/`网址你就能获取项目根目录下的 `index.html`。 用浏览器打开这个地址你会发现页面引用的 ` bundle.js `文件自动输出到了项目的根目录,   查看网页上的` bundle.js `会发现jquery框架也被打包到 ` bundle.js ` 文件中了。



3.访问 http://localhost:9000 ， 这时你会看到控制台有一串日志输出： 

```json
result= {date: "20190905", stories: Array(3), top_stories: Array(5)}
date: "20190905"
stories: (3) [{…}, {…}, {…}]
top_stories: (5) [{…}, {…}, {…}, {…}, {…}]
__proto__: Object
```



## 2. 运行环境添加全局变量jQuery

index.html

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--1.导入 Webpack 输出的 JavaScript 文件-->
<!-- <script src="../dist/main.js"></script> -->

<!-- 2.导入外部的jquery框架,全局变量 `jQuery` 就会被注入到网页的 JavaScript 运行环境里 -->
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
    
<!--3.导入 DevServer 输出的 JavaScript 文件-->
<script src="bundle.js"></script>
</body>
</html>
```



打开终端，在项目的根目录执行：`npm run dev` 命令,  DevServer 就启动了，这时你会看到控制台有一串日志输出： 

```json
PS F:\blog\webpack-study\webpackCode\09-配置-Externals> npm run dev

> testdevserver@1.0.0 dev F:\blog\webpack-study\webpackCode\09-配置-Externals
> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:9000/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from F:\blog\webpack-study\webpackCode\09-配
[./src/main.js] 89 bytes {main} [built]
    + 19 hidden modules
    ....
    ....
i ｢wdm｣: Compiled successfully.
```

这个时候运行项目还是正常，但是这个时候会导致 `jquery `库出现了2次，`第一次是body中的script标签加载，第二次是 bundle.js 中加载`，我们期望最好是  ` bundle.js`里不会包含 `jquery ` 库的内容。那这个时候就用用上 `Externals ` 的配置项了



## 2.配置-Externals

webpack.config.js

```js

const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
    
  // 指定引用的哪些模块不需要打包到 bundle.js 中  
  externals: {
    // 把导入语句里的 LJquery 替换成运行环境里的全局变量 jQuery
    LJquery: 'jQuery'
  },
    
  devServer: {
    host: "localhost",
    port: 9000,
    proxy: {
      '/api': {xx
        target: 'https://news-at.zhihu.com',
        ws: true, 
        changeOrigin: true
      }
    }
  }
};

```

commont.js

```js

// 1.导入运行环境中全局变量中的 jQuery 对象
let $ = require('LJquery')

// 2.导入node_modules中的jquery框架
// let $ = require('jQuery')

function get(content) {
  // 2.使用jQuery的 ajax 发起网络请求
  $.ajax({
    url:"/api/4/news/latest",
    success:function(result){
       console.log('result=', result)
    },
    error:function(error){
      console.log('error=', error)
    }
  })
}

// 通过 CommonJS 规范导出 get 函数
module.exports = get;
```

打开终端，在项目的根目录执行：`npm run dev` 命令,  DevServer 就启动了，这时你会看到控制台有一串日志输出： 

```json
PS F:\blog\webpack-study\webpackCode\09-配置-Externalsr> npm run dev

> testdevserver@1.0.0 dev F:\blog\webpack-study\webpackCode\09-配置-Externals
> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:9000/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from F:\blog\webpack-study\webpackCode\09-配
[./src/main.js] 89 bytes {main} [built]
    + 19 hidden modules
    ....
    ....
i ｢wdm｣: Compiled successfully.
```

这个时候运行项目还是正常，注意这个时候到运行的页面上查看 ` bundle.js`，里不会包含 `jquery ` 库的内容。



结论：

当在`webpack.config.js`中配置`Externals 项时，Externals 项用来告诉 Webpack 构建时在代码中使用了哪些不用被打包的模块。这样可以防止框架的2次引用问题，也可以实现 Webpack 打包的优化，在使用第三方库时可以直接使用cnd上的资源, 而不用打包到bundle.js中。

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







