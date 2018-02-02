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
  /* eslint-disable */
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  import '../../common/js/alipay/ap.js'
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
      // 这里写死为保证金50000
      this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/price').then(res => {
        let price = res.data.price || 1
        this.sum = this.$route.query.sum ? this.$route.query.sum : price
      })
      // 订单order_sn
      this.orderArr = this.$route.query.arr
      // 订单order_id
      this.id = this.$route.query.id
      if (Array.isArray(this.id)) {
        this.id = this.id[0]
      }
      this.api_token = storage.get('api_token')
      this.origin = storage.session.get('origin')
      this.timer
      this.str = ''
      if (this.id) {
        if (!Array.isArray(this.orderArr)) {
          let x = []
          x.push(this.orderArr)
          this.orderArr = x
        }
        for (let i = 0; i < this.orderArr.length; i++) {
          this.str += `order_sn[]=${this.orderArr[i]}&`
        }
        this.str = this.str.slice(0, -1)
      } else {
        this.str = `type=serve`
      }
      // 微信支付
      if (storage.get('shouquan')) {
        this.active(2)
        this._wechatPay()
        storage.remove('shouquan')
      }
      // 只验证一个
      this._orderPayStatus()
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
          this.$http.get(`/api/pay/pay?${this.str}&payment=AliPay&api_token=${this.api_token}`).then(res => {
            let url = res.data.data.pay_sign.url
            _AP.pay(url)
          })
        } else if (this.select2) {
          let ua = navigator.userAgent.toLowerCase()
          // 微信公众号支付
          if (ua.indexOf('micromessenger') !== -1) {
            if (storage.get('shouquan')) {
              // 调微信支付
              storage.remove('shouquan')
              this._wechatPay()
            } else {
              storage.set('shouquan', '1')
              console.log('shouquanqule')
              // 去授权
              let url = `redirect=${encodeURIComponent(window.location.href)}`
              this.$router.push(`/auth?${url}`)
            }
          } else {
            // 微信H5支付
            this.$http.get(`/api/pay/pay?${this.str}&payment=WxPay&api_token=${this.api_token}`).then(res => {
              if (res.data.status === 200) {
                window.location.href = `${res.data.data.pay_sign.url}&redirect_url=${encodeURIComponent(this.origin)}`
              }
            })
          }
        } else if (this.select3) {
          this.$http.get(`/api/pay/pay?${this.str}&payment=UnionPay&api_token=${this.api_token}`).then(res => {
            if (res.data.status === 200) {
              this.$router.push({
                path: '/union',
                query: {
                  pay_sign: res.data.data.pay_sign
                }
              })
            }
          })
        } else {
          if (!this.company) {
            this.company = true
          } else {
            this.$http.get(`/api/pay/pay?${this.str}&payment=CashPay&api_token=${this.api_token}`).then(res => {
              if (res.data.status === 200) {
                this.$router.replace('/my/order')
              }
            })
          }
        }
      },
      close () {
        this.company = false
      },
      _wechatPay () {
        this.$http.get(`/api/pay/pay?${this.str}&payment=WxPayJs&api_token=${this.api_token}`).then(res => {
          if (res.data.status !== 200) {
            return
          }
          let r = res.data.data.pay_sign
          function onBridgeReady () {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                  'appId': r.appId,
                  'timeStamp': r.timeStamp,
                  'nonceStr': r.nonceStr,
                  'package': r.package,
                  'signType': r.signType,
                  'paySign': r.paySign
              },
              function (res) {
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  this.$router.replace('/my/order?status=2')
                }
              }
            )
          }
          if (typeof WeixinJSBridge === "undefined") {
            if (document.addEventListener ) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
            }
          } else {
            onBridgeReady()
          }
        })
      },
      _orderPayStatus () {
        // 订单类的跳转
        if (this.id) {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$http.get(`/mobile/?act=member_order&op=order_info&api_token=${this.api_token}&order_id=${this.id}`).then(res => {
              if (res.data.data.order_info.order_state === '20') {
                this.$router.replace('/my/order?status=2')
              } else {
                this._orderPayStatus()
              }
            })
          }, 1500)
          // 保证类的跳转
        } else {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$http.get(`/mobile/?act=member_index&op=authority_state&api_token=${this.api_token}`).then(res => {
              if (res.data.data.examine_state === '2' && res.data.data.company_info.deposit !== '0') {
                this.$router.replace('/my/qualification')
              } else {
                this._orderPayStatus()
              }
            })
          }, 1500)
        }
      }
    },
    beforeDestroy () {
      clearTimeout(this.timer)
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
