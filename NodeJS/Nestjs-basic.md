### nestjs官方CLI快速

```shell
npm i -g @nestjs/cli
nest new nestjs-basic-demo
cd nestjs-basic-demo
pnpm install
pnpm run start

```

| 命令格式 (Command)                                | 描述 (Description)             |
| :------------------------------------------------ | :----------------------------- |
| `new\|n [options] [name]`                         | 生成 Nest 应用程序。           |
| `build [options] [apps...]`                       | 构建 Nest 应用程序。           |
| `start [options] [app]`                           | 运行 Nest 应用程序。           |
| `info\|i`                                         | 显示 Nest 项目详情。           |
| `add [options] <library>`                         | 为您的项目添加对外部库的支持。 |
| `generate\|g [options] <schematic> [name] [path]` | 生成一个 Nest 元素。           |

在 `@nestjs/schematics` 集合中可用的原理图 (Schematics)：
| 名称 (Name) | 别名 (Alias) | 描述 (Description) |
| :---------------- | :----------- | :----------------------------------------- |
| **application** | application | 生成一个新的应用工作区 |
| **class** | cl | 生成一个新类 |
| **configuration** | config | 生成一个 CLI 配置文件 |
| **controller** | co | 生成一个控制器声明 |
| **decorator** | d | 生成一个自定义装饰器 |
| **filter** | f | 生成一个过滤器声明 |
| **gateway** | ga | 生成一个网关声明 |
| **guard** | gu | 生成一个守卫声明 |
| **interceptor** | itc | 生成一个拦截器声明 |
| **interface** | itf | 生成一个接口 |
| **library** | lib | 在单体多项目 (Monorepo) 中生成一个新库 |
| **middleware** | mi | 生成一个中间件声明 |
| **module** | mo | 生成一个模块声明 |
| **pipe** | pi | 生成一个管道声明 |
| **provider** | pr | 生成一个提供者声明 |
| **resolver** | r | 生成一个 GraphQL 解析器声明 |
| **resource** | res | 生成一个新的 CRUD 资源（集成全套业务代码） |
| **service** | s | 生成一个服务声明 |
| **sub-app** | app | 在单体多项目 (Monorepo) 中生成一个新应用 |

| 选项 (Options)                      | 描述 (Description)                                                          |
| :---------------------------------- | :-------------------------------------------------------------------------- |
| `-d, --dry-run`                     | 演练模式。报告将要执行的操作，但不实际写入或修改文件结果。                  |
| `-p, --project [project]`           | 指定要在其中生成文件的项目（通常用于多项目/单体工作区）。                   |
| `--flat`                            | 强制使用扁平化结构，不为生成的元素创建独立文件夹。                          |
| `--no-flat`                         | 强制为生成的元素创建独立文件夹。                                            |
| `--spec`                            | 强制生成测试文件（`.spec.ts`）。（默认：true）                              |
| `--spec-file-suffix [suffix]`       | 为测试文件使用自定义的后缀名。                                              |
| `--skip-import`                     | 跳过自动导入和注册到最近模块的操作。（默认：false）                         |
| `--no-spec`                         | 禁用测试文件（`.spec.ts`）的生成。                                          |
| `-c, --collection [collectionName]` | 指定要使用的原理图（Schematics）集合。                                      |
| `--type <type>`                     | 传输层类型。例如：`rest`（传统接口）、`graphql`、`microservice`（微服务）。 |
| `--crud [value]`                    | 自动生成 CRUD（增删改查）入口代码。                                         |
| `-h, --help`                        | 输出用法和帮助信息。                                                        |

### 热重载

```shell
pnpm add -D webpack-node-externals run-script-webpack-plugin webpack
```

webpack-hmr.config.js

```js
const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ["webpack/hot/poll?100", options.entry],
    externals: [
      nodeExternals({
        allowlist: ["webpack/hot/poll?100"],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  };
};
```

