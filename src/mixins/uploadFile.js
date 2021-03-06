import request from '@/axios/request';
import * as qiniu from 'qiniu-js';
import configObj from '@/config';

// 七牛 /getUploadToken
const getUploadToken = () => {
    return request({
        url: '/knowledgecenter/resource/getUploadToken',
        method: 'get',
    });
};

export const uploadFile = {
    methods: {
        uploadqiniu(file) {
            return new Promise((resolve, reject) => {
                // 上传资源到七牛
                getUploadToken()
                    .then((res) => {
                        let observable = qiniu.upload(file, new Date().getTime(), res.result);
                        observable.subscribe(
                            () => {
                                // reject(`正在上传`)
                            },
                            (err) => {
                                console.log(err)
                                reject(`上传失败,请检查网络`);
                            },
                            (complete) => {
                                resolve(`${configObj.qiniuURL}${complete.key}`);
                            }
                        );
                    })
                    .catch(() => {
                        reject(`上传失败,请检查网络`);
                    });
            });
        },
    },
};
