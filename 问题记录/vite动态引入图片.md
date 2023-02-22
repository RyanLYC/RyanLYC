### HTML
```xml
<img :src="getAssetsImages(children.icon.type)" alt="" style="width: 35px;height: 35px;">
```

### vue2中给图片动态设置src属性
```javascript
// 动态获取图片
const getAssetsImages = (name) => {
  return require(`/src/common/images/menu/${name}.png`)
}

```

### vue3+vite+ts可以采用如下方案代替
```javascript
// 动态获取图片
const getAssetsImages = (name) => {
  return new URL(`/src/common/images/menu/${name}.png`, import.meta.url).href
}

```