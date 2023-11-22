### vue-router 路由模式有几种？
vue-router 有 3 种路由模式：hash、history、abstract，对应的源码如下所示：
```js
switch (mode) {
  case 'history':
	this.history = new HTML5History(this, options.base)
	break
  case 'hash':
	this.history = new HashHistory(this, options.base, this.fallback)
	break
  case 'abstract':
	this.history = new AbstractHistory(this, options.base)
	break
  default:
	if (process.env.NODE_ENV !== 'production') {
	  assert(false, `invalid mode: ${mode}`)
	}
}
```

1. hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持HTML5 History Api的浏览器；

  ` hash的原理：`
   * URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
   * hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
   * 可以通过a标签，并设置href属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用 JavaScript 来对 loaction.hash 进行赋值，改变URL的hash值；
   * 我们可以使用hashchange事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

2. history : 依赖 HTML5 History API 和服务器配置。
   `History原理：`
   * pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
   * 使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
   * history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。

3. abstract : 支持所有JavaScript运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.