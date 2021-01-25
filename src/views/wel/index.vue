<template>
    <div class="homeContainer">
        <div v-if="showNav" class="BreadcrumbGrid">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="STPageGrid">
            <!-- 教师端 或者 学生端 -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '@/views/common/breadcrumb';

export default {
    name: 'home',
    components: {
        Breadcrumb,
    },
    data() {
        return {
            pageType: 0, // 1:学生 2:老师
            showNav: true, // 显示面包屑
        };
    },

    methods: {
        // 适应pad端，隐藏头尾
        showHeaderFooter() {
            const hide = this.$route.query.hideHeadFoot;
            if (hide === '1') {
                this.showNav = false;
            }
        },
    },

    created() {
        this.pageType = this.$route.query.type;
        this.showHeaderFooter();
    },
};
</script>

<style lang="scss">
.homeContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .BreadcrumbGrid {
        margin-bottom: 20px;
    }
    .STPageGrid {
        flex: 1;
        height: 100%;
        max-height: 100%;
        overflow: auto;
    }
}
</style>
