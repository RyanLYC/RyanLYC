### Linux

#### Linux 常见版本

- 红帽家族

1. redhat 企业版 收费
2. `CentOS` 社区企业操作系统 与 1 是同一个版本
3. Fedara 红帽新技术的实验版本
4. 其他 Scientific Linux、Oracle Linux

- Debian 家族
  1. Debian 极其文档 深度定置化
  2. `Ubuntu` 桌面应用
  3. 其他 Linux Mint 等
- SUSE 家族
- Gentoo 家族

#### Linux 目录结构

/ -> bin(二进制的意思：存放命令脚本) -> boot(内核) -> dev(设备-cpu、磁盘等) -> home -> ect(环境变量：配置文件) -> opt(装软件的目录) -> sbin(super bin 启动服务的命令脚本) -> proc(内存映射) -> usr(用户环境设置) -> var(不断被扩充的目录，例如日志) -> ....

经常使用的是 opt、home、 修改系统设置用到 etc

#### 远程连接服务器

- Xshell 官网 家庭/学校版本免费 可以使用 5.0 或者 7.0 版本
- Xftp 7.0 上传文件
- finalShell 远程连接 比 Xshell 功能更多

#### Linux 常见命令

- 帮助类命令
  - man
  - help shell 内置命令
  - uTools 工具
- 开关机命令-了解
  - sync 将内存中的数据同步到硬盘
  - poweroff 关闭系统 == shutdown -h now
  - reboot 重启系统 == shutdown -r now
  - shutdown now/时间(分钟) 定时关机
- 服务管理类命令
  - centos6
    - service 服务名 start 开启服务
    - service 服务名 stop 关闭服务
    - service 服务名 restart 重启服务
    - service 服务名 status 查看服务状态
  - centos7
    - systemctl start 服务名 开启服务
    - systemctl stop 服务名 关闭服务
    - systemctl restart 服务名
    - systemctl status 服务名
    - systemctl --type service 查看正在运行的服务
- 永久开关服务命令
  - centos6
    - chkconfig 查看所有服务自启配置
    - chkconfig 服务名 off 关闭服务自启
    - chkconfig 服务名 on 开启无误自启
    - chkconfig 服务名 --list 查看服务开机启动状态
  - centos7
    - systemctl enable 服务名 打开自启
    - systemctl disable 服务名 关闭自启
    - systemctl is-enabled 服务名 查看服务是否自启
    - systemctl list-unit-files 查看所有服务自启配置
- 文件目录类命令
  - pwd 当前工作目录
  - ls 查看当前目录的内容 蓝色：文件夹 黑色：文件 绿色：可运行的脚本 浅蓝色：快捷方式
    - -a 查看全部
    - -l 详细 权限 链接数 创建的用户名 组 文件大小 Byte 最后修改日期 时间 文件名
  - ll == ls -l
  - cd 切换目录
    - cd - 回到上一次所在目录
    - cd -P 跳转到实际物理路径，非快捷方式路径
  - mkdir 创建目录
    - mkdir -P 递归创建目录
  - rmdir 删除空文件夹
  - touch 创建空文件
  - cp 复制文件
    - cp -r 递归复制文件夹
    - \cp 强制复制 覆盖
  - rm 删除文件、目录
    - rm -f 文件名 直接删除文件
    - `rm -rf 目录 递归删除文件夹`
    - -v 显示删除的内容
  - mv 移动文件、目录、重命名
  - cat 查看文件夹内容
    - -n 显示行号 包括空行
  - more 文件分屏查看器 q 退出、 空格翻页 、回车 一行一行、ctrl + f 下一屏、Ctrl + b 上一屏
  - less 分屏查看文件内容 强大的 more
  - head 显示文件开头的内容 -n 2 文件名 查看 前两行内容
  - tail 输出文件尾部内容 -n 5 2 文件夹 查看 文件尾部 5 行内容
    - -f 显示文件最新追加的内容，监视文件变化
  - echo 输出内容到控制台
    - -e "\t 制表符\n 换行" \\转译
    - echo $PATH 输出变量
  - > 覆盖 >> 追加 写入文件中
  - ln 创建链接和软连接
    - -S 创建的链接为软连接 目录地址需要使用绝对路径
  - history 查看历史命令
