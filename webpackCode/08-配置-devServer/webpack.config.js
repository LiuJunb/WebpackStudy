
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
        ws: true, // 2.允许代理 websockets 协议, devServer使用的协议就是 websockets
        changeOrigin: true //3.需要虚拟托管的站点要设计为true。建议设为 true，开发时大部分情况都是虚拟托管的站点
      }
    }
  }
};