### ES6

`（1）块级作用域`： 块作用域由 { }包括，let 和 const 具有块级作用域，var 不存在块级作用域。块级作用域解决了 ES5 中的两个问题：

- 内层变量可能覆盖外层变量
- 用来计数的循环变量泄露为全局变量

`（2）变量提升`： var 存在变量提升,声明之前使用为 undefined，let 和 const 不存在变量提升，即在变量只能在声明之后使用，否在会报错。
`（3）给全局添加属性`： 浏览器的全局对象是 window，Node 的全局对象是 global。var 声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是 let 和 const 不会。
`（4）重复声明`： var 声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const 和 let 不允许重复声明变量。
`（5）暂时性死区`： 在使用 let、const 命令声明变量之前，该变量都是不可用的。这在语法上，称为暂时性死区。使用 var 声明的变量不存在暂时性死区。词法作用域，根据块级作用域进行嵌套，子作用域可访问父级作用域的变量
`（6）初始值设置`： 在变量声明时，var 和 let 可以不用设置初始值。而 const 声明变量必须设置初始值。
`（7）指针指向`： let 和 const 都是 ES6 新增的用于创建变量的语法。 let 创建的变量是可以更改指针指向（可以重新赋值）。但 const 声明的变量是不允许改变指针的指向

#### 从声明过程，内存分配，和变量提升这三点来看这三者之间的区别。

1. 声明过程

- `var`：遇到有 var 的作用域，在任何语句执行前都已经完成了声明和初始化，也就是变量提升而且拿到 undefined 的原因由来;function： 声明、初始化、赋值一开始就全部完成，所以函数的变量提升优先级更高

- `let`：解析器进入一个块级作用域，发现 let 关键字，变量只是先完成声明，并没有到初始化那一步。此时如果在此作用域提前访问，则报错 xx is not defined，这就是暂时性死区的由来。等到解析到有 let 那一行的时候，才会进入初始化阶段。如果 let 的那一行是赋值操作，则初始化和赋值同时进行 const、class 都是同 let 一样的道理 比如解析如下代码步骤：

```javascript
{
  // 没用的第一行
  // 没用的第二行
  console.log(a);
  // 如果此时访问a报错 a is not defined
  let a = 1;
}
```

- `步骤：`发现作用域有 let a，先注册个 a，仅仅注册 没用的第一行 没用的第二行 a is not defined，暂时性死区的表现。  
  假设前面那行不报错，a 初始化为 undefined a 赋值为 1 对比于 var，let、const 只是解耦了声明和初始化的过程，var 是在任何语句执行前都已经完成了声明和初始化，let、const 仅仅是在任何语句执行前只完成了声明。

2. 内存分配

- `var`，会直接在栈内存里预分配内存空间，然后等到实际语句执行的时候，再存储对应的变量，如果传的是引用类型，那么会在堆内存里开辟一个内存空间存储实际内容，栈内存会存储一个指向堆内存的指针

- `let`，是不会在栈内存里预分配内存空间，而且在栈内存分配变量时，做一个检查，如果已经有相同变量名存在就会报错

- `const`，也不会预分配内存空间，在栈内存分配变量时也会做同样的检查。不过 const 存储的变量是不可修改的，对于基本类型来说你无法修改定义的值，对于引用类型来说你无法修改栈内存里分配的指针，但是你可以修改指针指向的对象里面的属性

3. 三.变量提升
   - let const 和 var 三者其实会存在变量提升
   - let 只是创建过程提升，初始化过程并没有提升，所以会产生暂时性死区。 var 的创建和初始化过程都提升了，所以在赋值前访问会得到 undefined
   - function 的创建、初始化、赋值都被提升了

```javascript
var b = 10;
(function b() {
  // 内部作用域，会先去查找是有已有变量b的声明，有就直接赋值20，确实有了呀。发现了具名函数 function b(){}，拿此b做赋值；
  // 特性：声明提前：一个声明在函数体内都是可见的，函数声明优先于变量声明； 在非匿名自执行函数中，函数变量为只读状态无法修改；
  b = 20;
  console.log(b); // [Function b]
  console.log(window.b); // 10，不是20
})();
```

#### 简单改造下面的代码，使之分别打印 10 和 20。

