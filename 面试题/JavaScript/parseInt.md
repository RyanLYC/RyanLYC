- ['1', '2', '3'].map(parseInt) // 1 NaN NaN

- ['10','10','10','10','10'].map(parseInt);
// [10, NaN, 2, 3, 4]

`parseInt(string[, radix])` 函数解析一个字符串参数，并返回一个指定基数的整数

`string` 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。

`radix` 一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的基数。默认为10。 返回值 返回一个整数或NaN

等价于执行
```javascript
['10','10','10','10','10'].map((item, index) => {
	return parseInt(item, index)
})
parseInt(10, 0) // 10
parseInt(10, 1) // 1进制 不存在 10  NaN
parseInt(10, 2) // 2进制 2
parseInt(10, 3) // 3进制 3
parseInt(10, 4) // 4进制 4
```