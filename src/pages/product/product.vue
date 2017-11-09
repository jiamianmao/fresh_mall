<template>
  <scroll class='outBox' ref='scrollCom' :data='arr' :probeType='3' :pulldown='true' :listenScroll='true' @scroll='scroll' @pullDown='pullEnd'>

    <div class='product_wrapper' ref='productWrapper' @touchmove.prevent>

      <div class="placeholder">
        <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
          <swiper-slide v-for='item of arr' :key='item.name'>
            <img :src="item.url">
          </swiper-slide>
        </swiper>
      </div>

      <main>
        <!-- 名字，价格信息等 -->
        <div class="desc">
          <div class="sells_volume">
            <div class="brand" @click='brand' :class='{active_brand: brandFlag}'>{{brandText}}</div>
            <div class="sells"><span>库存: 400件</span><span>销量: 260件</span></div>
          </div>
          <div class="content">
            <h3 class="name">中天羊业甘肃民勤羔羊肉片</h3>
            <div class="sell_point">中天羊业甘肃民勤羔羊肉片中天羊业甘肃勤羔羊肉片中天羊业甘肃民勤羔羊肉片</div>
            <strong>¥69</strong>
          </div>
        </div>

        <placeholder></placeholder>

        <!-- 支付方式（名字，价格信息等） -->
        <ul class="pay_way">
          <li class='title'>两种购买方式供您选择</li>
          <li class='' @click='map'>
            <span class='left'>到店购买:</span>
            <div class='center'>
              <p><a class='mark'>点击查看</a>附近的在售门店</p>
              <p>线下零售店价格可能有所波动</p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
          <li class='vux-1px-t'>
            <span class='left'>线上购买:</span>
            <div class='center'>
              <p>配送到您附近的<a class='mark'>自提点</a>提供短时贮藏服务</p>
              <p>选择门店</p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
          <li class='vux-1px-t'>
            <span class='left'></span>
            <div class='center'>
              <p>直接配送到位</p>
              <p>北京市海淀区学苑路</p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
        </ul>

        <placeholder></placeholder>

        <div class="goods_info">
          <div class="item">
            <div class="title">二十四年坚守，只为每一片真正好羊肉</div>
            <div class="video">
              <video ref='video1' src="http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA3" controls poster='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg'></video>
            </div>
          </div>
          <div class="text">
            <p class='live_tv'>
              查看24小时监控直播
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yuanjiantou"></use>
              </svg>
            </p>
            <p class='see_text'>如果您不方便观看视频，请<a class='mark'>点击此处</a>查看图文详情</p>
          </div>
          <div class="image">
            <div class="company"></div>
            <img src="../../assets/product/icon.png">
            <img src="../../assets/product/quality.png">
          </div>
        </div>

        <div class="eat">
          <div class="eat_way"></div>
          <swiper :options="swiperOption1" :not-next-tick="notNextTick" ref="mySwiper1">
            <swiper-slide v-for='(item, key) of videoArr' :key='key'>
              <video :src="item" controls poster='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg'></video>
              <div class='text'>这是 丨 我的金球奖</div>
            </swiper-slide>
          </swiper>
        </div>

        <div class="company_card">
          <div class="brand">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
          </div>
          <div class="pv">
            <h3>企业名片</h3>
            <p>浏览量:
              <span>7834</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yuanjiantou"></use>
              </svg>
            </p>
          </div>
        </div>

        <placeholder></placeholder>

        <div class="rate">
          <x-header class='x-header'>
            <span slot='left'>产品评价</span>
            <span slot="right">更多评价</span>
          </x-header>
          <rate-item></rate-item>
          <rate-item></rate-item>
        </div>
      </main>

      <!-- 收藏图标 -->
      <div class="favorite" @click='favoriteToggle'>
        <div class='item item1' v-if='favorite'>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wujiaoxing1"></use>
          </svg>
          <span>已收藏</span>
        </div>
        <div class='item' v-else>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wujiaoxing"></use>
          </svg>
          <span>收藏</span>
        </div>
      </div>

      <!-- 遮罩层 -->
      <div class="mask" v-show='addFlag' @click='addFlag = !addFlag'></div>
      
    </div>

    <!-- 返回顶部图标 -->
    <div class="return" v-show='returnFlag' @click='goTop'>
      <img src="../../assets/product/return.png">
    </div>

    <transition name='slide1'>
      <div class='pulldown' v-show='pullDownFlag' ref='pullDown'>
        <img src="../../assets/product/pulldown.png" v-if='pullicon'>
        <spinner v-else></spinner>
      </div>
    </transition>

    <!-- 购物车 -->
    <transition name='slide'>
      <div class="shopcart" v-show='addFlag'>
        <div class="close_icon" @click='addFlag = !addFlag'>
          <x-icon type="ios-close-empty" size="30"></x-icon>
        </div>
        <div class="main">
          <div class="left">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg">
          </div>
          <div class="right">
            <h3>中天羊中天羊中天羊中天羊天羊中天羊天羊中天羊天羊中天羊天羊中天羊</h3>
            <p class='middle'>300g/盒</p>
            <p class='last'><strong>¥29.9</strong><span>库存: 29件</span></p>
          </div>
        </div>
        <div class="num">
          <p>数量</p>
          <div class='wrapper'>
            <div class='box minus' @click='minus' ref='minus'>-</div>
            <div class='count'>{{count}}</div>
            <div class='box add' @click='add'>+</div>
          </div>
        </div>
        <button @click='submit'>加入购物车</button>
      </div>
    </transition>

    <tab @add='addCart'></tab>
  </scroll>
