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
      }

      return config
    }
  )
}