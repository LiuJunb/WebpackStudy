
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
      return r.json()
    })
    .then((res)=>{
      console.log('res=' ,res)
    })

}

// 通过 CommonJS 规范导出 get 函数
module.exports = get;