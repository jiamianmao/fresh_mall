<template>
  <transition name='slide'>
    <div class='box'>
      <x-title class='header'>收货地址</x-title>
      <div class="container">
        <div class="content" v-for='(item, index) of list'>
          <div class="add vux-1px-b">
            <div class="top">
              <span class='name'>{{item.name}}</span>
              <span>{{item.tel}}</span>
            </div>
            <div class="bottom">
              {{item.add}}
            </div>
          </div>
          <div class="config">
            <div class="left" @click='select(index)'>
              <img src="../../../assets/selectAdd/selected.png" v-if='item.flag'>
              <img src="../../../assets/selectAdd/select.png" v-else>
              <span>默认地址</span>
            </div>
            <div class="right">
              <span><img src="../../../assets/selectAdd/rewrite.png" >编辑</span>
              <span @click='del(index)'><img class='del' src="../../../assets/selectAdd/del.png">删除</span>
            </div>
          </div>
        </div>
      </div>
      <button @click='addAddress'>新增地址</button>
      <actionsheet v-model="show" :menus="menus" @on-click-menu-delete="sure" show-cancel></actionsheet>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import { Actionsheet } from 'vux'
  export default {
    data () {
      return {
        list: [],
        show: false,
        current: 0,
        menus: {
          title: '是否确认删除该地址',
          delete: '<span style="color:red">删除</span>'
        }
      }
    },
    created () {
      this._getAddList()
    },
    methods: {
      select (idx) {
        this.list.forEach(item => {
          item.flag = 0
        })
        this.list[idx].flag = 1
      },
      addAddress () {
        this.$router.push({
          path: '/my/address/add'
        })
      },
      del (idx) {
        this.current = idx
        this.show = true
      },
      sure () {
        console.log(this.current)
      },
      _getAddList () {
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/add').then(res => {
          this.list = res.data.data
        })
      }
    },
    components: {
      XTitle,
      Scroll,
      Actionsheet
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .box{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: #f4f4f4;
    padding-bottom: 50px;
    z-index: 1;
  }
  .header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }
  .container{
    width: 100vw;
    .content{
      padding-left: 15px;
      background: #fff;
      .add{
        width: 100%;
        padding: 22px 15px 22px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .top{
          margin-bottom: 12px;
          .name{
            margin-right: 15px;
          }
        }
        .bottom{
          color: #333;
          font-size: @font-size-small;
          line-height: 16px;
        }
      }
      .config{
        height: 40px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding-right: 12px;
        color: #333;
        .left, .right{
          height: 100%;
          display: flex;
          align-items: center;
        }
        .del{
          margin-left: 22px;
        }
        img{
          width: 18px;
          height: 18px;
          vertical-align: -.2em;
          margin-right: 10px;
        }
      }
      &~.content{
        margin-top: 10px;
      }
    }
  }
  button{
    width: 100%;
    height: 50px;
    color: #fff;
    letter-spacing: 2px;
    background: #5eb29e;
    border: 0;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
