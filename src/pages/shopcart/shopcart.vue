<template>
  <div>
    <x-title :bottom='false' class='title'>购物车</x-title>

    <scroll :data='cartdata' class='scroll'>
      <div class="order-wrapper">
        <div class="order" v-for='(goodsItem, index) of cartdata'>
          <div class="top">
            <div class='icon' @click='selectBrand(goodsItem.brand_id, goodsItem.goods)'>
              <img src="../../assets/selectAdd/selected.png" v-if='ok[index]'>
              <img src="../../assets/selectAdd/select.png" v-else>
            </div>

            <div class="name" @click='toBrand(goodsItem.brand_id, goodsItem.brand_name)'>
              <span>{{goodsItem.brand_name}}</span><x-icon type="ios-arrow-right" size="18"></x-icon>
            </div>
          </div>
          <div class="bottom" v-for='(item, keyIndex) of goodsItem.goods'>
            <div class='icon' @click='selectGoods(goodsItem.brand_id, item)'>
              <img src="../../assets/selectAdd/selected.png" v-if='cartType.indexOf(item.goods_id) > -1'>
              <img src="../../assets/selectAdd/select.png" v-else>
            </div>
            <div class="right">
              <div class="brand" @click='toProduct(item.goods_id)'>
                <img v-lazy='item.goods_image'>
              </div>
              <div class="desc">
                <h3 class="name">{{item.goods_name}}</h3>
                <div class="spec">{{item.goods_unit}}</div>
                <h3 class="price">{{item.goods_price}}</h3>
                <div class='wrapper'>
                  <div class='box minus' @click='minus(item.goods_num, item.cart_id)' :class='{"minusNums": item.goods_num > 1}'>-</div>
                  <input class='count' v-model.number="item.goods_num" @blur='_changeNum(item.goods_num, item.cart_id)'></input>
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
      <div class='btm' @click='whole'>
        <img src="../../assets/selectAdd/selected.png" v-if='all'>
        <img src="../../assets/selectAdd/select.png" v-else>
        <p class='all'>全选</p>
      </div>
      <!-- <p class='num' style='opacity: 0;'><strong>{{cartType.length}}</strong>种共<strong>{{cartCount}}</strong>件</p> -->
      <p>合计:<strong>¥{{sum | format}}</strong></p>
      <button @click='submit'>结算</button>
    </div>
    <alert v-model="alertFlag" title='提示'>{{msg}}</alert>
    <confirm ref='confirm' :tel='false' title='确认删除吗？' @confirm='onConfirm'></confirm>
  </div>
