一、Vue3中的生命周期
`1、setup() :` 开始创建组件之前，在 beforeCreate 和 created 之前执行，创建的是 data 和 method

`2、onBeforeMount() :` 组件挂载到节点上之前执行的函数；

`3、onMounted() : `组件挂载完成后执行的函数；

`4、onBeforeUpdate(): `组件更新之前执行的函数；

`5、onUpdated(): `组件更新完成之后执行的函数；

`6、onBeforeUnmount():` 组件卸载之前执行的函数；

`7、onUnmounted():` 组件卸载完成后执行的函数；

`8、onActivated(): `被包含在 <keep-alive> 中的组件，会多出两个生命周期钩子函数，被激活时执行；

`9、onDeactivated():` 比如从 A 组件，切换到 B 组件，A 组件消失时执行；

`10、onErrorCaptured():` 当捕获一个来自子孙组件的异常时激活钩子函数。

二、Vue2.X和Vue3.X对比
```javascript
vue2           ------->      vue3
 
beforeCreate   -------->      setup(()=>{})
created        -------->      setup(()=>{})
beforeMount    -------->      onBeforeMount(()=>{})
mounted        -------->      onMounted(()=>{})
beforeUpdate   -------->      onBeforeUpdate(()=>{})
updated        -------->      onUpdated(()=>{})
beforeDestroy  -------->      onBeforeUnmount(()=>{})
destroyed      -------->      onUnmounted(()=>{})
activated      -------->      onActivated(()=>{})
deactivated    -------->      onDeactivated(()=>{})
errorCaptured  -------->      onErrorCaptured(()=>{})
```