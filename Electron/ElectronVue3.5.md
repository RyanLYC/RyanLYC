### Electron介绍与安装

1. 官网

- 国际版：https://www.electronjs.org
- 中文版：https://www.electronjs.org/zh

2. 安装

- [Electron Forge](https://www.electronforge.io/)
- npm install electron --save-dev

1. 镜像配置
   在.npmrc文件中添加 ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

```shell
registry=https://registry.npmmirror.com/
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
PYTHON=/Users/viking/.pyenv/shims/python
home=https://www.npmjs.org
strict-ssl=false
```

4. 进程和线程 （Electron多进程架构）
   基于Chromium设计：主进程统筹全局，渲染进程隔离运行（崩溃不影响其他窗口）

- 进程是正在运行的计算机程序实例，每个运行的程序就是一个进程。
- 线程是进程内的执行单元，一个进程可包含多个线程。

通信机制:

- 进程间通信需要特殊机制（如IPC进程间通信）
- 线程间通信直接通过共享内存实现

每个Electron应用都有一个单一的主进程，职责:是

- 主进程
  - 窗口管理（通过BrowserWindow创建/管理窗口）
  - 应用生命周期控制（通过electron.App模块）
  - 访问原生Nodejs API
- 渲染进程
  - 每个BrowserWindow生成一个独立渲染进程
  - 负责渲染网页内容
  - 无权直接访问require或其他Node.js API

5. 预加载脚本

- 功能定位: 用于桥接Electron的主进程和渲染进程，使渲染进程能够访问部分原生功能
- 运行环境: 运行在沙盒化的Node.js环境中，介于主进程和渲染进程之间
- API权限:
  - Electron模块：渲染进程模块
  - Node.js模块：events、timers、url
  - Polyfilled全局模块：Buffer、process、clearImmediate、setImmediate

demo：

```js
// preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: process.versions.node,
  chrome: process.versions.chrome,
});

// main.js
function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {

      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  win.webContents.openDevTools();
  return win;
}
app.on("ready", () => {
  createWindow();
});
// index.html
<h1>Hello from main window</h1>
<h1 id="info"></h1>
<script src="./renderer.js"></script>
// renderer.js
const info = document.getElementById('info')
info.innerHTML = `Chrome (v${window.versions.chrome}), Node.js (v${window.versions.node})`
```

6. 进程间通信

IPC通道名称

- ipcMain
- ipcRenderer

`第一种方式`：单向通信：从渲染器进程到主进程
使用ipcRenderer.send API发送信息，然后使用 ipcMain.on API接收
Demo 在文本框中输入的内容，修改窗口的标题

```js
// index.html
Title: <input id="title"/>
<button id="btn" type="button">Set</button>
<script src="./renderer.js"></script>
// renderer.js
const btn = document.getElementById('btn')
const titleInput = document.getElementById('title')
btn.addEventListener('click', () => {
  const title = titleInput.value
  window.electron.setTitle(title)
})
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
})

// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {

      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
  return win
}
function handleSetTitle(event, title) {
  console.log('the event from ipcRenderer', event)
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}
app.on('ready', () => {
  ipcMain.on('set-title', handleSetTitle)

  createWindow()
})
```

`第二种方式`：双向通信，实现方式：从渲染器进程到主进程，再从主进程返回渲染器进程

- 使用ipcRenderer.invoke发送请求
- 使用ipcMain.handle处理请求
- ipcMain.handle的第二个函数作为回调，返回值以Promise形式返回给最初的invoke调用

```js
// renderer.js
async function handle() {
  const result = await window.electron.testHandle();
  console.log(result); // 输出234
}
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  testHandle: () => ipcRenderer.invoke("test"),
});
// main.js
ipcMain.handle("test", async () => {
  return 123;
});
```

Demo: 文本框输入内容，点击按钮把内容写入文件中，然后显示文件的大小

```js
// index.html
Content: <input id="content"/>
<button id="btn2" type="button">
  Write
</button>
<script src="./renderer.js"></script>

// renderer.js
const btn2 = document.getElementById('btn2')
const contentInput = document.getElementById('content')
btn2.addEventListener('click', async () => {
  const content = contentInput.value
  const len = await window.electron.writeFile(content)
  console.log(len)
  info.innerHTML = `Fize size: ${len}`
})

// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  writeFile: (content) => ipcRenderer.invoke('write-file', content),
})

//main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {

      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
  return win
}

async function handleWriteFile(event, content) {
  console.log('the content', content)
  await fs.promises.writeFile('test.txt', content)
  const stats = await fs.promises.stat('test.txt')
  return stats.size
}

app.on('ready', () => {
   ipcMain.handle('write-file', handleWriteFile)

  createWindow()
})
```

`第三种通信方式`：单向通信-从主进程到渲染器进程

- 主进程使用win.webContents.send发送消息
- 渲染进程使用ipcRenderer.on接收消息

Demo 主进程中计时器 每隔3s 发送数据给 渲染进程显示

```js
// main.js

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {

      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  win.webContents.openDevTools();
  return win;
}

app.on("ready", () => {
  const win = createWindow();
  let counter = 1;

  win.webContents.send("update-counter", counter);
  setInterval(() => {
    counter += 3;
    win.webContents.send("update-counter", counter);
  }, 3000);
});

// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  onUpdateCounter: (callback) =>
    ipcRenderer.on("update-counter", (_event, value) => callback(value)),
});

// html
<h1 id="counter"></h1><script src="./renderer.js"></script>

// renderer.js
const counter = document.getElementById('counter')

window.electron.onUpdateCounter((value) => {
  counter.innerText = value.toString()
})
```

`第四种方式` 打破 沙盒机制

```js
const win = new BrowserWindow({
  width: 850,
  height: 600,
  webPreferences: {
    nodeIntegration: true, // 允许沙箱中 使用部分nodejs 模块 (安全问题)
    preload: path.join(__dirname, "preload.js"),
  },
});

// preload.js
const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
console.log("fs", fs); // nodeIntegration: true, 不报错 输出模块

contextBridge.exposeInMainWorld("electron", {
  readFile: fs.promises.readFile,
});

// renderer.js
btn2.addEventListener("click", async () => {
  const c = await window.electron.readFile("test.txt", { encoding: "utf-8" });
  info.innerHTML += `File Content: ${c}`;
});

/////////////////////////////////////////////////////////
// 把 require 给 渲染进程使用
contextBridge.exposeInMainWorld("require", require);

// renderer.js
const fs = window.require("fs");

btn2.addEventListener("click", async () => {
  const c = await fs.promises.readFile("test.txt", { encoding: "utf-8" });
  info.innerHTML += `File Content: ${c}`;
});
```

`第五种方式` 使用remote模块 (安全问题)

remote模块 提供桥梁，可以使渲染进程可直接调用主进程的属性和方法

`安装`： npm install --save @electron/remote

```js
// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const remote = require("@electron/remote/main");
const path = require("path");
const fs = require("fs");

remote.initialize();
function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  win.webContents.openDevTools();
  return win;
}

app.on("ready", () => {
  const win = createWindow();
  remote.enable(win.webContents);
});

// preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("require", require);

// renderer.js
const { dialog } = window.require("@electron/remote");

dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
```

6. Electron Forge

Electron官方的脚手架工具，一体化解决方案：

- 简化开发流程，现代技术栈，一键运行
- 复杂流程简单化
  - 应用打包
  - 应用签名
  - 多平台应用打包
  - 自动更新
  - 易于扩展，有插件系统

```shell
安装
npx create-electron-app@latest my-app
# using templates
# "vite": "^5.4.21"
npx create-electron-app@latest vchat -- --template=vite-typescript
# 注意 npmrc
registry=https://registry.npmmirror.com/
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# 结合 Vue3  https://www.electronforge.io/guides/framework-integration/vue-3#vite.renderer.config.mjs
npm install vue
npm install --save-dev @vitejs/plugin-vue
#     "@vitejs/plugin-vue": "^5.2.4",

# 安装 Tailwind.css

npm install -D tailwindcss postcss autoprefixer
    # "@tailwindcss/typography": "^0.5.14",
    # "autoprefixer": "^10.4.19",
    # "postcss": "^8.4.40",
    # "tailwindcss": "^3.4.7",

# tailwind.config.js

# /** @type {import('tailwindcss').Config} */
# module.exports = {
#   content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
#   theme: {
#     extend: {},
#   },
#   plugins: [require("@tailwindcss/typography")],
# };

# postcss.config.js

# module.exports = {
#   plugins: {
#     tailwindcss: {},
#     autoprefixer: {},
#   },
# };


# index.css

# @tailwind base;
# @tailwind components;
# @tailwind utilities;


# Iconify Design 图标 https://iconify.design/
# vue中使用 https://iconify.design/docs/icon-components/vue/
npm install --save-dev @iconify/vue
# import { Icon } from "@iconify/vue";
# <Icon icon="mdi-light:home" />


# Radix Vue 组件库 https://www.radix-vue.com/
```
