/**
 * 原理：传入的对象上创建一个唯一的key，value为执行函数对象即是this，然后执行函数，执行完毕后删除该key，并返回执行结果
 */
Function.prototype._apply = function (ctx, array = []) {
  const obj = ctx ? Object(ctx) : window;
  const key = Symbol();
  obj[key] = this; // this 指向的是调用call的对象，即是需要执行的函数
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
