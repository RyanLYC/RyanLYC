### Vue 性能优化

1. 路由懒加载
   ```js
    {path:'/index',component:() => import("./index.vue")}
   ```
2. keep-alive 缓存页面
3. v-show 复用 Dom
4. v-for 避免同时使用 v-if
5. 长列表性能优化
   - 如果列表是纯粹的数据展示，不会有任何改变，就不需要做响应化
     ```js
     export default {
       data: () => ({
         infos: [], // 响应式
       }),
       async created() {
         const infos = await axios.get("/***");
         this.infos = Object.freeze(infos); // Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；
         // 冻结了一个对象则不能向这个对象添加新的属性
         // 不能删除已有属性
         // 不能修改该对象已有属性的可枚举性、可配置性、可写性，
         // 以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改
         // freeze() 返回和传入的参数相同的对象
       },
     };
     ```
   - 如果是大数据长列表，可以采用虚拟滚动，只渲染少部分区域的内容
     ```js
     // vue-virtual-scroller、vue-virtual-scroll-list
     ```
6. 事件销毁
7. 图片懒加载 - 滚动到了再赋值 src 加载显示
   ```html
   <!-- vue-lazyload -->
   <img v-lazy="///" />
   ```
8. ui 库或者第三方插件按需引入
9. 无状态组件标记为函数式组件
   ```vue
   <template functional>
     <div>
       <div v-if="props.value">666</div>
       <div v-else>7777</div>
     </div>
   </template>
   <script>
   export default {
     props: ["value"],
   };
   </script>
   ```
10. 子组件切割，把数据多次改变的组件封装起来提高性能
11. SSR 服务器渲染 提高首屏时间和优化 SEO
