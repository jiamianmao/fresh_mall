<template>
  <div class="container">
    <x-title>评价列表</x-title>
    <div class="wrapper">
      <rate-item v-for='(item, index) of rateList' :key='index' :rateData='item'></rate-item>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import RateItem from '@/components/rate_item/rate_item'
  export default {
    data () {
      return {
        rateList: []
      }
    },
    created () {
      // 产品id
      this.id = this.$route.query.id
      this._getRateList()
    },
    methods: {
      _getRateList () {
        this.$http.get(`/mobile/?act=goods&op=goods_evaluate&goods_id=${this.id}`).then(res => {
          if (res.data.status === 200) {
            this.rateList = res.data.data.goods_eval_list
          }
        })
      }
    },
    components: {
      XTitle,
      RateItem
    }
  }
</script>
<style lang="less" scoped>
  .container{
    width: 100vw;
    min-height: 100vh;
    .wrapper{
      width: 100%;
      padding: 0 15px;
    }
  }
</style>
