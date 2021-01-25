<template>
    <el-dialog
        title="上传图片"
        width="550px"
        custom-class="center-dialog"
        :visible.sync="isShowCropper"
        :close-on-click-modal="false"
        :before-close="closeImgWrapper"
    >
        <div class="crpooerContainer">
            <div class="operatWrapper">
                <div class="crpooerGrid">
                    <vueCropper
                        ref="cropper"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :fixed="option.fixed"
                        :fixedNumber="option.fixedNumber"
                        :centerBox="option.centerBox"
                        :infoTrue="option.infoTrue"
                        :fixedBox="option.fixedBox"
                        @realTime="realTime"
                    ></vueCropper>
                </div>
                <div class="showArea">
                    <div class="realTimeImg">
                        <div :style="previewStyle" class="preview">
                            <img :src="previews.url" :style="previews.img" />
                        </div>
                    </div>

                    <el-upload
                        class="upload-demo"
                        :on-change="onChange"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                    >
                        <el-button size="small" type="warning">重新上传</el-button>
                    </el-upload>

                    <!-- <el-button type="warning" size="small">重新上传</el-button> -->
                </div>
            </div>
            <div class="operatBtn">
                <el-button size="small" @click="closeImgWrapper">取消</el-button>
                <el-button size="small" type="warning" @click="saveImg">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper';
export default {
    components: {
        VueCropper,
    },
    props: {
        imgInfo: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        imgInfo: {
            handler: function(n) {
                this.onChange(n);
            },
            immediate: true,
        },
    },
    methods: {
        closeImgWrapper(){
            this.isShowCropper = !this.isShowCropper
            this.$emit('setImgInfo', null);
        },
        onChange(file) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.option.img = e.currentTarget.result
            };
            reader.readAsDataURL(file.raw || file);
        },
        saveImg() {
            this.$refs.cropper.getCropBlob((data) => {
                this.$emit('setImgInfo', data);
            });
        },
        realTime(data) {
            let previews = data;
            this.previewStyle = {
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
                margin: '0',
                zoom: 144 / previews.w,
            };
            this.previews = data;
        },
    },
    data() {
        return {
            imageUrl: '',
            previews: {},
            previewStyle: {},
            tealTimeImg: '',
            isShowCropper: true,
            option: {
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 0.8, // 裁剪生成图片的质量
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                // autoCropWidth: 300, // 默认生成截图框宽度
                // autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: false, // 固定截图框大小 不允许改变
                // fixed: true, // 是否开启截图框宽高固定比例
                // fixedNumber: [7, 5], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: true, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: false, // 截图框是否被限制在图片里面
                infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
        };
    },
};
</script>

<style lang="scss">
.cropper {
    width: 300px;
    height: 300px;
}
.center-dialog {
    margin-top: 15vh !important;
}
.crpooerContainer {
    .operatBtn {
        display: flex;
        justify-content: flex-end;
        margin-top: 50px;
    }
    .operatWrapper {
        display: flex;
        .crpooerGrid {
            min-width: 300px;
            height: 300px;
            background: url('../assets/cropper_bk.jpg') no-repeat 100% 100%;
        }
        .showArea {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin-left: 60px;
            .preview {
                overflow: hidden;
            }
            .realTimeImg {
                width: 144px;
                height: 144px;
                background: url('../assets/cropper_bk.jpg') no-repeat 100% 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