- vi->升级版 vim 编辑器 输入过程强制退出，需要把\*\*.swp 隐藏文件删除即可
  - 一般模式
    - gg 移动到页头
    - shift + g 即是 G 到末尾
    - shift + 6 即是^ 到行头
    - shift + 4 即是 $ 行尾
    - shift + zz 即是两个 ZZ 保存退出
    - dd 删除行
    - u 回退
    - x 删除
    - shift + X 往前删
    - yy 复制
    - p 粘贴
    - dw 删除词语
    - yw 复制词语
  - 编辑模式 切换方式 i / a ，o 从下一行开始编辑 ，esc 退出
  - 命令模式 : 或者 / 进入
    - q 退出
    - wq 保存退出 加个! 强制保存
    - / 查找 /内容 回车 n 下一个 shift + n 上一个
    - :%s %全局 s 替换 ----:%s/key/opq 全局 key 替换为 opq
    - :set nu 显示行号 nonu 隐藏行号
- 时间日期类命令
  - date
- 用户管理命令
  - useradd 添加新用户
  - useradd -g 组名 用户名
  - passwd 设置密码
  - 查看创建的所有用户 cat /etc/passwd
  - 切换用户 su 用户名
  - userdel 删除用户
  - userdel -g 组名 用户名
  - whoami 显示当前用户
- sudo 命令 普通用户拥有 root 权限（需要修改配置文件）
  - vi /etc/sudoers
  - root ALL=(ALL) ALL 下面增加一行 用户名 ALL=(ALL) NOPASSWD:ALL
  - wq!
- 组管理命令(创建用户就会创建对应的组)
  - groupadd 组名 创建组
  - groupdel 组名 删除组
  - 查看用户已经创建的组 cat/etc/group
  - 修改用户组 usermod -g 组 用户名
  - id 用户名 查看 信息 组名
- 文件权限类命令
  r-读 w-写 x-执行可查看
  `文件类型和权限的表示`
  |文件类型|创建者权限|创建者组权限|其他用户权限|
  |---|---|---|---|
  |-文件 d 目录 l 链接 |rwx|r-x|r-x|
  - 方式 1：chmod [{ugoa}{+-=}{rwx}] u:所有者 g:所有组 o:其他人 a:所有人(ugo 总和)
  - 方式 2：chmod [mode=421] [文件或目录] r=4 w=2 x = 1 rwx=4+2+1=7 一般使用 755
  - 方式 3： 修改文件/文件夹的 用户 和 组
    - sudo chown 用户名 文件夹
    - chmod 755 文件夹
    - chgrp 组名 文件夹
    - 一行解决 chown -R 用户名:组名 文件/文件夹名
- 搜索、查找类命令
  - find 目录名 -name 文件名
  - 模糊查询 find 目录名 -name "\*.txt"
  - 按用户查询 find 目录名 -user 用户名
  - 按大小查找 find 目录名 -size +10k +大于-小于 没有就是=
- grep 过滤查找及"|"管道符号
  - "|"管道符号表示将前一个命令的处理结果输出传递给后面的命令处理
  - grep 选项 查找内容 源文件 例如：find /etc/ -name '\*.conf' | grep -n ip 从查找结果找到有 ip 的结果 -n 代表输出行号
- ps -ef 任务管理器
  - ps -ef | grep ip 查看包含 ip 的 任务
- 压缩和解压缩命令
  - gzip 文件 压缩文件 压缩为\*.gz `只能压缩文件不能压缩目录，不保留原文件`
  - gunzip 文件.gz 解压
  - zip 压缩 -r 压缩目录 例子：zip -r 目录名.zip 目录名
  - unzip 解压 -d 解压到 指定的位置
  - tar -zcvf 目录名.tar.gz 打包 ：：：tar -zxvf 目录名.tar.gz 解压； -C 目录名 解压到知道位置
- 磁盘分区命令
  - df 查看磁盘空间
  - df -h 单位明白些
  - fdisk -l 查看磁盘分区详情
- 进程线程类命令
  - ps -aux 当前进程
  - ps -ef 当前的进程
  - kill 进程号 选项 -9 强制
- 定时任务命令
  - crond 服务管理
  - systemctl restart crond 重新启动 crond 服务
  - crond -e 设置定时文件

#### 安装程序

- RPM：RedHat 软件管理工具
  - rpm -qa 查询所有安装的 rpm 软件包
  - rpm -ql 服务名 查看安装位置
  - 查询软件安装情况 rpm -qa | grep 软件名
  - 卸载命令 rpm -e 软件包
  - rpm -e --nodeps 软件包 不检测依赖强制卸载
  - 安装 rpm -ivh RPM 包全名 i：install v：显示详细信息 h：进度条 --nodeps：不检测依赖进度
- YUM ：在线下载安装，自动处理依赖关系
  - yum list 查看所有关联的镜像源
  - yum list | grep 程序名
  - 安装 yum -y install 软件包名
