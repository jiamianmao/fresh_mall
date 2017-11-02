<template>
  <div>
    <tab class='tab vux-1px-t' :animate='true' :bar-active-color='red' :line-width='0' ref='tab'>
      <tab-item @on-item-click='home' :class='i_home'>
        <img src="../../assets/tab/home.png">
        <img src="../../assets/tab/home_active.png">
      </tab-item>
      <tab-item @on-item-click='category' :class='i_category'>
        <img src="../../assets/tab/category.png">
        <img src="../../assets/tab/category_active.png">
      </tab-item>
      <tab-item @on-item-click='shopcart' :class='i_shopcart'>
        <img src="../../assets/tab/shopcart.png">
        <img src="../../assets/tab/shopcart_active.png">
      </tab-item>
      <tab-item @on-item-click='my' :class='i_my'>
        <img src="../../assets/tab/my.png">
        <img src="../../assets/tab/my_active.png">
      </tab-item>
    </tab>
  </div>
</template>
<script>
  import { Tab, TabItem } from 'vux'
  export default {
    data () {
      return {
        red: 'red',
        i_home: '',
        i_category: '',
        i_shopcart: '',
        i_my: ''
      }
    },
    created () {
      let href = location.pathname
      if (href === '/home') {
        this.i_home = 'vux-tab-selected'
      } else if (href === '/category') {
        this.i_category = 'vux-tab-selected'
      } else if (href === '/shopcart') {
        this.i_shopcart = 'vux-tab-selected'
      } else if (href === '/my') {
        this.i_my = 'vux-tab-selected'
      }
    },
    methods: {
      clear () {
        this.i_home = ''
        this.i_category = ''
        this.i_shopcart = ''
        this.i_my = ''
        this.$refs.tab.$el.style.backgroundColor = ''
      },
      home () {
        this.clear()
        this.$router.push('/home')
      },
      category () {
        this.clear()
        this.$router.push('/category')
      },
      shopcart () {
        this.clear()
        this.$router.push('/shopcart')
      },
      my () {
        this.$router.push('/my')
      }
    },
    watch: {
      $route () {
        let url = this.$route.path
        if (url === '/category') {
          this.$refs.tab.$el.style.backgroundColor = 'rgba(255, 255, 255, .2)'
        }
        if (url === '/home' || url === '/category' || url === '/shopcart' || url === '/my') {
          this.$refs.tab.$el.style.display = 'flex'
        } else {
          this.$refs.tab.$el.style.display = 'none'
        }
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
