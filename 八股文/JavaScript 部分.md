#### 1. JavaScript 有哪些数据类型，它们的区别  
JavaScript 共有八种数据类型，分别是 Undefined、Null、Boolean、Number、String、Object、Symbol、BigInt。  
其中 Symbol 和 BigInt 是 ES6 中新增的数据类型：
* Symbol 代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现的全局变量冲突的问题。
* BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。  
   
这些数据可以分为原始数据类型和引用数据类型：
* 栈：原始数据类型（Undefined、Null、Boolean、Number、String）
* 堆：引用数据类型（对象、数组和函数

两种类型的区别在于存储位置的不同：  
* 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
* 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。   

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：
* 在数据结构中，栈中数据的存取方式为先进后出。
* 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定

在操作系统中，内存被分为栈区和堆区： 
* 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
* 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收 。

#### 2. 数据类型检测的方式有哪些 
（1）typeof 其中数组、对象、null 都会被判断为 object，其他判断都正确  
（2）instanceof 可以正确判断对象的类型，其内部运行机制是判断在其原型链中能否找到该类型的原型。    
（3） constructo 有两个作用，一是判断数据的类型，二是对象实例通过constrcutor 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，constructor 就不能用来判断数据类型了：    
（4）Object.prototype.toString.call() 使用 Object 对象的原型方法toString 来判断数据类型   

同样是检测对象 obj 调用 toString 方法，obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样，这是为什
么？  
这是因为 toString 是 Object 的原型方法，而 Array、function 等类型作为 Object 的实例，都重写了 toString 方法。不同的对象类型调用 toString 方法时，根据原型链的知识，调用的是对应的重写之后的 toString 方法（function 类型返回内容为函数体的字符串，Array类型返回元素组成的字符串…），而不会去调用 Object 上原型toString 方法（返回对象的具体类型），所以采用 obj.toString()不能得到其对象类型，只能将 obj 转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用 Object 原型上的 toString 方法。

#### 3. null 和 undefined 区别
首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型分别都只有一个值，就是 undefined 和 null。  
undefined 代表的含义是未定义，null 代表的含义是空对象。   
一般变量声明了但还没有定义的时候会返回 undefined，null 主要用于赋值给一些可能会返回对象的变量，作为初始化。   
undefined 在 JavaScript 中不是一个保留字，这意味着可以使用undefined 来作为一个变量名，但是这样的做法是非常危险的，它会影响对 undefined 值的判断。  
我们可以通过一些方法获得安全的undefined 值，比如说 void 0。   
当对这两种类型使用 typeof 进行判断时，Null 类型化会返回“object”，这是一个历史遗留的问题。当使用双等号对两种类型的值进行比较时会返回 true，使用三个等号时会返回 false

#### 4. intanceof 操作符的实现原理及实现
instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。
```javascript
function myInstanceof(left, right) {
      // 获取对象的原型
      let proto = Object.getPrototypeOf(left);
      // 获取构造函数的 prototype 对象
      let prototype = right.prototype;
      // 判断构造函数的 prototype 对象是否在对象的原型链上
      while (true) {
        console.log(proto);
        if (!proto) return false;
        if (proto === prototype) return true;
        // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
        proto = Object.getPrototypeOf(proto);
      }
    }
    console.log(myInstanceof([], Array));
```

#### 5. 如何获取安全的 undefined 值？
因为 undefined 是一个标识符，所以可以被当作变量来使用和赋值，但是这样会影响 undefined 的正常判断。表达式 void ___ 没有返回值，因此返回结果是 undefined。void 并不改变表达式的结果，只是让表达式不返回值。因此可以用 void 0 来获得 undefined。

#### 6. Object.is() 与比较操作符 “===”、“==” 的区别？
* 使用双等号（==）进行相等判断时，如果两边的类型不一致，则会进行强制类型转化后再进行比较。
* 使用三等号（===）进行相等判断时，如果两边的类型不一致时，不会做强制类型准换，直接返回 false
* 使用 Object.is 来进行相等判断时，一般情况下和三等号的判断相同，它处理了一些特殊的情况，比如 -0 和 +0 不再相等，两个 NaN 是相等的
  
#### 7. 什么是 JavaScript 中的包装类型？
在 JavaScript 中，基本类型是没有属性和方法的，但是为了便于操作基本类型的值，在调用基本类型的属性或方法时 JavaScript 会在后台隐式地将基本类型的值转换为对象，如：
```javascript
const a = "abc"
console.log(a.length);//3
console.log(a.toUpperCase());//ABC
```
a是一个String数据类型，它是基本数据类型并没有可以添加属性的功能，这时可以把它变成一个引用数据类型Object就可以添加新的属性。
```javascript
console.log(new String(a));
console.log(Object(a));

```   
然后他就有length和toUpperCase属性等等    
也可以用valueOf方法将包装类型倒转成基本类型：
```javascript
let a = "abc"
let b = Object(a)
let c = b.valueOf(b)
console.log(c);//abc

```

