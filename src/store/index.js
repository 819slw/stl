import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const teacherModule = {
    state: {
        courseId: void 0, // 课程id
        teacherId: void 0, // 教师id
        chapterId: void 0, // 章节id
        chapterName: void 0, // 课程名称
        subjectId: void 0, // 学科id
        subjectName: void 0, // 学科名称
        // 作业id
        homeworkId: void 0,
    },
    mutations: {
        setTeacherData: function(state, data) {
            state.courseId = data.courseId;
            state.teacherId = data.teacherId;
            state.chapterId = data.chapterId; // 章节id
            state.chapterName = data.chapterName; // 课程名称
            state.subjectId = data.subjectId; // 学科id
            state.subjectName = data.subjectName; // 学科名称
        },

        setTeacherWorkId(state, homeworkId) {
            state.homeworkId = homeworkId;
        },
    },
};

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        teacherModule,
    },
});
