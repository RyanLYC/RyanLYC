### Redis

#### 安装

```shell
docker pull redis:7.0
```

#### 启动容器并带密码

```shell
sudo docker run --name egg-ts-demo-redis -p 6379:6379 -d --restart=always redis:7 redis-server --appendonly yes --requirepass "***"


# -p 6379:6379 :将容器内端口映射到宿主机端口(右边映射到左边)
# redis-server –appendonly yes : 在容器执行redis-server启动命令，并打开redis持久化配置
# requirepass “your passwd” :设置认证密码
# –restart=always : 随docker启动而启动
```

#### 命令

```shell
#查看容器
docker ps

#查看所有容器
docker ps -a

#查看进程
ps -ef | grep redis
```

#### 设置 docker 启动时 自动启动容器 指令如下

```shell
docker update 8b8d --restart=always #其中8b8d为容器id  可通过 docker ps 查看
```

#### 进入容器执行 redis 客户端

```shell
# redis容器的id是 a126ec987cfe
docker exec -it a126ec987cfe redis-cli -a 'your passwd'

# 终端
docker exec -it a126ec987cfe redis-cli -h 127.0.0.1 -p 6379 -a 'your passwd'
ping
# PONG
info
# Server
redis_version:4.0.9
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:d3ebfc7feabc1290
redis_mode:standalone
os:Linux 3.10.0-693.21.1.el7.x86_64 x86_64
...
# 不带密码
docker exec -it a126ec987cfe redis-cli
ping
# (error) NOAUTH Authentication required.
#127.0.0.1:6379> auth 'your passwd'
#OK
#127.0.0.1:6379> ping
#PONG
```

### Mongo

#### 安装

```shell
docker pull mongo:5.0
```

### Nginx

​nginx​​​ 一直是 ​​web server​​ 的必备神器，以稳定和高性能著称。

- 静态服务（​​html​​​，​​css​​​，​​js​​ 等静态资源访问）
- 反向代理
- 负载均衡 （大公司 运维）
  ​​\* Access log​​

#### 安装 nginx

1. nginx 官方下载 ​ - 下载完后直接解压，然后进入解压目录，打开 ​​cmd​​​，执行 ​​start nginx.exe​​
2. 浏览器访问 ​​http://127.0.0.1/​​ ， 出现界面证明启动成功。

#### 常用命令

- 启动：nginx
- 重启：nginx -s reload
- 停止：nginx -s stop
- 测试配置文件：nginx -t
- 指定配置文件：nginx -c xxx.conf

#### 启动一个 Docker 容器 nginx 例子

1. 下载 nginx 镜像 - 执行 ​​docker pull nginx​​​，可以看到没有输入版本，默认下载 ​​latest​​ 的。
2. 查看镜像 - 执行 ​​docker images​​，查看所有镜像。
3. 启动容器 - 执行 ​​docker run -p 81:80 -d --name myNginx nginx​​​ ，会返回一个 ​​id​​。
4. 执行 ​​docker ps​​ 查看容器列表。
5. 访问 nginx - 访问 ​​http://localhost:81/​​​ ，可以看到 ​​nginx​​ 的默认页，说明容器已经启动成功了。
6. 查看容器信息 执行 ​​docker inspect <id>​​，可以看到容器信息，非常的多。
7. 查看容器日志 执行 ​​docker logs <id>​​，可以看到容器日志，方便排查问题。
8. 进入容器控制台 执行 ​​docker exec -it <id> /bin/sh​​，可以进入到容器的控制台。
9. 执行 ​​exit​​ 就可以退出控制台。
10. 停止容器 执行 ​​docker stop <id>​​ ，就可以停止容器。
11. 删除容器 执行 ​​docker ps -a​​ 可以看到刚才被停止的容器依然存在。 - 执行 ​​docker rm <id> ​​ 可以删除容器，这次再查看就不在列表里了。
12. 文件映射 - 在启动容器的时候加上参数 ​​-v xxxx：xxx​​，冒号前面是宿主机（本地）的地址，冒号后面是虚拟机的地址 - docker run -p 81:80 -d -v D:/test:/usr/share/nginx/html --name myNginx nginx
13. 这个时候再访问 ​​nginx​​ ，就映射到我们本地的文件上面来了。

### 服务端开发之 Dockerfile

- 一个简单的配置文件，描述如果构建一个新的 ​​image​​ 镜像。
- .dockerignore 类似于 ​​.gitignore​​​ ， 可以把对 ​​docker​​ 没有用的文件忽略掉。

#### 语法

