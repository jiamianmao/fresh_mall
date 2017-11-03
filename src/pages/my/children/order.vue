<template>
  <transition name='slide'>
    <div class="container">
      <x-title>我的订单</x-title>
      <tab :active-color='activeColor' :line-width=1 v-model="index">
        <tab-item v-for="(item, index) in list" :key="index">{{item}}</tab-item>
      </tab>
      <div class="order_wrapper">
        <!-- <div class="not_order"><img src="../../../assets/my/not_order.png"></div> -->
        <div class="order">
          <div class="order_desc">
            <div class="order_num vux-1px-b">
              <div class="num">订单编号: <span>201709201113001</span></div>
              <div class="status">等待付款</div>
            </div>
            <div class="goods_wrapper">
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
            </div>
            <div class="address">
              <div class="left">配送地址:</div>
              <div class="right">
                <p>北京市海淀区学院XXX校区156号5131</p>
                <p>王老师 181378552255</p>
              </div>
            </div>
          </div>
          <div class="count vux-1px-t">
            <div class="text">
              <span>共 <strong>8</strong> 件</span>
              <span class='pay'>实付: <strong>¥275.6</strong></span>
            </div>
            <div class="btn">
              <button class='left'>取消订单</button>
              <button class='right'>去支付</button>
            </div>
          </div>
        </div>
        <div class="order">
          <div class="order_desc">
            <div class="order_num vux-1px-b">
              <div class="num">订单编号: <span>201709201113001</span></div>
              <div class="status">等待付款</div>
            </div>
            <div class="goods_wrapper">
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
            </div>
            <div class="address">
              <div class="left">配送地址:</div>
              <div class="right">
                <p>北京市海淀区学院XXX校区156号5131</p>
                <p>王老师 181378552255</p>
              </div>
            </div>
          </div>
          <div class="count vux-1px-t">
            <div class="text">
              <span>共 <strong>8</strong> 件</span>
              <span class='pay'>实付: <strong>¥275.6</strong></span>
            </div>
            <div class="btn">
              <button class='left'>取消订单</button>
              <button class='right'>去支付</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Tab, TabItem } from 'vux'
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
        index: 0
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.index = this.status
      })
    },
    methods: {
    },
    components: {
      XTitle,
      Tab,
      TabItem
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
      height: calc(~"100vh - 94px");
      position: relative;
      .not_order{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 131px;
        height: 113px;
        img{
          width: 100%;
          height: 100%;
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
            width: 19.733vw;
            height: 26px;
            border: 1px solid red;
            line-height: 26px;
            text-align: center;
            background: #fff;
            font-size: @font-size-small;
            &.left{
              border: 1px solid #000;
              margin-right: 10px;
            }
            &.right{
              border: 1px solid @color;
              color: @color;
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
