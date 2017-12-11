<template>
  <div class='item' v-if='goods.goods_list.length'>
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
      <swiper-slide v-for='(item, index) of goods.goods_list' :key='index' @click.native='goProduct(item.goods_id)'>
        <img v-lazy="item.img_url">
      </swiper-slide>
    </swiper>
    <div class="text">
      <h3>{{text.goods_name}}</h3>
      <p v-html='text.goods_jingle'></p>
      <strong>¥{{text.goods_price}}<span v-show='text.goods_unit'>/</span>{{text.goods_unit}}</strong>
      <button @click='goCate(goods.gc_id)'>
        <span>更多{{goods.gc_name}}</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yuanjiantou"></use>
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
  let index = 0
  export default {
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
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
      if (this.goods.goods_list.length === 0) {
        this.text = {}
      } else if (this.goods.goods_list.length === 1) {
        this.text = this.goods.goods_list[0]
      } else {
        this.text = this.goods.goods_list[index]
      }
    },
    methods: {
      goProduct (id) {
        this.$router.push(`/product/${id}`)
      },
      goCate (id) {
        this.$router.push(`/goodsList/?gc_id=${id}`)
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    watch: {
      swiperOption: {
        handler () {
          this.text = this.goods.goods_list[this.swiperOption.idx]
        },
        deep: true
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
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
        width: 90%;
        text-align: center;
        .no-wrap
      }
      p{
        width: 90%;
        margin-top: 10px;
        color: #666;
        text-align: center;
        font-size: @font-size-small;
        .no-wrap
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
