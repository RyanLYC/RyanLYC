### vue3 前端自适应的终及解决方案

 yarn add postcss postcss-px-to-viewport postcss-preset-env  -D

* vw：与视口的宽度有关，1vw 就是视口宽度的 1%
* vh：与视口的高度有关，1vh 就是视口高度的 1%
* vmin：与当下视口的宽度和高度的最小值有关，取值为 vw 和 vh 中较小的那个
* vmax：与当下视口的宽度和高度的最大值有关，取值为 vw 和 vh 中较大的那个
* vmin 可以照顾移动端（手机端）横屏和竖屏的显示效果，保证移动开发中屏幕 旋转 之后的尺寸不变
* vw 横屏：显示效果不好
* vmin 横屏：显示效果好，项目需要横屏的时候，可以采用vmin
#### 前言
随着vw被越来越多的浏览器所支持，rem的自适应方案渐渐退出历史舞台，风靡一时的淘宝自适应解决方案lib-flexible也已被弃用。    
接下来我们详细介绍一下如何通过打包配置，使得vw自适应的方案能一把梭所有的前端项目（vue\react\webpack\vite）  

#### 依赖
npm i postcss cssnano cssnano-preset-advanced postcss-aspect-ratio-mini postcs-preset-env postcss-import postcss-url postcss-px-to-viewport postcss-viewport-units postcss-write-svg -D    
npm i viewport-units-buggyfill -S    

```javascript
"postcss": "^8.4.18", // postcss扮演一个框架的角色，是一个用javaScript工具和插件转换css代码的工具。postcss将css转换为javaScript可以操作的数据结构。这些数据可以由插件理解和转换，然后处理成各种需要的格式。其本身不对css进行处理，但是通过在该平台上集成插件，如cssnano、postcss-px-to-viewport等，就可以实现对css的处理和操作
"postcss-preset-env": "^7.8.2", // 是一个postcss插件,帮助您使用最新的css语法，它将新的css规范转换为更兼容的css,所以你不需要等待浏览器的支持。（之前同功能的postcss-cssnext插件被废弃, 推荐用postcss-preset-env）
"cssnano": "^5.1.13", // cssnano是构建于postcss的插件和生态之上的，主要用来压缩和清理css代码，确保最终生成的文件 对生产环境来说体积是最小的
"cssnano-preset-advanced": "^5.3.8", // cssnano的高级优化
"postcss-aspect-ratio-mini": "^1.1.0", // 主要用来处理元素容器的固定宽高比
"postcss-import": "^15.0.0", // 主要功有是解决@import引入路径问题。使用这个插件，可以让你很轻易的使用本地文件、node_modules或者web_modules的文件。这个插件配合postcss-url让你引入文件变得更轻松
"postcss-url": "^10.1.3", // 该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理。
"postcss-px-to-viewport": "^1.1.1", // 自适应的关键所在，将px单位转换为视口单位的 (vw, vh, vmin, vmax) 的postcss插件.如果你的样式需要做根据视口大小来调整宽度，这个脚本可以将你css中的px单位转化为vw，1vw等于1/100视口宽度。
"postcss-viewport-units": "^0.1.6", // 插件主要是给css的属性添加content的属性，配合viewport-units-buggyfill库兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器所使用的。
"viewport-units-buggyfill": "^0.6.2", // 配合postcss-viewport-units兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器
"postcss-write-svg": "^3.0.1", // 这个库可以让你直接在css中写svg,也是处理移动端1px的解决方案,该插件主要使用的是border-image和background来做1px的相关处理

```
1. postcss: postcss扮演一个框架的角色，是一个用javaScript工具和插件转换css代码的工具。postcss将css转换为javaScript可以操作的数据结构。这些数据可以由插件理解和转换，然后处理成各种需要的格式。其本身不对css进行处理，但是通过在该平台上集成插件，如cssnano、postcss-px-to-viewport等，就可以实现对css的处理和操作
2. postcss-preset-env: 是一个postcss插件,帮助您使用最新的css语法，它将新的css规范转换为更兼容的css,所以你不需要等待浏览器的支持。（之前同功能的postcss-cssnext插件被废弃, 推荐用postcss-preset-env）
3. cssnano: cssnano是构建于postcss的插件和生态之上的，主要用来压缩和清理css代码，确保最终生成的文件 对生产环境来说体积是最小的
  注意：    
  1. 我们需要使用cssnano-preset-advanced让cssnano的特性支持最新的css特性，所以我们需要配置cssnano的预设,即cssnano-preset-advanced
  2. 由于cssnano-preset-advanced和cssnano都具有autoprefixer,事实上只需要一个即可，避免重复处理，所以把cssnano中的autoprefixer设置为false。
  3. z-index会被cssnano重新计算为1，这个巨坑，会导致之后设置z-index出现各种问题，所以需要禁用cssnano的zindex
