<template>
    <div class="topic-form">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <template v-for="item in formItems">
                <el-form-item :label="item.label" :prop="item.key" :key="item.key" :rules="item.rules">
                    <!-- input -->
                    <el-input
                        v-if="item.type === 'input'"
                        v-model="ruleForm[item.key]"
                        :disabled="disabled"
                        :placeholder="item.placeholder"
                    ></el-input>
                    <!-- numberInput -->
                    <el-input
                        v-if="item.type === 'numberInput'"
                        v-model.number="ruleForm[item.key]"
                        :disabled="disabled"
                        :placeholder="item.placeholder"
                        autocomplete="off"
                    ></el-input>
                    <!-- iconNumberInput -->
                    <el-input
                        v-if="item.type === 'iconNumberInput'"
                        v-model.number="ruleForm[item.key]"
                        :disabled="disabled"
                        :placeholder="item.placeholder"
                        class="icon-number-input"
                        autocomplete="off"
                    >
                        <el-button
                            slot="prepend"
                            class="el-icon-minus btn"
                            :disabled="disabled"
                            @click.native="reduceNumber(item.key)"
                        ></el-button>
                        <el-button
                            slot="append"
                            class="el-icon-plus btn"
                            :disabled="disabled"
                            @click.native="addNumber(item.key)"
                        ></el-button>
                    </el-input>
                    <!-- select -->
                    <el-select
                        v-if="item.type === 'select'"
                        v-model="ruleForm[item.key]"
                        :disabled="disabled"
                        :placeholder="item.placeholder"
                    >
                        <el-option
                            v-for="(select, index) in item.items"
                            :key="index"
                            :label="select.label"
                            :value="select.value"
                        ></el-option>
                    </el-select>
                    <!-- radio -->
                    <el-radio-group v-if="item.type === 'radio'" v-model="ruleForm[item.key]" :disabled="disabled">
                        <el-radio
                            class="radio"
                            v-for="(radio, index) in item.items"
                            :key="index"
                            :label="radio.label"
                            >{{ radio.text }}</el-radio
                        >
                    </el-radio-group>
                    <!-- textarea -->
                    <el-input
                        v-if="item.type === 'textarea'"
                        type="textarea"
                        v-model="ruleForm[item.key]"
                        :disabled="disabled"
                        :placeholder="item.placeholder"
                    ></el-input>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => ({}),
        },
        formItems: {
            type: Array,
            default: () => [],
        },
        propDisabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            ruleForm: this.value,
            disabled: this.propDisabled,
        };
    },

    watch: {
        ruleForm: {
            handler() {
                this.$emit('input', this.ruleForm);
            },
            deep: true,
        },
        propDisabled(bool) {
            this.disabled = bool;
        },
    },

    methods: {
        addNumber(key) {
            if (this.ruleForm[key] === 26) {
                return;
            }
            this.ruleForm[key] += 1;
        },
        reduceNumber(key) {
            if (this.ruleForm[key] === 1) {
                return;
            }
            this.ruleForm[key] -= 1;
        },
        onSubmit() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$emit('input', this.ruleForm);
                    this.$emit('verificationSuccess');
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.topic-form {
    .icon-number-input {
        width: 153px;
        .btn {
            width: 40px;
            height: 40px;
            padding: 0;
        }
    }
}
</style>
