<template>
    <div class="containerCenter" :class="{ hidePadding: hidePadding }">
        <div class="maxWidthWrapper">
            <!-- 跟路径 -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'containerCenter',

    data() {
        return {
            hidePadding: false,
        };
    },

    watch: {
        $route() {
            this.showHeaderFooter();
        },
    },

    methods: {
        // 适应pad端，隐藏头尾
        showHeaderFooter() {
            const hide = this.$route.query.hideHeadFoot;
            if (hide === '1') {
                this.hidePadding = true;
            }
        },
    },
};
</script>

<style scoped lang="scss">
.containerCenter {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    padding-top: 30px;
    padding-bottom: 56px;
    box-sizing: border-box;
    background: #fafafa;
    &.hidePadding {
        padding-top: 0;
        padding-bottom: 16px;
    }
    .maxWidthWrapper {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        height: 100%;
    }
}
</style>
