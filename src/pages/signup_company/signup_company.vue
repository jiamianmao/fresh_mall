<template>
  <transition name='slide'>
    <div class="container">
      <x-title>注册</x-title>
      <main class='vux-1px-b'>
        <div>
          <label for="name">企业名称</label>
          <input type="text" id='name' v-model='name' placeholder='企业名称'>
        </div>
        <div class=" vux-1px-t">
          <label for="tax">统一社会信用代码</label>
          <input type="text" id='tax' v-model='tax' placeholder='输入统一社会信用代码'>
        </div>
        <div class="vux-1px-t">
          <label for="pwd1">密码</label>
          <input class='pwd' type="password" id='pwd1' v-model='pwd1'>
          <svg class="icon" aria-hidden="true" @click='seePassword(0)'>
            <use xlink:href="#icon-yanjing"></use>
          </svg>
        </div>
        <div class="vux-1px-t">
          <label for="pwd2">确认密码</label>
          <input class='pwd' type="password" id='pwd2' v-model='pwd2'>
          <svg class="icon" aria-hidden="true" @click='seePassword(1)'>
            <use xlink:href="#icon-yanjing"></use>
          </svg>
        </div>
        <div class="vux-1px-t">
          <label for="tel">手机号</label>
          <input type="tel" id='tel' v-model='tel' placeholder='请输入您的手机号获得验证码'>
        </div>
        <div class="vux-1px-t">
          <label for="code">验证码</label>
          <input class='code' type="tel" v-model='code' id='code' maxlength='6'>
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
          <p>我已阅读并同意<span @click='seeRule'>《用户注册协议》</span></p>
        </div>
        <button @click='submit'>注册</button>
      </div>
      <alert v-model="show" title="请注意">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Countdown, Alert } from 'vux'
  import $ from 'jquery'
  export default {
    data () {
      return {
        name: '',
        tax: '',
        pwd1: '',
        pwd2: '',
        tel: '',
        code: '',
        time: 60,
        start: false,
        active: false,
        show: false,
        msg: ''
      }
    },
    methods: {
      seePassword (n) {
        if ($(`.pwd:eq(${n})`).attr('type') === 'text') {
          $(`.pwd:eq(${n})`).attr('type', 'password')
          $(`.icon:eq(${n})`).css({fill: '#5eb29e'})
        } else {
          $(`.pwd:eq(${n})`).attr('type', 'text')
          $(`.icon:eq(${n})`).css({fill: '#333'})
        }
      },
      getCode () {
        let regTel = /^1[34578]{1}\d{9}$/
        if (!regTel.test(this.tel.trim())) {
          this.show = true
          this.msg = '请正确输入您的手机号'
          return
        }
        this.$http.get(`/mobile/?act=connect&op=get_sms_captcha&phone=${this.tel}&type=1`).then(res => {
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
      submit () {
        if (this.active) {
          this.show = true
          this.msg = '请阅读并同意用户注册协议'
          return
        }
        let phone = this.tel
        let password = this.pwd1
        let passwordConfirm = this.pwd2
        let code = this.code
        let businessName = this.name
        let taxNumber = this.tax
        this.$http.post('/mobile/?act=login&op=company_register', {
          phone,
          password,
          password_confirm: passwordConfirm,
          code,
          business_name: businessName,
          tax_number: taxNumber
        }).then(res => {
          if (res.data.status === 200) {
            // 跳转到登录页面
            this.$router.go(-2)
          } else {
            this.show = true
            this.msg = res.data.data.error
          }
        })
      },
      seeRule () {
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
    min-height: 603px;
    background: #F4F4F4;
    main{
      width: 100%;
      padding-left: 15px;
      background: #fff;
      font-size: @font-size-medium;
      >div{
        height: 10vh;
        min-height: 60px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        position: relative;
        justify-content: space-between;
        img{
          width: 18px;
          height: 20px;
          margin-right: 10px;
        }
        label{
          width: 8em;
        }
        input{
          flex: 1;
          border: 0;
          text-align: right;
          padding: 0;
          padding-right: 15px;
          line-height: 20px;
          height: 20px;
          &.pwd{
            padding-right: 24vw;
          }
          &.code{
            padding-right: 24vw;
          }
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
          top: 50%;
          right: 15px;
          transform: translate3d(0, -50%, 0);
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
        min-height: 50px;
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
