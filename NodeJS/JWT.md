### JWT -  JSON Web Token
#### WT的过程
* 前端输入用户名密码，传给后端
* 后端验证成功，返回一段 token 字符串- 将用户信息加密之后得到的前端获取 token 之后，存储下来
* 以后访问接口，都在 header 中带上这段 token

#### JWT token 的组成3部分 两个 . 间隔开
- Header:JSON对象，描述JWT 的元数据，加密算法以及类型
- Payload:JSON对象，存放数据需要传递的数据
- Signature:对前两部分的签名，防止数据篡改。需要指定一个密钥(secret)。这个密钥只有服务器才知道，不能泄露给用户。


#### Token 优点
- token 是无状态的 (stateless) ，服务器不需要记录任何信息，不占用内存
- 多进程，多服务器集群没有影响，易于扩展
- 假如不记录在 cookie 中，没有跨域的影响
- 和服务器端解耦，任何设备都可以生成token。

#### Token 的缺点
* 无法快速封禁登录的用户
* 空间更大，所有数据是通过 base64进行编码的，会随着数据量的增大而变大

#### JWT与Session的区别
* JWT信息存储在客户端
* Session用户信息存储在服务器

### JWT应用
1. 安装npm 插件 koa-jwt  jsonwebtoken
2. 封装jwt中间件，并使用
3. 封装loginCheck 中间件
4. 相关的配置项、构造函数等