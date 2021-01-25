<template>
    <div class="answer-sheet">
        <el-row>
            <el-button type="warning" @click="openModal(void 0)">新建</el-button>
        </el-row>
        <div class="table" ref="table">
            <el-table
                :data="tableData"
                size="small"
                style="width: 100%"
                :height="tableHeight"
                :header-cell-style="{ background: 'rgba(245,247,250,0.9)', color: '#909399' }"
            >
                <el-table-column label="题型">
                    <template slot-scope="scope">
                        <span>{{ questionTypeList[Number(scope.row.questionType)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="questionNum" label="数量"></el-table-column>
                <el-table-column prop="totalScore" label="总分"></el-table-column>
                <el-table-column prop="correctionMethod" label="批改方式">
                    <template slot-scope="scope">
                        <span>{{ correctMethod[Number(scope.row.correctionMethod)] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button class="handle-btn" type="text" size="small" @click="openModal(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            v-if="scope.$index !== 0"
                            class="handle-btn"
                            type="text"
                            size="small"
                            @click="shiftUp(scope.$index)"
                            >上移</el-button
                        >
                        <el-button
                            v-if="scope.$index !== tableData.length - 1"
                            class="handle-btn"
                            type="text"
                            size="small"
                            @click="moveDown(scope.$index)"
                            >下移</el-button
                        >
                        <el-button class="del-btn" type="text" size="small" @click="deleteHandle(scope)"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="btns">
            <el-button class="plain-btn card-buttom" @click="beforePage">上一步</el-button>
            <el-button class="card-buttom" type="warning" @click="onSubmit">保存并下一步</el-button>
            <el-button class="plain-btn card-buttom">保存</el-button>
        </div>
        <!-- 新建 -->
        <el-dialog :title="(showFoot ? '查看' : '新建') + '答题卡'" :visible.sync="isShown" width="554px">
            <topic-form
                ref="topicForm"
                v-model="data"
                :key="data.questionType + data.questionTypeCounter"
                :formItems="formItems"
                :propDisabled="disabled"
                @verificationSuccess="verificationSuccess"
            />
            <p class="info">提示：带 “<span class="icon-all">*</span>” 为必选必填项</p>
            <span slot="footer" class="dialog-footer" v-if="!showFoot">
                <el-button @click="closeModal">取消</el-button>
                <el-button type="warning" @click="addsubmit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import topicForm from '@/components/topicForm';
import { $_addQuestions, $_getQuestionList, $_delQuestionById, $_questionMovedown, $_questionMoveup } from './api';

export default {
    components: {
        topicForm,
    },

    data() {
        const questions = {
            type: 'select',
            label: '题型',
            key: 'questionType',
            placeholder: '请选择题型',
            items: [
                { value: 1, label: '单选题' },
                { value: 2, label: '多选题' },
                { value: 3, label: '判断题' },
                { value: 4, label: '填空题' },
                { value: 5, label: '简答题' },
            ],
            rules: [{ required: true, message: '请选择题型', trigger: 'blur' }],
        };

        const subjectNum = {
            type: 'numberInput',
            label: '题目数量',
            key: 'questionNum',
            placeholder: '请输入题目数量',
            rules: [{ required: true, type: 'number', message: '请输入题目数量', trigger: 'blur' }],
        };

        const subjectScore = {
            type: 'numberInput',
            label: '单题分值',
            key: 'score',
            placeholder: '请输入单题分值',
        };

        const subjectMissing = {
            type: 'numberInput',
            label: '漏选得分',
            key: 'missedScore',
            placeholder: '请输入漏选得分',
        };

        const subjectOptionsNum = {
            type: 'iconNumberInput',
            label: '选项数量',
            key: 'optionsNum',
            rules: [{ required: true, type: 'number', message: '请输入选项数量', trigger: 'blur' }],
        };

        const optionsInterval = {
            type: 'input',
            label: '选项区间',
            key: 'optionScope',
            placeholder: '请输入选项区间',
            rules: [{ required: true, message: '请输入选项区间', trigger: 'blur' }],
        };

        const optionsCorrecting = {
            type: 'radio',
            label: '批改方式',
            key: 'correctionMethod',
            placeholder: '请输入选项区间',
            items: [
                { label: 1, text: '系统批改' },
                { label: 2, text: '老师批改' },
            ],
            rules: [{ required: true, message: '请选择批改方式', trigger: 'blur' }],
        };

        const optionsCorrecting2 = {
            type: 'radio',
            label: '批改方式',
            key: 'correctionMethod',
            placeholder: '请输入选项区间',
            items: [
                { label: 2, text: '老师批改' },
                { label: 3, text: '学生自行核对' },
            ],
            rules: [{ required: true, message: '请选择批改方式', trigger: 'blur' }],
        };

        return {
            questionTypeList: ['', '单选题', '多选题', '判断题', '填空题', '简答题'],
            correctMethod: ['', '系统批改', '老师批改', '学生自行核对'],
            tableHeight: 210,
            showFoot: true,
            isShown: false,
            disabled: false,
            tableData: [],
            data: {
                questionType: 1,
                questionNum: 4,
                optionsNum: 4,
                optionScope: 'A,B,C,D',
            },
            formItems: [],
            subjectClass1: [questions, subjectNum, subjectScore, subjectOptionsNum, optionsInterval, optionsCorrecting],
            subjectClass2: [
                questions,
                subjectNum,
                subjectScore,
                subjectMissing,
                subjectOptionsNum,
                optionsInterval,
                optionsCorrecting,
            ],
            subjectClass3: [questions, subjectNum, subjectScore, optionsCorrecting],
            subjectClass4: [questions, subjectNum, subjectScore, optionsCorrecting2],
            subjectClass5: [questions, subjectNum, subjectScore, optionsCorrecting2],
        };
    },

    computed: {
        homeworkId: () => localStorage.localTeacherWorkId,
    },

    watch: {
        'data.questionType'(num) {
            this.formItems = this['subjectClass' + num];
            if (this.data.id === undefined) {
                this.$set(this.data, 'correctionMethod', void 0);
            }
        },
        'data.optionsNum'() {
            const text = [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
            ]
                .slice(0, this.data.optionsNum)
                .join(',');
            this.$set(this.data, 'optionScope', text);
        },
    },

    methods: {
        openModal(rowData) {
            this.data = {
                questionType: 1,
                questionNum: 4,
                optionsNum: 4,
                optionScope: 'A,B,C,D',
            };
            this.showFoot = !!rowData;
            this.isShown = true;
            this.disabled = false;
            if (rowData) {
                this.data = rowData;
                this.disabled = true;
            }
        },

        // 表格高度
        setTableHeight() {
            this.$nextTick(() => {
                this.tableHeight = this.$refs.table.clientHeight - 24;
            });
        },

        onSubmit() {
            this.$emit('changeActive', 3);
        },

        beforePage() {
            this.$emit('changeActive', 1);
        },

        // 上移
        shiftUp(index) {
            const params = {
                homeworkId: this.homeworkId,
                currentQuestionGroupId: this.tableData[index].id,
                preQuestionGroupId: this.tableData[index - 1].id,
            };
            $_questionMoveup(params).then(() => {
                this.getQuestionList();
            });

            let [a, b] = [this.tableData[index - 1], this.tableData[index]];
            this.$set(this.tableData, index - 1, b);
            this.$set(this.tableData, index, a);
        },

        // 下移
        moveDown(index) {
            const params = {
                homeworkId: this.homeworkId,
                currentQuestionGroupId: this.tableData[index].id,
                nextQuestionGroupId: this.tableData[index + 1].id,
            };
            $_questionMovedown(params).then(() => {
                this.getQuestionList();
            });

            let [a, b] = [this.tableData[index], this.tableData[index + 1]];
            this.$set(this.tableData, index, b);
            this.$set(this.tableData, index + 1, a);
        },

        // 删除答题卡题型
        deleteHandle(scope) {
            this.$confirm('确认要删除当前记录吗？', '删除提示', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                const params = {
                    homeworkId: this.homeworkId,
                    questionGroupId: scope.row.id,
                };
                $_delQuestionById(params).then(() => {
                    this.$message.success('删除问题成功');
                    this.getQuestionList();
                });
            });
        },

        // 新增确定
        addsubmit() {
            this.$refs.topicForm.onSubmit();
        },

        // 新建问题验证成功
        verificationSuccess() {
            const params = {
                homeworkId: this.homeworkId,
                questionType: this.data.questionType,
                score: this.data.score,
                correctionMethod: this.data.correctionMethod,
                missedScore: this.data.missedScore,
                optionScope: this.data.optionScope,
                optionsNum: this.data.optionsNum,
                questionNum: this.data.questionNum,
            };
            if (this.data.questionType !== 1 && this.data.questionType !== 2) {
                params.optionScope = void 0;
            }
            $_addQuestions(params).then(() => {
                this.getQuestionList();
                this.closeModal();
            });
        },

        // 获取问题列表
        getQuestionList() {
            const params = {
                homeworkId: this.homeworkId,
            };
            $_getQuestionList(params).then((res) => {
                this.tableData = res.result;
            });
        },

        closeModal() {
            this.isShown = false;
        },
    },

    mounted() {
        this.getQuestionList();
        this.formItems = this.subjectClass1;

        this.setTableHeight();
        window.addEventListener('resize', () => {
            this.setTableHeight();
        });
    },
};
</script>
<style lang="scss" scoped>
.answer-sheet {
    height: 100%;
    display: flex;
    flex-direction: column;
    .btns {
        display: flex;
        justify-content: space-between !important;
    }
    .del-btn {
        color: #ff4542;
        margin-left: 10px;
    }
    .table {
        flex: 1;
        padding: 12px 0;
        overflow: hidden;
    }
    .plain-btn {
        color: #ed6d00;
        border: 1px solid #ed6d00;
    }
    .handle-btn {
        color: #ed6d00;
    }
    .info {
        font-size: 14px;
        color: #b1b9bf;
        .icon-all {
            color: #ed6d00;
        }
    }
    .card-buttom {
        padding-left: 30px;
        padding-right: 30px;
    }
}
</style>
