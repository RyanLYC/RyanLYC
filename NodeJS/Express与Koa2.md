### 官网
koa2： https://koa.bootcss.com/   
express： http://expressjs.com/zh-cn/
### 脚手架
koa2: https://www.npmjs.com/package/koa-generator   
express：http://expressjs.com/zh-cn/starter/generator.html   

egg.js 基于 koa2     
nest.js 基于 expre + TS     


## Express、Koa2 之间的区别
### Handler 处理方式

Express 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求，Express 中是 Callback，每一个回调都拥有一个新的调用栈，因此你没法对一个 callback 做 try catch 捕获，你需要在 Callback 里做错误捕获，然后一层一层向外传递。  

Koa2 使用 ES7 的 Async/Await，Koa2 使用的是一个洋葱模型，它的一个特点是级联，通过 await next() 控制调用 “下游” 中间件，直到 “下游” 没有中间件且堆栈执行完毕，最终在流回 “上游” 中间件。这种方式有个优点特别是对于日志记录（请求->响应耗时统计）、错误处理支持都很完美。因为 Promise 是一种链式调用，当多个 then 链式调用中你无法提前中断，要么继续像下传递，要么 catch 抛出一个错误。对应到 Koa 这个框架也是你只能通过 await next() 来控制是否像下流转，或者抛出一个错误。

### 中间件实现机制
在 Koa 中多个异步中间件进行组合，其中一个最核心的实现是 koa-compse 这个组件，下面一步一步的进行实现。  


```javascript
const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
    console.log('第一层 - 开始')
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ----------- ${ctx.url} ----------- ${rt}`);
    console.log('第一层 - 结束')
});

// x-response-time
app.use(async (ctx, next) => {
    console.log('第二层 - 开始')
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    console.log('第二层 - 结束')
});

// response
app.use(async ctx => {
    console.log('第三层 - 开始')
    ctx.body = 'Hello World';
    console.log('第三层 - 结束')
});

app.listen(3000);
// 输出结果
第一层 - 开始
第二层 - 开始
第三层 - 开始
第三层 - 结束
第二层 - 结束
打印第一次执行的结果： GET -------- /text ------ 4ms
第一层 - 结束
```
koa2 中间件应用
```javaScript
//loginCheck.js: 
module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        // 登陆成功，需执行 await next()，以继续执行下一步
        await next()
        return
    }
    // 登陆失败，禁止继续执行，所以不需要执行 next()
    ctx.body = {
        code: -1,
        msg: '登陆失败'
    }
}
//在删除操作中使用 loginCheck.js :
router.post('/delete', loginCheck, async (ctx, next) => {
    const author = ctx.session.username
    const id = ctx.query.id
    // handleDelete() 是一个处理删除的方法，返回一个 promise
    const result = await handleDelete(id, author)

    if (result) {
        ctx.body = {
            code: 0,
            msg: '删除成功'
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '删除失败'
        }
    }
})
```


`Express` 中间件实现是基于 Callback 回调函数同步的，它不会去等待异步（Promise）完成，加上异步操作，顺序就被改变了。

与 koa2 中间件不同的是，express中间件一个接一个的顺序执行, 通常会将 response 响应写在最后一个中间件中

主要特点：

app.use 用来注册中间件
遇到 http 请求，根据 path 和 method 判断触发哪些中间件
实现 next 机制，即上一个中间件会通过 next 触发下一个中间件

```javascript
const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('第一层 - 开始')
    setTimeout(() => {
        next()
    }, 0)
    console.log('第一层 - 结束')
})

app.use((req, res, next) => {
    console.log('第二层 - 开始')
    setTimeout(() => {
        next()
    }, 0)
    console.log('第二层 - 结束')
})

app.use('/api', (req, res, next) => {
    console.log('第三层 - 开始')
    res.json({
        code: 0
    })
    console.log('第三层 - 结束')
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})

//  输出结果
第一层 - 开始
第一层 - 结束
第二层 - 开始
第二层 - 结束
第三层 - 开始
第三层 - 结束



// 去掉 setTimeout
const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log('第一层 - 开始')
    next()
    console.log('第一层 - 结束')
})

app.use((req, res, next) => {
    console.log('第二层 - 开始')
    next()
    console.log('第二层 - 结束')
})

app.use('/api', (req, res, next) => {
    console.log('第三层 - 开始')
    res.json({
        code: 0
    })
    console.log('第三层 - 结束')
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})

// 输出
第一层 - 开始
第二层 - 开始
第三层 - 开始
第三层 - 结束
第二层 - 结束
第一层 - 结束

/**
 * 可见，express 的中间件也可以形成“洋葱圈”模型，但是一般在express中不会这么做，因为 express 的 response 一般在最后一个中间件，所以其它中间件 next() 后的代码影响不到最终结果。
 */
/**
 * 可以看到express的中间件的原理就是一层层函数的嵌套，虽然最内部的函数调用res.send结束的请求，但是程序依然在运行。并且这个运行的结果也类似koa的洋葱。这里面有一点需要注意，express结束请求是在最内部函数。这很重要。
 */
```


### 响应机制

`Koa` 中数据的响应是通过 ctx.body 进行设置，注意这里仅是设置并没有立即响应，而是在所有的中间件结束之后做了响应.  

`Express` 中我们直接操作的是 res 对象，在 Koa 中是 ctx，直接 res.send() 之后就立即响应了，这样如果还想在上层中间件做一些操作是有点难的