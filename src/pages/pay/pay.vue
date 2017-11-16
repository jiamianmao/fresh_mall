<template>
  <div class="container">
    <x-title>支付</x-title>
    <div class="typeWrapper">
      <div class="type vux-1px-b" @click='active(1)'>
        <div class="left">
          <div class="brand">
            <div class="brand_left">
              <img src="../../assets/pay/alipay.png">
            </div>
            <div class="brand-right">
              <p>支付宝支付</p>
              <span>支付宝安全支付</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img src="../../assets/selectAdd/selected.png" v-if='select1'>
          <img src="../../assets/selectAdd/select.png" v-else>
        </div>
      </div>
      <div class="type vux-1px-b" @click='active(2)'>
        <div class="left">
          <div class="brand">
            <div class="brand_left">
              <img src="../../assets/pay/wechatpay.png">
            </div>
            <div class="brand-right">
              <p>微信支付</p>
              <span>微信安全支付</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img src="../../assets/selectAdd/selected.png" v-if='select2'>
          <img src="../../assets/selectAdd/select.png" v-else>
        </div>
      </div>
      <div class="type vux-1px-b" @click='active(3)'>
        <div class="left">
          <div class="brand">
            <div class="brand_left">
              <img src="../../assets/pay/unionpay.png">
            </div>
            <div class="brand-right">
              <p>银联支付</p>
              <span>中国银联在线支付</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img src="../../assets/selectAdd/selected.png" v-if='select3'>
          <img src="../../assets/selectAdd/select.png" v-else>
        </div>
      </div>
      <div class="type vux-1px-b" @click='active(4)'>
        <div class="left">
          <div class="brand">
            <div class="brand_left">
              <img src="../../assets/pay/companypay.png">
            </div>
            <div class="brand-right company">
              <p>公司转账</p>
            </div>
          </div>
        </div>
        <div class="right">
          <img src="../../assets/selectAdd/selected.png" v-if='select4'>
          <img src="../../assets/selectAdd/select.png" v-else>
        </div>
      </div>
    </div>
    <transition name='fade'>
      <div class="mask" @click='close' v-show='company'></div>
    </transition>
    <transition name='slide'>
      <div class="modal" v-show='company'>
        <header class='vux-1px-b'>转账信息
          <span @click='close'>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close47"></use>
            </svg>
          </span>
        </header>
        <div class="content">
          <div class="item">
            <div class="left">说明<span class='placeholder'></span></div>
            <div class="right">公司转账仅支持线下转账</div>
          </div>
          <div class="item">
            <div class="left">户名<span class='placeholder'></span></div>
            <div class="right">北京创合联动科技有限公司</div>
          </div>
          <div class="item">
            <div class="left">账号<span class='placeholder'></span></div>
            <div class="right">1109 2800 6910 301</div>
          </div>
          <div class="item">
            <div class="left">开户行<span class='placeholder'></span></div>
            <div class="right">招商银行股份有限公司北京清华园支行</div>
          </div>
          <div class="desc">为了方便平台尽快为您处理订单，请您在公司转账操作时备注订单号并简要填写商品名称。因各银行备注不同，请您最好在所有可备注的地方填写。货款到账后，我们会在1到2个工作日内处理，如有疑问请联系平台客服。</div>
        </div>
      </div>
    </transition>
    
    <button @click='pay'><span>{{msg}}支付</span>¥ {{sum}}</button>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        select1: true,
        select2: false,
        select3: false,
        select4: false,
        msg: '支付宝',
        company: false,
        sum: 0,
        orderArr: []
      }
    },
    created () {
      this.sum = this.$route.query.sum
      this.orderArr = this.$route.query.arr
    },
    methods: {
      active (n) {
        this.select1 = false
        this.select2 = false
        this.select3 = false
        this.select4 = false
        if (n === 1) {
          this.select1 = true
          this.msg = '支付宝'
        } else if (n === 2) {
          this.select2 = true
          this.msg = '微信'
        } else if (n === 3) {
          this.select3 = true
          this.msg = '银联'
        } else {
          this.select4 = true
          this.msg = '转账'
        }
      },
      pay () {
        if (this.select1) {
        } else if (this.select2) {
        } else if (this.select3) {
        } else {
          this.company = true
        }
      },
      close () {
        this.company = false
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
    height: 100vh;
    width: 100vw;
    position: relative;
    .typeWrapper{
      width: 100%;
      padding-left: 15px;
      .type{
        height: 60px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding-right: 15px;
        .left{
          .brand{
            display: flex;
            flex-flow: row nowrap;
            color: #333;
            .brand_left{
              height: 33px;
              margin-right: 9px;
              img{
                height: 100%;
              }
            }
            .brand-right{
              display: flex;
              flex-direction: column;
              justify-content: center;
              span{
                font-size: @font-size-small;
                margin-top: 6px;
                display: inline-block;
              }
            }
          }
        }
        .right{
          width: 20px;
          img{
            width: 100%;
          }
        }
      }
    }
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(0, 0, 0, .6);
    }
    .modal{
      position: absolute;
      bottom: 49px;
      left: 0;
      width: 100vw;
      height: 280px;
      background: #fff;
      z-index: 2;
      header{
        width: 100%;
        height: 45px;
        text-align: center;
        line-height: 45px;
        position: relative;
        span{
          position: absolute;
          right: 18px;
          .icon {
            width: 1em; height: 1em;
            fill: #bfbfbf;
            overflow: hidden;
          }
        }
      }
      .content{
        width: 100vw;
        padding: 16px 20px 0 12px;
        font-size: @font-size-small;
        .item{
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          .left{
            width: 50px;
            text-align: justify;
            span{
              display: inline-block;
              width: 100%;
            }
          }
          .right{
            color: #333;
            width: 260px;
          }
        }
        .desc{
          width: 96.38%;
          background: #f4f4f4;
          margin-top: 10px;
          padding: 7px 8px;
          line-height: 20px;
          color: #666;
        }
      }
    }
    .slide-enter-active, .slide-leave-active{
      transition: transform .5s;
    }
    .slide-enter, .slide-leave-to{
      transform: translate3d(0, 340px, 0);
    }
    .fade-enter-active, .fade-leave-active{
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to{
      opacity: 0;
    }
    button{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 49px;
      background: @color;
      color: #fff;
      border: 0;
      z-index: 3;
      span{
        letter-spacing: 4px;
      }
    }
  }
</style>
