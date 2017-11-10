<template>
  <div class='container'>
    <search @close='close' @toSearch='toSearch' class='vux-1px-b header'></search>

    <div class="sort-rule">
      <div class="sort-wrapper">
        <div class='sort-item' v-for='(item, index) of sortArr' :class='{active:index === idx}' @click='selectSort(index)'>
          <span>
            {{item.name}}
            <div class="icon-wrapper">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-arrowdropdown"></use>
              </svg>
            </div>
          </span>
        </div>
        <div class="placeholder" v-show='placeholder'></div>
      </div>

      <!-- 排序选择下拉框 -->
      <transition name='slide'>
        <scroll :data='descData' class='box vux-1px-b vux-1px-t' v-show='descFlag' ref='scroll'>
          <div class="descWrapper">
            <div class="desc" :class='{active_desc: attrDest.indexOf(index) !== -1}' v-for='(item, index) of descData' @click='selectDesc(index)'>
              {{item}}
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
      <x-goods v-for='(item, index) of goodsData' :goods='item' class='x-goods' :key='index' @click.native='selectGoods'></x-goods>
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
        goodsData: []
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
        console.log(word)
      },
      selectSort (index) {
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
      reset () {
        this.attrDest = []
      },
      sure () {
        this.descFlag = false
        console.log(this.attrDest)
      },
      selectGoods () {
        this.$router.push('/product/1')
      },
      _getSort () {
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/sortrule').then(res => {
          this.sortArr = res.data.data
          // 方法有点蠢，不灵活 只能两组加横线
          this.sortArr.length > 4 && (this.placeholder = true)
          this.descData = this.sortArr[this.idx].list
          // 防止页面重绘
          this.$nextTick(() => {
            this._getGoodsData()
          })
        })
      },
      _getGoodsData () {
        let url
        // 这里需要对api_token做个判断，后端需要维护用过户浏览行为，所以传参不同的
        if (this.api_token) {
          url = `/api/good_class/recommend?api_token=${this.api_token}&id=${this.gc_id}`
        } else {
          url = `/api/good_class/recommend?id=${this.gc_id}`
        }
        this.$http.get(url).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.goodsData = res.data.data
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
        this.$nextTick(() => {
          this.attrDest = []
          this.$refs.scroll.refresh()
        })
      },
      idx () {
        this.descData = this.sortArr[this.idx].list
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
    // z-index: 1;
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
        padding: 0 30px 0 20px;
        position: relative;
        z-index: 3;
        font-size: @font-size-medium;
        color: #666;
        .placeholder{
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: #eee;
        }
        .sort-item{
          width: 25%;
          height: 50px;
          line-height: 50px;
          &.active{
            color: @color;
          }
          &:nth-child(4n+2), &:nth-child(4n+3) {
            text-align: center;
          }
          &:nth-child(4n){
            text-align: right;
          }
          span{
            position: relative;
            .icon-wrapper{
              position: absolute;
              top: 50%;
              right: -12px;
              transform: translate3d(0, -50%, 0);
              width: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              .icon {
                width: 12px; height: 12px;
                fill: currentColor;
                overflow: hidden;
              }
            }
          }
        }
      }
      .box{
        position: absolute;
        z-index: 2;
        height: 300px;
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
            .no-wrap
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
              background: red;
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
      .x-goods{
        position: relative;
        &~.x-goods{
          margin-top: 6px;
        }
      }
    }
  }
</style>

