<template>
  <transition name='slide'>
    <div class="container">
      <x-title>注册</x-title>
      <main class='vux-1px-b'>
        <div class="username">
          <img src="../../assets/login/tel.png"><input type="tel" v-model='tel' placeholder='手机号' maxlength='11'>
        </div>
        <div class="password vux-1px-t">
          <img src="../../assets/login/pwd.png"><input type="password" ref='pwd' v-model='pwd' placeholder='密码' maxlength='20'>
          <svg class="icon" aria-hidden="true" @click='seePassword' ref='icon'>
            <use xlink:href="#icon-yanjing"></use>
          </svg>
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
        <div class="text">
          <div class='icon' @click='active = !active'>
            <img src="../../assets/selectAdd/select.png" v-if='active'>
            <img src="../../assets/selectAdd/selected.png" v-else>
          </div>
          <p>我已阅读并同意<span>《用户注册协议》</span></p>
        </div>
        <button @click='personal'>注册</button>
      </div>
       <alert v-model="show" title="请注意">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Countdown, Alert } from 'vux'
  export default {
    data () {
      return {
        tel: '',
        pwd: '',
        code: '',
        time: 60,
        start: false,
        active: false,
        msg: '',
        show: false
      }
    },
    methods: {
      seePassword () {
        if (this.$refs.pwd.getAttribute('type') === 'text') {
          this.$refs.pwd.setAttribute('type', 'password')
          this.$refs.icon.style.fill = '#5eb29e'
        } else {
          this.$refs.pwd.setAttribute('type', 'text')
          this.$refs.icon.style.fill = '#333'
        }
      },
      getCode () {
        this.start = true
      },
      finish () {
        this.start = false
        this.time = 60
      },
      personal () {
        let phone = this.tel
        let code = this.code
        let password = this.pwd
        console.log(phone)
        console.log(code)
        this.$http.post('/mobile/?act=login&op=register', {
          phone,
          code,
          password
        }).then(res => {
          if (res.data.status === 200) {
            // 跳转到登录页面
            this.$router.push('/signin')
          } else {
            this.show = true
            this.msg = res.data.data.error
          }
        })
      }
    },
    components: {
      XTitle,
      Countdown,
      Alert
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
      .text{
        width: 100%;
        height: 8.8vh;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        font-size: @font-size-medium;
        .icon{
          width: 16px;
          height: 16px;
          margin-right: 10px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        span{
          color: @color;
        }
      }
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
