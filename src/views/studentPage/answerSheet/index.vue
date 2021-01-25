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
                <PdfCom :fileUrl="fileUrl"></PdfCom>
            </div>
            <!-- 作答页面 -->
            <div class="box" v-if="hide">
                <div class="setAnswerContainer test-1">
                    <p class="setTitle">答题卡</p>
                    <!-- 题型遍历 -->
                    <div class="subjectList" v-for="(item, index) in subjectList" :key="index">
                        <div class="topInfo">
                            <div class="subTitle">
                                <p>{{ item.name }}</p>
                                <div
                                    class="chooseUploadType"
                                    v-if="(item.uploadType || item.uploadType == 0) && !hideHeadbool"
                                >
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
                                    <p class="sortIndex">1~{{ item.list.length }}</p>
                                    <div class="codeImg">
                                        <el-image style="width: 150px; height: 150px" :src="item.url"> </el-image>
                                        <p class="codeImgP">手机扫码二维码，拍照上传答案</p>
                                    </div>
                                </div>
                                <!-- 题型中的某个题的遍历 -->
                                <li :key="i" v-for="(el, i) in item.list" class="subGrid" v-else>
                                    <div class="answerItem">
                                        <p class="sortIndex">{{ i + 1 }}.</p>
                                        <!-- 单选 / 多选的选项遍历 -->
                                        <div
                                            class="subTypeGrid"
                                            v-if="Number(item.type) === 1 || Number(item.type) === 2"
                                        >
                                            <el-button
                                                @click="setOptionActive(item.type, index, i, optionIndex, optionRes)"
                                                class="optionBtn"
                                                :key="optionIndex"
                                                v-for="(optionRes, optionIndex) in el.optionList"
                                                :type="optionRes.isActive ? 'warning' : ''"
                                                size="small"
                                                round
                                                >{{ optionRes.name }}</el-button
                                            >
                                        </div>

                                        <!-- 判断题选项遍历 -->
                                        <div class="subTypeGrid" v-else-if="Number(item.type) === 3">
                                            <el-button
                                                @click="setJudgeActive(index, i, optionIndex, null, true)"
                                                class="optionBtn"
                                                :key="optionIndex"
                                                v-for="(optionRes, optionIndex) in el.optionList"
                                                :type="optionRes.isActive ? 'warning' : ''"
                                                size="small"
                                                round
                                                >{{ optionRes.name }}</el-button
                                            >
                                        </div>
                                        <!-- 主观题UI -->
                                        <div class="subTypeGrid" v-else>
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
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="operationBox">
                    <button class="btn1" @click="saveWor">保存</button>
                    <button class="btn2" @click="submitWor">提交</button>
                </div>
            </div>
            <!-- 提交页面 -->
            <div v-else>
                <div class="card">
                    <div>
                        <p class="setTitle">答题卡</p>
                        <!-- <div class="type" v-for="item in 5" :key="item"> -->
                        <!-- <div class="title pd">单选题</div> -->
                        <!-- 单选 -->
                        <!-- <div class="type-Single">
                                <div class="SingleItem" v-for="item in 5" :key="item">
                                    {{ item }}.
                                    <el-button class="optionBtn" type="warning" size="small" round>D</el-button>
                                </div>
                            </div> -->
                        <!-- 多选 -->
                        <!-- <div class="type-Multiple">
                              <div class="SingleItem" v-for="item in 5" :key="item">
                                {{ item }}.
                                <el-button
                                  v-for="item in 3"
                                  :key="item"
                                  class="optionBtn"
                                  type="warning"
                                  size="small"
                                  round
                                >D</el-button>
                              </div>
                            </div> -->
                        <!-- 判断 -->
                        <!-- <div class="type-Judge">
                              <div class="SingleItem" v-for="item in 5" :key="item">
                                {{ item }}.<el-button
                                  class="optionBtn"
                                  type="warning"
                                  size="small"
                                  round
                                >
                                  错误
                                </el-button>
                              </div>
                            </div> -->
                        <!-- </div> -->
                        <answerArea :subjectList="subjectList" :isShowLabel="isShowLabel"></answerArea>
                    </div>
                </div>
                <div class="operationBox">
                    <button class="btn1" @click="amend">修改</button>
                    <button class="btn2" @click="affirmSubmit">确认提交</button>
                </div>
            </div>
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
import answerArea from '@/components/answerArea';
import {
    queryQuestion,
    saveOrUpdate,
    updateSubmitType,
    queryHomeworkStudent,
    updateStuHomeworkStatus,
    stuQrCode,
    queryById,
} from '@/api/student';
import { siginSuboptions } from './data';
import { socketMinxin } from '@/mixins/socket';

