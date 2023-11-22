// 使用自带接口trim()，考虑兼容性：
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
  };
}

for (var i = 1; i <= 3; ++i) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
// 4 4 4

// let 是块作用域
for (let i = 1; i <= 3; ++i) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
// 1 2 3
