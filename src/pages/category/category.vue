<template>
  <div class='container'>
    <div class="bg">
      <img v-lazy="img">
    </div>

    <search class='search' ref='serach' @click.native='search'></search>

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
  import storage from 'good-storage'
  import { Loading } from 'vux'
  export default {
    name: 'category',
    data () {
      return {
        img: '',
        cate_list: [],
        idx: 0,
        type_list: [],
        loading: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
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
        this.$router.push(`/goodslist?gc_id=${id}`)
      },
      search () {
        this.$router.push('/search')
      },
      _getCategory () {
        this.$http.get('/mobile/?act=goods_class&op=goods_list').then(res => {
          if (res.data.status === 200) {
            this.cate_list = res.data.data.class_list
            if (this.cate_list[0].gc_name === '首页') {
              this.cate_list.shift()
            }
            if (this.cate_list) {
              this._getType(this.cate_list[0].gc_id)
              this.img = this.cate_list[this.idx].gc_pic
            }
          }
        })
      },
      _getType (id) {
        this.loading = true
        this.$http.get(`/mobile/?act=goods_class&op=goods_list&gc_id=${id}`).then(res => {
          if (res.data.status === 200) {
            this.loading = false
            this.type_list = res.data.data.class_list
          }
        })
      }
    },
    watch: {
      idx (newVal) {
        this.img = this.cate_list[this.idx].gc_pic
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
  @import '~common/less/mixin.less';
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
    .search{
      .border-1px(rgba(0, 0, 0, .4))
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
            background: rgba(255, 255, 255, .5);
            color: #110708;
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
          padding: 0 9.33vw;
          width: 100%;
          justify-content: center;
          align-items: center;
          .right_item{
            height: 30px;
            width: 23.4667vw;
            line-height: 30px;
            text-align: center;
            border: 1px solid #fff;
            border-radius: 5px;
            margin-top: 5.333vw;
          }
          .right_item:nth-child(1), .right_item:nth-child(2){
            margin-top: 0;
          }
          .right_item:nth-child(even){
            margin-left: 5.333vw;
          }
        }
      }
    }
  }
</style>
