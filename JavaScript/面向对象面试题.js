function Foo() {
  getName = function () {
    console.log(1);
  };
  return this;
}

Foo.getName = function () {
  console.log(2);
};

Foo.prototype.getName = function () {
  console.log(3);
};

var getName = function () {
  console.log(4);
};

function getName() {
  console.log(5);
}
/** 执行Foo内存块中的getName函数  输出 2 */
Foo.getName();

/** 执行函数前，var 变量提升，导致5的getName被覆盖 输出 4 */
getName();

/** Foo函数执行了返回this，this的指向就是windows，导致4的getName被覆盖 输出 1 */
Foo().getName();

/** Windows上的getName 被 Foo执行的时候覆盖的 这个同上输出 1 */
getName();

/** Foo.getName() 是2 new 2 输出 2*/
new Foo.getName();

/** Foo 实例对象 返回原型上的getName 输出 3 */
new Foo().getName();

/** 这个是上面一样 new 3  输出 3 */
new new Foo().getName();
