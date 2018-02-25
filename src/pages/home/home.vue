<template>
    <div class='container' ref='container'>

      <div class="search">
        <div class='citybox' @click='selectCity'>
          <svg class="search_icon" aria-hidden="true">
            <use xlink:href="#icon-cc-marker"></use>
          </svg>
          {{city}}
        </div>
        <div class="center" @click='search'>
          <span class='search_icons'>
            <svg class="search_icon" aria-hidden="true">
              <use xlink:href="#icon-sousu"></use>
            </svg>
          </span>
          <span class='title'>搜索</span>
        </div>
      </div>

      <!-- swiper启动页的轮播 z-index: 8 -->
      <transition name='slide'>
        <div class="swiper-wrapper" ref='swiperWrapper'>
          <swiper v-model='curIndx' @on-index-change='swiper_change' loop auto class='swiper' :list="swiperUrlList" :height="swiperHeight" :show-desc-mask='false' :show-dots='false'></swiper>
          <div class='dots-wrapper'>
            <div class="dots" v-for='n of 4' :class='{active: n === curIndx + 1}' @click='selectDots(n)'></div>
          </div>
          <div class='down-arrow' @click='startPageChange'>
            <canvas ref='down_canvas' width='20' height='20'></canvas>
          </div>
        </div>
      </transition>

      <!-- nav导航区 z-index: 7 -->
      <transition name='slide_nav'>
        <nav ref='nav'>
          <div class="left" ref='navLeft'>
            <span v-for='(item, index) of cate_list' :class='{active: activeIdx === index}' @click='selectCate(item, index)' ref='navItem'>{{item.gc_name}}</span>
          </div>
          <!-- <div class='arrow_box'>
            <svg class="arrow" aria-hidden="true" ref='arrow'>
              <use xlink:href="#icon-arrow-b"></use>
            </svg>
          </div> -->
        </nav>
      </transition>

      <!-- 遮罩层 z-index: 6 -->
      <!-- <div class="mask" v-show='slideDown' @touchmove.prevent>
      </div> -->

      <!-- 主内容区 -->
      <div class='main'>
        <type-list class='typeList' v-for='(goods, index) of arr' :goods='goods' :key='index'></type-list>
      </div>

    </div>
</template>

