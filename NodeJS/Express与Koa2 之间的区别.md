## Express、Koa2 之间的区别
### Handler 处理方式

Express 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求，Express 中是 Callback，每一个回调都拥有一个新的调用栈，因此你没法对一个 callback 做 try catch 捕获，你需要在 Callback 里做错误捕获，然后一层一层向外传递。  

Koa2 使用 ES7 的 Async/Await，Koa2 使用的是一个洋葱模型，它的一个特点是级联，通过 await next() 控制调用 “下游” 中间件，直到 “下游” 没有中间件且堆栈执行完毕，最终在流回 “上游” 中间件。这种方式有个优点特别是对于日志记录（请求->响应耗时统计）、错误处理支持都很完美。因为 Promise 是一种链式调用，当多个 then 链式调用中你无法提前中断，要么继续像下传递，要么 catch 抛出一个错误。对应到 Koa 这个框架也是你只能通过 await next() 来控制是否像下流转，或者抛出一个错误。

### 中间件实现机制
在 Koa 中多个异步中间件进行组合，其中一个最核心的实现是 koa-compse 这个组件，下面一步一步的进行实现。  

从三个函数开始做为例子开始封装一个类似于 koa-compse 的组合函数：
```javascript
async function f1(ctx, next) {
  console.log('f1 start ->');
  await next();
  console.log('f1 end <-');
}

async function f2(ctx, next) {
  console.log('f2 start ->');
  await next();
  console.log('f2 end <-');
}

async function f3(ctx) {
  console.log('f3 service...');
}
use(f1);
use(f2);
use(f3);
// 输出结果
// f1 start ->
// f2 start ->
// f3 service...
// f2 end <-
// f1 end <-
```

`Express` 中间件实现是基于 Callback 回调函数同步的，它不会去等待异步（Promise）完成，加上异步操作，顺序就被改变了。

### 响应机制

`Koa` 中数据的响应是通过 ctx.body 进行设置，注意这里仅是设置并没有立即响应，而是在所有的中间件结束之后做了响应.  

`Express` 中我们直接操作的是 res 对象，在 Koa 中是 ctx，直接 res.send() 之后就立即响应了，这样如果还想在上层中间件做一些操作是有点难的