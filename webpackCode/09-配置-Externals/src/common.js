
// 导入node_modules中的jquery框架
let $ = require('LJquery')
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