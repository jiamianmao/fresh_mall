<template>
    <div class='container' ref='container'>

      <!-- search搜索框 z-index: 9 -->
      <div class="search" ref='search'>
        <span @click='selectCity'>
          <svg class="search_icon" aria-hidden="true">
            <use xlink:href="#icon-cc-marker"></use>
          </svg>
          {{city}}
        </span>
        <span class='title'>创合品质</span>
        <span @click='search'>
          <svg class="search_icon" aria-hidden="true">
            <use xlink:href="#icon-sousu"></use>
          </svg>
        </span>
      </div>

      <!-- swiper启动页的轮播 z-index: 8 -->
      <transition name='slide'>
        <div class="swiper-wrapper" ref='swiperWrapper' v-show='startPage' @touchstart.prevent='touchStart' @touchmove.prevent='touchMove' @touchend='touchEnd'>
          <swiper @on-index-change='swiper_change' loop class='swiper' :list="swiperUrlList" :height="swiperHeight" :show-desc-mask='false' :show-dots='false'></swiper>
          <div class='dots-wrapper'>
            <div class="dots" v-for='n of 4' :class='{active: n === curIndx + 1}'></div>
          </div>
          <div class='down-arrow' @click='startPageChange'>
            <canvas ref='down_canvas' width='50' height='50'></canvas>
          </div>
        </div>
      </transition>

      <!-- nav导航区 z-index: 7 -->
      <transition name='slide_nav'>
        <nav ref='nav'>
          <div class="left" ref='navLeft'>
            <span v-for='(item, index) of arr' :class='{active: activeIdx === index}' @click='selectCate(index)' ref='navItem'>{{item.gc_name}}</span>
          </div>
          <div class='arrow_box' @click='arrowToggle'>
            <svg class="arrow" aria-hidden="true" ref='arrow'>
              <use xlink:href="#icon-arrowdropdown"></use>
            </svg>
          </div>
        </nav>
      </transition>

      <!-- 遮罩层 z-index: 6 -->
      <div class="mask" v-show='slideDown' @click='arrowToggle'>
      </div>

      <!-- 主内容区 -->
      <div class='main'>
        <type-list v-for='(goods, index) of arr' :goods='goods' :key='index'></type-list>
      </div>

    </div>
</template>

