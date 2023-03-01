##  Vite+Vue3+VantUI移动端应用项目搭建
### Vant 官方提供方案  https://vant-contrib.gitee.io/vant/#/zh-CN/advanced-usage

```shell
yarn add lib-flexible -S # 用于设置rem基准值
或者 amfe-flexible
yarn add postcss-pxtorem -D # postcss插件，用于将单位转为rem
```

1. lib-flexible 是网页做 html 的 font-size 适配用的，所以需要安装到 dependencies。而 postcss-pxtorem 是在编译的时候对 px 单位转换为 rem 单位时使用，所以安装到 devDependencies 便可。
2. 安装好后，我们需要在 main.js 引入 lib-flexible;  `import 'lib-flexible/flexible'`
3. 需要为 px 单位转 rem 单位做配置：vite.config文件
```javascript
import autoprefixer from 'autoprefixer'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), eslintPlugin(), stylelintPlugin({ fix: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({}),
        postCssPxToRem({
          // 自适应，px>rem转换
          rootValue: 192, // 75表示750设计稿，37.5表示375设计稿
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          selectorBlackList: ['norem'], // 过滤掉norem-开头的class，不进行rem转换
        }),
      ],
    },
  },
  server: {
    open: false,
  },
})
```