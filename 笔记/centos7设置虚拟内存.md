### centos7 设置虚拟内存

#### 首先查看当前的内存和 swap 空间大小

```shell
# 内存
# free -m
# or
free -h
# 查看swap信息，包括文件和分区的详细信息
swapon -s
# 或者
# cat /proc/swaps
```

如果没有虚拟内存，我们就需要手动添加交换分区。

注意，OPENVZ 架构的 VPS 是不支持手动添加交换分区的。

添加交换空间有两种选择：添加一个交换分区或添加一个交换文件。推荐你添加一个交换分区；不过，若你没有多少空闲空间可用， 则添加交换文件。

#### 查看 vps 的虚拟架构

```shell
# 安装 yum install virt-what

sudo virt-what

```

#### 交换文件

```shell
# 使用dd命令创建一个swap交换文件
# 建立一个/home/swap的分区文件，大小为4G。
sudo dd if=/dev/zero of=/home/swap bs=512 count=8388616
# 注意：创建swap大小为bs*count=4294971392(4G)

# 制作为swap格式文件
sudo mkswap /home/swap

# 再用swapon命令把这个文件分区挂载swap分区
sudo swapon /home/swap

# 用free -m命令看一下，发现已经有交换分区了,重启系统后，swap分区又变成0了
vi /etc/fstab
# 或者
sudo vim /etc/fstab

# 在文件末尾（最后一行）加上 这样就算重启系统，swap分区还是有值。
/home/swap swap swap defaults 0 0

# 调整 swappiness
# 查看swappiness的值
cat /proc/sys/vm/swappiness

# -----------------------------------------------

# 临时修改
sysctl vm.swappiness=10

# -----------------------------------------------

# 永久修改 添加vm.swappiness=60
sudo vim /etc/sysctl.conf

# 激活设置
sudo sysctl -p

```

#### 删除交换文件

```shell
# 删除自动挂载配置命令
vim /etc/fstab # 删除 /home/swap swap swap default 0 0

# 重启机器

# 停止swap分区
# sudo swapoff /home/swap

# 删除swap分区文件
sudo rm -rf /home/swap



```

#### 使用分区来做 SWAP(虚拟内存)

```shell
# 使用fdisk来创建交换分区（ /dev/sdb2 是创建的交换分区）
fdisk /dev/sdb2

# 使用 mkswap 命令来设置交换分区：
mkswap /dev/sdb2

# 启用交换分区
swapon /dev/sdb2

# 写入/etc/fstab,以便在引导时启用
vi /etc/fstab
# 或者
vim /etc/fstab

/dev/sdb2 swap swap defaults 0 0

```

#### 删除交换分区

```shell
# 先停止swap分区
/sbin/swapoff /dev/sdb2

# 删除自动挂载配置命令
vi /etc/fstab
# 或者
vim /etc/fstab
# 删除 /dev/sdb2 swap swap defaults 0 0

```
