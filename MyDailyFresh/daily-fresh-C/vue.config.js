const px2rem = require('postcss-px2rem');

module.exports = {
  lintOnSave: false,//不要eslint检查,烦人
  devServer: {
    open: true,
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5,
          }),
        ],
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-mall-app/'
    : '/',
};
