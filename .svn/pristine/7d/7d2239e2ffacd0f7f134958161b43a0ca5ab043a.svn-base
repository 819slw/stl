<template>
    <div class="answer-container">
        <div v-if="!noHascard" class="setAnswerContainer">
            <p class="setTitle">答题卡</p>
            <!-- 题型遍历 -->
            <div class="subjectList" v-for="(item, index) in subjectList" :key="index">
                <div class="topInfo">
                    <div class="subTitle">
                        <p class="title">{{ item.name }}</p>
                        <div class="chooseUploadType" v-if="item.uploadType || item.uploadType == 0">
                            <el-radio-group v-model="item.uploadType">
                                <el-radio
                                    v-for="(typeItem, typeIndex) in uploadTypeList"
                                    :key="typeIndex"
                                    :label="Number(typeItem.val)"
                                    @change="radioChang(item, typeIndex, index)"
                                    >{{ typeItem.name }}</el-radio
                                >
                            </el-radio-group>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="📱 手机扫描二维码 拍照上传答题"
                                placement="top"
                            >
                                <div @click="scanCode(item, index)">
                                    <img src="@/assets/scanningQrcode.png" />
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <ul class="subInfo">
                        <div class="codeBox" v-if="!item.showGrid">
                            <p class="sortIndex">{{ item.list[0].sort }}~{{ item.list[item.list.length - 1].sort }}</p>
                            <div class="codeImg">
                                <el-image style="width: 150px; height: 150px" :src="item.url"> </el-image>
                                <p class="codeImgP">手机扫码二维码，拍照上传答案</p>
                            </div>
                        </div>
                        <!-- 题型中的某个题的遍历 -->
                        <li :key="i" v-for="(el, i) in item.list" class="subGrid" v-else>
                            <div class="answerItem">
                                <p class="sortIndex" v-if="item.showGrid">{{ el.sort }}.</p>
                                <!-- 单选 / 多选的选项遍历 -->
                                <div class="subTypeGrid" v-if="Number(item.type) === 1 || Number(item.type) === 2">
                                    <el-button
                                        @click="setOptionActive(item.type, index, i, optionIndex, optionRes)"
                                        class="optionBtn"
                                        :key="optionIndex"
                                        v-for="(optionRes, optionIndex) in el.optionList"
                                        :type="optionRes.isActive ? 'warning' : ''"
                                        size="small"
                                        round
                                    >
                                        {{ optionRes.name }}
                                    </el-button>
                                </div>

                                <!-- 判断题选项遍历 -->
                                <div class="subTypeGrid" v-else-if="Number(item.type) === 3">
                                    <el-button
                                        @click="setJudgeActive(index, i, optionIndex)"
                                        class="optionBtn"
                                        :key="optionIndex"
                                        v-for="(optionRes, optionIndex) in el.optionList"
                                        :type="optionRes.isActive ? 'warning' : ''"
                                        size="small"
                                        round
                                    >
                                        {{ optionRes.name }}
                                    </el-button>
                                </div>
                                <!-- 主观题UI -->
                                <div class="subTypeGrid" v-else>
                                    <!-- <div class="imgList" v-if="item.showGrid"> -->
                                    <div class="imgList">
                                        <upload-img
                                            :key="menukey"
                                            :imageUrl="el.answerObj"
                                            :single="false"
                                            refDom="clearErrorone"
                                            word="communityLogo"
                                            :subInfo.sync="el"
                                            :disabled="isUpimg"
                                            @confrimSubmit="confrimSubmit"
                                        ></upload-img>
                                    </div>
                                    <!-- <el-image v-else 
                                        style="width: 100px; height: 100px"
                                        :src="item.url" 
                                    >
                                    </el-image> -->
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="noHascard" class="upPdfWrapper upload-noHascard">
            <div class="noPdf" v-if="!isCardShowPdf">
                <el-upload
                    ref="pdfUpload"
                    class="upload-demo"
                    :before-upload="onBeforeUploadCard"
                    :show-file-list="false"
                    accept=".pdf, .PDF"
                >
                    <el-button type="warning">上传答案</el-button>
                </el-upload>
                <p class="text">
                    请选择 .PDF格式的文件
                    <img src="https://file.znclass.com/1594720127460" />
                </p>
            </div>
            <PdfCom class="hasPaf" v-else :fileUrl="answerFileUrl"></PdfCom>
        </div>
        <div class="select-type">
            <el-form :model="answerType" :rules="rules" ref="ruleForm">
                <div class="answer-type-down" :class="{ 'answer-type-down3': answerType.distributionMethod === 3 }">
                    <el-form-item label="答案下发方式" label-width="100px" prop="distributionMethod">
                        <el-select
                            class="select"
                            v-model="answerType.distributionMethod"
                            placeholder="请选择答案下发方式"
                        >
                            <el-option
                                v-for="(item, index) in answerMethod"
                                :key="index"
                                :label="item"
                                :value="index + 1"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="answerType.distributionMethod === 3" label-width="16px" prop="releaseTime">
                        <el-date-picker
                            class="date"
                            type="datetime"
                            v-model="answerType.releaseTime"
                            placeholder="请选择时间"
                            format="yyyy/MM/dd HH:mm"
                            value-format="yyyy/MM/dd HH:mm"
                        ></el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="bottomGrid">
            <!-- <el-row class="bottomRow"> -->
            <el-button class="plain-btn card-buttom" @click="beforePage">上一步</el-button>
            <el-button class="card-buttom" type="warning" @click="onSubmitComplete">完成</el-button>
            <el-button class="plain-btn card-buttom" @click="onSubmit">保存</el-button>
            <!-- </el-row> -->
        </div>
    </div>
