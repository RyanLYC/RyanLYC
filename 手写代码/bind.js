/**
 * 原理是接收外部this，然后返回一个新的函数，函数内部返回用接收的this执行call的结果；然后再复制原型
 */
Function.prototype._bind = function (ctx, ...args) {
  const _self = this;
  const newFun = function (...args2) {
    return _self.call(ctx, ...args, ...args2);
  };
  if (_self.prototype) {
    newFun.prototype = Object.create(_self.prototype);
  }
  return newFun;
};
