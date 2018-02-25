<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show='showFlag' @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content" :class='{"title": title}'>
          <div class="textWrapper">
            <p class="text" v-if='title'>{{title}}</p>
            <p class="text" v-if='text'>{{text}}</p>
          </div>
          <div class="operate">
            <div class="operate-btn vux-1px-t vux-1px-r" @click='cancel'>{{cancelBtnText}}</div>
            <div v-if='!tel' class="operate-btn vux-1px-t" @click='confirm'>{{confirmBtnText}}</div>
            <a v-else class="operate-btn vux-1px-t" @click='confirm' :href='telphone'>
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
      },
      tel: {
        type: Boolean,
        default: true
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
        padding-top: 1px;
        .textWrapper{
          height: 96px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          .text{
            font-size: @font-size-medium-x;
            color: #000;
            font-weight: bold;
            &:nth-child(2) {
              margin-top: 20px;
              font-size: @font-size-medium;
            }
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
