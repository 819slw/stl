<template>
    <div class="answerArea">
        <div class="answerAreaType" v-for="(item, index) in subjectList" :key="index">
            <div class="title pd">{{ item.name }}</div>
            <!-- 单选 or 多选 -->
            <div class="type-Multiple" v-if="Number(item.type) === 1 || Number(item.type) === 2">
                <div class="SingleItem" v-for="(el, i) in item.list" :key="i">
                    <p class="sortIndex">{{ el.sorts || el.questionSort || i + 1 }}.</p>
                    <el-button
                        v-for="(optionRes, optionIndex) in el.options"
                        :key="optionIndex"
                        class="optionBtn"
                        type="warning"
                        size="small"
                        round
                    >
                        {{ optionRes }}
                    </el-button>
                    <el-button
                        v-if="isShowLabel"
                        :type="el.scoreType"
                        size="mini"
                        round
                        style="cursor:default;margin:11px 0 11px auto;"
                        >{{ el.isRight }}</el-button
                    >
                </div>
            </div>
            <!-- 判断 -->
            <div class="type-Judge" v-else-if="Number(item.type) === 3">
                <div class="SingleItem" v-for="(el, i) in item.list" :key="i">
                    <p class="sortIndex">{{ el.sorts || el.questionSort || i + 1 }}.</p>
                    <el-button class="optionBtn" type="warning" size="small" round>
                        {{ el.options[0] == 0 ? '错误' : el.options[0] == 1 ? '正确' : el.options[0] }}
                    </el-button>
                    <el-button
                        v-if="isShowLabel"
                        :type="el.scoreType"
                        size="mini"
                        round
                        style="cursor:default;;margin:11px 0 11px auto;"
                        >{{ el.isRight }}</el-button
                    >
                </div>
            </div>
            <!-- 简答 or 填空 -->
            <div
                class="type-Judge"
                v-else-if="Number(item.type) === 4 || Number(item.type) === 5 || Number(item.type) === 0"
            >
                <div class="type-Judge-wrapper" v-for="(el, i) in item.list" :key="i">
                    <div class="SingleItem">
                        <p class="sortIndex">{{ el.sorts || el.questionSort || i + 1 }}.</p>
                        <div class="imgsWrapper">
                            <el-image
                                v-for="(optionRes, optionIndex) in el.answerUrl"
                                :key="optionIndex"
                                style="width: 80px; height: 80px;margin: 10px;"
                                :src="el.answerUrl[optionIndex]"
                                :preview-src-list="el.answerUrl"
                            >
                            </el-image>
                        </div>
                    </div>
                    <el-button
                        v-if="isShowLabel && Number(item.type) !== 0 && item.correctionMethod != 3"
                        :type="el.scoreType"
                        size="mini"
                        round
                        style="cursor:default;margin:11px 0;margin-left: 50px"
                        >{{ el.isRight }}</el-button
                    >
                    <div
                        v-if="isShowLabel && el.opinion != '' && Number(item.type) !== 0 && item.correctionMethod != 3"
                        style="padding-left:50px;display:flex;"
                    >
                        <el-button
                            type="info"
                            size="mini"
                            round
                            style="cursor:default;background:#EAEAEA;color: #000;border:none"
                            >{{ el.opinion }}</el-button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isShowLabel: {
            type: Boolean,
            default: () => false,
        },
        subjectList: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style lang="scss" scoped>
.answerArea {
    .answerAreaType {
        padding-bottom: 20px;
    }
    .pd {
        margin: 10px 0;
    }
    .sortIndex {
        width: 20px;
        font-size: 14px;
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
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            .sortIndex {
                width: 20px;
                font-size: 14px;
            }
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
        .type-Judge-wrapper {
        }
        .SingleItem {
            // height: 50px;
            line-height: 50px;
            padding-left: 20px;
            display: flex;
            align-items: center;
            // flex-wrap: wrap;
            .imgsWrapper {
                display: flex;
                flex-wrap: wrap;
            }
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
    .title {
        color: #092238;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
    }
}
</style>
