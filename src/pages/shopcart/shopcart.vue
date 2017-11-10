<template>
  <div>
    <x-title :bottom='false' class='title'>购物车</x-title>

    <scroll :data='cartdata.cart_list' class='scroll'>
      <div class="order-wrapper">
        <div class="order" v-for='(goodsItem, index) of cartdata.cart_list'>
          <div class="top">
            <div class='icon' @click='selectBrand(goodsItem.brand_id, goodsItem.goods)'>
              <img src="../../assets/selectAdd/selected.png" v-if='activeArr[index] && activeArr[index].brandId === goodsItem.brand_id'>
              <img src="../../assets/selectAdd/select.png" v-else>
            </div>

            <div class="name" @click='toBrand(goodsItem.brand_id)'>
              <span>{{goodsItem.brand_name.brand_name}}</span><x-icon type="ios-arrow-right" size="18"></x-icon>
            </div>
          </div>
          <div class="bottom" v-for='(item, keyIndex) of goodsItem.goods'>
            <div class='icon' @click='selectGoods(goodsItem.brand_id, item)'>
              <img src="../../assets/selectAdd/selected.png" v-if='activeArr[index] && activeArr[index].goodsData[keyIndex] && activeArr[index].goodsData[keyIndex].goodsId === item.goods_id'>
              <img src="../../assets/selectAdd/select.png" v-else>
            </div>
            <div class="right">
              <div class="brand">
                <img v-lazy='item.goods_image_url'>
              </div>
              <div class="desc">
                <div class="name">{{item.goods_name}}</div>
                <div class="spec">{{item.goods_spec}}</div>
                <h3 class="price">{{item.goods_price}}</h3>
                <div class='wrapper'>
                  <div class='box minus' @click='minus(item.goods_num, item.cart_id)' ref='minus'>-</div>
                  <div class='count'>{{item.goods_num}}</div>
                  <div class='box add' @click='add(item.goods_num, item.cart_id)'>+</div>
                </div>
                <div class="close" @click='del(item.cart_id)'>
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
      <div class='icon' @click='whole'>
        <img src="../../assets/selectAdd/selected.png" v-if='all'>
        <img src="../../assets/selectAdd/select.png" v-else>
      </div>
      <span class='all'>全选</span>
      <p class='num'><strong>{{cartType}}</strong>种共<strong>{{cartCount}}</strong>件</p>
      <p>合计:<strong>¥{{sum}}</strong></p>
      <button>结算</button>
    </div>
    <confirm v-model="show" title='确认删除吗？' content='再考虑考虑吧' @on-confirm='onConfirm'></confirm>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import Storage from 'good-storage'
  import { Confirm } from 'vux'
  export default {
    data () {
      return {
        init: true, // 是否是初次进来，维护初次进来全选
        active: false,  // 控制选中状态
        show: false,  // modal框
        cartdata: {},
        activeArr: [],
        currentClick: 0, // 维护当前点击要删除的，保存cart_id
        sum: 0,       // 维护总价
        cartCount: 0, // 维护多少件
        cartType: 0, // 维护多少种
        all: false
      }
    },
    created () {
      this.api_token = Storage.get('api_token')
      this._getShopCart()
    },
    mounted () {
      // this.$refs.minus.style.color = '#999'
    },
    methods: {
      minus (quantity, cartId) {
        if (quantity === 1) {
          return
        }
        this._changeNum(parseInt(quantity) - 1, cartId)
      },
      add (quantity, cartId) {
        this._changeNum(parseInt(quantity) + 1, cartId)
      },
      del (currentClick) {
        this.show = true
        this.currentClick = currentClick
      },
      toBrand (id) {
        // 去品牌店铺
        console.log(id)
      },
      onConfirm () {
        this.$http({
          url: `/mobile/?act=member_cart&op=cart_del&api_token=${this.api_token}`,
          method: 'POST',
          data: {
            cart_id: this.currentClick
          },
          transformRequest: [data => {
            let ret = []
            for (let x in data) {
              ret += encodeURIComponent(x) + '=' + encodeURIComponent(data[x]) + '&'
            }
            return ret
          }]
        }).then(res => {
          if (res.data.status === 200) {
            this._getShopCart()
          }
        })
      },
      selectBrand (brandId, goods) {
        let idx = this.activeArr.findIndex(item => {
          return item.brandId === brandId
        })
        let data = []
        goods.forEach(item => {
          data.push({
            goodsId: item.goods_id
          })
        })
        if (idx === -1) {
          this.activeArr.push({
            brandId,
            goodsData: data
          })
        } else {
          this.activeArr.splice(idx, 1)
        }
      },
      selectGoods (brandId, item) {
        let idx = this.activeArr.findIndex(x => {
          return x.brandId === brandId
        })
        if (idx === -1) {
          this.activeArr.push({
            brandId,
            goodsData: [{
              goodsId: item.goods_id
            }]
          })
        } else {
          if (this.activeArr[idx].goodsData.length) {
            let index = this.activeArr[idx].goodsData.findIndex(x => {
              return x.goodsId === item.goods_id
            })
            // 当前商品没有active了
            if (index === -1) {
              this.activeArr[idx].goodsData.push({
                goodsId: item.goods_id
              })
              // 当前商品已经active了
            } else {
              this.activeArr[idx].goodsData.splice(index, 1)
            }
          } else {
            this.activeArr[idx].goodsData = [{
              goodsId: item.goods_id
            }]
          }
        }
      },
      whole () {
        if (this.all) {
          this.activeArr = []
        } else {
          this._all()
        }
      },
      _all () {
        this.cartdata.cart_list.forEach(item => {
          let arr = []
          item.goods.forEach(x => {
            arr.push({
              goodsId: x.goods_id
            })
          })
          this.activeArr.push({
            brandId: item.brand_id,
            goodsData: arr
          })
        })
      },
      _getShopCart () {
        this.$http.get(`/mobile/?act=member_cart&op=cart_list&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.cartdata = res.data.data
            this.sum = res.data.data.sum
            this.cartCount = res.data.cart_count
            if (this.init) {
              this.init = false
              this._all()
            }
          }
        })
      },
      _changeNum (quantity, cartId) {
        this.$http.post(`/mobile/?act=member_cart&op=cart_edit_quantity&api_token=${this.api_token}`, {
          cart_id: cartId,
          quantity
        }).then(res => {
          this._getShopCart()
        })
      }
    },
    watch: {
      cartdata () {
        let sum = 0
        let cartCount = 0
        this.activeArr.forEach((x, idx, arr) => {
          let one = this.cartdata.cart_list.find(y => {
            return y.brand_id === x.brandId
          })
          // 通过商品的id来拿到商品的数量和单价来维护总价
          x.goodsData.forEach(item => {
            let two = one.goods.find(y => {
              return y.goods_id === item.goodsId
            })
            sum += parseInt(two.goods_price) * parseInt(two.goods_num)
            cartCount += parseInt(two.goods_num)
          })
          let xLen = x.goodsData.length
          let oneLen = one.goods.length
          if (xLen === oneLen) {
            //
          } else if (xLen === 0) {
            arr.splice(idx, 1)
          }
        })
        this.sum = sum
        this.cartCount = cartCount
      },
      activeArr: {
        handler (newVal) {
          let sum = 0
          let cartCount = 0
          let cartType = 0
          let flag = true
          newVal.forEach((x, idx, arr) => {
            let one = this.cartdata.cart_list.find(y => {
              return y.brand_id === x.brandId
            })
            // 通过商品的id来拿到商品的数量和单价来维护总价
            x.goodsData.forEach(item => {
              let two = one.goods.find(y => {
                return y.goods_id === item.goodsId
              })
              sum += parseInt(two.goods_price) * parseInt(two.goods_num)
              cartCount += parseInt(two.goods_num)
            })
            let xLen = x.goodsData.length
            let oneLen = one.goods.length
            cartType += xLen
            if (xLen === oneLen) {

              // 如果品牌里商品列表为空，则去掉这个品牌
            } else if (xLen === 0) {
              arr.splice(idx, 1)
              flag = false
            } else {
              flag = false
            }
          })
          if (newVal.length !== this.cartdata.cart_list.length) {
            flag = false
          }
          this.sum = sum
          this.cartCount = cartCount
          this.cartType = cartType
          this.all = flag
        },
        deep: true
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
