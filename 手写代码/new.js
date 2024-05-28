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

// 方式2
function objectFactory() {
  var obj = new Object();
  var Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;

  const result = Constructor.apply(obj, arguments);
  return result instanceof Object ? result : obj;
}
