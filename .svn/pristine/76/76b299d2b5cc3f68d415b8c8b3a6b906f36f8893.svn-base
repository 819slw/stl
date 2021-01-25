<template>
    <div class="work-statistics">
        <div class="btns">
            <el-button size="small" type="warning" @click="testAnalysis">试题分析</el-button>
            <el-button class="refresh-btn" size="small" icon="el-icon-refresh" @click="getstuWorkList">刷新</el-button>
            <div class="score">
                <div>
                    总分：<span class="yellow">{{ sumScore }}分</span>
                </div>
                <div>
                    平均分：<span class="yellow">{{ averageScore }}分</span>
                </div>
            </div>
        </div>
        <div>
            <el-table :data="tableData" :row-class-name="tableRowClassName" stripe style="width: 100%">
                <el-table-column prop="date" label="排名" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="studentName" label="姓名"> </el-table-column>
                <el-table-column prop="stuNamePhone" label="手机号" width="80"> </el-table-column>
                <el-table-column label="提交方式">
                    <template slot-scope="scope">
                        <span>{{ ['', '自主提交', '系统提交'][scope.row.submitType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间"> </el-table-column>
                <el-table-column prop="completionRate" label="完成率"> </el-table-column>
                <el-table-column prop="costTime" label="作答用时"> </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ tableStatus[scope.row.status] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="score" label="得分"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            v-if="
                                showCorrect == 1 &&
                                    scope.row.status === 3 &&
                                    (scope.row.workStatus === 4 || scope.row.workStatus === 5)
                            "
                            type="text"
                            size="small"
                            style="color: #25BA43"
                            @click="goCorrectCard(0, 1)"
                            >批改</el-button
                        >
                        <el-button type="text" size="small" style="color: #ED6D00" @click="goCorrectCard(1, 1)"
                            >查看</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <router-view></router-view>
        <el-dialog title="试题分析" :visible.sync="dialogVisible" width="800px">
            <div class="dialog">
                <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="testAnalysisList"
                    :row-class-name="tableRowClassName"
                    stripe
                    style="width: 100%"
                >
                    <el-table-column prop="date" label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="题型">
                        <template slot-scope="scope">
                            <span>{{
                                ['', '单选题', '多选题', '判断题', '填空题', '简答题'][scope.row.questionType]
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" label="分值"> </el-table-column>
                    <el-table-column label="得分率">
                        <template slot-scope="scope">
                            <span style="color: #FF942E">{{ scope.row.scoringRate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="正答率">
                        <template slot-scope="scope">
                            <span style="color: #30CB82">{{ scope.row.positiveAnswerRate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="错答率1">
                        <template slot-scope="scope">
                            <span style="color: #F85A57">{{ scope.row.wrongAnswerRate1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="wrongAnswerRate2" label="错答率2">
                        <template slot-scope="scope">
                            <span style="color: #F85A57">{{ scope.row.wrongAnswerRate2 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="emptyAnswerRate" label="空答率"> </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { $_getstuWorkList, $_getTestAnalysisList } from './api';

export default {
    data() {
        return {
            sumScore: 0,
            averageScore: 0,
            dialogVisible: false,
            tableStatus: ['', '待作答', '作答中', '已提交', '已批改'],
            tableData: [],
            testAnalysisList: [],
            showCorrect: 0, // 是否显示批阅区
            loading: true,
        };
    },

    computed: {
        homeworkId: () => localStorage.localTeacherWorkId,
    },

    methods: {
        testAnalysis() {
            this.dialogVisible = true;
            this.loading = true;
            this.getTestAnalysisList();
        },

        tableRowClassName(rowData) {
            if (rowData.rowIndex % 2 === 1) {
                return 'odd-row';
            } else {
                return 'even-row';
            }
        },

        goCorrectCard(disabled) {
            this.$router.push({
                path: '/teacherPage/taskCenter/correctCard?disabled=' + disabled + '&showCorrect=' + this.showCorrect,
            });
        },

        // 作业统计
        getstuWorkList() {
            const params = {
                homeworkId: this.homeworkId,
            };
            $_getstuWorkList(params).then((res) => {
                this.tableData = res.result.statisticsList;
                this.sumScore = res.result.sumScore;
                this.averageScore = res.result.averageScore;
            });
        },

        // 试题分析
        getTestAnalysisList() {
            if (this.testAnalysisList.length > 0) {
                this.loading = false;
                return;
            }
            const params = {
                homeworkId: this.homeworkId,
            };
            $_getTestAnalysisList(params).then((res) => {
                this.testAnalysisList = res.result;
                this.loading = false;
            });
        },
    },

    mounted() {
        this.showCorrect = this.$route.query.isUseAnswerCard;
        this.getstuWorkList();
    },
};
</script>

<style lang="scss" scoped>
.work-statistics {
    .refresh-btn,
    .refresh-btn:focus,
    .refresh-btn:hover {
        color: #ed6d00;
        border: 1px solid #ed6d00;
    }
    .refresh-btn:focus {
        background-color: #fff;
    }
    .refresh-btn:hover {
        background-color: #ecf5ff;
    }
    .dialog {
        padding: 0 16px;
        .el-table {
            border: 1px solid #eee;
        }
    }
    .color-yellow {
        color: #ff942e;
    }
    .color-green {
        color: #30cb82;
    }
    .color-red {
        color: #f85a57;
    }
    .btns {
        position: relative;
        padding-top: 4px;
        margin-bottom: 32px;
        .score {
            position: absolute;
            top: 0;
            right: 16px;
            font-size: 16px;
            color: #606266;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
                line-height: 32px;
                margin-left: 40px;
            }
            .yellow {
                color: #ed6d00;
            }
        }
    }
}
</style>
<style scoped>
.work-statistics .el-table >>> th {
    color: #000;
    background-color: #e7ecf3;
}

.work-statistics .el-table >>> td {
    color: #606266;
}

.el-table >>> .odd-row {
    background-color: #f5f7fa;
}

.el-table >>> .even-row {
    background-color: #fff;
}
</style>
