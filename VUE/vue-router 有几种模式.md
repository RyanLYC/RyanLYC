### vue-router 有 3 种路由模式：hash、history、abstract：

`hash`: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；

`history` : 依赖 HTML5 History API 和服务器配置。

`abstract` : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

#### vue中的hash模式
即地址栏 URL 中的 # 符号,这个#就是hash符号，中文名哈希符或锚点

比如这个 URL：http://www.baidu.com/#/home，hash 的值为 #/home

它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

路由的哈希模式其实是利用了window.onhashchange事件，也就是说你的url中的哈希值（#后面的值）如果有变化，就会自动调用hashchange的监听事件，在hashchange的监听事件内可以得到改变后的url，这样能够找到对应页面进行加载
```javascript 
window.addEventListener('hashchange', () => {
  // 把改变后的url地址栏的url赋值给data的响应式数据current，调用router-view去加载对应的页面
  this.data.current = window.location.hash.substr(1)
})
```

#### vue中history模式
HTML5 History Interface 中新增的两个神器 pushState() 和 replaceState() 方法（需要特定浏览器支持），用来完成 URL 跳转而无须重新加载页面，不过这种模式还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，就需要前端自己配置404页面。

pushState() 和 replaceState() 这两个神器的作用就是可以将url替换并且不刷新页面，好比挂羊头卖狗肉，http并没有去请求服务器该路径下的资源，一旦刷新就会暴露这个实际不存在的“羊头”，显示404（因为浏览器一旦刷新，就是去真正请求服务器资源）

那么如何去解决history模式下刷新报404的弊端呢，这就需要服务器端做点手脚，将不存在的路径请求重定向到入口文件（index.html），前后端联手，齐心协力做好“挂羊头卖狗肉”的完美特效

pushState方法、replaceState方法，只能导致history对象发生变化，从而改变当前地址栏的 URL，但浏览器不会向后端发送请求，也不会触发popstate事件的执行

popstate事件的执行是在点击浏览器的前进后退按钮的时候，才会被触发

```javascript
window.addEventListener('popstate', () => {
 this.data.current = window.location.pathname
})

```