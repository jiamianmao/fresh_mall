<template>
  <transition name='slide'>
    <div class="container">
      <x-title>更改手机号</x-title>
      <main class='vux-1px-b'>
        <div class="username">
          <img src="../../../assets/login/tel.png"><input type="tel" v-model.trim='tel' placeholder='新手机号' maxlength='11'>
        </div>
        <div class="code vux-1px-t">
          <img src="../../../assets/login/code.png"><input type="tel" v-model.trim='code' placeholder='验证码' maxlength='6'>
          <div class="active">
            <span @click='getCode' v-if='!start'>获取验证码</span>
            <div  v-else><countdown v-model='time' :start='start' @on-finish="finish"></countdown> 秒</div>
          </div>
        </div>
      </main>
      <div class="bottom">
        <button @click='submit'>完成</button>
      </div>
      <alert v-model="show" title="提示">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Countdown, Alert } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        tel: '',
        code: '',
        time: 60,
        start: false, // 倒计时的flag
        msg: '',
        show: false      // alert的flag
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 用来手机验证的，因为要验证两次 所以提取出来
      this.regTel = /^1[34578]{1}\d{9}$/
    },
    methods: {
      getCode () {
        if (!this.regTel.test(this.tel)) {
          this.msg = '请正确输入手机号码'
          this.show = true
          return
        } else {
          // 获取验证码
          this.$http.post(`/mobile/?act=member_account&op=bind_mobile_step1&api_token=${this.api_token}`, {
            mobile: this.tel
          }).then(res => {
            if (res.data.status === 200) {
              this.start = true
            } else {
              this.msg = res.data.data.error
              this.show = true
            }
          })
        }
      },
      // 倒计时结束
      finish () {
        this.start = false
        this.time = 60
      },
      submit () {
        if (!this.regTel.test(this.tel)) {
          this.msg = '请正确输入手机号码'
          this.show = true
          return
        }
        if (!this.code) {
          this.msg = '请输入验证码'
          this.show = true
          return
        }
        this.$http.post(`/mobile/?act=member_account&op=edit_phonetwo&api_token=${this.api_token}`, {
          mobile: this.tel,
          auth_code: this.code
        }).then(res => {
          if (res.data.status === 200) {
            this.$router.replace('/my')
          } else {
            this.msg = res.data.data.error
            this.show = true
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
