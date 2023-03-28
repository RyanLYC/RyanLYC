/**箭头函数 不能被 new； 没有this； 不具有 arguments 对象 不具有 prototype 原型对象*/

/**
 * 箭头函数和普通的区别
1、外形不同：箭头函数使用箭头定义，普通函数中没有。
2、箭头函数全都是匿名函数：普通函数可以有匿名函数，也可以有具名函数
3、箭头函数不能用于构造函数：普通函数可以用于构造函数，以此创建对象实例。
4、箭头函数中 this 的指向不同： 在箭头函数中不会创建自己的this，只会从自己的作用域链的上一层继承this。（注意其中对象不构成作用域） 在普通函数中，this 总是指向调用它的对象，如果用作构造函数，它指向创建的对象实例。
5、箭头函数不具有 arguments 对象：每一个普通函数调用后都具有一个
arguments 对象，用来存储实际传递的参数。但是箭头函数并没有此对象。
6、其他区别：箭头函数不具有 prototype 原型对象。箭头函数不具有 super。
箭头函数不具有 new.target

 */

/**
 * 
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1. 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

2. 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

4. 不可以使用 new 命令，因为：

没有自己的 this，无法调用 call，apply。
没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__
 */

// new 过程大致是这样的：

function newFunc(father, ...rest) {
  var result = {};
  result.__proto__ = father.prototype;
  var result2 = father.apply(result, rest);
  if (
    (typeof result2 === "object" || typeof result2 === "function") &&
    result2 !== null
  ) {
    return result2;
  }
  return result;
}
