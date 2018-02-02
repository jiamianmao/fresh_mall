<template>
  <div class='container'>
    <search @close='close' @toSearch='toSearch' class='vux-1px-b header'></search>

    <div class="sort-rule">
      <div class="sort-wrapper">
        <div class='sort-item' v-for='(item, index) of sortArr' :class='{active:index === idx, money: index === 3, "vux-1px-b": index <= 3}' @click='selectSort(item, index)'>
          <span>
            {{item.attr_name}}
            <div class="icon-wrapper" v-if='index === 0 || index > 3'>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-arrowdropdown"></use>
              </svg>
            </div>
            <div class="icon-wrapper price" v-show='item.attr_name === "价格"'>
              <svg class="icon" aria-hidden="true" :class='{price_active: !up}'>
                <use xlink:href="#icon-arrow-up"></use>
              </svg>
              <svg class="icon" aria-hidden="true" :class='{price_active: up}'>
                <use xlink:href="#icon-arrowdropdown"></use>
              </svg>
            </div>
          </span>
        </div>
      </div>

      <!-- 排序选择下拉框 -->
      <transition name='slide'>
        <scroll :data='descData' class='box vux-1px-b' v-show='descFlag' ref='scroll'>
          <div class="descWrapper">
            <div class="desc" :class='{active_desc: attrDest.indexOf(item.attr_value_id) !== -1}' v-for='item of descData' @click='selectDesc(item.attr_value_id)'>
              {{item.attr_value_name}}
            </div>
          </div>
          <div class="button vux-1px-t">
            <button class='reset' @click='reset'>重置</button>
            <button class='sure' @click='sure'>确定</button>
          </div>
        </scroll>
      </transition>

      <transition name='fade'>
        <div class="mask" v-show='descFlag' @click='descFlag = false'></div>
      </transition>
    </div>

    <!-- 这里没处理好，该商品样式没复用，竟然还抽离出个组件 -->
    <div class="goods-wrapper">
      <x-goods v-for='(item, index) of goodsData' :goods='item' class='x-goods' :key='index' @click.native='selectGoods(item.goods_id)'></x-goods>
    </div>
  </div>
