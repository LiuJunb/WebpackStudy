
// 1.引入components文件夹中的Button组件
let Button=require('Button')  // 改button会先到components下查找，然再到node_modules文件夹下查找导入
// Button.default ：是拿到Button的对象
console.log(Button.default)
Button.default.render()

//2.导入 http 工具类（没有配置alias的用法）
// let Http = require('./src/utils/Http')

//2.导入 http 工具类（配置alias的用法，utils === ./src/utils ）
// let Http = require('utils/Http')
Http.default.get()