const SyncHook = require('tapable').SyncHook;
/**
 * 这个插件的作用是:控制台打印项目中所用到的 plugin
 */
class ConsolePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
    this.show = options.show || true
    if(this.show === false){
      console.log('===============start===================')
      console.log('constructor.options=',options) // constructor.options= { show: true }
    }
  }

  // Webpack 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    // compiler.options 是拿到webpack.config.js配置文件中所有的配置
    let plugins = compiler.options.plugins // 获取所有的 plugins
    plugins.forEach((plugin,index)=>{
      if(this.show === false) console.log(index+') plugin=', plugin) // 0) plugin= ConsolePlugin {}
    })
    if(this.show === false) console.log('===============end===================')

    // 1.判断该 Hook 是否已经存在
    // Within the `apply` method...
    if (compiler.hooks.myCustomHook) throw new Error('myCustomHook Already in use');
    // 2.自定义 myCustomHook， ['arg0', 'arg1', 'arg2']表明触发这个myCustomHook需要传递3个参数
    compiler.hooks.myCustomHook = new SyncHook(['arg0', 'arg1', 'arg2']);
    // 3.监听 自定义 myCustomHook 的事件，如果一旦有自定义 myCustomHook事件触发将会回调下面的函数
    compiler.hooks.myCustomHook.tap('WebpackLifeCyclePlugin', (a,b,c) => {
      console.log('============myCustomHook1'+'============'+a,b,c)
    });
  }
}

// 导出 Plugin
module.exports = ConsolePlugin;