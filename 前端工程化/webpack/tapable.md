
#### tapable  http://www.manongjc.com/detail/61-dgkcseaeyvskkyv.html
1. 上面的hooks 来源于 tapable
2. tapable 类似EventEmitter的库，控制各种钩子的订阅发布，贯穿插件运行
3. const {SyncHook,SyncBailHook,SyncWaterfallHook,SyncLoopHook,AsyncParallelHook,AsyncParallelBailHook,AsyncSeriesHook,AsyncSeriesBailHook,AsyncSeriesWaterfallHook}= require("tapable");

- 按照执行机制分类
- Tapable 可以按照异步/同步执行分类的同时也可以按照执行机制进行分类，比如：

* Basic Hook : 基本类型的钩子，它仅仅执行钩子注册的事件，并不关心每个被调用的事件函数返回值如何。
* Waterfall : 瀑布类型的钩子，瀑布类型的钩子和基本类型的钩子基本类似，唯一不同的是瀑布类型的钩子会在注册的事件执行时将事件函数执行非 undefined 的返回值传递给接下来的事件函数作为参数。
* Bail : 保险类型钩子，保险类型钩子在基础类型钩子上增加了一种保险机制，如果任意一个注册函数执行返回非 undefined 的值，那么整个钩子执行过程会立即中断，之后注册事件函数就不会被调用了。
* Loop : 循环类型钩子，循环类型钩子稍微比较复杂一点。循环类型钩子通过 call 调用时，如果任意一个注册的事件函数返回值非 undefeind ,那么会立即重头开始重新执行所有的注册事件函数，直到所有被注册的事件函数都返回 undefined。

1. SyncHook是最基础的同步钩子：
```js
const { SyncHook } = require('tapable');
// 初始化同步钩子
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);
// 注册事件
hook.tap('flag1', (arg1, arg2, arg3) => {
  console.log('flag1:', arg1, arg2, arg3);
});
hook.tap('flag2', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
});
// 调用事件并传递执行参数
hook.call('19Qingfeng', 'wang', 'haoyu');
// 打印结果
flag1: 19Qingfeng wang haoyu
flag2: 19Qingfeng wang haoyu
```

2. SyncBailHook 中如果任何事件函数存在返回值，那么会立即中断后续事件函数的调用：
```js
const { SyncBailHook } = require('tapable');
const hook = new SyncBailHook(['arg1', 'arg2', 'arg3']);
// 注册事件
hook.tap('flag1', (arg1, arg2, arg3) => {
  console.log('flag1:', arg1, arg2, arg3);
  // 存在返回值 阻断flag2事件的调用
  return true
});
hook.tap('flag2', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
});
// 调用事件并传递执行参数
hook.call('19Qingfeng', 'wang', 'haoyu');
// 打印结果
flag1: 19Qingfeng wang haoyu
```

3. SyncWaterfallHook 瀑布钩子会将上一个函数的返回值传递给下一个函数作为参数：
```js
const { SyncWaterfallHook } = require('tapable');
// 初始化同步钩子
const hook = new SyncWaterfallHook(['arg1', 'arg2', 'arg3']);
// 注册事件
hook.tap('flag1', (arg1, arg2, arg3) => {
  console.log('flag1:', arg1, arg2, arg3);
  // 存在返回值 修改flag2函数的实参
  return 'github';
});
hook.tap('flag2', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
});
hook.tap('flag3', (arg1, arg2, arg3) => {
  console.log('flag3:', arg1, arg2, arg3);
});

// 调用事件并传递执行参数
hook.call('19Qingfeng', 'wang', 'haoyu');
// 输出结果
flag1: 19Qingfeng wang haoyu
flag2: github wang haoyu
flag3: github wang haoyu
```

3. SyncLoopHook 会在任意一个被监听的函数存在非 undefined 返回值时返回重头开始执行：
```js
const { SyncLoopHook } = require('tapable');
let flag1 = 2;
let flag2 = 1;
// 初始化同步钩子
const hook = new SyncLoopHook(['arg1', 'arg2', 'arg3']);
// 注册事件
hook.tap('flag1', (arg1, arg2, arg3) => {
  console.log('flag1');
  if (flag1 !== 3) {
    return flag1++;
  }
});
hook.tap('flag2', (arg1, arg2, arg3) => {
  console.log('flag2');
  if (flag2 !== 3) {
    return flag2++;
  }
});
// 调用事件并传递执行参数
hook.call('19Qingfeng', 'wang', 'haoyu');
// 执行结果
flag1
flag1
flag2
flag1
flag2
flag1
flag2
```
` 一个原则，事件存在非 undefined 返回值那么就掉头从最开始进行重新执行。 `

