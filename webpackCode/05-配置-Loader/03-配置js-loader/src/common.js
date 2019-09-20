// 1.箭头函数 和 const 是es6新的语法。目的是要把es6新的语法转成es5语法
const showHelloWorld =(content) => {
  alert(new Person().name)
  console.log(new FormData())
}

// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法
class Person {
  constructor(){
    this.name = 'person'
  }

  testSet() {
    //3.Set Promise 和 fetch 是es6新增的API。目的是要把es6新的API 添加补丁垫片 polyfill
    let set= new Set([1,2,3])
    new Promise((resove,reject)=>{
      fetch('')
    })
  }
}




// 通过 CommonJS 规范导出 showHelloWorld 函数
module.exports = showHelloWorld;