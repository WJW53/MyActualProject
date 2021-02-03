module.exports = {
    lintOnSave: false,
    devServer: {
        open: true,
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    }
};
