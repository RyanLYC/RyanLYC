### RBAC role based access control 根据角色完成权限的控制

#### NodeJS 实现RBAC的库
1. Casbin - https://github.com/casbin/node-casbin
2. CASL - https://github.com/stalniy/casl 推荐使用

#### CASL 使用
1. 安装 @casl/ability	CASL's core package
 yarn add @casl/ability -S

2. 定义规则 https://casl.js.org/v6/en/guide/define-rules
使用 using AbilityBuilder class

