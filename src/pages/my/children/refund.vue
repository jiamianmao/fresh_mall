<template>
  <div class="container">
    <x-title>申请退款</x-title>
    <div class="wrapper">
      <div class="item vux-1px-b">
        <p class="left">订单编号: 2017554512451</p>
        <p class="right">交易成功</p>
      </div>
      <div class="goods vux-1px-b">
        <div class="image">
          <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
        </div>
        <div class="content">
          <p>中天特羔羊肉片</p>
          <span>300g装</span>
          <div class="price">
            <strong>¥29.9</strong>
            <strong>x4</strong>
          </div>
        </div>
      </div>
      <div class="item vux-1px-b">
        <p class="left">退款金额</p>
        <p class="right">￥59.8</p>
      </div>
      <div class="text">
        <p class="left">问题描述</p>
        <textarea cols="30" rows="10" maxlength='200' placeholder='请您在此描述问题' v-model='reson'></textarea>
        <div class="uploader-container">
          <div class="box">
            <div class="img" v-if='img1'>
              <img ref='img1'>
              <img src="../../../assets/my/close.png" class='close' @click='close(1)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent1" v-else>
              <img :src="url">
            </van-uploader>
          </div>
          <div class="box">
            <div class="img" v-if='img2'>
              <img ref='img2'>
              <img src="../../../assets/my/close.png" class='close' @click='close(2)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent2" v-else>
              <img :src="url">
            </van-uploader>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <button>提交</button>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { XTextarea, Group } from 'vux'
  export default {
    data () {
      return {
        reson: '',
        url: require('../../../assets/my/uploadicon.png'),
        img1: false,
        img2: false
      }
    },
    methods: {
      logContent1 (file) {
        this.img1 = true
        this.$nextTick(() => {
          this.$refs.img1.setAttribute('src', file.content)
        })
      },
      logContent2 (file) {
        this.img2 = true
        this.$nextTick(() => {
          this.$refs.img2.setAttribute('src', file.content)
        })
      },
      close (n) {
        if (n === 1) {
          this.$refs.img1.setAttribute('src', '')
          this.img1 = false
        } else {
          this.$refs.img2.setAttribute('src', '')
          this.img2 = false
        }
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
