<template>
  <div class='wrapper vux-1px-b'>
    <div class="rate" v-if='rateData.geval_id'>
      <div class="top">
        <div class="brand">
          <img v-lazy="rateData.member_avatar">
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
          <img v-for='(value, index) of rateData.geval_image' v-lazy="value" @click='preview(index)'>
        </div>
      </div>
      <div v-if='rateData.geval_explain' class='explain vux-1px-t'>
        <div class='left'>商家回复:</div>
        <div class='right'>{{rateData.geval_explain}}</div>
      </div>
    </div>
    <div class="rateOrder" v-if='rateDataOrder.evaluation && rateDataOrder.evaluation.geval_state === "0"'>
      <div class="goods">
        <div class="image">
          <img v-lazy="rateDataOrder.image_60_url">
        </div>
        <div class="cet">
          <p>{{ rateDataOrder.goods_name }}</p>
          <div class='center'>
            <span>{{ rateDataOrder.goods_unit || ' ' }}</span>
          </div>
          <div class="price">
            <strong>¥{{ rateDataOrder.goods_price }}</strong>
          </div>
        </div>
      </div>
      <div class="rate vux-1px-t vux-1px-b">
        <div class="top">
          <div class="brand">
            <img v-lazy="member.avatar_url">
          </div>
          <p class='name'>{{ member.member_name }}</p>
          <p class='icon'>
            <span v-for='n of rateDataOrder.evaluation.geval_scores | 0'>
              <img src="../../assets/rate_item/yes.png">
            </span>
            <span v-for='m of (5 - rateDataOrder.evaluation.geval_scores | 0)'>
              <img src="../../assets/rate_item/no.png">
            </span>
          </p>
        </div>
        <div class="desc">
          <span class="time">{{ rateDataOrder.evaluation.geval_addtime | format }}</span>
          <span class="name">{{ rateDataOrder.evaluation.geval_goodsname }}</span>
        </div>
        <div class="content">
          <div class='text'>{{ rateDataOrder.evaluation.geval_content }}</div>
          <div class="image-box">
            <img v-for='value of rateDataOrder.evaluation.eval_pic' v-lazy="value">
          </div>
        </div>
        <div v-if='rateDataOrder.evaluation.geval_explain' class='explain vux-1px-t'>
          <div class='left'>商家回复:</div>
          <div class='right'>{{ rateDataOrder.evaluation.geval_explain }}</div>
        </div>
      </div>
      <div class="del">
        <button @click='del(rateDataOrder.evaluation.geval_id)'>删除评价</button>
      </div>
      <confirm @confirm='confirm' ref='confirm' title='删除评价后无法恢复' text='是否继续?'></confirm>
    </div>
  </div>
</template>
<script>
  import { dateFormat } from 'vux'
  import Confirm from '@/components/confirm/confirm'
  import { ImagePreview } from 'vant'

  export default {
    props: {
      rateData: {
        type: Object,
        default () {
          return {}
        }
      },
      rateDataOrder: {
        type: Object,
        default () {
          return {}
        }
      },
      member: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      del (id) {
        this.id = id
        this.$refs.confirm.show()
      },
      confirm () {
        this.$emit('del', this.id)
      },
      // 评价中图片预览
      preview (index) {
        this.instance = ImagePreview(this.rateData.geval_image, index)
      }
    },
    computed: {
      time () {
        return dateFormat(~~this.rateData.geval_addtime * 1000, 'YYYY.MM.DD HH:mm')
      }
    },
    beforeDestory () {
      console.log(1)
    },
    filters: {
      format (val) {
        return dateFormat(~~val * 1000, 'YYYY.MM.DD HH:mm')
      }
    },
    components: {
      Confirm,
      ImagePreview
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable';
  @import '~common/less/mixin';
  .wrapper{
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
          object-fit: cover;
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
        padding: 1px 0;
        width: 34%;
      }
      .name{
        padding: 1px 0;
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
    .explain{
      width: 100%;
      display: flex;
      padding: 18px 0;
      font-size: @font-size-medium;
      .left{
        width: 85px;
      }
      .right{
        flex: 1;
        color: #333;
      }
    }
    .goods{
      width: 100%;
      height: 100px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .image{
        width: 81px;
        height: 81px;
        margin-right: 10px;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .cet{
        flex: 1;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        font-size: @font-size-medium;
        padding-right: 15px;
        .price{
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          font-size: @font-size-small;
        }
        .center{
          display: flex;
          justify-content: space-between;
          span:first-child{
            color: #999;
          }
          span:last-child{
            color: @color;
          }
        }
      }
    }
    .rateOrder{
      padding: 5px 15px 0;
      background: #fff;
      .rate{
        padding: 0;
      }
    }
    .rate{
      background: #fff;
      // padding: 0 15px;
    }
    .del{
      height: 50px;
      width: 100%;
      padding-right: 15px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      button{
        min-width: 20vw;
        height: 26px;
        line-height: 26px;
        text-align: center;
        background: #fff;
        font-size: @font-size-small-s;
        border: 1px solid #000;
      }
    }
  }
</style>
