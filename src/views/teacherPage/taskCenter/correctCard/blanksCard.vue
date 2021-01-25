<template>
    <div class="radio-card">
        <div class="title">
            <span class="text">{{ questionList.name }}</span
            ><span class="score"
                >总得分：<span class="num">{{ totleScore }}</span></span
            >
        </div>
        <ul class="list">
            <li v-for="(item, index) in questionCorrectList" :key="item.id">
                <div class="btns">
                    <div class="index">{{ index + 1 }}.</div>
                    <div
                        class="btn"
                        :class="{
                            ok: Number(item.scoreType) === 2 && Number(item.score) === Number(item.questionScore),
                        }"
                        @click="okHandle(item)"
                    >
                        满分
                    </div>
                    <div
                        class="btn"
                        :class="{ no: Number(item.scoreType) === 0 && Number(item.score) === 0 }"
                        @click="noHandle(item)"
                    >
                        零分
                    </div>
                    <div class="num">
                        自定义分值：
                        <input
                            class="input"
                            type="tel"
                            v-model.number="item.score"
                            maxlength="4"
                            :disabled="disabled === 1"
                            @blur="saveCheckHandle(item)"
                        />
                    </div>
                </div>
                <div class="textarea">
                    <el-input
                        type="textarea"
                        v-model="item.opinion"
                        :maxlength="200"
                        :disabled="disabled === 1"
                        show-word-limit
                        placeholder="输入批改意见内容"
                        @blur="saveCheckHandle(item)"
                    ></el-input>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        questionList: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            disabled: 0,
            questionCorrectList: this.questionList.list,
        };
    },

    computed: {
        totleScore() {
            let score = 0;
            this.questionCorrectList.forEach((item) => {
                score += Number(item.score);
            });
            return score;
        },
    },

    watch: {
        questionList(data) {
            this.questionCorrectList = data.list;
        },
    },

    methods: {
        okHandle(item) {
            if (this.disabled) {
                return;
            }
            item.isRevise = 1;
            item.isRight = 2;
            item.scoreType = 2;
            item.score = item.questionScore || 0;
            this.saveCheckHandle(item);
        },
        noHandle(item) {
            if (this.disabled) {
                return;
            }
            item.isRevise = 1;
            item.isRight = 0;
            item.score = 0;
            item.scoreType = 0;
            this.saveCheckHandle(item);
        },
        // 触发单题批改事件
        saveCheckHandle(item) {
            if (this.disabled) {
                return;
            }
            if (item.score > Number(item.questionScore)) {
                item.score = 0;
                this.$message.error(`请填写大于0小于${Number(item.questionScore)}的分值！`);
                return;
            }
            if (item.score < 0 || item.score > 99) {
                item.score = 0;
                this.$message.error('请填写大于0小于99的分值！');
                return;
            }

            item.scoreType = 1;
            item.isRight = 1;
            if (Number(item.score) === Number(item.questionScore)) {
                item.scoreType = 2;
                item.isRight = 2;
            }
            if (Number(item.score) === 0) {
                item.scoreType = 0;
                item.isRight = 0;
            }
            this.$emit('saveCheck', item);
        },
    },

    mounted() {
        this.disabled = Number(this.$route.query.disabled);
    },
};
</script>
<style lang="scss" scoped>
.radio-card {
    .title {
        height: 40px;
        line-height: 40px;
        padding: 0 8px;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
            font-size: 16px;
            font-weight: 500;
            color: rgba(9, 34, 56, 1);
            line-height: 16px;
        }
        .score {
            font-size: 14px;
            color: rgba(9, 34, 56, 1);
            line-height: 14px;
            .num {
                color: #ed6d00;
            }
        }
    }
    .list {
        list-style: none;
        li {
            background-color: #fff;
            .btns {
                height: 40px;
                line-height: 40px;
                padding: 0 16px;
                display: flex;
                align-items: center;
                position: relative;
                .index {
                    display: inline-block;
                    width: 24px;
                }
                .btn {
                    width: 48px;
                    height: 24px;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 500;
                    color: #000;
                    line-height: 24px;
                    margin-right: 8px;
                    border-radius: 16px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                .ok {
                    color: #fff;
                    border: none;
                    background: rgba(48, 203, 130, 1);
                }
                .no {
                    color: #fff;
                    border: none;
                    background: #f85a57;
                }
                .num {
                    font-size: 14px;
                    color: rgba(9, 34, 56, 1);
                    position: absolute;
                    right: 16px;
                    .input {
                        width: 40px;
                        height: 24px;
                        text-align: center;
                        padding: 0 3px;
                        border: 1px solid #cccccc;
                        box-sizing: border-box;

                        border-radius: 12px;
                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
            .textarea {
                padding: 8px 16px 8px 36px;
            }
        }
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type='number'] {
    -moz-appearance: textfield;
}
</style>
