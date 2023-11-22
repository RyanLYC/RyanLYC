### meta 标签:自动刷新/跳转
跳转   
```html
<meta http-equiv="Refresh" content="5; URL=page2.html">   
```  
自动刷新   
```html
<meta http-equiv="Refresh" content="60">  
```

### 性能优化
#### JS
1. script 标签:调整加载顺序提升渲染速度
渲染引擎在解析HTML时，若遇到 script 标签引用文件则会暂停解析过程，同时通知网络线程加载文件，文件加载后会切换至JavaScript引警来执行对应代码，代码执行完成之后切换至渲染引擎继续渲染页面。   
script 标签: 调整加载顺序提升染速度 - script 标签的3个属性    
- async属性一一立即请求文件，但不阻塞渲染引擎，文件加载完毕后阻塞渲染引擎并立即执行文件内容
- defer 属性一一立即请求文件，但不阻塞染引擎，等到解析完 HTML 之后再执行文件内容
- HTML5标准type属性--对应值为“module”，让浏览器按照ECMAScript6标准将文件当作模块进行解析，默认阻塞效果同 defer也可以配合async在请求完成后立即执行

2. js 代码放入body标签底部

#### link 标签:通过预处理提升染速度
1. dns-prefetch - 当link标签的rel属性值为“dns-prefetch”时，浏览器会对某个域名预先进行DNS解析并缓存
2. preconnect - 让浏览器在一个HTTP 请求正式发给服务器前预先执行一些操作包括DNS解析、TLS协商、TCP 握手，通过消除往返延迟来为用户节省时间
3. prefetch/preload - 两个值都是让浏览器预先下载并缓存某个资源，但不同的是prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载
4. prerender - 浏览器不仅会加载资源，还会解析执行页面，进行预渲染

### 搜索优化
#### meta标签 - 提取关键信息
<meta  content="关键字,关键字" name="keywords">  
推荐使用一些关键字工具来挑选比如 Google Trends、站长工具

#### link标签 减少重复
对于同一个页面会有多个网址，又或者存在某些重定向页面，比如:   
```html
https://xx.com/a.html   
https://xx.com/detail?id="abcd"   

<link href="https://xx.com/a.html" rel="canonical">    
```

合共网址的方式。比如使用站点地图，或者在HTTP 请求响应头部添加 rel="canonical"  

### OGP (Open Graph Protocal，开放图表协议)
OGP 是 Facebook 公司在 2010 年提出的    
目的是通过增加文档信息来提升社交网页在被分享时的预览效果,只需要在一些分享页面中添加一些 meta 标签及属性,支持OGP协议的社交网站就会在解析页面时生成丰富的预览信息   
比如站点名称、网页作者、预览图片   

官网： 官方网站: https://ogp.mel

### 如何高效操作DOM
DOM (Document Object Model，文档对象模型)是JavaScript操作HTML的接口(这里只讨论属于前端范畴的 HTMLDOM)属于前端的入门知识，同样也是核心内容，因为大部分前端功能都需要借助DOM来实现
1. DOM 节点概念区分
- 标签是HTML的基本单位，比如 p、div、input
- 节点是 DOM 树的基本单位，有多种类型，比如注释节点、文本节点
- 元素是节点中的一种，与 HTML标签相对应，比如p标签会对应p元素

<p>亚里士朱德</p>   

- "p"是标签，生成 DOM 树的时候会产生两个节点
* 元素节点 p
* 字符串为“亚里士朱德”的文本节点

2. DOM 操作耗时 因为 两个引擎 渲染引起 & js引擎
   两个引擎是互斥的 多次引擎切换 耗时

3. 重新渲染
- 渲染过程中最耗时的两个步骤为重排 (Reflow) 与重绘 (Repaint)
- 渲染页面时会将HTML和CSS 分别解析成DOM树和CSSOM 树然后合并进行排布，再绘制成我们可见的页面，如果在操作 DOM 时涉及到元素、样式的修改就会引起渲染引擎重新计算样式生成CSSOM树，同时还有可能触发对元素的重新排布 (简称“重排”)和重新绘制(简称“重绘”)    
影响到其他元素排布的操作就会引起重排，继而引发重绘   
比如:
* 修改元素边距、大小
* 添加、删除元素
* 改变窗口大小
重绘
* 设置背景图片
* 修改字体颜色
* 改变visibility 属性值

