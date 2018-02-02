<template>
  <transition name='slide'>
    <div class="container">
      <x-title>我的订单</x-title>
      <tab :active-color='activeColor' :line-width=1 v-model="index">
        <tab-item v-for="(item, index) in list" :key="index">{{item}}</tab-item>
      </tab>
      <div class="order_wrapper">
        <div class="not_order" v-if='!orderList.length'>
          <img src="../../../assets/my/not_order.png">
          <p>您还没有订单</p>
        </div>
        <div class="order" v-for='order of orderList' :id='order.order_sn'>
          <div class="order_desc">
            <div class="order_num vux-1px-b">
              <div class="num">订单编号: <span>{{order.order_sn}}</span></div>
              <div class="status" v-if='order.order_state === 0'>交易关闭</div>
              <div class="status" v-if='order.order_state === 10'>等待付款</div>
              <div class="status" v-if='order.order_state === 20'>等待发货</div>
              <div class="status" v-if='order.order_state === 30'>等待收货</div>
              <div class="status" v-if='order.order_state === 40'>交易成功</div>
            </div>
            <div class='order_num shipping vux-1px-b' v-if='order.order_common && order.order_common.shipping_company'>
              <div class='num'>{{ order.order_common.shipping_company }}: <span>{{ order.order_common.shipping_number }}</span></div>
            </div>
            <div class="goods_wrapper">
              <div class="goods vux-1px-b" v-for='goods of order.order_good'  @click='toProduct(goods.goods_id)'>
                <div class="image">
                  <img v-lazy="goods.goods_image">
                </div>
                <div class="content">
                  <p>{{ goods.goods_name }}</p>
                  <div class='center'>
                    <span>{{ goods.goods_unit || ' ' }}</span>
                    <span v-show='order.delivery && order.delivery.dlyo_state === 20'>货物已到达门店</span>
                    <span v-show='order.delivery && order.delivery.dlyo_state === 10 && order.order_state === 30'>运输中</span>
                  </div>
                  <div class="price">
                    <strong>¥{{goods.goods_price}}</strong>
                    <strong>x{{goods.goods_num}}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="address" v-if='order.delivery_type < 3'>
              <div class="left">配送地址:</div>
              <div class="right">
                <p>{{order.order_common.reciver_info.area_info | blank}}{{order.order_common.reciver_info.address}}</p>
                <p>{{order.order_common.reciver_info.true_name}} {{order.order_common.reciver_info.tel_phone}}</p>
                <div class='add_bottom vux-1px-t' v-if='order.delivery_type === 2'>
                  <p>由<b>{{ order.delivery.company_name }}</b>为您配送</p>
                  <p>地址: {{ order.delivery.location }}</p>
                  <p>联系电话: {{ order.delivery.contact_phone }}</p>
                </div>
              </div>
            </div>
            <div class="address" v-else>
              <div class="left">门店自提:</div>
              <div class="right" v-if='order.delivery'>
                <p><strong>{{ order.delivery.company_name }}</strong>营业时间: {{ order.delivery.saletime }}</p>
                <p>{{ order.delivery.location }}</p>
                <p>联系电话: {{ order.delivery.contact_phone }}</p>
              </div>
            </div>
          </div>
          <div class="count vux-1px-t">
            <div class="text">
              <span>共 <strong>{{ order.sum }}</strong> 件</span>
              <span class='pay' v-if='order.order_state === 10'>合计: <strong>¥{{order.order_amount}}</strong></span>
              <span class='pay' v-else>实付: <strong>¥{{order.order_amount}}</strong></span>
            </div>
            <div class="btn">
              <button class='left' v-if='order.order_state === 10' @click='cancle_nopay(order.order_id)'>取消订单</button>
              <button class='left' v-if='order.order_state === 20 && !order.lock_state' @click='cancle_pay(order.order_id)'>取消订单</button>
              <button class='center' v-if='order.order_state === 20 && order.lock_state'>退款中</button>
              <button class='left' v-if='order.order_state === 40 || order.order_state === 0' @click='del(order.order_id)'>删除订单</button>
              <button class='right' v-if='order.order_state === 10 && order.payment_code !== "offline"' @click='pay(order.order_sn, order.order_amount, order.order_id)'>去支付</button>
              <button class='right' v-if='order.order_state === 30' @click='confirmGoods(order.order_id)'>确认收货</button>
              <button class='right' v-if='order.order_state === 40 && order.evaluation_state === 1' @click='seeRate(order.order_id)'>查看评价</button>
              <button class='right' v-if='order.order_state === 40 && order.evaluation_state === 0' @click='rate(order.order_id)'>评价</button>
            </div>
          </div>
        </div>
      </div>
      <confirm :confirmBtnText='confirmBtnText' :cancelBtnText='cancelBtnText' :tel='false' :text='text' ref='confirm' @confirm='sure' :title='title'></confirm>
      <alert v-model='show' title='提示'>取消订单申请已提交<br />等待商家确认后<br />订单金额将退还到您的支付账户</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Confirm from '@/components/confirm/confirm'
  import { Tab, TabItem, Alert } from 'vux'
  import storage from 'good-storage'
  import $ from 'jquery'
  
  const PAY_NO = 1
  const PAY_YES = 2
  const DEL = 3
  const CONFIRMGOODS = 4

  export default {
    props: {
      status: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        activeColor: '#5eb29e',
        lineWidth: 1,
        list: ['全部', '待付款', '待发货', '待收货', '待评价'],
        index: 0,
        orderList: [],  // 拿去渲染用的
        init: [], // 用来存储原始信息的
        flag: false, // 仅仅是增加一个判断是不是重新请求数据的
        text: '',
        title: '',
        show: false,
        confirmBtnText: '确定',
        cancelBtnText: '取消'
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.hash = this.$route.query.hash
      this._getOrder()
    },
    mounted () {
      this.$nextTick(() => {
        this.index = this.$route.query.status ? this.$route.query.status : this.status
      })
    },
    updated () {
      if (this.hash && !this.index) {
        console.log(this.hash)
        console.log($(`#${this.hash}`))
        $('html, body').animate({
          scrollTop: $(`#${this.hash}`).offset().top
        }, 1000)
        this.hash = null
      }
    },
    methods: {
      // 未付款取消订单
      cancle_nopay (id) {
        this.order_id = id
        this.type = PAY_NO
        this.text = '您要取消订单吗？'
        this.confirmBtnText = '确定'
        this.cancelBtnText = '取消'
        this.$refs.confirm.show()
      },
      // 已付款取消订单
      cancle_pay (id) {
        this.order_id = id
        this.type = PAY_YES
        this.text = '您要取消订单吗？'
        this.confirmBtnText = '确定'
        this.cancelBtnText = '取消'
        this.$refs.confirm.show()
      },
      del (id) {
        this.order_id = id
        this.type = DEL
        this.text = '您要删除订单吗？'
        this.confirmBtnText = '确定'
        this.cancelBtnText = '取消'
        this.$refs.confirm.show()
      },
      pay (sn, sum, id) {
        let sums = Number(sum)
        this.$router.push({
          path: '/pay',
          query: {
            sum: sums,
            arr: sn,
            id
          }
        })
      },
      rate (id) {
        this.$router.push({
          path: '/my/rate',
          query: {
            id
          }
        })
      },
      sure () {
        if (this.type === PAY_NO) {
          this.$http.post(`/mobile/?act=member_order&op=order_cancel&api_token=${this.api_token}`, {
            order_id: this.order_id
          }).then(res => {
            this._getOrder()
          })
        } else if (this.type === PAY_YES) {
          this.$http.post(`/mobile/?act=member_refund&op=refund_all_post&api_token=${this.api_token}`, {
            order_id: this.order_id,
            type: 1
          }).then(res => {
            if (res.data.status === 200) {
              this.show = true
              this._getOrder()
            }
          })
        } else if (this.type === DEL) {
          this.$http.post(`/api/order/delete_order?api_token=${this.api_token}`, {
            order_id: this.order_id
          }).then(res => {
            if (res.data.status === 200) {
              this._getOrder()
            }
          })
        } else if (this.type === CONFIRMGOODS) {
          this.$http.post(`/mobile/?act=member_order&op=order_receive&api_token=${this.api_token}`, {
            order_id: this.order_id
          }).then(res => {
            if (res.data.status === 200) {
              this._getOrder()
            }
          })
        }
      },
      confirmGoods (id) {
        this.order_id = id
        this.type = CONFIRMGOODS
        this.text = '您是否已收到该订单商品？'
        this.confirmBtnText = '已收货'
        this.cancelBtnText = '未收货'
        this.$refs.confirm.show()
      },
      seeRate (id) {
        this.$router.push(`/rate?order=${id}`)
      },
      toProduct (id) {
        this.$router.push(`/product/${id}`)
      },
      _getOrder () {
        this.$http.get(`/api/order/list?api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            let data = res.data.data
            data.forEach(item => {
              let num = 0
              item.order_good.forEach(x => {
                num += x.goods_num
              })
              item.sum = num
            })
            this.orderList = data
            this.init = data
            this.flag = !this.flag // 当操作完成后 重洗获取最新数据后无法触发index的改变 所以增加了一个flag状态来维护数据的改变
          }
        })
      }
    },
    filters: {
      blank (value) {
        return value.replace(/\s/g, '')
      }
    },
    components: {
      XTitle,
      Tab,
      TabItem,
      Confirm,
      Alert
    },
    watch: {
      index (newVal) {
        if (newVal === 0) {
          this.orderList = this.init
        } else if (newVal === 1) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 10
          })
        } else if (newVal === 2) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 20
          })
        } else if (newVal === 3) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 30
          })
        } else if (newVal === 4) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 40 && item.evaluation_state === 0
          })
        }
      },
      flag () {
        if (this.index === 0) {
          this.orderList = this.init
        } else if (this.index === 1) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 10
          })
        } else if (this.index === 2) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 20
          })
        } else if (this.index === 3) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 30
          })
        } else if (this.index === 4) {
          this.orderList = this.init
          this.orderList = this.orderList.filter(item => {
            return item.order_state === 40 && item.evaluation_state === 0
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: #f4f4f4;
    .order_wrapper{
      width: 100vw;
      position: relative;
      background: #F4F4F4;
      .not_order{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 131px;
        height: 78px;
        img{
          width: 100%;
          height: 100%;
        }
        p{
          position: absolute;
          font-size: @font-size-small;
          bottom: -26px;
          left: 0;
          width: 100%;
          color: #ababab;
          text-align: center;
        }
      }
      .order{
        width: 100%;
        background: #fff;
        &~.order{
          margin-top: 10px;
        }
        .order_desc{
          width: 100%;
          padding-left: 15px;
          .order_num{
            padding-right: 15px;
            width: 100%;
            height: 45px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            font-size: @font-size-medium;
            span{
              font-size: @font-size-small;
            }
            .status{
              color: @color;
            }
          }
          .goods_wrapper{
            width: 100%;
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
                .price{
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  font-size: @font-size-small;
                }
                .center{
                  display: flex;
                  // flex-flow: row nowrap;
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
          }
          .address{
            display: flex;
            flex-flow: row nowrap;
            padding: 11px 15px 11px 0;
            font-size: @font-size-small;
            line-height: 20px;
            .left{
              width: 68px;
              @font-size: @font-size-medium;
            }
            .right{
              flex: 1;
              min-width: 0;
              // 这里是因为现在的接口里传回来的是一组单词，不会换行显示,生产环境中不需要
              word-break: break-all;
              word-wrap: break-word;
              strong{
                margin-right: 12px;
              }
            }
            .add_bottom{
              padding-top: 11px;
              margin-top: 11px;
            }
          }
        }
        .count{
          width: 100%;
          height: 49px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          font-size: 0;
          .text{
            font-size: @font-size-small;
            .pay{
              font-size: @font-size-medium;
              margin-left: 12px;
            }
          }
          button{
            min-width: 19.733vw;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background: #fff;
            font-size: @font-size-small-s;
            &.left{
              border: 1px solid #000;
              margin-right: 10px;
            }
            &.right{
              border: 1px solid @color;
              color: @color;
            }
            &.center{
              border: 1px solid transparent;
              color: red;
            }
          }
        }
      }
    }
  }
  .slide-enter-active,.slide-leave-active{
    transition: all .3s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
    
</style>
