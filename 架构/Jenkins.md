### Docker 安装 Jenkins

```shell

sudo mkdir -p /var/jenkins_home
# 赋权
sudo chmod 777 /var/jenkins_home

# sudo chown -R 1000:1000 /var/jenkins_home

# 新版本
docker pull jenkins/jenkins:2.476-jdk21

docker run --name jenkins -itd \
  -p 8082:8080 \
  -p 50000:50000 \
  -v /var/jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /bin/docker:/usr/bin/docker \
  -v /etc/localtime:/etc/localtime:ro \
  -e JAVA_OPTS="-Dsun.jnu.encoding=UTF-8 -Dfile.encoding=UTF-8 -Duser.timezone=Asia/Shanghai" \
  --restart=always \
  --privileged=true \
  jenkins/jenkins:2.476-jdk21

# 阿里云开端口 8082 50000

# 查看docker容器日志
docker logs jenkins

# 复制密码
# Please use the following password to proceed to installation:
# e5e186a8206d4359b838590219ebbb0b

```

### 安装 jdk21

```shell
wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz

tar -zxvf jdk-21_linux-x64_bin.tar.gz

创建 jdk 安装目录
sudo mkdir /usr/local/java/
将解压出来的 jdk 安装包移动到新建的 jdk 安装目录下
sudo mv ./jdk-21.0.4/ /usr/local/java/

将环境变量配置添加到 /etc/profile 文件中
sudo vi /etc/profile
export JAVA_HOME=/usr/local/java/jdk-21.0.4/
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar

加载配置文件
source /etc/profile
```

### 安装推荐插件

### 安装 GitLabServer

```shell
docker pull gitlab/gitlab-ce:14.10.5-ce.0

sudo mkdir -p /var/gitlab_home/etc
sudo mkdir -p /var/gitlab_home/log
sudo mkdir -p /var/gitlab_home/opt
# 赋权
sudo chmod 777 /var/gitlab_home


docker run -id \
-p 7004:22 -p 7003:80 -p 7002:443 \
-v /var/gitlab_home/etc:/etc/gitlab \
-v /var/gitlab_home/log:/var/log/gitlab \
-v /var/gitlab_home/opt:/var/opt/gitlab \
--hostname 8.134.104.190 \
--restart always \
--user=root \
--privileged=true \
--name gitlab-ce gitlab/gitlab-ce:14.10.5-ce.0

```

`命令详解`

- -id：这是两个参数的组合，其中 -i 表示以交互模式运行容器，-d 表示以后台模式运行容器。
- -p 7004:22：这是另一个端口映射参数，将容器内部的 22 端口映射到主机的 7004 端口。
- -v /mydata/gitlab/etc:/etc/gitlab：用于持久化存储 GitLab CE 的配置文件。
- -v /mydata/gitlab/log:/var/log/gitlab：用于持久化存储 GitLab CE 的日志文件。
- -v /mydata/gitlab/opt:/var/opt/gitlab：用于持久化存储 GitLab CE 的数据。
- --hostname 10.22.8.87：局域网宿主机的 ip, 如果是公网主机可以写域名。
- --restart always：这是容器重启策略参数，指定容器在退出后总是重新启动。
- --privileged=true：这是特权模式参数，允许容器在特权模式下运行，具有更高的系统权限。

`低配置服务器安装GitLab`
https://gitlab.cn/docs/omnibus/settings/memory_constrained_envs.html#%E5%8F%97%E9%99%90%E7%8E%AF%E5%A2%83%E7%9A%84%E6%9C%80%E4%BD%8E%E8%A6%81%E6%B1%82
`/etc/gitlab/gitlab.rb`

```js
puma['worker_processes'] = 0

sidekiq['max_concurrency'] = 5

prometheus_monitoring['enable'] = false

gitlab_rails['env'] = {
  'MALLOC_CONF' => 'dirty_decay_ms:1000,muzzy_decay_ms:1000'
}

gitaly['configuration'] = {
  concurrency: [
    {
      'rpc' => "/gitaly.SmartHTTPService/PostReceivePack",
      'max_per_repo' => 3,
    }, {
      'rpc' => "/gitaly.SSHService/SSHUploadPack",
      'max_per_repo' => 3,
    },
  ],
  cgroups: {
    repositories: {
      count: 2,
    },
    mountpoint: '/sys/fs/cgroup',
    hierarchy_root: 'gitaly',
    memory_bytes: 500000,
    cpu_shares: 512,
  },
}
gitaly['env'] = {
  'MALLOC_CONF' => 'dirty_decay_ms:1000,muzzy_decay_ms:1000',
  'GITALY_COMMAND_SPAWN_MAX_PARALLEL' => '2'
}
```

`获取密码`

```shell
 # 帐号root
docker exec -it gitlab-ce grep 'Password:' /etc/gitlab/initial_root_password

```

`git push 代码 提示 不知http 处理方式`

- git config --global credential.8.134.104.190:7003.provider generic
- https://code.fitness/post/2022/01/git-detecting-host-provider.html

### SSH pipeline

```shell
docker exec -it jenkins bash

ssh-keygen -t rsa -C "jenkins"
# 回车

cat ~/.ssh/id_rsa.pub

cat ~/.ssh/id_rsa

# 添加到 known_hosts 否则ssh 出错
ssh-keyscan -H github.com >> ~/.ssh/known_hosts


# github 密码方式
# 账户随便填
# 密码 使用 github token 即可拉取代码
```

### 新建节点

`注意：目录为  /var/jenkins_home/data   工具位置需要配置，例如git  目录修改为 /usr/bin/git (机器运行 which git 查看)`

```shell

# java 启动 权限问题导致 不行。master 节点可以。
# 下载
curl -sO http://8.134.104.190:8082/jnlpJars/agent.jar


# 测试
java -jar agent.jar -url http://8.134.104.190:8082/ -secret 0726b641fa4846a07bfbefa3884cf6383f4b19c8612867d83c7afb1f90112dbd -name build -webSocket -workDir "/var/jenkins_home/data"
```

- 创建 sh 脚本

```shell
# 创建
sudo vi start.sh

# 内容
nohup java -jar agent.jar -url http://8.134.104.190:8082/ -secret c3ee18e73eaf53f598e0f8a389c0d0c326de0474cb69711055f317180eebdab1 -name build01 -webSocket -workDir "/var/jenkins_home/data" >>/dev/null &

# 运行
sh start.sh
```
