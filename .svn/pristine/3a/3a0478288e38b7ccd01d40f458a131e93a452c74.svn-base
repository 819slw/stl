<template>
    <div>
        <el-upload
            class="avatar-uploader"
            action="1"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="upLoadImg"
            v-loading="loading"
            :before-upload="beforeAvatarUpload"
            v-if="single"
        >
            <img v-if="avatarFlag && userInfo.avatar" :src="qiniuFix + userInfo.avatar" class="avatar" />
            <div v-else>
                <img v-if="data_imageUrl" :src="qiniuFix + data_imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
        </el-upload>
        <el-upload
            ref="mutiplyUpload"
            action="1"
            :disabled="disabled"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :multiple="notMultiple"
            :file-list="data_imageUrlList"
            :limit="limit"
            v-loading="loading"
            :before-upload="beforeAvatarUpload"
            v-if="!single"
            :on-exceed="handleOverload"
        >
            <div class="uploadSlot">
                <i class="el-icon-plus"></i>
                <span>上传答案</span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" modal-append-to-body="false" append-to-body="true" v-if="!single">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <Cropper :imgInfo="imgInfo" v-if="isShowCropper" @setImgInfo="setImgInfo"></Cropper>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uploadFile } from '@/mixins/uploadFile'
import Cropper from "_c/cropper.vue";

export default {
    components: {
        Cropper
    },
    mixins: [uploadFile],
    props: {
        subInfo: { // 只需要父级传过来一个 answerObj
            type: Object,
            default: () => {}
        },
        avatarFlag: {
            type: Boolean,
            default: false,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        imageUrlList: {
            type: String,
            default: '',
        },
        single: {
            type: Boolean,
            default: true,
        },
        limit: {
            type: Number,
            default: 3,
        },
        word: {
            type: String,
            default: '',
        },
        refDom: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        clearFileList: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    watch: {
        //清空上传文件列表
        clearFileList(isEnd) {
            if (isEnd) {
                this.$refs.mutiplyUpload.clearFiles();
            }
        },
        imageUrl: {
            handler: function(val) {
                val = val.trim();
                if (val) {
                    this.data_imageUrlList = [];
                    val.split(',').forEach((ele) => {
                        this.data_imageUrlList.push({
                            name: ele,
                            url: ele,
                        });
                    });
                } else {
                    this.data_imageUrlList = [];
                }
                this.data_imageUrl = this.imageUrl
            },
            immediate: true
        }
    },
    data() {
        return {
            notMultiple: false,
            data_imageUrl: '',
            data_imageUrlList: [],
            qiniuFix: this.$config.qiniuURL,
            loading: false,
            dialogImageUrl: '',
            dialogVisible: false,
            isShowCropper: false
        };
    },
    methods: {
        //处理超过限制个数时的回调
        handleOverload() {
            this.$message({
                type: 'info',
                message: '最大上传图片数量为' + this.limit + '张',
            });
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt50M = file.size / 1024 / 1024 < 5;

            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG或者PNG 格式!');
            }
            if (!isLt50M) {
                this.$message.error('上传图片不能大于5M!');
            }
            console.log(file)
            this.upLoadImg(file)
            return false
            // return isJPG && isLt50M;
        },
        handleRemove(file, fileList) {
            let arr = fileList.map(v => v.url)
            this.subInfo.answerObj = arr.join(',')
            this.$emit('confrimSubmit', this.subInfo)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true; 
        },
        setImgInfo(file) {
            if(!file){
                // this.data_imageUrlList.splice(this.data_imageUrlList.length - 1, 1)
                console.log(this.data_imageUrlList)
                this.loading = false;
                this.isShowCropper = false
            } else {
                this.uploadqiniu(file.file || file).then(url => {
                    if(!this.subInfo.answerObj || this.subInfo.answerObj.trim() === ''){
                        this.subInfo.answerObj = url
                    }else{
                        this.subInfo.answerObj += `,${url}`
                    }
                    this.loading = false;
                    this.isShowCropper = false
                    this.$emit('confrimSubmit', this.subInfo)
                })
            }
        },
        upLoadImg(file) {
            const _this = this
            _this.loading = true
            
            if(this.$route.query.closeTime){
                this.isShowCropper = true
                this.imgInfo = file
                return false
            } else {
                
                // 在父组件进行添加图片
                this.uploadqiniu(file).then(url => {
                    if(!this.subInfo.answerObj || this.subInfo.answerObj.trim() === ''){
                        this.subInfo.answerObj = url
                    }else{
                        this.subInfo.answerObj += `,${url}`
                    }
                    _this.loading = false;
                    this.$emit('confrimSubmit', this.subInfo)
                })
            }
        },
    }
};
</script>

<style lang="scss">
.el-upload--picture-card{
    
}
.uploadSlot{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    span{
        display: inline-block;
        line-height: 32px;
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px !important;
    text-align: center;
}
.avatar {
    width: 148px;
    height: 148px;
    display: block;
}
</style>
