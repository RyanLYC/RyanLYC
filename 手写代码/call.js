/**
 * 原理是创建新对象，在对象上创建一个唯一的key，value为执行函数对象，然后用这个value执行函数，那么this指向就是该对象
 */
Function.prototype._call = function (ctx, ...args) {
  const obj = ctx ? Object(ctx) : window;
  const key = Symbol();
  obj[key] = this;
  const result = obj[key](...args);
  delete obj[key];
  return result;
};

var name = "lyc";
const obj = {
  name: "Ryan",
};
function foo() {
  console.dir(this);
  console.log(this.name);
}
foo._call(undefined);
foo.call(undefined);
foo._call(null);
foo.call(null);
foo._call(obj);
foo.call(obj);
