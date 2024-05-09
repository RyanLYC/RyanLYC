### vue.js 设计与实现

#### 框架设计与概述

1. 框架的设计本质上是一种权衡的艺术
   1. 命令式和声明式
      - 命令式：关注过程
        ```js
        const div = document.querySelector("#app");
        div.innerText = "hello world";
        div.addEventListener("click", () => {
          alert("ok");
        });
        ```
      - 声明式
        ```js
        <div @click="() => alert('ok')">hello world</div>
        ```
   2. 性能与可维护性的权衡
      - 结论：声明式代码的性能不优于命令式代码（命令式时间是直接修改的性能消耗，声明式找到差异的性能消耗+直接修改的性能消耗）
      - 权衡的标准 - 在保持可维护性的同时让性能损失最小
   3. 虚拟 DOM 的性能到底如何
      1. DOM 运算要比 JavaScript 计算更加消耗性能
      2. 性能对比
         1. 创建页面的性能对比 - 性能相差不大因为主要消耗是在新建所有的 DOM 元素
         2. 更新页面的性能对比 - 虚拟 DOM 操作中对 DOM 的操作更少，虚拟 DOM 经过 diff 算法只需要更新必要的 DOM，而 innerHTML 需要销毁所有的旧 DOM 并新建所有的新 DOM
      3. 最终结论：innerHTML（性能差） < 虚拟 DOM（可维护性强，性能不错） < 原生 JS（可维护性差，性能高）
   4. 运行时和编译时
      1. 纯运行时
         - 提供一个虚拟 DOM 对象，利用 Render 渲染函数把虚拟 DOM 对象直接渲染为真实 DOM
      2. 运行时 + 编译时
         - 编译时：把模版转化为虚拟 DOM 对象
         - 运行时：把虚拟 DOM 对象转化为真实 DOM
      3. 纯编译时：直接利用 Compiler 函数把模版转化为真实 DOM
