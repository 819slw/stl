<template>
    <div class="pdfContainer test-1">
        <pdf v-for="(item, i) in numPages" :key="i" ref="myPdfComponent" :src="pdfUrl" :page="i+1"></pdf>
    </div>
</template>
<script>
import pdf from 'vue-pdf';

export default {
    name: 'Pdf',
    components: {
        pdf,
    },
    watch: {
        'fileUrl': {
        handler: function(n){
            if(!n) return
            this.pdfUrl = n
            
            if(this.$toast){
                this.$toast.loading({
                    message: this.loadText,
                    duration: 0
                })
            }

            let loading = null
            if(this.$loading){
                loading = this.$loading({
                lock: true,
                text: this.loadText,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                })
            }
            let res = pdf.createLoadingTask(n)
            res.promise.then(pdf => {
                this.numPages = pdf.numPages
                if(this.$toast){
                    this.$toast.clear()
                }
                if(loading){
                    loading.close()
                }
            });
        },
        immediate: true,
        deep: true
        },
    },
    props: {
        fileUrl: String,
    },
    methods: {
        Printing() {
            this.$refs.myPdfComponent[0].print()
        },
        logContent() { // 解析 pdf上的文字
            this.$refs.myPdfComponent[0].pdf.forEachPage(function(page) {
                return page.getTextContent()
                .then(function(content) {
                    var text = content.items.map(item => item.str)
                    console.log(text)
                })
            });
        }
    },
    data() {
        return {
            numPages: undefined,
            pdfUrl: '',
            loadText: '试题加载中...'
        };
    },
};
</script>
<style lang="scss" scoped>
.pdfContainer {
    width: 100%;
    height: 100%;
    // height: 100%;
    // max-height: 100%;
    // overflow: auto;
}
</style>