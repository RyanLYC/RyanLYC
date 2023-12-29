### Yum 常用的

```js

// 1 安装
yum install package // 安装指定的安装包 package

// 2 更新和升级
yum update // 全部更新
yum update package // 更新指定程序包 package
yum check-update // 检查可更新的程序
yum upgrade package // 升级指定程序包 package

// 3 查找和显示
yum info // 列出所有可以安装或更新的包的信息
yum info package //显示安装包信息 package
yum list // 显示所有已经安装和可以安装的程序包
yum list package // 显示指定程序包安装情况 package
yum search package // 搜索匹配特定字符的 package 的详细信息

// 4 删除程序
yum remove | erase package // 删除程序包 package
yum deplist package // 查看程序 package 依赖情况

// 5 清除缓存
yum clean packages // 清除缓存目录下的软件包
yum clean headers // 清除缓存目录下的 headers
yum clean oldheaders // 清除缓存目录下旧的 headers
yum clean, yum clean all // (= yum clean packages; yum clean oldheaders) 清除缓存目录下的软件包及旧的 headers

```
