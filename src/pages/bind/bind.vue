<template>
  <transition name='slide'>
    <div class="container">
      <x-title>绑定手机号</x-title>
      <main class='vux-1px-b'>
        <div class="username">
          <img src="../../assets/login/tel.png"><input type="tel" v-model='tel' placeholder='手机号' maxlength='11'>
        </div>
        <div class="code vux-1px-t">
          <img src="../../assets/login/code.png"><input type="tel" v-model='code' placeholder='验证码' maxlength='6'>
          <div class="active">
            <span @click='getCode' v-if='!start'>获取验证码</span>
            <div  v-else><countdown v-model='time' :start='start' @on-finish="finish"></countdown> 秒</div>
          </div>
        </div>
      </main>
      <div class="bottom">
        <button>完成</button>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        tel: '',
        code: '',
        time: 60,
        start: false
      }
    },
    methods: {
      getCode () {
        this.start = true
      },
      finish () {
        this.start = false
        this.time = 60
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #fff;
    main{
      width: 100%;
      padding-left: 15px;
      >div{
        height: 10vh;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        position: relative;
        img{
          width: 18px;
          height: 20px;
          margin-right: 10px;
        }
        input{
          border: 0;
        }
        .icon{
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translate3d(0, -50%, 0);
          width: 1.4em; 
          height: 1.4em;
          vertical-align: -0.15em;
          fill: @color;
          overflow: hidden;
        }
        .active{
          position: absolute;
          right: 15px;
          color: @color;
          font-size: @font-size-small;
        }
      }
    }
    .bottom{
      width: 100%;
      padding: 0 25px;
      margin-top: 22px;
      button{
        margin-top: 22px;
        width: 100%;
        height: 8.30564784vh;
        color: #fff;
        background: @color;
        border: 0;
        text-align: center;
        line-height: 8.30564784vh;
        letter-spacing: 10px;
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
