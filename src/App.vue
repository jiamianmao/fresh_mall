<template>
  <div id="app">
    <router-view></router-view>
    <tab :num='num'></tab>
  </div>
</template>

<script>
import Tab from '@/components/tab/tab'
import storage from 'good-storage'
export default {
  data () {
    return {
      num: 0
    }
  },
  created () {
    this.api_token = storage.get('api_token')
    this._getShopCart()
  },
  methods: {
    _getShopCart () {
      this.$http.get(`/mobile/?act=member_cart&op=cart_list&api_token=${this.api_token}`).then(res => {
        if (res.data.status === 200) {
          let num = 0
          res.data.data.cart_list.forEach(item => {
            item.goods.forEach(x => {
              num += ~~x.goods_num
            })
          })
          this.num = num
        }
      })
    }
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
