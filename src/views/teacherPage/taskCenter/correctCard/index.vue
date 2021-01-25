<template>
    <div class="correct-card">
        <div class="card-body students-list">
            <div class="title">学生名单</div>
            <div class="header"><span>姓名/手机号</span><span>提交方式&时间</span></div>
            <ul class="list">
                <li
                    v-for="item in studentsList"
                    :key="item.id"
                    :class="{ success: item.stuHomeworkStatus === 4, active: item.id === activeStuData.id }"
                    @click="activeStuHandle(item)"
                >
                    <div class="info">{{ item.stuNamePhone }}</div>
                    <div class="info">
                        <p>{{ ['', '自主提交', '系统提交'][item.submitType] }}</p>
                        <p>{{ item.submitTime }}</p>
                    </div>
                </li>
            </ul>
            <div class="btn">
                <el-button v-if="disabled === 1 || !showCorrect" type="warning" @click="goBackClick">返回</el-button>
                <el-button v-else type="warning" @click="correctPublish">批改发布</el-button>
            </div>
        </div>
        <div class="card-body students-questions" :class="{ bigWidth: !showCorrect }">
            <div class="questions">
                <div class="pdf-card">
                    <div class="title">学生答题卡 - {{ activeStuData.stuNamePhone }}</div>
                    <div class="body scroll">
                        <answerArea v-if="showCorrect" :subjectList="subjectList"></answerArea>
                        <div v-if="!showCorrect" class="students-imgs">
                            <el-image
                                class="answer-img"
                                v-for="(item, optionIndex) in stuFileUrl"
                                :key="optionIndex"
                                :src="item"
                                :preview-src-list="stuFileUrl"
                            >
                            </el-image>
                        </div>
                    </div>
                </div>
            </div>
            <div class="questions">
                <div class="pdf-card">
                    <div class="title">
                        作业内容
                        <div class="tab">
                            <span :class="{ active: tab === 1 }" @click="changeTab(1)">答案</span>
                            <span :class="{ active: tab === 2 }" @click="changeTab(2)">作业</span>
                        </div>
                    </div>
                    <div class="body scroll">
                        <pdf-com v-if="tab === 2" :fileUrl="fileUrl" />
                        <answerArea v-if="showCorrect && tab === 1" :subjectList="standardAnswer"></answerArea>
                        <pdf-com v-if="!showCorrect && tab === 1" :fileUrl="answerFileUrl" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showCorrect" class="card-body students-card">
            <div class="title">批阅区</div>
            <div class="card">
                <div class="noQuestion" v-if="questionTypeList.length === 0">暂无可批改项！</div>
                <radio-card
                    v-if="
                        questionTypeList.length !== 0 &&
                            (questionTypeList[cardType - 1].type === 1 ||
                                questionTypeList[cardType - 1].type === 2 ||
                                questionTypeList[cardType - 1].type === 3)
                    "
                    :questionList="questionTypeList[cardType - 1]"
                    @saveCheck="saveCheck"
                />
                <div v-else>
                    <blanks-card
                        v-if="questionTypeList.length !== 0"
                        :questionList="questionTypeList[cardType - 1]"
                        @saveCheck="saveCheck"
                    />
                </div>
            </div>
            <div class="btn">
                <el-button
                    class="plain-btn"
                    :class="{ noDisabled: cardType !== 1 }"
                    :disabled="cardType === 1 || questionTypeList.length === 0"
                    @click="proQuestion"
                    >上一题</el-button
                >
                <el-button
                    class="plain-btn"
                    :class="{ noDisabled: cardType !== questionTypeList.length && questionTypeList.length !== 0 }"
                    :disabled="cardType === questionTypeList.length || questionTypeList.length === 0"
                    @click="nextQuestion"
                    >下一题</el-button
                >
                <el-button type="warning" :disabled="disabled === 1" @click="updateStuHomeworkStatus">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import RadioCard from './radioCard';
import BlanksCard from './blanksCard';
import PdfCom from '_c/pdfCom';
import answerArea from '@/components/answerArea';
import {
    $_getQueryStudentsList,
    $_queryProblemById,
    $_getQueryQuestionList,
    $_queryHomeworkStudent,
    $_getStandardAnswer,
    $_saveQuestionCheck,
    $_updateStuHomeworkStatus,
    $_updateHomeworkStatus,
} from './api';

