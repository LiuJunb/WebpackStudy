

# 1.Webpack4 配置 DevServer 本地服务器

前面的已经介绍过如何用` webpack` 打包一个项目，细心的同学会发现，打包后想要项目运行起来必须要把打包后的项目上传到服务器中，或者静态的项目也可以在本地直接用浏览器打开。但在实际开发中可能会需要实时预览界面效果，那么这个时候就需要创建一个本地的HTTP服务器来实现实时预览项目。

然而官方提供的开发工具 [DevServer](https://webpack.js.org/configuration/dev-server/) 也可以很方便地做到项目的实时预览, 修改文件后自动刷新，Source Map 和 反向代理等功能。`DevServer `会启动一个` HTTP 服务器`用于服务网页请求，同时会帮助`启动 Webpack` ，并`接收 Webpack 发出的文件更变信号`，通过 WebSocket 协议自动刷新网页做到实时预览。

 [DevServer 服务器功能：](https://webpack.js.org/configuration/dev-server/)

1. 提供 HTTP 服务而不是使用本地文件预览
4. 支持开发环境http的反向代理
3. ......

[Webpack 原生的功能：]()

1. 监听文件的变化并自动刷新网页，做到实时预览
2. 支持 Source Map，以方便调试。
3. ......



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
  // 这个配置项是属于：DevServer 工具的配置项
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

## 1.安装 DevServer 服务器

> DevServer 开发工具的全称是：webpack-dev-server

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
  }
}

```

> 1.安装HTTP服务器开发工具：`npm install  webpack-dev-server@3.7.2  --save-dev`
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
  }
};
```

common.js

```js

function get(content) {
  console.log('111')
}

// 通过 CommonJS 规范导出 get 函数
module.exports = get;
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
PS F:\blog\webpack-study\webpackCode\08-配置-devServer> npm run dev

> testdevserver@1.0.0 dev F:\blog\webpack-study\webpackCode\08-配置-devServer
> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from F:\blog\webpack-study\webpackCode\08-配
[./src/main.js] 89 bytes {main} [built]
    + 19 hidden modules
    ....
    ....
i ｢wdm｣: Compiled successfully.
```

这意味着 DevServer 启动的 HTTP 服务器监听在 `http://localhost:8080/` ，DevServer 启动后会一直驻留在后台保持运行，访问这个`http://localhost:8080/`网址你就能获取项目根目录下的 `index.html`。 用浏览器打开这个地址你会发现页面引用的 ` bundle.js `文件自动输出到了项目的根目录，原因是 DevServer 会把 Webpack 构建出的文件保存在内存中，在要访问输出的文件时，必须通过 HTTP 服务访问。 由于 DevServer 不会理会 `webpack.config.js` 里配置的 `output.path` 属性，所以要获取 `bundle.js`的正确 URL 是 `http://localhost:8080/bundle.js`，对应的 `index.html` 应该为：`<script src="bundle.js"></script>`



## 2.配置-port和host

https://www.webpackjs.com/configuration/dev-server/#devserver-host

webpack.config.js

```js

const path = require('path');

module.exports = {
  // entry 和 output 是webpack原生配置项
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  // devServer 这个是webpack-dev-server的配置项    
  devServer: {
    // 1.指定服务的ip
    host: "localhost",
    // 2.指定服务的端口
    port: 9000,
  }
};
```

打开终端，在项目的根目录执行：`npm run dev` 命令,  DevServer 就启动了，这时你会看到控制台有一串日志输出： 

```json
PS F:\blog\webpack-study\webpackCode\08-配置-devServer> npm run dev

> testdevserver@1.0.0 dev F:\blog\webpack-study\webpackCode\08-配置-devServer
> webpack-dev-server

i ｢wds｣: Project is running at http://localhost:9000/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from F:\blog\webpack-study\webpackCode\08-配
[./src/main.js] 89 bytes {main} [built]
    + 19 hidden modules
    ....
    ....
i ｢wdm｣: Compiled successfully.
```



## 2.配置-hot

除了通过重新刷新整个网页来实现实时预览，DevServer 还有一种被称作模块热替换的刷新技术。 模块热替换能做到在不重新加载整个网页的情况下，通过将被更新过的模块替换老的模块，再重新执行一次来实现实时预览。

webpack.config.js

```js
const path = require('path');

module.exports = {
  // entry 和 output 是webpack原生配置项
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  // devServer 这个是webpack-dev-server的配置项    
  devServer: {
    // 1.指定服务的ip
    host: "localhost",
    // 2.指定服务的端口
    port: 9000,
    // 3.模块热替换特性
    hot: true
  }
};

```



## 3.配置-proxy

下面的案例是发起一个ajax请求：https://news-at.zhihu.com/api/4/news/latest 这个接口。如果没有使用代理会出现跨越的问题。那么如何配置开发环境HTTP服务器的代理呢？看下面案例代码：

common.js

```js

function get(content) {
  // 1.这个写法会devServer代理会失败。（路径不能包含：协议，ip和端口）
  // 注意：在使用 axios 时，如果开发环境 baseURL 属性的值包含：协议，ip 和 端口，将会代理失败
  // fetch('http://localhost:9000/api/4/news/latest')
  //   .then((r)=>{
  //     console.log('r=',r)
  //     return r.json()
  //   })
  //   .then((res)=>{
  //     console.log(res)
  //   })

  // 2.正确的写法
  fetch('/api/4/news/latest')
    .then((r)=>{
      console.log('r=',r)
      // 从结果提取body中的内容，并转成json格式
      return r.json()
    })
    .then((res)=>{
      console.log('res=' ,res)
    })

}

// 通过 CommonJS 规范导出 get 函数
module.exports = get;
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
  devServer: {
    // 1.指定服务的ip
    host: "localhost",

    // 2.指定服务的端口
    port: 9000,

    // 3.开发环境进行http的代理
    proxy: {
      // 匹配 url 路径的开头（注意：如果url开头包含http协议和端口会匹配失败，导致代理失败）
      '/api': {
        // 1.路劲只要是/api开头的url都代理到下面这个网站。
        // 例如：fetch('/api/xxxx') 会代理到 https://news-at.zhihu.com/api/xxxx
        // 例如：fetch('http://localhost:9000/api/xxxx') 这种写法会代理失败
        target: 'https://news-at.zhihu.com',
        ws: true, // 2.允许代理 websockets 协议，devserver使用的就是websockets协议
        changeOrigin: true //3.需要虚拟托管的站点要设计为true。建议设为 true，开发时大部分情况都是虚拟托管的站点
      }
    }
  }
};
```

> 注意：如果url开头包含http协议和端口会匹配失败，导致代理失败



结论：

当在`webpack.config.js`中配置`devServer` 项时，先要安装` webpack-dev-server`,  DevServer `会启动一个` HTTP 服务器`用于服务网页请求，同时会帮助`启动 Webpack` ，并`接收 Webpack 发出的文件更变信号`，通过 WebSocket 协议自动刷新网页做到实时预览。

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







