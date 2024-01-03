### 配置用户组

因为是 root 安装，普通用户执行没有权限

```shell
 ll -a | grep docker

# srw-rw----   1 root   docker    0 Jan  2 15:37 docker.sock
# usermod 命令修改用户账户 a -- append 添加 -G --groups 组的名称
sudo usermod -aG docker ryan

# 查看组
groups ryan

# 添加组
sudo groupadd docker
```

### Redis

#### 安装

```shell
docker pull redis:7
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
docker pull mongo
```

#### 命令

- 构建容器 ：docker compose build
- 启动所有服务器：docker compose up -d, 后台启动
- 停止所有服务：docker compose down
- 查看服务：docker compose ps
