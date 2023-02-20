# jsonP 只能实现 get 请求。原理是 动态创建 script 标签。
## JSONP跨域解决方案的底层原理
![image](https://github.com/RyanLYC/RyanLYC/raw/main/images/jsonP.png)

客户端
```javascript
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>

<script>
    $.ajax({
        url: 'http://127.0.0.1:8001/list',
        method: 'get',
        dataType: 'jsonp',
        success: res => {
            console.log(res);
        }
    });

</script>
```

后台
```javascript
let express = require('express'),
    app = express();
    app.listen(8001, _ => {
    console.log('OK!');
});

app.get('/list', (req, res) => {

    let {

        callback = Function.prototype

    } = req.query;

    let data = {
        code: 0,
        message: '666'

    };
    res.send(`${callback}(${JSON.stringify(data)})`);

});
```

### 在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP函数。
```javascript
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // wd=b&callback=show
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arrs.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'http://localhost:3000/say',
  params: { wd: '666' },
  callback: 'show'
}).then(data => {
  console.log(data)
})
```

```javascript
// server.js
let express = require('express')
let app = express()
app.get('/say', function(req, res) {
  let { wd, callback } = req.query
  console.log(wd) // 666
  console.log(callback) // show
  res.end(`${callback}('777')`)
})
app.listen(3000)
```