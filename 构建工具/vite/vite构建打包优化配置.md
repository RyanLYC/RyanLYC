### vite 构建打包优化配置

1. gzip 静态资源压缩

```js
// npm i vite-plugin-compression -D

import viteCompression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    //在plugins配置数组里添加gzip插件
    viteCompression({
      verbose: true, // 默认即可
      disable: false, // 开启压缩(不禁用)，默认即可
      deleteOriginFile: false, // 删除源文件
      threshold: 5120, // 压缩前最小文件大小
      algorithm: "gzip", // 压缩算法
      ext: ".gz", // 文件类型
    }),
  ],
});
```

2. 静态资源的打包处理（按分类存放相应的文件）

```js
build: {
    rollupOptions: {
      output: {
        // 静态资源打包做处理
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 最小拆分打包
        manualChunks(id) {
        if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      }
    }
  }
```

3. 大的静态资源拆分/代码分割

```js
// 方式1：提高静态资源的容量大小
build: {
 chunkSizeWarningLimit: 1500,//加大
}
// 方式2：合并路由打包
// build里的output设置内,添加以下代码
manualChunks: {
  // vue vue-router合并打包
  vue: ['vue', 'vue-router'],
  lodash: ['lodash'],
  // 两个文件合并成一个a文件
  helloWorld: ['src/components/a.vue','src/components/b.vue'],
}
// 方式3：最小拆分打包
// 插件打包做处理
manualChunks(id) {
  if (id.includes('node_modules')) {
    return id.toString().split('node_modules/')[1].split('/')[0].toString();
  }
  return;
}
```

4. 组件按需导入

```js
// unplugin-vue-components 插件。查看 element-plus 文档
```

5. 清除 console 和 debugger
   vite 打包时压缩代码的方式有两种。

   - esbuild
   - terser

默认启动的是 esbuild 进行代码压缩。 esbuild，比 terser 快 20-40 倍，压缩率只差 1%-2%。

```js
// esbuild
esbuild: {
  pure: ['console.log'], // 删除 console.log
  drop: ['debugger'], // 删除 debugger
},
// npm install  terser  -D
//  build里添加terserOptions的配置
// 打包环境移除console.log，debugger
minify: 'terser', // 启用 terser 压缩
terserOptions: {
  compress: {
    drop_console: true, // 打包时删除console
    drop_debugger: true, // 打包时删除 debugger
  },
},
```

1. 图片资源压缩

```js
// npm i vite-plugin-imagemin -D
// 引入
import viteImagemin from 'vite-plugin-imagemin'

// 在plugins配置数组里添加
plugin: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    });
]
```

7. 使用 CDN 加速
   内容分发网络（Content Delivery Network，简称 CDN）就是让用户从最近的服务器请求资源，提升网络请求的响应速度。通常我们请求依赖模块使用 CDN ，而请求项目代码依然使用自己的服务器

```js
// npm install vite-plugin-cdn-import --save-dev
import { autoComplete, Plugin as importToCDN } from "vite-plugin-cdn-import";

export default defineConfig({
  plugins: [
    importToCDN({
      // 需要 CDN 加速的模块
      modules: [
        // 支持自动导入
        autoComplete("axios"),
        {
          name: "lodash",
          var: "_",
          path: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`,
        },
      ],
    }),
  ],
});
```

8. 安装打包分析插件

```js
// npm i rollup-plugin-visualizer
// 引入
import { visualizer } from "rollup-plugin-visualizer";