#### 总结
* 尽量不要使用复杂的匹配规则和复杂的样式从而减少渲染引擎计算样式规则生成CSSOM树的时间
* 尽量减少重排和重绘影响的区域
* 使用CSS3特性来实现动画效果

### DOM事件
1. 防抖
2. 节流

### CSS
* HTML 标签决定了页面的逻辑结构
* CSS决定了页面的视觉结构

CSS提供了import 命令支持文件引用但由于其存在一些问题(比如影响浏览器并行下载、加载顺序错乱等)导致使用率极低   
更常见的做法是通过预处理器或编译工具插件来引入样式文件   

### 浏览器渲染页面
1. 字节流解码
2. 输入流预处理 -  解码后进行预处理，比如换行符转换，生产规范化的字符流数据
3. 令牌化 - 
4. 解释HTML生成DOM树
5. 从CSS到CSSOM  
CSS解析的过程与HTML解析过程步骤一致，最终也会生成树状结构   
CSSOM 树的节点具有继承特性也就是会先继承父节点样式作为当前样式，然后再进行补充或覆盖    
6. 构建渲染树
DOM树包含的结构内容与CSSOM树包含的样式规则都是独立的为了更方便渲染，先需要将它们合并成一棵渲染树
7. 布局 - 布局就是计算元素的大小及位置
8. 绘制 - 绘制就是将渲染树中的每个节点转换成屏幕上的实际像素的过程

### HTTP协议
HTTP/1.0每进行一次通信都需要经历`建立连接`、`传输数据`和`断开连接`三个阶段当一个页面引用了较多的外部文件时这个建立连接和断开连接的过程就会增加大量网络开销,1999年推出的HTTP/11版本增加了一个创建持久连接的方法

#### 三次握手
1. 客服端 closed状态 -> 发送SNY报文和客户端的ISN  -> 服务端 Listen状态
2. 客服端 SYN_SEND状态 <- 发送ACK/SNY报文和客户端的ISN+1,服务端的ISN  <- 服务端 SYN_SEND状态
3. 客服端 ESTABLISHED状态 -> 发送ACK报文和服务端的ISN+1  -> 服务端 ESTABLISHED状态

#### 为什么需要三次握手
- 第一次握手成功让服务端知道了客户端具有发送能力
- 第二次握手成功让客户端知道了服务端具有接收和发送能力
- 第三次握手成功让服务端知道客户端是否接收到了自己发送的消息

#### 四次挥手
1. 客服端 ESTABLISHED状态 -> FIN报文 -> 服务端 ESTABLISHED状态
2. 客服端 FIN_WAIT_1状态 <- ACK报文 <- 服务端 Close_Wait状态
3. 客服端 FIN_WAIT_2状态 <- FIN报文 <- 服务端LAST_ACK状态
4. 客服端 FCLOSED状态 ->ACK报文 -> 服务端 Close_Wait状态

#### 为什么需要四次挥手
当服务端收到客户端的 FIN 报文后，发送的ACK 报文只是用来应答的并不表示服务端也希望立即关闭连接
当只有服务端把所有的报文都发送完了，才会发送FIN 报文告诉客户端可以断开连接了

#### HTTP2 - 使用二进制分帧机制 + HTTPS 加密传输
- 浏览器为了减轻服务器的压力，限制了同一个域下的 HTTP 连接数即6~8个，所以在HTTP/1.1下很容易看到资源文件等待加载的情况,对应优化的方式就是使用多个域名来加载图片资源
- HTTP/1.1本身的问题虽然HTTP/1.1中使用持久连接时，多个请求能共用一个 TCP连接但在一个连接中同一时刻只能处理一个请求,在当前的请求没有结束之前，其他的请求只能处于阻塞状态这种情况被称为`队头阻塞`

