<template>
  <transition name='slide'>
    <div class="container">
      <x-title>售后服务</x-title>
      <div class="order_wrapper">
        <div class="order" v-if='arr.length > 0' v-for='obj of arr'>
          <div class="order_desc">
            <div class="order_num">
              <div class="num">订单编号: <span>{{obj.order_sn}}</span></div>
              <div class='status' v-if='obj.lock_state === 1 && obj.refund_return_state === 2'>退款成功</div>
              <div class='status' v-if='obj.lock_state === 1 && obj.refund_return_state === 3'>退款关闭</div>
            </div>
            <div class="goods_wrapper">
              <div class="goods vux-1px-t" v-for='goods of obj.order_good' @click='toProduct(goods.goods_id)'>
                <div class="image">
                  <img v-lazy="goods.goods_image">
                </div>
                <div class="content">
                  <p>{{goods.goods_name}}</p>
                  <span>{{goods.goods_unit}}</span>
                  <div class="price">
                    <strong>¥{{goods.goods_price}}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="count vux-1px-t">
            <div class="text">
              <span>共 <strong>{{ obj.sum }}</strong> 件</span>
              <span class='pay'>实付: <strong>¥{{ obj.order_amount }}</strong></span>
            </div>
            <div class="btn">
              <button class='right' @click='refund(obj.order_id, 0)' v-if='obj.lock_state === 0'>申请退款</button>
              <button class='applyed' @click='refund(obj.order_id, 1)' v-if='obj.lock_state === 1 && obj.refund_return_state === 1'>申请退款</button>
            </div>
          </div>
        </div>
      </div>
      <div class="not_order" v-if='!arr.length'>
        <img src="../../../assets/my/not_order.png">
        <p>您还没有订单</p>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        arr: []
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this._getDetail()
    },
    methods: {
      refund (id, num) {
        if (num > 0) {
          this.$router.push(`/my/refund?id=${id}&status=${num}`)
        } else {
          this.$router.push(`/my/refund?id=${id}`)
        }
      },
      toProduct (id) {
        this.$router.push(`/product/${id}`)
      },
      _getDetail () {
        this.$http.get(`/api/order/list?api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            res.data.data.filter(item => {
              if (item.order_state === 30) {
                this.arr.push(item)
              }
            })
            this.arr.forEach(item => {
              let sum = 0
              item.order_good.forEach(item => {
                sum += Number.parseInt(item.goods_num)
              })
              item.sum = sum
            })
          }
        })
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: #f4f4f4;
    .order_wrapper{
      width: 100vw;
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
            width: 74px;
            height: 26px;
            border: 1px solid red;
            text-align: center;
            background: #fff;
            font-size: @font-size-small;
            &.right{
              border: 1px solid @color;
              color: @color;
            }
            &.applyed{
              color: #999;
              border: 1px solid #999;
            }
          }
        }
      }
    }
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
  }
  .slide-enter-active,.slide-leave-active{
    transition: all .3s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
    
</style>
