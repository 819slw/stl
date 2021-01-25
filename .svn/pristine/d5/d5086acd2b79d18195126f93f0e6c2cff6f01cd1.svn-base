<template>
    <div class="check-correct">
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="date" label="作业名称"> </el-table-column>
                <el-table-column prop="name" label="答案下发方式"> </el-table-column>
                <el-table-column prop="address" label="答题截止时间"> </el-table-column>
                <el-table-column fixed="right" label="状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ tableStatus[scope.row.status] }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" style="color: #ED6D00">作业下发</el-button>
                        <el-button type="text" size="small" style="color: #ED6D00">批改</el-button>
                        <el-button @click="handleClick(scope.row)" type="text" style="color: #ED6D00" size="small">
                            答案下发方式
                        </el-button>
                        <el-button type="text" size="small" style="color: #ED6D00">编辑</el-button>
                        <el-button type="text" size="small" style="color: #FF4542">作业作废</el-button>
                        <el-button type="text" size="small" style="color: #FF4542">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableStatus: ['已下发', '新建中', '待下发', '已收取', '待批改', '批改中', '待发布', '已发布'],
            tableData: [
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: 1,
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: 2,
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: 4,
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: 6,
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: 7,
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
                {
                    date: '操作手册视频随堂测验',
                    name: '答题截止下发',
                    address: '2020-09-22  08:00',
                    status: '已下发',
                },
            ],
        };
    },

    methods: {
        navigateTo() {
            this.$router.push({
                path: '/teacherPage/taskCenter/addTask',
            });
        },
    },
};
</script>

<style lang="scss">
.check-correct {
    //
}
</style>
