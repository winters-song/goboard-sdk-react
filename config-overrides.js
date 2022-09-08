const path = require('path');
const fs = require('fs');

const {override} = require('customize-cra')
const addLessLoader = require("customize-cra-less-loader");
const {paths} = require("react-app-rewired");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

paths.appBuild = ''

module.exports = {
  paths: (paths, env) => {

    if(process.env.NODE_ENV === "production"){
      console.log(env.NODE_ENV )
      paths.appIndexJs = resolveApp('src/components/index.js')
    }
    paths.appBuild = resolveApp('dist')
    return paths;
  },
  webpack: override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        relativeUrls: false,
      }
    }),

    (config) => {

      if (process.env.NODE_ENV === "production") {
        config.entry = resolveApp('src/components/index.js')
        config.output.filename = 'goboard.js'

        // css打包参数
        // console.log(config.plugins[5].options)
        Object.assign(config.plugins[5].options, {
          filename: 'goboard.css',
        })

        // console.log(config.module.rules[1].oneOf[1])

        config.module.rules[1].oneOf[1].use = [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 8192,
              name: 'static/[name].[hash:8].[ext]',
            },
          },
        ]
        // console.log(config.module.rules[1].oneOf[9].use[3])
        // config.module.rules[1].oneOf[1].options = {
        //   name: 'assets/[name].[hash:8].[ext]',
        // }
      }

      return config
    }
  )
}