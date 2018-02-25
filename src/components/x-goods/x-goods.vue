<template>
  <div class="container">
    <div class="image">
      <img v-lazy='goods.goods_image'>
    </div>
    <div class="content">
      <h3>{{goods.goods_name}}</h3>
      <p class='desc' v-html='goods.goods_jingle'></p>
      <div class='wrapper'>
        <div class="typeWrapper">
          <span class='type'>{{goods.goods_unit}}</span>
        </div>
        <div class="iconWrapper">
          <span v-for='n of goods.goods_attr' v-if='n.attr_value_name'>{{ n.attr_value_name }}</span>
        </div>
      </div>
      <div class="sellInfo">
        <div class="price">
          ¥ <strong>{{goods.goods_price}}</strong>
        </div>
        <div class="num">
          总销量:{{goods.goods_salenum}}份
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .container{
    width: 100vw;
    height: 33.6vw;
    padding: 0 18px 0 11px;
    display: flex;
    flex-flow: row nowrap;
    .image{
      width: 33.6vw;
      height: 33.6vw;
      margin-right: 15px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      // 这里还用不了 flex:1 MMP
      width: 54.666vw;
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 20px;
      justify-content: space-between;
      h3{
        padding: 1px 0;
        margin: 8px 0;
        font-size: @font-size-medium-x;
        width: 100%;
        // height: @font-size-medium-x;
        // line-height: @font-size-medium-x;
        .no-wrap
      }
      .desc{
        color: #666;
        font-size: @font-size-small;
        height: 12px;
        .no-wrap
      }
      .sellInfo{
        position: absolute;
        bottom: 3px;
        left: 0;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        line-height: 14px;
        .price{
          font-size: @font-size-small;
          strong{
            font-size: @font-size-large;
          }
        }
        .num{
          color: #999;
          font-size: @font-size-small;
        }
      }
      .wrapper{
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        height: 15vw;
        padding: 1.6vw 0 2.7vw 0;
        .iconWrapper{
          display: flex;
          flex-flow: row wrap;
          overflow: hidden;
          height: 22px;
          span{
            flex-shrink: 0;
            border: 1px solid @color;
            padding: 2px;
            font-size: @font-size-small-s;
            border-radius: 4px;
            color: @color;
            margin-top: 3px;
            display: flex;
            align-items: center;
          }
        }
        .typeWrapper{
          font-size: @font-size-medium;
        }
        span~span{
          margin-left: 6px;
        }
      }
    }
  }
</style>
