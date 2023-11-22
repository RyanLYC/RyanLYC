### 实现icon颜色渐变,核心思想为下面 3 条属性值。
1.  设置渐变的背景
background: -webkit-linear-gradient(-45deg, #caff55 20%, #45cd00 60%);
2. 规定背景的绘制区域为文字区域
-webkit-background-clip: text;
这个属性还有其他值：
border-box (默认) 背景被剪裁到边框盒
padding-box 背景被剪裁到内边距框
content-box 背景被剪裁到内容框
3. 文字填充颜色（这里一定要设置 transparent，不然会覆盖底部的背景色）
-webkit-text-fill-color: transparent;

```xml
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link
      rel="stylesheet"
      href="http://at.alicdn.com/t/c/font_3490748_8803wo6ieog.css"
    />
    <style type="text/css">
      .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
      .icon-shouye {
        font-size: 50px;
        background-image: -webkit-linear-gradient(
          -45deg,
          #caff55 20%,
          #45cd00 60%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>IconFont 图标</h1>
      <i class="iconfont icon-shouye"></i>
    </div>
  </body>
</html>

```