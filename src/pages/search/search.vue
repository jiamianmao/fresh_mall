<template>
  <div class='container'>
    <search @close='close' @toSearch='toSearch' :rightContent='rightContent'></search>
    <div class="main">
      <div class="item" v-for='item of result' @click='select(item.goods_id)'>
        <img v-lazy='item.goods_image'>
        <div class="down">
          <h1 class='title'>{{item.goods_name}}</h1>
          <p class='desc' v-html='item.goods_jingle'></p>
          <p class='price'>¥{{item.goods_price}}</p>
        </div>
      </div>
      <div class="nothing" v-show='nothing'>很抱歉，暂时没有与{{keyword}}相关的产品</div>
    </div>
  </div>
</template>
<script>
  import Search from '@/components/search/search'
  import Storage from 'good-storage'
  export default {
    data () {
      return {
        rightContent: '取消',
        result: [],
        nothing: false,
        keyword: ''
      }
    },
    created () {
      this.api_token = Storage.get('api_token')
    },
    methods: {
      close () {
        this.$router.go(-1)
      },
      toSearch (keyword) {
        this.keyword = keyword
        // 拿到搜索关键词去交互
        this.$http.get(`/api/goods/list?api_token=${this.api_token}&name=${keyword}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            if (res.data.data.length === 0) {
              this.nothing = true
            } else {
              this.nothing = false
              this.result = res.data.data
            }
          }
        })
      },
      select (id) {
        this.$router.push(`product/${id}`)
      }
    },
    components: {
      Search
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    z-index: 1;
    .main{
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .item{
        width: 49.2%;
        height: calc(~"50vh - 25px");
        text-align: center;
        display: flex;
        flex-direction: column;
        img{
          width: 100%;
          height: 230px;
        }
        .down{
          flex: 1;
          overflow: hidden;
          .title{
            font-size: @font-size-medium;
          }
          .desc{
            font-size: @font-size-small;
            color: #858585;
            height: 12px;
          }
          .price{
            font-size: @font-size-small;
            font-weight: bold;
            margin-top: 6px;
          }
        }
      }
      .nothing{
        position: absolute;
        top: 20%;
        left: 50%;
        text-align: center;
        width: 100vw;
        transform: translate3d(-50%, 0, 0);
        color: #666;
        font-size: @font-size-medium;
      }
    }
  }
</style>
