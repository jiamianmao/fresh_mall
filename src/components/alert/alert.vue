<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show='showFlag' @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <div class="textWrapper">
            <p class="text">
              <slot></slot>
            </p>
          </div>
        </div>
        <div class='close' v-if='clo' @click='close'>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-close47"></use>
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      clo: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        showFlag: true
      }
    },
    methods: {
      close () {
        this.showFlag = false
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
    background-color: rgba(0, 0, 0, 0.5);
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
        .textWrapper{
          padding: 45px 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          .text{
            font-size: @font-size-medium-x;
            line-height: 24px;
            color: #000;
          }
        }
      }
      .close{
        position: absolute;
        top: 0;
        right: 10px;
        width: 2em;
        height: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          width: 1em; height: 1em;
          vertical-align: -0.15em;
          fill: #bfbfbf;
          overflow: hidden;
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
