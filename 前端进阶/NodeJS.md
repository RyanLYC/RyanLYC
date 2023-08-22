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






  