</template>
<script>
  import Tab from '@/components/pro_tab/pro_tab'
  import Placeholder from '@/components/placeholder/placeholder'
  import xHeader from '@/components/x-header/x-header'
  import RateItem from '@/components/rate_item/rate_item'
  import { Spinner } from 'vux'
  import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        arr: [],
        videoArr: ['http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA1', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/MIXRT'],
        currentData: {},
        notNextTick: true,
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 18,
          initialSlide: 1
        }, // 顶部的swiper组件
        swiperOption1: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 10,
          initialSlide: 1
        },  // 顶部的swiper组件
        favorite: false,   // 收藏商品
        brandFlag: true,  // 收藏品牌
        returnFlag: false,  // 放回顶部
        addFlag: false,   // 是否点加入购物车
        count: 1, // 加入购物车的数量
        pullDownFlag: false,  // 是否进行下拉动作
        pullicon: true,   // 是否下拉松开手，出来加载icon
        scrollY: 0   // 下滑的距离，放在data，只是方便在watch来操作pos.y
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 获得产品数据
      this._getProductDesc()
    },
    mounted () {
      // 给减号一个初始颜色，因为是捕捉的count变化，初始时候为1，却没触发watch
      this.$refs.minus.style.color = '#999'
    },
    methods: {
      favoriteToggle () {
        this.favorite = !this.favorite
        if (this.favorite) {
          this.$http({
            url: `/mobile/?act=member_favorites&op=favorites_add`,
            method: 'POST',
            data: {
              api_token: this.api_token,
              goods_id: 38,
              key: 123456
            },
            transformRequest: [(data) => {
              let arr = ''
              for (let i in data) {
                arr += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
              }
              return arr
            }]
          }).then(res => {
            console.log(res)
          })
        } else {
          this.$http({
            url: `/mobile/?act=member_favorites&op=favorites_del`,
            method: 'POST',
            data: {
              api_token: this.api_token,
              fav_id: 38
            },
            transformRequest: [(data) => {
              let arr = ''
              for (let i in data) {
                arr += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
              }
              return arr
            }]
          }).then(res => {
            console.log(res)
          })
        }
      },
      goTop () {
        this.$refs.scrollCom.scrollTo(0, 0, 500)
      },
      addCart () {
        this.addFlag = true
      },
      submit () {
        this.addFlag = false
        this.$http({
          url: `/mobile/?act=member_cart&op=cart_add&api_token=${this.api_token}`,
          method: 'POST',
          data: {
            goods_id: 46,
            quantity: this.count
          },
          transformRequest: [(data) => {
            let arr = ''
            for (let i in data) {
              arr += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return arr
          }]
        }).then(res => {
          if (res.data.status === 200) {
            // 获取购物车最新的数量
          }
        })
      },
      minus () {
        if (this.count === 1) {
          return
        }
        this.count--
      },
      add () {
        this.count++
      },
      // 下拉刷新的放手时回调函数
      pullEnd (pos) {
        this.pullicon = false
        this.$refs.productWrapper.style.top = '30px'
        setTimeout(() => {
          this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/category').then(res => {
            this.pullDownFlag = false
            this.$refs.productWrapper.style.top = 0
            // 加载后的页面返回原始的时候加个过渡，需要给上部的滑块也加个过渡 对应的.slide1
            this.$refs.productWrapper.style.transition = 'all .5s'
            // 为了防止过渡上滑的时候 pullicon已经变回机器猫了
            setTimeout(() => {
              this.pullicon = true
            }, 500)
          })
        }, 2000)
      },
      // 滑动的时候直接给我pos值，来判断下拉的icon变化
      scroll (pos) {
        this.scrollY = pos.y
      },
      brand () {
        if (this.brandFlag) {
          this.$http({
            url: `/api/brand/cancel_follow?api_token=${this.api_token}&id=79`,
            method: 'POST',
            data: {
              api_token: this.api_token,
              id: 79
            },
            transformRequest: [function (data) {
              // Do whatever you want to transform the data
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }]
          }).then(res => {
            if (res.data.status === 200) {
              this.brandFlag = false
            }
          })
        } else {
          this.$http({
            url: '/api/brand/follow',
            method: 'POST',
            data: {
              api_token: this.api_token,
              id: 79
            },
            transformRequest: [function (data) {
            // Do whatever you want to transform the data
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }]
          }).then(res => {
            if (res.data.status === 200) {
              this.brandFlag = true
            }
          })
        }
      },
      map () {
        this.$router.push('/map')
      },
      _getProductDesc () {
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/getCategoryData').then(res => {
          if (res.status === 200) {
            this.arr = res.data.data[0].list
          }
        })
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      },
      brandText () {
        return this.brandFlag ? '已关注' : '关注品牌'
      }
    },
    watch: {
      // 进行减法的颜色变化，最低为1
      count () {
        if (this.count === 1) {
          this.$refs.minus.style.color = '#999'
        } else {
          this.$refs.minus.style.color = '#000'
        }
      },
      scrollY () {
        if (this.scrollY > 30) {
          this.pullDownFlag = true
          this.$refs.pullDown.style.height = `${this.scrollY}px`
        }
        if (this.scrollY < -300) {
          this.returnFlag = true
        } else {
          this.returnFlag = false
        }
      }
    },
    components: {
      Tab,
      Placeholder,
      xHeader,
      RateItem,
      Scroll,
      Spinner
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .outBox{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    .pulldown{
      padding: 5px 0;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        height: 50%;
      }
    }
    .product_wrapper{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background: #fff;
      .placeholder{
        height: 386px;
        .swiper-wrapper{
          .swiper-slide {
            width: 70vw;
            height: 386px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      main{
        .mark{
          color: #5eb29e;
        }
        .desc{
          width: 100vw;
          height: 170px;
          padding: 20px 15px;
          .sells_volume{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            font-size: @font-size-small;
            .brand{
              color: @color;
              height: 18px;
              width: 56px;
              border: 1px solid @color;
              text-align: center;
              line-height: 18px;
              border-radius: 4px;
              background: #fff;
              &.active_brand{
                color: #fff;
                background: @color;
                border: 1px solid #fff;
              }
            }
            .sells{
              color: #a0a0a0;
              letter-spacing: 1px;
              span:first-child{
                margin-right: 8px;
              }
            }
          }
          .content{
            width: 100%;
            margin-top: 16px;
            text-align: center;
            letter-spacing: 1px;
            padding: 0 40px;
            .name{
              font-size: 20px;
              margin-top: 0;
              margin-bottom: 6px;
            }
            .sell_point{
              font-size: @font-size-small;
              color: #666;
              line-height: 24px;
              margin-bottom: 6px;
            }
          }
        }
        .pay_way{
          width: 100vw;
          height: 273px;
          padding-left: 15px;
          font-size: @font-size-medium;
          overflow: hidden;
          li{
            padding: 19px 0;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            &.title{
              position: relative;
              &:before{
                position: absolute;
                display: block;
                content: '';
                left: -19px;
                bottom: 0;
                width: 102vw;
                height: 1px;
                background: #F4F4F4;
                @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
                  transform: scaleY(.33);
                }
                @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
                  transform: scaleY(.5);
                }
              }
            }
            .left{
              width: 64px;
            }
            .center{
              flex: 1;
              p:first-child{
                margin-bottom: 10px;
              }
              p:last-child{
                font-size: @font-size-small-s;
                color: #a7a7a7;
              }
            }
            .right{
              width: 42px;
              display: flex;
              justify-content: center;
              align-items: center;
              .vux-x-icon{
                fill: #9d9d9d;
              }
            }
          }
        }
        .goods_info{
          padding: 0 15px;
          width: 100vw;
          .item{
            height: 272px;
            width: 100%;
            border-top: 1px solid transparent;
            .title{
              margin-top: 18px;
              padding-left: 16px;
              position: relative;
              height: 20px;
              line-height: 20px;
              margin-bottom: 20px;
              &:before{
                position: absolute;
                content: '';
                display: block;
                width: 7px;
                height: 20px;
                left: 0;
                top: 0;
                background: #5fb29e;
              }
            }
            .video{
              width: 100%;
              height: 0;
              padding-top: 56.25%;
              position: relative;
              video{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                object-fit: fill;
              }
            }
          }
          .text{
            font-size: @font-size-small;
            .live_tv{
              color: #b8b8b8;
              .icon {
                width: 1em; 
                height: 1em;
                vertical-align: -0.2em;
                fill: currentColor;
                overflow: hidden;
              }
            }
            .see_text{
              line-height: 90px;
              text-align: center;
              font-weight: bold;
            }
          }
          .image{
            & > img {
              width: 100%;
            }
            .company{
              height: 104px;
              width: 100%;
              background-image: url('../../assets/product/company.png');
              background-position: 0 0;
              background-size: 100% 100%;
              margin-bottom: 20px;
            }
          }
        }
        .eat{
          text-align: center;
          .eat_way{
            height: 20px;
            width: 100%;
            background: url('../../assets/product/eat_way.png') no-repeat 0 0;
            background-size: 100% 100%;
            margin-bottom: 22px;
          }
          .swiper-wrapper{
            .swiper-slide {
              width: 64.266667vw;
              height: 0;
              padding-top: 56.25%;
              padding-bottom: 13.75%;
              position: relative;
              video{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 84.507042%;
                object-fit: fill;
              }
              .text{
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate3d(-50%, 0, 0);
                color: #000;
                font-size: @font-size-medium;
              }
            }
          }
        }
        .company_card{
          height: 78px;
          width: calc(~"100vw - 32px");
          margin: 40px auto 20px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .brand{
            width: 50px;
            height: 50px;
            margin-right: 15px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .pv{
            display: flex;
            flex-direction: column;
            h3{
              font-size: @font-size-large;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }
            p{
              font-size: @font-size-small;
              color: #666;
              span{
                margin: 0 9px;
              }
              .icon {
                width: 1em;
                height: 1em;
                vertical-align: -0.2em;
                fill: currentColor;
                overflow: hidden;
              }
            }
          }
        }
        .rate{
          padding: 0 15px;
          width: 100vw;
          .x-header{
            height: 45px;
          }
        }
      }
      .mask{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .6);
        z-index: 2;
      }
      .favorite{
        position: absolute;
        top: 14px;
        right: 19vw;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, .5);
        z-index: 1;
        color: #fff;
        .item{
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          padding-top: 4px;
          margin-bottom: 2px;
          font-size: @font-size-small;
          &.item1{
            color: #fab646;
          }
          .icon {
            width: 18px; 
            height: 18px;
            fill: currentColor;
            overflow: hidden;
          }
          span{
            transform: scale(.83333);
          }
        }
      }
    }
    .return{
      position: fixed;
      right: 15px;
      bottom: 95px;
      width: 56px;
      height: 56px;
      z-index: 10;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .shopcart{
      left: 0;
      bottom: 0;
      height: 260px;
      width: 100vw;
      position: fixed;
      z-index: 100;
      background: #fff;
      .close_icon{
        position: absolute;
        right: 10px;
        top: 9px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        .vux-x-icon{
          fill: #bfbfbf;
        }
      }
      .main{
        display: flex;
        flex-flow: row nowrap;
        padding: 21px 15px 22px;
        .left{
          width: 88px;
          height: 88px;
          margin-right: 9px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          width: 242px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          h3{
            font-size: @font-size-large;
            letter-spacing: 1px;
            .no-wrap
          }
          .middle{
            color: #adadad;
            margin: 10px 0;
          }
          .last{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            span{
              color: #adadad;
              font-size: @font-size-medium;
            }
          }
        }
      }
      .num{
        padding: 0 15px;
        .wrapper{
          display: flex;
          flex-flow: row nowrap;
          margin-top: 5px;
          .box{
            width: 30px;
            height: 30px;
            border: 1px solid #999;
            line-height: 30px;
            text-align: center;
            font-size: 16px;
          }
          .count{
            height: 30px;
            line-height: 30px;
            margin: 0 35px;
          }
        }
      }
      button{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 49px;
        border: 0;
        color: #fff;
        letter-spacing: 3px;
        background: #5eb29e;
      }
    }
    .slide-enter-active, .slide-leave-active {
      transition: all .5s;
    }
    .slide-enter, .slide-leave-to {
      transform: translateY(260px);
    }
    .slide1-leave-active {
      transition: all .5s;
    }
    .slide1-leave-to {
      transform: translateY(-30px);
    }
  }
</style>
