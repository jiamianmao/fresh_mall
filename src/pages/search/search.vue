<template>
  <div class='container'>
    <search @close='close' @toSearch='toSearch' :rightContent='rightContent'></search>
    <div class="main">
      <div class="item" v-for='n of 3'>
        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=838889014,1211497536&fm=27&gp=0.jpg" alt="">
        <div class="down">
          <h1 class='title'>泰国原装进口山竹</h1>
          <p class='desc'>雪白多汁，清新爽口</p>
          <p class='price'>¥98</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Search from '@/components/search/search'
  export default {
    data () {
      return {
        rightContent: '取消'
      }
    },
    methods: {
      close () {
        this.$router.go(-1)
      },
      toSearch (word) {
        // 拿到搜索关键词去交互
        console.log(word)
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
          }
          .price{
            font-size: @font-size-small;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
