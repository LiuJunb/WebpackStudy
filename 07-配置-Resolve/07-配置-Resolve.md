

# 1.Webpack4 配置 Resolve

`Webpack `在启动后会从` webpack.config.js` 配置文件中的`enter`属性指定的入口模块出发找出所有依赖的模块，Resolve 的作用就是：配置 Webpack 如何寻找模块所对应的文件。resolve 属性的值是一个对象。该对象常用的属性有： `modules、extensions、alias、...`， 其中`modules`是配置寻找模块的根目录；`extensions`是配置搜索模块的后缀名（搜索模块时按照从左往右的顺序搜索对应的后缀名模块）；`alias` 是给模块单独起一个别名。

简单的使用案例：

webpack.config.js

```js
const path = require('path');
module.exports = {
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
          ...
      }
    ]
  },
  plugins: [
    .....
  ],
      
  // 1.配置 webpack 寻找模块的规则
  resolve: { 
    modules: [ // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.json', '.jsx', '.css'], // 模块的后缀名
    alias: { // 模块别名配置，用于映射模块
       // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      'module': 'new-module',
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      'only-module$': 'new-module', 
    }
  },    
};
```



## 1.配置-modules

`resolve.modules` 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 `node_modules` 目录下寻找。 有时你的项目里会有一些模块会大量被其它模块依赖和导入，由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，就像这样 `import '../../../components/button'` 这时你可以利用 `modules` 配置项优化，假如那些被大量导入的模块都在 `./src/components` 目录下，把 `modules` 配置成

```js
resolve: {
  modules:['./src/components','node_modules']
}
```

新建一个项目

```json
|-- src
|   |-- components
|   |   `-- Button.js
|   |-- index.html
|   `-- main.js
`-- webpack.config.js
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  // 1.配置模块的查找规则
  resolve: {
    // 2.导入 require('Button')，会先在components下查找，然后再到node_modules下查找
    // 相对路径是相对于webpack.config.js文件所在的路劲  
    modules:['./src/components','node_modules']
  },

};

```

Button.js

```js
const Button = {
  render:()=>{
    console.log('我是一个 button 组件')
  }
}
export default Button
```

main.js

```js
// 1.引入components文件夹中的Button组件
let Button=require('Button')  // 改button会先到components下查找，然再到node_modules文件夹下查找导入
// Button.default ：是拿到Button的对象
console.log(Button.default)
console.log(Button.default.render())
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
<script src="../dist/main.js"></script>
</body>
</html>
```



在项目的根目录执行`webpack -mode development` , 打开index.html查看打包后的main.js文件如下

```js

// 1.引入components文件夹中的Button组件
let Button=__webpack_require__(/*! Button */ "./src/components/Button.js")  // 改button会先到components下查找，然再到node_modules文件夹下查找导入
// Button.default ：是拿到Button的对象
console.log(Button.default)
console.log(Button.default.render())
```

从这个打包后的结果可以得出结论：

当在`webpack.config.js`中配置了`resolve.modules:['./src/components','node_modules']`, 那么当你通过 `let Button=require('Button')'` 导入时，会先到components下查找，再到node_modules文件夹下查找，在components找到后会把路径替换成了 `let Button=require('./src/components/Button.js')'`



## 2.配置-extensions

上面在执行`let Button=require('Button')`的时候，为什么不用写文件的扩展名也可以导入？为什么不是`let Button=require('Button.js')`这样导入？其实这两种写法都可以。

因为在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。 `resolve.extensions`就是专门用于配置在尝试过程中用到的后缀列表，它的默认值如下：

```js
resolve: {
  extensions: ['.js', '.json']
}
```

也就是说当遇到 `require('Button')` 这样的导入语句时，Webpack 会先去寻找 `Button.js` 文件，如果该文件不存在就去寻找 `Button.json` 文件， 如果还是找不到就报错。

假如你想让 Webpack 优先使用目录下的 TypeScript 文件，可以这样配置：

```js
resolve: {
 extensions: ['.ts', '.js', '.json']
}
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  // 1.配置模块的查找规则
  resolve: {
    modules:['./src/components','node_modules'],
    // 3.导入语句没带文件后缀时,Webpack会自动带上后缀后去尝试访问文件是否存在,专门用于配置在尝试过程中用到的后缀列表
    extensions: ['.js', '.json']
  },

};

```



## 3.配置-alias

`resolve.alias` 配置项通过别名来把原导入路径映射成一个新的导入路径。例如使用以下配置：

```js
// Webpack alias 配置
resolve:{
  alias:{
    utils: './src/utils/'
  }
}
```

当你通过 `let Http = require('utils/Http')` 导入时，实际上被 `alias` 等价替换成了 `let Http = require('./src/utils/Http')`。

以上 alias 配置的含义是把导入语句里的 `utils关键字替换成 `./src/utils/`。



项目的目录结构

```
|-- src
|   |-- components
|   |   `-- Button.js
|   |-- utils
|   |   `-- Http.js
|   |-- index.html
|   `-- main.js
`-- webpack.config.js
```

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  // 1.配置模块的查找规则
  resolve: {
    // 2.导入 require('Button')，会先在components下查找，然后再到node_modules下查找
    modules:['./src/components','node_modules'],
    // 3.导入语句没带文件后缀时,Webpack会自动带上后缀后去尝试访问文件是否存在,专门用于配置在尝试过程中用到的后缀列表
    extensions: ['.js', '.json'],
    // 4.给指定的路径起一个别名,下面给 ./src/utils 路径起一个 别名叫 utils
    alias:{
      utils: './src/utils'  // key是别名，value是路径：'./src/utils/' 或者 './src/utils' 写法都可以
    }

  },

};

```

Http.js

```js
const Http = {
  get:()=>{
    console.log('发送get请求')
  }
}

export default Http
```

main.js

```js
// 1.引入components文件夹中的Button组件
let Button=require('Button')
console.log(Button.default)
Button.default.render()

//2.导入 http 工具类（没有配置alias的用法）
// let Http = require('./src/utils/Http')

//2.导入 http 工具类（配置alias的用法，utils === ./src/utils ）
// let Http = require('utils/Http')
Http.default.get()
```

结论：

当在`webpack.config.js`中配置了`resolve.alias` 配置项，就可以通过别名来把原导入路径映射成一个新的导入路径。例如： `let Http = require('utils/Http')` 导入时，实际上被 `alias` 等价替换成了 `let Http = require('./src/utils/Http')`

[源码下载](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)







