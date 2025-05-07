### 初始化项目

```shell
pnpm init
```

### 禁用 npm 、 yarn

```json
{
  "scripts": {
    "preinstall": "node preinstall.js"
  }
}
```

```js
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "This repository requires using pnpm for package management."
  );
  process.exit(1);
}
```

### 建立工作空间-创建文件 pnpm-workspace.yaml

```js
packages:
  # all packages in direct subdirs of packages/
  - "packages/*"

```

### 安装公共包

根目录 执行 pnpm i vue -w

### 第三方子包安装

pnpm i react -r --filter @zg-admin/utils

`或者 cd 进入 子包目录 install`

### 自己的子包安装

pnpm i @zg-admin/utils -r --filter zg-admin