```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();

var b = 10;
(function b() {
  let b = 20;
  console.log(b); // 20
})();

var b = 10;
(function b() {
  b = 20;
  console.log(window.b); // 10
})();
```

#### 下面代码输出什么

```javascript
var a = 10;
(function () {
  console.log(a); // undefined
  a = 5;
  console.log(a); // 5
  console.log(window.a); // 10
  var a = 20; // 局部变量 然后变量提升，但是值为 undefined
  console.log(a); // 20
})();
```

#### class

class 语法继承，最接近我们自己实现的哪种继承方式？  
寄生 + 组合

```js
// js 的 6中继承
// 1. 原型链继承
function Parent() {
  this.name = "parent";
}

Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child() {}

Child.prototype = new Parent();

let child1 = new Child();

// 2.构造函数继承
function Parent(name) {
  this.name = name;
}

function Child(name) {
  Parent.call(this, name);
}

let child1 = new Child("child1");

// 3. 组合继承
function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child(name) {
  Parent.call(this, name);
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

let child1 = new Child("child1");

// 4. 原型式继承
function createObject(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

let parent = {
  name: "parent",
  sayName: function () {
    console.log(this.name);
  },
};

let child = createObject(parent);

// 5. 寄生式继承
function createObject(obj) {
  let clone = Object.create(obj);
  clone.sayName = function () {
    console.log(this.name);
  };
  return clone;
}

let parent = {
  name: "parent",
};

let child = createObject(parent);

// 6. 寄生组合式继承
function inheritPrototype(subType, superType) {
  let prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function () {
  console.log(this.name);
};

function Child(name) {
  Parent.call(this, name);
}

inheritPrototype(Child, Parent);

let child1 = new Child("child1");
```

#### for of 与 for in 的区别 - iterable

- for...in 遍历的是对象的属性名，而 for...of 遍历的是可迭代对象的元素值。
- for...in 会遍历对象自身以及原型链上的属性，而 for...of 只遍历对象自身的元素。
- for...in 适用于普通对象，而 for...of 适用于可迭代对象，如数组、字符串、Map、Set 等。
  使用
- 当需要遍历对象的属性名时，使用 for...in 循环，并考虑使用 hasOwnProperty 方法过滤掉原型链上的属性。
- 当需要遍历可迭代对象的元素值时，使用 for...of 循环。
- 对于数组和字符串等可迭代对象，优先考虑使用 for...of 循环，因为它更直接、更高效。
- 在使用 for...in 和 for...of 循环时，注意确保遍历的对象是可枚举的或可迭代的，否则可能会导致错误或不可预期的结果。

#### 模版字符串``

基本原理是：js 引擎解析模版字符串时，会将字符串和变量值分割成多个参数，并将它们作为函数的参数传递给一个名为 Tagged Template 的函数。该函数的第一个参数是个数组，其中保护原始字符串终端所有字符文字，出了所有插入字符，其余产生则是与模版字符串插值表达式对应的插入值。

```js
// 函数 + 模版字符串 调用
function upperCase(strings, ...values) {
  let result = "";
  // strings -> ['my name is']
  // values -> [name]
}
const name = "lyc";
const str = upperCase`my name is ${name}`;
```

#### 解构语法

数组解构原理：第一步是使用取值函数{getter}读取数组中对应位置的值，第二步是将取得的值赋值给目标变量。

```js
const [a, b, c] = [1, 2, 3];
// 实现
const temp = [1, 2, 3];
const a = temp[0];
const b = temp[1];
const c = temp[2];
```

对象解构原理：遍历对象中的每一个属性，然后在解构表达式中查找痛吗的变量。

#### 箭头函数

- 箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：
  1. 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
  2. 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
  3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
  4. 不可以使用 new 命令，因为：没有构造函数
  5. 没有自己的 this，无法调用 call，apply，bind。

#### 生成器 generator

生成器是为了解决函数的不可中断性。
结合 promise 异步操作后，调用 next() - async await

#### Reflect 反射

```js
const person = { name: "lyc" };
Reflect.set(person, "name", "LYC");
```

#### BigInt(兼容性不好可以使用 big.js) - 超过了 Number 的最大值 2 的 53 次方 - 1 时使用
