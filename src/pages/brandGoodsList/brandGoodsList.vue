<template>
  <div class="container">
    <x-title :bottom='false'>中天羊业</x-title>
    <div class="goods_wrapper">
      <div class="goods" v-for='item of goodsList' @click='selectGoods(item.goods_id)'>
        <div class="brand">
          <img v-lazy='item.goods_image'>
        </div>
        <div class="desc">
          <h3>{{item.goods_name}}</h3>
          <span>{{item.goods_jingle}}</span>
          <strong>¥{{item.goods_price}}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        goodsList: []
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.id = this.$route.query.id
      this._getGoodsList()
    },
    methods: {
      selectGoods (id) {
        this.$router.push(`/product/${id}`)
      },
      _getGoodsList () {
        this.$http.get(`/api/goods/list?api_token=${this.api_token}&brand_id=${this.id}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.goodsList = res.data.data
          }
        })
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .container{
    .goods_wrapper{
      width: 100vw;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .goods{
        width: 49.2%;
        .brand{
          width: 100%;
          height: 230px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .desc{
          width: 100%;
          height: 96px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: @font-size-small-s;
          h3{
            width: 100%;
            padding: 0 4px;
            font-size: @font-size-medium;
            .no-wrap
          }
          span{
            line-height: 30px;
            color: #999;
            height: 30px;
          }
        }
      }
    }
  }
</style>
