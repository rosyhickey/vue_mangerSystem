const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // 影响打包时， index.html引入其他资源的前缀地址
  // ./可以让开发环境和生产环境都可以正常使用
  // 为了严谨一些
  // 开发环境:'/'
  // 生产环境:'./'
  // 问题:有无代码可以让他自己识别当前运行环境?
  // node里有个内置的环境变量process.env.NODE_ENV
  // process.env.NODE_ENV 它会根据你敲击的命令，来使用不同的值
  // 解决:
  // 如果你敲击yarn server,process.env.NODE_ENV的值就是'development'字符串
  // 如果你敲击yarn build , process.env.NODE_ENV的值就是' prodution '字符串
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
})