```javascript
cssnano({ // cssnano 是构建于 postcss 的插件和生态之上的，主要用来压缩和清理CSS代码，确保最终生成的文件对生产环境来说体积是最小的
  preset: [
    cssnanoPresetAdvanced,  // cssnano-preset-advanced是cssnano的高级优化
  	{
  	  autoprefixer: false, // 由于cssnano-preset-advanced和cssnano都具有autoprefixer,事实上只需要一个即可，避免重复处理，所以把cssnano中的autoprefixer设置为false。
  	  zindex: false // z-index会被cssnano重新计算为1，这个巨坑，会导致之后设置z-index出现各种问题，所以需要禁用cssnano的zindex
  	}
  ],
})

```
4. cssnano-preset-advanced: cssnano的高级优化
5. postcss-aspect-ratio-mini: 主要用来处理元素容器的固定宽高比
```HTML
<div>
  <div className={styles.exampleItemTitle}>使用postcss-aspect-ratio-mini处理元素的尺寸固定为纵横比（宽高比）</div>
  <div className={styles.postcssAspectRatioMiniExample}>
    <img src={aaa} alt="" />
  </div>
</div>
.postcssAspectRatioMiniExample {
  width: 188px;
  height: 188px;
  border: 1px solid #000;
  position: relative;
  aspect-ratio: 1/1; /*使用postcss-aspect-ratio-mini来处理元素容器的固定宽高比。加上它有神奇的力量*/
}

.postcssAspectRatioMiniExample img {
  max-width:100%;
  max-height:100%;
  border: 1px solid #000;
  /*aspect-ratio: 16/9;*/
}

```
6. postcss-import: 主要功有是解决@import引入路径问题。使用这个插件，可以让你很轻易的使用本地文件、node_modules或者web_modules的文件。这个插件配合postcss-url让你引入文件变得更轻松
7. postcss-url: 该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理。
8. postcss-px-to-viewport: 自适应的关键所在，将px单位转换为视口单位的 (vw, vh, vmin, vmax) 的postcss插件.如果你的样式需要做根据视口大小来调整宽度，这个脚本可以将你css中的px单位转化为vw，1vw等于1/100视口宽度。
常用配置如下：    
```javascript
postcssPxToViewport({ // 实现px自动转vw实现自适应的关键插件，可以将px单位转换为视口单位的 (vw, vh, vmin, vmax) 
  viewportWidth: 1920, // 视口宽度，对应UI设计稿的视窗宽度
  viewporHeight: 1080, // 视口高度，对应UI设计稿的视窗高度
  unitToConvert: 'px',    // 需要转换的单位，默认为"px"
  viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
  fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
  unitPrecision: 6, // 指定px转换之后的精度，即小数点位数
  selectorBlackList: ['.ignore', '.hairlines'], // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
  exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
  // include: /\/src\//,     // 如果设置了include，那将只有匹配到的文件才会被转换 （exclude和include设置一个就行了）
  replace: true, //  是否转换后直接更换属性值，而不添加备用属性
  minPixelValue: 1, // 设置最小的转换数值，默认值1，小于或等于1px则不进行转换
  mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
  propList: ['*'], // 指定能转化为 vw 的css属性列表，*代表全部css属性的单位都进行转换
  // propList: ['*', '!font-size'],
  landscape: false,       // 是否根据 landscapeWidth 生成的媒体查询条件，处理横屏情况
  // landscapeUnit: 'vw',    // 横屏时使用的单位
  // landscapeWidth: 1125,   // 横屏时使用的视窗宽度
}),

```
9. postcss-viewport-units: 插件主要是给css的属性添加content的属性，配合viewport-units-buggyfill库兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器所使用的。    
  需要注意的是： 当有元素的伪类使用了content的时候，会出现如下报错：     
  xxx::before already has a ‘content’ property, give up to overwrite it   
  这时候我们就需要配置一下postcss-viewport-units的过滤规则，让其忽略伪类，不对伪类添加content属性     
