### 构建工具
grunt -> gulp -> rollup webpack parcel -> vite

### webpack 环境
1. Nodejs 使用 nvm 安装管理 版本

`yarn add webpack webpack-cli -D`   
`yarn add html-webpack-plugin -D`  
`yarn add css-loader -D`  
`yarn add style-loader -D`  

### 第一个webpack demo
```js
yarn add webpack webpack-cli -D // webpack 环境
yarn add html-webpack-plugin -D // HTML 插件 无需主动引入 打包好的文件
yarn add css-loader -D // 解释css 
yarn add style-loader -D // 应用打包好的css 插入页面中

// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [{ test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }], // 从右往左 执行
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"), // index.html中添加打包后的js 文件  <script defer="defer" src="main.js">
    }),
  ],
};

// index.html 默认的 vscode ! htmlwend
// main.js
import "./style.css";
console.log("webpack demo");

// package.json
  "scripts": {
    "dev": "webpack",
  },

// 运行
yarn dev

```

### webpack 配置介绍
1. webpack 开箱即用，默认入口为 src/index.js 输出 dist/main.js
2. 默认配置文件 webpack.config.js ； 可以修改名字。执行命令 webpack --config ./webpack.dev.js
3. 配置文件可以使用webpack-cli生成；配置文件导出一个对象
#### 配置接收
1. context: path.resolve(__dirname,'src') //  1. 默认是当前node的进程目录；可以修改为绝对路径
2. entry : 打包入口文件，可以一个 可以多个[],或者{}
```javascript
entry: {
  index:{
    import: './src/index.js',
    // 修改名字
    finlename: 'app.js',
    dependOn:['react-vendor','test'] // 依赖
  },
  //  'react-vendor':['react','redux'] // 或者
  'react-vendor':{
    import : ['react','redux']
  }
  test:{
    import: './src/test.js'
  }
}
```
3. output: 输出
```js
output:{
  path: path.resolve(__dirname,'build')
  // publicPath: 'https://a.b.c/assets/'
  // crossOriginLoading:script属性cross-origin，默认false，可设置'anonymous'\'use-credentials'，仅在target为'web'生效
  filename:'test-demo.js' // 文件名
  // assetModuleFilename:静态资源输出名称
  // chunkFilename: 'asset_[id].js'  // 非初始chunk文件的名称 异步引入 import('./log').then(() => {})
}
```
`导出库配置- library`   
* library.name:导出库的名称，可以单独设置，也可以统一放一起
* library.type: 库暴露的方式，比如var、module、 umd、cmd、require等
* library.export:指定那个导出应该暴露为一个库
* library.auxiliaryComment:在umd中添加注释
* library.umdNamedDefine:在umd模式下是否使用define

4. 常用loader
babel-loader ts-loader css-loader sass-loader style-loader (MiniCssExtractPlugin.loader 与 style-loader  冲突 选一个使用: 样式文件分割)
```js
// CSS 文件分割 使用
const MiniCssExtractPlugin = require('min-css-extract-plugin')

rules: [{ test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] }]

plugins:[
  newe MiniCssExtractPlugin({
    filename:'[name].css',
    chunkFilename:'[name].css' // 异步引入的js文件中引入的css文件
  })
]
```
5. plugins 插件 常用插件
* HtmWebpackPlugin   HTML解释
* MiniCssExtractPlugin  CSS分割输出
* CssMinimizerPlugin CSS压缩
* ESLintWebpackPlugin
* TerserPlugin
* PrefetchPlugin

#### HtmWebpackPlugin
* title - html document title
* filename -输出html文件名
* template -指定html模板，一般指.html文件
* templateParameters-替换模板中的数据 ejs模版语法 <%= titleName %>
* publicPath - script、style的路径
* minify-压缩配置

#### CssMinimizerPlugin CSS压缩 不是放在 plugins 中 是 放在 optimization:
```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') 
mode:'production',  
optimization:{
  minimizer:[
    new CssMinimizerPlugin({})
  ]
}

```
* test-文件匹配 正则/字符串 (匹配的是输出文件)
* include -文件包含
* exclude-文件排除
* parallel- 是否启用多进程
* minify - 可以用cssoMinify、 cleanCssMinify、 esbuildMinify、parcelCssMinify替换(cssnanoMinify 默认压缩方式)
* minimizerOptions -cssnano优化选项

6. mode 构建模式
* development:开发模式，会将DefinePlugin中的NODE_ENV设置为development
* production:将NODE_ENV设置development.
* none 默认模式

`如果要根据mode来改变打包行为，必须要将配置导出为函数，命令行方式传入参数时`

```js
webpack --config ./webpack.dev.js --mode=development

const config = {...}

module.exports = (env， argv){
  console.log(env， argv);
  if (argv.mode === 'development') {
    config.output.filename = 'dev_demo.js'
  };
  return config;
}

```

