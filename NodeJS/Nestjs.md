### NestJS

#### 特点

- JS 的 Spring 框架
- 支持 typescript
- 构建高效可伸缩
- 装饰器风格
- 模块加载采用依赖注入 IOC 方式（Spring 与 AngularJS）
- 配套功能齐备（鉴权、文档、微服务、CLI、GraphQL）

#### CLI 生成代码

```shell
nest g mo **** #生成Module
nest g co **** #生成Controller
nest g s ***** #生成Service
nest g resource ***** #生成一套Restful风格接口
```

#### RESTful API 风格

- Resources 资源
  - 网络上的文本、图片、文件
  - http://baidu.com/users/
- Representation 表现层
  - 格式 json、xml、html 格式
  - 应该在 Http 的请求头信息中有 Accept 和 Content-Type 字段指定
- State transfer 状态转化
  - Get 读取
  - Post 新建
  - Put 更新
  - Patch 部分更新
  - Delete 删除

#### Swagger 接口文档

#### Controller 与 Http 接口实现

- Controller 的作用：负责处理输入的 request 请求并向客户端进行响应
- DTO：数据传输对象，控制 Controller 参数传入的类型

#### 利用 Pipe 通道实现数据校验

- pnpm i class-validator class-transformer

```ts
// 全局类校验管道
app.useGlobalPipes(
  new ValidationPipe({
    // true - 去除类上不存在的字段，false - 不会去除
    whitelist: true,
    // transform: 自动转换请求对象到 DTO 实例
    transform: true,
    transformOptions: {
      // 允许类转换器隐式转换字段类型，如将字符串转换为数字等。
      enableImplicitConversion: true,
    },
  })
);
```

#### 控制反转 IOC 与 DI

- IOC:Interversion Of Control 控制反转，是面向对象编程中的一种设计原则，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用注入给它。
- 设计 IOC 的目的
  - 把执行的任务和实现(implement)解锁。
  - 使得开发者关注模块的任务设计上
  - 将模块从系统运行中抽离出来，取而代之的是契约关系
  - 防止更换模块产生副作用
- DI:Dependency Injection，依赖注入，自身对象中的内置对象是通过注入的方式进行创建。
  - 构造器
  - Setter
  - 接口注入
- 接口注入是通过实现某个接口，来达到设置属性的注入目的。

#### 模块化 Modules

#### [文档](https://docs.nestjs.cn/)

