/**
 * 原理是创建新对象，在对象上创建一个唯一的key，value为执行函数对象，然后用这个value执行函数，那么this指向就是该对象
 */
Function.prototype._apply = function (ctx, array = []) {
  const obj = ctx ? Object(ctx) : window;
  const key = Symbol();
  obj[key] = this;
  const result = obj[key](...array);
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
foo._apply(undefined);
foo.apply(undefined);
foo._apply(null);
foo.apply(null);
foo._apply(obj);
foo.apply(obj);
