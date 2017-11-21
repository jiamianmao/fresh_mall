<template>
  <div class="container">
    <x-title>确认订单</x-title>
    <!-- 这里做了个hack方法，因为B端和C端都需要拿到地址信息，C端通过Brand_id来拿到对应的地址，B端因为多个Brand_id,所以直接用defautl来代替好了 -->
    <div class="address" v-show='!member_c' @click="selectAddress('default')">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zuobiao"></use>
      </svg>
      <div class='add1' v-if='!address.default'>收货地址</div>
      <div class="add2" v-else>
        <p><span>{{address.default.true_name}}</span><span>{{address.default.tel_phone}}</span></p>
        <p>{{address.default.area_info | blank}}{{address.default.address}}</p>
      </div>
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
          <div class="title">{{goods.goods_name}}</div>
          <div class="spec">{{goods.goods_jingle}}</div>
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

      <div class="address memberc vux-1px-b" v-if='member_c' @click='delivery'>

        <div class='add1' v-if='!address[brand.brand_id]'>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zuobiao"></use>
          </svg>
          配送方式</div>

        <div class="add3" v-else>
          <div class="left">
            <p>配送到位:</p>
          </div>
          <div class="right">
            <p>{{address[brand.brand_id].area_info | blank}}{{address[brand.brand_id].address}}</p>
            <p class='people'><span>{{address[brand.brand_id].true_name}}</span> &nbsp; <span>{{address[brand.brand_id].tel_phone}}</span></p>
          </div>
        </div>

        <span class='arrow'>
          <x-icon type="ios-arrow-right" size="18"></x-icon>
        </span>
      </div>

      <div class="prices vux-1px-b" v-else>
        <span></span>
        <span>小计<strong>:{{brand.price}}</strong></span>
      </div>

      <confirm v-model='show' title='请选择收货方式' confirm-text='门店代收暂存' cancel-text='直接配送到家' @on-cancel='selectAddress(brand.brand_id)' @on-confirm='selectStore(brand.brand_id)'></confirm>
    </div>

    <divider class='divider' v-show='types >= 3'>我是有底线的</divider>

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
        <p><strong>{{types}}</strong> 种共 <strong>{{count}}</strong> 件</p>
        <p>合计：<strong>¥{{price}}</strong></p>
      </div>
      <button @click='orderSubmit'>确认订单</button>
    </div>
    <alert v-model="alertFlag">{{msg}}</alert>
    <router-view></router-view>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Divider, Confirm, Alert } from 'vux'
  import storage from 'good-storage'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        member_c: true,
        invoiceFlag: false,
        list: [], // data数据
        price: 0,
        invoiceInfo: {},
        show: false,  // modal的信号
        alertFlag: false, // alert的信号
        msg: '' // alert的提示语
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
      // 选发票
      invoice () {
        this.$router.push('/firmorder/invoice')
      },
      // 配送方式的选择框
      delivery () {
        this.show = true
      },
      selectAddress (id) {
        this.$router.push({
          path: '/my/address',
          query: {
            id
          }
        })
      },
      selectStore (id) {
        this.$router.push({
          path: '/map',
          query: {
            id
          }
        })
      },
      orderSubmit () {
        // 来判断地址是否选择够，因为C端是多地址的
        if (this.member_c) {
          if (Object.keys(this.address).length === this.list.length) {
            let obj1 = {
              'cart_id': this.cartArr
            }
            let addData = Object.entries(this.address)
            let obj2 = {}
            addData.forEach(item => {
              let type
              if (item[0] in this.addressType) {
                type = this.addressType[item[0]]
              } else {
                type = 1
              }
              let str1 = `address[${item[0]}][id]`
              let str2 = `address[${item[0]}][type]`
              obj2[str1] = item[1].address_id
              obj2[str2] = type
            })
            this.$http.post(`/mobile/?act=member_buy&op=buy_step2&api_token=${this.api_token}`, Object.assign({}, obj1, obj2, this.invoiceType)).then(res => {
              if (res.data.status === 200) {
                // 在付款页面 需要维护一个总价，及订单号的Array
                let arr = []
                let sum = 0
                let orders = res.data.data.order
                let value = Object.values(orders)
                value.forEach(item => {
                  // 这里防止浮点数计算错误
                  sum += item.order_amount * 100
                  arr.push(item.order_sn)
                })
                sum = sum / 100
                this.$router.push({
                  path: '/pay',
                  query: {
                    sum,
                    arr
                  }
                })
              }
            })
          } else {
            this.alertFlag = true
            this.msg = '您还有商品未设置收货方式'
          }
        } else {
          // B端只需判断default地址存在就ok
          if (this.address.default) {
            // todo
          } else {
            this.alertFlag = true
            this.msg = '您还有商品未设置收货方式'
          }
        }
      },
      _getOrderData () {
        // 这里有点奇葩，后端用 cart_id[]=1&cart_id[]=2 的形式传参
        // let str = ''
        // for (let i = 0; i < this.cartArr.length; i++) {
        //   str += 'cart_id[]=' + this.cartArr[i] + '&'
        // }
        // str = str.slice(0, -1)
        this.$http.get(`/api/order/confirm`, {
          params: {
            api_token: this.api_token,
            cart_id: this.cartArr
          }
        }).then(res => {
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
      types () {
        let x = 0
        this.list.forEach(brand => {
          x += brand.goods.length
        })
        return x
      },
      count () {
        let x = 0
        this.list.forEach(brand => {
          brand.goods.forEach(item => {
            x += item.goods_num
          })
        })
        return x
      },
      ...mapGetters({
        'invoiceType': 'invoice',
        'address': 'address',
        'addressType': 'addressType'
      })
    },
    filters: {
      blank (value) {
        return value.replace(/\s/g, '')
      }
    },
    components: {
      XTitle,
      Divider,
      Confirm,
      Alert
    },
    watch: {
      $route () {
        if (this.$route.path === '/firmorder') {
          // 通过vuex拿到发票信息
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
      .add3{
        display: flex;
        flex-flow: row nowrap;
        padding: 20px 0;
        .left{
          width: 70px;
          height: 100%;
        }
        .right{
          flex: 1;
          height: 100%;
          padding-right: 10px;
          p{
            width: 260px;
            .no-wrap
          }
          .people{
            margin-top: 10px;
          }
        }
      }
      .arrow{
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translate3d(0, -50%, 0);
        .vux-x-icon{
          fill: #666;
        }
      }
      .icon {
        width: 24px; 
        height: 24px;
        vertical-align: -0.25em;
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
          .title{
            width: 66vw;
            .no-wrap
          }
          .spec{
            color: #999;
            height: 12px;
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
        padding: 10px 15px;
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
          display: flex;
          align-items: center;
          textarea{
            border: 0;
            width: 100%;
            resize: none;
            font-size: @font-size-medium;
            letter-spacing: 1px;
            position: relative;
            line-height: 16px;
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
      z-index: 1;
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
