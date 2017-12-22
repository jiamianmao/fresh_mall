<template>
  <div class='tab_wrapper vux-1px-t'>
    <div class="left">
      <div class="item" @click='goTel'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-kefucopy"></use>
        </svg>
        <span>客服</span>
      </div>
      <div class="item" @click='goHome'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shouye1"></use>
        </svg>
        <span>首页</span>
      </div>
      <div class="item" @click='shopCart'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shopcart"></use>
        </svg>
        <span>购物车</span>
        <div class='num' ref='num' v-show='cartCount > 0'>{{cartCount}}</div>
      </div>
    </div>
    <div class="right" @click='addCart'>
      加入购物车
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        flag: false
      }
    },
    methods: {
      goHome () {
        this.$router.push('/home')
      },
      goTel () {
        this.$emit('tel')
      },
      addCart () {
        this.$emit('add')
      },
      shopCart () {
        this.$router.push('/shopcart')
      }
    },
    computed: {
      ...mapGetters([
        'cartCount'
      ])
    },
    watch: {
      cartCount () {
        this.$nextTick(() => {
          this.$refs.num.classList.add('change')
          this.timer = setTimeout(() => {
            this.$refs.num.classList.remove('change')
          }, 1000)
        })
      }
    },
    beforeDestroy () {
      // 这里销毁前需要清除定时器，要不然容易造成Bug
      this.timer && clearTimeout(this.timer)
    }
  }
</script>
<style lang="less" scoped>
   @import '~common/less/variable.less';
  .tab_wrapper{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 49px;
    display: flex;
    flex-flow: row nowrap;
    background: #fff;
    z-index: 1;
    .left{
      height: 100%;
      flex: 1;
      padding: 0 36px 0 30px;
      display: flex;
      justify-content: space-between;
      .item{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #707070;
        font-size: @font-size-small-s;
        position: relative;
        .num{
          position: absolute;
          right: -3px;
          top: 2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #5eb29e;
          text-align: center;
          line-height: 16px;
          color: #fff;
        }
        .icon {
          width: 28px;
          height: 25px;
          margin-bottom: 4px;
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
    .right{
      width: 30.4vw;
      color: #fff;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #5eb29e;
      font-size: @font-size-medium;
    }
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
</style>
