<template>
  <div class='container'>
    <search ref='search' @close='close' @toSearch='toSearch' :rightContent='rightContent'></search>
    <div class="main">
      <div class="item" v-for='item of result' @click='select(item.goods_id)'>
        <div class="img_box">
          <img v-lazy='item.goods_image'>
        </div>
        <div class="down">
          <h1 class='title'>{{item.goods_name}}</h1>
          <p class='desc' v-html='item.goods_jingle'></p>
          <strong>
            <span class='price'>¥{{item.goods_price}}</span>
            <span class='box' v-if='item.goods_unit'>
              <span class='fen'>/</span>
              <span class='unit'>{{item.goods_unit}}</span>
            </span>
          </strong>
        </div>
      </div>
      <div class="nothing" v-show='nothing'>
        <img src="../../assets/home/no_result.png">
        <p>很抱歉，暂时没有与{{keyword}}相关的产品</p>
      </div>
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
            }
            this.result = res.data.data
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
  @import '~common/less/mixin';
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
        text-align: center;
        display: flex;
        flex-direction: column;
        .img_box{
          width: 100%;
          height: 0;
          padding-top: 125%;
          position: relative;
          img{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
        .down{
          flex: 1;
          padding: 0 5%;
          text-align: center;
          overflow: hidden;
          padding-bottom: 25px;
          .title{
            padding: 1px 0;
            margin-top: 21px;
            margin-bottom: 0;
            font-size: @font-size-medium;
            .no-wrap
          }
          .desc{
            font-size: @font-size-small;
            line-height: 29px;
            color: #858585;
            height: 29px;
            .no-wrap
          }
          strong{
            // margin: 12px 0;
            font-size: 0;
            .price{
              font-size: @font-size-medium;
              font-weight: bold;
            }
            .box{
              .fen{
                font-size: @font-size-medium-x;
              }
              .unit{
                font-size: @font-size-small-s !important;
              }
            }
          }
        }
      }
      .nothing{
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        width: 100vw;
        transform: translate3d(-50%, -50%, 0);
        color: #999;
        font-size: @font-size-medium;
        img{
          width: 68px;
          height: 62px;
          margin-bottom: 22px;
        }
      }
    }
  }
</style>