</template>

<script>
import uploadImg from '@/components/uploadImg';
import {
    $_saveorupdateanswer,
    changeUploadType,
    queryQuestion,
    $_getStandardAnswer,
    $_updateHomeworkStatus,
    teacherQrcode,
    $_updateHomeworkType,
    $_insertSubjectiveAnswer,
    uploadAnswerByQrCode,
} from './api';

import PdfCom from '_c/pdfCom';
import { uploadFile } from '@/mixins/uploadFile.js';
import { socketMinxin } from '@/mixins/socket';

export default {
    components: {
        uploadImg,
        PdfCom,
    },
    watch: {
        socketData: function(data) {
            // 过来的数据直接渲染就行
            this.subjectList[this.wsIndex].showGrid = true;
            if (Object.keys(data).indexOf('flag') > -1) {
                // 题型切换的回调
                this.subjectList[this.wsIndex].uploadType = Number(data.flag);
                this.radioChang(this.subjectList[this.wsIndex], Number(data.flag), this.wsIndex, true);
            } else {
                // 题目信息变更的回调
                let index = 0;
                if (data.questionIds.indexOf(',') == -1) {
                    // 整体不用再查找index
                    index = this.subjectList[this.wsIndex].list.findIndex(
                        (v) => Number(v.id) === Number(data.questionIds)
                    );
                }
                this.subjectList[this.wsIndex].list[index].answerObj = data.message;
            }
        },
        uploadTypeList: function() {},
    },

    mixins: [uploadFile, socketMinxin],

    props: {
        noHascard: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            wsIndex: -1,
            answerFileUrl: void 0,
            isCardShowPdf: false,
            answerType: {
                distributionMethod: 1,
                releaseTime: void 0,
            },
            activeColor: '#ED6D00',
            subjectList: [],
            answerMethod: ['自行操作下发', '截止时间下发', '固定时间下发'],
            standardAnswer: [],
            siginSuboptions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            homeworkId: '',
            uploadTypeList: [
                {
                    name: '分题上传',
                    val: 0,
                },
                {
                    name: '整体上传',
                    val: 1,
                },
            ],
            judgeSubList: [
                {
                    name: '正确',
                    val: 1,
                    isActive: false,
                },
                {
                    name: '错误',
                    val: 0,
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
            resultArr: [],
            stuId: '',
            newSubjectList: [],
            userInfo: {},
        };
    },

    created() {
        this.stuId = this.$route.query.stuId;
        this.userInfo = JSON.parse(localStorage.userinfo);
        this.homeworkId = localStorage.localTeacherWorkId;
        this.initData();
    },
    methods: {
        // 分题整体
        async radioChang(item, typeIndex, index, flag) {
            let userinfo = JSON.parse(localStorage.userinfo);
            if (!flag) {
                await changeUploadType({
                    flag: typeIndex,
                    homeworkId: this.homeworkId,
                    questionType: item.type,
                    userId: userinfo.userId,
                });
            }

            this.subjectList[index].showGrid = true;
            item.list.map((el) => {
                this.$set(el, 'showGrid', true);
            });
            if (typeIndex === 1) {
                // 合并更改数据格式
                let newList = [{}];
                let sorts = item.list.map((v) => v.sort).join(',');
                let ids = item.list.map((v) => v.id).join(',');

                this.$set(newList[0], 'sort', sorts);
                this.$set(newList[0], 'ids', ids);
                this.$set(newList[0], 'type', item.type);
                this.$set(newList[0], 'showGrid', item.list[0].showGrid);
                this.$set(newList[0], 'answerObj', '');
                item.list = newList;
            } else {
                let arr = item.list[0].sort.split(',');
                let idsArr = item.list[0].ids.split(',');
                arr = arr.filter((v) => v != '');
                let arrInfo = item.list[0];
                (arr || []).forEach((v, i) => {
                    arrInfo.sort = v;
                    arrInfo.id = idsArr[i];
                    arrInfo.answer = '';
                    arrInfo.answerObj = '';
                    item.list[i] = JSON.parse(JSON.stringify(arrInfo));
                });
            }
        },
        // 扫码上传
        scanCode(item, index) {
            console.log(item);
            if (item.showGrid === true) {
                this.$set(item, 'showGrid', false);
                item.list.map((el) => {
                    this.$set(el, 'showGrid', false);
                });
                let userinfo = JSON.parse(localStorage.userinfo);
                teacherQrcode({
                    flag: item.uploadType,
                    homeworkId: this.homeworkId,
                    questionType: item.type,
                    questionTypeCounter: item.questionTypeCounter,
                    token: userinfo.token,
                    userId: userinfo.userId,
                }).then((res) => {
                    this.$set(item, 'url', res.result[0].url);
                });
                this.wsIndex = index; // 记录是数组的index
                this.initSocket(`/AnswerUrlWebsocket/${this.userInfo.userId}/${this.homeworkId}/0`);
            } else {
                // 隐藏时 销毁ws链接
                // if(this.wbSocket) this.wbSocket.destroy()
                this.$set(item, 'showGrid', true);
                item.list.map((el) => {
                    this.$set(el, 'showGrid', true);
                });
            }
        },
        onBeforeUploadCard(file) {
            this.uploadqiniu(file).then((res) => {
                this.answerFileUrl = res;
                this.isCardShowPdf = true;
                this.insertNoHasAnswerCard(res);
            });
            return false;
        },

        // 不使用答题卡保存pdf
        insertNoHasAnswerCard(res) {
            const params = {
                homeworkId: localStorage.localTeacherWorkId,
                answerUrl: res,
            };
            $_insertSubjectiveAnswer(params);
        },

        confrimSubmit(obj) {
            uploadAnswerByQrCode({
                homeworkId: this.homeworkId,
                answerUrl: obj.answerObj,
                questionType: obj.type,
                questionIds: obj.id || obj.ids,
                userId: this.userInfo.userId,
            });
        },
        async initData() {
            // 获取作业内容列表
            queryQuestion({ homeworkId: this.homeworkId }).then((res) => {
                this.subjectList = [];
                let obj = res.result;
                obj.map((el) => {
                    this.$set(el, 'name', this.typeArr.find((v) => v.type === el.qustionType).name);
                    this.$set(el, 'type', el.qustionType);
                    this.$set(el, 'questionTypeCounter', el.questionTypeCounter);
                    this.$set(el, 'group', 'group' + el.qustionType + 'item' + el.questionTypeCounter);
                    this.$set(el, 'showGrid', true);
                });
                this.resultArr = obj;

                this.resultArr.forEach((res) => {
                    // 先看存不存在这类题型
                    let isLive = this.subjectList.findIndex(
                        (v) => v.group === 'group' + res.qustionType + 'item' + res.questionTypeCounter
                    );

                    if (Number(res.type) === 1) {
                        // res = this.setOption(res)
                    }

                    if (isLive > -1) {
                        // 存在就直接push
                        this.subjectList[isLive].list.push(res);
                    } else {
                        // 不存在就先创建
                        this.subjectList.push({
                            type: res.type,
                            questionTypeCounter: res.questionTypeCounter,
                            group: 'group' + res.type + 'item' + res.questionTypeCounter,
                            name: res.name,
                            list: [res],
                            showGrid: true,
                        });
                        isLive = this.subjectList.length - 1;
                    }

                    // 组装 + 添加访问器属性
                    if (Number(res.type) === 1 || Number(res.type) === 2) {
                        this.setChooseSubAccessorAttribute(isLive, res);
                    } else if (Number(res.type) === 3) {
                        this.setJudgeSubAccessorAttribute(isLive, res);
                    } else {
                        // 其余类型都必须配置一个开关 代表是否是整体上传还是分体上传，默认是分体上传
                        this.setSubjectiveAccessorAttribute(isLive, res);
                    }
                });
                this.setAnswer();
            });
        },
        setAnswer() {
            // 获取答案
            $_getStandardAnswer({ homeworkId: this.homeworkId }).then((resObj) => {
                if (this.noHascard) {
                    if (resObj.result.length > 0) {
                        this.isCardShowPdf = true;
                        this.answerFileUrl = resObj.result[0].answer;
                    }
                    return;
                }
                let rescode = resObj.result || [];
                this.subjectList.map((v, index) => {
                    let flag = true;
                    for (let i = 0; i < (v.list || []).length; i++) {
                        let el = v.list[i];
                        let obj = rescode.find((item) => String(item.sorts).indexOf(String(el.sort)) > -1);
                        if (obj && obj.sorts.indexOf(',') > -1) {
                            this.subjectList[index].uploadType = 1;
                            this.subjectList[index].list[0].sort = obj.sorts;
                            this.subjectList[index].list[0].answer = obj.answer;
                            this.subjectList[index].list.splice(1, this.subjectList[index].list.length - 1);
                            flag = false;
                        }

                        if (obj) {
                            this.$set(this.subjectList[index].list[i], 'answerObj', obj.answer);
                            if (el.qustionType === 1) {
                                this.setOptionActive(
                                    el.qustionType,
                                    index,
                                    i,
                                    this.siginSuboptions.findIndex((v) => obj.answer === v)
                                );
                            } else if (el.qustionType === 2) {
                                let arr = obj.answer === '' ? [] : obj.answer.split(',');
                                arr.forEach((op) => {
                                    if (op !== '') {
                                        this.setOptionActive(
                                            el.qustionType,
                                            index,
                                            i,
                                            this.siginSuboptions.findIndex((v) => op === v)
                                        );
                                    }
                                });
                            } else if (el.qustionType === 3) {
                                this.setJudgeActive(index, i, obj.answer, true);
                            } else if (el.qustionType === 4 || el.qustionType === 5) {
                                this.$set(this.subjectList[index].list[i], 'answerObj', obj.answer);
                            }
                        } else {
                            this.$set(this.subjectList[index].list[i], 'answerObj', '');
                        }

                        if (!flag) {
                            return;
                        }
                    }
                });
            });
        },
        // 设置主观题目的访问器属性
        setSubjectiveAccessorAttribute(totalIndex) {
            // 添加是否展示单选框组（选择是分题还是整体上传）的属性
            this.$set(this.subjectList[totalIndex], 'uploadType', 0);
            // 添加上传图片的属性（图片最多三张，暂定用String，转换为数组展示）
            this.$set(this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1], 'answerObj', '');
        },
        // 设置判断题目的访问器属性
        setJudgeSubAccessorAttribute(totalIndex) {
            this.$set(
                this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1],
                'optionList',
                []
            );
            this.judgeSubList.forEach((el, index) => {
                this.$set(
                    this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1].optionList,
                    index,
                    { ...el }
                );
            });
        },
        // 设置选择题目的访问器属性
        setChooseSubAccessorAttribute(totalIndex, res) {
            let arr = res.optionScope.split(',');
            this.$set(
                this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1],
                'optionList',
                []
            );
            (arr || []).forEach((el, index) => {
                this.$set(
                    this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1].optionList,
                    index,
                    {
                        name: el,
                        isActive: false,
                    }
                );
            });
        },
        setJudgeActive(index, i, optionIndex, flag) {
            this.subjectList[index].list[i].optionList.map((v) => {
                v.isActive = false;
            });
            this.subjectList[index].list[i].optionList[optionIndex].isActive = true;
            if (!flag) {
                setTimeout(() => {
                    $_saveorupdateanswer({
                        homeworkId: this.homeworkId,
                        sorts: String(this.subjectList[index].list[i].sort),
                        type: String(this.subjectList[index].list[i].type),
                        answer: [1, 0][optionIndex],
                    });
                }, 1000);
            }
        },
        setOptionActive(type, index, i, optionIndex, optionRes) {
            if (Number(type) === 1) {
                this.subjectList[index].list[i].optionList.map((v) => {
                    v.isActive = false;
                });
                if (optionRes) {
                    setTimeout(() => {
                        $_saveorupdateanswer({
                            homeworkId: this.homeworkId,
                            sorts: String(this.subjectList[index].list[i].sort),
                            answer: optionRes.name,
                            type: this.subjectList[index].list[i].type,
                        });
                    }, 1000);
                }
            } else {
                let flag = this.subjectList[index].list[i].optionList[optionIndex].isActive;
                if (optionRes) {
                    //
                    let arr =
                        this.subjectList[index].list[i].answerObj === undefined
                            ? []
                            : this.subjectList[index].list[i].answerObj.split(',');
                    let el = arr.findIndex((v) => v === this.subjectList[index].list[i].optionList[optionIndex].name);
                    if (el > -1) {
                        arr.splice(el, 1);
                    } else {
                        arr.push(this.subjectList[index].list[i].optionList[optionIndex].name);
                    }
                    arr = [...new Set(arr)];
                    this.$set(this.subjectList[index].list[i], 'answerObj', arr.join(','));
                    setTimeout(() => {
                        $_saveorupdateanswer({
                            homeworkId: this.homeworkId,
                            sorts: String(this.subjectList[index].list[i].sort),
                            answer: this.subjectList[index].list[i].answerObj,
                            type: String(this.subjectList[index].list[i].type),
                        });
                    }, 1000);
                }

                if (flag) {
                    this.subjectList[index].list[i].optionList[optionIndex].isActive = false;
                    return;
                }
            }
            this.subjectList[index].list[i].optionList[optionIndex].isActive = true;
        },

        beforePage() {
            let page = 2;
            if (this.noHascard) {
                page = 1;
            }
            this.$emit('changeActive', page);
        },

        onAnswerTypeHandle() {
            const params = {
                homeworkId: localStorage.localTeacherWorkId,
                courseId: JSON.parse(localStorage.localTeacherData).courseId,
                flag: 2,
                distributionMethod: this.answerType.distributionMethod,
                releaseTime: this.answerType.releaseTime,
            };
            $_updateHomeworkType(params);
        },

        onSubmit() {
            this.$router.push({
                path: '/teacherPage/taskCenter/taskList',
            });
        },

        // 完成
        onSubmitComplete() {
            this.$confirm(
                '点击“完成”即为作业新建完成，随时可下发；若为临时保存，请点击“保存”按钮；确认要完成吗？',
                '完成提示',
                {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'confirm-warning',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.onAnswerTypeHandle();
                $_updateHomeworkStatus({ homeworkId: this.homeworkId })
                    .then(() => {
                        this.$message.success('提交成功');
                        this.onSubmit();
                    })
                    .catch(() => {
                        this.initData();
                    });
            });
        },
    },
};
</script>

