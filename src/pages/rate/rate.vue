<template>
  <div class="container">
    <x-title>{{title}}</x-title>
    <div class="box">
      <rate-item class='list' v-show='rateList.length > 0' v-for='(item, index) of rateList' :key='index' :rateData='item'></rate-item>
      <rate-item @del='del' class='items' :class='{"mar": index > 0}' 
        v-if='goods_list.length > 0' v-for='(item, index) of goods_list' 
        :key='index' :rateDataOrder='item' :member='userInfo'>
      </rate-item>
      <div class="not_order" v-if='title === "评价" && goods_list.length === 0'>
        <img src="../../assets/my/not_order.png">
        <p>评价已删除</p>
      </div>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  import RateItem from '@/components/rate_item/rate_item'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data () {
      return {
        rateList: [],
        goods_list: [],
        title: ''
      }
    },
    created () {
      // 产品id
      this.id = this.$route.query.id
      this.order = this.$route.query.order
      this.api_token = storage.get('api_token')
      if (this.id) {
        this._getRateList()
        this.title = '评价列表'
      } else {
        if (!this.userInfo.avatar_url) {
          this._getMemberDetail()
        }
        this._getOrderDetail()
        this.title = '评价'
      }
    },
    methods: {
      del (id) {
        this.$http.post(`/mobile/?act=member_evaluate&op=del_evaluate&api_token=${this.api_token}`, {
          geval_id: id
        }).then(res => {
          if (res.data.status === 200) {
            this._getOrderDetail()
          }
        })
      },
      _getRateList () {
        this.$http.get(`/mobile/?act=goods&op=goods_evaluate&goods_id=${this.id}`).then(res => {
          if (res.data.status === 200) {
            this.rateList = res.data.data.goods_eval_list
          }
        })
      },
      _getOrderDetail () {
        this.$http.get(`/mobile/?act=member_order&op=order_info&api_token=${this.api_token}&order_id=${this.order}`).then(res => {
          if (res.data.status === 200) {
            this.goods_list = []
            res.data.data.order_info.goods_list.forEach(item => {
              if (item.evaluation.geval_state === '0') {
                this.goods_list.push(item)
              }
            })
          }
        })
      },
      _getMemberDetail () {
        this.$http.get(`/mobile/?act=member_account&op=get_member_info&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.SET_USERINFO(res.data.data)
          }
        })
      },
      ...mapMutations([
        'SET_USERINFO'
      ])
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    components: {
      XTitle,
      RateItem
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    min-height: 100vh;
    background: #f4f4f4;
    .box{
      width: 100%;
      .mar{
        margin-top: 10px;
      }
    }
    .list{
      padding: 0 15px;
      background: #fff;
    }
    .not_order{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 131px;
      height: 78px;
      img{
        width: 100%;
        height: 100%;
      }
      p{
        position: absolute;
        font-size: @font-size-small;
        bottom: -26px;
        left: 0;
        width: 100%;
        color: #ababab;
        text-align: center;
      }
    }
  }
</style>
