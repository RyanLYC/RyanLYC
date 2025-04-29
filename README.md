# 前端架全栈进阶之路

## [架构](./架构/README.md)

- [Linux 基础知识](./架构/Linux.md)
- [npm-yarn-pnpm](./架构/cmd.md)
- [帮助文档](./架构/在线帮助文档.md) - to do
- [脚手架](./架构/脚手架.md)
- [前端监控](./架构/前端监控.md) & [前端监控平台源码](https://github.com/RyanLYC/front-end-monitor) & [前端稳定性监控平台源码(增加拦截 xhr、fetch 请求、并核心模块化)](https://github.com/RyanLYC/monitor)
- [微前端-micro-app](./微前端/micro-app.md) & [项目源码](https://github.com/RyanLYC/micro-app)
- [前端性能优化](./架构/前端性能优化.md)

## 笔记

- [前端进阶](./前端进阶/README.md)
- [移动端响应式布局开发的方案](./前端进阶/移动端响应式布局开发的方案.md)
- [前端主题切换方案详解](./前端进阶/前端主题切换方案详解.md)
- [vue3 前端自适应的终及解决方案](./前端进阶/前端自适应的终及解决方案.md)
- [Grid 布局](./前端进阶/Grid.Html)
- [实现 iconfont 图标渐变](./前端进阶/实现iconfont图标渐变.md) 或者[参考](https://github.com/RyanLYC/web-vue3-template/blob/main/src/components/SvgIcon/index.vue)
- 保留一天数据，生成一个 demo 网站用于无网络地方展示或者固定显示那一天数据
  1. axios 返回后 用 FileSaver.js 以 url 和请求方法参数作为 url 保存文件
  2. 全部页面点击一次
  3. 拦截 axios 请求，直接使用对应的接口文件
- [图片懒加载](https://github.com/RyanLYC/ImgLazyLoad)
- [工具函数库](https://github.com/RyanLYC/zg-utils)
- [monorepo](./笔记/monorepo.md) [Demo](https://github.com/RyanLYC/monorepo)
- [大文件上传](https://github.com/RyanLYC/file_upload)[后台](https://github.com/RyanLYC/koa-mongodb)
- [网页置灰方案](https://github.com/RyanLYC/pagegray)
- [传统部署模式-pm2-eggJS-cluster](./笔记/传统部署模式.md)
- 基于 Github Actions & docker compose 的 CI & CD
  1. [服务器设置以及登录最佳实践](./笔记/服务器设置以及登录最佳实践.md)
  2. [CentOS7 安装 docker&docker-compose](./笔记/安装docker.md)
  3. [Github Actions](./笔记/GithubActions.md)
  4. [Docker](./笔记/Docker.md)
  5. [Docker-redis-mongo 配置](./笔记/Docker-redis-mongo配置.md)
- [el-table 导出为 Excel](./笔记/XLSX.md)
- [基于 nexus3 搭建 npm 私库](./笔记/基于nexus3搭建npm私库.md)
- [centos7 设置虚拟内存](./笔记/centos7设置虚拟内存.md)
- [TypeScript 常用内置工具类](./笔记/TS内置工具类.md)
- [浏览器事件详解](./笔记/浏览器事件详解.md)
- [前端模块化详解](./笔记/前端模块化详解.md)
- [JS 垃圾回收、event-loop](./笔记/JS垃圾回收.md)
- [HTTP 缓存 & 本地缓存](./笔记/缓存.md)
- [Monorepo 项目搭建 - pnpm](./笔记/Monorepo项目搭建.md)

## Vue

- [vue 3.5 版本]( Alpha 阶段)

  - 响应式属性解构
  - useTemplateRef
  - useId
  - SSR 相关改进
  - 支持直接在 Transition 内部嵌套 Teleport
  - app.onUnmount()用于注册清理函数
  - onScopeDispose 的 failSilently 参数

- [vue 3.4 版本](https://blog.vuejs.org/posts/vue-3-4) - [掘金中文](https://juejin.cn/post/7329280514627256361)
- [vue3-CHANGELOG](https://github.com/vuejs/core/blob/main/CHANGELOG.md)
- [vue3.4 项目模版](https://github.com/RyanLYC/vue3.4-template)
- [Vue3.2setup 语法糖](./VUE/Vue3.2setup语法糖.md)
- [vue-router4.0 钩子函数&执行流程](https://github.com/RyanLYC/vue-router4-course)
- [vue3.3 组件库](https://github.com/RyanLYC/vite-components) & [文档地址](https://ryanlyc.github.io/vite-components-last/components/button)
- [vue3 企业级项目模板搭建](https://github.com/RyanLYC/vue3-template)
- [vue3 企业后台管理功能模版](https://github.com/RyanLYC/web-vue3-template)
- [min-vue3](https://github.com/RyanLYC/mini-vue3)
- [mini-vuex](https://github.com/RyanLYC/mini-vuex)
- [esbuild 构建 Vue3 组件库](https://github.com/RyanLYC/vue3-component-library-esbuild)
- [vue3 - ECharts - TypeScript 简易封装](./VUE/ECharts.md)
- [vue.js 设计与实现](./VUE/vue.js设计与实现.md)
- [vue2 的高级用法 - [vue2(2.7.14)]https://github.com/vuejs/vue - @vue/cli 5.0.8](./笔记/vue2/vue2的高级用法.md)
- [vue 状态管理](./笔记/vue状态管理.md)
- [vue3-smooth-dnd-ts](https://github.com/RyanLYC/vue3-smooth-dnd-ts)
- [Pinia 相关](./VUE/pinia.md)
- [Vue3 拖拽库](./VUE/拖拽库.md)

## React

- [实现自己的 React18 - to do]()
- [React 企业开发模版](https://github.com/RyanLYC/react-template)

## SSR

- Vite + Vue3 + TS + SSR 的基本原理
  - 通过 Vue 的 server-renderer 模块将 Vue 应用实例转换成一段纯文本的 HTML 字符串
  - 通过 Nodejs 创建一个静态 Web 服务器
  - 通过 NodeJS 将服务端锁转换好的 HTML 结构发送到浏览器与 Client 进行 Hydrate
  - [vue3-ts-vite-ssr-starter](https://github.com/vok123/vue3-ts-vite-ssr-starter)
  - [asyncData 方式 demo](https://github.com/lincenying/vite-vue3-h5-ssr)
  - [爱此迎-vite5 ssr 项目](http://liangyancheng.cn:3000/) - [源码](https://github.com/RyanLYC/airbnb-ssr)
- Nuxt3 to do...

## [DevOps 基于 Jenkins](./架构/Jenkins.md)

## NodeJS

- [Express 与 Koa2 之间的区别](./NodeJS/Express与Koa2.md)
- [koa2-mongodb5](https://github.com/RyanLYC/koa-mongodb)
- [ejs 和 glob 用法](./NodeJS/ejs和glob用法.md)
- [数据库](./NodeJS/数据库.md)
- [cookie 与 Session](./NodeJS/cookie与Session.md)
- [跨域](./NodeJS/跨域.md)
  - [基于 iframe 的跨域解决方案](./跨域/基于iframe的跨域解决方案.md)
  - 三个标签是允许跨域加载资源 `<img src=XXX> <link href=XXX> <script src=XXX>`
  - [CORS 跨域资源共享](./跨域/CORS跨域资源共享.md)
  - [jsonP](./跨域/jsonP.md)
  - [nginx 反向代理](./跨域/nginx反向代理.md)
  - [websocket](./跨域/websocket.md)
  - 多种跨域方式样例代码
- [eggJs](./NodeJS/eggjs.md)
- [数据库](./NodeJS/数据库.md)
- [JWT](./NodeJS/JWT.md)
- [mongoDB](./NodeJS/mongoDB.md)
- [RBAC(role based access control)根据角色完成权限的控制](./NodeJS/RBAC.md)
- [业务链路](./NodeJS/业务链路.md)
- [Nestjs](./NodeJS/Nestjs.md) - [项目源码]()

## 夸端

- [uni-app](https://uniapp.dcloud.net.cn/) 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web(响应式)、以及各种小程序(微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝)、快应用等多个平台。
- [uni-app x](https://doc.dcloud.net.cn/uni-app-x/)是下一代 uni-app，是一个跨平台应用开发引擎。uni-app x 没有使用 js 和 webview，它基于 uts 语言。在 App 端，uts 在 iOS 编译为 swift、在 Android 编译为 kotlin，完全达到了原生应用的功能、性能。
- [Taro](https://taro-docs.jd.com/docs/version)是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ / 飞书 小程序 / H5 / RN 等应用。Taro 3 可以支持转换到 H5、ReactNative 以及任意小程序平台。

## ThreeJS

- [储能站模型交互](https://github.com/RyanLYC/threejs-cn)
- [vue3 ThreeJS 项目模版](https://github.com/RyanLYC/three-js-template)
- [园区模型](https://github.com/RyanLYC/threejs-park)
- [ThreeJS 基础知识](https://github.com/RyanLYC/threejs-base)
- [webGL 基础知识](https://github.com/RyanLYC/webgl-base)
- [三维机房](https://github.com/RyanLYC/computer-room-3d)

## 构建工具

- [vite](./构建工具/vite/README.md)
  - [mini-vite](https://github.com/RyanLYC/mini-vite)
  - [mini-vite2](https://github.com/RyanLYC/mini-vite2)
  - [vite 构建打包优化配置](./构建工具/vite/vite构建打包优化配置.md)
  - [关于 vite 的静态资源](./构建工具/vite/关于vite的静态资源.md)
- [webpack](./构建工具/webpack/README.md)
  - [webpack5 federation](https://github.com/RyanLYC/module-federation-webpack5)
  - [mini-webpack](https://github.com/RyanLYC/mini-webpack-js)
- [vite、webpack、rollup 原理](./构建工具/原理.md)

## CLI

- [move-folder-cli](https://www.npmjs.com/package/move-folder-cli) 在命令行上复制或移动文件夹
- [create-vite](https://github.com/RyanLYC/zg-create-app)

## 手写代码

- [apply](./手写代码/apply.js)
- [call](./手写代码/call.js)
- [bind](./手写代码/bind.js)
- [debounce](./手写代码/debounce.js)
- [throtte](./手写代码/throtte.js)
- [input throtte demo](./手写代码/input-throtte.html)
- [deepClone](./手写代码/deepClone.js)
- [清除字符串前后的空格的函数](./手写代码/清除字符串前后的空格的函数.js)
- [new](./手写代码/new.js)
- [Promise](./手写代码/promise.js)

## 工具

- [Git 命令速查表](https://shfshanyue.github.io/cheat-sheets/git)

## CDN 网站

- 国内
  - [BootCdn 网站](https://www.bootcdn.cn/)
  - [七牛云](http://staticfile.org/)
- 国外
  - [unpkg 网站](https://unpkg.com)
  - [cdnjs 网站](https://cdnjs.com/)
  - [jsdelivr 网站](https://www.jsdelivr.com/)

## 各种解决方案总结

- 编程规范解决方案
  - [项目搭建](https://github.com/RyanLYC/vue3-template)
  - [进阶模版](https://github.com/RyanLYC/web-vue3-template)
- 换肤解决方案
  - [前端主题切换方案详解](./前端进阶/前端主题切换方案详解.md)
  - [本地 + ElementPlus 共同换肤解决方案](https://github.com/RyanLYC/vue3-template-2024)
- 多端响应式适配解决方案
  - 媒体查询
  - rem
  - viewport - vw、wh - [异形移动机器处理](./前端进阶/异形移动机器处理.html)
  - tailwindcss
- 性能优化解决方案
  - [前端性能优化](./架构/前端性能优化.md)
  - [Vue 性能优化方法有哪些？](./VUE/Vue性能优化.md)
  - 网站性能查看-chrome network 、 Performance 、Lighthouse 扩展程序
  - 数据懒加载 (IntersectionObserver) vueuse 中的 useIntersectionObserver
  - 图片懒加载 (img src 占位图，构建 vue 自定义指令 mounted 生命周期 + IntersectionObserver 更换路径)
  - 打包体积过大 与 CDN 优化
  - gzip、http 缓存、service worker
- 图表解决方案
  - [ECharts](https://echarts.apache.org/zh/index.html)
  - [ECharts Demo 库](https://www.isqqw.com/)
  - [ECharts 封装库 DataV](http://datav.jiaminghi.com/)
  - [AntV](https://antv.antgroup.com/zh)
  - [D3](https://d3js.org/)
- SVG & Canvas
  - svg
    - svg 的 xml 中 svg 标签需要增加 id 属性，`<svg><use xlink:href="./image/svg.svg#idName" style="fill:red"/></svg>`
    - path 的 fill 属性需要删除 才可以变色
- 路由&应用渲染解决方案
  - [hash 模式](./面试题/hash.md)
  - [history 模式](./面试题/history.md)
  - CSR 客户端渲染是指前端框架(vue、react 等)，在浏览器中执行 JavaScript，根据接口返回的数据进行动态生成 HTML、CSS、和 JavaScript，渲染页面的流程。 浏览器白屏 -> 服务器 -> HTML 页面 -> 渲染页面 -> 想服务器请求 css、js 文件 -> api 接口数据 -> 渲染页面
  - SSR 服务端渲染原理：浏览器 -> 服务器 -> API -> 获取数据 -> 模版+数据 -> HTML 页面 -> 浏览器渲染
  - Prerender 预渲染针对非动态项目的解决方案。Prerender 预渲染是一种在服务器上预先渲染页面内容，并将其缓存到静态 HTML 文件中，当用户访问该页面时，将直接提供缓存的 HTML 文件，而不必生成页面内容，从而提高页面的渲染速度和性能。
  - 同构渲染：首页通过服务端渲染，其他内容通过客户端渲染的一种方式；会使得应用复杂且难以维护。
- 前端安全解决方案
  - XSS 跨站脚本攻击：攻击者将恶意的脚本注入到合法网站的页面中，使得用户在访问页面时，执行这些脚本，从而达到攻击者的目的。典型案例，v-html 显示评论内容--恶意脚本。
    - 阻止注入：判断评论内容是否合规
    - 阻止执行：DOMPurify 库
  - CSRF 跨站请求伪造：利用用户已经登录了的目标网站的身份，在用户不知情的情况下完成非法操作。
    - 攻击
      - 构造一个假的网页，用户打开，输入信息，
      - 用户登录过的其他网站，伪装请求进行恶意操作
    - 防止
      - token 令牌因为 token 存放于 header 中，只有自己知道。
  - 点击劫持(Clickjacking)： 用户点击操作，网站拦截了点击操作去执行其他事情
    - 需要一个恶意网站，用户访问，利用一个透明可以点击的控件放于想要点击的按钮上面，用户点击进行攻击，例如下载恶意程序
  - 其他安全防护
    - 内容安全策略(CSP):在 meta 中的 content 增加代码，会限制本地访问和指定域名访问，这样图片 CDN 会被拦截了，导致应用问题
    - 严格传输安全(HSTS):在服务端配置响应头用来通知浏览器应该只通过 HTTPS 访问该站点，并以后使用 HTTP 访问该站点的所有尝试都应该自动重定向到 HTTPS
- WebGL 和 3D 渲染解决方案
  - Canvas：2D 渲染环境
  - OpenGL：跨平台图像编程接口规范
  - WebGL：使用 OpenGL 绘制 3D 图形渲染(canvas 上使用 OpenGL)
    - 框架
      - Three.js 国内使用最多
      - Babylon.js
      - A-Frame 基于 Three.js 的 webVR 框架
      - PlayCanvas 面向游戏开发的 WebGL 引擎
- 模块化与打包工具解决方案
  - 模块化处理规范 CMD、AMD 和 UMD(兼容 AMC 和 CMD) 基本上不使用了太老了
    - CommonJS(CJS) 基于 Node
    - ES6 Modules(ESM) 基于浏览器
  - 打包模块化构建工具
    - vite
      - devServer 开发服务器，基于原生 ES(ES6 Modules)模块进行实现
      - 打包，使用 Rollup 进行打包
    - webpack 构建整个应用
    - rollup
- 第三方工具解决方案
  - 统计类工具
    - 友盟统计分析 收费
    - 百度统计
  - 云服务平台
    - 阿里云 使用率最广
    - 腾讯云
    - 七牛云
  - UI 组件库
    - Ant Design 阿里
    - element ui vue 社区维护
    - arco design 字节
    - vant vue 有赞
    - vuetify vue 社区维护
    - material-ui react 社区维护
  - Mock 数据平台
    - YApi
    - APIFox
    - swagger
    - Mock.js 需要代码实现
  - 验证服务工具(行为验证、身份验证(app 本机登录))
    - 极验 需要人工审核
    - 网易易盾 行为验证码
    - 友验 个人免费
  - 设计协作工具
    - 蓝湖
    - 墨刀
    - 摹客

## 八股文

- [计算机网络部分](./八股文/计算机网络部分.md)
- [浏览器部分](./八股文/浏览器部分.md)
- [前端工程化部分](./八股文/前端工程化部分.md)
- [性能优化部分](./八股文/性能优化部分.md)
- [HTML 部分](./八股文/HTML部分.md)
- [CSS 部分](./八股文/CSS部分.md)
- [JavaScript 部分](./八股文/JavaScript部分.md)
- [React 部分](./八股文/React部分.md)
- [VUE 部分](./八股文/VUE部分.md)

## ECMAScript

- [ECMAScript](./ECMAScript/index.md)
- [ES6 新特性-2015](./ECMAScript/ES6新特性-2015.md)
- [ES7 新特性-2016](./ECMAScript/ES7新特性-2016.md)
- [ES8 新特性-2017](./ECMAScript/ES8新特性-2017.md)
- [ES9 新特性-2018](./ECMAScript/ES9新特性-2018.md)
- [ES10 新特性-2019](./ECMAScript/ES10新特性-2019.md)
- [ES11 新特性-2020](./ECMAScript/ES11新特性-2020.md)
- [ES12 新特性-2021](./ECMAScript/ES12新特性-2021.md)
- [ES13 新特性-2022](./ECMAScript/ES13新特性-2022.md)

## 视频库

- [flv.js mpegts.js](./视频库/flvjs.md)

## 面试

- 浏览器相关
  - [浏览器的一个请求从发送到返回都经历了什么？](./面试题/网络相关/浏览器的一个请求从发送到返回都经历了什么.md)
  - [浏览器页面的渲染阶段?](./面试题/网络相关/浏览器页面的渲染阶段.md)
  - [cookie、session、localStorage、sessionStorage?](./面试题/网络相关/存储.md)
  - [http 状态码](./面试题/网络相关/http状态码.md)
  - [XSS 和 CSRF](./面试题/网络相关/XSS和CSRF.md)
  - [浏览器两个 tab 都是同域，如何在一个 tab 向另一个 tab 发消息](./面试题/网络相关/发消息.md)
- [CSS](./面试题/CSS/CSS.md)
- [HTML](./面试题/HTML/HTML.md)
- [JavaScript](./面试题/JavaScript/JavaScript.md)
  - [`==&===`](./面试题/JavaScript/==&===.md)
  - [['1', '2', '3'].map(parseInt)](./面试题/JavaScript/parseInt.md)
  - [闭包](./面试题/JavaScript/闭包.md)
  - !! - 双非操作可以把字符串和数字转换为布尔值 - !!2 true - !![] true - [] == false true 因为[].toString() = "" ; Number( "" ) = 0; 所有 0 == false 返回 true
  - [遍历数组的 n 种方法](./面试题/JavaScript/遍历数组的n种方法.md)
  - [继承](./面试题/JavaScript/继承.md)
  - [面向对象面试题](./面试题/JavaScript/面向对象面试题.md)
  - [输出以下代码的执行结果并解释为什么](./面试题/JavaScript/输出以下代码的执行结果并解释为什么.md)
  - [数组](./面试题/JavaScript/数组.md)
  - [call-apply-bind 区别](./面试题/JavaScript/call-apply-bind区别.md)
  - [类型检测](./面试题/JavaScript/类型检测.md)
  - [原型改造输出](./面试题/JavaScript/原型改造输出.md)
  - [Set-Map-WeakSet-WeakMap 的区别](./面试题/JavaScript/Set-Map-WeakSet-WeakMap的区别.md)
  - [原型&原型链](./面试题/JavaScript/原型链.md)
  - [JS 执行原理](./面试题/JavaScript/JS执行原理.md)
  - [函数的参数 arguments 是数组吗？](./面试题/JavaScript/arguments.md)
  - [柯里化](./面试题/JavaScript/柯里化.md)
  - [es6 语法](./面试题/JavaScript/es6.md)
- VUE
  - [vue 组件间通信方式](./VUE/vue组件间传值方式.md)
  - [vue3 内置指令](https://cn.vuejs.org/api/built-in-directives.html#v-text)
  - [vue-router 有几种模式](./VUE/vue-router有几种模式.md)
  - vue 首屏渲染优化有哪些? `图片压缩/懒加载 - 禁止生成 .map 文件 - 路由懒加载 - cdn 引入公共库 - 开启 GZIP 压缩`
  - [watch 和 computed 区别和使用场景](./VUE/watch和computed区别和使用场景.md)
  - vue2.0&vue3.0 双向绑定的实现原理
  - [vue 生命周期函数](./VUE/vue生命周期函数.md)
  - [v-show 和 v-if 有什么区别](./VUE/v-show和v-if有什么区别.md)
  - [什么是 SPA-有什么优点和缺点](./VUE/什么是SPA-有什么优点和缺点.md)
  - v-if 与 v-for 那个优先级更高？怎么优化？
    - v-for 优先级更高，因为源码中优先判断 el.for 再到 el.if
    - 同一个标签中的时候，每次渲染都会先执行循环再判断条件，浪费性能
    - 优化方式一是外层增加一个 template 标签做 v-if 判断，内部 v-for 循环
    - 优化方式二 使用 computed 得到最终结果渲染
  - Vue 组件 data 为何必须是个函数？Vue 的根实例则没有此限制？
    - data 必须为函数是为了同个组件多个实例的时候，使用不同的 data(源码中，初始化 data 的时候会检测是否是个 function，是则执行然后赋值给 data，否则使用传入的 data。实际是运行不了，vue 报错提示 data 必须是个函数)
    - 根实例没有限制是因为每次创建是使用 new Vue() 创建不同实例
  - key 的作用&工作原理？
    - key 的作用是高效地更新虚拟 Dom
    - 原理是 Vue 在 patch 过程中通过 key 可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使 patch 过程更加高效，减少 dom 操作，提高性能。
    - 如果不设置 key，key 就会=undefined，每个元素的 key 都是相等的，可能会引发 bug
  - vue 的 diff 算法？
    - diff 是新旧虚拟 Dom 的对比，将变化的的 Dom 更新到真实的 Dom 上。高效的 diff 算法降低对比的时间复杂度
    - vue 中每个组件都会有一个 watch，组件改变的时候触发更新函数，此时会执行 diff，他会比对上一次渲染结果 oldVnode 和新的渲染结果 newVnode，此过程是 patch-打补丁
    - vue 的 diff 算法遵循深度优先、同层比较的策略；两个节点之间比较会根据他们是否拥有子节点或者文本节点做不同的操作；比较两组子节点的时候，是假设头尾节点可能相同做 4 次对比尝试，如果没有找到相同的节点才按照通用方式遍历查找，查找结束批量删除或者新增处理剩余的节点；借助 key 通常可以非常精确找到相同节点，因此整个 patch 过程非常高效。
  - vue 组件化的理解？
    - 组件系统是 Vue 的核心特效，频繁更新的数据显示定义为组件可以优化性能，因为每个组件有一个 watch，改变后更新组件
    - 组件化可以提供开发效率、复用性等
    - 组件一般分为页面组件、业务组件、通用组件
    - vue 的组件是基于配置的，我们编写的 template 组件的 vue 文件是组件配置，框架会生成其构造函数，它们基于 VueComponent，扩展与 Vue
    - vue 的组件化技术：属性 props、自定义事件、插槽，自定义指令等，用于组件的通信和扩展
    - 组件要遵循单向数据流
    - 组件要高内聚、低耦合
  - MVC、MVP、MVVM 的理解？
    - MVC - user -> C -> M -> V 、 M -> V 、 C -> V ； C 可以操作 V，M 也可以操作 V，user 通过 V 调用 C
    - MVP - M -> <- P -> <- V ; P 负责管理一切操作
    - MVVM - VM 是 ViewModel 类似 P，
    - 三个都是框架模式，主要是为了解决 Model 和 View 的耦合问题
    - MVC 很早期，前端还是模版时期
    - MVP 是 MVC 的进化，P 层处理 MV 之间的通信
    - MVVM 主要是前端中使用，类似于 MVP，VM 解决两者的映射关系
  - [Vue 性能优化方法有哪些？](./VUE/Vue性能优化.md)
  - [Vue3.0 新特性](./VUE/Vue3.0新特性.md)
  - VueX 的使用以及理解
    - vue component ->dispatch -> Action(后端 API 获取数据) ->commit -> Mutations(Devtools) ->Mutate -> State ->Render -> vue component
    - vuex 是 vue 的专用状态管理库，以全局方式管理应用的状态
    - vuex 解决多个组件之间的状态共享问题
    - vuex 并非必须使用
    - vuex 实现单向数据流醉倒数据的响应式
  - vue 的 nextTick，是什么？干什么？实现原理？
    - 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，可以获取到更新后的 Dom
    - Vue 在更新 DOM 的时候是异步的。只要侦听到数据变化，Vue 将开启一个队列，并缓存在同一个事件循环中发生的所有数据变更。如果同一个 watcher 被多次出发，只会被推入到队列中一次，避免不必要的 DOM 计算。nextTick 方法会在队列中加入一个回调函数，确保该函数前面的 DOM 操作全部完成后才调用
  - Vue 响应式的理解？
    - 响应式：就是能够使数据变化可以被检测到并对这种变化做出响应的机制
    - MVVM 框架中要解决的一个核心问题就是连接数据层和视图层，通过数据驱动视图更新
    - vue 的数据响应式结合虚拟 DOM 和 patch 算法，让我们只需要操作数据，不用繁琐的操作 DOM
    - Vue2 中数据响应式会根据不同的数据类型进行处理，如果是对象会采用 Object.defineProperty()的方式定义数据的拦截，当数据被访问或者发生变化时，做出响应。对象初始化后在追加属性是不会有响应式的，需要使用 Vue.set/delete 才能生效。如果是数组则通过覆盖数组原型的方法，扩展它的 7 个变更方法，使这些方法可以做出响应。对于 es6 的 Map、Set 这些数据结构不支持等问题
    - Vue3 重写了这部分，使用了 es6 的 proxy 机制代理要这些需要响应式的数据。
  - [如何扩展某个 Vue 组件？](https://cn.vuejs.org/api/options-composition.html#provide)
    - 扩展的方式 mixins(vue3 推荐使用 composition api)、slots、extends
    - mixins:一个包含组件选项对象的数组，这些选项都将被混入到当前组件的实例中。
    - extends:使一个组件可以继承另一个组件的组件选项。
    - slots
    - composition api 逻辑复用
  - keep-alive 缓存
    - router 中的 meta 的 noCache: true // 如果设置为 true，则不会被 <keep-alive> 缓存(默认 false)
    - keep-alive 中的插槽的 :key 改变的时候将 router-view 重新渲染了，不使用缓存。去掉即可
      ````html
      <router-view v-slot="{ Component, route }" ':key="route.path"'>
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition> </router-view
      >```
      ````
    - template 只能存在一个根标签，当存在两个根标签的情况不缓存（当注释和根标签同时存在并且是兄弟时，也不缓存）
  - vue3 错误处理
    - 全局错误处理器 config.errorHandler
    - 组件级错误捕获器 onErrorCaptured

## 自动化测试

- [Python + PyTest + Allure 接口自动化测试框架 + Demo + 连接 mysql 数据验证](https://github.com/RyanLYC/system_api_autotest)
- [Python + PyTest + Allure + Selenium3 web 自动化测试框架 - to do (未完善，可参考接口自动化项目进行完善)](https://github.com/RyanLYC/system_autotest)
