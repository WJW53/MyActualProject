const px2rem = require('postcss-px2rem');

module.exports = {
  lintOnSave: false,//关闭eslint
  devServer: {
    open: true,//启动服务后自动打开页面
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5,//37.5像素对应1rem,一般设计稿是750px,所以这里一般用75
          }),
        ],
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-mall-app/'
    : '/',
};