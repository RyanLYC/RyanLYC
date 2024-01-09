### Github Actions

网上的 CI/CD 有很多，例如 travis ，任选一个即可 Github actions 高效稳定，功能强大

使用 Github actions 做构建和测试

#### 认识 github action

Github 2019 年秋天发布的 CI/CD 工具，功能强大且稳定  
Github 被微软收购之后，越来越强大了，正在由一个 git 托管服务，变为一个研发项目解决方案

- 介绍 github 项目的 Actions
- 中文文档 https:/docs.github.com/cn/free-pro-team@latest/actions/learn-github-actions

代码在项目的.github/workflows 目录下，yml 格式文件，多个 workflows 文件 并行运行

#### 应该场景

- master 分支，自动化测试
- dev 分支，自动部署到测试机
- v*.*.\* 格式的 tag，自动上线（支持回滚）

#### 使用

https://github.com/marketplace?type=actions action 地址

1. ​github​​​ 仓库，然后点击 ​​actions​​ 选择 模板，输入 name 就会在项目的 ​​.github/workflows​​​ 目录下，生成 ​​.yml​​ 文件。代码仓库多了一个文件
2. 本地拉一下代码，可以看到 ​​.yml​​ 文件已经存在了。
3. 配置文件

```javascript
# master 分支 自动测试

name: test # 测试名称 语义化即可

on: # 触发条件
    push: # 在下面的分支进行 push 操作的时候触发
        branches: # 触发的分支 可以设置多个
            - main # 分支名称
        paths: # 以下目录中的文件有改动就触发  可以不写 代表所有文件
            - '.github/workflows/**'
            - '__test__/**'
            - 'src/**'

jobs: # 任务
    test: # 任务名称 可以自定义 也可以使用第三方
        runs-on: ubuntu-latest # 指定运行环境 操作系统 没有特殊情况不需要改
        steps: # 步骤
            - uses: actions/checkout@v2 # 第一个步骤   第三方的actions   等同于执行了 git pull
            - name: Use Node.js # 第二个步骤 步骤名称 自定义
              uses: actions/setup-node@v1 #  第三方的actions   安装 node.js
              with: # 参数
                  node-version: 14 # nodejs 的版本
            - name: lint and test # 第三个步骤 步骤名称 自定义
              run: | # 自定义执行命令  多行的方式
                  npm i
                  npm run lint
                  npm run test:remote
    test2: # 任务名称 可以自定义 也可以使用第三方
        runs-on: ubuntu-latest # 指定运行环境 操作系统 没有特殊情况不需要改
        steps: # 步骤
            - run: touch a.txt # 自定义执行命令  单行的方式
            - run: echo 100 > a.txt # a.text 写入内容
            - run: cat a.txt # 读取  a.text 内容

```

4. step 的四种方式 -

```javascript
# 一 直接使用 uses 第三方
 - uses: actions/checkout@v2
 # 二 使用 name + uses 第三方
 - name: Use Node.js
   uses: actions/setup-node@v1
 # 三 run  |  多行的方式
 run: |
      npm i
      npm run test:remote
 # 四 run 单行的方式
    - run: touch a.txt
    - run: echo 100 > a.txt
    - run: cat a.txt
```

#### Secrets

1. 仓库 - Setting 是 - Secrets - Actions - New repository secret
2. C:\Users\Ryan\.ssh\id_rsa 把本机的私钥放在代码仓库 ​​setting​​​ 里面的 ​​Secrets​​ 中 RYAN_EDITOR_SERVICE
3. 获取代码仓库 需要令牌 github 帐号下 Settings - Developer settings ​​ - ​Generate new token​​ - classic - 选择永不过期，把所有的框都勾选上 - 最后点击 ​​Generate token​​ 生成令牌 - 将生成的令牌拷贝下来，保存，下次就看不到了。
4. sudo git remote add origin https://令牌@github.com/RyanLYC/editor-service.git;
5. 具体 看 Editor_Service 代码仓库

### 通过 ssh 连接机器然后拉代码等操作