4. AsyncSeriesHook 表示异步串联执行：
```js
const { AsyncSeriesHook } = require('tapable');
// 初始化同步钩子
const hook = new AsyncSeriesHook(['arg1', 'arg2', 'arg3']);
console.time('timer');
// 注册事件
hook.tapAsync('flag1', (arg1, arg2, arg3, callback) => {
  console.log('flag1:', arg1, arg2, arg3);
  setTimeout(() => {
    // 1s后调用callback表示 flag1执行完成
    callback();
  }, 1000);
});
hook.tapPromise('flag2', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
  // tapPromise返回Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
});
// 调用事件并传递执行参数
hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
// 打印结果
flag1: 19Qingfeng wang haoyu
flag2: 19Qingfeng wang haoyu
全部执行完毕 done
timer: 2.012s
```
* tapAsync 注册时实参结尾额外接受一个 callback ，调用 callback 表示本次事件执行完毕。 callback 的机制和 node 中是一致的，也就是说 callback 函数调用时，如果第一个参数表示错误对象，如果传递第一个参数的话那么就表示本次执行出现错误会中断执行。 当然后续参数和 nodejs 中同理，从 callback 函数第二个参数表示开始表示本次函数调用的返回值。
* Promise 同理，如果这个 Promise 返回的结果是 reject 状态，那么和 callback 传递错误参数同样效果，也会中断后续的执行。

5. AsyncSeriesBailHook 表示异步串行保险钩子：
```js
const { AsyncSeriesBailHook } = require('tapable');
// 初始化同步钩子
const hook = new AsyncSeriesBailHook(['arg1', 'arg2', 'arg3']);
console.time('timer');
// 注册事件
hook.tapPromise('flag1', (arg1, arg2, arg3, callback) => {
  console.log('flag2:', arg1, arg2, arg3);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve函数存在任何值表示存在返回值
      // 存在返回值 bail保险打开 中断后续执行
      resolve(true);
    }, 1000);
  });
});
// flag2 不会被执行了
hook.tapAsync('flag2', (arg1, arg2, arg3,callback) => {
  console.log('flag1:', arg1, arg2, arg3);
  setTimeout(() => {
    callback();
  }, 1000);
});
// 调用事件并传递执行参数
hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
// 打印结果
flag2: 19Qingfeng wang haoyu
全部执行完毕 done
timer: 1.012s
```

6. AsyncSeriesWaterfallHook 异步串行瀑布钩子：
```js
const { AsyncSeriesWaterfallHook } = require('tapable');
// 初始化同步钩子
const hook = new AsyncSeriesWaterfallHook(['arg1', 'arg2', 'arg3']);
console.time('timer');
// 注册事件
hook.tapPromise('flag1', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
});
hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
  console.log('flag1:', arg1, arg2, arg3);
  setTimeout(() => {
    callback();
  }, 1000);
});
// 调用事件并传递执行参数
hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
// 输出结果
flag2: 19Qingfeng wang haoyu
flag1: true wang haoyu
全部执行完毕 done
timer: 2.012s
```

7. AsyncParallelHook 异步并行钩子，会并发执行所有异步钩子：
```js
const { AsyncParallelHook } = require('tapable');
// 初始化同步钩子
const hook = new AsyncParallelHook(['arg1', 'arg2', 'arg3']);
console.time('timer');
// 注册事件
hook.tapPromise('flag1', (arg1, arg2, arg3) => {
  console.log('flag2:', arg1, arg2, arg3);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
});
hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
  console.log('flag1:', arg1, arg2, arg3);
  setTimeout(() => {
    callback();
  }, 1000);
});
// 调用事件并传递执行参数
hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
// 执行结果
flag2: 19Qingfeng wang haoyu
flag1: 19Qingfeng wang haoyu
全部执行完毕 done
timer: 1.010s
```

8. AsyncParallelBailHook 这个钩子就比较有意思了，异步并行保险钩子。
```js
const { AsyncParallelBailHook } = require('tapable');
// 初始化同步钩子
const hook = new AsyncParallelBailHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

// 注册事件
hook.tapPromise('flag1', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    console.log('flag1 done:', arg1, arg2, arg3);
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
});
hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
  setTimeout(() => {
    console.log('flag2 done:', arg1, arg2, arg3);
    callback();
  }, 3000);
});
hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
// 执行结果
flag1 done: 19Qingfeng wang haoyu
全部执行完毕 done
timer: 1.013s
flag2 done: 19Qingfeng wang haoyu
```