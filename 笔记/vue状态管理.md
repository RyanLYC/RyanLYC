### vue 状态管理

#### vueX

- 单向数据流
- vuejs 响应式机制 高效的状态管理和更新

VueComponent -> Action(同步/异步) ->(commit) -> Mutations ->(Mutate) -> Store ->(Render) -> VueComponent

- 规则
  - store 响应式的数据
  - 提交 mutation 是更改状态的唯一方法，同步的
  - 异步逻辑 action
  - 触发 action 用 dispatch

#### pinia

- vue2 vue3 都支持
- ts
- 服务端渲染支持
- 支持插件能量 扩展 pinia
  - 为 store 添加新的属性
  - 为 store 添加新的方法
  - 实现副作用 本地存储
  - 插件 就是一个 function；pinia.use 使用
