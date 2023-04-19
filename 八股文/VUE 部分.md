#### 1. Vue 的基本原理
当 一 个 Vue 实 例 创 建 时 ， Vue 会 遍 历 data 中 的 属 性 ， 用Object.defineProperty （ vue3.0 使 用 proxy ） 将 它 们 转 为getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

#### 2. 双向数据绑定的原理
Vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。   
主要分为以下几个步骤：    
1. 需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化   
2. compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是: 1.在自身实例化时往属性订阅器(dep)里面添加自己 2.自身必须有一个 update()方法 3.待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调，则功成身退。
4. MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input)-> 数据 model 变更的双向绑定效果。    
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/vue-model.png)

#### 3. MVVM、MVC、MVP 的区别
MVC、MVP 和 MVVM 是三种常见的软件架构设计模式，主要通过分离关注点的方式来组织代码结构，优化开发效率。   
在开发单页面应用时，往往一个路由页面对应了一个脚本文件，所有的页面逻辑都在一个脚本文件里。页面的渲染、数据的获取，对用户事件的响应所有的应用逻辑都混合在一起，这样在开发简单项目时，可能看不出什么问题，如果项目变得复杂，那么整个文件就会变得冗长、混乱，这样对项目开发和后期的项目维护是非常不利的。   
1. MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新.    
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/MVC.png)

2. MVVM 分为 Model、View、ViewModel：Model 代表数据模型，数据和业务逻辑都在 Model 层中定义；View 代表 UI 视图，负责数据的展示；ViewModel 负责监听 Model 中数据的改变并且控制视图的更新，处理用户交互操作；Model 和 View 并无直接关联，而是通过 ViewModel 来进行联系的，Model 和 ViewModel 之间有着双向数据绑定的联系。因此当 Model 中
的数据改变时会触发 View 层的刷新，View 中由于用户交互操作而改变的数据也会在 Model 中同步。这种模式实现了 Model 和 View 的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作 DOM.   
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/MVVM.png)

3. MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在MVC 模式中使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的 Controller 只知道Model 的接口，因此它没有办法控制 View 层的更新，MVP 模式中，View 层的接口暴露给了 Presenter 因此可以在 Presenter 中将Model 的变化和 View 的变化绑定在一起，以此来实现 View 和Model 的同步更新。这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。

#### 4. slot 是什么？有什么作用？原理是什么？
slot 又名插槽，是 Vue 的内容分发机制，组件内部的模板引擎使用slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。slot 又分三类，默认插槽，具名插槽和作用域插槽。   
* 默认插槽：又名匿名插槽，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。    
* 具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。   
* 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。    

`实现原理：`当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 vm.$slot 中，默认插槽为 vm.$slot.default，具名插槽为 vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到 slot 标签，使用$slot 中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

#### 5. $nextTick 原理及作用
Vue 的 nextTick 其本质是对 JavaScript 执行原理 EventLoop 的一种应用。   
nextTick 的 核 心 是 利 用 了 如 Promise 、 MutationObserver 、setImmediate、setTimeout 的原生 JavaScript 方法来模拟对应的微/宏任务的实现，本质是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。   
nextTick 不仅是 Vue 内部的异步队列的调用方法，同时也允许开发者在实际项目中使用这个方法来满足实际应用中对 DOM 更新数据时机的后续逻辑处理   

nextTick 是典型的将底层 JavaScript 执行原理应用到具体案例中的示例，引入异步更新队列机制的原因∶   

如果是同步更新，则多次对一个或多个属性赋值，会频繁触发 UI/DOM的渲染，可以减少一些无用渲染   

同时由于 VirtualDOM 的引入，每一次状态发生变化后，状态变化的信号会发送给组件，组件内部使用 VirtualDOM 进行计算得出需要更新的具体的 DOM 节点，然后对 DOM 进行更新操作，每次更新状态后的渲染过程需要更多的计算，而这种无用功也将浪费更多的性能，所以异步渲染变得更加至关重要     

