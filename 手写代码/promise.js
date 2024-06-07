/**
 * Promise 规范
 * 0. 初始状态pending
 * 1. 执行了resolve Promise状态会变成fulfilled
 * 2. 执行了reject Promise状态会变成rejected
 * 3. 状态不可逆
 * 4. Promise 中有throw 执行 reject
 * 5. then 接收两个回调，成功和失败
 * 6. fulfilled 执行成功回调， rejected执行失败回调
 * 7. 存在定时器，需要定时器结束后执行then
 * 8. then支持链式调用，下一次的then接收上一次then的返回值
 */
class MyPromise {
  constructor(exec) {
    // 初始化
    this.initValue();
    // bind resolve reject 函数，绑定this 指向
    this.initBind();
    try {
      exec(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }
  initValue() {
    this.PromiseState = "pending";
    this.PromiseResult = null;
    // 成功队列
    this.onFulfilledCallbacks = [];
    // 失败队列
    this.onRejectedCallbacks = [];
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.PromiseState !== "pending") return;
    this.PromiseResult = value;
    this.PromiseState = "fulfilled";
    // 出队列
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }
  reject(reason) {
    if (this.PromiseState !== "pending") return;
    this.PromiseResult = reason;
    this.PromiseState = "rejected";
    // 出队列
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }
  then(onFulfilled, onRejected) {
    // 传入的必须为函数，否则转换为函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function" ? onRejected : (reason) => reason;
    // if (this.PromiseState === "fulfilled") {
    //   onFulfilled(this.PromiseResult);
    // } else if (this.PromiseState === "rejected") {
    //   onRejected(this.PromiseResult);
    // } else if (this.PromiseState === "pending") {
    //   // 定时器的时候 状态不会被改变，所以先把 执行函数 入队列
    //   this.onFulfilledCallbacks.push(onFulfilled.bind(this));
    //   this.onRejectedCallbacks.push(onRejected.bind(this));
    // }
    // 支持链式调用
    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          const res = cb(this.PromiseResult);
          if (res === undefined) return;
          console.log("---res---:", res);
          if (res === thenPromise) {
            throw new Error("不能返回本身");
          }
          if (res instanceof MyPromise) {
            res.then(resolve, reject);
          } else {
            resolve(res);
          }
        } catch (err) {
          reject(err);
          throw new Error(err);
        }
      };
      if (this.PromiseState === "fulfilled") {
        // onFulfilled(this.PromiseResult);
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // onRejected(this.PromiseResult);
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 定时器的时候 状态不会被改变，所以先把 执行函数 入队列
        this.onFulfilledCallbacks.push(onFulfilled.bind(this));
        this.onRejectedCallbacks.push(onRejected.bind(this));
      }
    });
    return thenPromise;
  }

  /** 全部成功返回，一个错误直接返回 */
  static all(promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count++;
        if (count === promises.length) {
          resolve(result);
        }
      };
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => reject(err)
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }
}

const test1 = new MyPromise((resolve, reject) => {
  //   setTimeout(() => {
  // reject("fail");
  resolve("success");
  //   }, 1000);
})
  .then(
    (res) => {
      return (res += " then resolver 1");
    },
    (res) => {
      return (res += " then reject 1");
    }
  )
  .then(
    (res) => {
      return (res += " then resolver 2");
    },
    (res) => {
      return (res += " then reject 2");
    }
  )
  .then(
    (res) => {
      console.log("resolve:", res);
    },
    (res) => {
      console.log("reject:", res);
    }
  );

// console.log(test1);
