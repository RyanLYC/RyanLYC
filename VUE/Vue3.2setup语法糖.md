### 文件结构
```vue
<template>
  // Vue2中，template标签中只能有一个根元素，在Vue3中没有此限制
  // ...
</template>

<script setup>
  // ...
</script>

<style lang="scss" scoped>
  // 支持CSS变量注入v-bind(color)
</style>
```

### data \ method \ computed \ watch
```vue
<template>
  // 调用方法
  <button @click='changeName'>按钮</button>  
</template>

<script setup>
  import { reactive } from 'vue'

  const state = reactive({
    name: 'Jery'
  })

  // 声明method方法
  const changeName = () => {
    state.name = 'Tom'
  }  

  // 通过computed获得doubleCount
  const doubleCount = computed(() => {
    return count.value * 2
  })

  // 监听count
  watch(
    () => state.name,
    (newVal, oldVal) => {
      console.log(state.name)
      console.log(`watch监听变化前的数据：${oldVal}`)
      console.log(`watch监听变化后的数据：${newVal}`)
    },
    {
      immediate: true, // 立即执行
      deep: true // 深度监听
    }
  )
</script>
```

### props父传子 emit子传父
`子组件`
```vue
<template>
  <span>{{props.name}}</span>
  // 可省略【props.】
  <span>{{name}}</span>
   <button @click='changeName'>更名</button>
</template>

<script setup>
  // 声明props
  const props = defineProps({
    name: {
      type: String,
      default: ''
    }
  })  
  // 声明事件
  const emit = defineEmits(['updateName'])
  
  const changeName = () => {
    // 执行
    emit('updateName', 'Tom')
  }
</script>
```
`父组件`
```vue
<template>
  <child :name='state.name' @updateName='updateName'/>  
</template>

<script setup>
  import { reactive } from 'vue'
  // 引入子组件
  import child from './child.vue'

  const state = reactive({
    name: 'lll'
  })
  
  // 接收子组件触发的方法
  const updateName = (name) => {
    state.name = name
  }
</script>
```

### v-model
`子组件`
```vue
<template>
  <span @click="changeInfo">我叫{{ modelValue }}，今年{{ age }}岁</span>
</template>

<script setup>
  // import { defineEmits, defineProps } from 'vue'
  // defineEmits和defineProps在<script setup>中自动可用，无需导入
  // 需在.eslintrc.js文件中【globals】下配置【defineEmits: true】、【defineProps: true】

  defineProps({
    modelValue: String,
    age: Number
  })

  const emit = defineEmits(['update:modelValue', 'update:age'])
  const changeInfo = () => {
    // 触发父组件值更新
    emit('update:modelValue', 'Tom')
    emit('update:age', 30)
  }
</script>
```
`父组件`
```vue
<template>
  // v-model:modelValue简写为v-model
  // 可绑定多个v-model
  <child
    v-model="state.name"
    v-model:age="state.age"
  />
</template>

<script setup>
  import { reactive } from 'vue'
  // 引入子组件
  import child from './child.vue'

  const state = reactive({
    name: 'Jerry',
    age: 20
  })
</script>
```

### 子组件ref变量和defineExpose
`子组件`
```vue
<template>
  <span>{{state.name}}</span>
</template>

<script setup>
  import { reactive, toRefs } from 'vue'
  // defineExpose无需引入
  // import { defineExpose, reactive, toRefs } from 'vue'

  // 声明state
  const state = reactive({
    name: 'Jerry'
  }) 
	
  // 将方法、变量暴露给父组件使用，父组件才可通过ref API拿到子组件暴露的数据
  defineExpose({
    // 解构state
    ...toRefs(state),
    // 声明方法
    changeName () {
      state.name = 'Tom'
    }
  })
</script>
```
`父组件`
```vue
<template>
  <child ref='childRef'/>  
</template>

<script setup>
  import { ref, nextTick } from 'vue'
  // 引入子组件
  import child from './child.vue'

  // 子组件ref
  const childRef = ref('childRef')
  
  // nextTick
  nextTick(() => {
    // 获取子组件name
    console.log(childRef.value.name)
    // 执行子组件方法
    childRef.value.changeName()
  })
</script>
```

