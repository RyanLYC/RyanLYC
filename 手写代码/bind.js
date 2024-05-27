/**
 * 原理是返回一个新的函数，函数内部返回用call、apply执行的结果；然后新函数要复制调用者的原型
 */
Function.prototype._bind = function (ctx, ...args) {
  const _self = this; // this 指向的是调用bind的对象，即是需要执行的函数
  const newFun = function (...args2) {
    return _self.call(ctx, ...args, ...args2);
  };
  if (_self.prototype) {
    newFun.prototype = Object.create(_self.prototype);
  }
  return newFun;
};
