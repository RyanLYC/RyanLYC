### 微前端

    将一个大型的前端应用划分为多个独立的小型应用。（化整为零）多个团队共同开发多个模块。

#### 微前端实现方案

- IFrame
  - 简单易用
  - 沙箱隔离（例如 iframe 中的弹窗文件中展示）
  - 刷新-重新加载窗口信息
- Single-spa
- Qiankun 基于 Single-spa，相当于加强版的 Single-spa，升级沙箱方案，不支持 vite，安装插件可以
- Micro-app 支持 vite

优势

- 团队管理 代码提交，团队&团队中的代码冲突问题
- 多个子应用独立 构建 开发 测试 部署

#### [micro-app](https://micro-zoe.github.io/micro-app/docs.html#/)

micro-app 是由京东前端团队推出的一款微前端框架，它借鉴了 WebComponent 的思想，通过 js 沙箱、样式隔离、元素隔离、路由隔离模拟实现了 ShadowDom 的隔离特性，并结合 CustomElement 将微前端封装成一个类 WebComponent 组件，从而实现微前端的组件化渲染，旨在降低上手难度、提升工作效率。

micro-app 和技术栈无关，也不和业务绑定，可以用于任何前端框架。

- WebComponent: 原生组件
- CustomElement：自定义元素-自带生命周期函数
- ShadowDom：元素隔离、样式隔离

#### [项目源码实战](https://github.com/RyanLYC/micro-app)

登录 -> 基座应用(main-vue3) -> 统一鉴权 -> 通用组件 -> 嵌入子应用 -> 初始化 micro-app

##### 接入各个子应用

micro-app 框架逻辑 -> 各个的子应用

- 主应用 vite + vue3
- 子应用 1 child1-nuxt2
  - 关闭 Are you interested in participating? - nuxt.config.js 增加 telemetry:false
  - 启用 ssr 生产环境 出现错误页面，增加路由 base 路径与主应用一致
  - 跨域问题 dev 时候启用 chrome 跨域插件 Allow CORS: Access-Control-Allow-Origin
    0.1.9；官方有提供 server.js 解决跨域
- 子应用 2 child-vue2
  - 提示 js/img 资源找不到，建立 public-path.js
    ```js
    if (window.__MICRO_APP_ENVIRONMENT__) {
      __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
    }
    ```
  - 允许跨域
    ```js
    module.exports = {
      devServer: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        proxy: {
          "/job": {
            target: "http://8.134.104.190:7001",
          },
        },
      },
    };
    ```
- 子应用 3 child-vite
  - 路由使用 hash 模式
  - 关闭虚拟路由
  - config 增加 base
- 子应用 react
  - 类似 vue2 资源找不到 public-path.js
  - npm run eject 在 start.js 修改端口号；webpackDevServer.config 修改 proxy，与 vite 一致； 修改 header ， "Access-Control-Allow-Origin": "\*",

##### 应用之间交互

1. 默认开启了沙箱隔离，拿不到全局数据
2. 主应用 window.jobType = jobType; 子应用获取
   ```js
   if (window.__MICRO_APP_ENVIRONMENT__) {
     this.jobTypeArr = window.rawWindow.jobType;
     console.log("主应用的jobType");
   } else {
     this.jobTypeArr = jobType;
   }
   ```
3. 样式冲突可以使用 namespace 解决；例如 vue2 项目与 vue3 项目的 elementui，https://element-plus.gitee.io/zh-CN/guide/namespace.html
4. 主应用操作子应用的 dom（子应用控制不了主应用的 dom）；通过 microapp 标签的@mounted 函数出来，或者 main.js 中的 microApp.start 中的生命周期监听
5. 数据通信：

   ```js
   microApp.setGlobalData({
     token,
   });
   // 方式1
   const globalData = microApp.getGlobalData() ?? {};
   <micro-app
      name="child3"
      :data="globalData"
      url="http://127.0.0.1:3002/child/findEnterprise"
      iframe
    ></micro-app>
    // 方式2
    import microApp from "@micro-zoe/micro-app";

    const globalData = microApp.getGlobalData() ?? {};
    microApp.setData("child3", globalData);

   ```

6. 子应用数据发送到主应用

   ```js
   // 子
   if (window.__MICRO_APP_ENVIRONMENT__) {
     window.microApp.dispatch({
       activeIndex: "child1",
     });
   }
   // 主
    <micro-app
    @datachange="handleDataChange"
    name="child1"
    url="http://localhost:3000/child1/"
    ssr
   ></micro-app>

   function handleDataChange(e) {
    let { activeIndex } = e.detail.data;
   }
   ```

7. 子应用跳转主应用路由

   ```js
   // main.js
   microApp.router.setBaseAppRouter(router);
   // 子
   // 第一种跳转方式
   // window.microApp.location.href = "/main/login";
   // 第二种跳转方式
   const baseRouter = window.microApp.router.getBaseAppRouter();
   baseRouter.push("/main/login");
   ```

8. 子应用跳转到子应用
   ```js
   if (window.__MICRO_APP_ENVIRONMENT__) {
     window.microApp.setGlobalData({ homeSearchValue });
     const baseRouter = window.microApp.router.getBaseAppRouter();
     baseRouter.push("/main/child2");
   }
   ```

##### 优化

1. 预加载 requestIdleCallback
2. 资源共享 https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/static-source
3. keep-alive https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/keep-alive
4. 过场进度条

##### 部署
