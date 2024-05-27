### JS 执行原理

#### 词法作用域(静态作用域) 动态作用域

- 作用域：程序定义变量的区域，作用域中定义了如何找到对应的变量，在执行代码运行在作用域中，获取对变量的访问权限
- js 是静态作用域：作用域在定义时就确定了
- 动态作用域：在调用时决定

```js
const value = 1;
function foo() {
  console.log(value);
}
function bar() {
  const value = 2;
  foo();
}
bar(); // 1  静态作用域
```

#### 执行上下文 (一段可执行的代码)

三种可执行代码：

- 全局代码
- 函数代码
- eval

执行上下文入栈执行,execution context stack ESC 后进先出

```js
function f3() {
  console.log("f3");
}
function f2() {
  f(3);
}
function f1() {
  f2();
}
f1();
```

执行栈 -> global context -> f1 context -> f2 context -> f3 context -> f3 执行完毕 -> f3 出栈 -> f2 出栈 -> f1 出栈 -> global 出栈 -> 代码执行完毕
每个执行上下文都会有会有这 3 个关键的属性：变量对象、作用域链、this

#### 变量对象

variable object VO ：在全局的执行上下文中 的变量、函数声明，例如 js 可以定义 a=1，可以 console.log(this) 可以 parseInt()
activiaction obj 活动对象 AO：在函数上下文中 的变量、函数声明，函数中定义的需要在函数被执行的时候激活

实际执行过程中

1. 分析(准备)：不执行代码，分析函数的定义、声明、形参（没有实际传入参数，arguments = undefined）

```js
function foo(a) {
  var b = 2;
  function c() {}
  var d = function () {};
  b = 3;
}
foo(1)

AO = {
    arguments:{
        0:1,
        length:1
    },
    a:1,
    b:undefined
    c: reference to function c(){}
    d: undefined
}
```

2. 执行

```js
AO = {
    arguments:{
        0:1,
        length:1
    },
    a:1,
    b:2
    c: reference to function c(){}
    d: reference to FunctionExpression d
}
```

```js
// 例子
function foo() {
  console.log(a);
  a = 1;
}
foo(); // 报错

// 执行过程分析
VO = {
  arguments: {
    length: 0,
  },
};
console.log(a); // 找不到a 报错
//

function foo() {
  a = 1;
  console.log(a);
}
foo(); // 1
// 执行过程分析
VO = {
  arguments: {
    length: 0,
  },
};
执行 a = 1
globalVO ={
    a:1
}
 console.log(a); // 1
//
```

#### 作用域链

找变量的时候，先从当前上下文找，找不到从上级上下文找，直到找到全局上下文中

```js
// [[scope]];
function foo() {
  function bar() {}
}
foo();
foo.[[scope]] = [
    globalContext.VO
]

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
]
// 变量对象合并
[bar.AO].concat(...[
    fooContext.AO,
    globalContext.VO
])
```

```js
// 代码执行例子
var scope = 'global scope'
function checkScope(){
    var scope2 = 'local scope'
    return scope2
}
checkScope()
// 代码执行分析
checkScope.[[scope]] = [globalContext.VO]
// 入栈
ESC stack = [
    checkScopeContext,
    globalContext
]
// 在调用checkScope时，不会立即执行，但会进行准备工作 VO / scope chain / this
checkScopeContext = {
    Scope:[AO,...[checkScope.[[scope]]]],
    AO:{
        arguments:{
            length:0,
        },
        scope2:undefined
    }
}
// 代码执行
checkScopeContext = {
    Scope:[AO,...[checkScope.[[scope]]]],
    AO:{
        arguments:{
            length:0,
        },
        scope2:'local scope'
    }
}
// 出栈
ESC stack = []
// 代码执行完毕
```

#### this

Reference 规范类型

1. base value 属性所在的对象
2. referenced name 属性本身的名称
3. strict reference 是否是严格类型

```js
var foo = 1;
//
fooReference = {
  base: "环境 例如 windows",
  name: "foo",
  strict: false,
};
```

```js
var foo = {
  bar: function () {
    return this;
  },
};
foo.bar(); // foo
barReference = {
  base: foo,
  name: "bar",
  strict: false,
};
// GetBase reference base value  判断 () 左边是否是一个Reference，如果是 就获取 base的值 ， 就是 this 对象 如果是 undefined，非严格模式 就是 windows
foo.bar();
// 括号左边 是 foo.bar
barReference = {
  base: foo,
  name: "bar",
  strict: false,
};
// 所以 this 就是 foo
```
