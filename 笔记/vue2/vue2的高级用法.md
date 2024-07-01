### Mixin 的使用与问题

- vue2(2.7.14) - @vue/cli 5.0.8
- npm install -g @vue/cli
- vue create \*

#### Mixin 引起的问题

mixin 在一定程度上实现了代码逻辑封装与复用，但是他的优势不敌缺点。

1. 变量覆盖
2. 溯源困难
3. 无法做到按需引入

#### vue 过渡与动画

1. js 操作 style 操作 transition
2. 预先定义 class ，动态切换
3. js 代码 结合 requestAnimationFrame
4. 过渡动画库 Velocity.js \ GSAP - https://gsap.com/
5. animation 、 transition
6. TweenLite.js、TweenMax.js、TimelineLite.js 和 TimelineMax.js4 个文件就是 GSAP

   - TweenLite 是 GSAP 的主体核心，它用于创建基本动画，是其他各类模块的基础。一般都会搭配 plugins/CSSPlugin 以实现 DOM 元素的动画（也就是我们最熟悉的动画了）。

   - TimelineLite 是一个叫做时间轴的动画容器，它用于对多个动画进行有序的组织与控制。

   - TimeLineMax 是 TimelineLite 的升级版，在 TimelineLite 的基础之上，可以有更高级的组织与控制。

   - TweenMax 是 GSAP 集合包，除前面 3 个之外，还包括 plugins 里的常用插件以及 easing 里的缓动函数补

`动画实现 建议 使用方式2`
使用 transitionstart 与 transitionend 事件监听过渡是否完成

`transition 基本原理`

1. 通过 v-if 控制元素显示与隐藏
2. 通过 transition 的 name 属性，定义过渡动画的 class
3. 通过 css 定义过渡动画的样式
   首先组件在即将出现时，vue 将其添加到 dom 中，然后绑定对应的 class，实现进场过渡，元素退场执行完后 transitionend，vue 会将其栋 dom 中删除

#### 插槽 slot

#### 插件化机制

Vue.use(MyPlugin)

1. 插件底座
2. 插件的注册
3. 插件的卸载
4. 插件的生命周期
