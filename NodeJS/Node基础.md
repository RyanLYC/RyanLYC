#### 全局对象 global

- 核心方法：
  - 定时器相关：setTimeout(返回对象)/clearTimeout、setInterval(返回对象)/clearInterval
  - 微任务：queueMicrotask
  - 立即执行：setImmediate/clearImmediate
  - console
  - \_\_dirname 当前运行模块目录的绝对路径
  - \_\_filename 返回包含文件名的完整路径
  - Buffer：Buffer 继承自 UInt8Array 类型化数组
  - process
    - process.cwd()返回 Node.js 进程启动时的工作目录绝对路径，与文件所在位置无关。
    - process.exit()会立即终止 Node 进程
    - process.argv 返回数组，第一项是 Node 可执行文件绝对路径，第二项是执行文件的绝对路径，后续项是传入的参数。
    - process.platform 返回操作系统类型标识，Windows 系统返回 win32，32 位以上的系统都兼容
    - process.kill(pid)通过进程 ID 终止指定进程，
    - process.env 以对象形式返回所有环境变量

#### 模块化

- require 伪代码

```js
function require(modulePath) {
  // 1. 将modulePath转换为绝对路径：D:\\*****
  // 2. 判断是否该模块已缓存，存在返回cache['D:\\*****'].result;
  // 3. 读取文件内容
  // 4. 包裹到一个函数中
  function __temp(module, exports, require, __dirname, __filename) {
    // 文件内容
    //****
    //****
    module.exports = {
      // ****
    };

    return module.exports;
  }
  // 5. 创建module对象;
  module.exports = {};
  const exports = module.exports;
  __temp.call(
    module.exports,
    module,
    exports,
    require,
    module.path,
    module.filename
  );

  // 所以 this === module.exports === exports
  // 文件内容中有
  // module.exports = {
  // ****
  // };
  // this === exports !== module.exports(被修改了)
}
```

- 新项目推荐使用 ES 模块（import/export），这是 ECMAScript 标准且被 Node.js v14+原生支持
  。通过 package.json 中设置"type": "module"即可启用，同时支持静态分析、树摇（Tree-shaking）优化，减少未使用代码的打包体积

#### 常用内置模块