### 加快浏览器加载网络资源
- 使用gzip算法压缩响应体内容和HTTP/2的压缩头部功能
- 另一种更通用也更为重要的技术就是使用缓存

#### HTTP 缓存
使用缓存最大的问题往往不在于将资源缓存在什么位置或者如何读写资源，而在于如何保证缓存与实际资源一致的同时提高缓存的命中率，也就是说尽可能地让浏览器从缓存中获取资源，但同时又要保证被使用的缓存与服务端最新的资源保持一致，HTTP支持的缓存策略有两种:`强制缓存`和`协商缓存`

`强制缓存`是在浏览器加载资源的时候先直接从缓存中查找请求结果,如果不存在该缓存结果，则直接向服务端发起请求

1. Expires - HTTP/1.0中可以使用响应头部字段Expires 来设置缓存时间它对应一个未来的时间戳,客户端第一次请求时，服务端会在响应头部添加 Expires 字段当浏览器再次发送请求时，先会对比当前时间和 Expires 对应的时间如果当前时间早于Expires 时间，那么直接使用缓存反之，需要再次发送请求.`因为服务器时间和客户端时间不一致导致可以修改客户端时间使用或者不准确`
2. Cache-Control
- no-cache，表示使用协商缓存，即每次使用缓存前必须向服务端确认缓存资源是否更新
- no-store，禁止浏览器以及所有中间缓存存储响应内容
- public，公有缓存，表示可以被代理服务器缓存，可以被多个用户共享
- private，私有缓存，不能被代理服务器缓存，不可以被多个用户共享
- max-age，以秒为单位的数值，表示缓存的有效时间
- must-revalidate，当缓存过期时，需要去服务端校验缓存的有效性

`协商缓存`的更新策略是不再指定缓存的有效时间了,而是浏览器直接发送请求到服务端进行确认缓存是否更新,如果请求响应返回的HTTP 状态为304,则表示缓存仍然有效,控制缓存的难题就是从浏览器端转移到了服务端
1. Last-Modified 和lf-Modified-Since
- 浏览器第一次请求资源，服务端在返回资源的响应头中加入Last-Modified 字段,该字段表示这个资源在服务端上的最近修改时间
- 当浏览器再次向服务端请求该资源时，请求头部带上之前服务端返回的修改时间这个请求头叫If-Modified-Since
- 服务端再次收到请求，根据请求头if-Modified-Since 的值，判断相关资源是否有变化如果没有则返回 304 Not Modified，并且不返回资源内容，浏览器使用资源缓存值否则正常返回资源内容，且更新 Last-Modified 响应头内容

`精度问题`-Last-Modified 的时间精度为秒，如果在1秒内发生修改，那么缓存判断可能会失效    
`准度问题`如果一个文件被修改，然后又被还原，内容并没有发生变化在这种情况下，浏览器的缓存还可以继续使用但因为修改时间发生变化，也会重新返回重复的内容

2. ETag 和 If-None-Match为了解决精度问题和准度问题HTTP提供了另一种不依赖于修改时间而依赖于文件哈希值的精确判断缓存的方式,那就是响应头部字段 ETag 和请求头部字段 If-None-Match
- 浏览器第一次请求资源，服务端在返响应头中加入 Etag 字段,Etag字段值为该资源的哈希值
- 当浏览器再次跟服务端请求这个资源时，在请求头上加上If-None-Match值为之前响应头部字段ETag 的值
- 服务端再次收到请求，将请求头if-None-Match 字段的值和响应资源的哈希值进行比对如果两个值相同，则说明资源没有变化，返回304 Not Modified否则就正常返回资源内容,无论是否发生变化，都会将计算出的哈希值放入响应头部的 ETag 字段中

`问题` 哈希值计算的开销