<style lang="scss">
.answer-container {
    width: 426px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .bottomGrid {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        button {
            width: 122px;
            height: 40px;
        }
        .el-button.plain-btn,
        .el-button.plain-btn:focus,
        .el-button.plain-btn:hover {
            color: #ed6d00;
            border: 1px solid #ed6d00;
        }
    }
    .select-type {
        height: 56px;
        padding-top: 16px;
    }
    .card-buttom {
        padding-left: 30px;
        padding-right: 30px;
    }
}

.answer-type-down {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.answer-type-down .el-select {
    width: 326px;
}

.answer-type-down.answer-type-down3 .el-select {
    width: 130px;
}

.answer-type-down.answer-type-down3 > div:first-child {
    width: 245px;
}

.answer-type-down.answer-type-down3 .date {
    width: 180px;
}

.setAnswerContainer {
    flex: 1;
    background: #fff;
    padding: 16px;
    flex: 1;
    overflow: auto;
    border: 1px solid #d8d8d8;
    box-sizing: border-box;
    .setTitle {
        font-size: 18px;
        font-weight: 600;
        color: rgba(9, 34, 56, 1);
    }
    .subInfo {
        background: #fff;
        padding-top: 16px;
        .codeBox {
            display: flex;
        }
        .codeImg {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        .codeImgP {
            font: 14px/40px simhei;
            color: #717376;
        }
        .subGrid {
            list-style: none;
            padding-bottom: 16px;
            .sortIndex {
                width: 20px;
                font: 14px/34px simhei;
                font-weight: 500;
                color: rgba(9, 34, 56, 1);
            }
            .answerItem {
                display: flex;
                padding-left: 20px;
                align-items: center;
                .subTypeGrid {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .optionBtn {
                    margin: 5px 0 5px 20px;
                    width: 48px;
                    height: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 0;
                }
            }
        }
    }
    .subTitle {
        font-size: 16px;
        font-weight: 500;
        color: rgba(9, 34, 56, 1);
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            font-weight: 600;
        }
        .chooseUploadType {
            display: flex;
            align-items: center;
            img {
                width: 16px;
                height: 16px;
                padding: 4px;
                margin-left: 5px;
                cursor: pointer;
            }
        }
    }
}

.upPdfWrapper {
    width: 100% !important;
    height: 100%;
    max-height: 100%;
    overflow: auto;
    max-width: 720px;
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
        .text {
            img {
                width: 16px;
                height: 16px;
                vertical-align: middle;
            }
        }
    }
}
</style>
