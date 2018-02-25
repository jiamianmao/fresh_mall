<template>
  <div class='item' v-if='goods.goods_list.length'>
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
      <swiper-slide v-for='(item, index) of goods.goods_list' :key='index' @click.native='goProduct(item.goods_id)'>
        <img v-lazy="item.img_url">
        <div class="mask" v-show='index !== swiperOption.idx'></div>
      </swiper-slide>
    </swiper>
    <div class="text">
      <h3 class='title'>{{text.goods_name}}</h3>
      <p v-html='text.goods_jingle'></p>
      <strong>
        <span class='price'>¥{{text.goods_price}}</span>
        <span class='box' v-show='text.goods_unit'>
          <span class='fen'>/</span>
          <span class='unit'>{{text.goods_unit}}</span>
        </span>
      </strong>
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
  let index = 1
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
          spaceBetween: 8,
          idx: index,
          initialSlide: index,
          onSlideChangeStart (swiper) {
            this.idx = swiper.activeIndex
          }
        }
      }
    },
    created () {
      if (this.goods.goods_list.length === 0) {
        this.text = {}
      } else if (this.goods.goods_list.length === 1) {
        this.swiperOption.idx = 0
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
          let list = this.goods.goods_list
          this.text = list[this.swiperOption.idx]
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
    width: 100vw;
    .swiper-wrapper{
      .swiper-slide {
        width: 69.2vw;
        height: 92.26667vw;
        position: relative;
        .mask{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, .4);
        }
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
      .title{
        padding: 1px 0;
        margin-top: 20px;
        width: 90%;
        text-align: center;
        font-size: @font-size-medium-x;
        font-weight: bold;
        color: #111;
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
