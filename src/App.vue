<template>
    <div id="app">
        <ContainerCenter v-if="isShow"></ContainerCenter>
        <NavBar v-if="showHeadFoot"></NavBar>
        <Footer v-if="showHeadFoot"></Footer>
    </div>
</template>

<script>
import NavBar from '@/views/common/nav';
import Footer from '@/views/common/footer';
import ContainerCenter from '@/views/common/containerCenter';
export default {
    components: {
        NavBar,
        Footer,
        ContainerCenter,
    },
    data() {
        return {
            isShow: false,
            showHeadFoot: false,
        };
    },

    watch: {
        $route(go) {
            this.showHeaderFooter(go);
        },
    },

    methods: {
        getQueryObject(url) {
            url = url == null ? window.location.href : url;
            const search = url.substring(url.lastIndexOf('?') + 1);
            const obj = {};
            const reg = /([^?&=]+)=([^?&=]*)/g;
            search.replace(reg, (rs, $1, $2) => {
                const name = decodeURIComponent($1);
                let val = decodeURIComponent($2);
                val = String(val);
                obj[name] = val;
                return rs;
            });
            return obj;
        },

        // 页面根据pageType值进行跳转
        goPageType() {
            // pageType 0 :教师页面 1: 批改页面 2: 学生端
            let pageType = this.getQueryObject().pageType;
            if (!pageType) {
                // pageType = Number(localStorage.pageType)
            }
            localStorage.pageType = pageType;
            if (pageType == 0) {
                // 教师
                this.$router.options.routes[0].meta.index = 3;
                localStorage.isTeacher = 1
                this.$router.push({
                    path: '/teacherPage/taskCenter/taskList',
                });
            } else if (pageType == 1) {
                localStorage.isTeacher = 1
                // 批改
                this.$router.push({
                    path: '/teacherPage/taskCenter/workCorrect?workType=1',
                });
            } else if (pageType == 2) {
                // 学生
                this.$router.options.routes[0].meta.index = 2;
                let stuId = JSON.parse(localStorage.userinfo).userId;
                this.$router.push({
                    path: `/studentPage/workCenter?stuId=${stuId}`,
                });
                localStorage.isTeacher = 0
            }
            this.isShow = true;
        },

        // 适应pad端，隐藏头尾
        showHeaderFooter(route) {
            const hide = route.query.hideHeadFoot;
            if (hide === '1') {
                this.showHeadFoot = false;
            } else {
                this.showHeadFoot = true;
            }
        },
    },

    created() {
        this.goPageType();
    },
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
body {
    margin: 0;
    padding: 0;
}
ul {
    margin: 0;
    padding: 0;
}
p {
    margin: 0;
    padding: 0;
}
.el-button--primary {
    background-color: #ff942e !important;
    border-color: #ff942e !important;
}
.el-button--warning {
    background-color: #ed6d00 !important;
    border-color: #ed6d00 !important;
}

.el-step__title.is-success {
    color: #ed6d00 !important;
}
.is-success .el-step__icon {
    border-color: #ed6d00 !important;
    color: #ed6d00 !important;
}

#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

::-webkit-scrollbar {
    width: 10px;
    height: 12px;
}
::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
}
::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
::-webkit-scrollbar-corner {
    background: #bfbfbf;
}

// 蓝狐要求 this.$confirm 的icon居上
.el-icon-warning {
    top: 12px !important;
}
.el-upload--picture-card {
    width: 80px !important;
    height: 80px !important;
    span {
        font-size: 14px !important;
    }
}
.el-upload-list--picture-card .el-upload-list__item {
    width: 80px !important;
    height: 80px !important;
}
</style>
