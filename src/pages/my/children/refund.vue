<template>
  <div class="container">
    <x-title>申请退款</x-title>
    <div class="wrapper" v-if='obj'>
      <div class="item vux-1px-b">
        <p class="left">订单编号: {{obj.order_sn}}</p>
        <p class="right">已发货</p>
      </div>
      <div class="goods" v-for='goods of obj.goods_list'>
        <div class="image">
          <img :src="goods.goods_image">
        </div>
        <div class="content">
          <p>{{goods.goods_name}}</p>
          <span>{{goods.goods_unit}}</span>
          <div class="price">
            <strong>¥{{goods.goods_price}}</strong>
            <strong>x{{goods.goods_num}}</strong>
          </div>
        </div>
      </div>
      <div class="item vux-1px-b vux-1px-t">
        <p class="left">退款金额</p>
        <p class="right">￥{{obj.order_amount}}</p>
      </div>
      <div class="text">
        <p class="left">问题描述</p>
        <textarea cols="30" rows="10" maxlength='200' placeholder='请您在此描述问题' v-model='reason'></textarea>
        <div class="uploader-container">
          <div class="box">
            <div class="img" v-if='img1'>
              <img ref='img1'>
              <img src="../../../assets/my/close.png" class='close' @click='close(0)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent1" v-else>
              <img :src="url">
            </van-uploader>
          </div>
          <div class="box">
            <div class="img" v-if='img2'>
              <img ref='img2'>
              <img src="../../../assets/my/close.png" class='close' @click='close(1)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent2" v-else>
              <img :src="url">
            </van-uploader>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <button @click='submit'>提交</button>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { XTextarea, Group } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        reason: '',
        url: require('../../../assets/my/uploadicon.png'),
        img1: false,
        img2: false,
        obj: '',
        imgs: []
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.id = this.$route.query.id
      this._getData()
    },
    methods: {
      logContent1 (file) {
        this.img1 = true
        this.imgs[0] = file.content
        this.$nextTick(() => {
          this.$refs.img1.setAttribute('src', file.content)
        })
      },
      logContent2 (file) {
        this.img2 = true
        this.imgs[1] = file.content
        this.$nextTick(() => {
          this.$refs.img2.setAttribute('src', file.content)
        })
      },
      close (n) {
        this.imgs.splice(n, 1)
        if (n === 0) {
          this.$refs.img1.setAttribute('src', '')
          this.img1 = false
        } else {
          this.$refs.img2.setAttribute('src', '')
          this.img2 = false
        }
      },
      submit () {
        this.$http.post(`/mobile/?act=member_refund&op=refund_all_post&api_token=${this.api_token}`, {
          order_id: this.id,
          refund_pic: this.imgs,
          buyer_message: this.reason,
          refund_amount: this.obj.order_amount
        }).then(res => {
          console.log(res)
        })
      },
      _getData () {
        this.$http.get(`/mobile/?act=member_order&op=order_info&api_token=${this.api_token}&order_id=${this.id}`).then(res => {
          if (res.data.status === 200) {
            this.obj = res.data.data.order_info
          }
        })
      }
    },
    components: {
      XTitle,
      XTextarea,
      Group
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: #f4f4f4;
    z-index: 1;
    .wrapper{
      width: 100vw;
      font-size: @font-size-medium;
      padding-left: 15px;
      background: #fff;
      padding-bottom: 20px;
      .item{
        display: flex;
        width: 100%;
        padding-right: 15px;
        flex-flow: row wrap;
        justify-content: space-between;
        p{
          line-height: 45px;
        }
        .left{
          color: #666;
        }
        .right{
          color: @color;
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
          }
        }
        .content{
          flex: 1;
          height: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          font-size: @font-size-medium;
          padding-right: 15px;
          >span{
            color: #999;
          }
          .price{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            font-size: @font-size-small;
          }
        }
      }
      .text{
        display: flex;
        width: 100%;
        padding-right: 15px;
        flex-flow: column wrap;
        justify-content: center;
        .left{
          line-height: 45px;
        }
        textarea{
          resize: none;
          border: 0;
          padding: 15px;
          background: #f4f4f4;
        }
      }
      .uploader-container{
        margin-top: 10px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        position: relative;
        .box{
          position: relative;
          &~.box{
            margin-left: 10px;
          }
          .close{
            position: absolute;
            right: 0;
            top: 0;
            transform: translate3d(40%, -40%, 0);
            width: 20px;
            height: 20px;
          }
        }
        img{
          width: 82px;
          height: 82px;
        }
        .two{
          margin-left: 10px;
        }
      }
    }
    .btn{
      width: 100%;
      height: 50px;
      text-align: center;
      margin-top: 40px;
    }
    button{
      width: 85.333%;
      height: 50px;
      background: @color;
      border: 0;
      color: #fff;
      letter-spacing: 8px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
