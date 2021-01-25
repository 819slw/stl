<template>
    <div class="breadcrumbContainer">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item
                :to="navigateTo(item)"
                v-for="(item, index) in routeList"
                :key="index"
            >
            <span @click.stop="reloadPage(item)">{{ item.name }}</span>
            </el-breadcrumb-item
            >
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    name: 'breadcrumb',
    watch: {
        '$route': {
            handler: function(n) {
                // 记录 query
                n.matched.map((res) => {
                    if(res.name === n.name){
                        res.path = `${res.path}?${this.getPath(n)}`
                    }
                })
                this.routeList = n.matched
            },
            immediate: true,
        },
    },
    methods: {
        reloadPage(item){
            if(item.meta.isHref){
                window.location.href = item.meta[Number(localStorage.isTeacher) === 1 ? 'teacherPage' : 'studentPage' ]
            }else {
                return item.meta.isDisabled ? this.routeList[item.meta.index || 2].path : item.path
            }
        },
        navigateTo(item){
            return item.meta.isDisabled ? this.routeList[item.meta.index || 2].path : item.path
        },
        getPath(item) {
            let str = '';
            if (item) {
                for (const key in item.query) {
                    str += str == '' ? `${key}=${item.query[key]}` : `&${key}=${item.query[key]}`;
                }
            }
            return str;
        },
    },
    data() {
        return {
            routeList: []
        };
    },
};
</script>

<style lang="scss">
.breadcrumbContainer {
    margin-top: 30px;
    display: flex;
    align-items: center;
    font: {
        size: 14px;
        weight: 700;
    }
}
</style>
