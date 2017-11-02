<template>
  <div class="container">
    <x-title :bottom='bottom'>中天羊业</x-title>
    <div class="goods_wrapper">
      <div class="goods">
        <div class="brand">
          <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2492932565,1746567970&fm=58&bpow=1280&bpoh=853">
        </div>
        <div class="desc">
          <h3>内蒙古清真生羊肉</h3>
          <span>优质高阳，美味健康</span>
          <strong>¥98</strong>
        </div>
      </div>
      <div class="goods">
        <div class="brand">
          <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2492932565,1746567970&fm=58&bpow=1280&bpoh=853">
        </div>
        <div class="desc">
          <h3>内蒙古清真生羊肉</h3>
          <span>优质高阳，美味健康</span>
          <strong>¥98</strong>
        </div>
      </div>
      <div class="goods">
        <div class="brand">
          <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2492932565,1746567970&fm=58&bpow=1280&bpoh=853">
        </div>
        <div class="desc">
          <h3>内蒙古清真生羊肉</h3>
          <span>优质高阳，美味健康</span>
          <strong>¥98</strong>
        </div>
      </div>
      <div class="goods">
        <div class="brand">
          <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2492932565,1746567970&fm=58&bpow=1280&bpoh=853">
        </div>
        <div class="desc">
          <h3>内蒙古清真生羊肉</h3>
          <span>优质高阳，美味健康</span>
          <strong>¥98</strong>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        bottom: false
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    .goods_wrapper{
      width: 100vw;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .goods{
        width: 49.2%;
        .brand{
          width: 100%;
          height: 230px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .desc{
          width: 100%;
          height: 96px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: @font-size-small-s;
          h3{
            font-size: @font-size-medium;
          }
          span{
            line-height: 30px;
            color: #999;
          }
        }
      }
    }
  }
</style>
