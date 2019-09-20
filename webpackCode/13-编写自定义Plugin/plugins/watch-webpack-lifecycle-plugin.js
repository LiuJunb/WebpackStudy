const SyncHook = require('tapable').SyncHook;
/**
 * 这个插件的作用是:监控 Webpack 构建的生命周期的 plugin
 */
class WebpackLifeCyclePlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack4 以前的写法（会调用 WebpackLifeCyclePlugin 实例的 apply 方法给插件实例传入 compiler 对象）
  // apply(compiler){
  //   // 1.当依赖的文件发生变化时会触发 watch-run 事件
  //   compiler.plugin('watch-run', (watching, callback) => {
  //     console.log('============watch-run'+'============')
  //     // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  //     callback();
  //   });
  //   // 2.第一个编译完成
  //   compiler.plugin('after-compile', (stats) => {
  //     console.log('============after-compile'+'============')
  //   });
  //   // 3.确定好要输出哪些文件，执行文件输出，可以在这里获取和修改输出内容
  //   compiler.plugin('emit', (compilation, callback) => {
  //     console.log('============emit'+'============')

  //     // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  //     // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
  //       callback()
  //   });
  //   // 4.完成一次构建任务
  //   compiler.plugin('done', (stats) => {
  //     console.log('============done'+'============')
  //   });
  //   // 5.构建失败
  //   compiler.plugin('failed', (err) => {
  //     console.log('============failed'+'============')
  //   });

  // }

  // Webpack4 以后的写法 （ 会调用 ConsolePlugin 实例的 apply 方法给插件实例传入 compiler 对象）
  apply(compiler){
    let MyPlugin = 'WebpackLifeCyclePlugin'
    
    // 1.读取配置的 Entrys，为每个 Entry 实例化一个对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备。
    //  compiler.hooks.监听事件的名称.tap(插件名称，回调函数)。具体参数的可到官方API文档查看
    compiler.hooks.entryOption.tap(MyPlugin, (context, entry) => {
      console.log('============entry-option'+'============')
    });
    
    // 2.当依赖的文件发生变化时会触发 watch-run 事件
    //  compiler.hooks.监听事件的名称.tap(插件名称，回调函数)。具体参数的可到官方API文档查看
    compiler.hooks.watchRun.tapAsync(MyPlugin, (watching, callback) => {
      console.log('============watch-run'+'============')
      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      callback();
    });
    // 3.第一个编译完成
    compiler.hooks.afterCompile.tap(MyPlugin, (stats) => {
      console.log('============after-compile'+'============')
    });
    // 4.确定好要输出哪些文件，执行文件输出，可以在这里获取和修改输出内容
    compiler.hooks.emit.tapAsync(MyPlugin, (compilation, callback) => {
      console.log('============emit'+'============')

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
        callback()
    });
    // 5.完成一次构建任务
    compiler.hooks.done.tap(MyPlugin, (stats) => {
      console.log('============done'+'============')
    });
    // 6.构建失败
    compiler.hooks.failed.tap(MyPlugin, (err) => {
      console.log('============failed'+'============')
    });
    // 7.自定义一个hook
    // Within the `apply` method...
    // if (compiler.hooks.myCustomHook) throw new Error('myCustomHook Already in use');
    // compiler.hooks.myCustomHook = new SyncHook(['arg0', 'arg1', 'arg2']);

    // 8.监听自定义的hook （ 必须先监听后触发 ）
    compiler.hooks.myCustomHook.tap(MyPlugin, (a,b,c) => {
      console.log('============myCustomHook2'+'============'+a,b,c)
    });
    // 9.触发自定义的hook
    // Wherever/whenever you'd like to trigger the hook...
    compiler.hooks.myCustomHook.call('a1', 'b1', 'c1');

    
  }
}

// 导出 Plugin
module.exports = WebpackLifeCyclePlugin;