```shell
    # .dockerignore
    # 基于哪个镜像的基础上进行构建
    FROM node:14
    # 工作目录
    WORKDIR /app
    # 拷贝当前目录下的文件 到 /app 中  .dockerignore 文件中可以声明忽略拷贝的文件
    COPY  . /app

    # 构建镜像时, 一般用于做一些系统配置, 安装必备的软件, 可有多个 RUN
    RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
    RUN npm set registry  https://registry.npmmirror.com
    RUN npm install

    # 启动容器时, 只能有一个 CMD
    # npx pm2 log  cmd 最后的命令是一个阻塞控制台的程序
    CMD echo $SERVER_NAME && echo $SERVER_NAME && npm run dev && npx pm2 log

    # 环境变量
    ENV SERVER_NAME='editor-server'
    ENV AUTHOR_NAME='warbler'
```

#### 用 Dockerfile 构建镜像

最后的 . 指 Dockerfile

- docker build -t editor-server .
- 执行以下命令，查看是否有刚才的镜像 docker images

```java
// 启动容器
docker run -p 8081:3000 -d --name server1 editor-server
// 查看容器列表
docker ps
// 查看容器日志
```

### Docker-compose

通过一个配置文件，可以让系统一键启动所有的运行环境，​​nodejs​​​，​​mysql​​​，​​redis​​​，​​mongodb​​ 等。  
如果开发环境需要多个服务，就需要启动多个 ​​Docker​​ 容器。  
要连通多个 ​​Docker​​​ 容器，就需要 ​​Docker-compose​​。

#### 安装

​​Docker Desktop for Windows​​​ 自带 ​​docker-compose​​  
查看 docker-compose 版本  
docker-compose --version ( 2.0 以上 版本 docker compose version)

#### 配置文件

```shell
# 统一的版本号
version: '3'
services:
    editor-server: # service name
        build:
            context: . # 当前目录
            dockerfile: Dockerfile # 基于 Dockerfile 构建
        image: editor-server # 依赖于当前 Dockerfile 创建出来的镜像
        container_name: editor-server
        ports:
            - 8081:3000 # 宿主机通过 8081 访问
    editor-redis: # service name，重要！
        image: redis # 引用官网 redis 镜像
        container_name: editor-redis
        ports:
            # 宿主机，可以用 127.0.0.1:6378 即可连接容器中的数据库
            # 但是，其他 docker 容器不能，因为此时 127.0.0.1 是 docker 容器本身，而不是宿主机
            - 6378:6379
        environment:
            - TZ=Asia/Shanghai # 设置时区
    editor-mysql:
        image: mysql # 引用官网 mysql 镜像
        container_name: editor-mysql
        restart: always # 出错则重启
        privileged: true # 高权限，执行下面的 mysql/init
        command: --default-authentication-plugin=mysql_native_password # 远程访问
        ports:
            - 3305:3306 # 宿主机可以用 127.0.0.1:3305 即可连接容器中的数据库，和 redis 一样
        volumes:
            - .docker-volumes/mysql/log:/var/log/mysql # 记录日志
            - .docker-volumes/mysql/data:/var/lib/mysql # 数据持久化
            - ./mysql/init:/docker-entrypoint-initdb.d/ # 初始化 sql
        environment:
            # 初始化容器时创建数据库
            # - MYSQL_USER=user #创建 test 用户
            # - MYSQL_PASSWORD=userpsw #设置 test 用户的密码
            - MYSQL_DATABASE=editor_db # 初始化容器时创建数据库
            - MYSQL_ROOT_PASSWORD=ryanmysql
            - TZ=Asia/Shanghai # 设置时区
    editor-mongo:
        image: mongo # 引用官网 mongo 镜像
        container_name: editor-mongo
        restart: always
        volumes:
            - '.docker-volumes/mongo/data:/data/db' # 数据持久化
        environment:
            - MONGO_INITDB_DATABASE=editor_db
            - TZ=Asia/Shanghai # 设置时区
        ports:
            - '27016:27017' # 宿主机可以用 127.0.0.1:27016 即可连接容器中的数据库

```

./mysql/init/init.sql

```sql
-- docker-compose 启动 mysql 时的初始化代码

select "init start...";

-- 设置 root 用户可外网访问
use mysql;
SET SQL_SAFE_UPDATES=0; -- 解除安全模式，测试环境，没关系
update user set host='%' where user='root';
flush privileges;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ryanmysql'; -- 密码参考 docker-compose.yml
flush privileges;

select "init end...";

```

#### 命令

- 构建容器 ：docker-compose build
- 启动所有服务器：docker-compose up -d, 后台启动
- 停止所有服务：docker-compose down
- 查看服务：docker-compose ps

#### 自动发布 步骤

1. 使用 ​​github actions​​​ 监听 ​​main​​​ 分支 ​​push​​ 行为
2. 登录测试机，获取最新 ​​main​​ 分支代码
3. 重新构建镜像，​​docker-compose build editor-server​​
4. 重启所有容器，​​docker-compose up -d​​
