
const {override} = require('customize-cra')
const addLessLoader = require("customize-cra-less-loader");
const {paths} = require("react-app-rewired");
// const path = require('path');
// const fs = require('fs');

// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
//
// paths.appBuild = ''

module.exports = {
  // paths: (paths, env) => {
  //
  //   if(process.env.NODE_ENV === "production"){
  //     console.log(env.NODE_ENV )
  //     paths.appIndexJs = resolveApp('src/components/Quiz.jsx')
  //   }
  //   paths.appBuild = resolveApp('dist')
  //   return paths;
  // },
  webpack: override(
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
    // (config) => {
    //
    //   if (process.env.NODE_ENV === "production") {
    //     config.entry = resolveApp('src/components/Quiz.jsx')
    //     config.output.filename = 'goboard.js'
    //
    //
    //     // config.output.library = 'goboard'
    //     config.output.libraryTarget = 'umd'
    //     // config.output.libraryExport = 'default'
    //     // css打包参数
    //     // console.log(config.plugins[5].options)
    //     Object.assign(config.plugins[5].options, {
    //       filename: 'goboard.css',
    //     })
    //
    //     // console.log(config.module.rules[1].oneOf[9].use[0].options.publicPath = './')
    //     config.module.rules[1].oneOf[9].use[0].options.publicPath = './'
    //
    //     // config.module.rules[1].oneOf[1].use = [
    //     //   {
    //     //     loader: require.resolve('file-loader'),
    //     //     options: {
    //     //       name: 'assets/[name].[ext]',
    //     //       useRelativePaths: true,
    //     //     },
    //     //   },
    //     // ]
    //   }
    //
    //   return config
    // }
  )
}