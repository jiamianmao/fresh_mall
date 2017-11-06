<template>
  <div>
    <x-title :bottom='flag' class='title'>购物车</x-title>

    <scroll :data='cartdata.cart_list' class='scroll'>
      <div class="order-wrapper">
        <div class="order" v-for='goodsItem of cartdata.cart_list'>
          <div class="top">
            <div class='icon'>
              <img src="../../assets/selectAdd/select.png" v-if='active'>
              <img src="../../assets/selectAdd/selected.png" v-else>
            </div>

            <div class="name">
              <span>{{goodsItem.store_name}}</span><x-icon type="ios-arrow-right" size="18"></x-icon>
            </div>
          </div>
          <div class="bottom" v-for='item of goodsItem.goods'>
            <div class='icon'>
              <img src="../../assets/selectAdd/select.png" v-if='active'>
              <img src="../../assets/selectAdd/selected.png" v-else>
            </div>
            <div class="right">
              <div class="brand">
                <img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=485612022,3938103762&fm=58">
              </div>
              <div class="desc">
                <div class="name">{{item.goods_name}}</div>
                <div class="spec">{{item.goods_spec}}</div>
                <h3 class="price">{{item.goods_price}}</h3>
                <div class='wrapper'>
                  <div class='box minus' @click='minus(item.goods_num)' ref='minus'>-</div>
                  <div class='count'>{{item.goods_num}}</div>
                  <div class='box add' @click='add(item.goods_num)'>+</div>
                </div>
                <div class="close" @click='del'>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-close47"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>

    <div class="total vux-1px-t">
      <div class='icon'>
        <img src="../../assets/selectAdd/select.png" v-if='active'>
        <img src="../../assets/selectAdd/selected.png" v-else>
      </div>
      <span class='all'>全选</span>
      <p class='num'><strong>2</strong>种共<strong>{{cartdata.cart_count}}</strong>件</p>
      <p>合计:<strong>¥{{cartdata.sum}}</strong></p>
      <button>结算</button>
    </div>
    <confirm v-model="show" title='确认删除吗？' content='再考虑考虑吧'></confirm>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import { Confirm } from 'vux'
  export default {
    data () {
      return {
        flag: false, // 控制x-title组件是否有border-bottom
        active: false,  // 控制选中状态
        show: false,  // modal框
        cartdata: {},
        activeArr: []
      }
    },
    created () {
      this._getShopCart()
    },
    mounted () {
      // this.$refs.minus.style.color = '#999'
    },
    methods: {
      minus (num) {
        if (this.count === 1) {
          return
        }
        this.count--
      },
      add (num) {
        console.log(num)
        this.num++
      },
      del () {
        this.show = true
      },
      _getShopCart () {
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/shopcart').then(res => {
          if (res.data.status === 200) {
            this.cartdata = res.data.data
          }
        })
      }
    },
    watch: {
      count () {
        if (this.count === 1) {
          // this.$refs.minus.style.color = '#999'
        } else {
          // this.$refs.minus.style.color = '#000'
        }
      }
    },
    components: {
      XTitle,
      Confirm,
      Scroll
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .title{
    position: relative;
    z-index: 1;
  }
  .scroll{
    width: 100vw;
    height: calc(~"100vh - 150px");
  }
  .order-wrapper{
    width: 100vw;
    padding: 0 15px 0 12px;
    .order{
      width: 100%;
      padding-top: 10px;
      .top{
        height: 40px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .name{
          flex: 1;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          span{
            margin-right: 15px;
          }
        }
      }
      .bottom{
        height: 92px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .right{
          height: 100%;
          flex: 1;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          .brand{
            width: 82px;
            height: 82px;
            margin-right: 10px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .desc{
            flex: 1;
            height: 100%;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-around;
            position: relative;
            .name{
              width: 180px;
              font-size: @font-size-medium;
              .no-wrap
            }
            .spec{
              color: #666;
              font-size: @font-size-small;
            }
            .price{
              font-size: @font-size-large;
            }
            .wrapper{
              position: absolute;
              right: 15px;
              bottom: 10px;
              display: flex;
              flex-flow: row nowrap;
              .box{
                width: 20px;
                height: 20px;
                border: 1px solid #999;
                line-height: 20px;
                text-align: center;
                font-size: 16px;
                &.minus{
                  color: #999;
                }
              }
              .count{
                height: 20px;
                line-height: 20px;
                margin: 0 20px;
                font-size: @font-size-medium;
              }
            }
            .close{
              position: absolute;
              right: 0;
              top: 7px;
              color: #666;
              .icon {
                width: 1em; height: 1em;
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
  .total{
    position: fixed;
    background: #fff;
    padding-left: 15px;
    bottom: 49px;
    left: 0;
    width: 100vw;
    height: 49px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: @font-size-medium;
    justify-content: space-between;
    .icon{
      margin-right: 0;
    }
    .all{
      color: #666;
      position: relative;
      left: -5px;
    }
    button{
      width: 104px;
      height: 100%;
      border: 0;
      background: @color;
      color: #fff;
      letter-spacing: 4px;
    }
  }
  .icon{
    width: 18px;
    margin-right: 15px;
    img{
      width: 18px;
      height: 18px;
    }
  }
</style>