2. 框架设计的核心要素都有什么
   1. 提升开发体验
   2. 控制代码体积
   3. 良好的 Tree-Shaking
   4. 输出构建产物
   5. 特征开关：**VUE_OPTIONS_API** 是一个特性开关，在 Vue.js 2 中，我们编写的组件叫作 Options API；在 Vue.js 3 中，推荐使用 Composition API 来编写代码。为了兼容 Vue.js 2，在 Vue.js 3 中仍然可以使用 Options API 的方式编写代码。但是如果明确知道自己不会使用选项 API，用户就可以使用 **VUE_OPTIONS_API** 开关来关闭该特性，这样在打包的时候 Vue.js 的这部分代码就不会包含在最终的资源中，从而减小资源体积.
   6. 错误处理:在 Vue.js 中，也可以注册统一的错误处理函数 app.config.errorHandler = () => {// 错误处理程序 }
   7. 良好的 TS 支持:使用 TS 编写代码与对 TS 类型支持友好是两件事。在编写大型框架时，想要做到完善的 TS 类型支持很不容易，可以查看 Vue.js 源码中的 runtime-core/src/apiDefineComponent.ts 文件，整个文件里真正会在浏览器中运行的代码其实只有 3 行，但是全部的代码接近 200 行，其实这些代码都是在为类型支持服务。由此可见，框架想要做到完善的类型支持，需要付出相当大的努力。
3. Vue.js 3 的设计思路是什么
   1. 声明式描述 UI
      1. 声明式 UI：模版
      2. 虚拟 DOM：JS 对象
   2. 初始渲染器：渲染虚拟 DOM
   3. 组件的本质：一组 DOM 元素的封装：一个对象 tag: MyComponent => const MyComponent = function() { return { tag:'div',props:{...},children: '6666' } } => 渲染器渲染 mountElement 渲染元素，mountComponent 渲染组件
   4. 模版的工作原理（浏览器不认识 template）
      1. 解释模版成 render 函数
      2. 通过 render 渲染为真实 DOM
   5. vue.js 是各个模块组成的有机整体

#### 响应系统

1. 响应系统的作用与实现
   1. 响应系统的设计原理
      1. 响应式数据与副作用函数 - effect 副作用函数 响应式数据
      ```js
      const obj = { test: "hello world" };
      function effect() {
        // effect 函数的执行会读取obj.text
        document.body.innerText = obj.text;
      }
      ```
      2. 响应式数据的基本实现
         1. 响应式数据实现思路：1.监听 getter 行为 2. 监听 setter 行为 3. 利用容器保存副作用函数
            - 当副作用函数 effect 执行时，会触发字段 obj.text 的读取操作 - getter：存储副作用函数
            - 当修改 obj.text 的值时，会触发字段 obj.text 的设置操作 - setter：获取副作用 effect 并执行
         2. 响应式数据实现方案：1. proxy 监听行为 2. WeakMap 保存副作用
      3. 设计一个完善的响应式系统
         - 全局变量 中 activeEffect 就是 需要执行的副作用函数 fn
         - WeakMap key Map 保存副作用;key 是 target 对象 value 是一个 Map，这 Map 的 key 是 target 对象里面的属性 value 是一个 Set 数组存放 effect 副作用函数
   2. 基于调度系统的 computed 与 watch 实现
      - 调度执行： 当数据更新，触发副作用函数重新执行时，有能力决定副作用函数 effect 的执行时机、次数以及方式;vue 中 effect 增加调度函数，scheduler(fn){ 每次 调度时将副作用函数添加到 jobQueue 队列中，再调用 flushJob 刷新队列 } flushJob 函数利用 promise.then 去执行 jobQueue 队列中的全部任务
      - 计算属性 computed 与 lazy：副作用函数在指定的时机执行
        - lazy 惰性执行 1. 为 effect 新增参数 lazy 2. 修改 effect 执行逻辑，只有参数 lazy 为 false 时 执行副作用函数
        - computed 的实现：创建 effectFn 对象的时候传入 lazy 为 true，然后 return 一个 obj 对象{ get value(){ return effectFn() } } 读取 value 的时候执行 effectFn
      - watch 的实现原理
        - 观测一个响应式数据，当数据发生变化时，通知并执行相应的回调函数
        - scheduler
        - 简单 watch 实现
        ```js
        // watch 函数接收两个参数，source 是响应式数据 cb是回调函数
        function watch(source, cb) {
          effect(
            // 触发读取操作 从而建立联系
            () => source.foo,
            {
              scheduler() {
                // 当数据变化时 调用回调函数
                cb();
              },
            }
          );
        }
        ```
   3. 过期的副作用
   ```js
   watch(obj, async (newValue, oldValue, onInvalidate) => {
     // 定义一个标志，代表当前副作用函数是否过期，默认为false，代表没有过期
     let expired = false;
     // 调用onInvalidate()函数注册一个过期回调
     onInvalidate(() => {
       //当过期时，将expired设置为true
       expired = true;
     });
     // 发送网络请求
     const res = await fetch(***)
     // 只有当该副作用函数的执行没有过期时，才执行后续操作
     if(!expired) {
      finalData = res
     }
   });
   ```
2. 非原始值（引用类型）的响应式方案
   1. Proxy：对一个对象 **基本语义**的代理。它允许我们拦截并重新定义对一个对象的基本操作；例如：obj.foo 读取属性 foo 的值；obj.foo++读取和设置属性 foo 的值 这样的代码就叫基本语义
   2. Reflect：是一个内置对象，它踢动拦截 JavaScript 操作的方法。这些方法与 proxy handler 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。
   ```js
   var obj = { x: 1 };
   Reflect.get(obj, "x"); // 1 等同于obj.x
   // 真正的作用是第三个参数：如果target对象（第一个参数）中指定了getter，receiver（第三个参数本身）则为getter调用时的this值（改变this指向）
   const p = {
     ln: "l",
     fn: "s",
     // 通过get标识符标记，可以让方法调用像属性的调用一样
     get fullName() {
       return this.ln + this.fn;
     },
   };
   const proxy = new Proxy(p, {
     // target:被代理对象
     // receiver：代理对象
     get(target, key, receiver) {
       console.log("触发了 getter");
       // return target[key]; // this.ln，this.fn 并不会触发get行为；因为this不是指向proxy 而是 p 对象
       // 修改为下面代码 可以触发三次
       return Reflect.get(target, key, receiver);
     },
   });
   console.log(proxy.fullName); // 触发一次getter行为
   ```
3. 原始值(值类型)的响应式方案
   1. ref：1. 声明原始值的响应性（proxy 不能代理简单数据类型，那么 ref 是如何监听 getter 和 setter 行为） 2. 数据访问必须使用.value
   2. ref 代理的实现
      1. 针对于非原始值的数据类型：toReactive 方法 交给 reactive 处理
      2. 针对原始值数据类型：vue 通过 get、set 函数标记符，让函数以属性调用的形式被触发
      ```js
      //伪代码实现
      class RefImpl {
        constructor(value) {
          this._value = value;
        }
        // 通过get 标记，箭筒getter行为
        get value() {
          console.log("监听到getter行为");
          return this._value;
        }
        // 通过set 标记，箭筒setter行为
        set value(newVal) {
          console.log("监听到setter行为");
        }
      }
      function ref(val) {
        return new RefImpl(val);
      }
      const count = ref(1);
      ```
   3. 关于.value: 上面代码就解释了为什么需要.value

#### 渲染器

1. 渲染器的基本实现原理
   1. 渲染器与响应系统的结合
      - 渲染器的作用：渲染真实 DOM
      - 结合响应系统： 副作用中执行渲染函数
   2. 渲染器的基本概念：渲染器与渲染函数：createRender 渲染器 return render，render 渲染函数（vnode, container）;渲染过程 1. 挂载：mount（首次渲染） 2. 打补丁：patch 包括更新节点（新节点替换旧节点）和删除节点 render(null,container)
   3. 渲染器 - 伪代码实现
   ```js
   // 伪代码实现
   const vnode = {
     type: "h1",
     children: "hello",
   };
   // 创建渲染器
   const renderer = createRenderer({
     createElement(tag) {
       // 创建元素
     },
     setElementText(el, text) {
       el.textContent = text;
     },
   });
   // 调用render函数渲染该vnode
   renderer.render(vnode, document.querySelector("#app"));
   // 增加options对象，运行环境的配置对象例如浏览器的DOM的API
   function createRenderer(options) {
     const { createElement, setElementText } = options;
     function patch(n1, n2, container) {
      if(n1&& n1.type !== n2.type){
         unmount(n1)
         n1 = null
      }
      const {type} = n2
      if(typeof type === 'string'){
         if (!n1) {
          // 如果n1不存在，意味着挂载，调用mountElement函数完成挂载
            mountElement(n2, container);
         } else {
         // n1存在 意味着打补丁
         patchElement(n1,n2)
       }
      }else if(type === Text){
         // 如果新的vnode的类型是Text 则说明vnode描述的是文本节点
         if (!n1) {
          // 如果不存在旧节点
          const el = n2.el = document.createTextNode(n2.children)
          insert(el,container)
         } else {
         // 如果旧节点存在 只需要使用新文本节点内容更新旧节点内容
         const el = n2.el = n1.el
         if(n2.children !== n1.children){
            el.nodeValue = n2.children
         }
      }
     }
     function render(vnode, container) {
       if (vnode) {
         patch(container._vnode, vnode, container);
       } else {
         if (container._vnode) {
          // container.innerHTML = "";
          unmount(container._vnode)
         }
       }
       // 旧的vnode
       container._vnode = vnode;
       return { render };
     }
   }
   function unmount(vnode){
      const parent = vnode.el.parentNode
      if(parent){
         parent.removeChild(vnode.el)
      }
   }
   function mountElement(vnode, container) {
     // 创建DOM元素
     // const el = document.createElement(vnode.type); // ***** 这里是个大问题，把浏览器的方法耦合进来了，SSR怎么办？？通过options传入环境函数 ****
     const el = vnode.el = createElement(vnode.type);
     // 处理子节点，如果子节点是字符串，代表元素具有文本节点
     if (typeof vnode.children === "string") {
       // el.textContent = vnode.children; 改为调用options传入的函数
       setElementText(el, vnode.children);
     }else if(Array.isArray(vnode.children)){
      // 如果是数组则遍历调用patch挂载
      vnode.children.forEach(child => {
         patch(null,  .child,el)
      })
     }
     container.appendChild(el);
   }
   ```
2. 挂载与更新
   1. 节点： 在 HTML DOM 中，所有事物都是节点，标签名、属性、文本、注释等
   2. 节点与属性的挂载：
      - 属性的特殊性：属性划分为 HTML Attributes（html 属性例如 id type value） 和 DOM Properties（js 属性 DOM 对象上的属性）；两者对应的属性 例如 id & el.id；两张不对应的属性例如：class & el.className；源码中根据元素来判断使用 el.type 获取 还是 el.getAttribute('type')
      - 针对 class 和 style 的特殊处理： 把下面三种都转化为字符串处理，在使用 el.className（性能更优于 setAttribute） 挂载
        - 字符串
        - 对象
        - 数组
   3. 节点卸载操作：伪代码中直接使用 container.innerHTML = "";是不严谨的。解决方法，在 vnode.el 中绑定 dom 对象,后续方便清理 dom 绑定的事件。调用 unmount 函数卸载 vnode
      1. 组件渲染，需要调用组件的 beforeUnMounted、unmounted 函数
      2. 指令处理，需要调用指令的卸载钩子函数
      3. DOM 事件，innerHTML 不会移除绑定的事件
   4. 节点事件处理(vei(vue event invokers))
      1. 原生事件 API：添加事件 addEventListener 删除事件 removeEventListener，消耗性能。事件执行的本质是《回调函数中代码的执行》
      2. vei 方案：只修改回调函数执行的内容，而不需要重新挂载事件
      ```js
      const invoker = () => {
        invoker.value();
      };
      invoker.value = () => {
        console.log("1");
      };
      el.addEventListener("click", invoker);
      // 替换事件
      invoker.value = () => {
        console.log("2");
      };
      ```
   5. 其余节点处理
      1. 文本节点
      2. 注释节点
      3. Fragment 片段。就是 template 下可以多个元素
3. diff 算法的作用
   1. 定义：当新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成更新操作，需要比较两组子节点，用于比较的算法就就做 diff 算法
   2. DOM 数量一致
   3. 新的节点数 < 旧节点数 卸载旧节点
   4. 新的节点数 > 旧节点数 挂载新节点
   5. 乱序：移动节点，增加 key 属性，永不重复且不发生变化的值
4. vue3 中的 diff 算法
   1. 相同的前置元素和后置元素
      1. 自前向后对比 ：从前面开始相同的 key 为相同节点，遇到不同的 key 停止
      2. 自后向前对比 ：从后面开始相同的 key 为相同节点，遇到不同的 key 停止
      3. 增加新节点
      4. 删除旧节点
   2. 乱序
      1. 新增节点：判断节点：存在新节点，但是不存在与之对应的旧节点：根据新节点的 key，从旧节点数组中搜索到，那么就执行打补丁操作，如果搜索不到那么就知道挂载操作
      2. 删除节点： 1.旧节点的 key 在新节点列表中找不到 2.已经更新的次数，大于需要更新的总次数时，删除剩余所有的旧节点
      3. 移动节点：
         1. 最大长递增子序列：给定一个数值序列，找到它的一个子序列，并且该子序列中的值是递增的，子序列中的元素在原序列中不一定连续
         2. 构建最长递增子序列

#### 组件化

1. 组件的实现原理
2. 异步组件与函数式组件
3. 内建组件和模块

#### 编译器

#### 服务端渲染
