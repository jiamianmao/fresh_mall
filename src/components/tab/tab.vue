<template>
  <div>
    <tab class='tab vux-1px-t' :animate='true' :line-width='0' ref='tab' active-color='#5eb29e'>
      <tab-item :selected="index === 0" @on-item-click='go(0)'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shouye1"></use>
        </svg>
      </tab-item>
      <tab-item :selected="index === 1" class='shopcart' @on-item-click='go(1)'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fenleisousuo2"></use>
        </svg>
      </tab-item>
      <tab-item :selected="index === 2" class='shopcart' @on-item-click='go(2)'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shopping-cart"></use>
        </svg>
        <div class='num' ref='num' v-show='num > 0'>{{num}}</div>
      </tab-item>
      <tab-item :selected="index === 3" @on-item-click='go(3)'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wode"></use>
        </svg>
      </tab-item>
    </tab>
  </div>
</template>
<script>
  import { Tab, TabItem } from 'vux'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        index: 0
      }
    },
    created () {
      this.arr = ['/home', '/category', '/shopcart', '/my']
    },
    methods: {
      go (idx) {
        this.$router.push(this.arr[idx])
      }
    },
    computed: {
      ...mapGetters({
        num: 'cartCount'
      })
    },
    watch: {
      $route () {
        // 这里本来用jquery，后来发现DOM操作在进入子路由go(-1)到一级路由后，导致class添加上但未同步渲染出来，所以改用vue方式
        let idx = this.arr.indexOf(this.$route.path)
        if (idx > -1) {
          this.$refs.tab.$el.style.display = 'flex'
          this.index = idx
        } else {
          this.$refs.tab.$el.style.display = 'none'
        }
        if (idx === 1) {
          this.$refs.tab.$el.style.background = 'rgba(255, 255, 255, .4)'
        } else {
          this.$refs.tab.$el.style.background = 'rgb(255, 255, 255)'
        }
      },
      num () {
        this.$nextTick(() => {
          this.$refs.num.classList.add('change')
          setTimeout(() => {
            this.$refs.num.classList.remove('change')
          }, 1000)
        })
      }
    },
    components: {
      Tab,
      TabItem
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
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
        right: 28%;
        top: 6px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #5eb29e;
        text-align: center;
        line-height: 16px;
        color: #fff;
      }
    }
    .icon {
      width: 30px; height: 30px;
      vertical-align: middle;
      fill: currentColor;
      overflow: hidden;
    }
    .active{
      color: @color;
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
