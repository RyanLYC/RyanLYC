### cookie和session
cookie和session都是用来跟踪浏览器用户身份的会话方式

### cookie和session的区别
1. cookie的数据保存在浏览器上，session的数据保存在服务器

2. cookie可以设置失效时间。不设置过期时间，cookie则被保存在内存中，生命周期随浏览器的关闭而结束；设置了过期时间，cookie则被保存在硬盘中，关闭浏览器后，cookie数据仍然存在，直到过期时间结束才消失。  

session存储在服务器中，关闭浏览器或停止服务器，session被清除。  

3. cookie存储的是字符串，session可以存储任意的对象

4. cookie存放数据的大小一般不超过 4KB且浏览器储存的cookie个数也有限制(一般为20个cookie),session没有存放限制

5. cookie不安全，在每次请求中都会被发送，不使用 HTTPS并对其加密，其保存的信息很容易被窃取，导致安全风险，应使用session

6. session会在一定时间内保存在服务器上，当访问量增加时会占用服务器的性能；减轻服务器的性能使用cookie

### localStorage特点
1. 生命周期：持久化的本地存储，除非主动删除数据，否则数据永远不会清除（永久性）

2. 相同浏览器下，localstorage在所有同源窗口（协议. 域名. 端口一致）中数据都是共享的

3. 储存数据大小：5M

4. localStorage本质上是对字符串的读取，如果存储内容过多会消耗内存空间，会导致页面变卡

5. 受同源策略的限制

 缺点 ：

1. 不能设置过期时间

2. 只能存入字符串，无法直接存储对象

### sessionStorage特点
1. 生命周期：仅在当前页面有效，一旦页面(浏览器)关闭，sessionStorage就会删除数据，不会永久存在

2. 储存数据大小：5M

3. 页面刷新不会删除数据

4. sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面

### cookie、localStorage、sessionStorage三者的区别
`共同点`：sessionStorage、localStorage、cookie都是在浏览器端存储的数据、且同源的  

`区别：`  

* 存储大小：cookie数据大小不能超过4KB，sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大得多，可以达到5M

* 数据有效期：localStorage存储持久数据，浏览器关闭后数据不丢失除非主动删除数据； sessionStorage数据在当前浏览器窗口关闭后自动删除；cookie设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭

* 数据与服务器之间的交互方式：cookie的数据会自动的传递到服务器，服务器端也可以写cookie到客户端； sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存作用域不同：sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；localstorage在所有同源窗口中都是共享的；cookie在所有同源窗口中都是共享的

* cookie的数据还有路径的概念，可以通过设置限制cookie只属于某一个路径

* webStorage（localStorage和sessionStorage）支持事件通知机制，可以将数据更新的通知发送给监听者

### 使用webstorage（localStorage和sessionStorage）的好处：
* 减少网络流量：使用webstorage将数据保存在本地中，不用像cookie一样，每次传送信息都需要发送cookie，减少了不必要的数据请求，同时减少数据在浏览器端和服务器端来回传递

* 快速显示数据：从本地获取数据比通过网络从服务器获取数据效率要高，因此网页显示也要比较快

* 临时存储：很多时候数据只需要在用户浏览一组页面期间使用，关闭窗口后数据就可以丢弃了，这种情况使用sessionStorage非常方便

* 服务器：存储内容不会发送到服务器。仅存在于本地，不会与服务器发生任何交互

* 接口：更多丰富易用的接口，Web Storage提供了一套更为丰富的接口，使得数据操作更为简便

* 存储空间：独立的存储空间，每个域都有独立存储空间，各个存储空间是完全独立的不会造成数据混乱