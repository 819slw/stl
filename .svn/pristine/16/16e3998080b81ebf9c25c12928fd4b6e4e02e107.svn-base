<template>
    <div class="taskListContainer">
        <el-button v-if="workType !== 1" class="add-work-btn" size="small" type="warning" @click="navigateTo('')"
            >新建作业</el-button
        >
        <div>
            <el-table :data="tableData" stripe style="width: 100%" :height="tableHeight">
                <el-table-column prop="workName" label="作业名称"> </el-table-column>
                <el-table-column prop="subjectName" label="学科" width="80"> </el-table-column>
                <el-table-column prop="chapterName" label="章节名称"> </el-table-column>
                <el-table-column label="答案下发方式">
                    <template slot-scope="scope">
                        <p>{{ answerStatus[scope.row.answerDistributionMethod] }}</p>
                        <p v-if="scope.row.answerDistributionMethod === 3">{{ scope.row.answerReleaseTime }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="closeTime" label="答题截止时间"> </el-table-column>
                <el-table-column fixed="right" label="状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ tableStatus[scope.row.status] }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="230">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status === 2"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="navigateTo(scope.row.id)"
                            >编辑</el-button
                        >
                        <el-button
                            v-if="scope.row.status === 1"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="navigateTo(scope.row.id)"
                            >继续编辑</el-button
                        >
                        <el-button
                            v-if="(scope.row.status === 7 && scope.row.isUseAnswerCard === 0) || scope.row.status === 8"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="goCorrectCard(scope.row.id, 1, 0)"
                            >查看</el-button
                        >
                        <el-button
                            v-if="
                                (scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 8) &&
                                    scope.row.isUseAnswerCard === 1
                            "
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="goCorrectCard(scope.row.id, 0, 1)"
                            >批改</el-button
                        >
                        <el-button
                            v-if="scope.row.status === 6 && scope.row.isUseAnswerCard === 1"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="correctPublish(scope.row)"
                            >批改发布</el-button
                        >
                        <el-button
                            v-if="
                                scope.row.status === 6 ||
                                    (scope.row.status === 7 &&
                                        scope.row.isUseAnswerCard === 1 &&
                                        scope.row.isUseAnswerCard === 1)
                            "
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="goCorrectCard(scope.row.id, 1, 1)"
                        >
                            查看批改
                        </el-button>
                        <el-button
                            v-if="scope.row.status !== 1 && scope.row.status !== 2 && scope.row.status !== 9"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="goWorkStatistics(scope.row)"
                            >作业统计</el-button
                        >
                        <el-button
                            v-if="scope.row.status === 2"
                            type="text"
                            size="small"
                            style="color: #ED6D00"
                            @click="workIssued(scope.row)"
                            >作业下发</el-button
                        >
                        <el-button
                            v-if="scope.row.status === 2 || scope.row.status === 3"
                            @click="releaseAnswerType(scope.row)"
                            type="text"
                            style="color: #ED6D00"
                            size="small"
                        >
                            答案下发方式
                        </el-button>
                        <el-button
                            v-if="scope.row.status === 3"
                            type="text"
                            size="small"
                            style="color: #FF4542"
                            @click="workInvalid(scope.row)"
                            >作业作废</el-button
                        >
                        <el-button
                            v-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 9"
                            type="text"
                            size="small"
                            style="color: #FF4542"
                            @click="delHomework(scope.row.id)"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
            >
            </el-pagination>
        </div>

        <el-dialog title="修改答案下发方式" :visible.sync="dialogVisible" width="630px">
            <el-form :model="answerType" :rules="rules" ref="ruleForm">
                <div class="answer-type-down">
                    <el-form-item
                        class="answer-type"
                        label="答案下发方式"
                        label-width="120px"
                        prop="distributionMethod"
                    >
                        <el-select v-model="answerType.distributionMethod" placeholder="请选择答案下发方式">
                            <el-option :value="1" label="自行操作下发"></el-option>
                            <el-option :value="2" label="截止时间下发"></el-option>
                            <el-option :value="3" label="固定时间下发"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="answerType.distributionMethod === 3" label-width="16px" prop="releaseTime">
                        <el-date-picker
                            type="datetime"
                            v-model="answerType.releaseTime"
                            placeholder="请选择时间"
                            format="yyyy/MM/dd HH:mm"
                            value-format="yyyy/MM/dd HH:mm"
                        ></el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="warning" @click="onAnswerTypeHandle">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { $_getHomeworkList, $_delHomework, $_updateHomeworkType, $_updateHomeworkStatus } from './api';

export default {
    name: 'taskList',

    data() {
        return {
            workType: void 0,
            tableHeight: 500,
            answerType: {
                distributionMethod: 1,
                releaseTime: void 0,
            },
            selectedWork: void 0, // 选中的
            dialogVisible: false,
            showDelPopover: [],
            tableStatus: ['', '新建中', '待下发', '已下发', '待批改', '批改中', '待发布', '已发布', '已收取', '作废'],
            answerStatus: ['', '自行操作下发', '截止时间下发', '固定时间下发'],
            // 分页
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 50,
            },
            tableData: [],
            rules: {
                distributionMethod: [{ required: true, message: '请选择答案下发方式', trigger: 'change' }],
                releaseTime: [{ type: 'string', required: true, message: '请选择时间', trigger: 'change' }],
            },
        };
    },

    computed: {
        courseId: () => JSON.parse(localStorage.localTeacherData).courseId,
        teacherId: () => JSON.parse(localStorage.localTeacherData).teacherId,
    },

    methods: {
        navigateTo(id) {
            localStorage.localTeacherWorkId = id;
            const path = '/teacherPage/taskCenter/addTask?type=1';
            this.$router.push({
                path,
            });
        },

        // 批改列表
        goCheckCorrect() {
            this.$router.push({
                path: '/teacherPage/taskCenter/checkCorrect',
            });
        },

        goWorkStatistics(row) {
            localStorage.localTeacherWorkId = row.id;
            this.$router.push({
                path: '/teacherPage/taskCenter/workStatistics',
                query: {
                    homeworkId: row.id,
                    isUseAnswerCard: row.isUseAnswerCard,
                },
            });
        },

        // 批改发布
        correctPublish(item) {
            this.$confirm('确认要发布当前批改内容吗？', '批改发布提示', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                $_updateHomeworkStatus({ homeworkId: item.id }).then(() => {
                    this.$message.success('批改发布成功');
                });
            });
        },

        goCorrectCard(id, disabled, showCorrect) {
            localStorage.localTeacherWorkId = id;
            this.$router.push({
                path: '/teacherPage/taskCenter/correctCard?disabled=' + disabled + '&showCorrect=' + showCorrect,
            });
        },

        // 获取作业列表
        getHomeworkList() {
            const params = {
                page: this.page.currentPage,
                limit: this.page.pageSize,
            };

            if (this.workType === 1) {
                params.teacherId = JSON.parse(localStorage.userinfo).userId;
                params.workType = this.workType;
            } else {
                params.teacherId = this.teacherId;
                params.courseId = this.courseId;
            }
            $_getHomeworkList(params).then((res) => {
                this.tableData = res.result.records;
                this.page.total = Number(res.result.total);
            });
        },

        // 作业下发
        workIssued(row) {
            this.$confirm('确认要下发当前作业内容吗？', '作业下发', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.selectedWork = row;
                const params = {
                    homeworkId: row.id,
                    courseId: this.courseId,
                    flag: 1,
                };
                $_updateHomeworkType(params).then(() => {
                    this.$message.success('作业下发成功');
                    this.getHomeworkList();
                });
            });
        },

        // 答案下发方式-弹窗
        releaseAnswerType(row) {
            this.selectedWork = row;
            this.dialogVisible = true;
        },

        onAnswerTypeHandle() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const params = {
                        homeworkId: this.selectedWork.id,
                        courseId: this.courseId,
                        flag: 2,
                        distributionMethod: this.answerType.distributionMethod,
                        releaseTime: this.answerType.releaseTime,
                    };
                    $_updateHomeworkType(params).then(() => {
                        this.$message.success('修改答案下发方式成功');
                        this.dialogVisible = false;
                        this.getHomeworkList();
                        this.$refs['ruleForm'].resetFields();
                    });
                }
            });
        },

        // 作业作废
        workInvalid(row) {
            this.$confirm('确认要下发当前作业内容吗？', '作业作废', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.selectedWork = row;
                const params = {
                    homeworkId: row.id,
                    courseId: this.courseId,
                    flag: 3,
                };
                $_updateHomeworkType(params).then(() => {
                    this.$message.success('该作业已作废');
                    this.getHomeworkList();
                });
            });
        },

        // 通过id删除作业
        delHomework(homeworkId) {
            this.$confirm('确认要删除当前记录吗？', '删除提示', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                $_delHomework({ homeworkId }).then(() => {
                    this.getHomeworkList();
                    this.$message.success('删除作业成功');
                });
            });
        },
        // 表格高度
        setFormHeight() {
            this.$nextTick(() => {
                this.tableHeight = document.documentElement.clientHeight - 186 - (this.workType !== 1 ? 92 : 24);
            });
        },

        // 分页
        handleSizeChange(pageSize) {
            this.page.currentPage = 1;
            this.page.pageSize = pageSize;
            this.getHomeworkList();
        },

        handleCurrentChange(page) {
            this.page.currentPage = page;
            this.getHomeworkList();
        },
    },

    mounted() {
        this.setFormHeight();
        window.addEventListener('resize', () => {
            this.setFormHeight();
        });
        this.workType = Number(this.$route.query.workType);
        this.getHomeworkList();
    },
};
</script>

<style lang="scss">
.taskListContainer {
    .add-work-btn {
        margin-top: 4px;
        margin-bottom: 32px;
    }
    .el-form {
        height: 40px;
    }

    .el-table {
        th {
            color: #000;
            background-color: #e7ecf3;
        }
        td {
            color: #606266;
        }
        .el-table__fixed-right-patch {
            background-color: #e7ecf3;
        }
    }
    .answer-type-down {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .answer-type {
            .el-select {
                width: 210px;
            }
        }
    }

    .pagination {
        height: 56px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>
<style>
.el-button.confirm-warning {
    border: 1px solid #ed6d00 !important;
    background-color: #ed6d00 !important;
}
.el-button.confirm-warning:hover {
    border: 1px solid #d4721b;
    background-color: #d4721b;
}
</style>
