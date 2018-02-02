<template>
    <div>
        <div class="md-subhead">
        <span>Loop Mode / Infinite Loop</span>
        <span>（</span>
        <span>无限循环模式</span>
        <span>）</span>
        </div>
        <!-- swiper -->
        <swiper :options="swiperOption">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
        </swiper>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        swiperOption: {
          spaceBetween: 8,
          loop: true,
          initialSlide: 1,
          onSlideChangeEnd (swiper) {
            // console.log(vm)
            // this.idx = swiper.activeIndex
          }
        }
      }
    }
  }
</script>
