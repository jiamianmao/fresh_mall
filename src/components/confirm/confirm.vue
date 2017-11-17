<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show='showFlag' @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn vux-1px-t vux-1px-r" @click='cancel'>{{cancelBtnText}}</div>
            <!-- <div class="operate-btn" @click='confirm'>{{confirmBtnText}}</div> -->
            <a class="operate-btn vux-1px-t" @click='confirm' :href='telphone'>
              <span>{{confirmBtnText}}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data () {
      return {
        showFlag: false
      }
    },
    methods: {
      show () {
        this.showFlag = true
      },
      hide () {
        this.showFlag = false
      },
      cancel () {
        this.hide()
        this.$emit('cancel')
      },
      confirm () {
        this.hide()
        this.$emit('confirm')
      }
    },
    computed: {
      telphone () {
        return `tel:${this.text}`
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~common/less/variable";

  .confirm{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.3);
    &.confirm-fade-enter-active{
      animation: confirm-fadein 0.3s;
      .confirm-content{
        animation: confirm-zoom 0.3s;
      }
    }
    .confirm-wrapper{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content{
        width: 270px;
        border-radius: 13px;
        background: #fff;
        .text{
          padding: 10px 15px;
          line-height: 22px;
          text-align: center;
          font-size: @font-size-large;
          color: #000;
          &:first-child{
            font-weight: bold;
          }
        }
        .operate{
          display: flex;
          align-items: center;
          text-align: center;
          font-size: @font-size-large;
          .operate-btn{
            flex: 1;
            line-height: 22px;
            padding: 10px 0;
            color: #000;  
          }
        }
      }
    }
  }
  @keyframes confirm-fadein{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes confirm-zoom{
    0%{
      transform: scale(0);
    }
    50%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
</style>
