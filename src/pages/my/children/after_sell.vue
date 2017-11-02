<template>
  <transition name='slide'>
    <div class="container">
      <x-title>售后服务</x-title>
      <div class="order_wrapper">
        <div class="order">
          <div class="order_desc">
            <div class="order_num">
              <div class="num">订单编号: <span>201709201113001</span></div>
              <div class="status">等待付款</div>
            </div>
            <div class="goods_wrapper">
              <div class="goods vux-1px-t">
                <div class="image">
                  <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
                </div>
                <div class="content">
                  <p>中天特羔羊肉片</p>
                  <span>300g装</span>
                  <div class="price">
                    <strong>¥29.9</strong>
                  </div>
                </div>
              </div>
              <div class="goods vux-1px-t">
                <div class="image">
                  <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
                </div>
                <div class="content">
                  <p>中天特羔羊肉片</p>
                  <span>300g装</span>
                  <div class="price">
                    <strong>¥29.9</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="count vux-1px-t">
            <div class="text">
              <span>共 <strong>8</strong> 件</span>
              <span class='pay'>实付: <strong>¥275.6</strong></span>
            </div>
            <div class="btn">
              <button class='left'>申请退款</button>
              <button class='right'>申请退款</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
      }
    },
    mounted () {
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
            &.left{
              border: 1px solid #999;
              color: #999;
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