3. ServiceWorker 是浏览器在后台独立于网页运行的脚本也可以这样理解，它是浏览器和服务端之间的代理服务器，ServiceWorker 非常强大，可以实现包括推送通知和后台同步等功能更多功能还在进一步扩展，但其最主要的功能是实现离线缓存
- 使用限制   
- 在ServiceWorker 中无法直接访问 DOM但可以通过 postMessage 接口发送的消息来与其控制的页面进行通信
- ServiceWorker 只能在本地环境下或HTTPS 网站中使用
- ServiceWorker 有作用域的限制
- 一个ServiceWorker 脚本只能作用于当前路径及其子路径由于 
- ServiceWorker 属于实验性功能所以兼容性方面会存在一些问题



### Number 
* 64位  1位符号位 - 指数E（11位） 0-1022表示为负，1024-2047表示为正 - 尾数M(52)
* 计算机表示 小数 是 * 2 取整 为 1 - 0.1 = 0.0001100110011001100110011001100110011001100110011001101  0.2 = 0.00110011001100110011001100110011001100110011001100110 ；so， 0.1 + 0.2 === 0.3 是 false

#### toFixed 与 toPrecision 区别 
* toPrecision 是处理精度，精度是从左至右第一个不为0的数开始数起 0.05.toPrecision(2) = 0.050 不进位
* toFixed 是小数点后指定位数取整，从小数点开始数起 0.05.toFixed(2) = 0.05 // 逢5 进 1

### Symbol
* Symbol(“bar”) === Symbol("bar"); // false
* Symbol.for("bar") === Symbol.for("bar");  // true

### Object.create
```js
Object.create f= function (o) {
  var F = flunction (){
    F.prototype = 0
    return new F()
  }
}

//  导致了
var a = {name: "LIN"};
var b= Object.create(a)

b.__proto__ === b.constructor.prototype; // false
b.__proto__ === Object.prototype  // false
b.__proto__ === a // false

// 用这个判断 instanceof ？
a.isPrototypeOf(b);
```

### 原型链遍历
* JavaScript引擎会先在对象的属性里去寻找属性，如果它找不到,就会再进一步往该对象的__proto__里面去寻找，直到某个对象的原型为null为止
* hasOwnProperty()、 Object.keys() - JavaScript 中唯一2个处理属性并且不会遍历原型链的方法

### Array 
* isArray()  判断是否是数组
* sort()  V8 引擎 sort 函数只给出了两种排序，InsertionSort 和 QuickSort，数量小于10的数组使用 InsertionSort，比10大的数组则使用 QuickSort
* 可以当 队列 和 栈 使用

### Map
* 键可以是任意值
* key 是有序的

Map和Object区别  
|        | key      | 数据访问 | 迭代 | Size | 性能 |
| ------ | -------- | -------- | ---- | ---- | ---- |
| Map    | 复杂类型 | .get()   | 是   | 是   | 好   |
| Object | 简单类型 | []       | 否   | 否   | 差   |

Object 的key 默认调用 .toString()

` 具体 查看 JavaScript 目录下的 Set、Map、WeakSet 和 WeakMap 的区别` 

