const loaderUtils = require('loader-utils');

// 1.是否覆盖js文件中所有console的: loader
function repalceConsole(content,_this){
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(_this);  
  console.log(options) // { clear: true }
   if(options.clear){
    var regex = /console.log(.+)/g
    content=content.replace(regex,'')
   }
  // \r\n 代表时换行符号
  var pre = '// 这个注解是：console-loader 自动添加的注释\r\n'
  return pre + content
}

module.exports = function (content) {
  console.log('----------------------')
  console.log(content) // content 是每一个node的模块（就是js文件，包含其它loader自动生成的js文件）
  console.log('----------------------')
  // this 是webpack提供给加载器的上下文 loaderContext
  return repalceConsole(content, this);
};