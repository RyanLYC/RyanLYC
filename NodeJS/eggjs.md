## Egg.js
- [官网](https://www.eggjs.org/zh-CN)
- Nest.js ts编写的后端框架
- [Demo]()
- [项目创建](https://www.eggjs.org/zh-CN/tutorials/typescript) 

### 创建项目
```shell
npm init egg --type=ts
```

### 目录结构
- Router 路由: 来描述URL和Controller的对应关系
- Controller 控制器：解释用户的输入，处理返回结果
- Service服务：对复杂业务逻辑进行封装-数据库获取数据处理 （非必须但是最好封装出来）
- 中间件（Middleware）
- 扩展（Extend）
- 配置（Config）
- 插件（Plugin）
- 生命周期（Lifecycle）


### [Config配置](https://www.eggjs.org/zh-CN/basics/config)
- 多环境配置
  * config.default.ts
  * config.prod.ts
  * config.default.ts
- 合并规则（深拷贝）
- 配置分类
  * 插件及中间件配置
  * 业务逻辑配置

### [Plugin](https://www.eggjs.org/zh-CN/basics/plugin)
- 使用第三方插件
  * 在plugin.ts中开启
  * 在config.ts中进行配置
- 插件开发

### [Extend](https://www.eggjs.org/zh-CN/basics/extend)
- Application
- Context
- Request
- Response
- Helper

### [启动自定义-app.js](https://www.eggjs.org/zh-CN/basics/app-start)
框架提供了这些 生命周期函数供开发人员处理：

- 配置文件即将加载，这是最后动态修改配置的时机（configWillLoad）
- 配置文件加载完成（configDidLoad）
- 文件加载完成（didLoad）
- 插件启动完毕（willReady）
- worker 准备就绪（didReady）
- 应用启动完成（serverDidReady）
- 应用即将关闭（beforeClose）

### [日志-logs](https://www.eggjs.org/zh-CN/core/logger)
- 日志路径
  * 开发环境 - /path/to/example-app/logs/example-app
  * 生产环境 - /home/admin/logs/example-app
- 日志分类
  * app-web.log应用日志
  * egg-web.log内核插件日志
  * common-error.log错误日志
- 日志级别
  * 文件日志级别
  * 终端日志级别

### [内置对象](https://www.eggjs.org/zh-CN/basics/objects)
- Application
- Context
- Request & Response
- Helper
- Config
- Logger

### [Controller](https://www.eggjs.org/zh-CN/basics/controller)
- 请求
  * query
  * body
  * header
  * params
- 响应
  * status
  * body
  * header
  * redirect

### [Service](https://www.eggjs.org/zh-CN/basics/service)
- curl(HttpClient)

### [Router](https://www.eggjs.org/zh-CN/basics/router)

### [中间件](https://www.eggjs.org/zh-CN/basics/middleware)
- 使用koa的编写方式
- 在config中使用
- 在router中使用
- 在插件中使用
- 默认中间件