export default {
    name: 'answerSheet',
    mixins: [socketMinxin],
    components: {
        PdfCom,
        uploadImg,
        answerArea,
    },
    created() {
        this.queryHomeworkId = this.$route.query.homeworkId;
        this.stuId = this.$route.query.stuId;
        this.closeTime = this.$route.query.closeTime;
        this.initData();
    },

    mounted() {
        this.hideHeadbool = this.$route.query.hideHeadFoot == 1;
    },

    methods: {
        // 分题整体
        // radioChang(item,typeIndex, index){
        //   changeUploadType({flag:typeIndex,homeworkId:this.homeworkId,questionType:item.type,userId:this.stuId}).then(() => {
        //     this.subjectList[index].showGrid = true
        //     item.list.map(el => {
        //         this.$set(el, 'showGrid' , true)
        //     })
        //     if(typeIndex === 1){
        //         // 合并更改数据格式
        //         let newList = [{}]
        //         let sorts = item.list.map(v => v.sort).join(',')
        //         this.$set(newList[0] , 'sort' , sorts)
        //         this.$set(newList[0] , 'type' , item.type)
        //         this.$set(newList[0], 'showGrid' , item.list[0].showGrid)
        //         this.$set(newList[0], 'answerObj' , '')
        //         item.list = newList
        //     }else{
        //         console.log(this.subjectList[index])
        //         let arr = item.list[0].sort.split(',')
        //         arr = arr.filter( v => v != '')
        //         let arrInfo = item.list[0]
        //         ;(arr || []).forEach((v,i) => {
        //             arrInfo.sort = v
        //             arrInfo.answer = ''
        //             arrInfo.answerObj = ''
        //             item.list[i] = JSON.parse(JSON.stringify(arrInfo))
        //         })
        //     }
        //   })
        // },
        // 扫码上传
        scanCode(item, index) {
            if (item.showGrid === true) {
                this.$set(item, 'showGrid', false);
                item.list.map((el) => {
                    this.$set(el, 'showGrid', false);
                });
                let userinfo = JSON.parse(localStorage.userinfo);
                stuQrCode({
                    homeworkId: this.queryHomeworkId,
                    questionId: item.type,
                    questionTypeCounter: item.questionTypeCounter,
                    token: userinfo.token,
                    userId: this.stuId,
                    questionType: item.type,
                }).then((res) => {
                    this.$set(item, 'url', res.result.url);
                    this.wsIndex = index; // 记录是数组的index

                    this.wbSocket = this.initSocket(
                        `/AnswerUrlWebsocket/${this.stuId}/${this.queryHomeworkId}/${this.stuId}`
                    );
                    // this.initSocket(`路径`)
                });
            } else {
                // 隐藏时 销毁ws链接
                // if(this.wbSocket) this.wbSocket.destroy()
                this.$set(item, 'showGrid', true);
                item.list.map((el) => {
                    this.$set(el, 'showGrid', true);
                });
            }
        },
        affirmSubmit() {
            this.$confirm('点击“确认提交”即为作业作答完毕并上交老师，确认要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.stepAvtive = 2;
                    updateSubmitType({ homeworkId: this.queryHomeworkId, studentId: this.stuId }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '提交成功!',
                        });
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
        amend() {
            this.stepAvtive = 1;
            this.hide = true;
            this.subjectList = [];
            this.resultArr = [];
            this.initData();
        },
        confrimSubmit(obj) {
            saveOrUpdate({
                homeworkId: this.queryHomeworkId,
                sort: String(obj.sort),
                studentId: this.stuId,
                answerUrl: obj.answerObj,
            });
        },
        async initData() {
            // 获取PDF
            await queryById({ homeworkId: this.queryHomeworkId }).then((res) => {
                this.fileUrl = res.result.workUrl;
                document.title = res.result.workName;
            });
            // 获取作业内容列表
            await queryQuestion({ homeworkId: this.queryHomeworkId }).then((res) => {
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
                this.countTime();
            });
        },
        setAnswer() {
            // 获取学生答案
            queryHomeworkStudent({ homeworkId: this.queryHomeworkId, stuId: this.stuId }).then((resObj) => {
                let rescode = resObj.result || [];
                this.subjectList.map((v, index) => {
                    (v.list || []).map((el, i) => {
                        let obj = rescode.find((item) => Number(item.questionId) === Number(el.id));
                        if (obj) {
                            this.$set(this.subjectList[index].list[i], 'answerObj', obj.options);
                            if (el.qustionType === 1) {
                                this.setOptionActive(
                                    el.qustionType,
                                    index,
                                    i,
                                    siginSuboptions.findIndex((v) => obj.options === v)
                                );
                            } else if (el.qustionType === 2) {
                                let arr = obj.options === '' ? [] : obj.options.split(',');
                                arr.forEach((op) => {
                                    if (op !== '') {
                                        this.setOptionActive(
                                            el.qustionType,
                                            index,
                                            i,
                                            siginSuboptions.findIndex((v) => op === v)
                                        );
                                    }
                                });
                            } else if (el.qustionType === 3) {
                                this.setJudgeActive(index, i, obj.options, true);
                            } else if (el.qustionType === 4 || el.qustionType === 5) {
                                this.$set(this.subjectList[index].list[i], 'answerObj', obj.answerUrl);
                            }
                        } else {
                            this.$set(this.subjectList[index].list[i], 'answerObj', '');
                        }
                    });
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
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.countTime, 1000);
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
        setJudgeActive(index, i, optionIndex, flag, isNeedTransform) {
            this.subjectList[index].list[i].optionList.map((v) => {
                v.isActive = false;
            });
            if (flag) {
                this.subjectList[index].list[i].optionList[Number(optionIndex) === 0 ? 1 : 0].isActive = true;
            } else {
                this.subjectList[index].list[i].optionList[optionIndex].isActive = true;
            }
            if (!flag) {
                let obj = {
                    homeworkId: this.queryHomeworkId,
                    sort: String(this.subjectList[index].list[i].sort),
                    studentId: this.stuId,
                };
                if (isNeedTransform) {
                    obj.option = Number(optionIndex) === 0 ? 1 : 0;
                } else {
                    obj.option = String(optionIndex);
                }
                setTimeout(() => {
                    saveOrUpdate(obj);
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
                        saveOrUpdate({
                            homeworkId: this.queryHomeworkId,
                            sort: String(this.subjectList[index].list[i].sort),
                            studentId: this.stuId,
                            option: optionRes.name,
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
                        saveOrUpdate({
                            homeworkId: this.queryHomeworkId,
                            sort: String(this.subjectList[index].list[i].sort),
                            studentId: this.stuId,
                            option: this.subjectList[index].list[i].answerObj,
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
        async submitWor() {
            this.stepAvtive = 2;
            this.hide = false;
            this.subjectList = [];
            this.resultArr = [];
            Array.prototype.notempty = function() {
                var arr = [];
                this.map(function(val) {
                    if (val !== '' && val != undefined) {
                        arr.push(val);
                    }
                });
                return arr;
            };
            let answerRes = await queryHomeworkStudent({ homeworkId: this.queryHomeworkId, stuId: this.stuId });
            console.log(answerRes);
            let obj = answerRes.result || [];
            console.log(obj);
            obj.map((el) => {
                this.$set(el, 'name', this.typeArr.find((v) => v.type === el.questionType).name);
                this.$set(el, 'type', el.questionType);
                this.$set(el, 'group', 'group' + el.questionType + 'item' + el.questionTypeCounter);
                if (el.questionType === 3) {
                    this.$set(el, 'options', this.judgeSubList.find((v) => v.val == el.options).name);
                }
                if (el.options !== '') {
                    console.log(el.options.split(','));
                    el.options = el.options.split(',');
                    el.options = el.options.notempty();
                }
                if (el.answerUrl !== '') {
                    console.log(el.answerUrl);
                    el.answerUrl = el.answerUrl.split(',');
                    el.answerUrl = el.answerUrl.notempty();
                }
            });
            this.resultArr = obj;
            console.log(this.resultArr);
            this.resultArr.forEach((res) => {
                // 先看存不存在这类题型
                let isLive = this.subjectList.findIndex(
                    (v) => v.group === 'group' + res.questionType + 'item' + res.questionTypeCounter
                );
                console.log(isLive);

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
                        group: 'group' + res.questionType + 'item' + res.questionTypeCounter,
                        list: [res],
                        showGrid: true,
                    });
                    isLive = this.subjectList.length - 1;
                }
            });
        },
    },
    beforeDestroy() {
        clearTimeout(this.timer);
        if (this.wbSocket) {
            this.wbSocket.destroy();
        }
    },
    watch: {
        socketData: function(data) {
            console.log(data);
            // 过来的数据直接渲染就行
            this.subjectList[this.wsIndex].showGrid = true;
            // if (Object.keys(data).indexOf('flag') > -1) { // 学生没有题型切换的功能
            // 题型切换的回调
            // this.subjectList[this.wsIndex].uploadType = Number(data.flag);
            // this.radioChang(this.subjectList[this.wsIndex], Number(data.flag), this.wsIndex, true);
            // } else {
            // 题目信息变更的回调
            let index = 0;
            // 整体不用再查找index
            index = this.subjectList[this.wsIndex].list.findIndex((v) => Number(v.id) === Number(data.questionId));
            this.subjectList[this.wsIndex].list[index].answerObj = data.message;
            // }
        },
        // stepAvtive(val) {
        //     this.$router.replace({
        //         query: {
        //             type: val,
        //         },
        //     });
        // },
    },
    data() {
        return {
            hideHeadbool: false,
            wbSocket: null,
            timer: null,
            closeTime: '',
            hide: true,
            menukey: +new Date(),
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
            queryHomeworkId: '',
            stuId: '',
            fileUrl: '',
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
        width: calc(100% - 32px);
        height: calc(100% - 78px);
        max-height: calc(100% - 78px);
        padding: 16px;
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
            overflow: auto;
            max-width: 720px;
            width: 720px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #979797;
            flex: 1;
            margin-right: 20px;
            box-sizing: border-box;
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
    background: #fafafa;
    height: 100%;
    width: 450px;
    display: flex;
    flex-direction: column;
    .setAnswerContainer {
        background: #fafafa;
        padding: 16px;
        padding-bottom: 0px;
        flex: 1;
        overflow: auto;
        border: 1px solid #979797;
        box-sizing: border-box;
        .setTitle {
            font-size: 18px;
            font-weight: 500;
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
                    // align-items: center;
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
    .operationBox {
        // background-color: aqua;
        // padding: 16px;
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
    // background-color: aqua;
    // padding: 16px;
    // margin: 0 auto;
    margin-top: 16px;
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
</style>