Vue 采用了数据驱动视图的思想，但是在一些情况下，仍然需要操作DOM。有时候，可能遇到这样的情况，DOM1 的数据发生了变化，而 DOM2需要从 DOM1 中获取数据，那这时就会发现 DOM2 的视图并没有更新，这时就需要用到了 nextTick 了。由于 Vue 的 DOM 操作是异步的，所以，在上面的情况中，就要将 DOM2获取数据的操作写在$nextTick 中。所以，在以下情况下，会用到 nextTick：
在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的 DOM 结构的时候，这个操作就需要方法在 nextTick()的回调函数中。在 vue 生命周期中，如果在 created()钩子进行 DOM 操作，也一定要放在 nextTick()的回调函数中。因为在 created()钩子函数中，页面的 DOM 还未渲染，这时候也没办法操作 DOM，所以，此时如果想要操作 DOM，必须将操作的代码放在nextTick()的回调函数中。

#### 6. Vue 单页应用与多页应用的区别
1. 概念：  
* SPA 单页面应用（SinglePage Web Application），指只有一个主页面的应用，一开始只需要加载一次 js、css 等相关资源。所有内容都包含在主页面，对每一个功能模块组件化。单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
* MPA 多页面应用 （MultiPage Application），指有多个独立页面的应用，每个页面必须重复加载 js、css 等相关资源。多页应用跳转，需要整页资源刷新。      
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/MS.png)

#### 7. Vue 中封装的数组方法有哪些，其如何实现页面更新
在 Vue 中，对响应式处理利用的是 Object.defineProperty 对数据进行拦截，而这个方法并不能监听到数组内部变化，数组长度变化，数组的截取变化等，所以需要对这些操作进行 hack，让 Vue 能监听到其中的变化。
push(),pop(),shift(),unshift(),splice(),sort(),reverse()   
```javascript
// 缓存数组原型
const arrayProto = Array.prototype;
// 实现 arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(arrayProto);
// 需要进行功能拓展的方法
const methodsToPatch = [
 "push",
 "pop",
 "shift",
 "unshift",
 "splice",
 "sort",
 "reverse"
];
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function(method) {
 // 缓存原生数组方法
 const original = arrayProto[method];
 def(arrayMethods, method, function mutator(...args) {
 // 执行并缓存原生数组功能
 const result = original.apply(this, args);
 // 响应式处理
 const ob = this.__ob__;
 let inserted;
 switch (method) {
 // push、unshift会新增索引，所以要手动observer
 case "push":
 case "unshift":
 inserted = args;
 break;
 // splice方法，如果传入了第三个参数，也会有索引加入，也要手动observer。
 case "splice":
 inserted = args.slice(2);
 break;
 }
 //
 if (inserted) ob.observeArray(inserted);// 获取插入的值，并设置响应式监听
 // notify change
 ob.dep.notify();// 通知依赖更新
 // 返回原生数组方法的执行结果
 return result;
 });
});
```
简单来说就是，重写了数组中的那些原生方法，首先获取到这个数组的__ob__，也就是它的Observer对象，如果 有新的值，就调用observeArray继续对新的值观察变化（也就是通过 target__proto__ == arrayMethods 来 改变了数组实例的型），然后手动调用notify，通知渲染watcher，执行update。

#### 8. Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗？
不会立即同步执行重新渲染。Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。Vue 在更新DOM 时是异步执行的。只要侦听到数据变化， Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环 tick 中，Vue 刷新队列并执行实际（已去重的）工作。

#### 9. 简述 mixin、extends 的覆盖逻辑
mixin 和 extends 均是用于合并、拓展组件的，两者均通过mergeOptions 方法实现合并。   
* mixins 接收一个混入对象的数组，其中混入对象可以像正常的实例对象一样包含实例选项，这些选项会被合并到最终的选项中。Mixin钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。    
* extends 主要是为了便于扩展单文件组件，接收一个对象或构造函数。    
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/mixin.jpeg)   

mergeOptions 的执行过程-规范化选项（normalizeProps、normalizelnject、normalizeDirectives)对未合并的选项，进行判断   
```javascript
if(!child._base) {
    if(child.extends) {
        parent = mergeOptions(parent, child.extends, vm)
    }
    if(child.mixins) {
        for(let i = 0, l = child.mixins.length; i < l; i++){
            parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
}
```
合并处理。根据一个通用 Vue 实例所包含的选项进行分类逐一判断合并，如 props、data、 methods、watch、computed、生命周期等，将合并结果存储在新定义的 options 对象里。返回合并结果 options。

