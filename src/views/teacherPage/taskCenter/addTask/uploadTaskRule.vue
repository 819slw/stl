<template>
    <div class="formWrapper">
        <div class="topGrid">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left" label-width="120px">
                <el-form-item label="作业名称" prop="name">
                    <el-input v-model="form.name" maxlength="20" show-word-limit placeholder="请输入作业"></el-input>
                </el-form-item>
                <el-form-item label="答题截止时间" prop="closeTime">
                    <el-date-picker
                        type="datetime"
                        v-model="form.closeTime"
                        placeholder="请选择时间"
                        format="yyyy/MM/dd HH:mm"
                        value-format="yyyy/MM/dd HH:mm"
                        style="width: 100%;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="使用答题卡" prop="isUseAnswerCard">
                    <el-radio-group v-model.number="form.isUseAnswerCard">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="bottomGrid">
            <el-button class="card-buttom" type="warning" @click="onSubmitNext(2)">保存并下一步</el-button>
            <el-button
                class="card-buttom"
                :class="{ 'plain-btn': isShowPdf }"
                :disabled="!isShowPdf"
                @click="againUpload"
            >
                重新上传
            </el-button>
            <el-button class="plain-btn card-buttom" @click="onSubmitNext(-1)">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },

        isShowPdf: {
            type: Boolean,
            default: false,
        },

        editWorkData: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            form: {
                name: void 0,
                closeTime: '',
                isUseAnswerCard: 1,
            },
            rules: {
                name: [{ required: true, message: '请输入作业', trigger: 'blur' }],
                closeTime: [{ type: 'string', required: true, message: '请选择日期', trigger: 'change' }],
                isUseAnswerCard: [{ required: true, message: '请选择是否使用答题卡', trigger: 'change' }],
            },
        };
    },

    watch: {
        form: {
            handler(data) {
                this.$emit('input', data);
            },
            deep: true,
        },
        editWorkData(data) {
            if (data) {
                this.form = {
                    name: data.workName,
                    closeTime: data.closeTime.replace(/-/g, '/'),
                    isUseAnswerCard: data.isUseAnswerCard,
                };
            }
        },
    },

    methods: {
        onSubmitNext(num) {
            let index = num;
            if (num === 2 && this.form.isUseAnswerCard === 0) {
                index = 3;
            }
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$emit('input', this.form);
                    this.$emit('changeActive', index);
                }
            });
        },

        // 重新上传
        againUpload() {
            this.$confirm('重新上传作业会将原上传作业内容删除，确定要重新上传作业？', '重新上传确认', {
                confirmButtonText: '确定',
                confirmButtonClass: 'confirm-warning',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$emit('againUpload');
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.formWrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bottomGrid {
        display: flex;
        justify-content: space-between !important;
    }
    .el-button.plain-btn,
    .el-button.plain-btn:focus,
    .el-button.plain-btn:hover {
        color: #ed6d00;
        border: 1px solid #ed6d00;
    }
    .card-buttom {
        padding-left: 30px;
        padding-right: 30px;
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
.el-radio-group .is-checked .el-radio__inner {
    background: #ed6d00 !important;
    border-color: #ed6d00 !important;
}

.el-radio-group .is-checked .el-radio__label {
    color: #ed6d00 !important;
}
</style>
