<template>
  <div id="app">
    <keep-alive include='firmorder,maps,mapziti,product,qualification,home,category,signup'>
      <router-view @position='_getPosition'></router-view>
    </keep-alive>
    <tab></tab>
    <loading v-model='isLoading'></loading>
  </div>
</template>

<script>
  // index.html引入了qq对象，防止eslint报错
  /* eslint-disable no-undef */
  import Tab from '@/components/tab/tab'
  import storage from 'good-storage'
  import { Loading } from 'vux'
  import { mapMutations, mapGetters } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    created () {
      storage.remove('currentUrl')
      this.api_token = storage.get('api_token')
      // 初始化的时候请求
      // 获取购物车信息
      this.api_token && this._getShopCart()
      // 缓存openid
      // this.$http.get(`/api/wx/snsapi_base`)
    },
    methods: {
      _getPosition () {
        let geolocation = new qq.maps.Geolocation('2JHBZ-UC7WO-MKLWW-SDXUZ-WSI4J-XYF25', 'jiamianmao2ss')
        geolocation.getLocation((position) => {
          this.SET_POSITION({
            lat: position.lat,
            lng: position.lng,
            city: position.city
          })
          position.city && storage.session.set('city', position.city)
        })
      },
      _getShopCart () {
        this.$http.get(`/api/cart/list?api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let num = 0
            if (res.data.data) {
              res.data.data.list.forEach(item => {
                item.goods.forEach(x => {
                  num += ~~x.goods_num
                })
              })
            }
            this.SET_CART_COUNT(num)
          } else if (res.data.status === 400) {
            storage.remove('api_token')
            storage.remove('member_class')
            storage.remove('currentUrl')
          }
        })
      },
      ...mapMutations([
        'SET_CART_COUNT',
        'SET_POSITION'
      ])
    },
    computed: {
      ...mapGetters([
        'isLoading'
      ])
    },
    components: {
      Tab,
      Loading
    }
    // watch: {
      // $route (newVal) {
      //   if (newVal.path !== '/signin' && !storage.get('api_token')) {
      //     this.$router.push('/signin')
      //   }
      // }
    // }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
  #app{
    // padding-bottom: 50px;
    // box-sizing: border-box;
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: all .5s;
	}
	.router-fade-enter, .router-fade-leave-to {
    opacity: 0;
	}
</style>
