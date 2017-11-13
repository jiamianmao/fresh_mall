<template>
  <div class="container">
    <x-title>确认订单</x-title>
    <div class="address" v-show='!member_c' @click='selectAddress'>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zuobiao"></use>
      </svg>
      <div class='add1'>收货地址</div>
      <!-- <div class="add2">
        <p><span>林俊杰</span><span>18137855555</span></p>
        <p>四九城四九城四九城四九城四九城四九城四九城四九城四九城四九城城四九城四九城</p>
      </div> -->
      <span class='arrow'>
        <x-icon type="ios-arrow-right" size="18"></x-icon>
      </span>
    </div>

    <div class="order_desc" v-for='brand of list'>
      <div class="name vux-1px-b">
        <span>{{brand.brand_name}}</span>
        <span class='tel' v-show='!member_c'>企业联系电话：{{brand.store_phone}}</span>
      </div>
      <div class="goods_box vux-1px-b" v-for='goods of brand.goods'>
        <div class="left">
          <img v-lazy='goods.goods_image'>
        </div>
        <div class="right">
          <div class="title">中天羊肉片</div>
          <div class="spec">300g装</div>
          <div class="price">
            <strong>¥{{goods.goods_price}}</strong>
            <span class="count">x <span>{{goods.goods_num}}</span></span>
          </div>
        </div>
      </div>

      <div class="leave_word vux-1px-b">
        <div class="left">买家留言:</div>
        <div class="right">
          <textarea placeholder='选填（45字以内）' maxlength='45'></textarea>
        </div>
      </div>

      <div class="address memberc vux-1px-b" v-if='member_c' @click='selectAddress'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuobiao"></use>
        </svg>
        <div class='add1'>收货方式</div>
        <!-- <div class="add2">
          <p><span>林俊杰</span><span>18137855555</span></p>
          <p>四九城四九城四九城四九城四九城四九城四九城四九城四九城四九城城四九城四九城</p>
        </div> -->
        <span class='arrow'>
          <x-icon type="ios-arrow-right" size="18"></x-icon>
        </span>
      </div>
      <div class="prices vux-1px-b" v-else>
        <span>以上产品由京东配送</span>
        <span>小计<strong>:291.5</strong></span>
      </div>
    </div>

    <divider class='divider'>我是有底线的</divider>

    <div class="invoice vux-1px-t" @click='invoice'>
      <span>发票</span>
      <span>
        <span v-if='!invoiceFlag'>无</span>
        <span v-else>{{invoiceInfo.invoice}} - {{invoiceInfo.person}}</span>
        <x-icon type="ios-arrow-right" size="18"></x-icon>
      </span>
    </div>

    <div class="sure_order vux-1px-t">
      <div class="left">
        <p><strong>2</strong> 种共 <strong>8</strong> 件</p>
        <p>合计：<strong>¥{{price}}</strong></p>
      </div>
      <button>确认订单</button>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Divider } from 'vux'
  import storage from 'good-storage'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        member_c: true,
        invoiceFlag: false,
        list: [],
        price: 0,
        invoiceInfo: {}
      }
    },
    created () {
      // 对用户的身份进行区分
      this.member_class = storage.get('member_class')
      if (parseInt(this.member_class) === 2) {
        this.member_c = false
      }

      // 通过购物车那里传来的cart_id取对应数据
      this.cartArr = this.$route.query.cartId
      this.api_token = storage.get('api_token')
      this._getOrderData()
    },
    methods: {
      invoice () {
        this.$router.push('/firmorder/invoice')
      },
      selectAddress () {
        this.$router.push('/my/address')
      },
      _getOrderData () {
        // 这里有点奇葩，后端用 cart_id[]=1&cart_id[]=2 的形式传参
        let str = ''
        for (let i = 0; i < this.cartArr.length; i++) {
          str += 'cart_id[]=' + this.cartArr[i] + '&'
        }
        str = str.slice(0, -1)
        this.$http.get(`/api/order/confirm?api_token=${this.api_token}&${str}`).then(res => {
          let data = res.data.data
          for (let i in data) {
            if (data.hasOwnProperty(i)) {
              if (i === 'price') {
                this.price = data[i]
              } else {
                this.list.push(data[i])
              }
            }
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        'invoiceType': 'invoice'
      })
    },
    components: {
      XTitle,
      Divider
    },
    watch: {
      $route () {
        if (this.$route.path === '/firmorder') {
          let data = {
            invoice: {
              1: '纸质发票',
              2: '电子发票'
            },
            person: {
              1: '个人',
              2: '单位'
            }
          }
          // 通过vuex拿到发票信息
          if (this.invoiceType.invoice) {
            this.invoiceFlag = true
            this.invoiceInfo.invoice = data.invoice[this.invoiceType.invoice]
            this.invoiceInfo.person = data.person[this.invoiceType.person]
          } else {
            this.invoiceFlag = false
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .container{
    min-height: 100vh;
    width: 100vw;
    background: #f4f4f4;
    padding-bottom: 105px;
    .address{
      position: relative;
      background: #fff;
      width: 100vw;
      padding: 0 15px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 10px;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-image: 5 repeating-linear-gradient(-45deg,
        #5d85a4 0, #5d85a4 .5em,
        transparent 0, transparent 1em,
        #e56d66 0, #e56d66 1.5em,
        transparent 0, transparent 2em);
      &.memberc{
        margin-bottom: 0;
      }
      .add1{
        margin-left: 10px;
        line-height: 45px;
        font-size: @font-size-medium;
      }
      .add2{
        margin-left: 10px;
        color: #666;
        width: 80vw;
        padding: 15px 0;
        p:first-child{
          font-size: @font-size-medium;
          span:first-child{
            margin-right: 30px;
          }
        }
        p:last-child{
          margin-top: 10px;
          font-size: @font-size-small;
          .no-wrap
        }
      }
      .arrow{
        position: absolute;
        right: 12px;
        top: 12px;
        .vux-x-icon{
          fill: #666;
        }
      }
      .icon {
        width: 24px; 
        height: 24px;
        vertical-align: -0.15em;
        fill: @color;
        overflow: hidden;
      }
    }
    .order_desc{
      width: 100vw;
      background: #fff;
      font-size: @font-size-medium;
      .name{
        height: 44px;
        width: 100%;
        line-height: 44px;
        padding: 0 15px;
        .tel{
          float: right;
          font-size: @font-size-small;
          color: #999;
        }
      }
      .goods_box{
        height: 130px;
        padding: 0 15px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          width: 82px;
          height: 82px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          margin-left: 10px;
          flex: 1;
          height: 82px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          .spec{
            color: #999;
            // margin-top: 10px;
          }
          .price{
            display: flex;
            justify-content: space-between;
            .count{
              span{
                font-size: @font-size-large;
              }
            }
          }
        }
      }
      .leave_word{
        padding: 0 15px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        .left{
          width: 62px;
          display: flex;
          align-items: center;
        }
        .right{
          flex: 1;
          white-space: wrap;
          display: flex;
          align-items: center;
          height: 50px;
          textarea{
            border: 0;
            width: 100%;
            resize: none;
            font-size: @font-size-medium;
            letter-spacing: 1px;
            position: relative;
            top: 8px;
          }
        }
      }
      .prices{
        height: 45px;
        display: flex;
        padding: 0 15px;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        span:first-child{
          color: #666;
          font-size: @font-size-small;
        }
      }
    }
    .invoice{
      position: fixed;
      bottom: 49px;
      height: 45px;
      width: 100vw;
      padding: 0 15px;
      background: #fff;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: @font-size-medium;
      .vux-x-icon{
        fill: #666;
        vertical-align: -.3em;
      }
    }
    .sure_order{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 49px;
      padding-left: 15px;
      display: flex;
      flex-flow: row nowrap;
      background: #fff;
      .left{
        flex: 1;
        display: flex;
        align-items: center;
        p:first-child{
          margin-right: 30px;
          font-size: @font-size-small;
        }
        p:last-child{
          font-size: @font-size-medium;
        }
      }
      button{
        width: 120px;
        background: @color;
        color: #fff;
        letter-spacing: 3px;
        border: 0;
        height: 100%;
        font-size: @font-size-medium;
        align-self: flex-end;
      }
    }
    .divider{
      margin-top: 4px;
    }
  }
</style>
