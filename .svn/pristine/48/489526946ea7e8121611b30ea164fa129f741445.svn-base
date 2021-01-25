import request from '@/axios/request'
// 查询作业列表
export function queryHomeworkListByStudentId(data) {
    return request({
      url: '/practice/stuhomework/queryHomeworkListByStudentId',
      method: 'post',
      data
    })
}
// 获取作业内容列表
export function queryQuestion(data) {
    return request({
      url: '/practice/homework/queryQuestion',
      method: 'post',
      data
    })
}
// 单题提交答案
export function saveOrUpdate(data) {
    return request({
      url: '/practice/homeworkStuAnswer/saveOrUpdate',
      method: 'post',
      data
    })
}
// 提交作业
export function updateSubmitType(data) {
    return request({
      url: '/practice/homeworkStuAnswer/updateSubmitType',
      method: 'post',
      data
    })
}
// 查询学生答案
export function queryHomeworkStudent(data) {
    return request({
      url: '/practice/homeworkStuAnswer/queryHomeworkStudent',
      method: 'post',
      data
    })
}
// 更新学生作业状态(批改保存按钮调用)
export function updateStuHomeworkStatus(data) {
  return request({
    url: '/practice/homeworkStuAnswer/updateStuHomeworkStatus',
    method: 'post',
    data
  })
}
// 学生作答校验
export function validateTime(data) {
  return request({
    url: '/practice/stuhomework/validateTime',
    method: 'post',
    data
  })
}
// 查询学生答案得分、老师评语
export function queryStudentAnswerAndScore(data) {
  return request({
    url: '/practice/homeworkStuAnswer/queryStudentAnswerAndScore',
    method: 'post',
    data
  })
}
// 查询作业答案
export function queryAnswer(data) {
  return request({
    url: '/practice/homework/queryAnswer',
    method: 'post',
    data
  })
}

// 学生作答数据统计
export function studentStatistics(data) {
  return request({
    url: '/practice/stuhomework/studentStatistics',
    method: 'post',
    data
  })
}

/**
 * 通过id查询作业信息
 */
export const queryProblemById = (data) => {
  return request({
      url: '/practice/homework/queryById',
      method: 'post',
      data,
  });
};

// 根据userId获取用户全部信息
export function getAllByUserId(params) {
  return request({
    url: '/usercenter/student/getAllByUserId',
    method: 'GET',
    params
  })
}

// 学科查询列表
export function list(params) {
  return request({
    url: '/usercenter/baseSubject/list',
    method: 'GET',
    params
  })
}

// 生成学生二维码
export function stuQrCode(data) {
  return request({
      url: '/practice/homeworkStuAnswer/stuQrCode',
      method: 'post',
      data,
  });
}

// id查询作业
export function queryById(data) {
  return request({
      url: '/practice/homework/queryById',
      method: 'post',
      data,
  });
}

// 查询作业是否批改
export function queryStudentHomeworkById(data) {
  return request({
      url: 'practice/stuhomework/queryStudentHomeworkById',
      method: 'post',
      data,
  });
}