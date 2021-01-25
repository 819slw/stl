<template>
  <div class="teacherContainer">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
    components: {
    }
}
</script>
<style lang="scss" scoped>
.teacherContainer {
    width: 100%;
    height: 100%;
    .form {
        width: 500px;
        height: 360px;
        padding: 16px;
        overflow-y: scroll;
    }
}
</style>
