<template>
  <div class="container">
    <x-title>确认订单</x-title>
    <div class="address">
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

    <div class="order_desc">
      <div class="name vux-1px-b">
        <span>中天杨业</span>
        <span class='tel'>企业联系电话：1234-56789012</span>
      </div>
      <div class="goods_box vux-1px-b">
        <div class="left">
          <img src="https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/023b5bb5c9ea15ceeb50a509bd003af33a87b270.jpg">
        </div>
        <div class="right">
          <div class="title">中天羊肉片</div>
          <div class="spec">300g装</div>
          <div class="price">
            <strong>¥29</strong>
            <span class="count">x <span>4</span></span>
          </div>
        </div>
      </div>
      <div class="leave_word vux-1px-b">
        <div class="left">买家留言:</div>
        <div class="right">
          <textarea placeholder='选填（45字以内）' maxlength='45'></textarea>
        </div>
      </div>
      <div class="price vux-1px-b">
        <span>以上产品由京东配送</span>
        <span>小计<strong>:291.5</strong></span>
      </div>
    </div>

    <div class="order_desc">
      <div class="name vux-1px-b">
        <span>中天杨业</span>
        <span class='tel'>企业联系电话：1234-56789012</span>
      </div>
      <div class="goods_box vux-1px-b">
        <div class="left">
          <img src="https://ss1.baidu.com/70cFfyinKgQFm2e88IuM_a/forum/pic/item/023b5bb5c9ea15ceeb50a509bd003af33a87b270.jpg">
        </div>
        <div class="right">
          <div class="title">中天羊肉片</div>
          <div class="spec">300g装</div>
          <div class="price">
            <strong>¥29</strong>
            <span class="count">x <span>4</span></span>
          </div>
        </div>
      </div>
      <div class="leave_word vux-1px-b">
        <div class="left">买家留言:</div>
        <div class="right">
          <textarea placeholder='选填（45字以内）' maxlength='45'></textarea>
        </div>
      </div>
      <div class="price vux-1px-b">
        <span>以上产品由京东配送</span>
        <span>小计<strong>:291.5</strong></span>
      </div>
    </div>

    <divider class='divider'>我是有底线的</divider>

    <div class="invoice vux-1px-t" @click='invoice'>
      <span>发票</span>
      <span>
        纸质 (明细-世纪华联超市)
        <x-icon type="ios-arrow-right" size="18"></x-icon>
      </span>
    </div>

    <div class="sure_order vux-1px-t">
      <div class="left">
        <p><strong>2</strong> 种共 <strong>8</strong> 件</p>
        <p>合计：<strong>¥275.6</strong></p>
      </div>
      <button>确认订单</button>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Divider } from 'vux'
  export default {
    data () {
      return {
      }
    },
    methods: {
      invoice () {
        this.$router.push('/firmorder/invoice')
      }
    },
    components: {
      XTitle,
      Divider
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
      // height: 45px;
      width: 100vw;
      padding: 0 15px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-image: 5 repeating-linear-gradient(-45deg,
        #5d85a4 0, #5d85a4 .5em,
        transparent 0, transparent 1em,
        #e56d66 0, #e56d66 1.5em,
        transparent 0, transparent 2em);
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
      margin-top: 10px;
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
        padding: 15px;
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
      .price{
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
