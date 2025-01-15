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

#### 简单 pinia

createPinia.js

```js
import { markRaw } from "vue";

export const piniaSymbol = symbol("pinia");

export function createPinia() {
  const pinia = markRaw({
    install(app) {
      pinia._a = app;
      app.provide(piniaSymbol, pinia);
      app.config.globalProperties.$pinia = pinia;
    },
    _s: new Map(), // 存储子store
  });
  return pinia;
}
```

store.js

```js
import { computed, reactive, toRefs } from "vue";

export function defineStore(id, options) {
  const { state: stateFn, actions, getters } = options;
  const state = reactive(stateFn());
  function useStore() {
    // 组件实例
    const currentInstance = getCurrentInstance();
    // pinia 实例
    const pinia = currentInstance && inject(piniaSymbol);
    // 如果不存在则创建一次
    if (!pinia._s.has(id)) {
      pinia._s.set(
        id,
        reactive({
          ...toRefs(state),
          ...Object.keys(getters || {}).reduce((computedGetters, name) => {
            computedGetters[name] = computed(() => {
              return getters[name].call(store, store);
            });
            return computedGetters;
          }, {}),
          ...Object.keys(actions || {}).reduce((wrapperActions, actionName) => {
            wrapperActions[actionName] = () => actions[actionName].call(store);
            return wrapperActions;
          }, {}),
          $patch(partialStateOrMutator) {
            if (typeof partialStateOrMutator === "object") {
              Object.keys(partialStateOrMutator).forEach((key) => {
                state[key] = partialStateOrMutator[key];
              });
            } else {
              partialStateOrMutator(state);
            }
          },
        })
      );
    }
    const store = pinia._s.get(id);
    return store;
  }
  return useStore;
}
```
