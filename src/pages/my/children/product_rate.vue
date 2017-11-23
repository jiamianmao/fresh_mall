<template>
  <div class="container">
    <x-title>评价</x-title>
    <div class="main">
      <div class="goodsWrapper vux-1px-b">
        <div class="goods">
          <div class="left">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3326244098,183580375&fm=27&gp=0.jpg">
          </div>
          <div class="right">
            <p class='name'>XX</p>
            <div class="score">星级</div>
            <rater v-model='value' :font-size='20'></rater>
          </div>
        </div>
        <div class="content">
          <textarea v-model='content' placeholder='评价商品' maxlength='200'></textarea>
        </div>
        <div class="uploader-container">
          <div class="box">
            <div class="img" v-if='img1'>
              <img ref='img1'>
              <img src="../../../assets/my/close.png" class='close' @click='close(1)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent" v-else>
              <img :src="url">
            </van-uploader>
          </div>
          <div class="box two">
            <div class="img" v-if='img2'>
              <img ref='img2' v-show='img2'>
              <img src="../../../assets/my/close.png" class='close' @click='close(2)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent" v-else>
              <img :src="url">
            </van-uploader>
          </div>
          <div class="box two">
            <div class="img" v-if='img2'>
              <img ref='img2' v-show='img2'>
              <img src="../../../assets/my/close.png" class='close' @click='close(2)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent" v-else>
              <img :src="url">
            </van-uploader>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Rater } from 'vux'
  export default {
    data () {
      return {
        value: 0,
        content: '',
        url: require('../../../assets/my/uploadicon.png'),
        img1: false,
        img2: false,
        licence_pic: []
      }
    },
    methods: {
      logContent (file) {
        if (!this.$refs.img1) {
          this.img1 = true
          this.licence_pic.unshift(file)
          this.$nextTick(() => {
            this.$refs.img1.setAttribute('src', file.content)
          })
        } else {
          this.img2 = true
          this.licence_pic.push(file)
          this.$nextTick(() => {
            this.$refs.img2.setAttribute('src', file.content)
          })
        }
      },
      close (n) {
        if (n === 1) {
          this.licence_pic.shift()
          this.$refs.img1.setAttribute('src', '')
          this.img1 = false
        } else if (n === 2) {
          this.licence_pic.pop()
          this.$refs.img2.setAttribute('src', '')
          this.img2 = false
        } else {
          this.shop_pic = ''
          this.$refs.img3.setAttribute('src', '')
          this.img3 = false
        }
      }
    },
    components: {
      XTitle,
      Rater
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
    background: #fff;
    z-index: 1;
    .main{
      padding: 0 15px;
      .goodsWrapper{
        width: 100%;
        padding-top: 10px;
        .goods{
          display: flex;
          flex-flow: row nowrap;
          .left{
            width: 82px;
            margin-right: 6px;
            img{
              width: 82px;
              height: 82px;
            }
          }
          .right{
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            padding: 6px 0;
            font-size: @font-size-medium;
            .score{
              font-weight: bold;
            }
          }
        }
        .content{
          width: 100%;
          margin-top: 10px;
          textarea{
            width: 100%;
            resize: none;
            border: 0;
            background: #f4f4f4;
            padding: 10px;
            height: 135px;
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
    }
  }
</style>