</template>
<script>
  /* eslint-disable */
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import Confirm from '@/components/confirm/confirm'
  import Storage from 'good-storage'
  import { mapMutations, mapGetters } from 'vuex' 
  export default {
    data () {
      return {
        init: true, // 是否是初次进来，维护初次进来全选
        active: false,  // 控制选中状态
        cartdata: [],
        activeArr: [],
        currentClick: 0, // 维护当前点击要删除的，保存cart_id
        sum: 0,       // 维护总价
        cartCount: 0, // 维护多少件
        cartType: [], // 维护多少种,其实是维护一个选中的goods_id,既能维护多少种，又能维护产品的active
        all: false,
        alertFlag: false,
        msg: '您还没有添加商品呢',
        ok: [] // 维护品牌
      }
    },
    created () {
      this.api_token = Storage.get('api_token')
      this._getShopCart()
      if (this.makeOrder) {
        this.alertFlag = true
        this.msg = '订单已生成,请在30分钟内付款'
        this.SET_MAKE_ORDER(false)
        setTimeout(() => {
          this.alertFlag = false
        }, 2000)
      }
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
        this.$refs.confirm.show()
        this.currentClick = currentClick
      },
      toBrand (id, name) {
        // 去品牌店铺
        this.$router.push({
          path: 'brandGoodsList',
          query: {
            id,
            name
          }
        })
      },
      toProduct (id) {
        this.$router.push(`/product/${id}`)
      },
      // 确认删除商品
      onConfirm () {
        this.$http.post(`/mobile/?act=member_cart&op=cart_del&api_token=${this.api_token}`, {
          cart_id: this.currentClick
        }).then(res => {
          if (res.data.status === 200) {
            // 删除商品后需要在activeArr里删除对应的商品
            this.activeArr.forEach((item, idx) => {
              item.goodsData.forEach((x, index) => {
                if (x.cartId === this.currentClick) {
                  item.goodsData.splice(index, 1)
                  // 判断当前品牌下的商品是不是让删完了
                  if (item.goodsData.length === 0) {
                    this.activeArr.splice(idx, 1)
                  }
                }
              })
            })
            this._getShopCart()
          }
        })
      },
      selectBrand (brandId, goods) {
        // 判断选中的有没有该品牌
        let idx = this.activeArr.findIndex(item => {
          return item.brandId === brandId
        })
        // 这里和下边的this.cartdata.find 冗余了 多了个遍历
        let index = this.cartdata.findIndex(item => {
          return item.brand_id === brandId
        })
        // 把goods数据做了层改造 貌似没多大意义
        let data = []
        goods.forEach(item => {
          data.push({
            goodsId: item.goods_id,
            cartId: item.cart_id
          })
        })
        // 拿到原数据里的对应的品牌数据 来判断当前选中的是否该品牌下的所有商品
        let items = this.cartdata.find(item => {
          return item.brand_id === brandId
        })
        // 不是该品牌下的所有商品（没有该品牌或品牌下商品数量没选够）
        if (idx === -1 || this.activeArr[idx].goodsData.length !== items.goods.length) {
          // 先把该品牌下的商品清空后再加上所有商品
          if (idx > -1) this.activeArr.splice(idx, 1)
          this.activeArr.push({
            brandId,
            goodsData: data
          })
          this.ok[index] = true
        } else {
          this.activeArr.splice(idx, 1)
          this.ok[index] = false
        }
      },
      selectGoods (brandId, item) {
        // 判断是否已经选过这个品牌
        let idx = this.activeArr.findIndex(x => {
          return x.brandId === brandId
        })
        if (idx === -1) {
          this.activeArr.push({
            brandId,
            goodsData: [{
              goodsId: item.goods_id,
              cartId: item.cart_id
            }]
          })
        } else {
          if (this.activeArr[idx].goodsData.length) {
            // 判断当前是否选中这个商品
            let index = this.activeArr[idx].goodsData.findIndex(x => {
              return x.goodsId === item.goods_id
            })
            // 当前商品没有active
            if (index === -1) {
              this.activeArr[idx].goodsData.push({
                goodsId: item.goods_id,
                cartId: item.cart_id
              })
              // 当前商品已经active了
            } else {
              this.activeArr[idx].goodsData.splice(index, 1)
            }
          } else {
            // 这属于一个边界处理
            this.activeArr[idx].goodsData = [{
              goodsId: item.goods_id,
              cartId: item.cart_id
            }]
          }
        }
      },
      // 点击全选
      whole () {
        if (this.all) {
          this.activeArr = []
        } else {
          this._all()
        }
      },
      submit () {
        if (!this.activeArr.length) {
          this.alertFlag = true
          return
        }
        let cartId = []
        this.activeArr.forEach(item => {
          item.goodsData.forEach(x => {
            cartId.push(x.cartId)
          })
        })
        this.$router.push({
          path: '/firmorder',
          query: {
            cartId
          }
        })
      },
      // 全选
      _all () {
        if (!this.cartdata) {
          return
        }
        this.ok.length = this.cartdata.length
        // 先把当前选中的置空，然后遍历所有的都加进去
        this.activeArr = []
        this.cartdata.forEach(item => {
          let arr = []
          item.goods.forEach(x => {
            arr.push({
              goodsId: x.goods_id,
              cartId: x.cart_id
            })
          })
          this.activeArr.push({
            brandId: item.brand_id,
            goodsData: arr
          })
        })
      },
      _getShopCart () {
        this.$http.get(`/api/cart/list?api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.cartdata = res.data.data.list
            this.sum = res.data.data.sum
            let count = 0
            // 处理边界情况
            if (!res.data.data) {
              return
            }
            res.data.data.list.forEach(item => {
              item.goods.forEach(x => {
                count += x.goods_num
              })
            })
            this.cartCount = count
            if (this.init) {
              this.init = false
              this._all()
            }
          }
        })
      },
      _changeNum (quantity, cartId) {
        if (quantity < 1) {
          quantity = 1
        }
        this.$http.post(`/mobile/?act=member_cart&op=cart_edit_quantity&api_token=${this.api_token}`, {
          cart_id: cartId,
          quantity
        }).then(res => {
          if (res.data.status === 400) {
            this.msg = '库存不足'
            this.alertFlag = true
          }
          this._getShopCart()
        })
      },
      ...mapMutations([
        'SET_CART_COUNT',
        'SET_MAKE_ORDER'
      ])
    },
    watch: {
      cartdata () {
        let sum = 0
        let cartCount = 0
        if (this.activeArr.length > 0) {
          this.activeArr.forEach((x, idx, arr) => {
            let one = this.cartdata.find(y => {
              return y.brand_id === x.brandId
            })
            // 通过商品的id来拿到商品的数量和单价来维护总价
            x.goodsData.forEach(item => {
              let two = one.goods.find(y => {
                return y.goods_id === item.goodsId
              })
              sum += Number(two.goods_price) * Number(two.goods_num)
              cartCount += Number(two.goods_num)
            })
            let xLen = x.goodsData.length
            let oneLen = one.goods.length
            if (xLen === oneLen) {
              //
            } else if (xLen === 0) {
              arr.splice(idx, 1)
            }
          })
        }
        this.sum = sum.toFixed(2)
        this.cartCount = cartCount
        this.SET_CART_COUNT(cartCount)

        // activeArr
        let cartType = []
        let flag = true
        this.activeArr.forEach((x, idx, arr) => {
          let one = this.cartdata.find(y => {
            return y.brand_id === x.brandId
          })
          // 用来维护ok数组
          let index = this.cartdata.findIndex(z => {
            return z.brand_id === x.brandId
          })
          // 通过商品的id来拿到商品的数量和单价来维护总价
          x.goodsData.forEach(item => {
            let two = one.goods.find(y => {
              return y.goods_id === item.goodsId
            })
            cartType.push(item.goodsId)
          })
          let xLen = x.goodsData.length
          let oneLen = one.goods.length
          if (xLen === oneLen) {
            this.ok.splice(index, 1, true)
            // 如果品牌里商品列表为空，则去掉这个品牌
          } else if (xLen === 0) {
            this.ok.splice(index, 1, false)
            arr.splice(idx, 1)
            flag = false
          } else {
            this.ok.splice(index, 1, false)
            flag = false
          }
          if (this.activeArr.length !== this.cartdata.length) {
            flag = false
          }
        })
        this.all = flag
      },
      activeArr: {
        handler (newVal) {
          this.$nextTick(() => {
            let sum = 0
            let cartCount = 0
            let cartType = []
            let flag = true
            newVal.forEach((x, idx, arr) => { 
              // 拿到对应的品牌
              let one = this.cartdata.find(y => {
                return y.brand_id === x.brandId
              })
              // 用来维护ok数组
              let index = this.cartdata.findIndex(z => {
                return z.brand_id === x.brandId
              })
              // 通过商品的id来拿到商品的数量和单价来维护总价
              x.goodsData.forEach(item => {
                // 拿到当前选中的商品
                let two = one.goods.find(y => {
                  return y.goods_id === item.goodsId
                })
                cartType.push(item.goodsId)
                sum += Number(two.goods_price) * Number(two.goods_num)
                cartCount += parseInt(two.goods_num)
              })
              // xLen 为activeArr中某品牌下的商品数量
              // oneLen 为cartList中某品牌下的商品数量
              let xLen = x.goodsData.length
              let oneLen = one.goods.length
              // 如果两者相等，则把该品牌的ok置为true
              if (xLen === oneLen) {
                this.ok.splice(index, 1, true)
              // 如果品牌里商品列表为空，则去掉这个品牌 这个情况貌似不会出现
              } else if (xLen === 0) {
                this.ok.splice(index, 1, false)
                arr.splice(idx, 1)
                flag = false
              } else {
                this.ok.splice(index, 1, false)
                flag = false
              }
            })
            // 之前是只判断品牌下的商品数量  并未判断品牌数量是否相等
            if (newVal.length !== this.cartdata.length) {
              flag = false
            }
            // 全否选的时候
            if (!newVal.length) {
              this.ok.forEach((item, index) => {
                this.ok.splice(index, 1, false)
              })
            }
            this.sum = sum.toFixed(2)
            this.cartCount = cartCount
            this.cartType = cartType
            this.all = flag
          })
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'makeOrder'
      ])
    },
    filters: {
      format (num) {
        return (100*num).toFixed(0)/100
      }
    },
    components: {
      XTitle,
      Confirm,
      Scroll,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '';
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
              height: 16px;
              line-height: 16px;
              width: 180px;
              font-size: @font-size-medium;
              .no-wrap
            }
            .spec{
              color: #666;
              font-size: @font-size-small;
              height: 12px;
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
                line-height: 19px;
                text-align: center;
                font-size: 16px;
                &.minus{
                  line-height: 18px;
                  color: #999;
                }
                &.minusNums{
                  color: #000;
                }
              }
              .count{
                height: 20px;
                width: 48px;
                line-height: 20px;
                text-align: center;
                font-size: @font-size-medium;
                border: 0;
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
    .btm{
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .all{
        margin-left: 15px;
        color: #666;
      }
      img{
        width: 18px;
        height: 18px;
      }
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
