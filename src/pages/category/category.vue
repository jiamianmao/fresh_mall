<template>
  <div class='container'>
    <div class="bg">
      <img v-lazy="img">
    </div>

    <search class='search vux-1px-b' ref='serach'></search>

    <loading v-show='loading' position='absolute'></loading>

    <div class="main">
      <scroll class="left vux-1px-r" :data='cate_list'>
        <div>
          <div class='left_item' v-for='(item, key) of cate_list' :class='{active: idx === key}' @click='active(key, item.gc_id)'>
            <div class='name'>{{item.gc_name}}<span class='placeholder'></span></div>
          </div>
        </div>
      </scroll>
      <scroll class="right" :data='type_list'>
        <div class='item-wrapper'>
          <div class="right_item" v-for='item of type_list' @click='selectType(item.gc_id)'>{{item.gc_name}}</div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
  import Search from '@/components/search/search'
  import Scroll from '@/components/scroll/scroll'
  import { baseUrl } from 'common/config/config'
  import { Loading } from 'vux'
  export default {
    data () {
      return {
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3326244098,183580375&fm=27&gp=0.jpg',
        cate_list: [],
        idx: 0,
        type_list: [],
        loading: false
      }
    },
    created () {
      this._getCategory()
    },
    mounted () {
      this.$refs.serach.changeColor()
    },
    methods: {
      active (key, id) {
        this.idx = key
        this._getType(id)
      },
      selectType (id) {
        console.log(id)
        this.$router.push('/goodslist')
      },
      _getCategory () {
        this.$http.get(`${baseUrl}/mobile/?act=goods_class&op=goods_list`).then(res => {
          if (res.data.status === 200) {
            this.cate_list = res.data.data.class_list
            if (this.cate_list) {
              this._getType(this.cate_list[0].gc_id)
            }
          }
        })
      },
      _getType (id) {
        this.loading = true
        this.$http.get(`${baseUrl}/mobile/?act=goods_class&op=goods_list&gc_id=${id}`).then(res => {
          if (res.data.status === 200) {
            this.loading = false
            this.type_list = res.data.data.class_list
          }
        })
      }
    },
    components: {
      Search,
      Scroll,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/variable.less';
  // rgba(51, 1, 14, .6)
  .container{
    width: 100vw;
    height: calc(~"100vh - 50px");
    display: flex;
    flex-direction: column;
    position: relative;
    .bg{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: -50px;
      z-index: -1;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .main{
      flex: 1;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      font-size: @font-size-medium;
      color: #fff;
      overflow: hidden;
      .left{
        width: 27.6%;
        .left_item{
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          .name{
            width: 4em;
            height: inherit;
            line-height: 44px;
            text-align: justify;
            span{
              display: inline-block;
              width: 100%;
            }
          }
          &.active{
            background: rgba(255, 255, 255, .5)
          }
        }
      }
      .right{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .item-wrapper{
          display: flex;
          flex-flow: row wrap;
          padding: 0 35px;
          box-sizing: border-box;
          justify-content: space-between;
          .right_item{
            height: 30px;
            width: 88px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #fff;
            margin-bottom: 20px;
            border-radius: 5px;
          }
        }
      }
    }
  }
</style>