#### 8. 为什么会有 BigInt 的提案？
JavaScript 中 Number.MAX_SAFE_INTEGER 表示最⼤安全数字，计算结果是 9007199254740991，即在这个数范围内不会出现精度丢失（⼩数除外）。但是⼀旦超过这个范围，js 就会出现计算不准确的情况，这在⼤数计算的时候不得不依靠⼀些第三⽅库进⾏解决，因此官⽅提出了 BigInt 来解决此问题

#### 9. 如何判断一个对象是空对象
```javascript
// 使用 JSON 自带的.stringify 方法来判断
JSON.stringify(Obj) == '{}'

// 使用 ES6 新增的方法 Object.keys()来判断
Object.keys(obj).length <= 0
```

#### 10. const 对象的属性可以修改吗
const 保证的并不是变量的值不能改动，而是变量指向的那个内存地址不能改动。对于基本类型的数据（数值、字符串、布尔值），其值就保存在变量指向的那个内存地址，因此等同于常量。但对于引用类型的数据（主要是对象和数组）来说，变量指向数据的内存地址，保存的只是一个指针，const 只能保证这个指针是固定不变的，至于它指向的数据结构是不是可变的，就完全不能控制了。

#### 11. 如果 new 一个箭头函数的会怎么样
箭头函数是ES6中的提出来的，它没有prototype，也没有自己的this指向，更不可以使用 arguments 参数，所以不能 New 一个箭头函数。  
new 操作符的实现步骤如下：  
1. 创建一个对象
2. 将构造函数的作用域赋给新对象（也就是将对象的__proto__属性指向构造函数的 prototype 属性）
3. 指向构造函数中的代码，构造函数中的 this 指向该对象（也就是为这个对象添加属性和方法）
4. 返回新的对象
所以，上面的第二、三步，箭头函数都是没有办法执行的。

#### 12. 箭头函数的 this 指向哪⾥？
箭头函数不同于传统 JavaScript 中的函数，箭头函数并没有属于⾃⼰的 this，它所谓的 this 是捕获其所在上下⽂的 this 值，作为⾃⼰的 this 值，并且由于没有属于⾃⼰的 this，所以是不会被 new调⽤的，这个所谓的 this 也不会被改变

#### 13. 扩展运算符的作用及使用场景
1. 对象扩展运算符-对象的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中。等价于:Object.assign 方法用于对象的合并.将源对象（source）的所有可枚举属性，复制到目标对象（target）。Object.assign 方法的第一个参数是目标对象，后面的参数都是源对象。(如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性)。   
`需要注意`：扩展运算符对对象实例的拷贝属于浅拷贝。
2. 数组扩展运算符-数组的扩展运算符可以将一个数组转为用逗号分隔的参数序列，且每次只能展开一层数组。

#### 14. Proxy 可以实现什么功能
在 Vue3.0 中通过 Proxy 来替换原本的 Object.defineProperty来实现数据响应式。Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。
```javascript
let p = new Proxy(target, handler)
```
代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。   
Vue 中的响应式，需要在 get 中收集依赖，在 set 派发更新，之所以 Vue3.0 要使用Proxy 替换原本的 API 原因在于 Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 Proxy 可以完美监听到任何方式的数据改变，唯一缺陷就是浏览器的兼容性不好。
   
#### 16. 对 JSON 的理解
JSON 是一种基于文本的轻量级的数据交换格式。它可以被任何的编程语言读取和作为数据格式来传递。在项目开发中，使用 JSON 作为前后端数据交换的方式。在前端通过将一个符合 JSON 格式的数据结构序列化为JSON 字符串，然后将它传递到后端，后端通过 JSON 格式的字符串解析后生成对应的数据结构，以此来实现前后端数据的一个传递。  
在 js 中提供了两个函数来实现 js 数据结构和 JSON 格式的转换处理    
* JSON.stringify 函数，通过传入一个符合 JSON 格式的数据结构，将其转换为一个 JSON 字符串。如果传入的数据结构不符合 JSON 格式，那么在序列化的时候会对这些值进行对应的特殊处理，使其符合规范。在前端向后端发送数据时，可以调用这个函数将数据对象转化为 JSON 格式的字符串。    

* JSON.parse() 函数，这个函数用来将 JSON 格式的字符串转换为一个 js 数据结构，如果传入的字符串不是标准的 JSON 格式的字符串的话，将会抛出错误。当从后端接收到 JSON 格式的字符串时，可以通过这个方法来将其解析为一个 js 数据结构，以此来进行数据的访问。

