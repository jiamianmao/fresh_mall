<template>
  <transition name='slide'>
    <div class="container">
      <x-title>消息中心</x-title>
      <div class="content">
        <div class="item" v-for='(item, index) of arr' :class='{"vux-1px-t": index > 0}' :key='index'>
          <div class="left">
            <img src="../../../assets/my/unread.png">
          </div>
          <div class="right">
            <p>
              <span>系统消息</span>
              <span>2017.04.20 19:20</span>
            </p>
            <p>我是大空翼啊</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        arr: [1, 2]
      }
    },
    components: {
      XTitle
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
    width: 100vw;
    min-height: 100vh;
    background: #fff;
    z-index: 1;
    .content{
      width: 100vw;
      .item{
        height: 80px;
        width: 100%;
        padding: 0 15px 0 12px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          width: 40px;
          height: 40px;
          margin-right: 20px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          flex: 1;
          height: inherit;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          font-size: @font-size-small;
          color: #999;
          overflow: hidden;
          p:first-child{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span:first-child{
              color: #333;
            }
          }
          p:last-child{
            margin-top: 12px;
            .no-wrap
          }
        }
      }
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
