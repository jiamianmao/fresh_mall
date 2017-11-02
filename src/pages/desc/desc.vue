<template>
  <div class="container">
    <x-title>{{title}}</x-title>
    <main>
      <h3 class="name">{{name}}</h3>
      <div class="text">
        <p>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>
        <p>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>
        <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=983039966,269769360&fm=58&u_exp_0=416006351,4231431246&fm_exp_0=86&bpow=670&bpoh=818" alt="">
      </div>
    </main>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    props: {
      title: {
        type: String,
        default: '默认值'
      },
      name: {
        type: String,
        default: '默认值'
      }
    },
    data () {
      return {
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  main{
    width: 100vw;
    padding: 15px 12px;
    .name{
      position: relative;
      padding-left: 18px;
      height: 20px;
      line-height: 20px;
      letter-spacing: 1px;
      font-size: @font-size-large;
      &:before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 7px;
        background: @color;
      }
    }
    .text{
      width: 100%;
      text-align: center;
      p{
        margin: 14px 0 19px 0;
        line-height: 28px;
        color: #666;
        text-align: left;
      }
      img{
        width: 100%;
      }
    }
    
  }
</style>
