<template>
  <div class="navContainer">
    <div class="centerWrapper">
      <div class="leftGrid" @click="navigateTo()">
        欢迎来到智囊学堂！欢迎您：<span>{{username}}</span><span @click="retreat">[退出]</span>
      </div>
      <div class="rightGrid">
        <ul class="navList">
          <li class="navItem" 
            @click="goToUrl(item)"
            v-for="(item,index) in navList"
            :key="index">
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  data () {
    return {
      navList: [
        // {
        //   name: '教师登录入口',
        //   url: 'http://newlive.znclass.com/#/download'
        // },
        {
          name: '下载客户端',
          url: 'http://newlive.znclass.com/#/download'
        },
        // {
        //   name: '个人中心',
        //   url: 'xxx.com'
        // },
        {
          name: '帮助中心',
          url: 'http://newlive.znclass.com/#/helpCenter'
        },
        {
          name: '资讯',
          url: 'http://newlive.znclass.com/#/information'
        }
      ],
      username: ''
    }
  },
  created(){
    let userinfo =  JSON.parse(localStorage.userinfo)
    if(userinfo.username !== ''){
      this.username = userinfo.studentName
    }else{
      this.username = userinfo.mobile
    }
    
  },
  methods: {
    // navigateTo(){
    //   this.$router.push({
    //     path: 'teacherPage/taskCenter/taskList'
    //   })
    // }
    // 顶部跳转
    goToUrl(item){
      window.location.href = item.url
    },
    // 退出登录
    retreat(){
      localStorage.removeItem('userinfo')
      window.location.href = 'http://newlive.znclass.com/#'
    }
  }
};
</script>

<style lang="scss" scoped>
.navContainer {
  width: 100vw;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F1F1F1;
  position: fixed;
  left: 0;
  top: 0;
  .centerWrapper{
    height: 100%;
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .leftGrid{
      color: #33404B;
      font-size: 12px;
      span{
        display: inline-block;
        padding-left: 5px;
        color: #ED6D00;
        cursor: pointer;
      }
    }
    .rightGrid{
     .navList{
       display: flex;
       align-items: center;
       & .navItem:last-child{
         &::after{
           width: 0;
           margin: 0 !important;
           content: '' !important;
         }
       }
       .navItem{
         color: #33404B;
         font-size: 12px;
         list-style: none;
         display: flex;
         align-items: center;
         &:hover{
           color: #ED6D00 !important;
           cursor: pointer;
           transition:all .3s ease;
         }
         &::after{
           display: inline-block;
           content: ' ';
           width: 1px;
           height: 12px;
           margin: 0 10px;
           background: #33404B;
         }
       }
     } 
    }
  }
}
</style>