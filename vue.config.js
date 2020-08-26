module.exports = {
    css: {
        loaderOptions: {
            scss: {
                data: `
            @import "@/styles/scss/static/_variables.scss";
          `
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'https://eloquent-region-287213.et.r.appspot.com:443',
                ws: true,
                changeOrigin: true
            }
        }
    }
}
