const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '/stl/',
    configureWebpack: {
        // devtool: 'cheap-module-eval-source-map'
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            vue: 'Vue',
            'vue-router': 'VueRouter',
            vuex: 'Vuex',
            //   'axios': 'axios',
            'element-ui': 'ELEMENT',
        });

        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/components'))
            .set('_a', resolve('src/assets'));

        // config.plugin('webpack-bundle-analyzer')
        //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

        // config.plugin('compression-webpack-plugin')
        //   .use(require('compression-webpack-plugin'))
        //     .tap(args => {
        //       args[0] = {
        //         test:/\.js$|\.html$|.\css/, //匹配文件名
        //         threshold: 10240,//对超过10k的数据压缩
        //         deleteOriginalAssets: true //不删除源文件
        //       }
        //       return args
        //     })
    },
    devServer: {
        //   open: "http://localhost:8080/",
        //   host: '0.0.0.0',
        //   port: 8080,
        proxy: {
            /* 要使proxy生效，config/index.js的dev路径为空 */
            '/practice': {
                target: 'http://192.168.100.201:7800', // 测试环境服务器
                changeOrigin: true,
                pathRewrite: {
                    '^/practice': '/',
                },
            },
        },
    },
};
