<template>
  <div class="footerContainer">
    <div class="boxWrapper">
      <!-- <div class="topGrid">
        <div class="leftWrapper">
          <ul class="listGrid" v-for="(item,index) in urlList" :key="index">
            <p class="title">{{ item.title }}</p>
            <li v-for="(el,i) in item.list" :key="i">
              {{ el.name }}
            </li>
          </ul>
        </div>
        <div class="rightWrapper">
          <img :src="qrCode" alt="">
          <p>关注微信</p>
        </div>
      </div> -->
      <p class="copyRight">{{ copyRight }}</p>      
    </div>
  </div>
</template>

<script>
export default {
  name: 'footer',
  data() {
    return {
      copyRight: 'Copyright ©2013-2017 版权所有北京因酷时代科技有限公司京ICP备15053495号 京公网安备11010802018055',
      qrCode: require('@/assets/qrCode.png'),
      urlList:[
        {
          title: '新手指南',
          list:[
            {
              name: '注册登录',
              url: '',
            },
            {
              name: 'App下载',
              url: '',
            },
            {
              name: '支付方式',
              url: '',
            },
            {
              name: '购买提醒',
              url: '',
            }
          ]
        },
        {
          title: '如何学习',
          list: [
            {
              name: '直播课程',
              url: ''
            },
            {
              name: '点播课程',
              url: ''
            }
          ]
        },
        {
          title: '教师指南',
          list: [
            {
              name: '直播授课',
              url: ''
            }
          ]
        },
        {
          title: '关于我们',
          list: [
            {
              name: '智囊学堂',
              url: ''
            },
            {
              name: '联系我们',
              url: ''
            }
          ]
        },
        {
          title: '联系我们',
          list: [
            {
              name: '400－12345678',
              url: ''
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.footerContainer{
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #F4F4F4;
  // padding-top: 10px;
  .boxWrapper{
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
  }
  .topGrid{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .leftWrapper{
      flex: 1;
      .listGrid{
        .title{
          font-size:20px;
          color:rgba(9,34,56,1);
          margin-bottom: 15px;
        }
        li{
          list-style: none;
          font-size:14px;
          color:rgba(51,64,75,1);
          margin-bottom: 5px;
         &:hover{
           color: #ED6D00 !important;
           cursor: pointer;
           transition:all .3s ease;
         }
        }
      }
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

    }
    .rightWrapper{
      margin-left: 100px;
      img{
        width: 140px;
        height: 140px;
        margin-bottom: 5px;
      }
      p{
        color: #33404B;
        font-size:16px;
        text-align: center;
      }
    }
  }
  .copyRight{
    width: 100%;
    text-align: center;
    color: #33404B;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>