#### 17. JavaScript 脚本延迟加载的方式有哪些？
延迟加载就是等页面加载完成之后再加载 JavaScript 文件。js 延迟加载有助于提高页面加载速度。   
一般有以下几种方式：
* defer 属性：给 js 脚本添加 defer 属性，这个属性会让脚本的加载与文档的解析同步解析，然后在文档解析完成后再执行这个脚本文件，这样的话就能使页面的渲染不被阻塞。多个设置了 defer 属性的脚本按规范来说最后是顺序执行的，但是在一些浏览器中可能不是这样。    
* async 属性：给 js 脚本添加 async 属性，这个属性会使脚本异步加载，不会阻塞页面的解析过程，但是当脚本加载完成后立即执行 js脚本，这个时候如果文档没有解析完成的话同样会阻塞。多个 async属性的脚本的执行顺序是不可预测的，一般不会按照代码的顺序依次执行。
* 动态创建 DOM 方式：动态创建 DOM 标签的方式，可以对文档的加载事件进行监听，当文档加载完成后再动态的创建 script 标签来引入js 脚本。
* 使用 setTimeout 延迟方法：设置一个定时器来延迟加载 js 脚本文件
* 让 JS 最后加载：将 js 脚本放在文档的底部，来使 js 脚本尽可能的在最后来加载执行。

#### 18. 什么是 DOM 和 BOM？
* DOM 指的是文档对象模型，它指的是把文档当做一个对象，这个对象主要定义了处理网页内容的方法和接口。
* BOM 指的是浏览器对象模型，它指的是把浏览器当做一个对象来对待，这个对象主要定义了与浏览器进行交互的法和接口。BOM 的核心是window，而 window 对象具有双重角色，它既是通过 js 访问浏览器窗口的一个接口，又是一个 Global（全局）对象。这意味着在网页中定义的任何对象，变量和函数，都作为全局对象的一个属性或者方法存在。window 对象含有 location 对象、navigator对象等子对象，并且 DOM 的最根本的对象 document 对象也是 BOM的 window

#### 19. escape、encodeURI、encodeURIComponent 的区别
* encodeURI 是对整个 URI 进行转义，将 URI 中的非法字符转换为合法字符，所以对于一些在 URI 中有特殊意义的字符不会进行转义。
* encodeURIComponent 是对 URI 的组成部分进行转义，所以一些特殊字符也会得到转义。
* escape 和 encodeURI 的作用相同，不过它们对于 unicode 编码为0xff 之外字符的时候会有区别，escape 是直接在字符的 unicode编码前加上 %u，而 encodeURI 首先会将字符转换为 UTF-8 的格式，再在每个字节前加上 %

#### 20. 对 AJAX 的理解，实现一个 AJAX 请求
AJAX 是 Asynchronous JavaScript and XML 的缩写，指的是通过JavaScript 的 异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。  
创建 AJAX 请求的步骤：  
创建一个 XMLHttpRequest 对象。  
在这个对象上使用 open 方法创建一个 HTTP 请求，open 方法所需要的参数是请求的方法、请求的地址、是否异步和用户的认证信息。  
在发起请求前，可以为这个对象添加一些信息和监听函数。比如说可以通过 setRequestHeader 方法来为请求添加头信息。还可以为这个对象添加一个状态监听函数。一个 XMLHttpRequest 对象一共有 5个状态，当它的状态变化时会触发 onreadystatechange 事件，可以通过设置监听函数，来处理请求成功后的结果。当对象的 readyState变为 4 的时候，代表服务器返回的数据接收完成，这个时候可以通过判断请求的状态，如果状态是 2xx 或者 304 的话则代表返回正常。
这个时候就可以通过 response 中的数据来对页面进行更新了。当对象的属性和监听函数设置完成后，最后调用 sent 方法来向服务器发起请求，可以传入参数作为发送的数据体。
```javascript
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", url, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);

```
```javascript
// promise 封装实现：
function getJSON(url) {
  // 创建一个 promise 对象
  let promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    // 新建一个 http 请求
    xhr.open("GET", url, true);
    // 设置状态的监听函数
    xhr.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    // 设置错误监听函数
    xhr.onerror = function() {
      reject(new Error(this.statusText));
    };
    // 设置响应的数据类型
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送 http 请求
    xhr.send(null);
  });
  return promise;
}

```

#### 21. 什么是尾调用，使用尾调用有什么好处？
尾调用指的是函数的最后一步调用另一个函数。代码执行是基于执行栈的，所以当在一个函数里调用另一个函数时，会保留当前的执行上下文，然后再新建另外一个执行上下文加入栈中。使用尾调用的话，因为已经是函数的最后一步，所以这时可以不必再保留当前的执行上下文，从而节省了内存，这就是尾调用优化。但是 ES6 的尾调用优
化只在严格模式下开启，正常模式是无效的.

### 22. ES6 模块与 CommonJS 模块有什么异同?
* ES6 Module 和 CommonJS 模块的区别：   
CommonJS 是对模块的浅拷⻉，ES6 Module 是对模块的引⽤，即 ES6 Module 只存只读，不能改变其值，也就是指针指向不能变，类似 const；import 的接⼝是 read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对commonJS 对重新赋值（改变指针指向），但是对 ES6 Module 赋值会编译报错。
* ES6 Module 和 CommonJS 模块的共同点：   
CommonJS 和 ES6 Module 都可以对引⼊的对象进⾏赋值，即对对象内部属性的值进⾏改变。