- [OS](https://nodejs.cn/api/v20/os.html) 模块:Node.js 的 OS 模块主要用于读取操作系统相关信息
- [path](https://nodejs.cn/api/v20/path.html#google_vignette) 提供处理文件和目录路径的工具方法
- [URL](https://nodejs.cn/api/v20/url.html) 将 URL 字符串解析为结构化对象，并提供相关操作方法
- [util](https://nodejs.cn/api/v20/util.html#google_vignette)
  - callbackify promise 函数 转换为 回调函数
  - promisify 回调函数 转换为 promise 函数
  - isDeepStrictEqual 如果 val1 和 val2 之间存在深度严格相等，则返回 true。否则，返回 false。

#### fs 文件系统 I/O

- [fs 文件系统](https://nodejs.cn/api/v20/fs.html)

#### 文件流

- [流](https://nodejs.cn/api/v20/stream.html)指的是数据的流动，数据从一个地方流动到另一个地方

  - 流的方向
    - 可读流 Readable fs.createReadStream() ：数据从源头（如硬盘文件）流向内存的传输过程
    - 可写流 Writable fs.createWriteStream() ：数据从内存流向目标介质（如写入文件）的传输过程
    - 双工流 Duplex : 既可读也可写
    - 转换流 Transform : 对读出的数据进行变换，如 Gzip 压缩

- 为什么使用流（Stream）？

传统的读取或写入文件方式，如 `fs.readFile()`，会将整个文件一次性加载进内存。当处理大文件（如 500MB 视频、日志等）时，这会导致内存暴涨甚至崩溃。

**流的优势**：

- **节省内存**：边读边处理，避免内存爆炸。
- **可组合性**：使用 `pipe()` 或 `pipeline()` 串联多个流。
- **背压控制**：自动控制读写速率匹配，防止资源阻塞。

```js
// 文件读取：`fs.createReadStream`
import { createReadStream } from "fs";

const stream = createReadStream("./big-file.txt", {
  encoding: "utf-8",
  highWaterMark: 64 * 1024, // 缓冲区大小，默认 64KB
});

stream.on("data", (chunk) => {
  console.log("读到数据块:", chunk.length);
});

stream.on("end", () => {
  console.log("读取结束");
});

stream.on("error", (err) => {
  console.error("读取出错:", err);
});

// 文件写入：fs.createWriteStream 压的写入例子
// file: write-with-backpressure.mjs
import { createWriteStream } from "fs";

const stream = createWriteStream("./output.txt");

async function writeLargeData() {
  for (let i = 0; i < 1_000_000; i++) {
    const ok = stream.write(`第 ${i} 行内容\n`);

    // 如果写入缓存已满，暂停写入，等待 drain
    if (!ok) {
      await new Promise((resolve) => stream.once("drain", resolve));
    }
  }

  stream.end("写入完成\n");
  console.log("✅ 全部数据写入完毕");
}

writeLargeData().catch((err) => {
  console.error("❌ 写入失败:", err);
});
```

```js
// pipe()
import { createReadStream, createWriteStream } from "fs";

createReadStream("./source.txt")
  .pipe(createWriteStream("./dest.txt"))
  .on("finish", () => {
    console.log("文件复制完成");
  });

// 推荐用法：pipeline（自动错误处理）
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

try {
  await pipeline(
    createReadStream("./source.txt"),
    createWriteStream("./dest.txt")
  );
  console.log("✅ pipeline 完成");
} catch (err) {
  console.error("❌ pipeline 出错:", err);
}
```

```js
// 支持 Transform 的例子
import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";

await pipeline(
  createReadStream("input.txt"),
  createGzip(),
  createWriteStream("input.txt.gz")
);
```

```js
// 读写 背压
const fs = require("node:fs");
const path = require("node:path");

// 原始文件路径（需提前存在）
const from = path.resolve(__dirname, "source.txt");
// 目标文件路径
const to = path.resolve(__dirname, "temp/abc2.txt");

console.time("方式2");

// 创建读写流
const rs = fs.createReadStream(from, { highWaterMark: 64 * 1024 }); // 64KB 缓冲区
const ws = fs.createWriteStream(to, { highWaterMark: 32 * 1024 }); // 32KB 缓冲区（故意设置较小）

// 手动背压控制逻辑
rs.on("data", (chunk) => {
  // 尝试写入数据
  const canContinue = ws.write(chunk);

  if (!canContinue) {
    // 写入队列满，暂停读取
    rs.pause();
    console.log("背压触发：暂停读取");
  }
});

// 当写入队列清空时
ws.on("drain", () => {
  // 恢复读取流
  rs.resume();
  console.log("背压解除：恢复读取");
});

// 处理完成
rs.on("end", () => {
  ws.end();
  console.timeEnd("方式2");
  console.log("复制完成");
});

// 错误处理
rs.on("error", (err) => console.error("读取失败:", err));
ws.on("error", (err) => console.error("写入失败:", err));
```

```js
// 自动背压
const { pipeline } = require("node:stream/promises");

async function optimizedCopy() {
  const rs = fs.createReadStream(from);
  const ws = fs.createWriteStream(to);

  await pipeline(
    rs,
    new Transform({
      transform(chunk, enc, cb) {
        // 可在此处添加处理逻辑
        cb(null, chunk);
      },
    }),
    ws
  );

  console.log("智能背压复制完成");
}
```

#### [net 模块](https://nodejs.cn/api/v20/net.html)

- http 请求
  - 普通模式 三次握手 -> 数据传输一次请求 -> 四次挥手
  - 长连接 多次数据传输 请求端：Header ： connection：keep-alive 服务器 Response Header ： connection：keep-alive
- socket 是操作系统中的特殊文件，负责与网卡通信建立 TCP/IP 连接后，客户端会获得一个 socket 对象
  - 可以像文件一样进行读写操作
  - 写入内容会通过网络连接传输到远程主机
  - 读取内容可以获取远程主机的响应数据
  - 在 Node.js 中表现为双工流(Duplex Stream)对象
  - 继承自 stream 模块，具有可读可写特性
- `net 模块是 Node.js 实现 ​ 底层 TCP/IP 网络通信 ​ 的核心模块，主要功能包括：`

1. ​ 构建 TCP 服务器与客户端 ​,支持创建基于流的 TCP 服务端（net.Server）和客户端（net.Socket），实现双向可靠数据传输。
2. ​ 支持进程间通信（IPC）​​,通过 UNIX 域套接字（UNIX domain socket）实现本地进程间高效通信。
3. ​ 基础网络协议实现 ​,为 HTTP、WebSocket 等上层协议提供底层支持，例如 VSCode 的 IPC 通信即基于 net 模块。

```js
// 创建 TCP 服务器
const net = require("net");
const server = net.createServer((socket) => {
  // 新客户端连接时触发
  console.log("客户端已连接");

  // 接收数据
  socket.on("data", (data) => {
    console.log(`收到数据: ${data}`);
    socket.write(`响应: ${data}`); // 向客户端发送数据
  });

  // 连接关闭
  socket.on("end", () => console.log("客户端断开连接"));
});

server.listen(3000, () => console.log("服务器监听 3000 端口"));
```

```js
//创建 TCP 客户端
const client = net.createConnection({ port: 3000 }, () => {
  console.log("已连接服务器");
  client.write("Hello Server"); // 发送数据
});

client.on("data", (data) => {
  console.log(`服务端响应: ${data}`);
  client.end(); // 主动关闭连接
});
```

```js
const net = require("net");

// 创建 TCP 客户端连接
const socket = net.createConnection(
  {
    host: "qq.com", // 目标主机
    port: 80, // HTTP 默认端口
  },
  () => {
    console.log("连接成功");
    // 发送 HTTP GET 请求
    socket.write("GET / HTTP/1.1\r\n");
    socket.write("Host: qq.com\r\n");
    socket.write("Connection: keep-alive\r\n\r\n");
  }
);

// 解析 HTTP 响应
function parseResponse(response) {
  // 分割响应头和正文
  const index = response.indexOf("\r\n\r\n");
  const head = response.substring(0, index);
  const body = response.substring(index + 4);

  // 解析响应头
  const headParts = head.split("\r\n");
  const statusLine = headParts.shift();
  const headers = {};

  headParts.forEach((part) => {
    const [key, value] = part.split(": ");
    headers[key.toLowerCase()] = value;
  });

  return {
    statusLine,
    headers,
    body,
  };
}

// 接收数据处理器
let receivedData = "";
let responseParsed = false;

socket.on("data", (chunk) => {
  receivedData += chunk.toString("utf-8");

  if (!responseParsed) {
    // 首次接收时解析响应头
    const response = parseResponse(receivedData);
    const contentLength = Number(response.headers["content-length"]);

    // 如果内容完整
    if (receivedData.length >= contentLength + response.body.length) {
      console.log("[响应头]", response.statusLine);
      console.log("[响应体前100字符]", response.body.substring(0, 100));
      responseParsed = true;
      socket.end();
    }
  }
});

// 错误处理
socket.on("error", (err) => {
  console.error("连接错误:", err.message);
});

// 连接关闭
socket.on("end", () => {
  console.log("连接已关闭");
});
```

#### Http 模块

#### HTTPS 模块 （一般不使用）

#### node 的事件循环 先执行 微任务 再 执行 宏任务

event loop? -> timers -> poll -> check -> event loop? 一直循环

- timers 存放定时器任务
- poll 存放定时器以为是任务
- check 存放 setImmediate 任务

```js
setTimeout(() => {
  console.log("setTimeout");
}, 0);
setImmediate(() => {
  console.log("setImmediate");
});

// 两个的输出顺序不一样的。大多数情况下是
// setTimeout
// setImmediate
// 与当时计算机性能有关 也有可能先输出setImmediate
```

```js
const fs = require("fs");

fs.readFile("./123.txt", () => {
  setTimeout(() => {
    console.log("1");
  }, 0);
  setImmediate(() => {
    console.log("2");
  });
});
// 因为 poll 到 check
// 2
// 1
```

- 宏任务 ： timers -> poll -> check
- 微任务 ： process.nextTick（先执行，优先级高） 、 Promise

#### EventEmitter

```js
const EventEmitter = require("node:events");

const myEmitter = new EventEmitter();

myEmitter.on("event", () => {
  console.log("an event occurred!");
});

myEmitter.emit("event");
```
