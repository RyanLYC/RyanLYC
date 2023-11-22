### Vite
1. 高价封装 rollup esbuild
2. 使用简单 - 快 - 便于扩展
3. 其他构建工具 webpack ； 类似的 Snowpack 、WMR、 @web/dev-server  https://cn.vitejs.dev/guide/comparisons.html

### 区别
1. High Level API
2. 不包含自己的编译能力 ； rollup 与 es6 编译
3. 完全基于ESM加载方式
4. vs webpack（全面） & rollup（专一）
5. 遵循 ESM 标准
6. vite 方便 快速 开发 项目

减少工作  dev-server  各类loader  build 命令 都内置了     

`"serve": "vite preview" 本地预览打包的文件`     

### vite 优势
1. 简单
2. 开发效率高
3. 社区成本低 兼容 rollup

相对于 vue-cli 以及 create-react-app（基于webpack的构建工具）   
create-react-app - eject   
vue-cli - configureWebpack 和 chainWebpack   

Vite 有 自身的插件系统 生态：兼容 rollup 插件   

`开发的时候 ESBuild 进行文件编译`   
`打包使用 Rollup`   

### 版本
1. 1.0 以Vue3为主
2. 2.0 跨框架

* vanill 原生js 无框架集成
* vue3
* react
* preact
* lit-element
* svelte

#### jsx 需要安装 @vitejs/plugin-vue-jsx -D
import vueJsx from '@vitejs/plugin-vue-jsx'    
 plugins: [vue(), vueJsx()],  

### vite 创建 vue2 项目 - https://cn.vitejs.dev/plugins/
@vitejs/plugin-vue2提供对 Vue 2.7 的单文件组件支持。  
@vitejs/plugin-vue2-jsx   提供对 Vue 2.7 JSX 对支持（通过 dedicated Babel transform）。  

创建时候 选择  `vanill` 原生js 无框架集成

### vite 的 plugin -  https://github.com/vitejs/awesome-vite#plugins

### TypeScript
Vite 天然支持引入 .ts 文件。
### 仅执行转译
请注意，Vite 仅执行 .ts 文件的转译工作，并不执行 任何类型检查。并假定类型检查已经被你的 IDE 或构建过程处理了。

### 静态文件处理 https://cn.vitejs.dev/guide/features.html#static-assets
```javascript
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```
#### types
1. url 
2. raw (字符串内容)
3. worker/worker inline (web worker)

```javascript
// 显式加载资源为一个 URL
import assetAsURL from './asset.js?url'

// 以字符串形式加载资源
import assetAsString from './shader.glsl?raw'

// 加载为 Web Worker
import Worker from './worker.js?worker'

// 在构建时 Web Worker 内联为 base64 字符串
import InlineWorker from './worker.js?worker&inline'

```

### 环境变量 https://cn.vitejs.dev/guide/env-and-mode.html
Vite 在一个特殊的 import.meta.env 对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量： 

* import.meta.env.MODE: {string} 应用运行的模式。
* import.meta.env.BASE_URL: {string} 部署应用时的基本 URL。他由base 配置项决定。
* import.meta.env.PROD: {boolean} 应用是否运行在生产环境。
* import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)。
* import.meta.env.SSR: {boolean} 应用是否运行在 server 上。

### Vite 热更新 HMR 默认开启  - https://cn.vitejs.dev/guide/api-hmr.html

### glob import https://cn.vitejs.dev/guide/features.html#glob-import 
Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块：   
```js
const modules = import.meta.glob('./dir/*.js')

for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}

```

### 预编译 node_modules中 .vite文件夹
1. commonJS to ESM
2. buildle files together

#### 依赖优化选项 - https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-entries
optimizeDeps


#### build -  https://cn.vitejs.dev/config/build-options.html#build-manifest

### 服务端渲染  - https://cn.vitejs.dev/guide/ssr.html#example-projects

### 配置 https://cn.vitejs.dev/config/shared-options.html

## Rollup & ESBuild
1. Rollup - 以ESM标准为目标的构建工具  - Tree Shaking 

插件： import json from '@rollup/plugin-json'    plugins: [ json(), ]    

```js
const file = (type = 'min') =>
  path.resolve(__dirname, `../lib/${name}.${type}.js`)

    input: path.resolve(__dirname, '../components/index.ts'),
    output: [
      {
        name,
        file: file('esm'),
        format: 'es',
        exports: 'auto',
        sourcemap: !isProduct,
        plugins:[
          // 压缩代码
          // import {terser} from 'roolup-plugin-terser'
          terser()
        ],
        banner:"/** 文件头增加一个注释 说明 */"
      },
      {
        name,
        file: file('umd'),
        format: 'umd',
        globals: {
          'vue': 'Vue',
          'lodash-es': '_'
        },
        sourcemap: !isProduct,
        exports: 'named'
      }
    ],
```

import { nodeResolve } from '@rollup/plugin-node-resolve' (import 的 文件打包在一起)  plugins: [nodeResolve(), json(), ]  
##### rollup 默认esm 
import commonjs from '@rollup/plugin-commonjs'   plugins: [nodeResolve(),commonjs(), json(), ]   

`external: ['vue', 'lodash-es'] 不需要打包进去 `    

### rollup 插件 - https://github.com/rollup/plugins


### vite 插件 
#### 服务启动时 钩子  options buildStart 
#### 兼容的 rollup 钩子  resolveId   load    transform 
```js
plugins:[  ], // vite 的插件   
build:{
  rollupOptions:{
    plugins:[  ] // rollup 的插件 仅仅在打包 中使用
  }
}
```
#### vite 钩子
* config - 修改 config
* configResolved - 获取 config
* configureServer - server.middlewares
* transformIndexHtml - index.html 内容
* handleHotUpdate   热更新


#### vite 插件 执行顺序 并非 按顺序
* pre  最快被执行  alias 后就 被调用 testPlugin('pre')
* normal vite 代码执行前 （不需要传入参数）  testPlugin()
* post vitee 代码执行后 testPlugin('post')



