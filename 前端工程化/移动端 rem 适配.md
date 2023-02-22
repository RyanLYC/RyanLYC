```shell
yarn add lib-flexible -S # 用于设置rem基准值
yarn add postcss-pxtorem -D # postcss插件，用于将单位转为rem
```

1. lib-flexible 是网页做 html 的 font-size 适配用的，所以需要安装到 dependencies。而 postcss-pxtorem 是在编译的时候对 px 单位转换为 rem 单位时使用，所以安装到 devDependencies 便可。
2. 安装好后，我们需要在 main.js 引入 lib-flexible;  `import 'lib-flexible/flexible'`
3. 需要为 px 单位转 rem 单位做配置：.postcssrc.js文件
```javascript
// postcss.config.js
// 用 vite 创建项目，配置 postcss 需要使用 post.config.js，之前使用的 .postcssrc.js 已经被抛弃
// 具体配置可以去 postcss-pxtorem 仓库看看文档
module.exports = {
  "plugins": {
    "postcss-pxtorem": {
      rootValue: 37.5, // Vant 官方根字体大小是 37.5
      propList: ['*'],
      selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
    }
  }
}
```