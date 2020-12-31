const NODE_ENV = 'development' // 开发环境 打包doc
// const NODE_ENV = 'lib' // 组件库 上传npm

const fs = require('fs')
const path = require('path')
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
const join = path.join
function getEntries(path) {
  let files = fs.readdirSync(resolve(path))
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'))
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(itemPath)
    }
    return ret
  }, {})
  return entries
}

const baseConfig = {
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  },
  css: {
    extract: false,
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        data: `@import "public/css/shn-vue-ui.scss";`
      }
    },
  }
}

const devConfig = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },

  publicPath: './',
  outputDir: 'docs',
  ...baseConfig
}

const buildConfig = {
  configureWebpack: {
    // entry: components,
    entry: {
      ...getEntries('packages'),
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
  },
  outputDir: 'lib',
  productionSourceMap: false,
  ...baseConfig
}

module.exports = NODE_ENV === 'development' ? devConfig : buildConfig;
