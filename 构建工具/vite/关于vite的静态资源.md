### 关于 vite 的静态资源

1. 根目录下的`public`目录
   该目录为纯静态文件，图片等放该目录后，打包构建时，vite 不会做任何处理，构建为 dist 目录后，直接复制到 images 文件夹下。

```html
html:
<img src="/images/slogo.png" alt="logo" width="120" />
CSS:
<style lang="less">
  .login {
    background: url(/images/login-bg.png) no-repeat center;
  }
</style>
```

`请注意，不需要写public目录，如果你写了也能正常访问该静态资源，但是vite会警告你用/images/login-bg.png来代替/public/images/login-bg.png`

`另外的坑点是，这样写./public/images/login-bg.png其实在开发环境也能正常访问到该图片，可是构建为dist目录后，处理就有问题了，它会到assets/public/images下去找这张图片，导致404错误。`

2. src 下的 assets 目录
   如果静态资源是放在 src/assets 目录那么会经过 vite 打包处理，包括压缩、重命名等，其他所有的构建后的 JS、CSS 都会放在 dist/assets 文件下。

```html
<img src="@/assets/images/test.jpg" alt="logo" width="120" />
```

```js
// 1 方式
import mapImg from "@/assets/img/mapImg/map_pin_red.png";
// 2 方式 动态获取
let mapPicSrc = new URL(`../assets/${props.status}.png`, import.meta.url).href;
```

`@需要在 vite.config.js 中配置才能使用。即使你在 assets 中新建了 images，css 等文件夹，构建后，dist 目录的 assets 并不会同步新建同名文件夹分别存放，除非改写配置文件`

1. 网站的 ico 图标放置问题
   做好的 favicon.ico 图标直接放置在 public 目录下，然后在根目录下的 index.html 中引入路径，写法如下：

```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
```

构建时，它会自动将其放到项目根目录文件夹中（与 index.html 同级）。

4. 总结
   如果图片不需要被处理，比如网站的结构用图，如 logo 图片，则放 public 中，否则如内容图片或者需要被构建为 base64 的小图标可以放放 assets 中