```shell
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
# github actions 中文文档 https://docs.github.com/cn/actions/getting-started-with-github-actions

name: deploy for dev

on:
    push:
        branches:
            - 'dev' # 只针对 dev 分支
        paths: # 这些文件改变才会触发重新构建
            - '.github/workflows/*'
            # - '__test__/**' # dev 不需要立即测试
            - 'src/**'
            - 'Dockerfile'
            - 'docker-compose.yml'
            - 'bin/*'

jobs:
    deploy-dev:
        runs-on: ubuntu-latest # 系统版本  令牌 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

        steps:
            - uses: actions/checkout@v2 # 拉代码
            - name: set ssh key # 临时设置 ssh key
              run: |
                  mkdir -p ~/.ssh/
                  echo "${{secrets.RYAN_EDITOR_SERVICE}}" > ~/.ssh/id_rsa # secret 在这里配置 https://github.com/***/settings/secrets
                  chmod 600 ~/.ssh/id_rsa
                  ssh-keyscan "8.134.92.143" >> ~/.ssh/known_hosts
            - name: deploy #部署
              run: |
                  ssh ryan@8.134.92.143 "
                    cd /home/ryan/editor-service;
                    sudo git remote add origin https://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@github.com/RyanLYC/editor-service.git;
                    sudo git pull origin dev;
                    sudo git remote remove origin;
                    sudo docker compose build editor-server;
                    sudo docker compose up -d;
                  "
            - name: delete ssh key # 删除 ssh key
              run: sudo rm -rf ~/.ssh/id_rsa

```

### 更好的方案

后端代表不 build，上传到 docker hub 服务器中，直接使用

1. 阿里云容器镜像服务 ACR - https://cr.console.aliyun.com/repository/cn-guangzhou/ryanlyc/egg-ts-demo/details
2. 操作步骤

```shell
# 登录
docker login --username=lycgzjm@gmail.com registry.cn-guangzhou.aliyuncs.com
# 使用 tab build
docker build --tag "registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:[镜像版本号]"
# 如果存在镜像了 就 使用
docker tag [ImageId] "registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:[镜像版本号]"
# 推送
docker push registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:[镜像版本号]
```

3. 修复 yml 文件 直接使用该镜像
4. docker compose up -d 测试 使用
5. Github Action 自动部署
6. 第一步：在 runner 上 build image 并且 push
   - checkout 代码
   - 创建.env 文件，并且添加两个环境变量 upload to OSS 需要两个对应的信息
   - 使用阿里云 ACR 完成 docker login
   - docker build 并 tag 暂时固定版本 后续 处理
   - docker push

```shell
name: build image, push to ACR
on: [push]
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      # checkout 代码
      - uses: actions/checkout@v2
      # 创建 env 文件
      - run: touch .env
      - run: echo ALC_ACCESS_KEY=${{ secrets.ALC_ACCESS_KEY }} >> .env
      - run: echo ALC_SECRET_KEY=${{ secrets.ALC_SECRET_KEY }} >> .env
      # 使用阿里云ACR 完成 docker login
      - name: Login to Aliyun Container Registry (ACR)
        uses: aliyun/acr-login@v1
        with:
          login-server: https://registry.cn-guangzhou.aliyuncs.com
          region-id: cn-guangzhou
          username: '${{ secrets.ACR_USERNAME }}'
          password: '${{ secrets.ACR_PASSWORD }}'
      # 使用正确的阿里云 tag 进行 docker build
      - name: Build image for Docker
        run: docker build --tag "registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:0.0.2" .
      - name: Push Image to ACR
        run: docker push registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:0.0.2

```

7. 第二步：使用 docker compose yml 文件在 服务器上运行应用
   - checkout 代码
   - 创建.env 文件，添加多个环境变量（应用所有需要用到的环境变量）
   - 创建文件夹，拷贝如下文件到文件夹内
   * .env 存放环境变量
   * docker-compose.yml docker compose 运行文件
   * mongo-entrypoint 文件夹 存放的是 mongodb 初始化 执行代码
   - 将新建的文件夹拷贝到服务器 使用 https://github.com/appleboy/scp-action

```shell
# 以上步骤代码
name: Deploy app to server
on: [push]
jobs:
  deploy-and-restart:
    runs-on: ubuntu-latest
    steps:
      # checkout 代码
      - uses: actions/checkout@v2
      # 创建 env 文件
      - name: 'create env file'
        run: |
          touch .env
          echo ALC_ACCESS_KEY=${{ secrets.ALC_ACCESS_KEY }} >> .env
          echo ALC_SECRET_KEY=${{ secrets.ALC_SECRET_KEY }} >> .env
          echo GITEE_CID=${{ secrets.GITEE_CID }} >> .env
          echo GITEE_SECRET=${{ secrets.GITEE_SECRET }} >> .env
          echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
          echo MONGO_INITDB_ROOT_USERNAME=${{ secrets.MONGO_INITDB_ROOT_USERNAME }} >> .env
          echo MONGO_INITDB_ROOT_PASSWORD=${{ secrets.MONGO_INITDB_ROOT_PASSWORD }} >> .env
          echo MONGO_DB_USERNAME=${{ secrets.MONGO_DB_USERNAME }} >> .env
          echo MONGO_DB_PASSWORD=${{ secrets.MONGO_DB_PASSWORD }} >> .env
          echo REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }} >> .env
      # 拷贝必须文件到一个文件夹，包括 .env, docker-compose.yml, mongo-entrypoint
      - name: 'copy necessary files in to one folder'
        run: |
          mkdir egg-ts-demo
          cp .env docker-compose.yml egg-ts-demo
          cp -r mongo-entrypoint egg-ts-demo
          ls -a egg-ts-demo
      # 通过 scp 拷贝必须文件到服务器
      - name: 'copy egg-ts-demo folder via scp'
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PWD }}
          source: 'egg-ts-demo'
          target: '~'

```

