<template>
  <div class='wrapper vux-1px-t'>
    <div class="top">
      <div class="brand">
        <img :src="rateData.member_avatar">
      </div>
      <p class='name'>{{ rateData.geval_frommembername }}</p>
      <p class='icon'>
        <span v-for='n of rateData.geval_scores | 0'>
          <img src="../../assets/rate_item/yes.png">
        </span>
        <span v-for='m of (5 - rateData.geval_scores | 0)'>
          <img src="../../assets/rate_item/no.png">
        </span>
      </p>
    </div>
    <div class="desc">
      <span class="time">{{ time }}</span>
      <span class="name">{{ rateData.geval_goodsname }}</span>
    </div>
    <div class="content">
      <div class='text'>{{ rateData.geval_content }}</div>
      <div class="image-box">
        <img v-for='value of rateData.geval_image' :src="value">
      </div>
    </div>
  </div>
</template>
<script>
  import { dateFormat } from 'vux'
  export default {
    props: {
      rateData: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
      }
    },
    computed: {
      time () {
        return dateFormat(~~this.rateData.geval_addtime * 1000, 'YYYY.MM.DD HH:mm')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable';
  @import '~common/less/mixin';
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
      display: flex;
      flex-flow: row nowrap;
      .time{
        width: 34%;
      }
      .name{
        width: 66%;
        .no-wrap
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
