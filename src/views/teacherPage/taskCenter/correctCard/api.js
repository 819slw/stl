import request from '@/axios/request';

/**
 * 获取列表
 */
export const $_getQueryStudentsList = (data) => {
    return request({
        url: '/practice/stuhomework/queryStudents',
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
 * 查询学生答案得分、老师评语
 */
export const $_getQueryQuestionList = (data) => {
    return request({
        url: '/practice/homeworkStuAnswer/queryStudentAnswerAndScore',
        method: 'post',
        data,
    });
};

// 查询学生答案
export function $_queryHomeworkStudent(data) {
    return request({
        url: '/practice/homeworkStuAnswer/queryHomeworkStudent',
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

// 单题保存接口
export function $_saveQuestionCheck(data) {
    return request({
        url: '/practice/homeworkStuAnswer/saveCheck',
        method: 'post',
        data,
    });
}

// 单题保存接口
export function $_updateStuHomeworkStatus(data) {
    return request({
        url: '/practice/homeworkStuAnswer/updateStuHomeworkStatus',
        method: 'post',
        data,
    });
}

/**
 * 批改发布
 */
export const $_updateHomeworkStatus = (data) => {
    return request({
        url: '/practice/stuhomework/homeworkRelease',
        data,
        method: 'post',
    });
};
