module.exports = {
    /**
     * 七牛云基础接口
     */
    qiniuURL: 'https://file.znclass.com/',
    // qiniuURL: 'https://csfile.fuzhuxian.com/',
    /**
     * 项目部署基础
     * 默认情况下，我们假设你的应用将被部署在域的根目录下,
     * 例如：https://www.my-app.com/
     * 默认：'/'
     * 如果您的应用程序部署在子路径中，则需要在这指定子路径
     * 例如：https://www.foobar.com/my-app/
     * 需要将它改为'/my-app/'
     */
    publicPath: {
        //  本地环境发布目录
        dev: '/',
        //  生产环境发布目录
        pro: '/',
        //  测试
        testDev: '/',
    },
    /**
     *  api请求基础路径
     */
    apiUrl: {
        //  本地环境接口请求地址
        // dev: 'http://192.168.0.217:7799',
        // dev: 'http://114.115.212.162:7799',
        dev: 'http://doc.znclass.com', // pro
        // dev: '',
        testDev: 'http://114.115.212.162:7799',
        pro: 'http://doc.znclass.com',
    },
    WS_API: function() {
        let url = '';
        switch (process.env.NODE_ENV) {
            case 'production':
                url = '49.4.8.110:7800';
                break;
            case 'development':
                // url = 'doc.znclass.com'
                // url = '192.168.100.201:7800'
                url = '49.4.8.110:7800';
                break;
            default:
                url = '192.168.100.201:7800';
                break;
        }
        return url;
    },
    baseUrl: function() {
        return {
            development: this.apiUrl.dev,
            production: this.apiUrl.pro,
            testDev: this.apiUrl.testDev,
        }[process.env.NODE_ENV];
    },
};