- SSH 到服务器中
  - 登录阿里云 ACR （因为需要要 阿里云 ACR 拉私有镜像 所有 需要登录）
  - 进入拷贝的文件夹内
  - 停止服务 docker compose down 第一次没有启动 也不会报错的
  - 启动服务器 docker compose up -d
  - 清理工作 删除.env 文件 退出登录 账户

```shell
# 第一第二步 合并
name: Deploy app to server
on: [push]
jobs:
  deploy-and-restart:
    runs-on: ubuntu-latest
    steps:
      # checkout 代码
      - uses: actions/checkout@v2
      # 创建 env 文件
      - name: 'create env file'
        run: |
          touch .env
          echo ALC_ACCESS_KEY=${{ secrets.ALC_ACCESS_KEY }} >> .env
          echo ALC_SECRET_KEY=${{ secrets.ALC_SECRET_KEY }} >> .env
          echo GITEE_CID=${{ secrets.GITEE_CID }} >> .env
          echo GITEE_SECRET=${{ secrets.GITEE_SECRET }} >> .env
          echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
          echo MONGO_INITDB_ROOT_USERNAME=${{ secrets.MONGO_INITDB_ROOT_USERNAME }} >> .env
          echo MONGO_INITDB_ROOT_PASSWORD=${{ secrets.MONGO_INITDB_ROOT_PASSWORD }} >> .env
          echo MONGO_DB_USERNAME=${{ secrets.MONGO_DB_USERNAME }} >> .env
          echo MONGO_DB_PASSWORD=${{ secrets.MONGO_DB_PASSWORD }} >> .env
          echo REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }} >> .env
          echo PING_ENV=${{ secrets.PING_ENV }} >> .env
      # 拷贝必须文件到一个文件夹，包括 .env, docker-compose.yml, mongo-entrypoint
      - name: 'copy necessary files in to one folder'
        run: |
          mkdir egg-ts-demo
          cp .env docker-compose.yml egg-ts-demo
          cp -r mongo-entrypoint egg-ts-demo
          ls -a egg-ts-demo
      # 通过 scp 拷贝必须文件到服务器
      - name: 'copy egg-ts-demo folder via scp'
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PWD }}
          source: 'egg-ts-demo'
          target: '~'
      # 通过 SSH 登录然后重启服务
      - name: executing ssh and restart docker
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PWD }}
          script_stop: true
          # * 登录阿里云 ACR
          # 停止服务 docker compose down
          # 启动服务 docker compose up -d
          # 清理工作
          script: |
            docker login --username=${{secrets.ACR_USERNAME}} --password=${{secrets.ACR_PASSWORD}} registry.cn-guangzhou.aliyuncs.com
            cd ~/egg-ts-demo/
            docker compose -f docker-compose.yml down
            docker compose -f docker-compose.yml up -d
            rm -rf .env
            docker logout registry.cn-guangzhou.aliyuncs.com

```

### 获取 github Action Context

```shell
# https://docs.github.com/zh/actions/learn-github-actions/contexts#github-context
## tag 的内容为版本的时候 出发，并把版本信息 替换 到 docker-compose.yml 对应的位置
name: Tag Test
on:
  push:
    # 有tags 发布
    tags:
    # tags 格式这样的时候才触发
      - 'v*.*.*'
jobs:
  test-tags:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # 测试 github context
      - name: 'test github context info'
        run:
          echo ${{github.ref}}
          echo ${{github.ref_name}} #tag的信息
          echo ${{github.sha}} # commit的信息
      # 测试查找并且替换
      - name: Find and Replace
        uses: jacobtomlinson/gha-find-replace@v2
        with:
          find: "{{tag}}"
          replace: ${{github.ref_name}}
          include: "docker-compose.yml"
      - run: cat docker-compose-online.yml
```

