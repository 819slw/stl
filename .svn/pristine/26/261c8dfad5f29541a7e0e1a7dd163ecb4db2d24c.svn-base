<template>
    <div class="homeWork">
        <div class="heard">
            <div class="heard-left">
                <el-tabs v-model="activeTabName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item, index) in title" :key="index" :label="item.name" :name="item.id">{{
                        item.name
                    }}</el-tab-pane>
                </el-tabs>
            </div>
            <div class="heard-right">
                <el-select v-model="value" placeholder="请选择" @change="selectValue" style="width:224px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="work-table">
            <el-table :data="tableData" stripe style="width: 100%;">
                <el-table-column prop="workName" label="作业名称" width="180"></el-table-column>
                <el-table-column prop="subjectName" label="学科" width="180"></el-table-column>
                <el-table-column prop="chapterName" label="章节名称" width="180"></el-table-column>
                <el-table-column label="答案下发方式" width="180">
                    <template slot-scope="scope">
                        <p>{{ answerStatus[scope.row.answerDistributionMethod] }}</p>
                        <p v-if="scope.row.answerDistributionMethod === 3">{{ scope.row.answerReleaseTime }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="closeTime" label="答题截止时间"></el-table-column>
                <el-table-column prop="stuHomeworkStatus" label="状态">
                    <template slot-scope="scope">
                        <p>{{ tableStatus[scope.row.stuHomeworkStatus] }}</p>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.stuHomeworkStatus == 0 || scope.row.stuHomeworkStatus == 1"
                            type="text"
                            size="small"
                            style="color: #FF4542"
                            @click="navTo(scope)"
                            >作答</el-button
                        >
                        <el-button type="text" size="small" style="color: #FF4542" @click="navTo(scope)"
                            >查看</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="paging">
            <el-pagination
                background
                layout="prev, pager, next"
                hide-on-single-page="true"
                @current-change="handleCurrentChange"
                :total="total"
            >
            </el-pagination>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
import { queryHomeworkListByStudentId, validateTime, getAllByUserId, list } from '@/api/student';
export default {
    name: 'workList',
    watch: {
        handleClick: function(n) {
            console.log(n);
        },
    },
    data() {
        return {
            activeTabName: '1',
            tableStatus: ['待作答', '作答中', '', '已提交', '已批改', '已发布'], // 0待作答 1作答中 3已提交 4已批改 5已发布
            answerStatus: ['', '自行操作下发', '截止时间下发', '固定时间下发'],
            options: [
                {
                    value: '',
                    label: '全部学科',
                },
            ],
            value: '',
            active: 1,
            title: [
                {
                    id: '1',
                    name: '全部作业',
                },
                {
                    id: '0',
                    name: '待作答',
                },
                {
                    id: '3',
                    name: '已作答',
                },
            ],
            tableData: [],
            stuId: '',
            total: '',
        };
    },
    created() {
        this.stuId = JSON.parse(localStorage.userinfo).userId;
    },
    mounted() {
        // 查询作业列表
        queryHomeworkListByStudentId({ studentId: this.stuId })
            .then((res) => {
                this.tableData = res.result.records;
                this.total = Number(res.result.pages) * 10;
            })
            .catch((error) => {
                console.log(error);
            });
        // 根据userId获取用户全部信息
        getAllByUserId({ userId: this.stuId })
            .then((res) => {
                // 学科查询列表
                list({ levelId: res.result.levelId })
                    .then((resList) => {
                        resList.result.map((el) => {
                            this.$set(el, 'value', el.id);
                            this.$set(el, 'label', el.name);
                        });
                        this.options = this.options.concat(resList.result);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    },
    methods: {
        // 分页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            queryHomeworkListByStudentId({ studentId: this.stuId, page: `${val}`, limit: '10' })
                .then((res) => {
                    this.tableData = res.result.records;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // 学科筛选
        selectValue(item) {
            queryHomeworkListByStudentId({ studentId: this.stuId, subjectId: item })
                .then((res) => {
                    this.tableData = res.result.records;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // 左侧作业筛选
        handleClick(item) {
            console.log(item);
            if (item.name === '1') {
                queryHomeworkListByStudentId({ studentId: this.stuId })
                    .then((res) => {
                        this.tableData = res.result.records;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                queryHomeworkListByStudentId({ studentId: this.stuId, type: String(item.name) })
                    .then((res) => {
                        this.tableData = res.result.records;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        condition(n) {
            this.active = n;
        },
        navTo(n) {
            let stutas = n.row.stuHomeworkStatus;
            if (stutas === 3 || stutas === 4 || stutas === 5) {
                // 查看
                this.$router.push({
                    path: `/studentPage/homeWork?homeworkId=${n.row.homeworkId}&stuId=${this.stuId}`,
                    // path: `/teacherPage/taskCenter/taskList`
                });
            } else {
                // 作答
                if (n.row.isUseAnswerCard === 1) {
                    validateTime({ homeworkId: n.row.homeworkId, studentId: this.stuId, type: '1' })
                        .then(() => {
                            this.$router.push({
                                path: `/studentPage/answerSheet?homeworkId=${n.row.homeworkId}&stuId=${
                                    this.stuId
                                }&closeTime=${new Date(n.row.closeTime).getTime()}`,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    validateTime({ homeworkId: n.row.homeworkId, studentId: this.stuId, type: '1' })
                        .then(() => {
                            this.$router.push({
                                path: `/studentPage/nonAnswer?homeworkId=${n.row.homeworkId}&stuId=${
                                    this.stuId
                                }&closeTime=${new Date(n.row.closeTime).getTime()}`,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }
        },
    },
};
</script>

<style lang="scss">
.homeWork {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .work-table {
        flex: 1;
        width: 100%;
        height: calc(100% - 78px);
        overflow: hidden;
        overflow-y: auto;
        margin-top: 20px;
    }
    .paging {
        padding-top: 20px;
        display: flex;
        justify-content: center;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ed6d00;
        color: #fff;
    }
}
.heard {
    height: 60px;
    line-height: 60px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 0px 0px rgba(177, 185, 191, 0.5);
    // border-bottom: 1px solid #B1B9BF;
    .heard-left {
        cursor: pointer;
        display: flex;
        width: 330px;
        text-align: center;

        float: left;
        div {
            // flex: 1;
        }
    }
    .heard-right {
        float: right;
    }
}
// .active {
//   border-bottom: 4px solid #fdb850;
// }
.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding: 0 20px !important;
}
.el-tabs__item {
    color: #697886 !important;
}
.el-tabs__item.is-active {
    color: #092238 !important;
}
.el-tabs__active-bar {
    background-color: #fdb850 !important;
}
.el-tabs__nav-wrap::after {
    background-color: #fff !important;
}
</style>
