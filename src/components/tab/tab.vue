<template>
  <div>
    <tab class='tab vux-1px-t' :animate='true' :line-width='0' ref='tab'>
      <tab-item @on-item-click='go(0)' :class="{'vux-tab-selected': active_0}">
        <img src="../../assets/tab/home.png">
        <img src="../../assets/tab/home_active.png">
      </tab-item>
      <tab-item class='shopcart' @on-item-click='go(1)' :class="{'vux-tab-selected': active_1}">
        <img src="../../assets/tab/shopcart.png">
        <img src="../../assets/tab/shopcart_active.png">
        <div class='num' ref='num' v-show='num > 0'>{{num}}</div>
      </tab-item>
      <tab-item @on-item-click='go(2)' :class="{'vux-tab-selected': active_2}">
        <img src="../../assets/tab/my.png">
        <img src="../../assets/tab/my_active.png">
      </tab-item>
    </tab>
  </div>
</template>
<script>
  import { Tab, TabItem } from 'vux'
  export default {
    props: {
      num: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        active_0: false,
        active_1: false,
        active_2: false
      }
    },
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
        // 这里本来用jquery，后来发现DOM操作在进入子路由go(-1)到一级路由后，导致class添加上但未同步渲染出来，所以改用vue方式
        let idx = this.arr.indexOf(this.$route.path)
        if (idx > -1) {
          this.$refs.tab.$el.style.display = 'flex'
          this.active_0 = false
          this.active_1 = false
          this.active_2 = false
          if (idx === 0) {
            this.active_0 = true
          } else if (idx === 1) {
            this.active_1 = true
          } else {
            this.active_2 = true
          }
        } else {
          this.$refs.tab.$el.style.display = 'none'
        }
      },
      num () {
        this.$refs.num.classList.add('change')
        setTimeout(() => {
          this.$refs.num.classList.remove('change')
        }, 1000)
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
    z-index: 1;
    .vux-tab-item{
      img:nth-of-type(2){
        display: none;
      }
    }
    .shopcart{
      position: relative;
      .num{
        position: absolute;
        right: 33%;
        top: 5px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #5eb29e;
        text-align: center;
        line-height: 16px;
        color: #fff;
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
    .change{
      animation: changes 1s;
    }
    @keyframes changes {
      0{
        transform: scale(1);
      }
      10%{
        transform: scale(1.1);
      }
      20%{
        transform: scale(1.2);
      }
      30%{
        transform: scale(1.3);
      }
      40%{
        transform: scale(1.2);
      }
      50%{
        transform: scale(1.1);
      }
      60%{
        transform: scale(1);
      }
      70%{
        transform: scale(1.1);
      }
      80%{
        transform: scale(1.2);
      }
      90%{
        transform: scale(1.1);
      }
      100%{
        transform: scale(1);
      }
    }
  }
</style>