src/main.ts

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// 如果没有安装 @types/webpack-env，需要加上下面这行声明：
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 建议使用 NestJS 11 的默认端口写法或你自己的端口
  await app.listen(process.env.PORT ?? 3000);

  // 激活 HMR 核心逻辑
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
```

package.json

```json
"scripts": {
  "start:dev": "nest start --watch --webpack --config webpack-hmr.config.js"
}
```

如何确认 HMR 已经生效？
启动后，当你修改某个 controller 或 service 的代码并保存时，终端不会再出现完整的 [NestFactory] Starting Nest application... 重启日志，而是会看到 Webpack 快速编译并通过 [HMR] 替换模块的提示。

### 配置vscode调试

- 创建一个launch.json文件
- 选择Nodejs

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": ["run-script", "start:debug"],
      "runtimeExecutable": "npm",
      "runtimeVersion": "24.9.0",
      "internalConsoleOptions": "neverOpen", // 不自动打开调试控制台
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

### 后端编程思想

- OOP（Object Oriented Programming）：面向对象编程
- FP（Functional Programming）：函数式编程
- FRP（Functional Reactive Programming）：函数式响应式编程

1. 面向过程编程

- 按步骤获取表单元素
- 添加事件监听
- 直接操作DOM节点值

2. 函数式编程

- 确定性：相同输入必定产生相同输出
- 无副作用：不依赖/改变外部状态（如避免直接操作DOM）
- 模块化：通过小函数组合实现功能（如validate、createUser等独立函数）

3. 面向对象编程

- 封装：将数据和行为绑定在类中（如User类的属性和方法）
- 继承：通过extends实现类扩展（示例中未展示）
- 多态：相同方法不同表现（如不同User实例的greet()输出不同）

**AOP（Aspect Oriented Programming）是面向切面编程的简称，代表一种重要的编程范式。**

- 切面本质: 将新功能（如权限控制、统一日志、错误处理）以独立模块形式添加到业务系统外围，不修改原有业务功能代码。
- 与传统OOP区别:
  - OOP方式: 直接在类中新增方法和属性
  - AOP优势: 当存在多个业务系统（A/B/C/D）时，避免代码重复（CTRL+C/V），便于集中维护
- 切面类比: 像切土豆一样将业务系统"切开"，新功能模块平等作用于所有业务子系统
- 实现效果: 功能扩展不影响原业务逻辑，实现代码复用和集中管理

**IoC与DI是NestJS框架的核心基础概念。**

**IoC是一种思想&设计模式**
**DI是IoC的具体实现**

- IOC 控制反转 本质: 将原本由类内部控制的依赖关系反转给外部容器管理，是一种降低代码耦合度的设计原则。
- 第三方解耦: 通过引入"第三方"（如接口、容器等）来实现对象间的解耦，使各个组件可以独立变化。
- DI 依赖注入 实现方式: 依赖注入作为IoC的具体实现，允许在类外部创建依赖对象并通过构造函数、属性或方法注入。
- 优势对比: 传统强耦合方式下，修改依赖需要改动类内部代码；使用DI后只需修改注入的实例即可，大幅提升可维护性

**代码理解**

```ts
class IPhone {
  playGame(name: string) {
    console.log(`${name} play game `);
  }
}

// Stduent -> play -> IPhone强依赖关系
// IPhone依赖与Student -> 解耦
class Student {
  constructor(private name: string) {}

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  play() {
    const iphone = new IPhone();
    iphone.playGame(this.name);
  }
}

const student = new Student("toimc");

student.play();
```

**解耦**

```ts
export interface Phone {
  playGame: (name: string) => void;
}

export class DIStudent {
  constructor(
    private name: string,
    private phone: Phone,
  ) {
    this.phone = phone;
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  play() {
    this.phone.playGame(this.name);
  }
}

class Android implements Phone {
  playGame(name: string) {
    console.log(`${name} use android play game `);
  }
}
const student1 = new DIStudent("toimc1", new Android());
student1.play();
student1.setName("toimc2");
student1.play();

const student2 = new DIStudent("toimc3", new IPhone());
student2.play();
```

**Metadata Reflection API**

```ts
import "reflect-metadata";

function Inject(target: any, key: string) {
  target[key] = new (Reflect.getMetadata("design:type", target, key))();
}

class A {
  sayHello() {
    console.log("hello");
  }
}

class B {
  @Inject // 编译后等同于执行了 @Reflect.metadata("design:type", A)
  a!: A;

