### Docker

基于 Docker，我们可以把开发、测试环境，一键部署到任何一台机器上。只要机器安装了 Docker

`安装完成后需要 docker镜像加速 修改源`

- 更快速启动
- 更少资源占用
- 一致的运行环境
- 微服务机构

#### 常用命令

- 镜像命令

* docker images：列出所有镜像
* docker search [image]：搜索 Docker 镜像
* docker pull [image]：拉取指定镜像
* docker rmi [image]：删除指定镜像

- 容器命令

* docker ps：列出当前所有正在运行的容器
* docker ps -a：列出所有容器，包括已经停止的容器
* docker create [image]：创建一个新的容器，但不启动它
* docker start [container]：启动一个容器
* docker stop [container]：停止一个容器
* docker rm [container]：删除一个容器
* docker exec -it [container] [command]：在运行中的容器中执行命令

- 其他命令

* docker info：显示 Docker 系统信息
* docker version：显示 Docker 版本信息
* docker logs [container]：查看容器的日志
* docker network ls：列出 Docker 网络
* docker network create [network]：创建一个新的 Docker 网络
* docker network connect [network] [container]：将容器连接到指定的 Docker 网络
* docker network disconnect [network] [container]：将容器从指定的 Docker 网络中断开连接

### container 容器

启动容器 ​​ docker run -p 81:80 -v hostPath:containerPath -d --name <container-name><image-name>

- -p 端口映射 81 为主机的端口 80 为镜像中的端口
- -v 数据卷，文件映射 hostPath 主机地址 containerPath 容器地址
- -d 后台运行
- --name 定义容器名称 ​​

1. 查看所有容器 ​​docker ps​​​，加 ​​-a​​ 显示隐藏的容器
2. 停止容器 ​​docker stop <container-id>​​
3. 删除容器 ​​docker rm <container-id> ​​​，加 ​​-f​​ 是强制删除
4. 查看容器信息，如 ​​IP​​​ 地址 ​​docker inspect <container-id>​​
5. 查看容器日志 ​​ docker logs <container-id>​​
6. 进入容器控制台 ​​docker exec -it <container-id> 需要执行的命令- 例如终端/bin/bash - 或者 直接 bash
   `-i 与终端进行交行  -t 分配一个伪终端，容器使用终端命令`
7. nginx 容器内容安装 vim `apt-get update` `apt-get install vim`

### 容器数据持久化

** 使用-v 参数 **  
启动容器 ​​ docker run -p 81:80 -v hostPath:containerPath -d --name <container-name><image-name>

** 创建对应的 volumn **

```shell
# 创建
docker volumn create <volumn-name>
# 使用 volumn 启动
docker run -d -v <volumn-name>:/data/db mongo # 两个mongo镜像使用同一个数据库
# 检查
docker volumn inspect <volumn-name>
# 删除
docker volumn remove mongo
```

### Dockerfile

```js
// server.js
const http = require("http");
http.createServer(function (request, response) {
    response.writeHead(200，{'Content-Type': 'text/plain'});
    // 发送响应数据“Hello World"
    response .end('Hello Word\n')
}).listen(3000);
console.log("Server running at http://127.0..1:3000/");
```

```shell
# 指定基础镜像 从 node16 构建
FROM node:16
#创建对应的文件夹，作为项目运行的位置
RUN mkdir -p /usr/src/app
#指定工作区，后面的运行任何命令都是在这个工作区中完成的
WORKDIR /usr/src/app
# 从本地拷贝对应的文件 到 工作区
COPY server.js /usr/src/app/
# 告知当前Docker image 暴露的是 3000 端口
EXPOSE 3000
#执行启动命令，一个 Dockerfile 只能有一个
CMD node server.js
```

```shell
# server.js的根目录执行
#执行 Dockerfile
docker build -t editor-server .
# 启动容器
docker run -p 8081:3000 -d --name editor-server
# 查看容器列表
docker ps
```

### docker 多个容器互相通信

docker network create <name>

### CentOS7 安装 docker & docker compose

```shell
# 更新系统软件包列表
 sudo yum update -y
# 添加Docker的官方仓库源。创建并编辑 /etc/yum.repos.d/docker-ce.repo文件：
sudo vi /etc/yum.repos.d/docker-ce.repo

[docker-ce]
name=Docker CE Repository
baseurl=https://download.docker.com/linux/centos/7/$basearch/stable
enabled=1
gpgcheck=0

# 安装Docker引擎：
sudo yum install docker-ce -y

# 启动Docker服务并设置开机自启动：
sudo systemctl start docker
sudo systemctl enable docker

# 确认Docker已成功安装：
docker --version
```

配置镜像加速 - 阿里云的镜像加速文档：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

```shell
# 创建一个文件夹
sudo mkdir -p /etc/docker

# 在docker目录下新建一个daemon.json文件，然后把下面的内容输出到这个文件中去
#   这样以后下载镜像都会从阿里云去下载
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://u4qe651h.mirror.aliyuncs.com"]
}
EOF

# 重新加载文件
sudo systemctl daemon-reload

# 重启docker
sudo systemctl restart docker

```

安装 docker-compose

```shell

# 官方文档安装：
curl -SL https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose


# 更换为国内源安装：
curl -SL https://get.daocloud.io/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

# 赋权
chmod +x /usr/local/bin/docker-compose

docker compose version
```

#### 命令

- 构建容器 ：docker-compose build
- 启动所有服务器：docker-compose up -d, 后台启动
- 停止所有服务：docker-compose down
- 查看服务：docker-compose ps
