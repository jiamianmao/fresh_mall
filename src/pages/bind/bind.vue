<template>
  <transition name='slide'>
    <div class="container">
      <x-title>绑定手机号</x-title>
      <main class='vux-1px-b'>
        <div class="username">
          <img src="../../assets/login/tel.png"><input type="tel" v-model.trim='tel' placeholder='手机号' maxlength='11'>
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
        <button @click='success'>完成</button>
      </div>
      <alert title='提示' v-model='show'>{{ msg }}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Alert, Countdown, cookie } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        tel: '',
        code: '',
        time: 60,
        start: false,
        show: false,
        msg: ''
      }
    },
    created () {
      this.api_token = cookie.get('api_token')
      storage.set('api_token', this.api_token)
    },
    methods: {
      getCode () {
        let regTel = /^1[34578]{1}\d{9}$/
        if (!regTel.test(this.tel.trim())) {
          this.show = true
          this.msg = '请正确输入您的手机号'
          return
        }
        this.$http.post(`/mobile/?act=member_account&op=bind_mobile_step1&api_token=${this.api_token}`, {
          mobile: this.tel
        }).then(res => {
          if (res.data.status !== 200) {
            this.show = true
            this.msg = res.data.data.error
          } else {
            this.start = true
          }
        })
      },
      finish () {
        this.start = false
        this.time = 60
      },
      success () {
        this.$http.post(`/mobile/?act=member_account&op=edit_phonetwo&api_token=${this.api_token}`, {
          mobile: this.tel,
          auth_code: this.code
        }).then(res => {
          if (res.data.status !== 200) {
            this.show = true
            this.msg = res.data.data.error
          } else {
            this.show = true
            this.msg = '恭喜您，绑定成功!'
            setTimeout(() => {
              this.show = false
              this.$router.push({
                path: storage.get('currentUrl')
              })
            }, 1000)
          }
        })
      }
    },
    components: {
      XTitle,
      Alert,
      Countdown
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
          min-height: 66px;
          height: 10vh;
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
