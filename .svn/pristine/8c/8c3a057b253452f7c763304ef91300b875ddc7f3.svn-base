<template>
    <div class="addTaskContainer">
        <div class="stepWrapper">
            <div class="stepBox">
                <div style="width:500px">
                    <el-steps :active="stepAvtive" simple finish-status="success" process-status="wait">
                        <el-step :key="index" v-for="(item, index) in stepList" :title="item.name"></el-step>
                    </el-steps>
                </div>
                <div class="timeBox">
                    <div class="stopTimeImg">
                        <img src="../../../assets/stopWatch.png" alt />
                    </div>
                    <div class="bzzzik">
                        时间剩余
                        <span class="fontX">(时分秒)：</span>
                    </div>
                    <div class="numTime">{{ hour }}</div>
                    :
                    <div class="numTime">{{ minute }}</div>
                    :
                    <div class="numTime">{{ second }}</div>
                </div>
            </div>
        </div>
        <div class="uploadGrid">
            <div class="upPdfWrapper">
                <PdfCom :fileUrl="fileUrl" v-if="fileUrl.trim() != ''"></PdfCom>
            </div>
            <!-- 作答页面 -->
            <div class="box" v-if="hide">
                <div class="setAnswerContainer test-1">
                    <div class="titleWrapper">
                        <p class="setTitle">作答答案</p>
                        <div v-if="!hideHeadbool" class="chooseUploadType">
                            <div></div>
                            <div @click="scanCode()">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="📱 手机扫描二维码 拍照上传答题"
                                    placement="top"
                                >
                                    <img src="@/assets/scanningQrcode.png" />
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="subTypeGrid" v-if="!answerImg.showGrid">
                        <div class="imgList">
                            <upload-img
                                :key="menukey"
                                :imageUrl="answerImg.answerObj"
                                :single="false"
                                refDom="clearErrorone"
                                word="communityLogo"
                                :limit="Number('6')"
                                :subInfo.sync="answerImg"
                                :disabled="isUpimg"
                                @confrimSubmit="confrimSubmit"
                            >
                            </upload-img>
                        </div>
                    </div>
                    <div class="codeImg" v-else>
                        <el-image style="width: 150px; height: 150px" :src="codeUrl"> </el-image>
                        <p class="codeImgP">手机扫码二维码，拍照上传答案</p>
                    </div>
                </div>
                <div class="operationBox">
                    <button class="btn1" @click="saveWor">保存</button>
                    <button class="btn2" @click="submitWor">提交</button>
                </div>
            </div>
            <!-- 提交页面 -->
            <!-- <div v-else>
        <div class="card">
          <div>
            <p class="setTitle">答题卡</p>
            <div class="type" v-for="item in 5" :key="item">
              <div class="title pd">单选题</div>
              <div class="type-Single">
                <div class="SingleItem" v-for="item in 5" :key="item">
                  {{ item }}.
                  <el-button class="optionBtn" type="warning" size="small" round>D</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="operationBox">
          <button class="btn1" @click="amend">修改</button>
          <button class="btn2" @click="affirmSubmit">确认提交</button>
        </div>
      </div>-->
        </div>
        <el-dialog title="确认提交提示" :visible.sync="dialogVisible" width="432px">
            <span class="TH">!</span>
            <span>
                点击“确认提交”即为作业作答完毕并上交老师， 确认要提交吗？
            </span>
            <span slot="footer" class="dialog-footer">
                <button class="btn2" @click="dialogVisible = false">取 消</button>
                <button class="btn3" type="primary" @click="dialogVisible = false">确 定</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import PdfCom from '_c/pdfCom';
import uploadImg from '@/components/uploadImg';
import {
    queryById,
    saveOrUpdate,
    queryHomeworkStudent,
    updateSubmitType,
    updateStuHomeworkStatus,
    stuQrCode,
} from '@/api/student';
import { socketMinxin } from '@/mixins/socket';