### 整合全部流程

- git add .
- git commit -m 'version 1.0.2'
- git tag -a v1.0.2 -m 'version 1.0.2'
- git push --tags

```shell
name: 自动部署新版本到服务器
# 在特定 tag 被 push 以后被触发
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  publish-release:
    runs-on: ubuntu-latest
    steps:
      # checkout 代码
      - uses: actions/checkout@v2
      # 创建 env 文件
      # build docker image
      # start the app
      - name: 'create env file'
        run: |
          touch .env
          echo ALC_ACCESS_KEY=${{ secrets.ALC_ACCESS_KEY }} >> .env
          echo ALC_SECRET_KEY=${{ secrets.ALC_SECRET_KEY }} >> .env
          echo GITEE_CID=${{ secrets.GITEE_CID }} >> .env
          echo GITEE_SECRET=${{ secrets.GITEE_SECRET }} >> .env
          echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
          echo MONGO_INITDB_ROOT_USERNAME=${{ secrets.MONGO_INITDB_ROOT_USERNAME }} >> .env
          echo MONGO_INITDB_ROOT_PASSWORD=${{ secrets.MONGO_INITDB_ROOT_PASSWORD }} >> .env
          echo MONGO_DB_USERNAME=${{ secrets.MONGO_DB_USERNAME }} >> .env
          echo MONGO_DB_PASSWORD=${{ secrets.MONGO_DB_PASSWORD }} >> .env
          echo REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD }} >> .env
          echo PING_ENV=${{ secrets.PING_ENV }} >> .env
      # 使用阿里云ACR 完成 docker login
      - name: Login to Aliyun Container Registry (ACR)
        uses: aliyun/acr-login@v1
        with:
          login-server: https://registry.cn-guangzhou.aliyuncs.com
          region-id: cn-guangzhou
          username: '${{ secrets.ACR_USERNAME }}'
          password: '${{ secrets.ACR_PASSWORD }}'
      # 使用正确的github tag 对应ACR tag 进行 docker build
      - name: Build image for ACR docker
        run: docker build --tag "registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:${{github.ref_name}}" .
      # 使用标记的 tag 进行 push
      - name: Push Image to ACR
        run: docker push registry.cn-guangzhou.aliyuncs.com/ryanlyc/egg-ts-demo:${{github.ref_name}}
      # 查找 docker-compose 文件 并且完成版本替换
      - name: Find and Replace
        uses: jacobtomlinson/gha-find-replace@v2
        with:
          find: '{{tag}}'
          replace: ${{github.ref_name}}
          include: 'docker-compose.yml'
      - run: cat docker-compose.yml
      # 拷贝必须文件到一个文件夹，包括 .env, docker-compose.yml, mongo-entrypoint
      - name: 'copy necessary files in to one folder'
        run: |
          mkdir egg-ts-demo
          cp .env docker-compose.yml egg-ts-demo
          cp -r mongo-entrypoint egg-ts-demo
          ls -a egg-ts-demo
      # 通过 scp 拷贝必须文件到服务器
      - name: 'copy egg-ts-demo folder via scp'
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PWD }}
          source: 'egg-ts-demo'
          target: '~'
      # 通过 SSH 登录然后重启服务
      - name: executing ssh and restart docker
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.SSH_USER }}
          password: ${{ secrets.SSH_PWD }}
          script_stop: true
          # * 登录阿里云 ACR
          # 停止服务 docker-compose down
          # 启动服务 docker-compose up
          # 清理工作
          script: |
            docker login --username=${{secrets.ACR_USERNAME}} --password-stdin=${{secrets.ACR_PASSWORD}} registry.cn-guangzhou.aliyuncs.com
            cd ~/egg-ts-demo/
            docker compose -f docker-compose.yml down
            docker compose -f docker-compose.yml up -d
            rm -rf .env
            docker logout registry.cn-guangzhou.aliyuncs.com

```

### 使用 release-it 发布

https://github.com/release-it/release-it
https://github.com/release-it/release-it/blob/main/docs/git.md 发布流程

1. yarn add release-it -D ## "release-it": "^14.12.3",
2. "release": "release-it" # 命令添加
3. 先 commit 之后 再 执行 npm run release
4. 如果本地开发分支与远程分支 不匹配 会报错
5. .release-it.json 文件

```json
{
  "git": {
    "requireUpstream": false // push的时候 不用检测远程分支与本地分支对应
  },
  "npm": {
    "publish": false // 默认发布 npm 修改设置为 false
  }
}
```
