async function async1() {
  console.log("async1 start");

  await async2();

  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");

  resolve();
}).then(function () {
  console.log("promise2");
});

console.log("script end");

/**
 * script start
 *    进入宏任务 console.log("setTimeout");
 * async1 start
 *    await async2(); 会马上执行函数 然后 后面的代码放微任务
 * async2
 *    微任务 console.log("async1 end");
 *    new Promise 参数中的函数会马上执行 .then放微任务
 * promise1
 *    微任务中 console.log("async1 end");  =》  console.log("promise2");
 * script end
 *    先执行微任务
 * async1 end
 * promise2
 *    执行宏任务
 * setTimeout
 */
