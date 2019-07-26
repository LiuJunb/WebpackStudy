

# 1.Webpack4 配置 Plugins

Plugin 用于扩展 Webpack 功能，可以通过在构建流程里注入钩子实现，然而各种各样的 Plugin 几乎让 Webpack 可以做任何构建相关的事情。

**loader  vs plugins 区别 :**

loader 用于加载某些资源文件，它只专注于转化文件（transform）这个领域，loader运行在webpack打包之前。

plugins 用于扩展 webpack 构建的功能，而不是处理资源的加载和转换。plugins出现的目的是处理loader不能实现的事情，plugins在整个编译周期都起作用。

## 1.配置提取css的Plugins

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
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.6"
  }
}

```

> 1.scripts 属性里编写了3个脚本：其中 dev 对应的脚本是 构建测试版；其中 build对应的脚本是 构建发布版
>
> 2.增加了开发依赖：extract-text-webpack-plugin  插件

webpack.config.js

```js

const path = require('path');
// 1.导入提取css的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  // entry: './src/main.js',
  entry: {
    app: ['./src/main.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), 
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        // 2.提取模块中的css
        use: ExtractTextPlugin.extract({
          // 处理当 CSS 没有被提取的部分，即当 allChunks: false
          fallback: "style-loader",
          // 将css资源转换成一个 CSS 导出模块
          use: "css-loader"
        }),
      }
    ]
  },
  plugins: [
    // 3.提取模块中的css
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: '[id]-[name]-[hash:8].css',
    })
  ]
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
npm install style-loader@0.23.1  --save-dev
npm install css-loader@3.0.0  --save-dev

npm install extract-text-webpack-plugin@4.0.0-beta.0  --save-dev
```

在项目的根目录，执行脚本构建项目

`npm run dev`

打包后输出的结果

```json
|-- dist
|   |-- bundle.js
|   |-- app-app-7cf1481f.css
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

打包之后的 `app-app-7cf1481f.css` 文件的内容：

```css
body {
  background-color: pink;
}
```

> 注意：app-app-7cf1481f.css文件就是 extract-text-webpack-plugin 插件提取出来的

打包之后的 index.html，下面的html没有嵌入任何样式，因为样式已经单独提取到 app-app-7cf1481f.css 文件

```html
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
<div id="app"></div>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="../dist/bundle.js"></script>

</body></html>
```

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







