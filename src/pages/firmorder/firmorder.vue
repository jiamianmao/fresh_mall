<template>
  <div class="container">
    <x-title>确认订单</x-title>
    <!-- 这里做了个hack方法，因为B端和C端都需要拿到地址信息，C端通过Brand_id来拿到对应的地址，B端因为多个Brand_id,所以直接用defautl来代替好了 -->
    <!-- 还是需要一个brand_id 后边已经写好了 12.11修改 -->
    <div class="address" v-show='!member_c' @click="selectAddress(list[0].brand_id)">
      <div class='border'></div>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zuobiao"></use>
      </svg>
      <div class='add1' v-if='!B_address'>收货地址</div>
      <div class="add2" v-else>
        <p><span>{{B_address.true_name}}</span><span>{{B_address.tel_phone}}</span></p>
        <p>{{B_address.area_info | blank}}{{B_address.address}}</p>
      </div>
      <span class='arrow'>
        <x-icon type="ios-arrow-right" size="18"></x-icon>
      </span>
    </div>

    <div class="order_desc" v-for='brand of list'>
      <div class="name vux-1px-b">
        <span>{{brand.brand_name}}</span>
        <span class='tel' v-show='!member_c && brand.store_phone'>联系卖家：{{brand.store_phone}}</span>
      </div>
      <div class="goods_box vux-1px-b" v-for='goods of brand.goods'>
        <div class="left">
          <img v-lazy='goods.goods_image'>
        </div>
        <div class="right">
          <div class="title">{{goods.goods_name}}</div>
          <div class="spec" v-html='goods.goods_jingle'></div>
          <div class="price">
            <strong>¥{{goods.goods_price}}</strong>
            <span class="count">x <span>{{goods.goods_num}}</span></span>
          </div>
        </div>
      </div>

      <div class="leave_word vux-1px-b">
        <div class="left">买家留言:</div>
        <div class="right">
          <textarea v-model='message[`message[${brand.brand_id}]`]' placeholder='选填（45字以内）' maxlength='45'></textarea>
        </div>
      </div>

      <div class="address memberc vux-1px-b" v-if='member_c' @click='delivery(brand.brand_id)'>

        <div class='add1' v-if='!address[brand.brand_id]'>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zuobiao"></use>
          </svg>
          收货方式</div>

        <div class="add3" v-else>
          <div class="left">
            <p v-if='addressType[brand.brand_id].transport === 1 && address[brand.brand_id]'>配送到位:</p>
            <p v-if='addressType[brand.brand_id].transport === 2 && address[brand.brand_id]'>门店配送:</p>
            <p v-if='addressType[brand.brand_id].transport === 3 && address[brand.brand_id]'>到店自提:</p>
          </div>
          <div class="right" v-if='addressType[brand.brand_id].transport === 1 && address[brand.brand_id]'>
            <p>{{address[brand.brand_id].area_info | blank}}{{address[brand.brand_id].address}}</p>
            <p class='people'><span>{{address[brand.brand_id].true_name}}</span> &nbsp; <span>{{address[brand.brand_id].tel_phone}}</span></p>
          </div>
          <div class="right" v-if='addressType[brand.brand_id].transport === 2 && address[brand.brand_id]'>
            <p>{{address[brand.brand_id].area_info | blank}}{{address[brand.brand_id].address}}</p>
            <p class='people'><span>{{address[brand.brand_id].true_name}}</span> &nbsp; <span>{{address[brand.brand_id].tel_phone}}</span></p>
          </div>
          <div class="right" v-if='addressType[brand.brand_id].transport === 3 && address[brand.brand_id]'>
            <p>{{addressType[brand.brand_id].store_name}}</p>
            <p>{{addressType[brand.brand_id].store_add}}</p>
          </div>
        </div>

        <span class='arrow'>
          <x-icon type="ios-arrow-right" size="18"></x-icon>
        </span>
      </div>

      <div class="prices vux-1px-b" v-else>
        <span></span>
        <span>小计<strong>:{{brand.price | format}}</strong></span>
      </div>

    </div>
    <confirm v-model='show' title='请选择收货方式' confirm-text='门店代收暂存' cancel-text='直接配送到家' @on-cancel='selectAddress()' @on-confirm='selectStore()'></confirm>
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
        <p>合计：<strong>¥{{price | format}}</strong></p>
      </div>
      <button @click='orderSubmit'>确认订单</button>
    </div>
    <alert v-model="alertFlag" :title='title'>{{msg}}</alert>
    <div class="mask" v-show='modal' @click='modalFadeout'></div>
    <div class="modal" v-show='modal'>
      <div class="title vux-1px-b">以下商品不在配送范围</div>
      <div class="content">
        <div class="item vux-1px-b" v-for='(item, index) of areaGoods'>
          <p class='name' @click='selectGoodsArea(index)'>
            {{ item.name }}
            <svg class="icon" :class='{"tran": index === selectGoods}' aria-hidden="true">
              <use xlink:href="#icon-arrowdropdown"></use>
            </svg>
          </p>
          <p class='area' v-if='index === selectGoods'>
            <span class='info'>配送区域:</span>
            <br /><span v-for='(area, idx) of item.area'>{{ area }}<i v-if='idx !== item.area.length - 1'>,</i></span>
          </p>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Divider, Confirm, Alert } from 'vux'
  import storage from 'good-storage'
  import { mapGetters, mapMutations } from 'vuex'
  import { Delivery, Invoice } from '../../common/config/config.js'
  export default {
    name: 'firmorder',
    data () {
      return {
        member_c: true,
        invoiceFlag: false,
        list: [], // data数据
        price: 0,
        invoiceInfo: {},
        show: false,  // modal的信号
        alertFlag: false, // alert的信号
        title: '',
        msg: '', // alert的提示语
        cartArr: [],
        message: {}, // 留言
        B_address: '',
        modal: false,
        areaGoods: [],
        selectGoods: -1
      }
    },
    created () {
      // 对用户的身份进行区分
      this.member_class = storage.get('member_class')
      this.api_token = storage.get('api_token')
      if (parseInt(this.member_class) === 2) {
        this.member_c = false
        this._getBAddress()
      }
      // 通过购物车那里传来的cart_id取对应数据
      if (Array.isArray(this.$route.query.cartId)) {
        this.cartArr = this.$route.query.cartId
      } else {
        this.cartArr = []
        this.cartArr.push(this.$route.query.cartId)
      }
      this._getOrderData()
      this.enums = {
        invoice: {
          1: '纸质发票',
          2: '电子发票'
        },
        person: {
          1: '个人',
          2: '单位'
        }
      }
    },
    methods: {
      // 选发票
      invoice () {
        this.$router.push('/firmorder/invoice')
      },
      // 配送方式的选择框
      async delivery (id) {
        // 先判断 门店代收暂存 是否开启 开启：显示弹窗  关闭：直接跳转到地址列表页
        let state = await this._getStoreState()
        if (state === '0') {
          this.selectAddress(id)
        } else {
          this.show = true
        // 之前采用的方案是 弹出框 是多个的   好处是直接可以拿到对应的 brand_id，但是会导致 弹出框弹出时候背景黑色（应该是vux问题） 另外brand_id不准确
        // 现在把弹出框拿到外边 使用this.brand_id 来当储存变量的媒介
          this.brand_id = id
        }
      },
      selectAddress (id) {
        this.$router.push({
          path: '/my/address',
          query: {
            id: id || this.brand_id,
            transport: Delivery.ptSend
          }
        })
      },
      selectStore (id) {
        // 拿过去一个goods数组 该品牌下的
        let goodsId = []
        this.list.forEach(item => {
          if (this.brand_id === item.brand_id) {
            item.goods.forEach(x => {
              goodsId.push(x.goods_id)
            })
          }
        })
        this.$router.push({
          path: '/map',
          query: {
            id: this.brand_id,
            goodsId
          }
        })
      },
      orderSubmit () {
        // 来判断用户身份
        if (this.member_c) {
          let keyArr = Object.keys(this.addressType)
          if (this.list.every(item => {
            return keyArr.includes(`${item.brand_id}`)
          })) {
            let areaGoods = []
            if (this.member_c) {
              // C端多地址 先拿到brand_id
              this.list.forEach(item => {
                // 拿到该品牌所写的收货地址
                if (this.address[item.brand_id].area_info) {
                  let area = this.address[item.brand_id].area_info.substring(0, 2)
                  if (area === '内蒙') {
                    area = '内蒙古'
                  } else if (area === '黑龙江') {
                    area = '黑龙江'
                  }
                  // 找到所对应的收货范围
                  let brandArea = this.list.find(x => {
                    return x.brand_id === item.brand_id
                  })
                  brandArea.goods.forEach(goods => {
                    if (!goods.transport_area.includes(area)) {
                      areaGoods.push({
                        'name': goods.goods_name,
                        'area': goods.transport_area
                      })
                    }
                  })
                  if (areaGoods.length > 0) {
                    this.modal = true
                    this.areaGoods = areaGoods
                  }
                }
              })
            }

            if (areaGoods.length > 0) {
              this.modal = true
              this.areaGoods = areaGoods
              return
            }

            let obj1 = {
              'cart_id': this.cartArr
            }
            // 这里把所有的收货方式都处理成键值对形式
            let addData = []
            this.list.forEach(item => {
              addData.push([item.brand_id, this.addressType[`${item.brand_id}`]])
            })
            let obj2 = {}
            addData.forEach(item => {
              let str1 = `address[${item[0]}][id]`
              let str2 = `address[${item[0]}][type]`
              let str3 = `address[${item[0]}][delivery_id]`
              obj2[str2] = item[1].transport
              // 当是自提的时候，不拿address_id，只拿store_id
              if (item[1].transport === Delivery.self) {
                obj2[str3] = item[1].store_id
              } else if (item[1].transport === Delivery.ptSend) {
                obj2[str1] = this.address[item[0]].address_id
              } else if (item[1].transport === Delivery.stSend) {
                obj2[str3] = item[1].store_id
                obj2[str1] = this.address[item[0]].address_id
              }
            })
            // 后台接口又改了，还需要重新调整发票这块的数据结构
            let invoicePhp = {}
            for (let i in this.invoiceType) {
              if (this.invoiceType.hasOwnProperty(i)) {
                if (i === 'company_name') {
                  invoicePhp['invite[invoice_name]'] = this.invoiceType[i]
                } else if (i === 'email') {
                  invoicePhp['invite[invoice_email]'] = this.invoiceType[i]
                } else if (i === 'invoice') {
                  invoicePhp['invite[invoice_type]'] = this.invoiceInfo.invoice
                } else if (i === 'person') {
                  invoicePhp['invite[invoice_title]'] = this.invoiceInfo.person
                } else if (i === 'tax_num') {
                  invoicePhp['invite[invoice_txt_number]'] = this.invoiceType[i]
                }
              }
            }
            this.$http.post(`/mobile/?act=member_buy&op=buy_step2&api_token=${this.api_token}`, Object.assign({}, obj1, obj2, invoicePhp, this.message)).then(res => {
              if (res.data.status === 200) {
                // 这里需要增加一个生成订单的vuex
                this.SET_MAKE_ORDER(true)
                // 在付款页面 需要维护一个总价，及订单号的Array
                let arr = []
                let id = []
                let sum = 0
                let orders = res.data.data.order
                let value = Object.values(orders)
                value.forEach(item => {
                  // 这里防止浮点数计算错误
                  sum += item.order_amount * 100
                  arr.push(item.order_sn)
                  id.push(item.order_id)
                })
                sum = sum / 100
                this.$router.replace({
                  path: '/pay',
                  query: {
                    sum,
                    arr,
                    id
                  }
                })
              } else {
                this.title = '提示'
                this.alertFlag = true
                this.msg = res.data.data.error
              }
            })
          } else {
            this.title = '提示'
            this.alertFlag = true
            this.msg = '您还有商品未设置收货方式'
          }
        } else {
          if (this.B_address) {
            // todo
            let obj1 = {
              'cart_id': this.cartArr
            }
            let obj2 = {}
            this.list.forEach(item => {
              let str1 = `address[${item.brand_id}][id]`
              obj2[str1] = this.B_address.address_id
            })
            let invoicePhp = {}
            for (let i in this.invoiceType) {
              if (this.invoiceType.hasOwnProperty(i)) {
                if (i === 'company_name') {
                  invoicePhp['invite[invoice_name]'] = this.invoiceType[i]
                } else if (i === 'email') {
                  invoicePhp['invite[invoice_email]'] = this.invoiceType[i]
                } else if (i === 'invoice') {
                  invoicePhp['invite[invoice_type]'] = this.invoiceInfo.invoice
                } else if (i === 'person') {
                  invoicePhp['invite[invoice_title]'] = this.invoiceInfo.person
                } else if (i === 'tax_num') {
                  invoicePhp['invite[invoice_txt_number]'] = this.invoiceType[i]
                }
              }
            }
            this.$http.post(`/mobile/?act=member_buy&op=buy_step2&api_token=${this.api_token}`, Object.assign({}, obj1, obj2, invoicePhp, this.message)).then(res => {
              if (res.data.status === 200) {
                // 这里需要增加一个生成订单的vuex
                this.SET_MAKE_ORDER(true)
                // 在付款页面 需要维护一个总价，及订单号的Array
                let arr = []
                let id = []
                let sum = 0
                let orders = res.data.data.order
                let value = Object.values(orders)
                value.forEach(item => {
                  // 这里防止浮点数计算错误
                  sum += item.order_amount * 100
                  arr.push(item.order_sn)
                  id.push(item.order_id)
                })
                sum = sum / 100
                this.$router.replace({
                  path: '/pay',
                  query: {
                    sum,
                    arr,
                    id
                  }
                })
              } else {
                this.title = '提示'
                this.alertFlag = true
                this.msg = res.data.data.error
              }
            })
          } else {
            this.title = '提示'
            this.alertFlag = true
            this.msg = '您还有商品未设置收货方式'
          }
        }
      },
      // 获取门店代收开启状态
      async _getStoreState () {
        let state = await this.$http.post(`/mobile/?act=goods&op=is_collect&api_token=${this.api_token}`, {
          goods_id: '',
          brand_id: ''
        })
        .then(res => {
          if (res.data.status === 200) {
            return res.data.data.site_collect_switch
          }
        })
        .catch((err) => {
          console.log(err)
        })
        return state
      },
      selectGoodsArea (index) {
        if (this.selectGoods !== index) {
          this.selectGoods = index
        } else {
          this.selectGoods = -1
        }
      },
      modalFadeout () {
        this.modal = false
        this.selectGoods = -1
      },
      _getInvoice () {
        // 通过vuex拿到发票信息
        if (this.invoiceType.invoice === Invoice.person || this.invoiceType.invoice === Invoice.company) {
          this.invoiceFlag = true
          this.invoiceInfo.invoice = this.enums.invoice[this.invoiceType.invoice]
          this.invoiceInfo.person = this.enums.person[this.invoiceType.person]
        } else {
          this.invoiceFlag = false
          this.invoiceInfo = {}
        }
      },
      _getOrderData () {
        // 这里的cartArr从子页面回退过来是个String，不是Array，后台不支持了。MMP
        this.$http.get(`/api/order/confirm`, {
          params: {
            api_token: this.api_token,
            cart_id: this.cartArr
          }
        }).then(res => {
          let data = res.data.data
          if (data.length === 0) {
            this.$router.replace('/my/order')
          }
          let arr = []
          for (let i in data) {
            if (data.hasOwnProperty(i)) {
              if (i === 'price') {
                this.price = data[i]
              } else {
                arr.push(data[i])
              }
            }
          }
          this.list = arr
        })
      },
      _getBAddress () {
        this.$http.get(`/mobile/?act=member_address&op=address_list&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let arr = res.data.data.address_list.filter(item => {
              return item.is_default === '1'
            })
            this.B_address = arr[0]
          }
        })
      },
      ...mapMutations([
        'SET_ADDRESS_TYPE',
        'SET_MAKE_ORDER'
      ])
    },
    activated () {
      // 通过购物车那里传来的cart_id取对应数据
      if (Array.isArray(this.$route.query.cartId)) {
        this.cartArr = this.$route.query.cartId
      } else {
        this.cartArr = []
        this.cartArr.push(this.$route.query.cartId)
      }
      if (parseInt(this.member_class) === 2) {
        this.member_c = false
        this._getBAddress()
      }
      this._getOrderData()
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
        console.log(value)
        return value.replace(/\s/g, '')
      },
      format (num) {
        return (100 * num).toFixed(0) / 100
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
          this._getInvoice()
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
      margin-bottom: 15px;
      .border{
        height: 5px;
        width: 100%;
        position: absolute;
        bottom: -5px;
        left: 0;
        background: url('../../assets/product/border.png');
      }
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
          width: 18.6667vw;
          height: 100%;
        }
        .right{
          width: 69.3333vw;
          height: 100%;
          padding-right: 10px;
          p{
            width: 100%;
            white-space: normal;
            word-break: break-all;
            &~p{
              margin-top: 6px;
            }
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
            width: 66vw;
            height: 14px;
            .no-wrap
          }
          .price{
            display: flex;
            justify-content: space-between;
            .count{
              span{
                font-size: @font-size-medium;
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
    .modal{
      width: 70vw;
      // min-height: 40vh;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      background: #fff;
      text-align: center;
      border-radius: 10px;
      z-index: 2;
      overflow: hidden;
      .title{
        line-height: 40px;
      }
      .item{
        padding-bottom: 6px;
        .name{
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          height: 30px;
          align-items: center;
        }
        .area{
          span{
            color: #666;
            line-height: 20px;
          }
        }
      }
      .icon {
        width: 1.3em; height: 1.3em;
        fill: #333;
        overflow: hidden;
        &.tran{
          transform: rotate(180deg)
        }
      }
    }
    .mask{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
      z-index: 1;
    }
  }
</style>
