### CentOS7 安装 docker & docker compose

```shell
# 更新系统软件包列表
 sudo yum upgrade -y
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

### 配置用户组

因为是 root 安装，普通用户执行没有权限

```shell
cd /var/run
ll -a | grep docker

# srw-rw----   1 root   docker    0 Jan  2 15:37 docker.sock
# usermod 命令修改用户账户 a -- append 添加 -G --groups 组的名称
sudo usermod -aG docker ryan

# 查看组
groups ryan

# 添加组
sudo groupadd docker
```

#### 命令

- 构建容器 ：docker compose build
- 启动所有服务器：docker compose up -d, 后台启动
- 停止所有服务：docker compose down
