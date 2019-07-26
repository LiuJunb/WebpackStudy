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
