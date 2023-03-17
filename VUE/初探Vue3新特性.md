### RFC 机制
Vue 3 的第一个新特性和代码无关，而是 Vue 团队开发的工作方式。  
Vue 3 正在讨论中的新需求，任何人都可以围观、参与讨论和尝试实现.[https://github.com/vuejs/rfcs](https://github.com/vuejs/rfcs)

### 响应式系统
Vue 2 的响应式机制是基于 Object.defineProperty() 这个 API 实现对数据的读写进行拦截，但是 defineProperty 是拦截具体某个属性。  
Proxy 才是真正的“代理”  
```javascript

Object.defineProperty(obj, 'title', {
  get() {},
  set() {},
})
// 当项目里“读取 obj.title”和“修改 obj.title”的时候被 defineProperty 拦截，但 defineProperty 对不存在的属性无法拦截，所以 Vue 2 中所有数据必须要在 data 里声明。而且，如果 title 是一个数组的时候，对数组的操作，并不会改变 obj.title 的指向，虽然我们可以通过拦截.push 等操作实现部分功能，但是对数组的长度的修改等操作还是无法实现拦截，所以还需要额外的 $set 等 API。
```
```javascript

new Proxy(obj, {
  get() { },
  set() { },
})
// Proxy 拦截 obj 这个数据，但 obj 具体是什么属性，Proxy 则不关心，统一都拦截了。而且 Proxy 还可以监听更多的数据格式，比如 Set、Map，这是 Vue 2 做不到的。
// Proxy 存在一些兼容性问题，这也是为什么 Vue 3 不兼容 IE11 以下的浏览器的原因，还好现在 IE 用的人不多了。
```

### 自定义渲染器
Vue 2 内部所有的模块都是揉在一起的，这样做会导致不好扩展的问题。  
Vue 3 是怎么解决这个问题的呢？那就是拆包，使用最近流行的 monorepo 管理方式，响应式、编译和运行时全部独立了，变成下图所示的模样：  
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/vue3.png)  
Vue 3 的组织架构中，响应式独立了出来。

### 全部模块使用 TypeScript 重构
类型系统带来了更方便的提示，并且让我们的代码能够更健壮。  

### Composition API 组合语法  

### 新的组件
Vue 3 还内置了 Fragment、Teleport 和 Suspense 三个新组件。
* Fragment: Vue 3 组件不再要求有一个唯一的根节点，清除了很多无用的占位 div。
* Teleport: 允许组件渲染在别的元素内，主要开发弹窗组件的时候特别有用。
* Suspense: 异步组件，更方便开发有异步请求的组件。

### 新一代工程化工具 Vite