<template>
  <transition name='slide'>
    <div class='box'>
      <x-title>收货地址</x-title>
      <div class="container">
        <div class="content" v-for='(item, index) of list' @click='select(item)'>
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
            <div class="left">
              <img src="../../../assets/selectAdd/selected.png" v-if='parseInt(item.is_default)'>
              <img src="../../../assets/selectAdd/select.png" v-else>
              <span>默认地址</span>
            </div>
            <div class="right">
              <span @click.stop='change(item.address_id, item.is_default)'><img src="../../../assets/selectAdd/rewrite.png" >编辑</span>
              <span @click.stop='del(item.address_id)'><img class='del' src="../../../assets/selectAdd/del.png">删除</span>
            </div>
          </div>
        </div>
      </div>
      <button @click='addAddress'>新增地址</button>
      <actionsheet v-model="show" :menus="menus" @on-click-menu-delete="sure" show-cancel></actionsheet>
      <div class="mask" v-show='setUp'>
        <x-icon type="ios-checkmark-outline" size="38"></x-icon>
        <p>设置成功</p>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'
  import { Actionsheet } from 'vux'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        list: [],
        show: false,
        current: 0,
        setUp: false,
        menus: {
          title: '是否确认删除该地址',
          delete: '<span style="color:red">删除</span>'
        }
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 因为是一个组件在多个路由使用，所以需要灵活写路由
      this.initPath = this.$route.path
      this.brand_id = this.$route.query.id
      this.transport = this.$route.query.transport
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
            this._getAddList()
            this.setUp = true
          }
        })
      },
      addAddress () {
        this.$router.push({
          path: `${this.initPath}/add`
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
      // 编辑地址
      change (id, status) {
        this.$router.push({
          path: '/my/address/add',
          query: {
            id,
            status
          }
        })
      },
      _getAddList () {
        this.$http.get(`/mobile/?act=member_address&op=address_list&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.list = res.data.data.address_list
            if (this.brand_id) {
              this.list.forEach(item => {
                if (~~item.is_default === 1) {
                  this.address = item
                }
              })
              let address = {
                brand_id: this.brand_id,
                address: this.address
              }
              let addressType = {
                id: this.brand_id,
                transport: this.transport,
                store_id: null,
                store_add: this.address
              }
              this.SET_ADDRESS(address)
              this.SET_ADDRESS_TYPE(addressType)
            }
          }
        })
      },
      ...mapMutations([
        'SET_ADDRESS',
        'SET_ADDRESS_TYPE'
      ])
    },
    components: {
      XTitle,
      Scroll,
      Actionsheet
    },
    // 这里是把addressAdd组件里数据不做处理，在address组件里处理。因为还需要编辑，处理起来比较麻烦
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
      },
      setUp (newVal) {
        if (newVal === true) {
          setTimeout(() => {
            this.$router.go(-1)
          }, 200)
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
  .mask{
    width: 120px;
    height: 100px;
    border-radius: 6px;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    color: #fff;
    .vux-x-icon {
      fill: #fff;
    }
    p{
      margin-top: 15px;
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
