# Webpack4 配置 Output

**output** 属性告诉 webpack 在哪里输出它所创建的 *bundles*，以及如何命名这些文件，默认值为 `./dist`。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。你可以通过在配置中指定一个 `output` 字段，来配置这些处理过程。`output` 是一个 `object`，里面包含[一系列配置项](https://www.webpackjs.com/configuration/output/#output-filename)，下面分别介绍它们。

简单案例：(  webpack.config.js  )

```js
// 1.导入的 path 模块是什么，它是一个 Node.js 核心模块，用于操作文件路径
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  // 2.output 属性接收的是一个对象属性
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```



## 1.filename

**静态字符串**

`output.filename` 配置输出文件的名称，为string 类型。 如果只有一个输出文件，则可以把它写成静态不变的：

新建一个项目，目录如下：

```json
|-- src
|   |               `-- common.js
|   |               `-- index.html
|                   `-- main.js
`-- webpack.config.js

```

webpack.config.js

```js

const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    filename: 'bundle.js'
  }
};
```

其它文件的内容与上一篇博客保持不变，或者[下载源码](https://github.com/LiuJunb/WebpackStudy/tree/master/webpackCode)

`webpack --mode development`打包后的输出的结果：

```json
|-- dist
|                   `-- bundle.js
|-- src
|   |               `-- common.js
|   |               `-- index.html
|                   `-- main.js
`-- webpack.config.js
```



**借助内置变量和模板**

| 内置变量名 | 含义                       |
| ---------- | -------------------------- |
| id         | Chunk 的唯一标识，从0开始  |
| name       | Chunk 的名称               |
| hash       | Chunk 的唯一标识的 Hash 值 |
| chunkhash  | Chunk 内容的 Hash 值       |

其中 `hash` 和 `chunkhash` 的长度是可指定的，`[hash:8]` 代表取8位 Hash 值，默认是20位。

> 注意 [ExtractTextWebpackPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) 插件是使用 `contenthash` 来代表哈希值而不是 `chunkhash`， 原因在于 ExtractTextWebpackPlugin 提取出来的内容是代码内容本身而不是由一组模块组成的 Chunk。



webpack.config.js

```js
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 chunk 的 hash, 取10位  ( 默认为main.js )
    // []是模板符号，模板里面使用 name 内置变量。 
    filename: '[hash:10].js'
  }
};
```



`webpack --mode development`打包后输出：

```
|-- dist
|   |               `-- 2c86058500.js
|-- src
|   |               `-- common.js
|   |               `-- index.html
|                   `-- main.js
`-- webpack.config.js

```



## 2.chunkFilename

`output.chunkFilename` 配置**无入口**的 Chunk 在输出时的文件名称。 常见的会在运行时生成 Chunk 场景有：在使用 CommonChunkPlugin、使用 `import('path/to/module')` 动态加载等时。 

chunkFilename 和 filename 使用基本一样，内置变量也是一样



## 3.path

`output.path` 配置输出文件存放在本地的目录，**必须是 string 类型的绝对路径**。通常通过 Node.js 的 `path` 模块去获取绝对路径：

webpack.config.js

```js
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    // filename: 'bundle.js'
    filename: '[hash:10].js',
    // 2. 指定输出文件存放的目录（默认是dist目录）
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
  }
};
```



## 4.publicPath

`publicPath` 配置发布到线上资源的 URL 前缀，为string 类型。 默认值是空字符串 `''`，即使用相对路径。配置代码如下：

webpack.config.js

```js
const path = require('path');
module.exports = {
  entry: './src/main.js',
  output: {
    // 1.指定输出的文件的名称为 bundle.js ( 默认为main.js )
    // filename: 'bundle.js'
    filename: '[hash:10].js',
    // 2. 指定输出文件存放的目录（默认是dist目录）
    path: path.resolve(__dirname, './dist'), // 借助node的path模块来拼接一个绝对路径
    publicPath:'https://cdn.xxxx.com/assets/'
  }
};
```

> 1.`filename、chunkfilename、path、publicPath` 都支持字符串模版
>
> 2.`path` 和 `publicPath` 都支持字符串模版，但内置变量只有一个：`hash` 代表一次编译操作的 Hash 值。









