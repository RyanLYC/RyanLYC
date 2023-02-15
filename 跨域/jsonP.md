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
        message: '珠峰培训'

    };
    res.send(`${callback}(${JSON.stringify(data)})`);

});
```