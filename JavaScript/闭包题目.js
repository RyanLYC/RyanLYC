// alert 输出的 都是 字符串 如果输出是一个 Object 会是 [object Object];

var test = (function (i) {
  return function () {
    alert((i *= 2));
  };
})(2);
test(5);

/**
 * test 是一个自执行函数
 * 返回的是 function () {
    alert((i *= 2));
  } 其中i = 2

  test(5);传入参数 但是 参数没用  弹窗输出 '4'
 */

var a = 0,
  b = 0;
function A(a) {
  A = function (b) {
    alert(a + b++);
  };
  alert(a++);
}

A(1); // '1'
A(2); // '4'

/** 
 * 执行函数A的时候 传入的参数是 1 那么函数内部 a = 1
 * 所有第一个输出的是 1 然后 a = 2 ； ++在后面是先运算后才 自加1
 * 此时函数 A被 改变为 function (b) {
    alert(a + b++);
  }; 其中 a = 2
 * A（2）
 * 所以是 4  然后 b = 3

 */
