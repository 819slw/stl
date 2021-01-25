import request from '@/axios/request';

/**
 * 获取列表
 */
export const $_getHomeworkList = (data) => {
    return request({
        url: '/practice/homework/query',
        method: 'post',
        data,
    });
};

/**
 * 删除作业
 */
export const $_delHomework = (data) => {
    return request({
        url: '/practice/homework/deleteById',
        data,
        method: 'post',
    });
};

/**
 * 老师更新作业
 */
export const $_updateHomeworkType = (data) => {
    return request({
        url: '/practice/homework/updatebytype',
        data,
        method: 'post',
    });
};

/**
 * 确定保存作业更新作业状态
 */
export const $_updateHomeworkStatus = (data) => {
    return request({
        url: '/practice/homework/updateHomeworkStatus',
        data,
        method: 'post',
    });
};
