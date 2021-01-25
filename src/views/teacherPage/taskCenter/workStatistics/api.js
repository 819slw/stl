import request from '@/axios/request';

/**
 * 获取列表
 */
export const $_getstuWorkList = (data) => {
    return request({
        url: '/practice/stuhomework/homeworkStatistics',
        method: 'post',
        data,
    });
};

/**
 * 获取列表
 */
export const $_getTestAnalysisList = (data) => {
    return request({
        url: '/practice/stuhomework/homeworkQuestionAnalysis',
        method: 'post',
        data,
    });
};
