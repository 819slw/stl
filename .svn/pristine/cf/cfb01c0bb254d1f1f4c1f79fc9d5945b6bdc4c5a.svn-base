import request from '@/axios/request';

/**
 * 新建作业
 */
export const $_addHomework = (data) => {
    return request({
        url: '/practice/homework/insert',
        method: 'post',
        data,
    });
};

/**
 * 新建问题
 */
export const $_addQuestions = (data) => {
    return request({
        url: '/practice/homework/insertQuestionGroup',
        method: 'post',
        data,
    });
};

/**
 * 问题列表
 */
export const $_getQuestionList = (data) => {
    return request({
        url: '/practice/homework/queryQuestionByType',
        method: 'post',
        data,
    });
};

/**
 * 删除问题
 */
export const $_delQuestionById = (data) => {
    return request({
        url: '/practice/homework/deleteByType',
        method: 'post',
        data,
    });
};

/**
 * 题型下移
 */
export const $_questionMovedown = (data) => {
    return request({
        url: '/practice/homework/movedown',
        method: 'post',
        data,
    });
};

/**
 * 题型上移
 */
export const $_questionMoveup = (data) => {
    return request({
        url: '/practice/homework/moveup',
        method: 'post',
        data,
    });
};

/**
 * 通过id查询作业信息
 */
export const $_queryProblemById = (data) => {
    return request({
        url: '/practice/homework/queryById',
        method: 'post',
        data,
    });
};

/**
 * 通过id查询作业信息
 */
export const $_saveorupdateanswer = (data) => {
    return request({
        url: '/practice/homework/saveorupdateanswer',
        method: 'post',
        data,
    });
};

// 获取作业内容列表
export function queryQuestion(data) {
    return request({
        url: '/practice/homework/queryQuestion',
        method: 'post',
        data,
    });
}

// 查询标准答案
export function $_getStandardAnswer(data) {
    return request({
        url: '/practice/homework/queryAnswer',
        method: 'post',
        data,
    });
}

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

// 生成老师上传答案二维码
export function teacherQrcode(data) {
    return request({
        url: '/practice/homework/teacherQrcode',
        method: 'post',
        data,
    });
}

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

// 不使用答题卡
export const $_insertSubjectiveAnswer = (data) => {
    return request({
        url: '/practice/homework/insertSubjectiveAnswer',
        data,
        method: 'post',
    });
};

// 整体与分题转换接口 0：分题，1:整体
export function changeUploadType(data) {
    return request({
        url: 'practice/homework/changeUploadType',
        method: 'post',
        data,
    });
}

// 老师二维码上传图片
export function uploadAnswerByQrCode(data) {
    return request({
        url: 'practice/homework/uploadAnswerByQrCode',
        method: 'post',
        data,
    });
}