### 插槽slot
`子组件`
```vue
<template>
  <slot/>
  <slot name='title'/>
  <slot name="footer" :scope="state" />
</template>

<script setup>
  import { useSlots, reactive } from 'vue'
  const state = reactive({
    name: '张三',
    age: '25岁'
  })
  
  const slots = useSlots()
  // 匿名插槽使用情况
  const defaultSlot = reactive(slots.default && slots.default().length)
  console.log(defaultSlot) // 1
  // 具名插槽使用情况
  const titleSlot = reactive(slots.title && slots.title().length)
  console.log(titleSlot) // 3
</script>
```
`父组件`
```vue
<template>
  <child>
    <span>我是默认插槽</span>
    <template #title>
      <h1>我是具名插槽</h1>
      <h1>我是具名插槽</h1>
      <h1>我是具名插槽</h1>
    </template>
    // 作用域插槽
    <template #footer="{ scope }">
      <footer>作用域插槽——姓名：{{ scope.name }}，年龄{{ scope.age }}</footer>
    </template>
  </child> 
</template>

<script setup>
  // 引入子组件
  import child from './child.vue'
</script>
```

### 路由useRoute和useRouter
```vue
<script setup>
  import { useRoute, useRouter } from 'vue-router'
	
  // 必须先声明调用
  const route = useRoute()
  const router = useRouter()
	
  // 路由信息
  console.log(route.query)

  // 路由跳转
  router.push('/newPage')
</script>
```

### 路由导航守卫
```vue
<script setup>
  import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
	
  // 添加一个导航守卫，在当前组件将要离开时触发。
  onBeforeRouteLeave((to, from, next) => {
    next()
  })

  // 添加一个导航守卫，在当前组件更新时触发。
  // 在当前路由改变，但是该组件被复用时调用。
  onBeforeRouteUpdate((to, from, next) => {
    next()
  })
</script>
```

### 生命周期
setup
onBeforeMount
onMounted
onBeforeUpdate
onUpdated
onBeforeUnmount
onUnmounted
onErrorCaptured
onRenderTracked
onRenderTriggered
onActivated
onDeactivated

### CSS变量注入
```vue
<template>
  <span>Jerry</span>  
</template>

<script setup>
  import { reactive } from 'vue'

  const state = reactive({
    color: 'red'
  })
</script>
  
<style scoped>
  span {
    // 使用v-bind绑定state中的变量
    color: v-bind('state.color');
  }  
</style>
```

### 原型绑定与组件内使用 & 对 await 的支持
`main.js`
```js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// 获取原型
const prototype = app.config.globalProperties

// 绑定参数
prototype.name = 'Jerry'
```
`组件内使用`
```vue
<script setup>
  import { getCurrentInstance } from 'vue'

  // 获取原型
  const { proxy } = getCurrentInstance()
  
  // 输出
  console.log(proxy.name)

  // 对 await 的支持
   const post = await fetch('/api').then(() => {})
</script>
```

### 定义组件的name
```vue
// 新版 组件库中不用这样加名字了。
<script>
  export default {
    name: 'ComponentName',
  }
</script>
```

### provide和inject
`父组件`
```vue
<template>
  <child/>
</template>

<script setup>
  import { provide } from 'vue'
  import { ref, watch } from 'vue'
  // 引入子组件
  import child from './child.vue'

  let name = ref('Jerry')
  // 声明provide
  provide('provideState', {
    name,
    changeName: () => {
      name.value = 'Tom'
    }
  })

  // 监听name改变
  watch(name, () => {
    console.log(`name变成了${name}`)
    setTimeout(() => {
      console.log(name.value) // Tom
    }, 1000)
  })
</script>
```
`子组件`
```vue
<script setup>
  import { inject } from 'vue'
	// 注入
  const provideState = inject('provideState')
  
  // 子组件触发name改变
  provideState.changeName()
</script>
```

###  vue3.2 => 3.3 
```ts 
import type { IPerson, IEvents } from './types'

// interface IPerson {
  // user:{
  //   name: string;
  //   age: number;
  // }
  
// }
// interface IEvents {
//   (e: 'change', hidden: boolean): void
// }
const props = withDefaults(defineProps<IPerson>(), {
  user: () => ({ name: 'viking', age: 50 })
})

const emit = defineEmits<IEvents>()

```