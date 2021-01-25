<template>
    <div class="addTaskContainer">
        <div class="stepWrapper">
            <el-steps class="steps" :active="stepAvtive" simple finish-status="success" process-status="wait">
                <el-step :key="index" v-for="(item, index) in stepList" :title="item.name"> </el-step>
            </el-steps>
        </div>
        <div class="uploadGrid">
            <div class="upPdfWrapper">
                <div class="noPdf" v-if="!isShowPdf">
                    <el-upload
                        ref="pdfUpload"
                        class="upload-demo"
                        :before-upload="onBeforeUpload"
                        :show-file-list="false"
                        accept=".pdf, .PDF"
                    >
                        <el-button type="warning">上传作业</el-button>
                    </el-upload>
                    <p class="text">
                        请选择 .PDF格式的文件
                        <img src="https://file.znclass.com/1594720127460" />
                    </p>
                </div>
                <PdfCom v-else :fileUrl="fileUrl"></PdfCom>
            </div>
            <div class="edit-home-work">
                <keep-alive>
                    <uploadTaskRule
                        v-model="workData"
                        v-if="Number(stepAvtive) === 1 || Number(stepAvtive) === 0"
                        :isShowPdf="isShowPdf"
                        :editWorkData="editWorkData"
                        @changeActive="uploadWork"
                        @againUpload="againUpload"
                    ></uploadTaskRule>
                </keep-alive>
                <answerSheet v-if="Number(stepAvtive) === 2" @changeActive="changeActive" />
                <setAnswer v-if="Number(stepAvtive) === 3" :noHascard="noHascard" @changeActive="changeActive" />
            </div>
        </div>
    </div>
</template>

<script>
import PdfCom from '_c/pdfCom';
import uploadTaskRule from './uploadTaskRule';
import answerSheet from './answerSheet';
import setAnswer from './setAnswer';
import { uploadFile } from '@/mixins/uploadFile.js';
import { $_addHomework, $_queryProblemById } from './api';

export default {
    name: 'addTask',

    components: {
        PdfCom,
        uploadTaskRule,
        answerSheet,
        setAnswer,
    },

    mixins: [uploadFile],

    data() {
        return {
            // 上传作业
            workData: {},
            // 编辑时通过id查询的作业信息
            editWorkData: null,
            // 上传的paf
            fileUrl: void 0,
            isShowPdf: false,
            stepAvtive: 1,
            noHascard: false,
            stepList: [
                {
                    name: '上传作业',
                },
                {
                    name: '设置答题卡',
                },
                {
                    name: '设置答案',
                },
            ],
        };
    },

    computed: {
        homeworkId: () => localStorage.localTeacherWorkId,
        courseId: () => JSON.parse(localStorage.localTeacherData).courseId,
        teacherId: () => JSON.parse(localStorage.localTeacherData).teacherId,
        chapterId: () => JSON.parse(localStorage.localTeacherData).chapterId, // 章节id
        chapterName: () => JSON.parse(localStorage.localTeacherData).chapterName, // 课程名称
        subjectId: () => JSON.parse(localStorage.localTeacherData).subjectId, // 学科id
        subjectName: () => JSON.parse(localStorage.localTeacherData).subjectName, // 学科名称
    },

    watch: {
        'workData.isUseAnswerCard'(num) {
            if (num === 1) {
                this.stepList = [
                    {
                        name: '上传作业',
                    },
                    {
                        name: '设置答题卡',
                    },
                    {
                        name: '设置答案',
                    },
                ];
            } else {
                this.stepList = [
                    {
                        name: '上传作业',
                    },
                    {
                        name: '设置答案',
                    },
                ];
            }
        },
        // isShowPdf: function(n) {
        //     if (n) {
        //         this.stepAvtive = 1;
        //     }
        // },
    },

    methods: {
        addParams(val) {
            this.$router.replace({
                query: {
                    type: val,
                },
            });
        },

        changeActive(type) {
            this.stepAvtive = Number(type);
            this.addParams(type);
            if (this.workData.isUseAnswerCard === 0) {
                this.noHascard = true;
            }
        },

        uploadWork(type) {
            if (!this.fileUrl) {
                this.$message.error('请上传PDF格式的作业');
                return;
            }
            this.workData.homeworkId = this.editWorkData ? this.editWorkData.id : void 0;
            this.workData.homeworkUrl = this.fileUrl;
            this.workData.courseId = this.courseId;
            this.workData.teacherId = this.teacherId;
            this.workData.chapterId = this.chapterId; // 章节id
            this.workData.chapterName = this.chapterName; // 课程名称
            this.workData.subjectId = this.subjectId; // 学科id
            this.workData.subjectName = this.subjectName; // 学科名称
            if (!this.workData.score) this.workData.score = 0;
            if (!this.workData.missedScore) this.workData.missedScore = 0;

            $_addHomework(this.workData).then((res) => {
                let id = this.editWorkData ? this.editWorkData.id : res.result;
                localStorage.localTeacherWorkId = id;
                if (type === -1) {
                    window.history.back(-1);
                }
                this.changeActive(type);
            });
        },

        onBeforeUpload(file) {
            if (file.size > 80 * 1024 * 1024) {
                this.$message.error('上传文件大小不得大于80M');
                return;
            }
            this.uploadqiniu(file).then((res) => {
                this.fileUrl = res;
                this.isShowPdf = true;
            });
            return false;
        },

        // pdf再次上传
        againUpload() {
            this.isShowPdf = false;
            this.fileUrl = void 0;
        },

        // 通过id查询作业信息
        queryProblemById(homeworkId) {
            $_queryProblemById({
                homeworkId,
            }).then((res) => {
                this.editWorkData = res.result;
                this.isShowPdf = true;
                this.fileUrl = res.result.workUrl;
            });
        },
    },

    mounted() {
        this.stepAvtive = this.$route.query.type;
        if (this.homeworkId !== '') {
            this.queryProblemById(this.homeworkId);
        }
    },
};
</script>

<style lang="scss">
.addTaskContainer {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    .uploadGrid {
        height: calc(100% - 46px);
        max-height: calc(100% - 46px);
        display: flex;
        flex: 1;
        justify-content: center;
        padding: 16px 0 16px 16px;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
        .formWrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .bottomGrid {
                display: flex;
                justify-content: center;
            }
        }
        .upPdfWrapper {
            height: 100%;
            max-height: 100%;
            overflow: auto;
            width: 720px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #979797;
            flex: 1;
            margin-right: 24px;
            .noPdf {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                p {
                    margin-top: 15px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                }
            }
        }
        .edit-home-work {
            width: 466px;
            height: 100%;
            padding: 0 16px;
        }
        .text {
            img {
                width: 16px;
                height: 16px;
                vertical-align: middle;
            }
        }
    }
    .stepWrapper {
        margin-bottom: 20px;
    }
}
</style>
<style scoped>
.stepWrapper >>> .el-step__arrow {
    width: 50%;
}
</style>
