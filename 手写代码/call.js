/**
 * 原理：传入的对象上创建一个唯一的key，value为执行函数对象即是this，然后执行函数，执行完毕后删除该key，并返回执行结果
 */
Function.prototype._call = function (ctx, ...args) {
  const obj = ctx || window;
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
