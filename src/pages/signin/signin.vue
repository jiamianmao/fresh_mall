<template>
  <div class="container">
    <div class="brand"></div>
    <main class='vux-1px-b vux-1px-t'>
      <div class="username">
        <img src="../../assets/login/tel.png"><input type="tel" v-model='tel' placeholder='手机号' maxlength='11'>
      </div>
      <div class="password vux-1px-t">
        <img src="../../assets/login/pwd.png"><input type="password" ref='pwd' v-model='pwd' placeholder='密码'>
        <svg class="icon" aria-hidden="true" @click='seePassword'>
          <use xlink:href="#icon-yanjing"></use>
        </svg>
      </div>
    </main>
    <div class="bottom">
      <button @click='login'>登录</button>
      <div class="fun">
        <div class="sign" @click='signup'>立即注册</div>
        <div class="forget" @click='forget'>忘记密码？</div>
      </div>
    </div>
    <div class="types">
      <divider>你还可以用以下方式登录</divider>
      <div class="wrapper">
        <img src="../../assets/login/wechat.png">
        <img src="../../assets/login/qq.png">
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import { Divider } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        tel: '',
        pwd: ''
      }
    },
    created () {
    },
    methods: {
      seePassword () {
        let pwd = this.$refs.pwd
        if (pwd.getAttribute('type') === 'text') {
          this.$refs.pwd.setAttribute('type', 'password')
        } else {
          this.$refs.pwd.setAttribute('type', 'text')
        }
      },
      signup () {
        this.$router.push('/signup')
      },
      forget () {
        this.$router.push('/signin/forgetpassword')
      },
      login () {
        console.log(1)
        let username = this.tel
        let password = this.pwd
        let client = 'wap'
        this.$http({
          url: '/apis/mobile/?act=login',
          method: 'POST',
          data: {
            username,
            password,
            client,
            code: 123
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          if (res.data.status === 200) {
            storage.set('api_token', res.data.data.api_token)
            let url = storage.get('currentUrl')
            this.$router.push({
              path: url
            })
          } else {
            alert('账号密码错误')
          }
        })
      }
    },
    components: {
      Divider
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
      width: 100%;
      background: url('../../assets/login/brand.png') no-repeat 0 0 ~"/"100% 100%;
    }
    main{
      width: 100%;
      height: 19.6vh;
      padding-left: 15px;
      >div{
        height: 50%;
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