export default {
    components: {
        RadioCard,
        BlanksCard,
        PdfCom,
        answerArea,
    },

    data() {
        return {
            tab: 1,
            cardType: 1,
            fileUrl: void 0, // 作业pad链接
            stuFileUrl: void 0, // 学生不使用答题卡
            answerFileUrl: void 0, // 老师上传的标准答案
            showCorrect: true,
            activeStuData: {},
            studentsList: [],
            // 题型一般有5种
            questionTypeList: [],
            subjectList: [],
            standardAnswer: [],
            judgeSubList: [
                {
                    name: '正确',
                    val: '1',
                    isActive: false,
                },
                {
                    name: '错误',
                    val: '0',
                    isActive: false,
                },
            ],
            typeArr: [
                {
                    type: 1,
                    name: '单选题',
                },
                {
                    type: 2,
                    name: '多选题',
                },
                {
                    type: 3,
                    name: '判断题',
                },
                {
                    type: 4,
                    name: '填空题',
                },
                {
                    type: 5,
                    name: '简答题',
                },
            ],
        };
    },

    computed: {
        homeworkId: () => localStorage.localTeacherWorkId,
    },

    methods: {
        changeTab(num) {
            this.tab = num;
        },

        activeStuHandle(data) {
            this.activeStuData = data;
            this.queryHomeworkStudent();
            if (this.showCorrect) {
                this.getQueryQuestionList();
            }
            if (!this.showCorrect && this.disabled != 1) {
                this.updateStuHomeworkStatus();
            }
        },

        // 获取左侧学生列表
        getQueryStudentsList() {
            const params = {
                homeworkId: this.homeworkId,
            };
            $_getQueryStudentsList(params).then((res) => {
                this.studentsList = res.result;
                if (this.studentsList.length > 0) {
                    if (!this.activeStuData.id) {
                        this.activeStuData = res.result[0];
                    } else {
                        this.activeStuData = res.result.find((item) => item.id === this.activeStuData.id);
                    }
                    this.queryHomeworkStudent();
                    if (this.showCorrect) {
                        this.getQueryQuestionList();
                    }
                }
            });
        },

        // 通过id查询作业信息
        queryProblemById(homeworkId) {
            $_queryProblemById({
                homeworkId,
            }).then((res) => {
                this.fileUrl = res.result.workUrl;
            });
        },

        // 查询批改问题接口
        getQueryQuestionList() {
            const params = {
                homeworkId: this.homeworkId,
                stuId: this.activeStuData.studentId,
            };
            $_getQueryQuestionList(params).then((res) => {
                this.questionTypeList = [];

                res.result.forEach((res) => {
                    let index = this.questionTypeList.findIndex((item) => {
                        return item.group === 'group' + res.questionType + 'item' + res.questionTypeCounter;
                    });

                    if (index > -1) {
                        this.questionTypeList[index].list.push(res);
                    } else {
                        this.questionTypeList.push({
                            type: res.questionType,
                            name: ['', '单选题', '多选题', '判断题', '填空题', '简答题'][res.questionType],
                            group: 'group' + res.questionType + 'item' + res.questionTypeCounter,
                            list: [res],
                        });
                    }
                });

                console.log(this.questionTypeList);

                // let correctionData = res.result.filter((item) => item.correctionMethod !== 3);
                // if (correctionData.length === 0) {
                //     return;
                // }
                // correctionData.forEach((item) => {
                //     if (this.questionTypeList[item.questionType] === void 0) {
                //         this.questionTypeList[item.questionType] = [];
                //     }
                //     this.questionTypeList[item.questionType].push(item);
                // });
                // this.questionTypeList = this.questionTypeList.filter((item) => {
                //     return item !== undefined;
                // });

                this.cardType = 1;
            });
        },

        // 学生答题卡
        queryHomeworkStudent() {
            const params = {
                homeworkId: this.homeworkId,
                stuId: this.activeStuData.studentId,
            };
            $_queryHomeworkStudent(params).then((res) => {
                if (!this.showCorrect) {
                    if (res.result.length > 0) {
                        this.stuFileUrl = res.result[0].answerUrl ? res.result[0].answerUrl.split(',') : [];
                    }
                    return;
                }
                this.subjectList = [];
                let obj = res.result || [];
                obj.map((el) => {
                    this.$set(el, 'name', this.typeArr.find((v) => v.type === el.questionType).name);
                    this.$set(el, 'type', el.questionType);
                    this.$set(el, 'group', 'group' + el.questionType + 'item' + el.questionTypeCounter);

                    if (el.options !== undefined) {
                        el.options = el.options.split(',').filter((item) => item);
                    }
                    if (el.answerUrl !== undefined) {
                        el.answerUrl = el.answerUrl.split(',').filter((item) => item);
                    }
                    if (el.questionType === 3) {
                        const obj = this.judgeSubList.find((v) => v.val == el.options);
                        const name = obj ? [obj.name] : [];
                        this.$set(el, 'options', name);
                    }
                });
                this.resultArr = obj;

                this.resultArr.forEach((res) => {
                    // 先看存不存在这类题型
                    let isLive = this.subjectList.findIndex(
                        (v) => v.group === 'group' + res.questionType + 'item' + res.questionTypeCounter
                    );
                    if (isLive > -1) {
                        // 存在就直接push
                        this.subjectList[isLive].list.push(res);
                    } else {
                        // 不存在就先创建
                        this.subjectList.push({
                            type: res.type,
                            group: 'group' + res.questionType + 'item' + res.questionTypeCounter,
                            name: res.name,
                            list: [res],
                        });
                        isLive = this.subjectList.length - 1;
                    }
                });
            });
        },

        // 查询标准答案
        getStandardAnswer() {
            const params = {
                homeworkId: this.homeworkId,
            };
            $_getStandardAnswer(params).then((res) => {
                if (!this.showCorrect) {
                    if (res.result.length > 0) {
                        this.answerFileUrl = res.result[0].answer;
                    }
                    return;
                }
                this.standardAnswer = [];
                let obj = res.result || [];
                obj.map((el) => {
                    this.$set(el, 'name', this.typeArr.find((v) => v.type === el.questionType).name);
                    this.$set(el, 'type', el.questionType);
                    this.$set(el, 'group', 'group' + el.questionType + 'item' + el.questionTypeCounter);

                    if (el.questionType === 3) {
                        this.$set(el, 'options', [this.judgeSubList.find((v) => v.val === el.answer).name]);
                    }
                    if ((el.questionType === 1 || el.questionType === 2) && el.answer !== undefined) {
                        el.options = el.answer.split(',').filter((item) => item);
                    }
                    if ((el.questionType === 4 || el.questionType === 5) && el.answer !== undefined) {
                        el.answerUrl = el.answer.split(',');
                    }
                });
                this.resultArr = obj;

                this.resultArr.forEach((res) => {
                    // 先看存不存在这类题型
                    let isLive = this.standardAnswer.findIndex(
                        (v) => v.group === 'group' + res.questionType + 'item' + res.questionTypeCounter
                    );

                    if (isLive > -1) {
                        // 存在就直接push
                        this.standardAnswer[isLive].list.push(res);
                    } else {
                        // 不存在就先创建
                        this.standardAnswer.push({
                            type: res.type,
                            group: 'group' + res.questionType + 'item' + res.questionTypeCounter,
                            name: res.name,
                            list: [res],
                        });
                        isLive = this.standardAnswer.length - 1;
                    }
                });
            });
        },

        // 上一题型
        proQuestion() {
            if (this.cardType === 1) {
                return;
            }
            this.cardType -= 1;
        },

        nextQuestion() {
            if (this.cardType === this.questionTypeList.length) {
                return;
            }
            this.cardType += 1;
        },

        // 单题保存
        saveCheck(item) {
            const params = {
                homeworkId: this.homeworkId,
                questionId: item.questionId,
                score: item.score,
                stuId: this.activeStuData.studentId,
                opinion: item.opinion,
                isRight: item.isRight,
            };
            $_saveQuestionCheck(params);
        },

        // 保存按钮
        updateStuHomeworkStatus() {
            const params = {
                homeworkId: this.homeworkId,
                studentId: this.activeStuData.studentId,
            };
            $_updateStuHomeworkStatus(params).then(() => {
                if (!this.showCorrect && this.disabled != 1) {
                    this.$message.success('查阅成功');
                } else {
                    this.$message.success('保存批改成功');
                }
                this.getQueryStudentsList();
            });
        },

        // 返回
        goBackClick() {
            window.history.back();
        },

        // 批改发布
        correctPublish() {
            this.$confirm('确认要发布当前批改内容吗？', '批改发布提示', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                $_updateHomeworkStatus({ homeworkId: this.homeworkId }).then(() => {
                    this.$message.success('批改发布成功');
                    this.goBackClick();
                });
            });
        },
    },

    mounted() {
        this.disabled = Number(this.$route.query.disabled);
        this.showCorrect = Number(this.$route.query.showCorrect);
        this.getQueryStudentsList();
        this.getStandardAnswer();
        if (this.homeworkId !== void 0) {
            this.queryProblemById(this.homeworkId);
        }
    },
};
</script>
<style lang="scss" scoped>
.correct-card {
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 16px 0;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: center;
    .card-body {
        height: 100%;
        max-height: 100%;
        box-sizing: border-box;
        .title {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            padding-left: 8px;
            background: rgba(237, 109, 0, 1);
            border-radius: 2px 2px 0px 0px;
        }
        .btn {
            height: 86px;
            border-top: 1px solid #eee;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            .plain-btn.noDisabled {
                color: #ed6d00;
                border: 1px solid #ed6d00;
            }
            .el-button:focus {
                background-color: #fff;
            }
            .el-button:hover {
                background-color: #ecf5ff;
            }
        }
    }
    .students-list {
        width: 226px;
        border: 1px solid #d8d8d8;
        .header {
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            background: rgba(231, 236, 243, 1);
            display: flex;
            span {
                display: inline-block;
                padding: 0 8px;
                &:first-child {
                    width: 35%;
                }
                &:last-child {
                    width: 65%;
                }
            }
        }
        .list {
            list-style: none;
            height: calc(100% - 158px);
            overflow: hidden;
            overflow-y: auto;
            background-color: #fafafa;
            li {
                width: 100%;
                height: 40px;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.65);
                text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                &:nth-child(odd) {
                    background-color: #fff;
                }
                &:nth-child(even) {
                    background-color: #f5f7fa;
                }
                &.success {
                    color: #fff;
                    background-color: #30cb82;
                }
                &.active {
                    color: #fff;
                    background-color: #ed6d00;
                }
                .info {
                    padding: 0 8px;
                    &:first-child {
                        width: 35%;
                    }
                    &:last-child {
                        width: 65%;
                    }
                    p {
                        line-height: 16px;
                    }
                }
            }
        }
    }
    .students-questions {
        width: 590px;
        margin: 0 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &.bigWidth {
            width: 926px;
        }
        .questions {
            height: 50%;
            box-sizing: border-box;
            &:first-child {
                padding-bottom: 8px;
            }
            &:last-child {
                padding-top: 8px;
            }
            .pdf-card {
                width: 100%;
                height: 100%;
                border: 1px solid #d8d8d8;
                box-sizing: border-box;
            }
            .tab {
                float: right;
                width: 180px;
                height: 100%;
                border: 2px solid #ed6d00;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                span {
                    display: inline-block;
                    height: 100%;
                    width: 50%;
                    color: #303133;
                    text-align: center;
                    background-color: #f0f2f5;
                    cursor: pointer;
                    &.active {
                        color: #ed6d00;
                        background-color: #fff;
                    }
                }
            }
            .body {
                height: calc(100% - 40px);
                padding-left: 8px;
                &.scroll {
                    overflow: hidden;
                    overflow-y: auto;
                    .students-imgs {
                        .answer-img {
                            width: 80px;
                            height: 80px;
                            margin: 10px;
                            border: 1px solid #eee;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }
    }
    .students-card {
        width: 320px;
        border: 1px solid #d8d8d8;
        background-color: #fafafa;
        .card {
            height: calc(100% - 126px);
            overflow: hidden;
            overflow-y: auto;
            .noQuestion {
                width: 100%;
                line-height: 60px;
                font-size: 14px;
                color: #ccc;
                text-align: center;
            }
        }
    }
}
</style>
