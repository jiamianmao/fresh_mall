<template>
  <div class="container">
    <div class="image">
      <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=983039966,269769360&fm=58&u_exp_0=416006351,4231431246&fm_exp_0=86&bpow=670&bpoh=818">
    </div>
    <div class="content">
      <h3>奥兰达利亚</h3>
      <p class='desc'>脂肪含量饺子</p>
      <span class='type'>1 kg</span>
      <div class="iconWrapper">
        <span>谷饲</span>
      </div>
      <div class="sellInfo">
        <div class="price">
          ¥ <strong>548</strong>
        </div>
        <div class="num">
          总销量: 12345份
        </div>
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
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    height: 126px;
    padding: 0 18px 0 11px;
    display: flex;
    flex-flow: row nowrap;
    .image{
      width: 126px;
      height: inherit;
      margin-right: 15px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      // justify-content: space-around;
      h3, .type{
        margin: 10px 0;
        font-size: @font-size-medium;
      }
      .iconWrapper{
        span{
          height: 12px;
          border: 1px solid @color;
          padding: 2px;
          font-size: @font-size-small-s;
          border-radius: 4px;
          color: @color;
        }
      }
      .desc{
        color: #666;
        font-size: @font-size-small;
      }
      .sellInfo{
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        line-height: 16px;
        .price{
          font-size: @font-size-small;
          strong{
            font-size: @font-size-large;
          }
        }
        .num{
          color: #666;
          font-size: @font-size-small;
        }
      }
    }
  }
</style>