  say() {
    this.a.sayHello(); // 不需要再对class A进行实例化
  }
}

new B().say(); // hello
```

Nestjs核心概念
客户端 响应<->请求 控制器 依赖注入<->使用服务 服务 数据库<->持久化 数据接入

- 控制器(Controller)作用：负责处理HTTP请求并返回响应，解析请求类型和参数，作为客户端与服务层之间的桥梁
- 服务层(Service)特点：包含核心业务逻辑，采用面向切面编程(AOP)思想，通过依赖注入(DI)方式被控制器调用，可被多个控制器复用（如用户信息查询服务）
- 数据接入层(Data Access)：直接与数据库交互，负责数据模型定义，处理数据库查询/更新操作

**DTO & DAO**

- DTO定义: Data Transfer Object（数据传输对象），重点在于"传输"过程，如前端请求后端或后端请求数据库时的数据传输
- DAO定义: Data Access Object（数据访问对象），核心是"访问"操作，专门处理与数据库交互的逻辑

请求 -> DTO 层(接收部分数据，对数据进行帅选，不对应实体，属性是小于等于实体) <-> 逻辑 <-> DAO 层(对接数据库接口，不暴露数据库的内部信息，对应实体) -> 数据库

### Nestjs 生命周期

客户端 -> 中间件(全局中间件、模块中间件) -> 守卫(全局守卫、控制器守卫、路由守卫) -> 拦截器(全局拦截器 pre、控制器拦截器 pre、路由拦截器 pre (pre 前置)) -> 管道(全局管道、控制器管道、路由管道、路由参数管道) -> 控制器 -> 服务 -> 拦截器(路由拦截器 post、控制器拦截器 post、全局拦截器 post (post 后置)) -> 过滤器(路由过滤器、控制器过滤器、全局过滤器) -> 响应 -> 客户端

- 控制器 Controllers ： 处理请求
- 服务 Services ： 数据访问与核心逻辑
- 模块 Modules ： 组合所有的逻辑代码
- 管道 Pipes ： 核验请求的数据
- 过滤器 Filters ： 处理请求时的错误
- 守卫 Guards ： 鉴权与认证相关
- 拦截器 Interceptors ： 给请求与响应加入额外的逻辑
- 存储库 Repositories ： 处理在数据库中数据

请求 -> 请求数据校验Pipe -> 请求认证（鉴权设计Guard） -> 路由Controller -> 功能逻辑Service -> 数据库操作Repository -> 响应

### 环境配置

1. dotenv
2. config
3. js-yaml

安装 cross-env 配置环境

**使用@nestjs/config 模块**

```shell
pnpm i @nestjs/config -S
```

```ts
// .env.development
DB = "development - db";
// .env
COMMON_URL = "http://localhost:3000";
//.env.production
DB = "production - db";
// app.module.ts
import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";

const envFilePath = `.env.${process.env.NODE_ENV || "development"}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      // 全局配置模块，所有模块都可以使用。否则每个模块的module都要imports ConfigModule.forRoot()才能使用环境变量
      isGlobal: true,
      envFilePath,
      // 加载共同配置文件.env
      load: [() => dotenv.config({ path: ".env" })],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// user.controller.ts
import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ConfigService } from "@nestjs/config";
import { ConfigEnum } from "@/enum/config.enum";

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get("/getUsers")
  getUsers(): any {
    const db: string | undefined = this.configService.get(ConfigEnum.DB);
    console.log("数据库连接字符串：", db);
    const commonUrl: string | undefined = this.configService.get(
      ConfigEnum.COMMON_URL,
    );
    console.log("公共接口地址：", commonUrl);
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}

// script
//    "start:dev": "cross-env NODE_ENV=development nest build --webpack --webpackPath webpack-hmr.config.js --watch",
//    "start:prod": "cross-env NODE_ENV=production node dist/main",
```

**使用js-yaml**

```shell
pnpm i js-yaml -s
pnpm i -D @types/js-yaml
```

```ts
// config/config.yml
db:
  mysql1:
    host: 127.0.0.1
    port: 3306
    name: test-name

  mysql2:
    host: 127.0.0.1
    port: 3306

// config/config.development.yml
db:
  mysql2:
    name: mysql-dev1

// config/config.production.yml
db:
  mysql1:
    name: mysql-prod

  mysql2:
    name: mysql-prod


// configuration.ts
import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
import * as _ from "lodash";

const YAML_COMMON_CONFIG_FILENAME = "config.yml";

const filePath = join(__dirname, "../config", YAML_COMMON_CONFIG_FILENAME);

const envPath = join(
  __dirname,
  "../config",
  `config.${process.env.NODE_ENV || "development"}.yml`,
);

const commonConfig = yaml.load(readFileSync(filePath, "utf8"));

const envConfig = yaml.load(readFileSync(envPath, "utf8"));

// 因为ConfigModule有一个load方法->函数
export default () => {
  return _.merge(commonConfig, envConfig);
};

// app.module.ts
import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import Configuration from "./configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// user.controller.ts
import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ConfigService } from "@nestjs/config";
// import { ConfgEnum } from 'src/enum/config.enum';

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    const data = this.configService.get("db");
    console.log(
      "🚀 ~ file: user.controller.ts ~ line 23 ~ UserController ~ getUsers ~ data",
      data,
    );
    return this.userService.getUsers();
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}

// script
//    "start:dev": "cross-env NODE_ENV=development nest build --webpack --webpackPath webpack-hmr.config.js --watch",
//    "start:prod": "cross-env NODE_ENV=production node dist/main",
```

**"config": "^3.3.7",**

```shell
pnpm i config -S
```

```ts
// config/default.json
{
  "database": {
    "host": "localhost",
    "port": 3306
  }
}
// config/development.json
{
  "database": {
    "dbname": "dev",
    "username": "root",
    "password": "root"
  }
}
// config/production.json
{
  "database": {
    "dbname": "prod",
    "username": "root",
    "password": "long-random-password"
  }
}

// 0配置 直接使用
import * as config from 'config';

console.log(config.get('database'));
```

**第三方库nestjs-config**

**配置文件的参数验证Joi方案**

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";
import * as Joi from "joi";

const envFilePath = `.env.${process.env.NODE_ENV || "development"}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      // 全局配置模块，所有模块都可以使用。否则每个模块的module都要imports ConfigModule.forRoot()才能使用环境变量
      isGlobal: true,
      envFilePath,
      // 加载共同配置文件.env
      load: [() => dotenv.config({ path: ".env" })],
      validationSchema: Joi.object({
        COMMON_URL: Joi.string().uri(),
        DB: Joi.string(),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.string().ip(),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### ORM

ORM:Object Relational Mapping(对象关系映射),在编程中将面向对象概念与数据库概念对应起来.
映射关系：
定义的对象 ↔ 数据库表
对象实例 ↔ 表中的一条记录

- 优点：
  维护方便：数据模型集中定义，修改表结构只需修改模型
  代码简洁：一套代码可对接多种数据库(MySQL、Oracle等)
  功能强大：自动处理关联数据、事务操作等复杂场景
  开发高效：省去大量SQL编写工作
- 缺点：
  性能问题：复杂查询性能可能不如原生SQL
  优化困难：难以对ORM生成的SQL进行针对性优化

**TypeORM** https://nestjs.ztes.com/recipes/sql-typeorm.html

```yaml
# mysql
# docker-compose.yml
version: "3.1"
services:
  db:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports:
      - 3306:3306

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080

# docker compose up -d

#http://localhost:8080  账号密码 root 登录 建立testdb 数据库

# pnpm install --save @nestjs/typeorm typeorm mysql2
```
