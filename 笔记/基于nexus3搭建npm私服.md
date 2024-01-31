### nexus repository oss 是什么

是用来存储仓库的免费工具，可以用来存储 jar, docker, npm 等软件包

### 阿里云 centos7.6 下载&运行（以 docker 为例）

1. 登录阿里云 ssh ryan@8.134.104.190
2. docker pull sonatype/nexus3
3. 查看镜像 docker images
4. 建立数据存放目录 cd /usr/local -> sudo mkdir nexus3 -> sudo chmod 777 -R /usr/local/nexus3 -> cd nexus3 -> mkdir data
5. 启动容器 docker run -itd --privileged=true -d -e "INSTALL4J_ADD_VM_PARAMS=-Xms128m -Xmx512m -XX:MaxDirectMemorySize=512m -Djava.util.prefs.userRoot=/nexus-data/javaprefs" --name nexus3 -p 8081:8081 -v /usr/local/nexus3/data:/nexus-data sonatype/nexus3

`nexus3 默认启动是 2703M 内存， 如果内存不够， 会启动失败。 error='Cannot allocate memory' (errno=12)`

```shell
这时我们需要修改一下内存配置，

如果是直接部署的 nexus， 需要修改 $install-dir/bin/nexus.vmoptions 文件 ，添加参数

-Xms128m
-Xmx512m
-XX:MaxDirectMemorySize=512m
如果是 docker 部署，修改配置是没用的，需要设置环境变量

# docker run -d -e "INSTALL4J_ADD_VM_PARAMS=-Xms128m -Xmx512m -XX:MaxDirectMemorySize=512m -Djava.util.prefs.userRoot=/nexus-data/javaprefs"  --name nexus3 -p 8081:8081 -v /usr/local/nexus-data:/nexus-data -v /etc/timezone:/etc/timezone:ro sonatype/nexus3

```

```js
--privileged=true 授予root权限（挂载多级目录必须为true，否则容器访问宿主机权限不足）
--name=名字 给你的容器起个名字
-p 宿主机端口：容器端口映射
-v 宿主机目录：容器目录 目录挂载
```

6. 查看日志 docker logs -f nexus3
7. 阿里云安全组 打开 8081 端口
8. 浏览器访问 8.134.104.190:8081
9. 获取登录密码 cd /usr/local/nexus3/data -> vim admin.password
10. admin 登录 修改密码 禁用匿名访问

### 使用

#### 仓库类型

- proxy 代理仓库
- hosted 私有仓库
- group 创库组，将多个仓库组合在一起，通过一个 url 对外提供
  `代理仓库：Maven、Npm等。用于存储外网公共仓库中的插件和依赖，不可进行修改和私自上传`

#### npm 私人仓库

1. 创建 hosted 类型的仓库，选择 npm(hosted)，输入仓库名称 npm-hosted，然后点击 Create repository 创建仓库；
2. 创建 proxy 类型的仓库，选择 npm(proxy)，输入仓库名称 npm-taobao，输入代理地址https://registry.npmmirror.com/
3. 创建 group 类型仓库，选择 npm(group)，输入仓库名称 npm-group，然后将上面创建的仓库移到 Members 中，然后点击 Create repository 创建仓库；

```shell
# 使用nrm，便于管理npm镜像源
npm install -g nrm # 安装nrm
nrm ls # 查看可选的镜像源
nrm add nexus http://8.134.104.190:8081/repository/npm-group/ # 添加镜像源
npm login
# nrm set-auth -u mes -p Mes_2020 nexus # 设置访问权限
# nrm set-email nexus mes@domain.cn # 设置邮箱
nrm use nexus # 使用本地镜像源
npm init -y # 创建一个新目录并进行初始化
npm install move-folder-cli # 验证是否能从仓库中获取包

```
