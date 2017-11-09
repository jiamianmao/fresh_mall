<template>
  <transition name='slide'>
    <div class='box'>
      <x-title>收货地址</x-title>
      <div class="container">
        <div class="content" v-for='(item, index) of list'>
          <div class="add vux-1px-b">
            <div class="top">
              <span class='name'>{{item.true_name}}</span>
              <span>{{item.tel_phone}}</span>
            </div>
            <div class="bottom">
              {{item.area_info | blank}}{{item.address}}
            </div>
          </div>
          <div class="config">
            <div class="left" @click='select(item)'>
              <img src="../../../assets/selectAdd/selected.png" v-if='parseInt(item.is_default)'>
              <img src="../../../assets/selectAdd/select.png" v-else>
              <span>默认地址</span>
            </div>
            <div class="right">
              <span @click='change(item.address_id)'><img src="../../../assets/selectAdd/rewrite.png" >编辑</span>
              <span @click='del(item.address_id)'><img class='del' src="../../../assets/selectAdd/del.png">删除</span>
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
  import storage from 'good-storage'
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
      this.api_token = storage.get('api_token')
      this._getAddList()
    },
    methods: {
      select (item) {
        this.$http.post(`/mobile/?act=member_address&op=address_edit&api_token=${this.api_token}`, {
          true_name: item.true_name,
          area_info: item.area_info,
          address: item.address,
          tel_phone: item.tel_phone,
          area_id: item.area_id,
          city_id: item.city_id,
          is_default: 1,
          address_id: item.address_id
        }).then(res => {
          if (res.data.status === 200) {
            this.$router.go(-1)
            // this._getAddList()
          }
        })
      },
      addAddress () {
        this.$router.push({
          path: '/my/address/add'
        })
      },
      // 删除用了一个modal做了层拦截，sure方法是Handler函数
      del (id) {
        this.current = id
        this.show = true
      },
      sure () {
        this.$http.post(`/mobile/?act=member_address&op=address_del&api_token=${this.api_token}`, {
          address_id: this.current
        }).then(res => {
          if (res.data.status === 200) {
            this._getAddList()
          }
        })
      },
      change (id) {
        this.$router.push({
          path: '/my/address/add',
          query: {
            id
          }
        })
      },
      _getAddList () {
        this.$http.get(`/mobile/?act=member_address&op=address_list&api_token=${this.api_token}`).then(res => {
          this.list = res.data.data.address_list
        })
      }
    },
    components: {
      XTitle,
      Scroll,
      Actionsheet
    },
    // 这里是把addressAdd组件里数据不做处理，在address组件里处理，因为还需要编辑，处理起来比较麻烦
    filters: {
      blank (value) {
        return value.replace(/\s/g, '')
      }
    },
    watch: {
      $route () {
        if (this.$route.path === '/my/address') {
          this._getAddList()
        }
      }
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
        font-size: @font-size-medium;
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