export default {
    name: 'nonAnswer',
    mixins: [socketMinxin],
    components: {
        PdfCom,
        uploadImg,
    },
    created() {
        this.queryHomeworkId = this.$route.query.homeworkId;
        this.stuId = this.$route.query.stuId;
        this.closeTime = this.$route.query.closeTime;
        queryHomeworkStudent({ homeworkId: this.queryHomeworkId, stuId: this.stuId }).then((res) => {
            if (res.result.length > 0) {
                this.$set(this.answerImg, 'answerObj', res.result[0].answerUrl);
                this.$set(this.answerImg, 'showGrid', false);
                this.answerObj = res.result[0].answerUrl;
            } else {
                this.$set(this.answerImg, 'answerObj', '');
                this.$set(this.answerImg, 'showGrid', false);
            }
        }),
            // 获取PDF
            queryById({ homeworkId: this.queryHomeworkId }).then((res) => {
                this.fileUrl = res.result.workUrl;
                document.title = res.result.workName;
            });
        this.countTime();
        this.resultArr.forEach((res) => {
            // 先看存不存在这类题型
            let isLive = this.subjectList.findIndex((v) => v.type === res.type);

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
                    name: res.name,
                    list: [res],
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
    },
    mounted() {
        this.hideHeadbool = this.$route.query.hideHeadFoot == 1;
    },
    methods: {
        // 扫码上传
        scanCode() {
            if (!this.answerImg.showGrid) {
                let userinfo = JSON.parse(localStorage.userinfo);
                this.answerImg.showGrid = !this.answerImg.showGrid;
                stuQrCode({ homeworkId: this.queryHomeworkId, token: userinfo.token, userId: this.stuId }).then(
                    (res) => {
                        this.codeUrl = res.result.url;
                        this.wbSocket = this.initSocket(
                            `/AnswerUrlWebsocket/${this.stuId}/${this.queryHomeworkId}/${this.stuId}`
                        );
                    }
                );
            } else {
                this.answerImg.showGrid = !this.answerImg.showGrid;
            }
        },
        // 上传图片
        confrimSubmit(obj) {
            saveOrUpdate({
                homeworkId: this.queryHomeworkId,
                studentId: this.stuId,
                answerUrl: obj.answerObj,
            }).then(() => {});
        },
        // 保存
        saveWor() {
            updateStuHomeworkStatus({ homeworkId: this.queryHomeworkId, studentId: this.stuId }).then(() => {
                this.$message({
                    message: '保存成功',
                    type: 'success',
                });
            });
        },
        // 提交
        submitWor() {
            this.$confirm('点击“确认提交”即为作业作答完毕并上交老师，确认要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.stepAvtive = 2;
                    updateSubmitType({ homeworkId: this.queryHomeworkId, studentId: this.stuId }).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '提交成功!',
                        });
                        console.log(res);
                        this.$router.go(-1);
                        if (this.hideHeadbool) {
                            window.location.href = 'hios://NaviBack';
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
        },
        // 倒计时
        countTime() {
            var now = new Date().getTime();
            var end = new Date(Number(this.closeTime)).getTime();
            var leftTime = end - now; //时间差
            if (leftTime >= 0) {
                this.hour = Math.floor(leftTime / 1000 / 60 / 60);
                this.minute = Math.floor((leftTime / 1000 / 60) % 60);
                this.second = Math.floor((leftTime / 1000) % 60);
                if (this.second < 10) {
                    this.second = '0' + this.second;
                }
                if (this.minute < 10) {
                    this.minute = '0' + this.minute;
                }
                if (this.hour < 10) {
                    this.hour = '0' + this.hour;
                }
            } else {
                console.log('已截止');
            }
            setTimeout(this.countTime, 50);
        },
        // 设置主观题目的访问器属性
        setSubjectiveAccessorAttribute(totalIndex) {
            // 添加是否展示单选框组（选择是分题还是整体上传）的属性
            this.$set(this.subjectList[totalIndex], 'uploadType', 0);
            // 添加上传图片的属性（图片最多三张，暂定用String，转换为数组展示）
            this.$set(this.subjectList[totalIndex].list[this.subjectList[totalIndex].list.length - 1], 'answerUrl', '');
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
            let arr = res.value.split(',');
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
        setJudgeActive(index, i, optionIndex) {
            this.subjectList[index].list[i].optionList.map((v) => {
                v.isActive = false;
            });
            this.subjectList[index].list[i].optionList[optionIndex].isActive = true;
        },
        setOptionActive(type, index, i, optionIndex) {
            if (Number(type) === 1) {
                this.subjectList[index].list[i].optionList.map((v) => {
                    v.isActive = false;
                });
            } else {
                let isChoosed = this.subjectList[index].list[i].optionList.findIndex((v) => v.isActive);
                if (isChoosed === optionIndex) {
                    this.subjectList[index].list[i].optionList[optionIndex].isActive = false;
                    return;
                }
            }
            this.subjectList[index].list[i].optionList[optionIndex].isActive = true;
        },
        // 修改
        amend() {
            this.stepAvtive = 1;
            this.hide = true;
        },
        // 确认提交
        affirmSubmit() {
            this.dialogVisible = true;
        },
    },
    beforeDestroy() {
        if (this.wbSocket) {
            this.wbSocket.destroy();
        }
    },
    watch: {
        socketData: function(data) {
            // 过来的数据直接渲染就行
            this.answerImg.showGrid = false;
            this.answerImg.answerObj = data.message;
            console.log(this.answerImg);
        },
        stepAvtive(val) {
            this.$router.replace({
                query: {
                    type: val,
                },
            });
        },
    },
    data() {
        return {
            hideHeadbool: false,
            wbSocket: null,
            closeTime: '',
            fileUrl: '',
            hide: true,
            dialogVisible: false,
            stepAvtive: 1,
            hour: '',
            minute: '',
            second: '',
            stepList: [
                {
                    name: '作业作答',
                },
                {
                    name: '作业提交',
                },
            ],
            activeColor: '#ED6D00',
            subjectList: [],
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
            resultArr: [],
            queryHomeworkId: '',
            stuId: '',
            answerImg: {},
            answerObj: '',
            showScanCode: '1',
            codeUrl: '',
        };
    },
};
</script>

<style lang="scss" scoped>
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
        padding-bottom: 10px;
        box-sizing: border-box;
        overflow: hidden;
        background: #fff;
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
            max-width: 720px;
            width: 720px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #979797;
            flex: 1;
            margin-right: 20px;

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
    }
    .stepWrapper {
        margin-bottom: 20px;
    }
    .stepBox {
        display: flex;
        .timeBox {
            display: flex;
            justify-content: flex-end;
            height: 46px;
            align-items: center;
            // line-height: 46px;
            width: 100%;
            background-color: #f5f7fa;
            .stopTimeImg {
                height: 18px;
                width: 18px;
                margin-right: 5px;
            }
            .bzzzik {
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                .fontX {
                    font-size: 14px;
                }
            }
            .numTime {
                width: 32px;
                height: 32px;
                margin: 10px;
                text-align: center;
                line-height: 32px;
                background: #ffffff;
                font-size: 18px;
                font-weight: 500;
                color: rgba(255, 69, 66, 1);
            }
        }
    }
}
.box {
    background: #ffffff;
    height: 100%;
    width: 450px;
    .setAnswerContainer {
        background: #fafafa;
        padding: 16px;
        padding-bottom: 0px;
        flex: 1;
        height: 88%;
        max-height: 88%;
        overflow: auto;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid rgba(216, 216, 216, 1);
        .titleWrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .setTitle {
            font-size: 18px;
            font-weight: 500;
            color: rgba(9, 34, 56, 1);
        }
        .subInfo {
            background: #fff;
            padding-top: 16px;
            .subGrid {
                list-style: none;
                padding-bottom: 16px;
                .sortIndex {
                    font-size: 14px;
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
                    }
                    .optionBtn {
                        margin-left: 20px;
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
        }
        .chooseUploadType {
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
                width: 16px;
                height: 16px;
                padding: 4px;
                margin-left: 5px;
                cursor: pointer;
            }
        }
    }
    .operationBox {
        padding: 16px;
        margin: 0 auto;
        .btn1 {
            display: inline-block;
            cursor: pointer;
            text-align: center;
            line-height: 40px;
            outline: none;
            width: 122px;
            height: 40px;
            color: #ed6d00;
            border: none;
            border-radius: 4px;
            background: #ffffff;
            border: 1px solid rgba(237, 109, 0, 1);
            margin-right: 30px;
        }
        .btn2 {
            display: inline-block;
            outline: none;
            cursor: pointer;
            text-align: center;
            line-height: 40px;
            width: 122px;
            height: 40px;
            border: none;
            color: #ffffff;
            background: rgba(237, 109, 0, 1);
            border-radius: 4px;
        }
    }
    .test-1::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    .test-1::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        background: #d8d8d8;
    }
    .test-1::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        background: #f7f7f7;
    }
}
.card {
    width: 426px;
    height: calc(100% - 55px);
    background-color: #fafafa;
    overflow: auto;
    padding: 16px 32px 0 16px;
    border: 1px solid #d8d8d8;
    box-sizing: border-box;
}
.setTitle {
    font-size: 18px;
    font-weight: 500;
    color: rgba(9, 34, 56, 1);
}
.type-Single {
    color: #092238;
    font-family: PingFangSC-Medium, PingFang SC;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .SingleItem {
        height: 50px;
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
.operationBox {
    padding: 16px;
    margin: 0 auto;
    .btn1 {
        display: inline-block;
        cursor: pointer;
        text-align: center;
        line-height: 40px;
        outline: none;
        width: 122px;
        height: 40px;
        color: #ed6d00;
        border: none;
        border-radius: 4px;
        background: #ffffff;
        border: 1px solid rgba(237, 109, 0, 1);
        margin-right: 30px;
    }
    .btn2 {
        display: inline-block;
        outline: none;
        cursor: pointer;
        text-align: center;
        line-height: 40px;
        width: 122px;
        height: 40px;
        border: none;
        color: #ffffff;
        background: rgba(237, 109, 0, 1);
        border-radius: 4px;
    }
}
.pd {
    margin: 10px 0;
}
.el-dialog {
    margin-top: 30vh !important;
    border-radius: 8px !important;
    .el-dialog__body {
        color: #697886;
        .TH {
            display: inline-block;
            width: 16px;
            height: 16px;
            text-align: center;
            color: #ffffff;
            margin-right: 5px;
            border-radius: 8px;
            background: rgba(253, 184, 80, 1);
        }
    }
    .el-dialog__title {
        font-weight: 500;
    }
    .dialog-footer {
        .btn2 {
            width: 56px;
            height: 32px;
            border-radius: 4px;
            outline: none;
            color: #697886;
            border: 1px solid rgba(177, 185, 191, 1);
            background-color: #ffffff;
        }
        .btn3 {
            width: 56px;
            height: 32px;
            color: #ffffff;
            outline: none;
            border: #ffffff;
            background: rgba(237, 109, 0, 1);
            border-radius: 4px;
            margin-left: 16px;
        }
    }
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
</style>
