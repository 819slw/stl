<template>
    <div class="radio-card">
        <div class="title">
            <span class="text">{{ questionList.name }}</span>
            <span class="score"
                >总得分：<span class="num">{{ totleScore }}</span></span
            >
        </div>
        <ul class="list">
            <li v-for="(item, index) in questionCorrectList" :key="item.id">
                <div class="index">{{ index + 1 }}.</div>
                <div
                    class="btn"
                    :class="{ ok: Number(item.scoreType) === 2 && item.isRevise === 1 }"
                    @click="okHandle(item)"
                >
                    正确
                </div>
                <div
                    v-if="questionList.type === 2"
                    class="btn"
                    :class="{
                        miss: Number(item.scoreType) === 1 && item.isRevise === 1,
                    }"
                    @click="missHandle(item)"
                >
                    漏选
                </div>
                <div
                    class="btn"
                    :class="{ no: Number(item.scoreType) === 0 && item.isRevise === 1 }"
                    @click="noHandle(item)"
                >
                    错误
                </div>
                <div class="num">得分：{{ item.score ? item.score : 0 }}</div>
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
        missHandle(item) {
            if (this.disabled) {
                return;
            }
            item.isRevise = 1;
            item.isRight = 1;
            item.scoreType = 1;
            item.score = item.missScore || 0;
            this.saveCheckHandle(item);
        },
        noHandle(item) {
            if (this.disabled) {
                return;
            }
            item.isRevise = 1;
            item.isRight = 0;
            item.scoreType = 0;
            item.score = 0;
            this.saveCheckHandle(item);
        },
        // 触发单题批改事件
        saveCheckHandle(item) {
            if (this.disabled) {
                return;
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
            height: 40px;
            line-height: 40px;
            padding: 0 16px;
            background-color: #fff;
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
                line-height: 24px;
                color: #000;
                border-radius: 16px;
                margin-right: 8px;
                border: 1px solid #ccc;
                box-sizing: border-box;
                cursor: pointer;
            }
            .ok {
                color: #fff;
                background: rgba(48, 203, 130, 1);
                border: none;
            }
            .miss {
                color: #fff;
                background: #0091ff;
                border: none;
            }
            .no {
                color: #fff;
                background: #f85a57;
                border: none;
            }
            .num {
                height: 24px;
                line-height: 24px;
                color: #092238;
                padding: 0 8px;
                border-radius: 16px;
                border: 1px solid #ccc;
                position: absolute;
                right: 8px;
            }
        }
    }
}
</style>
