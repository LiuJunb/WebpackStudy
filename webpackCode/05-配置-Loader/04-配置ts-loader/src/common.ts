
export const showHelloWorld = (content:string) => {
  alert('hello world')
}


// 2.class 定义类也是es6新的语法。目的是要把es6新的语法转成es5语法
class Person {
  // 定义一个变量
  private name: string
  constructor(name: string){
    this.name = 'person'
  }
  testSet() {

  }
}