<script>
  // index.html引入了qq对象，防止eslint报错
  /* eslint-disable no-undef */
  import { Swiper } from 'vux'
  import { mapGetters, mapMutations } from 'vuex'
  import storage from 'good-storage'
  import TypeList from '@/components/typeList/typeList'

  export default {
    data () {
      return {
        swiperUrlList: [],
        swiperHeight: '0px',
        curIndx: 0,
        city: '北京市',
        slideDown: false,
        activeIdx: 0,
        cate_list: [],
        arr: []
      }
    },
    created () {
      // 共享touch事件的状态，放在created不用观察者对象
      this.touch = {}
      this._getBanner()
      this._getCategory() // 这里其实不用调该接口，但已经写了很多逻辑，懒得重构了。
      this._getGoodsData()
    },
    mounted () {
      this.swiperHeight = `${this.$refs.swiperWrapper.clientHeight}px`
      // 拿到nav的初始高度
      this.navHeight = this.$refs.nav.clientHeight
      // 用canvas来画出启动页的箭头
      this._downArrow()
      // 定位拿到当前的城市 这里的处理是如果已经存过city的storage了，就直接拿storage的，如果没有就IP定位
      storage.has('city') ? this.city = storage.get('city') : this._getPosition()
      this.startPage || this._changeStyle()
    },
    methods: {
      // 记录启动页轮播的页码
      swiper_change (index) {
        this.curIndx = index
      },
      // 三个touch事件 启动页轮播的上滑
      touchStart (e) {
        this.touch.init = true
        this.touch.moved = false
        this.touch.startY = e.touches[0].pageY
      },
      touchMove (e) {
        if (!this.touch.init) return
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        this.touch.moveY = e.touches[0].pageY
      },
      touchEnd () {
        let pos = this.touch.moveY - this.touch.startY
        pos < -100 && this.startPageChange()
      },
      startPageChange () {
        this.set_start_page(false)
      },
      // 定位
      selectCity () {
        this.$router.push({
          path: '/city'
        })
      },
      search () {
        this.$router.push('/search')
      },
      // nav组件的箭头按钮切换
      arrowToggle () {
        this.slideDown = !this.slideDown
        let navLeft = this.$refs.navLeft
        if (this.slideDown) {
          let num = Math.ceil(this.cate_list.length / 4)
          navLeft.style.height = this.navHeight * num + 'px'
          navLeft.style.flexWrap = 'wrap'
          navLeft.style.overflowX = 'visible'
        } else {
          navLeft.style.height = `${this.navHeight}px`
          navLeft.style.flexWrap = 'nowrap'
          navLeft.style.overflowX = 'scroll'
        }
        this.$refs.arrow.style.transform = this.slideDown ? 'rotate(0.5turn)' : 'rotate(0)'
      },
      selectCate (key) {
        this.activeIdx = key
        if (this.slideDown) {
          this.arrowToggle()
        } else {
          this.slideDown = false
        }
        // let navLeft = this.$refs.navLeft
        // let step = navLeft.clientWidth / 4 * key
        // $(navLeft).animate({scrollLeft: step}, 500)
        let gcId = this.cate_list[key].gc_id
        this.$router.push({
          path: '/goodslist',
          query: {
            'gc_id': gcId
          }
        })
      },
      _downArrow () {
        let ctx = this.$refs.down_canvas.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(0, 15)
        ctx.lineTo(20, 40)
        ctx.lineTo(40, 15)
        ctx.lineWidth = 5
        ctx.strokeStyle = '#fff'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(20, 25)
        ctx.lineTo(40, 0)
        ctx.lineWidth = 5
        ctx.strokeStyle = 'rgba(255, 255, 255, .5)'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      },
      _getBanner () {
        this.$http.get('/api/advert/banner').then(res => {
          if (res.data.status === 200) {
            // this.swiperUrlList = res.data.data
            res.data.data.forEach(item => {
              this.swiperUrlList.push({
                url: item.pic_url,
                img: item.pic_img
              })
            })
          }
        })
      },
      _getPosition () {
        let geolocation = new qq.maps.Geolocation()
        geolocation.getIpLocation((position) => {
          this.city = position.city
          storage.set('city', this.city || 1)
        })
      },
      _getGoodsData () {
        this.$http.get('/mobile/?act=goods&op=get_recommend_goods').then(res => {
          if (res.data.status === 200) {
            this.arr = res.data.data
          }
        })
      },
      _getCategory () {
        this.$http.get('/mobile/?act=goods_class&op=goods_list').then(res => {
          if (res.data.status === 200) {
            this.cate_list = res.data.data.class_list
          }
        })
      },
      _changeStyle () {
        let search = this.$refs.search
        let container = this.$refs.container
        search.classList.add('startOut')
        search.classList.add('vux-1px-b')
        container.style.paddingTop = `${this.navHeight + 45}px`
      },
      ...mapMutations({
        'set_start_page': 'SET_START_PAGE'
      })
    },
    components: {
      Swiper,
      TypeList
    },
    computed: {
      ...mapGetters([
        'startPage'
      ])
    },
    watch: {
      startPage () {
        this.$nextTick(() => {
          this._changeStyle()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';
  .container{
    @nav_height: 48px;
    width: 100vw;
    position: relative;
    padding-top: 45px;
    box-sizing: border-box;
    .search{
      width: 100vw;
      height: 45px;
      padding: 0 15px;
      box-sizing: border-box;
      position: fixed;
      z-index: 9;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(255, 255, 255, .3);
      color: #fff;
      font-size: @font-size-small;
      .title{
        font-size: @font-size-medium;
        position: relative;
        left: -5px;
      }
      .search_icon {
        width: 28px;
        height: 28px;
        vertical-align: middle;
        fill: currentColor;
        overflow: hidden;
      }
      &.startOut{
        z-index: 2;
        background-color: #fff;
        color: #000;
      }
    }
    .swiper-wrapper{
      width: 100%;
      height: calc(~"100vh - 49px");
      position: absolute;
      top: 0;
      left: 0;
      z-index: 8;
      background: red;
      .swiper{
        width: 100%;
        height: 100%;
        background: red;
        .custom-bottom{
          width: 200px;
          height: 200px;
          border: 1px solid red;
        }
      }
      .dots-wrapper{
        width: 64px;
        height: 64px;
        position: absolute;
        bottom: 101px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-content: space-between;
        .dots{
          width: 27px;
          height: 27px;
          background: rgba(255, 255, 255, .4);
        }
        .active{
          background: #fff;
        }
      }
      .down-arrow{
        width: 40px;
        height: 40px;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        animation: myMove 1s linear 2s infinite alternate;
      }
    }
    nav{
      position: fixed;
      top: 45px;
      left: 0;
      width: 100%;
      height: @nav_height;
      z-index: 7;
      line-height: @nav_height;
      text-align: center;
      display: flex;
      flex-flow: row nowrap;
      .left{
        width: 90%;
        height: @nav_height;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: visible;
        background: #fff;
        span{
          width: 25%;
          flex-shrink: 0;
          &.active{
            color: @active-color;
          }
        }
      }
      .arrow_box{
        width: 10vw;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        background: #fff;
        .arrow{
          width: 30px;
          height: 30px;
          fill: @active-color;
          vertical-align: middle;
          overflow: hidden;
        }
      }
    }
    .mask{
      position: fixed;
      top: 45px;
      left: 0;
      right: 0;
      bottom: 50px;
      z-index: 6;
      background: rgba(0, 0, 0, .1);
    }
    .main{
      padding-bottom: 100px;
    }
    // swiper过渡
    .slide-enter-active, .slide-leave-active{
      transition: all 1s;
      transform: translateY(calc(~"-100vh + 50px"));
    }
    .slide-enter, .slide-leave{
      transform: translateY(0);
    }
  }

 @keyframes myMove {
  0% {
    padding-bottom: 0px;
  }
  100% {
    padding-bottom: 16px;
  }
}
</style>
