### ejs

#### ejs 模版的三种用法

```js
const ejs = require('ejs')

// =>输出染后的 HTML 字符串
let template = ejs.compile(str, options);
template(data);

// => 输出染后的 HTML 字符串
ejs.render(str，data, options);

ejs.renderFile(filename, data, options, function(err， str){
// str => 输出渲染后的 HTML 字符串
})
// 或者 promise 用法
const render = ejs.renderFile(filename, data, options)
render.then(file => file)
```

#### ejs 标签含义

- <% '脚本'标签，用于流程控制，无输出。
- <%\_ 删除其前面的空格符
- <%= 输出数据到模板(输出是转义 HTML 标签)
- <%- 输出非转义的数据到模板 输入 HTML
- <%# 注释标签，不执行、不输出内容
- <%% 输出字符串'<%'
- %> 一般结束标签
- -%> 删除紧随其后的换行符
- \_%> 将结束标签后面的空格符删除

* include 包含
* 自定义分隔符 options 中定义 delimiter:'?'
* 加载文件

```js
ejs.fileLoader = function (filePath) {
  const content = fs.readFileSync(filePath).toString();
  return "*** " + content;
};
```

### glob

用来匹配路径文件名  
https://www.npmjs.com/package/glob  
Match files using the patterns the shell uses.
