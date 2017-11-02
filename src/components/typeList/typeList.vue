<template>
  <div class='item'>
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
      <swiper-slide v-for='item of arr' :key='item.name'>
        <img :src="item.url">
      </swiper-slide>
    </swiper>
    <div class="text">
      <h3>{{text.name}}</h3>
      <p>{{text.adWord}}</p>
      <strong>{{text.price}}</strong>
      <button>
        <span>更多海鲜水产</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yuanjiantou"></use>
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
  const index = 1
  export default {
    data () {
      return {
        arr: [],
        text: {},
        notNextTick: true,
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 9,
          idx: index,
          initialSlide: index,
          onSlideChangeEnd (swiper) {
            this.idx = swiper.activeIndex
          }
        }
      }
    },
    created () {
      this._getCategoryData()
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      _getCategoryData () {
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/getCategoryData').then(res => {
          this.arr = res.data.data[0].list
          this.text = this.arr[index]
        })
      }
    },
    watch: {
      swiperOption: {
        handler () {
          this.text = this.arr[this.swiperOption.idx]
        },
        deep: true
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .item{
    height: 480px;
    width: 100vw;
    margin-top: 15px;
    .swiper-wrapper{
      .swiper-slide {
        width: 70vw;
        height: 345px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .text{
      height: 135px;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      h3{
        margin-top: 20px;
      }
      p{
        margin-top: 10px;
        color: #666;
        font-size: @font-size-small;
      }
      strong{
        margin: 12px 0;
      }
      button{
        width: 180px;
        height: 28px;
        background: #e5e5e5;
        line-height: 28px;
        border: 0;
        color: #333;
        font-size: @font-size-small;
        span{
          margin-right: 4px;
        }
        .icon {
          width: 1em; height: 1em;
          vertical-align: -0.2em;
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
  }
</style>
