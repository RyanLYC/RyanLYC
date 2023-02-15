/**
 
 var a = ?;  什么值 可以 输出1

if (a == 1 && a == 2 && a == 3) {

    console.log(1);

}
 */

/** 1. 利用 == 的类型转换 调用的是 toString 函数 */
var a = {
  i: 0,
  toString: function () {
    return ++this.i;
  },
};

// 2.方法 先调 valueOf 在 调用 toString
var a = {
  i: 0,
  valueOf() {
    return ++this.i;
  },
};

// 3.方法 Object.defineProperty
var a = 0;
var i = 0;
Object.defineProperty(window, "a", {
  get() {
    return ++i;
  },
});

/** 4.数组 */
var a = [1, 2, 3];
a.toString = a.shift; // valueOf 也可以