```javascript
postcssViewportUnits({
   filterRule: rule => rule.selector.includes('::after') && rule.selector.includes('::before') && rule.selector.includes(':after') && rule.selector.includes(':before'), // 解决有伪类使用content报错 already has a ‘content’ property, give up to overwrite it.
}),

```
10. viewport-units-buggyfill: 配合postcss-viewport-units兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器
    postcss-viewport-units与viewport-units-buggyfill的工作原理：      
    postcss-viewport-units自动添加content属性, viewport-units-buggyfill再把根据content里的数据把vw单位转为px单位, 如下图     
    viewport-units-buggyfill的使用：     
    viewport-units-buggyfill不属于postcss插件，因此不能在postcss的plugins中进行配置，它需要单独的引入，如下：   
    方法1：     
    如果不是npm的方式安装viewport-units-buggyfill，那么需要在index.html的head 中引入 viewport-units-buggyfill ，并在body 中配置   
    ```javascript
    <head>
      <script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
    </head>

    <body>
    <script>
      window.onload = function () {
        window.viewportUnitsBuggyfill.init({
          hacks: window.viewportUnitsBuggyfillHacks
        });
      }
    </script>
    <body>

    ```  
    方法2：     
    如果是npm的方式安装了viewport-units-buggyfill     
    npm install viewport-units-buggyfill -S     
    那么需要在项目的入口文件中（比如 main.js），引入    
    ```javascript
    var hacks = require('viewport-units-buggyfill/viewport-units-buggyfill.hacks');
    require('viewport-units-buggyfill').init({
      hacks: hacks
    });

    ```
    viewport-units-buggyfill的兼容问题：    
    使用了viewport-units-buggyfill后，它会占用content属性，因此会或多或少的造成一些副作用。如img元素和伪元素的使用::before 或::after。   
    对于img，在部分浏览器中，content的写入会造成图片无法正常展示，这时候需要全局添加样式覆盖：    
```css
/* 解决使用了viewport-units-buggyfill的img兼容问题 */
	img {
		content: normal !important;
	}

```

11. postcss-write-svg: 这个库可以让你直接在css中写svg,也是处理移动端1px的解决方案,该插件主要使用的是border-image和background来做1px的相关处理   
利用postcss-write-svg实现css中写1px直线的svg示例如下：  
```css
/*1px示例*/
/*使用postcss-write-svg绘制1px(仅限直线)*/
@svg square {
  height: 1px;
  @rect {
    fill: var(--color, white);
    width: 100%;
    height: 50%;
  }
}
/*background的形式*/
.onePxLineByPostcssWriteSvgExample {
  width: 100%;
  height: 20px;
  background: white svg(square param(--color red));
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom left;
}

/*border-image的形式*/
/*
.onePxLineByPostcssWriteSvgExample {
  width: 100%;
  height: 20px;
  border-bottom: 1px solid transparent;
  border-image: svg(square param(--color $navbar-border-color)) 2 2 stretch;
}
*/

```
12. autoprefixer: 是用来自动处理浏览器前缀的一个插件。如果你配置了postcss-cssnext或者postcss-preset-env，其中就已具备了autoprefixer的功能，不需要再额外安装。在配置的时候，未显示的配置相关参数的话，表示使用的是Browserslist指定的列表参数，你也可以项目根目录创建.browserslistrc文件来指定last 2 versions 或者 > 5%，如下：       
.browserslistrc    
```javascript
> 1%
last 2 versions

```
如此一来，你在编码时不再需要考虑任何浏览器前缀的问题，可以专心撸码。这也是postcss最常用的一个插件之一。   
备注：   
实现自适应最主要的功能实际只需要postcss、postcss-px-to-viewport，其他依赖只是锦上添花或者是为了解决兼容问题，可根据自身情况选择是否安装    
本文主要介绍配置自适应所需要的插件，其他插件如处理less的less和less-loader等插件，自行研究和下载        


