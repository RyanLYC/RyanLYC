不是数组，是一个类数组对象。

````js
    var arguments = {
      length: 2,
      0: 1,
      1: "name",
    };
    // 使用数组的函数的方式
    [].push.call(arguments, "abc");
    Array.prototype.push.call(arguments, "abc");
    ```
````