</template>
<script>
  import Search from '@/components/search/search'
  import Scroll from '@/components/scroll/scroll'
  import XGoods from '@/components/x-goods/x-goods'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        sortArr: [],  // 品牌/品种/部位 等信息
        placeholder: false,  // 对desc做个横线
        descFlag: false,
        idx: 0,
        attrDest: [],  // 用户选择用来搜索的信息
        descData: [],  // 部位/品种 下面的详情信息
        goodsData: [],
        goodsData1: [], // 这里用来存储综合排序的镜像
        up: false,  // 用来维护一个价格的降序还是升序
        word: ''
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.gc_id = this.$route.query.gc_id
      this._getSort()
    },
    methods: {
      close () {
        this.$router.go(-1)
      },
      toSearch (word) {
        // 拿到搜索关键词去交互
        this.word = word
        this.sure()
      },
      selectSort (item, index) {
        // 这里对 综合 销量 价格 进行拦截，不触发下拉框
        if (index >= 1 && index <= 3) {
          this.idx = index
          if (item.attr_name === '综合') {
            this.goodsData = this.goodsData1.slice()
          }
          if (item.attr_name === '销量') {
            this.goodsData.sort((a, b) => {
              return b.goods_salenum - a.goods_salenum
            })
          }
          if (item.attr_name === '价格') {
            if (!this.up) {
              this.goodsData.sort((a, b) => {
                return a.goods_price - b.goods_price
              })
              this.up = true
            } else {
              this.goodsData.sort((a, b) => {
                return b.goods_price - a.goods_price
              })
              this.up = false
            }
          }
          this.descFlag = false
          return
        }
        // 下边是对下拉框的判断
        if (index === this.idx) {
          this.descFlag = !this.descFlag
          return
        }
        this.idx = index
        this.descFlag = true
      },
      selectDesc (index) {
        let x = this.attrDest.findIndex((n) => n === index)
        if (x === -1) {
          this.attrDest.push(index)
        } else {
          this.attrDest.splice(x, 1)
        }
      },
      selectGoods (id) {
        this.$router.push(`/product/${id}`)
      },
      // 重置操作
      reset () {
        // 之前是直接清空，现在是只清空当前列表（品牌，品种）中的的属性
        this.descData.forEach(item => {
          let idx = this.attrDest.indexOf(item.attr_value_id)
          if (idx > -1) {
            this.attrDest.splice(idx, 1)
          }
        })
        // this.attrDest = []
      },
      sure () {
        this.descFlag = false
        this.$http.get('/api/goods/list', {
          params: {
            api_token: this.api_token,
            class_id: this.gc_id,
            name: this.word,
            attr_value_id: this.attrDest
          }
        }).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.goodsData = res.data.data
            this.goodsData1 = this.goodsData.slice()
          }
        })
      },
      _getSort () {
        this.$http.get(`/api/good_class/attr?api_token=${this.api_token}&id=${this.gc_id}`).then(res => {
          this.sortArr = res.data ? res.data.data : [{attr_name: '热门', init: true}]
          this.sortArr.splice(1, 0, {
            attr_name: '综合'
          }, {
            attr_name: '销量'
          }, {
            attr_name: '价格'
          })
          // 方法有点蠢，不灵活 只能两组加横线
          this.sortArr.length > 4 && (this.placeholder = true)
          this.descData = this.sortArr[this.idx].attribute_value
          // 防止页面重绘
          this.$nextTick(() => {
            this._getGoodsData()
          })
        })
      },
      _getGoodsData () {
        this.$http.get(`/api/good_class/recommend?api_token=${this.api_token}&id=${this.gc_id}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            // 这里必须得用浅复制咯，因为这里是对象下边的属性，就是给的是指针。所以用slice，在上面
            // goodsData1 给 goodsData的 也需要用浅复制
            // this.goodsData = this.goodsData1 = res.data.data
            this.goodsData = res.data.data
            this.goodsData1 = this.goodsData.slice()
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    watch: {
      descFlag () {
        // 因为下拉框做了个scroll 所以数据更新后要refresh
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      },
      // 选择不同的筛选条件来渲染对应的筛选值
      idx () {
        this.descData = this.sortArr[this.idx].attribute_value
      }
    },
    components: {
      Search,
      Scroll,
      XGoods
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
    bottom: 0;
    right: 0;
    background: #fff;
    .header{
      z-index: 3;
      background: #fff;
    }
    .sort-rule{
      .sort-wrapper{
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        background: #fff;
        padding: 0 20px;
        position: relative;
        z-index: 3;
        font-size: @font-size-medium;
        color: #666;
        .sort-item{
          height: 50px;
          line-height: 50px;
          padding-right: 3vw;
          &.money{
            padding-right: 10px;
          }
          &.active{
            color: @color;
          }
          &:nth-child(4n + 1) {
            width: 19%
          }
          &:nth-child(4n+2) {
            text-align: center;
            width: 34.139%;
          }
          &:nth-child(4n+3) {
            text-align: center;
            width: 22.65861%;
          }
          &:nth-child(4n){
            width: 24.21139%;
            text-align: right;
          }
          span{
            position: relative;
            display: inline-block;
            max-width: 100%;
            .icon-wrapper{
              position: absolute;
              top: 50%;
              right: -10px;
              transform: translate3d(0, -50%, 0);
              width: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              &.price{
                .icon:first-child{
                  position: relative;
                  bottom: -6px;
                }
                .icon:last-child{
                  position: relative;
                  top: -6px;
                }
              }
              .icon {
                width: 1.3em; height: 1.3em;
                fill: currentColor;
                overflow: hidden;
                &.price_active{
                  fill: #666;
                }
              }
              // .no-wrap
            }
          }
          .no-wrap
        }
      }
      .box{
        position: absolute;
        z-index: 2;
        left: 0;
        width: 100%;
        height: 200px;
        padding: 0 20px;
        font-size: @font-size-medium;
        color: #666;
        overflow-y: scroll;
        background: #fff;
        .descWrapper{
          display: flex;
          flex-flow: row wrap;
          padding-bottom: 40px;
          .desc{
            height: 30px;
            line-height: 30px;
            width: 50%;
            padding-right: 20px;
            &.active_desc{
              color: red;
            }
          }
        }
        .button{
          position: absolute;
          bottom: 0;
          left: -20px;
          right: -20px;
          height: 40px;
          display: flex;
          flex-flow: row nowrap;
          button{
            flex: 1;
            border: 0;
            height: 100%;
            letter-spacing: 3px;
            &.reset{
              background: #fff;
            }
            &.sure{
              background: @color;
              color: #fff;
            }
          }
        }
      }
      .mask{
        position: fixed;
        top: 150px;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        background: rgba(0, 0, 0, .5);
      }
      .slide-enter-active, .slide-leave-active {
        transition: all .8s;
      }
      .slide-enter, .slide-leave-to {
        transform: translate3d(0, -300px, 0);
      }
      .fade-enter-active, .fade-leave-active {
        transition: all .8s;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
      }
    }
    .goods-wrapper{
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      padding-bottom: 50px;
      .x-goods{
        position: relative;
        margin-top: 6px;
      }
    }
  }
</style>

