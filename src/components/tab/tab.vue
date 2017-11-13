<template>
  <div>
    <tab class='tab vux-1px-t' :animate='true' :line-width='0'>
      <tab-item @on-item-click='go(0)'>
        <img src="../../assets/tab/home.png">
        <img src="../../assets/tab/home_active.png">
      </tab-item>
      <tab-item @on-item-click='go(1)'>
        <img src="../../assets/tab/shopcart.png">
        <img src="../../assets/tab/shopcart_active.png">
      </tab-item>
      <tab-item @on-item-click='go(2)'>
        <img src="../../assets/tab/my.png">
        <img src="../../assets/tab/my_active.png">
      </tab-item>
    </tab>
  </div>
</template>
<script>
  import { Tab, TabItem } from 'vux'
  import $ from 'jquery'
  export default {
    created () {
      this.arr = ['/home', '/shopcart', '/my']
    },
    methods: {
      go (idx) {
        this.$router.push(this.arr[idx])
      }
    },
    watch: {
      $route () {
        $('.tab').find('.vux-tab-item').attr('class', 'vux-tab-item')
        let idx = this.arr.indexOf(this.$route.path)
        $('.vux-tab-item').eq(idx).addClass('vux-tab-selected')
      }
    },
    components: {
      Tab,
      TabItem
    }
  }
</script>
<style lang="less" scoped>
  .tab {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 49px;
    .vux-tab-item{
      img:nth-of-type(2){
        display: none;
      }
    }
    .vux-tab-selected{
      img:nth-of-type(1){
        display: none;
      }
      img:nth-of-type(2){
        display: inline-block;
      }
    }
    img{
      height: 26px;
      width: 26px;
      vertical-align: middle;
    }
  }
</style>
