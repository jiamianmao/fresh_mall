<template>
  <div id="app">
    <keep-alive include='firmorder,map,product,qualification,map,mapziti'>
      <router-view @position='_getPosition'></router-view>
    </keep-alive>
    <tab></tab>
  </div>
</template>

<script>
  // index.html引入了qq对象，防止eslint报错
  /* eslint-disable no-undef */
  import Tab from '@/components/tab/tab'
  import storage from 'good-storage'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 初始化的时候请求
      this.api_token && this._getShopCart()
    },
    methods: {
      _getPosition () {
        console.log(1)
        let geolocation = new qq.maps.Geolocation('2JHBZ-UC7WO-MKLWW-SDXUZ-WSI4J-XYF25', 'jiamianmao2ss')
        geolocation.getLocation((position) => {
          this.SET_POSITION({
            lat: position.lat,
            lng: position.lng,
            city: position.city
          })
          position.city && storage.set('city', position.city)
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
    components: {
      Tab
    }
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
