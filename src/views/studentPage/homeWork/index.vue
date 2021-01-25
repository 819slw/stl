<template>
    <div class="assignments">
        <div class="subject test-1">
            <div class="pdf">
                <PdfCom :fileUrl="homeworkInfo.workUrl"></PdfCom>
            </div>
        </div>
        <!-- 操作区域 -->
        <div class="answer">
            <div class="answerBtn">
                <div
                    :class="active == item.id ? 'orange' : ''"
                    v-for="(item, index) in answer"
                    :key="index"
                    @click="handleMode(item.id)"
                >
                    {{ item.name }}
                </div>
            </div>
            <div class="card" v-if="active">
                <div v-if="active">
                    <div class="cardTitle" v-if="active === 2">
                        <div class="title">我的作答</div>
                        <div class="cardBtn">
                            <div
                                class="correcting"
                                v-if="Number(homeworkInfo.isUseAnswerCard) === 1"
                                :style="{ background: correctingColor }"
                            >
                                {{ correcting }}
                            </div>
                            <div
                                class="statistics"
                                @click="lookStatistics"
                                v-if="showStatistics && Number(homeworkInfo.isUseAnswerCard) === 1"
                            >
                                <img :src="require('@/assets/statistics.png')" />
                                <span>查看统计</span>
                            </div>
                        </div>
                    </div>
                    <answerArea
                        :subjectList="subjectList"
                        :isShowLabel="isShowLabel"
                        v-if="Number(homeworkInfo.isUseAnswerCard) === 1 || Number(active) === 2"
                    ></answerArea>
                    <PdfCom v-else :fileUrl="subjectList[0] && subjectList[0].list[0].answer"></PdfCom>
                </div>
                <div v-else>
                    <div class="title">我的作答</div>
                    <div style="height:1000px;"></div>
                </div>
            </div>
            <div class="Return" @click="btnReturn">
                <div>返回</div>
            </div>
        </div>
        <!-- 个人统计 -->
        <div class="dio" v-if="dialogVisible">
            <div class="dio-heard">
                <div>
                    个人统计
                    <div class="fl" @click="handleBG">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
            </div>
            <div class="count">
                <el-progress
                    class="circle"
                    style="transform: rotateY(180deg);"
                    type="circle"
                    :percentage="percentage"
                    :color="colors"
                    :format="format"
                    :width="220"
                    :stroke-width="16"
                ></el-progress>
                <div class="fraction">
                    <div class="fraction1">
                        {{ statisticsInfo.score }}
                        <span style="font-size:14px;color:rgba(151,151,151,1);">分</span>
                    </div>
                    <div style="font-size:14px;color:rgba(151,151,151,1);padding-left:4px;">
                        超过了
                        <span style="color:rgba(250,100,0,1)">{{ statisticsInfo.moreThanPercent }}</span> 的同学
                    </div>
                </div>
            </div>
            <div class="footer">
                <div>
                    <span>{{ statisticsInfo.homeworkTotalScore }}</span>
                    <span class="colorC">试卷总分</span>
                </div>
                <div>
                    <span>{{ statisticsInfo.costTime || '-' }}</span>
                    <span class="colorC">答题用时 (分钟)</span>
                </div>
                <div>
                    <span :style="{ color: gridColor(statisticsInfo.scoreLevel).color }">{{
                        statisticsInfo.scoreLevel
                    }}</span>
                    <span class="colorC">成绩等级</span>
                </div>
            </div>
        </div>
        <div
            class="win"
            v-if="dialogVisible && Number(statisticsInfo.score) > Number(statisticsInfo.homeworkTotalScore) * 0.8"
            @click="handleBG"
        >
            <img src="../../../assets/win.png" alt />
        </div>
        <div class="divBG" v-if="dialogVisible" @click="handleBG"></div>
    </div>
</template>