#### 配置vite或者webpack打包工具
##### vite - vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// 自适应所需的插件
// vite不支持require的引入方式，但是vite.config.js 即使不是es模块，也可以在里面使用impor，因为vite内部会自动转译
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssAspectRatioMini from 'postcss-aspect-ratio-mini';
import postcssWriteSvg from 'postcss-write-svg';
import postcssPxToViewport from 'postcss-px-to-viewport';
import cssnano from 'cssnano';
import cssnanoPresetAdvanced from 'cssnano-preset-advanced';
import postcssViewportUnits from 'postcss-viewport-units';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/style/global.less";',
        javascriptEnabled: true,
      },
    },
    // 自适应
    postcss: {
      plugins: [
        postcssPresetEnv, // 是一个postcss插件,帮助您使用最新的css语法，它将新的css规范转换为更兼容的css,所以你不需要等待浏览器的支持。（之前同功能的postcss-cssnext插件被废弃, 推荐用postcss-preset-env）
        postcssImport, // 主要功能是解决@import引入路径问题。使用这个插件，可以让你很轻松地使用本地文件、node_modules或者web_modules的文件。这个插件配合postcss-url让你引入文件变得更轻松
        postcssUrl, // 该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理
        postcssAspectRatioMini, // 主要用来处理元素大小固定为宽高比，通常用于img等元素上
        postcssWriteSvg({ utf8: false }), // 这个插件可以让你直接在CSS中写svg，需要配合postcss一起用，我们可以利用这个插件，使用border-image和background来做1px的相关处理，解决移动端的1px问题，但仅适合直线（有圆角的建议用transform配合伪类实现）
        postcssPxToViewport({ // 实现px自动转vw实现自适应的关键插件，可以将px单位转换为视口单位的 (vw, vh, vmin, vmax) 
          viewportWidth: 1920, // 视口宽度，对应UI设计稿的视窗宽度
          viewporHeight: 1080, // 视口高度，对应UI设计稿的视窗高度
          unitToConvert: 'px',    // 需要转换的单位，默认为"px"
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          unitPrecision: 6, // 指定px转换之后的精度，即小数点位数
          selectorBlackList: ['.ignore', '.hairlines'], // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
          exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          // include: /\/src\//,     // 如果设置了include，那将只有匹配到的文件才会被转换 （exclude和include设置一个就行了）
          replace: true, //  是否转换后直接更换属性值，而不添加备用属性
          minPixelValue: 1, // 设置最小的转换数值，默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          propList: ['*'], // 指定能转化为 vw 的css属性列表，*代表全部css属性的单位都进行转换
          // propList: ['*', '!font-size'],
          landscape: false,       // 是否根据 landscapeWidth 生成的媒体查询条件，处理横屏情况
          // landscapeUnit: 'vw',    // 横屏时使用的单位
          // landscapeWidth: 1125,   // 横屏时使用的视窗宽度
        }),
        postcssViewportUnits({ // 插件主要是给css的属性添加content的属性，配合viewport-units-buggyfill库兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器所使用的。
          filterRule: rule => rule.selector.includes('::after') && rule.selector.includes('::before') && rule.selector.includes(':after') && rule.selector.includes(':before'), // 解决有伪类使用content报错 already has a ‘content’ property, give up to overwrite it.
        }),
        cssnano({ // cssnano 是构建于 postcss 的插件和生态之上的，主要用来压缩和清理CSS代码，确保最终生成的文件对生产环境来说体积是最小的
          preset: [
            cssnanoPresetAdvanced, // cssnano-preset-advanced是cssnano的高级优化
            {
              autoprefixer: false, // 由于cssnano-preset-advanced和cssnano都具有autoprefixer,事实上只需要一个即可，避免重复处理，所以把cssnano中的autoprefixer设置为false。
              zindex: false // z-index会被cssnano重新计算为1，这个巨坑，会导致之后设置z-index出现各种问题，所以需要禁用cssnano的zindex
            }
          ],
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})


```
main.js
```javascript
import hacks from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';

// viewport-units-buggyfill
viewportUnitsBuggyfill.init({
  hacks: hacks
});


```
main.css
```css
/* 使用了viewport-units-buggyfill后，它会占用content属性，因此会或多或少的造成一些副作用。如img元素和伪元素的使用::before 或::after。*/
/* 对于img，在部分浏览器中，content的写入会造成图片无法正常展示，这时候需要全局添加样式覆盖：*/
img {
  content: normal !important;
}

```

##### webpack - webpack.config.js
```javascript
// 引入插件
// 引入postCss插件
const postcssPresetEnv = require('postcss-preset-env');
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
const postcssPxToViewport = require('postcss-px-to-viewport-opt');
const postcssWriteSvg = require('postcss-write-svg');
const postcssPresetEnv = require('postcss-preset-env');
const postcssViewportUnits = require('postcss-viewport-units');
const cssnano = require('cssnano');

```
```javascript
// 配置插件
// 引入postcss配置
options: {
	ident: 'postcss',
	plugins: () => [
	    postcssPresetEnv, // 是一个postcss插件,帮助您使用最新的css语法，它将新的css规范转换为更兼容的css,所以你不需要等待浏览器的支持。（之前同功能的postcss-cssnext插件被废弃, 推荐用postcss-preset-env）
		postcssImport, // 主要功能是解决@import引入路径问题。使用这个插件，可以让你很轻松地使用本地文件、node_modules或者web_modules的文件。这个插件配合postcss-url让你引入文件变得更轻松
		postcssUrl, // 该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理
        postcssAspectRatioMini, // 主要用来处理元素大小固定为宽高比，通常用于img等元素上
        postcssWriteSvg({ utf8: false }), // 这个插件可以让你直接在CSS中写svg，需要配合postcss一起用，我们可以利用这个插件，使用border-image和background来做1px的相关处理，解决移动端的1px问题，但仅适合直线（有圆角的建议用transform配合伪类实现）
        postcssPxToViewport({ // 实现px自动转vw实现自适应的关键插件，可以将px单位转换为视口单位的 (vw, vh, vmin, vmax) 
		    viewportWidth: 1920, // 视口宽度，对应UI设计稿的视窗宽度
		    viewporHeight: 1080, // 视口高度，对应UI设计稿的视窗高度
            unitToConvert: 'px',    // 需要转换的单位，默认为"px"
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            unitPrecision: 6, // 指定px转换之后的精度，即小数点位数
            selectorBlackList: ['.ignore', '.hairlines'], // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
            exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            // include: /\/src\//,     // 如果设置了include，那将只有匹配到的文件才会被转换 （exclude和include设置一个就行了）
            replace: true, //  是否转换后直接更换属性值，而不添加备用属性
            minPixelValue: 1, // 设置最小的转换数值，默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            propList: ['*'], // 指定能转化为 vw 的css属性列表，*代表全部css属性的单位都进行转换
            // propList: ['*', '!font-size'],
            landscape: false,       // 是否根据 landscapeWidth 生成的媒体查询条件，处理横屏情况
            // landscapeUnit: 'vw',    // 横屏时使用的单位
            // landscapeWidth: 1125,   // 横屏时使用的视窗宽度
        }),
        postcssViewportUnits({ // 插件主要是给css的属性添加content的属性，配合viewport-units-buggyfill库兼容一些不支持 vw、vh、vmax、vmin 这些 viewport 单位的浏览器所使用的。
          filterRule: rule => rule.selector.includes('::after') && rule.selector.includes('::before') && rule.selector.includes(':after') && rule.selector.includes(':before'), // 解决有伪类使用content报错 already has a ‘content’ property, give up to overwrite it.
        }),
        cssnano({ // cssnano 是构建于 postcss 的插件和生态之上的，主要用来压缩和清理CSS代码，确保最终生成的文件对生产环境来说体积是最小的
          preset: [
            cssnanoPresetAdvanced, // cssnano-preset-advanced是cssnano的高级优化
            {
              autoprefixer: false, // 由于cssnano-preset-advanced和cssnano都具有autoprefixer,事实上只需要一个即可，避免重复处理，所以把cssnano中的autoprefixer设置为false。
              zindex: false // z-index会被cssnano重新计算为1，这个巨坑，会导致之后设置z-index出现各种问题，所以需要禁用cssnano的zindex
            }
          ],
        })
	],
}

```
main.js
```javascript
const hacks = require('viewport-units-buggyfill/viewport-units-buggyfill.hacks');
const viewportUnitsBuggyfill = require('viewport-units-buggyfill');

// viewport-units-buggyfill
viewportUnitsBuggyfill.init({
  hacks: hacks
});


```
main.css
```css
/* 使用了viewport-units-buggyfill后，它会占用content属性，因此会或多或少的造成一些副作用。如img元素和伪元素的使用::before 或::after。*/
/* 对于img，在部分浏览器中，content的写入会造成图片无法正常展示，这时候需要全局添加样式覆盖：*/
img {
  content: normal !important;
}

```

————————————————
版权声明：本文为CSDN博主「Boale_H」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/Boale_H/article/details/127575909
