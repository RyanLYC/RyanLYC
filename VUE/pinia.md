### Pinia

- 修复数据的四种方式
  - counter.count++ 直接修改
  - counter.inc() 函数修改
  - counter.$patch({count:counter.count++}) 修改多个数据
  - counter.$patch((state) => state.count++) 函数式修改数据
- createPinia 函数
  - effectScope
  - install：vue 的插件函数；app.provide 提供子组件 pinia 对象
  - defineStore 函数，通过 inject 拿到 pinia 这个单例实例，通过 createSetupStore 或者 createOptionsStore 创建
- [一步一步手写 pinia 核心功能](https://juejin.cn/post/7194620691839205435)
