<template>
  <div class='tab_wrapper vux-1px-t'>
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
      <div class='num' ref='num' v-show='num > 0'>{{num}}</div>
    </div>
    <div class="item item_add" @click='addCart'>
      加入购物车
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      num: {
        type: Number,
        default: 0
      }
    },
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
    watch: {
      num () {
        this.$nextTick(() => {
          console.log(this.$refs.num)
          this.$refs.num.classList.add('change')
          setTimeout(() => {
            this.$refs.num.classList.remove('change')
          }, 1000)
        })
      }
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
    .item{
      width: 25%;
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
        right: 30%;
        top: 3px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #5eb29e;
        text-align: center;
        line-height: 16px;
        color: #fff;
      }
      &.item_add{
        color: #fff;
        background: #5eb29e;
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