#### 10. 子组件可以直接改变父组件的数据吗？
子组件不可以直接改变父组件的数据。这样做主要是为了维护父子组件的单向数据流。每次父级组件发生更新时，子组件中所有的 prop都将会刷新为最新的值。      
如果这样做了，Vue 会在浏览器的控制台中发出警告。    
Vue 提倡单向数据流，即父级 props 的更新会流向子组件，但是反过来则不行。这是为了防止意外的改变父组件状态，使得应用的数据流变得难以理解，导致数据流混乱。如果破坏了单向数据流，当应用
复杂时，debug 的成本会非常高。只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

#### 11. 对 React 和 Vue 的理解，它们的异同
`相似之处`：   
都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库；   
都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板；   
都使用了 Virtual DOM（虚拟 DOM）提高重绘性能；    
都有 props 的概念，允许组件间的数据传递；    
都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性。     
`不同之处` ：   
1. 数据流- Vue 默认支持数据双向绑定，而 React 一直提倡单向数据流
2. 虚拟 DOM - Vue2.x 开始引入"Virtual DOM"，消除了和 React 在这方面的差异，但是在具体的细节还是有各自的特点。Vue 宣称可以更快地计算出 Virtual DOM 的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。对于 React 而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate 这个生命周期方法来进行控制，但 Vue 将此视为默认的优化。
3. 组件化 - React 与 Vue 最大的不同是模板的编写。Vue 鼓励写近似常规 HTML 的模板。写起来很接近标准 HTML 元素，只是多了一些属性。React 推荐你所有的模板通用 JavaScript 的语法扩展——JSX 书写。具体来讲：React 中 render 函数是支持闭包特性的，所以 import 的组件在 render 中可以直接调用。但是在 Vue 中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 一个组件完了之后，还需要在 components 中再声明下。
4. 监听数据变化的实现原理不同 - Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能；React 默 认 是 通 过 比 较 引 用 的 方 式 进 行 的 ， 如 果 不 优 化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM 的重新渲染。这是因为 Vue 使用的是可变数据，而 React 更强调数据的不可变。
5. 高阶组件 - react 可以通过高阶组件（HOC）来扩展，而 Vue 需要通过 mixins 来扩展。     
`高阶组件`就是高阶函数，而 React 的组件本身就是纯粹的函数，所以高阶函数对 React 来说易如反掌。   
相反 Vue.js 使用 HTML 模板创建视图组件，这时模板无法有效的编译，因此 Vue 不能采用 HOC 来实现。    
6. 构建工具 - 两者都有自己的构建工具：   
React ==> Create React APP    
Vue ==> vue-cli    
7. 跨平台   
React ==> React Native   
Vue ==> Wee   

#### 12. Vue 的优点 
轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十 kb ；   
简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；    
双向数据绑定：保留了 angular 的特点，在数据操作方面更为简单；   
组件化：保留了 react 的优点，实现了 html 的封装和重用，在构建单页面应用方面有着独特的优势；    
视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；   
虚拟 DOM：dom 操作是非常耗费性能的，不再使用原生的 dom 操作节点，极大解放 dom 操作，但具体操作的还是 dom 不过是换了另一种方式；
运行速度更快：相比较于 react 而言，同样是操作虚拟 dom，就性能而言， vue 存在很大的优势。

#### 13. assets 和 static 的区别
`相同点`：     
assets 和 static 两个都是存放静态资源文件。项目中所需要的资源文件图片，字体图标，样式文件等都可以放在这两个文件下.   
`不相同点`：   
assets 中存放的静态资源文件在项目打包时，也就是运行 npm run build 时会将 assets 中放置的静态资源文件进行打包上传，所谓打包简单点可以理解为压缩体积，代码格式化。而压缩后的静态资源文件最终也都会放置在 static 文件中跟着 index.html 一同上传至服务器。static 中放置的静态资源文件就不会要走打包压缩格式化等流程，而是直接进入打包好的目录，直接上传至服务器。    
因为避免了压缩直接进行上传，在打包时会提高一定的效率，但是static 中的资源文件由于没有进行压缩等操作，所以文件的体积也就相对于 assets 中打包后的文件提交较大点。在服务器中就会占据
更大的空间。建议： 将项目中 template 需要的样式文件 js 文件等都可以放置在assets 中，走打包这一流程。减少体积。而项目中引入的第三方的资源文件如 iconfoont.css 等文件可以放置在 static 中，因为这些引入的第三方文件已经经过处理，不再需要处理，直接上传.