<script>
import PdfCom from '_c/pdfCom';
import answerArea from '@/components/answerArea';
import {
    queryHomeworkStudent,
    queryStudentAnswerAndScore,
    queryAnswer,
    studentStatistics,
    queryById,
    queryStudentHomeworkById,
} from '@/api/student';
// import { siginSuboptions } from '@/views/studentPage/answerSheet/data'
export default {
    name: 'homeWork',
    components: {
        answerArea,
        PdfCom,
    },
    data() {
        return {
            statisticsInfo: {},
            isShowLabel: false,
            dialogVisible: false,
            active: 1,
            answer: [
                { id: 1, name: '答案' },
                { id: 2, name: '我的作答' },
            ],
            percentage: '',
            colors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#ee9444', percentage: 100 },
            ],
            subjectList: [],
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
            resultArr: [],
            ColorTypeList: [
                {
                    type: 0,
                    color: '#3037CB',
                    gradeDesc: '优秀',
                },
                {
                    type: 1,
                    color: '#30CB82',
                    gradeDesc: '良好',
                },
                {
                    type: 2,
                    color: '#ED6D00',
                    gradeDesc: '中等',
                },
                {
                    type: 3,
                    color: '#FDB850',
                    gradeDesc: '及格',
                },
                {
                    type: 4,
                    color: '#F85A57',
                    gradeDesc: '不及格',
                },
            ],
            typeArr: [
                {
                    type: 0,
                    name: '',
                },
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
            correcting: '',
            showStatistics: false,
            btnColor: [
                {
                    scoreType: 0,
                    type: 'danger',
                },
                {
                    scoreType: 1,
                    type: 'warning',
                },
                {
                    scoreType: 2,
                    type: 'success',
                },
            ],
            queryHomeworkId: '',
            stuId: '',
            homeworkInfo: {},
            correctingColor: '',
            teacherList: [],
            studentList: [],
            isAllowSwitch: false,
        };
    },
    created() {
        this.queryHomeworkId = String(this.$route.query.homeworkId);
        this.stuId = String(this.$route.query.stuId);
        this.getPdfData();
        this.initData();
        this.getCorrectData();
    },
    methods: {
        // 返回上一页
        btnReturn() {
            this.$router.go(-1);
            if (this.$route.query.hideHeadFoot == 1) {
                window.location.href = 'hios://NaviBack';
            }
        },
        // 成绩等级颜色区分
        gridColor(type) {
            if (type) {
                return this.ColorTypeList.find((v) => v.gradeDesc === type);
            } else {
                return {};
            }
        },
        handleMode(n) {
            this.active = n;
            if (n === 1) {
                this.isShowLabel = false;
                this.subjectList = this.studentList;
            } else {
                if (this.isAllowSwitch) {
                    this.isShowLabel = true;
                }
                this.subjectList = this.teacherList;
            }
        },
        // 打开弹窗
        lookStatistics() {
            studentStatistics({
                homeworkId: this.queryHomeworkId,
                studentId: this.stuId,
            }).then((res) => {
                this.statisticsInfo = res.result;
                let proportion = (Number(res.result.score) / Number(res.result.homeworkTotalScore)) * 100;
                this.percentage = proportion;
            });
            this.dialogVisible = true;
        },
        // 关闭弹窗
        handleBG() {
            this.dialogVisible = false;
        },
        format() {},
        getCorrectData() {
            // 查询作业是否批改
            queryStudentHomeworkById({ homeworkId: this.queryHomeworkId, studentId: this.stuId }).then((res) => {
                if (res.result.stuHomeworkStatus === 3) {
                    this.correcting = '未批改';
                    this.showStatistics = false;
                    this.correctingColor = 'linear-gradient(90deg,rgba(237,109,0,1) 0%,rgba(253,184,80,1) 100%)';
                } else if (res.result.stuHomeworkStatus === 4) {
                    this.correcting = '已批改';
                    this.showStatistics = true;
                    this.correctingColor = 'linear-gradient(90deg,rgba(0,145,255,1) 0%,rgba(80,200,253,1) 100%)';
                } else if (res.result.stuHomeworkStatus === 5) {
                    this.isAllowSwitch = true;
                    this.correcting = '已发布';
                    this.showStatistics = true;
                    this.correctingColor = 'linear-gradient(90deg,rgba(0,145,255,1) 0%,rgba(80,200,253,1) 100%)';
                }
            });
        },
        setDataStructure(data) {
            let arr = [];
            data.forEach((res) => {
                let isLive = arr.findIndex(
                    (v) => v.group === 'group' + res.questionType + 'item' + res.questionTypeCounter
                );
                if (isLive > -1) {
                    arr[isLive].list.push(res);
                } else {
                    arr.push({
                        type: res.questionType,
                        name: this.typeArr.find((v) => Number(v.type) === Number(res.questionType)).name,
                        group: 'group' + res.questionType + 'item' + res.questionTypeCounter,
                        list: [res],
                    });
                    isLive = arr.length - 1;
                }
            });
            return arr;
        },
        getPdfData() {
            // 获取PDF
            queryById({ homeworkId: this.queryHomeworkId }).then((res) => {
                this.homeworkInfo = res.result;
                document.title = this.homeworkInfo.workName;
            });
        },
        async initData() {
            this.subjectList = [];
            {
                let resultArr = [];
                let answerRes = await queryHomeworkStudent({ homeworkId: this.queryHomeworkId, stuId: this.stuId });
                let obj = answerRes.result || [];
                obj.map((el) => {
                    this.$set(el, 'name', this.typeArr.find((v) => v.type === el.questionType).name);
                    this.$set(el, 'type', el.questionType);
                    this.$set(el, 'group', 'group' + el.questionType + 'item' + el.questionTypeCounter);
                    if (el.questionType === 3) {
                        this.$set(el, 'options', this.judgeSubList.find((v) => v.val === el.options).name);
                    }
                    if (el.options !== '') {
                        el.options = el.options.split(',');
                    }
                    if (el.answerUrl !== '') {
                        el.answerUrl = el.answerUrl.split(',');
                    }
                });
                resultArr = obj;
                // 查询学生答案得分、老师评语
                queryStudentAnswerAndScore({ homeworkId: this.queryHomeworkId, stuId: this.stuId }).then((res) => {
                    let obj = res.result || [];
                    Array.prototype.notempty = function() {
                        var arr = [];
                        this.map(function(val) {
                            if (val !== '' && val != undefined) {
                                arr.push(val);
                            }
                        });
                        return arr;
                    };
                    obj.map((el, i) => {
                        if (el.questionType === 1 || el.questionType === 2) {
                            if (el.stuAnswer !== undefined) {
                                el.stuAnswer = el.stuAnswer.split(',');
                                el.stuAnswer = el.stuAnswer.notempty();
                                obj[i].stuAnswer = el.stuAnswer;
                            }
                        }
                    });
                    resultArr.map((el) => {
                        let isObj = obj.find((item) => Number(item.questionId) === Number(el.questionId));
                        if (isObj) {
                            this.$set(el, 'sorts', isObj.questionSort);
                            this.$set(el, 'isRight', isObj.isRight);
                            this.$set(el, 'options', isObj.stuAnswer);
                            this.$set(el, 'score', isObj.score);
                            this.$set(el, 'opinion', isObj.opinion);
                            this.$set(el, 'scoreType', this.btnColor.find((v) => v.scoreType == isObj.scoreType).type);
                        }
                    });
                });
                this.teacherList = this.setDataStructure(resultArr);
            }

            {
                let queryAnswerRes = await queryAnswer({ homeworkId: this.queryHomeworkId, isShowAnswer: 1 });
                (queryAnswerRes.result || []).map((el) => {
                    if (el.questionType === 3) {
                        this.$set(
                            el,
                            'options',
                            el.answer
                            // this.judgeSubList.find(v => v.val === el.answer).name
                        );
                    } else if (el.questionType === 4 || el.questionType === 5 || el.questionType === 0) {
                        if (el.answer !== undefined) el.answerUrl = el.answer.split(',');
                    } else {
                        Array.prototype.notempty = function() {
                            var arr = [];
                            this.map(function(val) {
                                if (val !== '' && val != undefined) {
                                    arr.push(val);
                                }
                            });
                            return arr;
                        };
                        if (el.answer !== undefined) {
                            el.options = el.answer.split(',');
                            el.options = el.options.notempty();
                        }
                    }
                });
                this.studentList = this.setDataStructure(queryAnswerRes.result);
                this.subjectList = this.studentList;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.assignments {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    background: #fff;
    .subject {
        width: 718px;
        height: 100%;
        overflow: auto;
        margin-right: 24px;
        border: 1px solid #d8d8d8;
        .pdf {
            height: 1000px;
        }
    }
    .answer {
        .answerBtn {
            width: 186px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background-color: #f0f2f5;
            display: flex;
            padding: 2px;
            border-radius: 4px;
            margin-bottom: 18px;
            div {
                flex: 1;
                color: #303133;
                border-radius: 2px;
                cursor: pointer;
                font-family: PingFangSC-Medium, PingFang SC;
            }
        }
        .card {
            width: 426px;
            height: calc(100% - 116px);
            background-color: #fafafa;
            overflow: auto;
            padding: 16px 32px 20px 16px;
            border: 1px solid #d8d8d8;
            box-sizing: border-box;
            .cardTitle {
                display: flex;
                justify-content: space-between;
            }
            .cardBtn {
                display: flex;
                font: 14px/24px simhei;
                color: #fff;
            }
            .correcting {
                height: 24px;
                padding: 0 15px;
                border-radius: 12px 0px 12px 0px;
                // background: linear-gradient(
                //   90deg,
                //   rgba(0, 145, 255, 1) 0%,
                //   rgba(80, 200, 253, 1) 100%
                // );
            }
            .statistics {
                height: 24px;
                padding: 0 15px;
                border-radius: 12px 0px 12px 0px;
                background: linear-gradient(90deg, rgba(237, 109, 0, 1) 0%, rgba(253, 184, 80, 1) 100%);
                display: flex;
                justify-content: space-between;
                cursor: pointer;
                margin-left: 15px;
            }
            .statistics img {
                width: 18px;
                height: 18px;
                margin: 3px 5px 3px 0;
            }
        }
        .Return {
            height: 40px;
            width: 100%;
            margin-top: 16px;
            div {
                width: 122px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
                box-sizing: border-box;
                border: 1px solid #ed6d00;
                border-radius: 4px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(237, 109, 0, 1);
            }
            div:active {
                border: 1px solid #ed3;
            }
        }
        .title {
            color: #092238;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
        }
        .type-Single {
            color: #092238;
            font-family: PingFangSC-Medium, PingFang SC;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            .SingleItem {
                // height: 50px;
                line-height: 50px;
                padding-left: 20px;
                .optionBtn {
                    margin-left: 10px;
                    width: 48px;
                    height: 24px;
                    align-items: center;
                    line-height: 0;
                }
            }
        }
        .type-Multiple {
            color: #092238;
            font-family: PingFangSC-Medium, PingFang SC;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            .SingleItem {
                // height: 50px;
                line-height: 50px;
                padding-left: 20px;
                .optionBtn {
                    margin-left: 10px;
                    width: 48px;
                    height: 24px;
                    align-items: center;
                    line-height: 0;
                }
            }
        }
        .type-Judge {
            color: #092238;
            font-family: PingFangSC-Medium, PingFang SC;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            .SingleItem {
                // height: 50px;
                line-height: 50px;
                padding-left: 20px;
                display: flex;
                align-items: center;
                .optionBtn {
                    margin-left: 10px;
                    width: 48px;
                    height: 24px;
                    align-items: center;
                    line-height: 0;
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }

    .pd {
        margin: 10px 0;
    }
    .orange {
        background-color: #fff;
        color: #ed6d00 !important;
    }
    .test-1::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    .test-1::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
    }
    .test-1::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ededed;
    }
    .win {
        width: 1000px;
        height: 1000px;
        position: fixed;
        z-index: 999;
        top: 50%;
        margin-top: -500px;
        margin-left: -500px;
        left: 50%;
        transform: rotate(180deg);
        // -ms-transform: rotate(7deg); /* IE 9 */
        // -moz-transform: rotate(7deg); /* Firefox */
        // -webkit-transform: rotate(7deg); /* Safari 和 Chrome */
        // -o-transform: rotate(7deg); /* Opera */
        img {
            width: 100%;
            height: 100%;
            -webkit-transform: rotate(360deg);
            animation: rotation 8s linear infinite;
            -moz-animation: rotation 8s linear infinite;
            -webkit-animation: rotation 8s linear infinite;
            -o-animation: rotation 8s linear infinite;
        }
    }
    @-webkit-keyframes rotation {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }
    .divBG {
        position: fixed;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background-color: #000;
        filter: alpha(opacity=60); /*IE*/
        -moz-opacity: 0.6; /*old Mozilla*/
        -khtml-opacity: 0.6; /*old Safari*/
        opacity: 0.6; /*Chrome, Opera, Safari*/
        z-index: 100;
    }

    .dio {
        z-index: 1000;
        width: 554px;
        height: 496px;
        position: absolute;
        background-color: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 8px;
        .dio-heard {
            width: 100%;
            height: 80px;
            box-sizing: border-box;
            padding: 16px 20px 0 20px;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(9, 34, 56, 1);
        }
        .count {
            width: 100%;
            height: 220px;
            position: relative;
            .circle {
                width: 220px;
                height: 220px;
                margin-left: 167px;
            }
            .fraction {
                position: absolute;
                left: 200px;
                top: 70px;
                width: 155px;
                text-align: center;
                .fraction1 {
                    display: inline-block;
                    font-size: 48px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 500;
                    color: rgba(9, 34, 56, 1);
                }
            }
        }
        .footer {
            height: 195px;
            width: 100%;
            padding-top: 73px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(9, 34, 56, 1);
            font-size: 40px;
            box-sizing: border-box;
            display: flex;
            text-align: center;
            div {
                flex: 1;
                height: 80px;
            }
        }
    }
    .colorC {
        font-size: 14px;
        font-weight: 400;
        color: rgba(151, 151, 151, 1);
        display: block;
    }
    .fl {
        float: right;
        cursor: pointer;
    }
    .count .el-progress-circle /deep/ {
    }
}
</style>
