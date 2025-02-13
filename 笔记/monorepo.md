### 项目管理迷失

#### 单体应用框架

优点

- 代码管理成本低
- 代码可见度搞
- 发布简短，链路轻便

缺点

- 代码量大后，调试、构建效率显著下降
- 无法跨项目使用

#### 多仓多模块管理 MultiRepo

优点

- 便于代码复用
- 模块独立开发调试，业务理解清晰高
- 人员安排分工明确
- 提高研发人员公共抽离思想
- 源代码房屋权限设置灵活

缺点

- 模块划分不容易把握
- 共同引用的版本问题，容易导致重复安装相同依赖得多个版本
- 构建配置不复用，不好管理
- 串行构建

#### 单仓库多模块管理 Monorepo

优点

- 所有源码都在一个仓库内，分支管理简单
- 公共依赖统一
- 统一的配置方案
- 并行构建
- 保留了 multirepo 得主要优势
- 阅读方便

缺点

- git 服务根据目录进行访问权限划分，仓库内代码开放给全部开放人员
- 代码规模太大得实惠，影响 git 操作体验。20 万行都还可以。

### yarn workspaces

使用 yarn 的时候几个要注意的点

- 配置 workspace 的方式是修改根目录中的 package.json:

```json
"private":true,
"workspaces":["packages/*"]
```

- 管理模块依赖可以使用 yarn workspace <module-name> add <module>;yarn 会自动管理的多个不同的包下面的不同的版本号的相同依赖名的依赖，
  如果与根目录中的依赖冲突，会默认的在该包下创建一个 node modules 的目录，并下载一份的依赖至该包中;
- 模块还未发布时，使用 yarn 来关联本地依赖，可能会下载到别人创建的同名包名;
- 包名使用 @空间名/包名 的结构，如 @ryan/pkg-name
- 在模块间使用依赖的时候，不要使用 fi1e:，而是可以使用<module>:'\*';

### pnpm workspaces 推荐使用这个

### Monorepos

- yarn
- pnpm
- lerna + nx
  - lerna 已经被 nx 团队维护，它们两者是共生关系！

构建与云构建工具

- nx 可生成关系图
  - NX 提供了一套全面的开发工具，强调代码重用和构建优化，而 Lerna 则专注于简化包的版本管理和发布流程。
- turbo 是 nx 的 子集

#### Lerna 常见命令及说明

**初始化 Lerna 仓库\*\***(常用)：

- 命令：`lerna init`
- 说明：初始化一个新的 Lerna 仓库，创建必要的 Lerna 配置文件和文件结构。

**添加依赖包**(常用)：

- 命令：`lerna add <package-name> --scope=<package-to-add-to>`
- 说明：向指定的包添加依赖，`<package-name>` 是要添加的依赖包名称，`<package-to-add-to>` 是目标包的名称。

**创建一个新包**：

- 命令：`lerna create <package-name>`
- 说明：在 Lerna 仓库中创建一个新的包，`<package-name>` 是新包的名称。

**引导仓库**：

- 命令：`lerna bootstrap`
- 说明：链接仓库中的交叉依赖，安装所有包的依赖项。

**运行脚本**(常用)：

- 命令：`lerna run <script> --scope=<package-name>`
- 说明：在一个或多个包中运行 npm 脚本，`<script>` 是要运行的脚本，`<package-name>` 是包的名称。

**清理依赖**(常用)：

- 命令：`lerna clean`
- 说明：删除所有包的 node_modules 目录，清理仓库。

**发布包**(常用)：

- 命令：`lerna publish`
- 说明：更新包版本号，提交更改，并发布到 npm。

通过上述命令的介绍，希望能够帮助您更好地理解和使用 NX 和 Lerna 进行项目管理和开发。这些命令覆盖了从项目初始化到开发、构建、测试和发布的整个生命周期。

#### 常见问题

##### `lerna create` 与 `lerna add` ：

- `lerna create <package-name>`：
  - **使用情况**：当您想在 Lerna 管理的 Monorepo 仓库中新增一个全新的包时，使用 `lerna create` 命令。这个命令会在仓库中创建一个新的包目录，包含一些基础的模板文件，如 `package.json`。
  - **说明**：适用于开始一个全新的库或组件的开发，为项目新增独立的模块或功能。
- **`lerna add <package-name> --scope=<package-to-add-to>`**：
  - **使用情况**：当您需要在仓库中的某个现有包中添加一个依赖（无论是外部 npm 包还是仓库内的其他包）时，使用 `lerna add` 命令。通过指定 `--scope` 参数，可以精确控制将依赖添加到哪个包中。
  - **说明**：适用于已存在的项目或包需要引入新的依赖库时，如添加工具库或者是项目内部模块间的依赖管理。

##### **`lerna bootstrap` 与 `pnpm install` 的区别**：

- `lerna bootstrap`：

  - **说明**：`lerna bootstrap` 命令会自动将仓库中的包链接起来，并安装所有包的依赖项。如果仓库中的包相互依赖，`lerna bootstrap` 会处理这些内部依赖的链接，而不需要发布到 npm。
  - **适用场景**：在 Lerna 管理的 Monorepo 中，尤其是包之间存在交叉依赖的情况下，使用 `lerna bootstrap` 来确保正确的依赖关系和链接。

- `pnpm install`：

  - **说明**：`pnpm install` 是 `pnpm` 包管理工具用于安装项目依赖的命令，类似于 `npm install` 或 `yarn install`。`pnpm` 特别适用于 Monorepo 结构，因为它通过硬链接和符号链接来节省磁盘空间，并有效管理多包依赖。
  - **适用场景**：在使用 `pnpm` 作为包管理工具的 Monorepo 项目中，可以直接使用 `pnpm install` 来安装和管理依赖。

##### **在使用 `pnpm` 时是否还需要 `lerna bootstrap`**

如果您的项目使用 `pnpm` 作为包管理工具，并且利用了 `pnpm` 的工作区功能来管理 Monorepo 的依赖，通常不需要再使用 `lerna bootstrap`。`pnpm` 的工作区功能能够有效地处理包之间的依赖关系，包括链接工作区内的包。

然而，**如果您在使用 `lerna` 管理版本控制和发布流程，同时希望利用 `pnpm` 的高效依赖管理特性，可以将两者结合使用，但在这种情况下，使用 `pnpm` 的工作区命令替代 `lerna bootstrap` 通常更为高效**。