7. sourcemap 开发调试 & 线上排查利器
配置规范 - devtool    
[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map   
引入方式 :inline、hidden、eval  
源码展示:nosources   
调试展示:cheap、cheap-module
production模式: source-map、nosources-source-map(不展示源码)、hidden-nosources-source-map、hidden-source-map

```js
devtool: 'sourcemap'


```

### webpack server 提供一个本地server 隐藏输出
yarn add webpack-dev-server
"dev" : "webpack server"

// config 中
devServer:{
  client:{ // 设置用户端展示相关
    overlay:false
  },
  compress:false //gzip 压缩关闭
  host:'0.0.0.0',
  // hot:'only', //保存不自动刷新浏览器
  open:'true' //是否打开新浏览器tab
  port 端口号
  proxy:{ // 代理
    '/api':''
  }
  server 设置请求协议 http https spdy
  static 设置静态资源访问
}

### webpack 运行分析
#### 启动流程
1. 执行webpack命令 - 先从node_modules中找命令，汇集在.bin文件中哪些包 哪些命令。webpack
2. webpack 只做编译事情，webpack-cli处理命令执行

1. 检测webpac-cli是否安装，没有安装就安装
2. 安装完了 执行runCli 函数 引入 webpack-cli，执行webpack-cli的cli.js
3. runCLI（process.argv）=> new WebpackCli() =>  执行webpack-cli.run
4. 定义命令初始化命令， this.program.action 执行 => create compiler
5. 基本流程是 webpack => webpack-cli => init cmds => create compiler => init env => init node => init plugin => run hooks
6. create compiler 回到webpack 中执行 main:"lib/index.js" => webpack.js 

#### tapable  http://www.manongjc.com/detail/61-dgkcseaeyvskkyv.html

#### compiler.run
create compiler -> run -> create compliation -> make -> afterCompiler -> emit -> emit Assets

#### 高价用法
1. 使用autoprefixer兼容各个浏览器样式属性
2. Code Spliting - 不是所有的内容都需要在首屏加载 - 按需加载可以节省网络资源提升首屏速度
  * 设置entry 多入口
  * 设置entry dependencies 共享依赖
  * 使用import 动态导入模块
  * 设置内置的SplitChunksPlugin属性 - chunks: 'async' | 'initial' | 'all' ; minSize：打包出的最小文件大小限制； minChunks：最少共享chunks数，默认1
3. 公共资源使用外链- 减少打包体积、提升构建效率  - 减少重复cdn资源、用户更新
  * 直接在html 写
```js
  // 方式一   
  // webpack配置中添加
  externals: {
    jq: 'JQuery'
  }
  // 代码引入
  import $ from 'jq'
  // html
  <script src="....cdn.../jquery.js"></script>
```

   * 利用html-webpack-plugin编写
```js
  ///方式二 方式一中 不用在 htm 中收到输入
  // webpack配置中添加
  new HtmlWebpackPlugin({
    templateParameters:{
      titleName:'test',
      jsList:['....cdn.../jquery.js']
    }
  })
   // html
  <%= titleName %>
  <% for(var jsI in jsList) {%>
  <script src="<%= jsList[jsI] %>"></script>
  <%}%>
``` 

  * 利用webpack externals
```js
  //方式3
  externalsType: 'script',
    externals: {
    jq: ['....cdn.../jquery.js','JQuery']//   ['....cdn.../jquery.js','JQuery'，‘jquer中的某个属性、模块’]
  }
```

4. 将资源内联到html中 
   * html片段 - raw-loader or asset/source + html-webpack-plugin
   * js片段 -  html片段 基础上 使用 script 标签包含
   * css片段 - 使用 style-loader
```js
  // html 中
  <%= require('./inline/meta.html') %>
 // webpack配置中添加 loader
 {
  test:/inline\/.*\.html/,
  // type:'asset/source' 或者下面这个方式
  // use:['raw-loader'] // 需要修改  <%= require('./inline/meta.html').default %>
  use:[{
    loader:'raw-loader',
    options:{
      esModule:false //  这样就不用上面的 修改
    }
  }]
 }

 // ------------------------------------------
 // 直接 html 中
  <%= require('raw-loader!./inline/meta.html').default %>

// 引入js片段
<script>
   <%= require('raw-loader!./inline/test.js').default %>
   <%= require('raw-loader!babel-loader!./inline/test.js').default %> // 多个loader
</script>

```

5. 实现多页面应用打包 - 一个仓库多个页面
  入口1： 
   index.html   
   index.js   
  入口2：  
   index.html   
   index.js    

```js
  // 入口文件区分：entry
  // 多个html： html-webpack=plugin
  // 可以使用 npm i glob -D 来自动生成
  const entryFiles = glob.sync('./src/**/index.js')
  // entryFiles.forEach()
```
    
6. tree-shaking - DCE 去除不影响执行结果的代码，包括不会执行到的代码和未使用的变量等
   * ES6的模块依赖关系是确定的，和运行时状态无关，可以进行可靠的静态分析，即字面量上对代码分析
   * webpack中实现： DCE依靠的是代码压缩工具uglify-es/terser（uglify-es已经不再维护，terser是其fork版本，webpack从4.26版本从uglify-es 迁移到terser）

- 在package.json 中 "sideEffects": false; // DCE 默认是true 可以是个['./src/index/log.js'] 知道这个文件有副作用 不会被清除
- webpack 中正常是不用配置。开发模式中设置会生效 - optimization.usedExports 标记导出的模块是否被使用 - optimization.concatenateModules 标记根据模块的依赖关系合并到一个模块中，然后terser就可以删除无用代码

7. output配置 clean-webpack-plugin 自动清理前一次打包的文件 - 新版中 clean: true
8. 去除代码中的调试日志 - TerserPlugin
9. 构建SSR应用
10. Eslint 在 webpack 中的配置 5 中 使用 eslint-webpack-plugin  5之前 用 eslint-loader
11. webpack5 - module federation 
  传统代码共享方式   
    - 原生ESM - 无需构建依赖，原生加载  - 仅支持ESM其他类型资源均不支持
    - DllPlugin - 单独编译，直接从DLL引用  - 每次更改要重新构建，没有按需加载
    - externals - 单独成库，全局声明  - 需要单独创建库，没有按需加载

### 构建速度优化
1. 插件 speed-measure-webpack-plugin 分析构建过程 loader plugin 的耗时分析
2. webpack 自带的 build 命令添加 --profile 分析构建过程 loader plugin 的耗时分析
3. webpack --profile --json=webpack_output.json 可以上传到 webpack.github.io/analyse/#modules 分析 打包的结果

#### 计算机多核优化构建速度 - thread-loader 启动进行和通信 也需要耗时大概600ms
#### 使用缓存提升二次构建速度 
- 缓存模式 memory 、 filesystem
- 禁用缓存 cache:false
- memory: 只在开发者模式生效，开发者模式 默认生效

##### 缓存配置 - filesystem
- type:缓存类型 filesystem
- buildDependencies: 构建的额外依赖代码，推荐 config:[ filename]
- cacheDirectory:缓存目录，默认node_modules/.cache/webpack
- name:缓存名称，创建隔离独立的缓存
- version:缓存版本，不同版本无法使用

#### module federation & script标签静态引入 提升构建速度

#### 借助ESBuild 提升构建速度 esbuild-loader
ESbuild 是用go实现的一个类似webpack构建工具  
优势   
1. esbuild是新开一个进程，然后多线程并行，并且内存共享
2. go是纯机器码，比JIT快
3. 不使用AST，优化了构建流程
劣势
没有提供AST的操作能力，通过AST处理代码的babel-plugin不好处理

#### 借助swc 提升构建速度 swc-loader
用 Rust 写的高性能 TypeScript /JavaScript 转译器，类似于 babel
劣势:没有类似babel-plugin-import 之类的插件，按需引入组件库还需要babel

### 构建产物优化
1. 当前构建产物大小分布
2. 每个chunk包含哪些内容
3. webpack --profile --json=webpack_output.json 可以上传到 webpack.github.io/analyse/#modules 分析 打包的结果

插件分析 
const { BundleAnalyzerPlugin } = require('webpack-budle-analyzer')

#### 构建产物优化-通过代码压缩减小构建产物
- html压缩： html-webpack-plugin minify 属性
- css ： css-minimizer-webpack-plugin
- js： terser-plugin production默认生效
- js&CSS ： ESBuildMinifyPlugin

#### 构建产物优化- 通过优化图片减少静态资源
1. 压缩 image-minimizer-webpack-plugin 依赖 imagemin
2. CDN 图片
3. 图片 过小的图片 使用base64 嵌入页面中

#### 构建产物优化- 删除无用代码 - Terserplugin
1. console
2. 代码注释
3. 无用变量 函数

#### 构建产物优化- 使用分包减少 bundle 大小
- import 异步引入
- entry 声明
- splitChunks
  chunks: allasync|imitial// 分包模式
  minSize: 20000//生成 chunk 的最小体积
  minRemainingSize:0 // 确保拆分后剩余的最小 chunk 体积
  minChunks:1//共享模块的最小 chunks 数
  maxAsyncRequests:30 //按需加载时的最大并行请求数
  maxInitialRequests:30 //入口点的最大并行请求数
  cacheGroups: //可以继承和/或覆盖来自

#### 构建产物优化-优化polyfill减少不必要的兼容代码
polyfill - 代码兼容 兼容低版本浏览器
使用：
loader: 'babel-loader',
options: {
presets: [
['@babel/preset-env',{useBuiltIns: usagecorejs: 3}],
'@babel/preset-react'],
plugins: ['@babel/plugin-transform-runtime']
}