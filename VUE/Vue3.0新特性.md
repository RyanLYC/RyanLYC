### Vue3.0 新特性

#### Vue3 与 Vue2 响应式原理区别

- Vue2 : Object.defineProperty
  - 对象中新增的属性没有响应性，需要 Vue.$set; Vue.set(target,key,value)实现原理
    - 非 object 报错
    - 数组：Array.prototype.splice(这个方法被重写) 手动触发响应式更新.
    - 对象：key 是否存在，存在 target[key] = value,然后 调用收集依赖 defineReactive,然后视图更新
- Vue3 : Proxy
  - es6 规范
  - 需要使用 Reflect，防止 this 指向不对。 Reflect.get(target,key,receiver)，Reflect.set(target,key,value,receiver)

#### 新生命周期

- renderTracked 页面有取值操作时(例如：插入语法{{ count }}) 触发
- renderTriggered 数据发生改变后触发 在 beforeUpdate 之前触发
- errorCaptured()监听页面错误信息 return false 不会 发送到 app.config.errorHandler 中

#### 全局配置

- 设置 app.config.globalProperties.$test ；setup 中获取 const { $test } = getCurrentInstance()

#### 异步组件

- <Suspense> 是一个内置组件，用来在组件树中协调对异步依赖的处理
- 在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。Vue 提供了 defineAsyncComponent 方法来实现此功能

#### Teleport

<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

#### 自定义 Hooks

逻辑封装

#### 优化

1. 虚拟 Dom 的重写：编译时减少运行时开销，使用更有效的代码来创建虚拟 Dom；组件独立创建虚拟 Dom，html 标签独立创建虚拟 Dom
2. 优化 Slots 生成
3. 静态提升分为静态树提升和静态属性提升
   - 静态树提升： Vue3 编译时检测到哪些是静态的节点，render 函数无需渲染这些节点从而降低渲染成本
   - 静态属性提升：vue3 打补丁的时候跳过这些属性不会改变的节点
4. 基于 Proxy 的数据响应式：Vue2 的响应式系统使用 Object.defineProperty 的 getter 和 setter。Vue3 使用 ES2015 Proxy（es6）作为其观察者模式，带来的变化如下
   - 组件实例初始化速度提高 100%，因为 proxy 就类似在对象上面装个壳，然后对数据进行拦截
   - 减少一半的内存开销，Object.defineProperty 不能监听数组的变化，需要额外重写，Object.defineProperty()只代理对象上的某个属性，需要监听所有的属性的变化，那么占用内存就会很大。
   - 不支持 IE
5. 高维护性-源码使用 TS 编写，解耦和更加模块化
6. 更好的调试支持
7. 独立的响应性模块
8. Composition API
9. 更快，体积更小