// 在plugins配置数组里添加
plugins: [
  visualizer({
    gzipSize: true,
    brotliSize: true,
    emitFile: false, // 打包后的分析文件会出现在打包好的文件包下
    filename: "visualizer.html", // 分析图生成的文件名
    open: true, // 如果存在本地服务端口，将在打包后自动展示
  }),
];
```

9. vite 常用基本配置

```js
{
  root: process.cwd(), // 项目根目录（index.html 文件所在的位置）,
  base: '/', // 开发或生产环境服务的公共基础路径 配置引入相对路径
  mode: 'development', // 模式
  plugins: [vue()], // 需要用到的插件数组
  publicDir: 'public', // 静态资源服务的文件夹
  cacheDir: 'node_modules/.vite', // 存储缓存文件的目录
  resolve: {
    alias: [ // 文件系统路径别名
      {
        find: //@//,
        replacement: pathResolve('src') + '/'
      }
    ],
    dedupe: [], // 强制 Vite 始终将列出的依赖项解析为同一副本
    conditions: [], // 解决程序包中 情景导出 时的其他允许条件
    mainFields: [], // 解析包入口点尝试的字段列表
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'], // 导入时想要忽略的扩展名列表
    preserveSymlinks: false, // 启用此选项会使 Vite 通过原始文件路径确定文件身份
  },
  css: {
    modules: {
      scopeBehaviour: 'global' | 'local',
      // ...
    },
    postcss: '', // 内联的 PostCSS 配置 如果提供了该内联配置，Vite 将不会搜索其他 PostCSS 配置源
    preprocessorOptions: { // css的预处理器选项
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  },
  json: {
    namedExports: true, // 是否支持从.json文件中进行按名导入
    stringify: false, //  开启此项，导入的 JSON 会被转换为 export default JSON.parse("...") 会禁用按名导入
  },
  esbuild: { // 最常见的用例是自定义 JSX
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  assetsInclude: ['**/*.gltf'], // 指定额外的 picomatch 模式 作为静态资源处理
  logLevel: 'info', // 调整控制台输出的级别 'info' | 'warn' | 'error' | 'silent'
  clearScreen: true, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  envDir: '/', // 用于加载 .env 文件的目录
  envPrefix: [], // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
  server: {
    host: '127.0.0.1', // 指定服务器应该监听哪个 IP 地址
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/api/, '')
      }
    },
    cors: true, // 配置 CORS
    force: true, // 强制使依赖预构建
    hmr: { // 禁用或配置 HMR 连接
      // ...
    },
    watch: { // 传递给 chokidar 的文件系统监听器选项
      // ...
    },
    middlewareMode: '', // 以中间件模式创建 Vite 服务器
    fs: {
      strict: true, // 限制为工作区 root 路径以外的文件的访问
      allow: [], // 限制哪些文件可以通过 /@fs/ 路径提供服务
      deny: ['.env', '.env.*', '*.{pem,crt}'], // 用于限制 Vite 开发服务器提供敏感文件的黑名单
    },
    origin: 'http://127.0.0.1:8080/', // 用于定义开发调试阶段生成资产的 origin
  },
  build: {
    target: ['modules'], // 设置最终构建的浏览器兼容目标
    polyfillModulePreload: true, // 是否自动注入 module preload 的 polyfill
    outDir: 'dist', // 指定输出路径
    assetsDir: 'assets', // 指定生成静态文件目录
    assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
    cssCodeSplit: true, // 启用 CSS 代码拆分
    cssTarget: '', // 允许用户为 CSS 的压缩设置一个不同的浏览器 target 与 build.target 一致
    sourcemap: false, // 构建后是否生成 source map 文件
    rollupOptions: {}, // 自定义底层的 Rollup 打包配置
    lib: {}, // 构建为库
    manifest: false, // 当设置为 true，构建后将会生成 manifest.json 文件
    ssrManifest: false, // 构建不生成 SSR 的 manifest 文件
    ssr: undefined, // 生成面向 SSR 的构建
    minify: 'esbuild', // 指定使用哪种混淆器
    terserOptions: {}, // 传递给 Terser 的更多 minify 选项
    write: true, // 启用将构建后的文件写入磁盘
    emptyOutDir: true, // 构建时清空该目录
    brotliSize: true, // 启用 brotli 压缩大小报告
    chunkSizeWarningLimit: 500, // chunk 大小警告的限制
    watch: null, // 设置为 {} 则会启用 rollup 的监听器
  },
  preview: {
    port: 5000, // 指定开发服务器端口
    strictPort: true, // 若端口已被占用则会直接退出
    https: false, // 启用 TLS + HTTP/2
    open: true, // 启动时自动在浏览器中打开应用程序
    proxy: { // 配置自定义代理规则
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^/api/, '')
      }
    },
    cors: true, // 配置 CORS
  },
  optimizeDeps: {
    entries: [], // 指定自定义条目——该值需要遵循 fast-glob 模式
    exclude: [], // 在预构建中强制排除的依赖项
    include: [], // 可强制预构建链接的包
    keepNames: false, // true 可以在函数和类上保留 name 属性
  },
  ssr: {
    external: [], // 列出的是要为 SSR 强制外部化的依赖,
    noExternal: '', // 列出的是防止被 SSR 外部化依赖项
    target: 'node', // SSR 服务器的构建目标
  }
}
```
