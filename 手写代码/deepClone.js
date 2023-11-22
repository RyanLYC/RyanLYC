// 1. JSON.parse(JSON.stringfy(obj))  满足大部分 需求，当存在 function ,  new Date(),  RegExp的时候 就不适合 使用。
// 2. 使用 递归方法 实现。  // 可以 使用lodash 库 里面的 深克隆

function deepClone(obj) {
  if (typeof obj !== "object") return obj;

  if (obj instanceof RegExp) return new RegExp(obj);

  if (obj instanceof Date) return new Date(obj);

  let cloneObj = new obj.constructor(); // new 这个实例化对象的类

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }

  return cloneObj;
}
