### axios默认是不会带上content-type的
```javascript
import axios from 'axios'

axios.defaults.baseURL = 'www.baidu.com/'  // 换成你自己的请求地址
axios.defaults.timeout = 10000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    
    if (config.method === 'get') {
      config.data = {unused: 0} // 这个是关键点，加入这行就可以了  解决get  请求添加不上content_type 
    }
  
    return config
  },
  error => {
    return Promise.error(error)
  })

```