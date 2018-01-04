<template>
  <transition name='slide'>
    <div class="container">
      <x-title>个人信息</x-title>
      <main class='vux-1px-b'>
        <div class="item vux-1px-b">
          <div class="left">头像</div>
          <!-- 
          <div class="right">
            <div class="img_wrapper">
              <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1722988955,2520640048&fm=58">
            </div>
          </div>
          -->
          <div class="uploader-container right">
            <div class="box">
              <van-uploader class='upload_item img_wrapper' :after-read="store">
                <img v-lazy="url">
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="item vux-1px-b">
          <div class="left">性别</div>
          <div class="right">
            <div class="radio_wrapper">
              <p @click='sex = 1'>
                <img src="../../../assets/selectAdd/selected.png" v-if='sex === 1'>
                <img src="../../../assets/selectAdd/select.png" v-else>男
              </p>
              <p @click='sex = 2'>
                <img src="../../../assets/selectAdd/selected.png" v-if='sex === 2'>
                <img src="../../../assets/selectAdd/select.png" v-else>女
              </p>
            </div>
          </div>
        </div>
        <div class="item vux-1px-b">
          <div class="left">昵称</div>
          <div class="right">
            <input type='text' v-model='nickname'></input>
          </div>
        </div>
        <div class="item">
          <div class="left">邮箱</div>
          <div class="right">
            <div class="right">
              <input type='text' v-model='email'></input>
            </div>
          </div>
        </div>
      </main>
      <button @click='submit'>保存</button>
      <Loading v-model='show'></Loading>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  import { Loading } from 'vux'
  export default {
    data () {
      return {
        sex: null,
        nickname: '',
        email: '',
        url: '',
        show: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this._getInfo()
    },
    methods: {
      store (file) {
        this.file = file
        this.url = file.content
      },
      submit () {
        let url = ''
        if (this.url.indexOf('http') === -1) url = this.url
        this.show = true
        this.$http.post(`/mobile/?act=member_index&op=save_memberinfo&api_token=${this.api_token}`, {
          member_name: this.nickname,
          member_sex: this.sex,
          member_email: this.email,
          member_avatar: url
        }).then(res => {
          if (res.data.status === 200) {
            this.show = false
            this.$router.go(-1)
          }
        })
      },
      _getInfo () {
        this.$http.get(`/mobile/?act=member_account&op=get_member_info&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let x = res.data.data
            this.nickname = x.member_name
            this.sex = x.member_sex | 0
            this.email = x.member_email
            this.url = x.avatar_url
          }
        })
      }
    },
    components: {
      XTitle,
      Loading
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
    z-index: 1;
    text-align: center;
    overflow-x: hidden;
    main{
      width: 100vw;
      padding-left: 15px;
      font-size: @font-size-medium;
      .item{
        height: 60px;
        width: 100%;
        padding-right: 15px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          width: 2em;
        }
        .right{
          flex: 1;
          height: 100%;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-end;
          align-items: center;
          .img_wrapper{
            width: 36px;
            height: 36px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
          }
          .radio_wrapper{
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            p{
              &~p{
                margin-left: 18px;
              }
              img{
                width: 18px;
                height: 18px;
                vertical-align: -.2em;
                margin-right: 10px;
              }
            }
          }
          input{
            text-align: right;
            border: 0;
          }
        }
      }
    }
    button{
      width: 85.333%;
      height: 50px;
      background: @color;
      border: 0;
      color: #fff;
      letter-spacing: 8px;
      text-align: center;
      line-height: 50px;
      margin-top: 40px;
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