[10](https://docs.nestjs.cn/10/introduction)

#### NodeJS 环境

- nvm

#### NestJS CLI

- 创建项目方式 1

```shell
npm i -g @nestjs/cli
nest new project-name
nest --help
```

- 创建项目方式 2

```shell
npm i -g degit
degit 模版项目git地址 目录名
```

- 模版项目 git 地址 https://github.com/nestjs/awesome-nestjs?tab=readme-ov-file#examples

#### 调试 Node 应用

- 单文件入口调试： 小虫子按钮 -》launch.json 文件 -》 修改入口文件 program 的{}后 -》 没有 ts 的时候删除 preLaunchTask -》 启动调试注意 name 一致
- 通过执行 npm run dev:debug 来调试：小虫子按钮 -》launch.json 文件 -》 configurations 中输入 npm，选择通过 npm 启动 -》runtimeArgs 下面的 debug 改为 dev:debug -》 增加"runtimeVersion":"nodejs 的版本号" -》 可选的 internalConsoleOptions:neverOpen

#### 安装 docker

- [docker-install](https://github.com/docker/docker-install)
- 设置 docker 开机自启
- 管理 docker 工具
  - [lazydocker](https://github.com/jesseduffield/lazydocker)
  - [portainer.io 社区版免费](https://www.portainer.io/)
- docker 镜像加速

#### Nestjs 声明周期

客户端 -> 中间件(全局中间件、模块中间件) -> 守卫(全局守卫、控制器守卫、路由守卫) -> 拦截器(全局拦截器 pre、控制器拦截器 pre、路由拦截器 pre (pre 前置)) -> 管道(全局管道、控制器管道、路由管道、路由参数管道) -> 控制器 -> 服务 -> 拦截器(路由拦截器 post、控制器拦截器 post、全局拦截器 post (post 后置)) -> 过滤器(路由过滤器、控制器过滤器、全局过滤器) -> 响应 -> 客户端

#### MVC 、 DTO 、 DAO

- model view controller
- data transfer Object 数据传输对象
- data access Object 数据访问对象
  请求 -> DTO 层(接收部分数据，对数据进行帅选，不对应实体，属性是小于等于实体) <-> 逻辑 <-> DAO 层(对接数据库接口，不暴露数据库的内部信息，对应实体) -> 数据库

#### 环境变量的处理

[cross-env](https://www.npmjs.com/package/cross-env) 设置环境
[config](https://www.npmjs.com/package/config) 配置环境变量
[dotenv](https://www.npmjs.com/package/dotenv)配置环境变量
[@nestjs/config](https://www.npmjs.com/package/@nestjs/config) 配置环境变量-内置 dotenv
[joi](https://www.npmjs.com/package/joi)配置文件校验库

#### 日志

- 记录的内容
  - 发生时间
  - 发生什么事情
  - 错误是什么
- 日志方案
  - 官方日志
  - winston 推荐
  - pino
- 日志等级
  - Log 通用日志
  - Warning 警告日志
  - Error 错误日志
  - Debug 调试日志
  - Verbose 详细日志

#### 创建项目

```shell
nest -v
# 10.4.9
nest n nestjs-starter
# 选择pnpm
# 检测那些模块需要更新
npm-check -u
# 发现发布了 11更新忽略吧。
```

##### 配置 config + joi

```shell
pnpm i @nestjs/config joi cross-env
pnpm i cross-env -D

# 创建模块 mo 模块  --no-spec 不要测试文件
nest g mo common/config --no-spec
```

#### 日志

```shell
pnpm i winston nest-winston
pnpm i winston-daily-rotate-file
```

#### 全局过滤器

```shell
# f 过滤器 --flat 最后一个all-exception不是文件夹
nest g f common/filters/all-exception --flat --no-spec
```

#### SWC

- SWC 快速编译 https://docs.nestjs.cn/10/recipes?id=swc-%e5%bf%ab%e9%80%9f%e7%bc%96%e8%af%91%e5%99%a8
- pnpm i --save-dev @swc/cli @swc/core
- nest-cli.json 加上 "builder": "swc"

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "builder": "swc"
  }
}
```

- .swcrc 文件

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```

- tsconfig.json 加上

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"],
      "src/*": ["src/*"]
    }
  }
}
```

- jest + swc - https://docs.nestjs.cn/10/recipes?id=swc-%e5%bf%ab%e9%80%9f%e7%bc%96%e8%af%91%e5%99%a8
- pnpm i --save-dev jest @swc/core @swc/jest
- 安装完成后，使用以下内容更新 package.json / jest.config.js 文件（具体取决于您的配置）：

```json
{
  "jest": {
    "transform": {
      "^.+\\.(t|j)s?$": ["@swc/jest"]
    }
  }
}
```

#### [高速缓存（Caching）](https://docs.nestjs.cn/10/techniques?id=%e9%ab%98%e9%80%9f%e7%bc%93%e5%ad%98%ef%bc%88caching%ef%bc%89)

缓存是一项伟大而简单的技术，可以帮助提高应用程序的性能。它充当临时数据存储，提供高性能的数据访问。

- redis 库
  - ioredis 推荐
  - node-redis
- redis 镜像
  - 官方镜像：`https://hub.docker.com/_/redis`
  - 第三方镜像：`https://hub.docker.com/r/bitnami/redis`
  - bitnami 提供了非常丰富的环境变量与功能，参考说明文档：https://github.com/bitnami/containers/blob/main/bitnami/redis/README.md
- Redis Docker-compose 配置
  - https://github.com/codewithrajranjan/awesome-docker-compose

```yaml
version: "3.3"
services:
  redis:
    image: redis:latest
    container_name: redis
    restart: always
    volumes:
      - redis_volume_data:/data
    ports:
      - 6379:6379

  redis_insight:
    image: redislabs/redisinsight:latest
    container_name: redis_insight
    restart: always
    ports:
      - 8001:8001
    volumes:
      - redis_insight_volume_data:/db

volumes:
  redis_volume_data:
  redis_insight_volume_data:
```

- [Redis 桌面端客户端](https://goanother.com/cn/)
- Redis 官方配置列表：https://redis.io/docs/latest/operate/oss_and_stack/management/config/

  - The self documented [redis.conf for Redis 7.2](https://raw.githubusercontent.com/redis/redis/7.2/redis.conf).
  - The self documented [redis.conf for Redis 7.0](https://raw.githubusercontent.com/redis/redis/7.0/redis.conf).
  - The self documented [redis.conf for Redis 6.2](https://raw.githubusercontent.com/redis/redis/6.2/redis.conf).
  - The self documented [redis.conf for Redis 6.0](https://raw.githubusercontent.com/redis/redis/6.0/redis.conf).
  - The self documented [redis.conf for Redis 5.0](https://raw.githubusercontent.com/redis/redis/5.0/redis.conf).
  - The self documented [redis.conf for Redis 4.0](https://raw.githubusercontent.com/redis/redis/4.0/redis.conf).
  - The self documented [redis.conf for Redis 3.2](https://raw.githubusercontent.com/redis/redis/3.2/redis.conf).
  - The self documented [redis.conf for Redis 3.0](https://raw.githubusercontent.com/redis/redis/3.0/redis.conf).
  - The self documented [redis.conf for Redis 2.8](https://raw.githubusercontent.com/redis/redis/2.8/redis.conf).
  - The self documented [redis.conf for Redis 2.6](https://raw.githubusercontent.com/redis/redis/2.6/redis.conf).
  - The self documented [redis.conf for Redis 2.4](https://raw.githubusercontent.com/redis/redis/2.4/redis.conf).
  - 官方配置：https://redis.io/docs/latest/operate/oss_and_stack/management/config-file/
  - 7.2 官方配置：https://raw.githubusercontent.com/redis/redis/7.2/redis.conf
  - edis 目录下有一个`redis.conf` 配置文件，里面会有 Redis 的默认配置，通过修改该配置，可以对 Redis 达到一定程度的优化；或者根据业务的不同也可以修改该配置文件。

- docker compose -f docker-compose.redis.yaml up -d
- 网页 localhost:8001 可以访问 参数： host：redis 、Port：6379 、 Name：redis-local
- 桌面端客户端 连接 redis 参数：host：localhost 、 Port： 6379 、 Connection Name：local-test

```yaml
version: "3.3"
services:
  redis:
    image: bitnami/redis:latest
    container_name: redis
    restart: always
    environment:
      - REDIS_PASSWORD=example
    ports:
      - 6379:6379
```

- Nestjs
  - 内存缓存:Nest 为各种缓存存储提供程序提供了统一的 API。内置的是内存中的数据存储。但是，您可以轻松地切换到更全面的解决方案，比如 Redis 。为了启用缓存，首先导入 CacheModule 并调用它的 register() 方法。
  - 服务在底层使用缓存管理器(cache-manager)。cache-manager 包支持一个宽范围的可用存储，例如，Redis 存储。
  - pnpm i @nestjs-modules/ioredis ioredis
  - pnpm install @nestjs/cache-manager cache-manager
  - pnpm install -D @types/cache-manager
  - pnpm i cache-manager-redis-store

#### 第三方服务模块：常见短信、邮件服务对接

- Amazon SES
- SendCloud
- Nestjs
  - @nestjs-modules/mailer 模块

```shell
pnpm install --save @nestjs-modules/mailer nodemailer
pnpm install --save-dev @types/nodemailer

# 模版引擎
npm install --save handlebars 用这个吧
#or
npm install --save pug
#or
npm install --save ejs
#or
npm install --save mjml
```

- 使用 QQ 邮箱 SMTP 服务做测试
  - QQ 邮箱 设置 -》 帐号 -》 POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV 服务 -》 开启服务
  - https://service.mail.qq.com/detail/0/310

```ts @Get()
  @Version('2')
  getHelloV2() {
    this.mailerService
      .sendMail({
        to: '656040874@qq.com',
        from: 'leungryan@qq.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'welcome', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          name: 'lyc doe',
        },
      })
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        console.log('sendMail:', err);
      });
  }
```

#### [数据库](https://docs.nestjs.cn/10/techniques?id=%e6%95%b0%e6%8d%ae%e5%ba%93)

- ORM 是 nestjs 与数据库之间的桥梁
  - [TypeORM](https://github.com/typeorm/typeorm) mongodb 只支持 5.x 以下的版本
  - [Prisma](https://www.prisma.io/docs/orm/reference/supported-databases) mongodb 只支持 4.2 以上的版本
  - Mongoose 支持 mongoDB
- nestjs 集成 Prisma https://docs.nestjs.cn/10/recipes?id=prisma
- [Prisma](https://docs.nestjs.cn/10/recipes?id=prisma)
  - pnpm install prisma --save-dev
  - npx prisma
  - npx prisma init
  - docker compose -f docker-compose.mysql.yaml up -d
  - pnpm install @prisma/client
  - npx prisma generate
  - nest g mo database/prisma --no-spec
  - nest g s database/prisma --no-spec
  - npx prisma db push
- [TypeORM](https://docs.nestjs.cn/10/recipes?id=typeorm)
  - pnpm install --save typeorm mysql2
- [mongoose](https://docs.nestjs.cn/10/recipes?id=mongoose)
  - pnpm install --save mongoose
  - pnpm install --save-dev @types/mongoose
  - 手动创建数据库 nest
  - 连接字符串 const defaultUrl = 'mongodb://root:example@localhost:27017/nest';
  - 如果出现连接失败，可能是因为新建的 nest 数据没有分配管理员权限
    - docker exec -it [mongo 容器名] mongosh -u -root -p
    - 输入密码
    - 查看数据库 show dbs;
    - use nest; 切换数据库
    - db.createUser({user:'root',pwd:'example',roles:[{role:'dbOwner', db:'nest'}]})
- [多个数据库](https://docs.nestjs.cn/10/techniques?id=%e5%a4%9a%e4%b8%aa%e6%95%b0%e6%8d%ae%e5%ba%93-1)
- [控制器 Request](https://docs.nestjs.cn/10/controllers?id=request)

```ts
  @Post(':id') // Post请求 的 路径参数需要配置
  postHello(
    @Query('page') page:string, // Params 参数
    @Param('id') id:string, // 路径参数
    @Body() body: any, // Body参数
    @Headers('x-system-id') systemId:string // header 参数
    ) {
    return this.userRepository.create(createUserDto);
  }
```

### NestJS 微服务

#### 创建 monorepo 项目
