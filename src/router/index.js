import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import('../views/wel/index');
const StudentPage = () => import('../views/studentPage/index');
const TeacherPage = () => import('../views/teacherPage/index');

const TaskCenter = () => import('../views/teacherPage/taskCenter/index');
const TaskList = () => import('../views/teacherPage/taskCenter/taskList/index');
const AddTask = () => import('../views/teacherPage/taskCenter/addTask/index');
const CheckCorrect = () => import('../views/teacherPage/taskCenter/checkCorrect/index');
const WorkStatistics = () => import('../views/teacherPage/taskCenter/workStatistics/index');
const CorrectCard = () => import('../views/teacherPage/taskCenter/correctCard/index');

// 学生端
const WorkCenter = () => import('../views/studentPage/workCenter/index');
const homeWork = () => import('../views/studentPage/homeWork/index'); // 查看作业
const answerSheet = () => import('../views/studentPage/answerSheet/index'); // 答题卡作答
const nonAnswer = () => import('../views/studentPage/nonAnswer/index'); // 答题卡作答

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: '个人中心',
        component: Home,
        meta: {
            isDisabled: true,
            isHref: true,
            studentPage: 'http://newlive.znclass.com/#/studentCenter/myke',
            teacherPage: 'http://newlive.znclass.com/#/teacherCenter/myke'
        },
        children: [
            {
                path: 'teacherPage',
                component: TeacherPage,
                redirect: 'teacherPage/taskCenter/taskList',
                name: '我的课程',
                meta: {
                    isDisabled: true,
                    index: 3,
                    isHref: true,
                    studentPage: 'http://newlive.znclass.com/#/studentCenter/myke',
                    teacherPage: 'http://newlive.znclass.com/#/teacherCenter/myke'
                },
                children: [
                    {
                        path: 'taskCenter',
                        component: TaskCenter,
                        redirect: 'taskCenter/taskList',
                        name: '作业管理',
                        meta: {
                            isDisabled: true,
                            index: 2,
                        },
                        children: [
                            {
                                path: 'taskList',
                                component: TaskList,
                                name: '作业列表',
                            },
                            {
                                path: 'workCorrect',
                                component: TaskList,
                                name: '作业批改',
                            },
                            {
                                path: 'addTask',
                                component: AddTask,
                                name: '新建作业',
                            },
                            {
                                path: 'checkCorrect',
                                component: CheckCorrect,
                                name: '作业批改列表',
                            },
                            {
                                path: 'workStatistics',
                                component: WorkStatistics,
                                name: '作业统计列表',
                            },
                            {
                                path: 'correctCard',
                                component: CorrectCard,
                                name: '作业批改',
                            },
                        ],
                    },
                ],
            },
            {
                path: 'studentPage',
                component: StudentPage,
                redirect: 'studentPage/workCenter',
                name: '我的作业',
                meta: {
                    isDisabled: true,
                    index: 1
                },
                children: [
                    {
                        path: 'workCenter',
                        component: WorkCenter,
                        name: '作业列表',
                    },
                    {
                        path: 'homeWork',
                        component: homeWork,
                        name: '作业作答',
                    },
                    {
                        path: 'answerSheet',
                        component: answerSheet,
                        name: '作业作答',
                    },
                    {
                        path: 'nonAnswer',
                        component: nonAnswer,
                        name: '作业作答',
                    },
                ],
            },
        ],
    },
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
