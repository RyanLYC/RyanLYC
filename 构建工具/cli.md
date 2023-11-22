### 参考 move-folder-cli

### cli 开发流程
1. npm init -y
2. package.json
   ```js
   "bin": {
    "move-folder": "bin/cli.js"
  },
   ```
3. bin文件夹 文件 cli.js声明入口 #!/usr/bin/env node
4. npm link
5. move-folder 命令执行成功