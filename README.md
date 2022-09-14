# React棋盘SDK

## React棋盘组件

主要包括：
- 围棋规则 : Go
- 棋盘UI: Goboard
- 棋盘控制组件：GoboardPlayer
- 棋盘业务组件：GoboardXXXPlayer

棋盘业务组件：
- 棋谱分析：GoboardAnalysisPlayer 
  (进入和退出试下、AI分支，手动回到主线)
- 课堂打谱：GoboardBranchPlayer （黑白交替落子逻辑，自动回到主线）
- 对弈： GoboardGamePlayer (没有黑白交替逻辑，有点目显示形势功能)
- 做题： GoboardQuizPlayer (适配各题型逻辑)

## React棋盘应用

棋盘应用：
- 分屏课堂教师界面： ClassroomSitTeacher

---


## 安装

需要配置webpack, 增加Less支持，增加对node_modules的jsx解析。为了避免暴露Webpack配置文件(eject)，推荐使用
react-app-rewired + customize-cra。


安装 Less, Less-loader：
```shell
yarn add less less-loader -D
```

安装 react-app-rewired, customize-cra, customize-cra-less-loader：
```shell
yarn add react-app-rewired customize-cra customize-cra-less-loader -D
```

创建config-overrides.js进行配置：
```javascript
const {override} = require('customize-cra')
const {paths} = require("react-app-rewired");

const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        relativeUrls: false,
      }
    }),

    (config) => {
      // 查找jsx,tsx loader，增加对子模块的编译
      const loaders = config.module.rules[1].oneOf
      for(let i = 0; i< loaders.length; i++ ){
        if(loaders[i].test && !loaders[i].test.length && loaders[i].test.test(".tsx")){
          loaders[i].include = [
            paths.appSrc,
            paths.appNodeModules
          ]
          break;
        }
      }

      return config
    }
  )
  ```

以上如果使用了eject，则webpack.config.js配置方法：
```javascript
// module -> oneOf下
{
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  // include: paths.appSrc,
  include: [
    paths.appSrc,
    paths.appNodeModules
  ],
  ...
}
```
```javascript
const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

// module -> rules -> oneOf下
{
  // 配置 less
  test: lessRegex,
  exclude: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
    "less-loader"
  ),
  sideEffects: true,
},
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    },
    "less-loader"
  ),
},
```



## CRA创建组件库：
```shell
yarn create react-app goboard-sdk-react
```

链接：
[react-app-rewired](https://github.com/timarney/react-app-rewired)

- customize-cra：自定义配置
- customize-cra-less-loader：解决customize-cra对于高版本less-loader不支持问题
  https://github.com/arackaf/customize-cra