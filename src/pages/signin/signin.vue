<template>
  <div class="container">
    <div class="brand">
      <img src="../../assets/login/avatar.jpg">
    </div>
    <main class='vux-1px-b vux-1px-t'>
      <div class="username">
        <img src="../../assets/login/tel.png"><input type="tel" v-model='tel' placeholder='手机号' maxlength='11'>
      </div>
      <div class="password vux-1px-t">
        <img src="../../assets/login/pwd.png"><input type="password" ref='pwd' v-model='pwd' @keyup.enter='login' placeholder='密码'>
        <svg class="icon" aria-hidden="true" ref='icon' @click='seePassword'>
          <use xlink:href="#icon-yanjing"></use>
        </svg>
      </div>
    </main>
    <div class="bottom">
      <!-- <span style='color: red; display: inline-block; margin-bottom: 20px; font-size: 12px;'>内部流通，暂不对外开放，敬请稍后!</span>-->
      <button @click='login'>登录</button>
      <div class="fun">
        <div class="sign" @click='signup'>立即注册</div>
        <div class="forget" @click='forget'>忘记密码？</div>
      </div>
    </div>
    <!-- <div class="types">
      <divider>你还可以用以下方式登录</divider>
      <div class="wrapper">
        <img @click='loginByWechat' src="../../assets/login/wechat.png">
      </div>
    </div> -->
    <alert v-model="show" title="提示">{{msg}}</alert>
    <router-view></router-view>
  </div>
</template>
<script>
  import { Divider, Alert, cookie } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        tel: '',
        pwd: '',
        show: false,
        msg: ''
      }
    },
    created () {
      this.url = storage.get('currentUrl') || '/'
      this.api_token = cookie.get('api_token')
      storage.set('api_token', this.api_token)
      if (this.api_token) {
        this.$router.replace(this.url)
      }
    },
    methods: {
      seePassword () {
        let pwd = this.$refs.pwd
        if (pwd.getAttribute('type') === 'text') {
          this.$refs.pwd.setAttribute('type', 'password')
          this.$refs.icon.style.fill = '#5eb29e'
        } else {
          this.$refs.pwd.setAttribute('type', 'text')
          this.$refs.icon.style.fill = '#333'
        }
      },
      signup () {
        this.$router.push('/signup')
      },
      forget () {
        this.$router.push('/signin/forgetpassword')
      },
      login () {
        let username = this.tel
        let password = this.pwd
        let client = 'wap'
        this.$http.post('/mobile/?act=login', {
          username,
          password,
          client,
          code: 123
        }).then(res => {
          if (res.data.status === 200) {
            // 其实应该以对象的方式存入进去的
            storage.set('api_token', res.data.data.api_token)
            storage.set('member_class', res.data.data.member_class)
            storage.set('mobile', res.data.data.member_mobile)
            this.$router.replace({
              path: this.url
            })
          } else {
            this.msg = res.data.data.error
            this.show = true
          }
        })
      },
      loginByWechat () {
        let ua = navigator.userAgent.toLowerCase()
        // 是微信登录
        if (ua.indexOf('micromessenger') !== -1) {
          let url = `redirect=${encodeURIComponent(window.location.href)}`
          this.$router.push(`/auth?${url}`)
        } else {
          // 不是微信登录
          this.$router.push('/auth')
        }
      }
    },
    components: {
      Divider,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .brand{
      height: 32.558vh;
      min-height: 200px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 100px;
        height: 100px;
      }
    }
    main{
      width: 100%;
      height: 19.6vh;
      min-height: 120px;
      padding-left: 15px;
      >div{
        height: 50%;
        min-height: 60px;
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
          height: 26px;
          border: 0;
          line-height: 26px;
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
      }
    }
    .bottom{
      width: 100vw;
      margin-top: 3.32226vh;
      text-align:center;
      button{
        height: 50px;
        width: 85.33vw;
        border: 0;
        color: #fff;
        background: @color;
        letter-spacing: 12px;
      }
      .fun{
        height: 52px;
        width: 100%;
        padding: 0 48px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        color: #999;
        font-size: @font-size-medium;
      }
    }
    .types{
      margin-top: 2.4917vh;
      width: 100%;
      padding: 0 28px;
      .wrapper{
        height: 17.608vh;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        img{
          width: 8.305648vh;
          height: 8.305648vh;
          &~img{
            margin-left: 50px;
          }
        }
      }
    }
  }
</style>
