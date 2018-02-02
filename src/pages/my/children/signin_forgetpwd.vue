<template>
  <transition name='slide'>
    <div class="container">
      <x-title>{{title}}</x-title>
      <main class='vux-1px-b'>
        <div class="username">
          <img src="../../../assets/login/tel.png"><input type="tel" v-model.trim='tel' placeholder='手机号' maxlength='11'>
        </div>
        <div class="code vux-1px-t">
          <img src="../../../assets/login/code.png"><input type="tel" v-model.trim='code' placeholder='验证码' maxlength='6'>
          <div class="active">
            <span @click='getCode' v-if='!start'>获取验证码</span>
            <div  v-else><countdown v-model='time' :start='start' @on-finish="finish"></countdown> 秒</div>
          </div>
        </div>
        <div class="password vux-1px-t" v-show='!tels'>
          <img src="../../../assets/login/pwd.png"><input type="password" ref='pwd1' v-model='pwd1' :placeholder='text'>
          <svg class="icon" aria-hidden="true" @click='seePassword(1)' ref='icon1'>
            <use xlink:href="#icon-yanjing"></use>
          </svg>
        </div>
        <div class="password vux-1px-t" v-show='!tels'>
          <img src="../../../assets/login/pwd.png"><input type="password" ref='pwd2' v-model='pwd2' placeholder='确认密码'>
          <svg class="icon" aria-hidden="true" @click='seePassword(2)' ref='icon2'>
            <use xlink:href="#icon-yanjing"></use>
          </svg>
        </div>
      </main>
      <div class="bottom">
        <div class="text" v-show='correct'>
          <div class='icon' @click='active = !active'>
            <img src="../../../assets/selectAdd/selected.png" v-if='active'>
            <img src="../../../assets/selectAdd/select.png" v-else>
          </div>
          <p>我已阅读并同意<span @click='seeRule'>《用户注册协议》</span></p>
        </div>
        <button @click='submit'>{{btn}}</button>
      </div>
      <alert v-model="show" title="提示" @on-hide='sure'>{{msg}}</alert>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Countdown, Alert } from 'vux'
  import storage from 'good-storage'
  export default {
    props: {
      correct: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '忘记密码'
      },
      tels: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: '密码'
      }
    },
    data () {
      return {
        tel: '',
        pwd1: '',
        pwd2: '',
        code: '',
        time: 60,
        start: false, // 倒计时的flag
        active: true,   // 协议按钮的flag
        msg: '',
        show: false,      // alert的flag
        btn: '完成',
        success: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.tel = storage.get('mobile')
      // 用来手机验证的，因为要验证两次 所以提取出来
      this.regTel = /^1[34578]{1}\d{9}$/
      if (!this.title) {
        this.$router.go(-1)
      }
      if (this.title === '更改手机号') {
        this.btn = '下一步'
      } else {
        this.btn = '完成'
      }
    },
    methods: {
      seePassword (idx) {
        let val = this.$refs[`pwd${idx}`].getAttribute('type')
        // 做个字典来进行判断
        let dict = {
          'text': ['password', '#5eb29e'],
          'password': ['text', '#333']
        }
        this.$refs[`pwd${idx}`].setAttribute('type', dict[val][0])
        this.$refs[`icon${idx}`].style.fill = dict[val][1]
      },
      getCode () {
        if (!this.regTel.test(this.tel)) {
          this.msg = '请正确输入手机号码'
          this.show = true
          return
        } else {
          let url = this.api_token ? `/mobile/?act=member_account&op=modify_mobile_step2&api_token=${this.api_token}` : `/mobile/?act=connect&op=get_sms_captcha&phone=${this.tel}&type=3`
          this.$http.get(url).then(res => {
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
        // 修改密码
        if (this.title === '修改密码') {
          if (!this.regTel.test(this.tel)) {
            this.msg = '请正确输入手机号码'
            this.show = true
            return
          } else if (this.pwd1 !== this.pwd2) {
            this.msg = '两次输入的密码不一致'
            this.show = true
            return
          } else if (!this.active) {
            this.msg = '请选择接受用户注册协议'
            this.show = true
            return
          } else {
            this.$http.post(`/mobile/?act=member_account&op=edit_password&api_token=${this.api_token}`, {
              phone: this.tel,
              auth_code: this.code,
              password: this.pwd1,
              password1: this.pwd2
            }).then(res => {
              if (res.data.status === 200) {
                this.success = true
                this.show = true
                this.msg = '密码修改成功'
              } else {
                this.msg = '验证码输入错误'
                this.show = true
              }
            })
          }
        } else if (this.title === '更改手机号') {
          if (!this.regTel.test(this.tel)) {
            this.msg = '请正确输入手机号码'
            this.show = true
            return
          } else {
            this.$http.post(`/mobile/?act=member_account&op=edit_phoneone&api_token=${this.api_token}`, {
              auth_code: this.code
            }).then(res => {
              if (res.data.status === 200) {
                this.$router.push('/my/account/tel/newtel')
              } else {
                this.msg = '验证码输入错误'
                this.show = true
              }
            })
          }
        } else if (this.title === '忘记密码') {
          if (!this.regTel.test(this.tel)) {
            this.msg = '请正确输入手机号码'
            this.show = true
            return
          } else if (this.pwd1 !== this.pwd2) {
            this.msg = '两次输入的密码不一致'
            this.show = true
            return
          } else {
            this.$http.post('/mobile/?act=login&op=forget_password', {
              phone: this.tel,
              code: this.code,
              password: this.pwd1,
              password_confirm: this.pwd2
            }).then(res => {
              if (res.data.status === 200) {
                this.$router.go(-1)
              } else {
                this.msg = res.data.data.error
                this.show = true
              }
            })
          }
        }
      },
      sure () {
        // 统一跳转到首页
        this.success && this.$router.replace('/home')
      },
      seeRule () {
        console.log(1)
        this.$router.push('/service?type=regist_rule')
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
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
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
