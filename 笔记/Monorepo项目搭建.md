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

### 第三方子包安装 @zg-admin/utils 中安装 react

pnpm i react -r --filter @zg-admin/utils

`或者 cd 进入 子包目录 install`

### 自己的子包安装 zg-admin 中安装 @zg-admin/utils

pnpm i @zg-admin/utils -r --filter zg-admin

`改为"@zg-admin/utils":"workspace:\*"  任意版本`

`pnpm i @zg-admin/utils@workspace -r --filter zg-admin`

`-r（全称 --recursive）表示对当前工作区（workspace）下的所有子包进行递归操作。此参数通常用于 monorepo 项目，要求 pnpm 在所有子包中执行安装命令`

### 全部包执行一个命令

pnpm -r exec node index.js `所有包 执行  node index.js 命令`
