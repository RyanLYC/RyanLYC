/**
 *
  一、call、apply、bind的共同点
    1、都是用来改变函数的this对象的指向的。
    2、第一个参数都是this要指向的对象。
    3、都可以利用后续参数传参。

  二、区别1
    1.call和apply都是对函数的直接调用（也叫直接执行函数），而bind方法返回的仍然是一个函数，因此后面还需要()来进行调用才可以（将上下文绑定到bind()括号中的参数上，然后将它返回）。所以，bind后函数不会执行，而只是返回一个改变了上下文的函数副本。

    2.call和apply都可以传参数。call后面的参数与fn方法中是一一对应的，而apply的第二个参数是一个数组，数组中的元素是和fn方法中一一对应的，这就是两者最大的区别。

    3.bind是ES5中的方法，可以向call一样传参，也可以在调用的时候再进行传参。

 */
var xw = {
  name: "小王",
  gender: "男",
  age: 24,
  say: function (school, grade) {
    console.log(
      this.name +
        " , " +
        this.gender +
        " ,今年" +
        this.age +
        " ,在" +
        school +
        "上" +
        grade
    );
  },
};
var xh = {
  name: "小红",
  gender: "女",
  age: 18,
};

// call
xw.say.call(xh, "call学校", "1年级");
// apply
xw.say.apply(xh, ["apply学校", "2年级"]);
// bind-方法1
xw.say.bind(xh, "bind学校", "3年级")();
// bind-方法2
xw.say.bind(xh)("bind学校", "3年级");

/**
 *
三、总结
  1.当我们使用一个函数需要改变this指向的时候才会用到call apply bind

    2.如果你要传递的参数不多，则可以使用fn.call(thisObj, arg1, arg2 …)

  3.如果你要传递的参数很多，则可以用数组将参数整理好调用fn.apply(thisObj, [arg1, arg2 …])

  4.如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用const newFn = fn.bind(thisObj); newFn(arg1, arg2…)

 */
