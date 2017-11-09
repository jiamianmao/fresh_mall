<template>
  <transition name='slide'>
    <div class="container">
      <x-title>账户管理</x-title>
      <div class="content vux-1px-b">
        <div class="password" @click='password'>
          <span>修改登录密码</span>
          <x-icon type="ios-arrow-right" size="22"></x-icon>
        </div>
        <div class="tel vux-1px-t" @click='tel'>
          <span>更改绑定手机号</span>
          <x-icon type="ios-arrow-right" size="22"></x-icon>
        </div>
      </div>
      <router-view :correct='correct' :title='title' :tels='tels' :text='text'></router-view>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        title: '',
        tels: false,
        correct: false,
        text: ''
      }
    },
    methods: {
      password () {
        this.title = '修改密码'
        this.correct = true
        this.tels = false
        this.text = '新密码'
        this.$router.push('/my/account/password')
      },
      tel () {
        this.title = '更改手机号'
        this.correct = false
        this.tels = true
        this.$router.push('/my/account/tel')
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
    z-index: 1;
    .content{
      width: 100%;
      padding-left: 15px;
      div{
        height: 50px;
        width: 100%;
        padding-right: 15px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .vux-x-icon {
          fill: #999;
        }
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