### BOM
#### location
- hash 设置或返回从井号 (#) 开始的 URL
- host 设置或返回主机名和当前 URL 的端口号
- hostname 设置或返回当前 URL 的主机名
- href 设置或返回完整的 URL
- pathname 设置或返回当前 URL 的路径部分
- port 设置或返回当前 URL 的端口号
- protocol 设置或返回当前 URL 的协议
- search 设置或返回从问号 (?) 开始的 URL
- location.assign("http://baidu.com")
- location.href = "http://baidu.com"
- location.replace("http://baidu.com") 不会留history记录

#### Navigator
* userAgent  
- 通过useragent获取手机品牌型号
- https://github.com/fex-team/ua-device 一个用于解析UA来得到用户终端信息的JS库

* clipboard - 剪贴板内容  

* keyboard - getLayoutMap()  lock()   unlock()

* H5地理定位 - Geolocation.getCurrentPosition()   
* IP定位 -  https://api.map.baidu.com/location/ip   https://pv.sohu.com/cityjson?ie=utf-8  https://www.taobao.com/help/getip.php    

*  mediaDevices  WebRTC Real-Time Communications实时通讯技术，它允许网络应用或者站点，在不借助中间媒介的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和（或）音频流或者其他任意数据的传输

#### serviceWorker
  基于web worker，独立于JavaScript主线程的独立线程，不会堵塞主线程。在web worker的基础上增加了离线缓存的能力，充当服务器与浏览器之间的代理服务器，可以拦截全站的请求，并作出相应的动作，支持推送，可以控制管理缓存的内容以及版本 - PWA 技术


#### 其他 BOM
* screen
* history
* performance - 性能API
* window

### 更靠谱的随机数
- 常开发开始推荐使用 `Math.random() `方法，高性能且实用，但是如果我们的`随机值与加密相关`，或者`涉及到金钱等安全性要求非常高的场景`，务必使用 `getRandomValues()` 方法
- Crypto对象与其他随机值 
```js

var arr = new Uint32Array(2)
window.crypto.getRandomValues(arr);


let uuid = self.crypto.randomUUID();
console.log(uuid);

```

#### indexedDB
- 浏览器提供的本地数据库，支持事务、索引
- Cookie - 4kb
- LocalStorage 2.5M - 10M
- indexedDB - 可用空间的 50%
  

### DOM

#### 尺⼨和定位
- 尺寸  style.width  getComputedStyle offsetWidth clientWidth  getBoudingClientRect
- 定位  offsetTop  offsetLeft

#### JS优化--- createDocumentFragment()
- 动态创建html节点的方法
  * createAttribute(name)	用指定名称name创建特性节点
  * createComment(text)	创建带文本text的注释节点
  * createDocumentFragment()	创建文档碎片节点
  * createElement(tagname)	创建标签名为tagname的节点
  * createTextNode(text)	创建包含文本text的文本节点
  
DocumentFragment （文档碎片节点）是一个插入结点时的过渡，我们把要插入的结点先放到这个文档碎片里面，然后再一次性插入文档中，这样就减少了页面渲染DOM元素的次数.
```js
// 用法示例
for (var i = 0; i < 1000; i++)
  {
    var el = document.createElement('p');
    el.innerHTML = i;
    document.body.appendChild(el); //直接用appendChild向文档中插入节点
  }

  var frag = document.createDocumentFragment();
for (var i = 0; i < 1000; i++)
{
  var el = document.createElement('p');
  el.innerHTML = i; 
  frag.appendChild(el); //首先将新节点先添加到DocumentFragment 节点
}
document.body.appendChild(frag);//然后用appendChild插入文档中
```

- 引起重排的操作：
1. 浏览器窗口大小发生改变
2. 元素尺寸或位置发生改变
3. 元素内容变化（文字数量或图片大小等等）
4. 添加或者删除可见的DOM元素
5. 激活CSS伪类（例如：:hover）
6. 查询某些属性或调用某些方法

- 优化
1. 避免频繁操作样式
2. 避免频繁操作DOM（fragment，Vitual Dom）
3. 避免频繁读取引发reflow的属性
4. 创建图层（transfer，will-change）
5. 不要使用table布局

- 引起回流的属性和方法
* clientWidth、clientHeight、clientTop、clientLeft   
* offsetWidth、offsetHeight、offsetTop、offsetLeft    
* scrollWidth、scrollHeight、scrollTop、scrollLeft   
* scrollIntoView()、scrollIntoViewIffNeeded()   
* getComputedStyle()   
* getBoundingClientRect()   
* scrollTo()  

### CSS
#### Flex
#### Grid - https://gridbyexample.com/examples/
#### 盒模型
- W3C 标准盒模型 - box-sizing: content-box
- 怪异盒模型 - box-sizing: border-box

* mix(#000, #fff, 10%) //按比例权重混合颜色
* adjust-hue(#f36,150deg) //改变#f36颜色的色相值为150deg
* lighten(#f36,50%) //把#f36颜色亮度提高50%
* darken(#f36,50%) //把#f36颜色亮度降低50%
* saturate(#f36,50%) //把#f36颜色饱和度提高50%
* desaturate(#f36,50%) //把#f36颜色饱和度降低50%
* opacify(#f36, 0.5) //把颜色的透明度变成50%
* grayscale(#f36) //把#f36颜色变成灰色

### 浏览器
- 浏览器缓存 顺序 Service Worker - Memory Cache（浏览器内部） -  Disk Cache（强制/协商） - Push Cache （推送缓存 -是 HTTP/2 中的内容）
- 缓存分类 强制缓存 - Expires Cache-Control 协商缓存  - Last-modify Etag

### 正则表达式

### JavaScript内存管理
- 内存回收

* 年轻代 两块内存 互换，清理碎片，多次使用存放年老代中
* 年老代 标记 删除
* 大对象 不会被回收

`在进行 GC 期间，整个系统会被挂起`


### 输入输出
https://nodejs.cn/api/readline.html   
readline   
process.stdin   
process.stdout   

### 文件系统
* fs
  - Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。   
  - 异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。   
  - 异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞。   

* Stream 有四种流类型：
 - Readable - 可读操作。
 - Writable - 可写操作。
 - Duplex - 可读可写操作.
 - Transform - 操作被写入数据，然后读出结果。
 - 所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：
    - data - 当有数据可读时触发。
    - end - 没有更多的数据可读时触发。
    - error - 在接收和写入过程中发生错误时触发。
    - finish - 所有数据已被写入到底层系统时触发。

 * Pipe管道
  - 管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。
  - 一个Readable流和一个Writable流串起来后，所有的数据自动从Readable流进入Writable流，这种操作叫pipe

### 系统模块
* OS模块

* 全局对象
  1. global：表示Node所在的全局环境，类似于浏览器中的window对象。
  2. process：指向Node内置的process模块，允许开发者与当前进程互动。例如你在DOS或终端窗口直接输入node，就会进入NODE的命令行方式（REPL环境）。退出要退出的话，可以输入 process.exit();
  3. console：指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能。通常是写console.log()
* 全局变量
  1. _filename：指向当前运行的脚本文件名。
  2. _dirname：指向当前运行的脚本所在的目录。

* Path 模块
  - path.join // 连接路径
  - path.resolve // 解释为绝对路径

* 事件 EventEmitter
  - Node.js 是单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。
  - Node.js 几乎每一个 API 都是支持回调函数的。
  - Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。
  - Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.

* Buffer
 - Buffer 处理二进制数据类型
 - Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。
在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

* process
 - process 是一个全局变量，是全局对象 global 的属性
 - process 属性描述了当前 Node.js 进程状态的对象，提供了与操作系统的交互的接口

* vm模块
  - VM模块是NodeJS里面的核心模块，支撑了require方法和NodeJS的运行机制，我们有些时候可能也要用到VM模板来做一些特殊的事情。
  - 通过VM，JS可以被编译后立即执行或者编译保存下来稍后执行（JavaScript code can be compiled and run immediately or compiled, saved, and run later.）
  - VM模块包含了三个常用的方法。 vm.runInThisContext(code, filename);此方法用于创建一个独立的沙箱运行空间，code内的代码可以访问外部的global对象，但是不能访问其他变量

* 定时器
 - process.nextTick
 - Promise.resolve
 - setTimeout
 - setInterval
 - setImmediate - 将在当前事件轮询的末尾处执行。
执行顺序 正常代码 -> nextTick => Promise -> setTimeout -> setImmediate

* crypto模块的
  目的是为了提供通用的加密和哈希算法。用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。Nodejs用C/C++实现这些算法后，通过cypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快。      
  md5 SHA1 Hmac  AES Diffie-Hellman  RSA

### 网络通信
* net.Server 用于创建 TCP 或 IPC 服务器
* net.Socket 通常用于创建一个 TCP 或本地服务器。
  - allowHalfOpen：默认为false，如果为true，当另一端socket发送FIN包时socket不会自动发送FIN包。socket变为不可读但可写(半关闭)，（对方对于本方来说可写不可读）
  - 如果要完成TCP的四次挥手，则需要手动调用socket对象的end方法

### 进程管理
 * Node.js 是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于我们在多核 cpu 的系统上创建多个子进程，从而提高性能。
 * 每个子进程总是带有三个流对象：child.stdin, child.stdout 和child.stderr。他们可能会共享父进程的 stdio 流，或者也可以是独立的被导流的流对象。

#### 子进程
* exec - child_process.exec 使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。
* spawn - child_process.spawn 使用指定的命令行参数创建新进程。spawn() 方法返回流 (stdout & stderr)，在进程返回大量数据时使用。进程一旦开始执行时 spawn() 就开始接收响应。
* fork - child_process.fork 是 spawn()的特殊形式，用于在子进程中运行的模块，如 fork('./son.js') 相当于 spawn('node', ['./son.js']) 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。返回的对象除了拥有ChildProcess实例的所有方法，还有一个内建的通信信道。
*  工作进程使用 child_process.fork() 方法衍生，因此它们可以通过 IPC 与父进程通信并且来回传递服务器句柄。

#### Cluster  集群模式
cluster 模块    
cluster.fork(); - 工作进程使用 child_process.fork() 方法衍生，因此它们可以通过 IPC 与父进程通信并且来回传递服务器句柄。

单个node程序仅仅利用单核cpu，因此为了更好利用系统资源就需要fork多个node进程执行HTTP服务器逻辑，所以node内建模块提供了child_process和cluster模块。利用child_process模块，我们可以执行shell命令，可以fork子进程执行代码，也可以直接执行二进制文件；     

利用cluster模块，使用node封装好的API、IPC通道和调度机可以非常简单的创建包括一个master进程下HTTP代理服务器 + 多个worker进程多个HTTP应用服务器的架构，并提供两种调度子进程算法  

### 服务器框架功能
- express  每秒请求数 1 万多
- koa 每秒请求数 3万多
- fastify 每秒请求数 6万多
- egg.js 每秒请求数 接近2万
- Nest Node.js 版的 Spring



### Git
- 工作区 
  * git add .  // 添加当前目录下的所有文件到暂存区
  * git add -u  // 查看所有已经跟踪的文件，并暂存对这些文件的更改（如果它们不同或已被删除）。它不会添加任何新文件，它只会暂存对已跟踪文件的更改。
  * git add -A // 执行这两项操作的便捷快捷方式

- 暂存区
  * git commit –m
  * git commit --amend --no-edit 修改上一次变更内容

- 本地仓库
  * git branch xx  
  * git checkout –b xx  
  * git branch -d xx
  * git push origin –delete xx

- 远程仓库

分支 - master hotfix release develop feature

### package.json
- “main”: “lib/index.js”,   // require或import加载npm包会加载main指定的文件commonjs

- "module": "es/index.js",   // Webpack或rollup看到有module字段，会优先加载esm

- "unpkg": "dist/geekUI.min.js"    // 可以通过 https://unpkg.com/直接获取到文件内容umd

#### import maps 模块名映射
<script type="importmap" ></script>

#### System.js
SystemJS 是一个插件化的、通用的模块加载器，它能在浏览器或者 NodeJS 上动态加载模块，并且支持 CommonJS、AMD、全局模块对象和 ES6 模块

#### Puppeteer 
https://puppeteer.bootcss.com/ 
* Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

- 能做什么?
你可以在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 来完成！ 下面是一些示例：

- 生成页面 PDF。
- 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

#### Cypress 比 Puppeteer 好用
* 什么是 Cypress - 一个前端测试工具

#### Sentry
Sentry 是一个开源的错误追踪工具，可以帮助开发人员实时监控和修复系统中的错误。其专注于错误监控以及提取一切事后处理所需的信息;支持几乎所有主流开发语言(JS/Java/Python/php)和平台, 并提供了web来展示输出错误。
sentry官网：sentry.io/
文档地址：docs.sentry.io/platforms/

#### 数据上报 
navigator.sendBeacon('/log',analyticsData) 返回 true or false 异步不影响页面加载

#### 捕获异常
- 加 try catch
- window.onerror = function(message,source,kuneno,colno,error)
- window.addEventListener('error',(e) =>{})


