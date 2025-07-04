# Jenkins 主从架构部署（Docker Compose 一键部署）

适合本地或服务器环境，通过 Docker Compose 快速搭建 Jenkins Master + SSH Agent 架构。

---

## 文件结构

```bash
jenkins-docker/
├── docker-compose.yml
├── agent/
│   └── Dockerfile
├── jenkins_home/          # Jenkins 主节点数据（自动生成）
└── jenkins_agent/         # Agent 节点数据（自动生成）
```

---

## docker-compose.yml

```yaml
version: "3.8"

services:
  jenkins-master:
    image: jenkins/jenkins:lts-jdk17 # 统一使用Java 17
    container_name: jenkins-master
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jenkins-net
    depends_on:
      - jenkins-agent

  jenkins-agent:
    build:
      context: ./agent
    container_name: jenkins-agent
    volumes:
      - ./jenkins_agent:/home/jenkins/agent
      - /var/run/docker.sock:/var/run/docker.sock
    expose:
      - "22"
    networks:
      - jenkins-net

networks:
  jenkins-net:
    driver: bridge
    internal: true # 禁止外部访问网络
```

---

## 🛠 agent/Dockerfile

```Dockerfile
# 使用官方JDK17镜像（解决版本冲突）
FROM jenkins/ssh-agent:jdk17

# 修复SSH安全漏洞
RUN rm -f /etc/ssh/ssh_host_*_key* && \
    ssh-keygen -A && \
    mkdir -p /var/run/sshd

# 安装基础工具
USER root
RUN apt-get update && \
    apt-get install -y git curl unzip && \
    rm -rf /var/lib/apt/lists/*

# 确保工作目录权限
RUN mkdir -p /home/jenkins/agent && \
    chown -R jenkins:jenkins /home/jenkins

# 前台启动SSH（避免容器退出）
CMD ["/usr/sbin/sshd", "-D", "-e"]
```

---

## ⚙️ 初始化目录权限（首次运行）

```bash
# 创建项目目录
mkdir -p jenkins-docker/{agent,jenkins_home,jenkins_agent}
cd jenkins-docker

# 设置权限（CentOS必须操作）
sudo chown -R 1000:1000 jenkins_home jenkins_agent
sudo chmod 755 jenkins_home jenkins_agent
```

---

## 启动服务

```bash
# 构建并启动容器
docker compose up -d --build

# 监控日志
docker compose logs -f jenkins-master
```

---

## 🔑 手动添加 SSH 公钥到 Agent（替代 ssh-copy-id）

> 因为 Agent 初始并不允许公钥认证，需要我们手动添加。

### 1. 在主节点容器中生成 SSH 密钥

```bash
docker exec -it jenkins-master bash
# ssh-keygen -t rsa -f /var/jenkins_home/.ssh/id_rsa -N ""
# cat /var/jenkins_home/.ssh/id_rsa.pub

# 如果不行
ls -l /var/jenkins_home/.ssh/
# 你应该看到：
# id_rsa
# id_rsa.pub
# 没有的话
mkdir -p /var/jenkins_home/.ssh
chmod 700 /var/jenkins_home/.ssh
ssh-keygen -t rsa -f /var/jenkins_home/.ssh/id_rsa -N ""
cat /var/jenkins_home/.ssh/id_rsa.pub


```

复制输出内容备用。

---

### 2. 在 Agent 容器中手动添加公钥

```bash
docker exec -it jenkins-agent bash
su - jenkins

# 创建 .ssh 目录并设置权限
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将主节点公钥粘贴进 authorized_keys
# echo '粘贴你的公钥内容' >> ~/.ssh/authorized_keys
echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCsxB2L5PciRUh/uihoGsFtqPwJBq6Urjt5Tawz+G6G/wgM6z1kszEFIQ/FHM1lJbwIwlWYxQ3Z5vU/oZz7SDTLcuWhE4DqXEzPf9pqWNSWxMTDXgYxWupP7PTJfquW5qYmbcTWOOMYt150RqDbj2fefUE/nYBi1/yIDzy71xJPxPJhVmq4zt2qjo1+xeCmIqlVJ/15MNUL34BBVpBPSLnsX/p+32MrfijmxTr4c8CqiIFzd+KGfqTePVK6vTAV+my0uWW+d580Ud5AFqTpTGAwPp93dKmzginteWoSRgAsnbBy14Qf4PL8Yhn9JXPvbNAeEomb5/44Iv/QrFF5joB6qNCH1kG3zKjtvpnwdhQS/87hyg/RBGvENT/1J9WeOzRsZaDMVgZmimqrPLO284Rlk3CHPbxItKzseRGRcQEqjDwg12okQOSEZGSHPDRB4wJU5J5Pgd7Z19X0QDU93roLZyveErdYKfgMcHQTuutnYeGuVvfMD/yqxn3O03eZLSM= jenkins@db7fb99bdb08' >> ~/.ssh/authorized_keys

chmod 600 ~/.ssh/authorized_keys
exit
```

---

## 测试 SSH 是否可用（主节点中执行）

```bash
docker exec -it jenkins-master bash
ssh -i /var/jenkins_home/.ssh/id_rsa jenkins@jenkins-agent


```

首次登录输入 `yes` 即可信任主机，若成功即表示公钥认证正常。

---

## 🔧 Jenkins Web 界面配置 Agent

1. 打开 Jenkins 页面：`http://localhost:8080`
2. 输入初始密码（位于 `cat ./jenkins_home/secrets/initialAdminPassword`）
3. 创建管理员账号

`安装必要插件 ​`

- 进入 Manage Jenkins > Plugins > Available，安装：
  - Locale
  - Localization: Chinese (Simplified)
  - Docker Pipeline（容器化构建）
  - SSH Build Agents
  - Node and Label Parameter（节点标签管理）
- ​ 禁止主节点执行任务 ​
  - Manage Jenkins > Nodes > master > Configure
  - 设置 ​**Number of executors**​ 为 0

1. 进入：`Manage Jenkins` → `Nodes` → `New Node`
2. 配置如下：

| 设置项            | 值                        |
| ----------------- | ------------------------- |
| Node Name         | `docker-builder`          |
| Remote root dir   | `/home/jenkins/agent`     |
| Labels            | `docker-agent`            |
| Launch method     | Launch agents via SSH     |
| Host              | `jenkins-agent`           |
| Port              | `22`                      |
| Credentials       | 使用主节点生成的 SSH 私钥 |
| Host Verification | Manually trusted          |

​SSH 连接配置 ​：

- ​Host: 构建节点服务器 IP
- ​Port: 2222
- ​Credentials​ → Add → 选择 SSH Username with private key：
  - Username: jenkins
  - Private Key: 粘贴主节点生成的 SSH 私钥（见下方步骤）

生成并分发 SSH 密钥 ​：

```shell
# 私钥命令
docker exec -it jenkins-master bash
cat /var/jenkins_home/.ssh/id_rsa
```

---

## 测试流水线是否可用

```groovy
pipeline {
  agent { label 'docker-agent' }
  stages {
    stage('Test') {
      steps {
        sh 'echo "Build running on: $(hostname)"'
      }
    }
  }
}
```
