# JavaScript中四种数据类型检测的方法
js中有八大数据类型，分别是：
字符串（String）、
数字（Number）、
布尔值（Boolean）、
undefined、
null、
Object、
Symbol, 
Function。
Symbol是ES6引入的一种新的原始数据类型，表示独一无二的值。（一般用来给对象做属性名）

1. typeof
  console.log(typeof 1);//number
  console.log(typeof '你好');//string
  console.log(typeof true);//boolean
  console.log(typeof undefined);//undefined
  console.log(typeof null);//object
  console.log(typeof function () { });//function
  console.log(typeof {});//object
  console.log(typeof []);//object
  console.log(typeof /\d/);//object

2. instanceof
  instanceof运算符，用来判断一个构造函数的prototype属性指向的对象是否存在另外一个要检测对象的原型链上。
  null和undefined会报错。

  console.log(new Number(1) instanceof Number);//true
  console.log(new String('你好') instanceof String);//true
  console.log(new Boolean(true) instanceof Boolean);//true
  console.log(function () { } instanceof Function);//true
  console.log({} instanceof Object);//true
  console.log([] instanceof Array);//true
  console.log(/\d/ instanceof RegExp);//true

  // 定义构造函数
  function C () {}
  function D () {}
  // 实例化一个 o 对象
  var o = new C()
  // true，true --> C.prototype 在 o 的原型链上
  console.log(o instanceof C, o.__proto__ === C.prototype, '此时 o 的 __proto__：', o.__proto__, '此时 C 的 prototype：', C.prototype)
  // false，false --> D.prototype 不在 o 的原型链上
  console.log(o instanceof D, o.__proto__ === D.prototype)
  // true true --> Object.prototype 在 o 的原型链上
  console.log(o instanceof Object, o.__proto__.__proto__ === Object.prototype)
  // 这时我们修改构造函数 C 的原型为一个空对象
  C.prototype = {}
  // 实例化一个 o2 对象
  var o2 = new C()
  // true --> C.prototype 在 o2 的原型链上
  console.log(o2 instanceof C)
  // false，C.prototype 指向了一个空对象,这个空对象不在 o 的原型链上.
  console.log(o instanceof C, '此时 o 的 __proto__：', o.__proto__, '此时 C 的 prototype：', C.prototype)
  console.log('此时 D 的 prototype：', D.prototype);
  // 继承
  D.prototype = new C()
  console.log('此时 D 的 prototype：', D.prototype);
  var o3 = new D()
  // true, true --> 因为 o3 是 构造函数 D new 出来的实例对象，所以 D.prototype 一定在 o3 的原型链上
  console.log(o3 instanceof D, o3.__proto__ === D.prototype)
  // true --> 因为 C.prototype 现在在 o3 的原型链上
  console.log(o3 instanceof C)
  // true,true --> 上面的结果为什么为 true 呢，看如下代码，D.prototype 是 构造函数 C new 出来的实例对象，所以 C.prototype 一定在 D.prototype 的原型链上
  console.log(o3.__proto__ === D.prototype, D.prototype.__proto__ === C.prototype);
  // true 相当于如下代码
  console.log(o3.__proto__.__proto__ === C.prototype);

3. constructor
  constructor 原型对象的一个默认属性存在，表示创建实例的构造函数的引用。

  console.log((1).constructor);//function Number()
  console.log(('你好').constructor);//function String()
  console.log((true).constructor);//function Boolean()
  console.log((function () { }).constructor );//function Function()
  console.log(({}).constructor);//function Object()
  console.log(([]).constructor);//function Array()
  console.log((/\d/).constructor);//function RegExp()

4. Object.prototype.toString.call()

  console.log(Object.prototype.toString.call(123).slice(8, - 1));//Number
  console.log(Object.prototype.toString.call(123));//[object Number]
  console.log(Object.prototype.toString.call('你好'));//[object String]
  console.log(Object.prototype.toString.call(undefined));//[object Undefined]
  console.log(Object.prototype.toString.call(null));//[object Null]
  console.log(Object.prototype.toString.call(function () { }));
  //[object Function]
  console.log(Object.prototype.toString.call([]));//[object Array]
  console.log(Object.prototype.toString.call({}));//[object Object]
  console.log(Object.prototype.toString.call(/\d/));//[object RegExp]