<template>
  <div class='wrapper vux-1px-t'>
    <div class="top">
      <div class="brand">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
      </div>
      <p class='name'>南阳彭于晏</p>
      <p class='icon'>
        <span v-for='n of 4'>
          <img src="../../assets/rate_item/yes.png">
        </span>
        <span>
          <img src="../../assets/rate_item/no.png">
        </span>
      </p>
    </div>
    <div class="desc">
      <span class="time">2017.09.27 22:58</span>
      <span class="name">羊肉片350g</span>
    </div>
    <div class="content">
      <div class='text'>羊肉片350g羊肉片350g羊肉片350g羊肉片350g羊肉片350g羊肉片350g羊肉片350g</div>
      <div class="image-box">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
        <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable';
  .wrapper{
    padding-top: 5px;
    width: 100%;
    .top{
      height: 53px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .brand{
        width: 32px;
        height: 32px;
        margin-right: 9px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name{
        margin-right: 11px;
        font-size: @font-size-small;
      }
      .icon{
        font-size: 0;
      }
    }
    .desc{
      font-size: @font-size-small-s;
      color: #a7a7a7;
      .time{
        margin-right: 16px;
      }
    }
    .content{
      width: 100%;
      padding-bottom: 10px;
      .text{
        line-height: 22px;
        font-size: @font-size-medium;
        margin: 10px 0 8px;
      }
      .image-box{
        display: flex;
        flex-flow: row wrap;
        img{
          width: 20vw;
          height: 20vw;
          margin-bottom: 4px;
          &~img{
            margin-left: 5px;
          }
          &:nth-child(5n){
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
