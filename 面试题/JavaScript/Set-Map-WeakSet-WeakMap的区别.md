Set 和 Map 主要的应用场景在于 数据重组 和 数据储存   

Set 是一种叫做集合的数据结构，Map 是一种叫做字典的数据结构  

### 1. 集合（Set）
ES6 新增的一种新的数据结构，类似于数组，但成员是唯一且无序的，没有重复的值。  

Set 本身是一种构造函数，用来生成 Set 数据结构。  
```javascript
const s = new Set()
[1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))

for (let i of s) {
    console.log(i)	// 1 2 3 4
}

// 去重数组的重复对象
let arr = [1, 2, 3, 2, 1, 1]
[... new Set(arr)]	// [1, 2, 3]
```

Set 对象允许你储存任何类型的唯一值，无论是原始值或者是对象引用。  

向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是`NaN等于自身，而精确相等运算符认为NaN不等于自身。`  
```javascript
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

let set1 = new Set()
set1.add(5)
set1.add('5')
console.log([...set1])	// [5, "5"]
```

#### 遍历方法（遍历顺序为插入顺序）
* keys()：返回一个包含集合中所有键的迭代器

* values()：返回一个包含集合中所有值得迭代器

* entries()：返回一个包含Set对象中所有元素得键值对迭代器

* forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，回调中的this会是这个参数，没有返回值
```javascript
let set = new Set([1, 2, 3])
console.log(set.keys())	// SetIterator {1, 2, 3}
console.log(set.values())	// SetIterator {1, 2, 3}
console.log(set.entries())	// SetIterator {1, 2, 3}

for (let item of set.keys()) {
  console.log(item);
}	// 1	2	 3
for (let item of set.entries()) {
  console.log(item);
}	// [1, 1]	[2, 2]	[3, 3]

set.forEach((value, key) => {
    console.log(key + ' : ' + value)
})	// 1 : 1	2 : 2	3 : 3
console.log([...set])	// [1, 2, 3]
```
Set可以使用 map、filter 方法  
因此，Set 很容易实现交集（Intersect）、并集（Union）、差集（Difference）  
```javascript
let set1 = new Set([1, 2, 3])
let set2 = new Set([4, 3, 2])

let intersect = new Set([...set1].filter(value => set2.has(value)))
let union = new Set([...set1, ...set2])
let difference = new Set([...set1].filter(value => !set2.has(value)))

console.log(intersect)	// Set {2, 3}
console.log(union)		// Set {1, 2, 3, 4}
console.log(difference)	// Set {1}
```

### 2. WeakSet
WeakSet 对象允许你将弱引用对象储存在一个集合中  

WeakSet 与 Set 的区别：  

* WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
* WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素

```javascript
const arr = [[1, 2], [3, 4]]
const weakset = new WeakSet(arr)
console.log(weakset)
```

方法：  

* add(value)：在WeakSet 对象中添加一个元素value
* has(value)：判断 WeakSet 对象中是否包含value
* delete(value)：删除元素 value
* clear()：清空所有元素，注意该方法已废弃

### 3. 字典（Map）
集合 与 字典 的区别：

* 共同点：集合、字典 可以储存不重复的值
* 不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存

```javascript
const m = new Map()
const o = {p: 'haha'}
m.set(o, 'content')
m.get(o)	// content

m.has(o)	// true
m.delete(o)	// true
m.has(o)	// false

/// 任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数，例如：
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3

// 如果读取一个未知的键，则返回undefined。
new Map().get('asfddfsasadf')
// undefined

// 注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined  因为 ['a']是两个对象 不同的内存地址
```
操作方法：  
* set(key, value)：向字典中添加新元素
* get(key)：通过键查找特定的数值并返回
* has(key)：判断字典中是否存在键key
* delete(key)：通过键 key 从字典中移除对应的数据
* clear()：将这个字典中的所有元素删除

遍历方法  
* Keys()：将字典中包含的所有键名以迭代器形式返回
* values()：将字典中包含的所有数值以迭代器形式返回
* entries()：返回所有成员的迭代器
* forEach()：遍历字典的所有成员

### 4. WeakMap
WeakMap 对象是一组键值对的集合，其中的键是弱引用对象，而值可以是任意。  

`注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。`  

WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。

### 5. 总结
#### Set
* 成员唯一、无序且不重复
* [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
* 可以遍历，方法有：add、delete、has
#### WeakSet
* 成员都是对象
* 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
* 不能遍历，方法有add、delete、has
#### Map
* 本质上是键值对的集合，类似集合
* 可以遍历，方法很多可以跟各种数据格式转换
#### WeakMap
* 只接受对象作为键名（null除外），不接受其他类型的值作为键名
* 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
* 不能遍历，方法有get、set、has、delete