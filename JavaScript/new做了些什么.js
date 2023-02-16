/**
 * 创建一个全新对象，并将其__proto__属性指向构造函数的prototype属性。
将构造函数调用的this指向这个新对象，并执行构造函数。
如果构造函数返回对象类型Object(包含Functoin, Array, Date, RegExg, Error等)，则正常返回，否则返回这个新的对象。
 */

// 模拟实现
function create(Con, ...args) {
  // 创建一个空的对象
  let obj = Object.create(null);
  // 将空对象指向构造函数的原型链
  Object.setPrototypeOf(obj, Con.prototype);
  // obj绑定到构造函数上，便可以访问构造函数中的属性，即obj.Con(args)
  let result = Con.apply(obj, args);
  // 如果返回的result是一个对象则返回
  // new方法失效，否则返回obj
  return result instanceof Object ? result : obj;
}

// 测试
function company(name, address) {
  this.name = name;
  this.address = address;
}

var company1 = create(company, "yideng", "beijing");
console.log("company1: ", company1);

/**
 * ES5提供的Object.create()方法，会创建一个新对象，第一个参数接收一个对象，将会作为新创建对象的原型对象，第二个可选参数是属性描述符（不常用，默认是undefined）
 */
//模拟一个简易版的Object.create
function createObj(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
