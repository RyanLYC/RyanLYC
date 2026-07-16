### 前端如何让图片、视频、pdf等文件在浏览器直接下载而非预览

1. 后端处理（最推荐 & 最优雅）
   只需要后端在返回该文件的 HTTP 响应头（Response Headers）中，显式指定 Content-Disposition 为 attachment 即可。

```js
Content-Disposition: attachment; 
filename="your_file_name.pdf"

```

提示 ：一旦有了这个响应头，无论前端是不是跨域，也无论前端有没有写 download 属性，浏览器接收到响应后都会 强制触发文件下载 。

2. 前端处理
   如果后端不方便修改响应头，前端可以通过 fetch 或 axios 将文件数据请求下来转成 Blob 对象，然后生成本地的同源 URL（ blob:http://... ）。这样标签的 download 属性就能完美生效了。

```js
async handleDownload(url, fileName) {
  if (!url) return;
  const baseUrl = process.env.VUE_APP_BASE_API || 
  '';
  let fullUrl = url;
  
  // 补全完整 URL
  if (!url.startsWith('http://') && !url.startsWith
  ('https://')) {
    fullUrl = [baseUrl, url].join('/').replace(/(?
    <!:)\/+/g, '/');
  }
  
  try {
    this.$message.info('正在获取文件，请稍候...');
    
    // 使用 fetch 获取文件流
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('网络请求失败
    ');
    
    // 转换为 blob 数据
    const blob = await response.blob();
    
    // 创建本地的 blob URL（同源地址，download 属性必定
    生效）
    const objectUrl = window.URL.createObjectURL
    (blob);
    
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = fileName || '下载文件';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // 释放内存并移除 DOM
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('下载失败:', error);
    // 降级方案：如果 fetch 失败（例如目标服务器未开启 
    CORS 跨域），回退到直接打开新窗口
    window.open(fullUrl, '_blank');
  }
}

```

3. 针对第三方 OSS 存储的跨域问题
   如果文件存放在第三方 OSS 上，直接使用前端 fetch 处理会引发跨域报错吗？
   是的！ 如果文件存放在第三方 OSS（如阿里云 OSS、腾讯云 COS、七牛云等）上，直接在前端使用 fetch 去请求文件流， 大概率会触发 CORS（跨域资源共享）错误 。除非 OSS 服务端明确返回了允许跨域的响应头（ Access-Control-Allow-Origin ），否则浏览器会拦截这个请求。
   既然文件在 OSS 上，这里提供 3 种主流且优雅的解决方案 （按推荐程度从高到低排列）：

`在 OSS 链接后拼接参数强制下载`

绝大多数主流 OSS 服务商（阿里云、腾讯云、AWS 等）都支持通过 在 URL 后面拼接参数 的方式，来动态覆盖 HTTP 响应头中的 Content-Disposition 。这意味着你不需要后端改代码，也不需要在前端做复杂的 Blob 转换。

- 阿里云示例 ：在 URL 后追加 ?response-content-disposition=attachment
- 指定文件名 ： ?response-content-disposition=attachment;filename=编码后的文件名.pdf

`配置 OSS 的 CORS 规则（配合前端 Blob 方案）`

如果你依然想用前端 fetch 转 Blob 的方式，需要登录 OSS 控制台，配置 跨域设置（CORS） ：

来源 (Origins) ：填入前端项目的域名（开发环境可填 _ ）。
允许 Methods ：勾选 GET 。
允许 Headers ：填入 _ 。 ⚠️ 缺点 ：大文件下载时，前端会先将文件整个吃进内存（Blob），如果文件过大（如几百MB的视频），可能会导致浏览器内存溢出崩溃。

`后端做一层下载代理（不推荐）`
如果 OSS 无法修改 CORS，且不支持 URL 参数覆盖响应头，只能让后端写一个下载接口，由后端去下载 OSS 文件再流式返回给前端，并附带 Content-Disposition: attachment 。
缺点 ：极其浪费业务服务器的公网带宽和内存，把原本 OSS 的流量压力转移到了自己的服务器上。

`最终实践：采用【URL拼接参数】方案`
综合考虑，针对 OSS 存储的文件，我们采用 方案一（拼接参数）处理即可，完全无需后端修改，也不会有内存溢出的风险。

以下是最终优化后的前端实现代码：

```js
/**
 * 处理附件下载
 * 采用拼接 response-content-disposition 参数的方式，
 强制 OSS 响应下载头，避免浏览器跨域预览
 * 
 * @param {string} url 附件地址
 * @param {string} fileName 附件名称
 */
handleDownload(url, fileName) {
  if (!url) return;
  
  const baseUrl = process.env.VUE_APP_BASE_API || 
  '';
  let fullUrl = url;
  
  // 补全非 http(s) 开头的相对路径
  if (!url.startsWith('http://') && !url.startsWith
  ('https://')) {
    fullUrl = [baseUrl, url].join('/').replace(/(?
    <!:)\/+/g, '/');
  }
  
  // 构建强制下载的参数，对文件名进行 URI 编码处理避免乱
  码
  const safeFileName = encodeURIComponent
  (fileName || '下载文件');
  const disposition = `attachment;filename=$
  {safeFileName}`;
  
  // 判断原 url 是否已经带了问号（防止破坏 OSS 原有的预
  签名参数）
  const separator = fullUrl.includes('?') ? '&' : 
  '?';
  const downloadUrl = `${fullUrl}${separator}
  response-content-disposition=${disposition}`;

  // 动态创建 a 标签触发下载
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName || '下载文件'; // 备用 
  download 属性
  a.style.display = 'none';
  a.target = '_blank'; // 兼容部分浏览器的安全策略
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}
```

`Can not override response header for an anonymous user `
`需要签名参数 Signature`
