## 集成 husky 和 lint-staged
让没通过 ESLint 检测和修复的代码禁止提交，从而保证仓库代码都是符合规范的。
需要用到 Git Hook，在本地执行 git commit 的时候，就对所提交的代码进行 ESLint 检测和修复（即执行 eslint --fix），如果这些代码没通过 ESLint 规则校验，则禁止提交

实现这一功能，我们借助 [husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged) 
* husky —— Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。
* lint-staged —— 在 git 暂存的文件上运行 linters。

### 配置 husky
* 自动配置（推荐）
  使用 husky-init 命令快速在项目初始化一个 husky 配置。
```shell
  npx husky-init && npm install
```
这行命令做了四件事：
1. 安装 husky 到开发依赖 (npm i husky -D)
2. 在项目根目录下创建 `.husky` 目录 (npx husky install)
3. 在 .husky 目录创建 `pre-commit` hook，并初始化 pre-commit 命令为 npm test
4. 修改 package.json 的 scripts，增加 "prepare": "husky install"

husky 包含很多 hook（钩子），常用有：pre-commit、commit-msg、pre-push。这里，我们使用 pre-commit 来触发 ESLint 命令。

* 修改 .husky/pre-commit hook 文件的触发命令：
  eslint --fix ./src --ext .vue,.js,.ts
  上面这个 pre-commit hook 文件的作用是：当我们执行 git commit -m "xxx" 时，会先对 src 目录下所有的 .vue、.js、.ts  文件执行 eslint --fix 命令，如果 ESLint 通过，成功 commit，否则终止 commit。

  只用 ESLint 修复自己此次写的代码，而不去影响其他的代码。所以我们还需借助一个神奇的工具 lint-staged 。

### 配置 lint-staged
lint-staged 这个工具一般结合 husky 来使用，它可以让 husky 的 hook 触发的命令只作用于 git add那些文件（即 git 暂存区的文件），而不会影响到其他文件。
1. 安装 lint-staged  npm i lint-staged -D
2. 在 package.json里增加 lint-staged 配置项
```javascript
  "lint-staged": {
      "*.{vue,js,ts}": "eslint --fix"
    },
```
这行命令表示：只对 git 暂存区的 .vue、.js、.ts 文件执行 eslint --fix。
3. 修改 .husky/pre-commit hook 的触发命令为：npx lint-staged

至此，husky 和 lint-staged 组合配置完成。