<script>
  import { Swiper } from 'vux'
  import { mapGetters } from 'vuex'
  import TypeList from '@/components/typeList/typeList'
  import storage from 'good-storage'

  export default {
    name: 'home',
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
      this.touchPage = {}
      this.api_token = storage.get('api_token')
      this._getBanner()
      this._getCategory() // 这里其实不用调该接口，但已经写了很多逻辑，懒得重构了。
      this._getGoodsData()
    },
    mounted () {
      this.swiperHeight = `${this.$refs.swiperWrapper.clientHeight}px`
      // 拿到nav的初始高度
      // this.navHeight = this.$refs.nav.clientHeight
      // 用canvas来画出启动页的箭头
      this._downArrow()
      // this.startPage || this._changeStyle()
    },
    activated () {
      this.api_token = storage.get('api_token')
      this.activeIdx = 0
      // storage -> vuex -> 重新取
      if (storage.session.has('city')) {
        this.city = storage.session.get('city')
      } else if (this.position.city) {
        this.city = this.position.city
      } else {
        this.$emit('position')
      }
    },
    methods: {
      // 记录启动页轮播的页码
      swiper_change (index) {
        this.curIndx = index
      },
      startPageChange () {
        console.log(1)
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
      selectDots (n) {
        this.curIndx = n - 1
      },
      selectCate (val, key) {
        this.activeIdx = key
        if (this.slideDown) {
          this.arrowToggle()
        } else {
          this.slideDown = false
        }
        if (val.gc_name === '首页') return
        this.$router.push({
          path: '/goodslist',
          query: {
            'gc_id': val.gc_id
          }
        })
      },
      _downArrow () {
        let ctx = this.$refs.down_canvas.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(9, 10)
        ctx.lineTo(18, 0)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(255, 255, 255, .5)'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, 10)
        ctx.lineTo(9, 19)
        ctx.lineTo(18, 10)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#fff'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      },
      _getBanner () {
        this.$http.get('/mobile/?act=adv&op=banner').then(res => {
          if (res.data.status === 200) {
            if (Array.isArray(res.data.data)) {
              res.data.data.forEach((item, index) => {
                if (index === 0) {
                  this.swiperUrlList.push({
                    img: item.pic_img,
                    url: `${storage.session.get('origin')}/${item.pic_url}`
                  })
                } else {
                  this.swiperUrlList.push({
                    img: item.pic_img,
                    url: `${storage.session.get('origin')}/desc?adv_id=${item.adv_id}`
                  })
                }
              })
            }
          }
        })
      },
      _getGoodsData () {
        this.$http.get(`/mobile/?act=goods&op=get_recommend_goods&api_token=${this.api_token}`).then(res => {
          let r = res.data
          if (r.status === 200) {
            this.arr = r.data.splice(1, r.data.length)
          }
        })
      },
      _getCategory () {
        this.$http.get('/mobile/?act=goods_class&op=goods_list').then(res => {
          if (res.data.status === 200) {
            this.cate_list = res.data.data.class_list
          }
        })
      }
    },
    components: {
      Swiper,
      TypeList
    },
    computed: {
      ...mapGetters([
        'position'
      ])
    },
    watch: {
      position (newVal) {
        this.city = newVal.city
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
    // padding-top: 45px;
    box-sizing: border-box;
    .search{
      width: 100vw;
      height: 45px;
      padding: 0 15px;
      position: fixed;
      z-index: 9;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: rgba(0, 0, 0, .3);
      color: #fff;
      font-size: @font-size-small;
      .search_icon {
        width: 24px;
        height: 24px;
        vertical-align: middle;
        fill: currentColor;
        overflow: hidden;
      }
      .search_icons{
        .search_icon{
          width: 18px;
          height: 18px;
        }
      }
      .citybox{
        width: 20vw;
      }
      .center{
        flex: 1;
        height: 60%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, .8);
        color: #999;
        font-size: 14px;
      }
    }
    .swiper-wrapper{
      width: 100%;
      height: 100vh;
      position: relative;
      z-index: 8;
      .swiper{
        width: 100%;
        height: 100%;
        background: url('../../common/images/default.jpg') 0 0 ~'/' 100% 100%;
      }
      .dots-wrapper{
        width: 64px;
        height: 64px;
        position: absolute;
        bottom: 101px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        // display: flex;
        // flex-flow: row wrap;
        // justify-content: space-between;
        // align-content: space-between;
        .dots{
          width: 27px;
          height: 27px;
          background: rgba(255, 255, 255, .4);
          &:nth-child(1), &:nth-child(4){
            float: left;
          }
          &:nth-child(3), &:nth-child(2){
            float: right;
          }
          &:nth-child(3), &:nth-child(4) {
            margin-top: 10px;
          }
        }
        .active{
          background: #fff;
        }
      }
      .down-arrow{
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        animation: myMove 1s linear 2s infinite alternate
      }
    }
    nav{
      width: 100%;
      line-height: @nav_height;
      text-align: center;
      background: #fff;
      .left{
        display: flex;
        flex-flow: row wrap;
        span{
          width: 25%;
          &.active{
            color: @active-color;
          }
        }
      }
      .arrow_box{
        width: 10vw;
        height: @nav_height;
        flex-basis: 10vw;
        background: #fff;
        .arrow{
          width: 1em;
          height: 1em;
          fill: @active-color;
          vertical-align: -.1em;
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
      .typeList~.typeList{
        margin-top: 15px;
      }
    }
    // swiper过渡
    .slide-enter-active, {
      transition: all 1s;
      transform: translateY(0);
    }
    .slide-enter{
      transform: translateY(-100%);
    }
    .slide-leave-active{
      transition: all 1s;
      transform: translateY(-100%);
    }
    .slide-leave {
      transform: translateY(0);
    }
  }

 @keyframes myMove {
  0% {
    bottom: 10px;
  }
  100% {
    bottom: 20px;
  }
}
</style>
