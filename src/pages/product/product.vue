<template>
  <scroll class='outBox' ref='scrollCom' :data='Object.values(product_obj)' :probeType='3' :pulldown='true' :listenScroll='true' @scroll='scroll' @pullDown='pullEnd'>

    <div class='product_wrapper' ref='productWrapper' @touchmove.prevent>

      <div class="placeholder">
        <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
          <swiper-slide v-for='item of product_obj.goods_image' :key='item.name'>
            <img :src="item">
          </swiper-slide>
        </swiper>
      </div>

      <main id='hash'>
        <!-- 名字，价格信息等 -->
        <div class="desc">
          <div class="sells_volume">
            <div class="brand" @click='brand' :class='{active_brand: brandFlag}'>{{brandText}}</div>
            <div class="sells"><span>库存: {{product_obj.goods_storage}}件</span><span>销量: {{product_obj.goods_salenum}}件</span></div>
          </div>
          <div class="content">
            <h6 class="name">{{product_obj.goods_name}}</h6>
            <div class="sell_point" v-html='product_obj.goods_jingle'></div>
            <strong v-if='product_obj.goods_price'>¥{{product_obj.goods_price | format}}</strong>
            <strong v-else>¥ 0</strong>
          </div>
        </div>
        <div class="find vux-1px-t" @click='joinBrand(product_obj.brand.brand_id)' v-if='!member_c && product_obj.brand'>
          <div class="left"><img src="../../assets/product/find.png"></div>
          <div class="center">查看如何成为{{product_obj.brand.brand_name}}经销商</div>
          <span class='right'>
            <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
          </span>
        </div>
        <placeholder></placeholder>

        <!-- 支付方式（名字，价格信息等）-->
        <ul class="pay_way" v-if='member_c && product_obj.brand'>
          <li class='title'>两种购买方式供您选择</li>
          <li @click='goZiti(product_obj.brand.brand_id)'>
            <span class='left'>到店购买:</span>
            <div class='center'>
              <p>请查看附近的<a class='mark'>在售门店</a></p>
              <p>线下零售店价格可能有所波动</p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
          <li class='vux-1px-t line'>
            <span class='left'>线上购买:</span>
            <div class='center'>
              <p>请选择收货方式</p>
            </div>
          </li>
          <li class="vux-1px-t strong" @click='goHome(product_obj.brand.brand_id)'>
            <span class='left'></span>
            <div class='center' v-if='!address_1'>
              <p>1.直接配送到家</p>
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-cc-marker"></use>
                </svg>填写地址
              </p>
            </div>
            <div class="center" v-else>
              <p>{{address_1.area_info | blank}}{{address_1.address}}</p>
              <p class='people'><span>{{address_1.true_name}}</span> &nbsp; <span>{{address_1.tel_phone}}</span></p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
          <li class='vux-1px-t strong' @click='goStore(product_obj.brand.brand_id)'>
            <span class='left'></span>
            <div class='center' v-if='!address_2 && !address_3'>
              <p>2.由合作门店提供代收和短时贮藏服务</p>
              <p>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-cc-marker"></use>
                </svg>选择门店</p>
            </div>
            <div class="center" v-if='address_2'>
              <p>{{address_2.area_info | blank}}{{address_2.address}}</p>
              <p class='people'><span>{{address_2.true_name}}</span> &nbsp; <span>{{address_2.tel_phone}}</span></p>
            </div>
            <div class="center" v-if='address_3'>
              <p>{{address_3.store_add }}</p>
              <p class='people'>到店自提</p>
            </div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </li>
        </ul>

        <div class="recommend" v-if='!member_c && product_obj.brand'>
          <p class='title'>
            以下产品{{ product_obj.brand.brand_name }}可一起配送，节省物流费
            <svg class="icon" aria-hidden="true" ref='arrow' @click='toggleRecommend'>
              <use xlink:href="#icon-arrow-up"></use>
            </svg>
          </p>
          <swiper class="wrapper" :options='swiperOption2' v-show='slideDown'>
            <swiper-slide v-for='(item, idx) of product_obj.goods_combo' :key='idx' @click.native='toProduct(item.combo_goods.goods_id)'>
              <div class="goods">
                <img :src="item.combo_goods.goods_image">
                <div class="text">
                  <div class="name">{{ item.combo_goods.goods_name }}</div>
                  <div class="jingle">{{ item.combo_goods.goods_unit }}</div>
                  <div class="price"><strong>￥{{ item.combo_goods.goods_price }}</strong></div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <placeholder></placeholder>

        <div class="goods_info" v-if='!Array.isArray(product_obj.goods_video) && product_obj.goods_video'>
          <div class="item" v-if='product_obj.goods_video.video && item.Video' v-for='item of product_obj.goods_video.video'>
            <div class="title">{{ item.Video.title }}</div>
            <div class="video">
              <!-- <video ref='video1' :src="item.Video.src" controls :poster='item.Video.image'></video> -->
              <iframe frameborder="0" :src="item.Video.src" allowfullscreen></iframe>
            </div>
            <p v-if='item.Detail' class='see_text'>如果您不方便观看视频，请<a class='mark' @click='toImgText(item.Detail.id)'>点击此处</a>查看图文详情</p>
          </div>
          <div class="text" v-if='product_obj.goods_video.video'>
            <p class='live_tv'>
              查看24小时监控直播
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yuanjiantou"></use>
              </svg>
            </p>
          </div>
          <div class="image">
            <div class="company"></div>
            <img src="../../assets/product/icon.png">
            <div class="quality" v-if='product_obj.goods_video && product_obj.goods_video.quality'>
              <h3>品控保证</h3>
              <div class="desc" v-if='product_obj.goods_video.quality'>
                <a v-for='item of product_obj.goods_video.quality' @click='toQuality(item.id)'>{{ item.title }}</a>
              </div>
            </div>
          </div>
        </div>

        <div class="eat" v-if='product_obj.goods_video && product_obj.goods_video.recommend'>
          <div class="eat_way"></div>
          <swiper :options="swiperOption1" :not-next-tick="notNextTick" ref="mySwiper1">
            <swiper-slide v-for='(item, idx) of product_obj.goods_video.recommend' :key='idx'>
              <!-- <video :src="item" controls poster='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1614268835,1230847192&fm=27&gp=0.jpg'></video> -->
              <img :src='item.image' @click='toEatType(item.id)'></img>
              <div class='text'>{{ item.title }}</div>
            </swiper-slide>
          </swiper>
        </div>

        <div class="company_card" v-if='product_obj.store' @click='company_card(product_obj.store_id)'>
          <div class="brand">
            <img :src="product_obj.store.store_label">
          </div>
          <div class="pv">
            <h3>企业名片</h3>
            <p>浏览量:
              <span>{{product_obj.store.store_collect}}</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yuanjiantou"></use>
              </svg>
            </p>
          </div>
        </div>

        <placeholder></placeholder>

        <div class="rate">
          <x-header class='x-header vux-1px-b'>
            <span slot='left'>产品评价</span>
            <span slot="right" @click='moreRate(product_obj.goods_id)'>更多评价</span>
          </x-header>
          <rate-item v-for='(item, index) of rateList' :rateData='item' :key='index'></rate-item>
        </div>
      </main>

      <!-- 收藏图标 -->
      <div class="favorite" @click='favoriteToggle'>
        <div class='item item1' v-if='goodsFlag'>
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
    <transition name='slide' v-if='product_obj.goods_image'>
      <div class="shopcart" v-show='addFlag'>
        <div class="close_icon" @click='addFlag = !addFlag'>
          <x-icon type="ios-close-empty" size="30"></x-icon>
        </div>
        <div class="main">
          <div class="left">
            <img :src="product_obj.goods_image[0]">
          </div>
          <div class="right">
            <h3>{{ product_obj.goods_name }}</h3>
            <p class='middle'>{{ product_obj.goods_unit}}</p>
            <p class='last'><strong>¥{{ product_obj.goods_price }}</strong><span>库存: {{ product_obj.goods_storage }}件</span></p>
          </div>
        </div>
        <div class="num">
          <p>数量</p>
          <div class='wrapper'>
            <div class='box minus' @click='minus' ref='minus'>-</div>
            <div class='count'>{{count}}</div>
            <div class='box add' @click='add'>+</div>
            <div class="cue" v-show='count > product_obj.goods_storage'>库存不足</div>
          </div>
        </div>
        <button @click='submit'>加入购物车</button>
      </div>
    </transition>
    <tab @add='addCart' @tel='tel' :num='num'></tab>
    <confirm v-if='product_obj.brand' v-model='show' title='确定要重新选择购买方式吗？' @on-confirm='reSelect(product_obj.brand.brand_id)'></confirm>
    <Confirms :text="telephone" ref='confirm' confirmBtnText='拨打' title='联系卖家'></Confirms>
  </scroll>
</template>
<script>
  import Tab from '@/components/pro_tab/pro_tab'
  import Placeholder from '@/components/placeholder/placeholder'
  import xHeader from '@/components/x-header/x-header'
  import RateItem from '@/components/rate_item/rate_item'
  import { Spinner, Confirm } from 'vux'
  import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'
  import Confirms from '@/components/confirm/confirm'
  import { mapGetters } from 'vuex'
  const INIT = 0
  export default {
    name: 'product',
    data () {
      return {
        member_c: true,
        product_obj: {},
        videoArr: ['http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA1', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/MIXRT'],
        notNextTick: true,
        // 顶部的swiper组件
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 18,
          initialSlide: INIT
        },
        // 底部的swiper组件
        swiperOption1: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 10,
          initialSlide: INIT
        },
        // 推荐产品的swiper组件
        swiperOption2: {
          pagination: '.swiper-pagination',
          slidesPerView: 3,
          paginationClickable: true,
          spaceBetween: 8
        },
        goodsFlag: false,   // 收藏商品
        brandFlag: true,  // 收藏品牌
        returnFlag: false,  // 放回顶部
        addFlag: false,   // 是否点加入购物车
        count: 1, // 加入购物车的数量
        pullDownFlag: false,  // 是否进行下拉动作
        pullicon: true,   // 是否下拉松开手，出来加载icon
        scrollY: 0,   // 下滑的距离，放在data，只是方便在watch来操作pos.y
        slideDown: false, // 用来维护推荐商品的下拉状态
        address_1: '',
        address_2: '',
        address_3: '',
        show: false, // comfirm的状态
        select_type: -1, // 到店购买为0，配送到家1，门店2
        rateList: [],
        num: 0, // 购物车的数量
        telephone: ''
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 这里不让用true/false  那就用隐式转换的方法实现，其实不合理
      this.member_c = storage.get('member_class') === '2' ? '' : '1'
      this.id = this.$route.params.id
      // 获得产品数据
      this._getProductDesc(this.id)
      // 清除type这个storage
      storage.remove('type')
      // 获取购物车商品数量
      this._getShopCart()
    },
    methods: {
      // 商品收藏
      favoriteToggle () {
        this.goodsFlag = !this.goodsFlag
        if (this.goodsFlag) {
          this.$http.post('/mobile/?act=member_favorites&op=favorites_add', {
            api_token: this.api_token,
            goods_id: this.id
          }).then(res => {
            console.log(res)
          })
        } else {
          this.$http.post('/mobile/?act=member_favorites&op=favorites_del', {
            api_token: this.api_token,
            fav_id: this.id
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
        this.$refs.minus.style.color = '#999'
      },
      submit () {
        this.addFlag = false
        this.$http.post(`/mobile/?act=member_cart&op=cart_add&api_token=${this.api_token}`, {
          goods_id: this.id,
          quantity: this.count
        }).then(res => {
          if (res.data.status === 200) {
            // 获取购物车最新的数量
            this._getShopCart()
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
          this._getProductDesc(this.id, () => {
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
      // 企业名片
      company_card (id) {
        this.$router.push({
          path: '/desc',
          query: {
            id,
            title: '企业名片'
          }
        })
      },
      // 品牌收藏
      brand () {
        if (this.brandFlag) {
          this.$http.post('/api/brand/cancel_follow', {
            api_token: this.api_token,
            id: this.product_obj.brand.brand_id
          }).then(res => {
            if (res.data.status === 200) {
              this.brandFlag = false
            }
          })
        } else {
          this.$http.post('/api/brand/follow', {
            api_token: this.api_token,
            id: this.product_obj.brand.brand_id
          }).then(res => {
            if (res.data.status === 200) {
              this.brandFlag = true
            }
          })
        }
      },
      // 去评价页面
      moreRate (id) {
        this.$router.push({
          path: '/rate',
          query: {
            id
          }
        })
      },
      toggleRecommend () {
        this.slideDown = !this.slideDown
        this.$refs.arrow.style.transform = this.slideDown ? 'rotate(.5turn)' : 'rotate(0)'
      },
      joinBrand (id) {
        this.$router.push({
          path: '/desc',
          query: {
            id,
            title: '快速加入品牌'
          }
        })
      },
      tel () {
        this.$refs.confirm.show()
      },
      goZiti () {
        this.$router.push({
          path: '/mapziti',
          query: {
            id: this.id
          }
        })
      },
      // 直接配送到家
      goHome (id) {
        // 因为两个选择只能有一个，所以要进行次拦截
        if (this.select_type === 2) {
          this.show = true
          this.select_type = 1
          return
        }
        storage.set('type', 1)
        this.$router.push({
          path: '/my/address',
          query: {
            id // 传的是品牌id
          }
        })
      },
      // 这里改来改去 也不给我说 一会品牌id,一会商品id，让我被动改一大堆。
      goStore (id) {
        if (this.select_type === 1) {
          this.show = true
          this.select_type = 2
          return
        }
        this.$router.push({
          path: '/map',
          query: {
            id,
            goodsId: this.id
          }
        })
      },
      reSelect (id) {
        if (this.address[id]) {
          delete this.address[id]
        }
        if (this.addressType[id]) {
          delete this.addressType[id]
        }
        if (this.select_type === 1) {
          this.$router.push({
            path: '/my/address',
            query: {
              id
            }
          })
        } else if (this.select_type === 2) {
          this.$router.push({
            path: '/map',
            query: {
              id,
              goodsId: this.id
            }
          })
        }
      },
      toQuality (id) {
        this.$router.push({
          path: '/desc',
          query: {
            title: '品控保证',
            id
          }
        })
      },
      toImgText (id) {
        this.$router.push({
          path: '/desc',
          query: {
            title: '图文查看',
            id
          }
        })
      },
      toEatType (id) {
        this.$router.push({
          path: '/desc',
          query: {
            title: '建议吃法',
            id
          }
        })
      },
      toProduct (id) {
        this.$router.push(`/product/${id}`)
        // 刷新页面
        this.$router.go(0)
      },
      _getProductDesc (id, cb) {
        // 因为api_token 不一定存在，为了防止后端程序错误，要做个区分哟，要不然传的是undefined
        // 这里正确打开方式是使用 拦截器
        // let data = {}
        // if (this.api_token) {
        //   data = {
        //     id,
        //     api_token: this.api_token
        //   }
        // } else {
        //   data = {
        //     id
        //   }
        // }
        this.$http.get('/api/goods/detail', {
          params: {
            id,
            api_token: this.api_token
          }
        }).then(res => {
          if (~~res.data.status === 200) {
            this.product_obj = res.data.data
            this.telephone = res.data.data.store.store_phone
            this._getCollect()
            cb && cb()
          }
        }).catch(e => {
          console.log(e)
          this.$router.replace('/404')
        })
      },
      _getCollect () {
        this.$http.post(`/mobile/?act=goods&op=is_collect&api_token=${this.api_token}`, {
          goods_id: this.product_obj.goods_id,
          brand_id: this.product_obj.brand.brand_id
        }).then(res => {
          if (res.data.status === 200) {
            this.goodsFlag = res.data.data.is_collect_goods
            this.brandFlag = res.data.data.is_collect_brand
            this.rateList = res.data.data.goods_eval_list
          }
        })
      },
      _getShopCart () {
        this.$http.get(`/api/cart/list?api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let num = 0
            if (res.data.data) {
              res.data.data.list.forEach(item => {
                item.goods.forEach(x => {
                  num += ~~x.goods_num
                })
              })
              this.num = num
            } else {
              this.num = 0
            }
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
      },
      ...mapGetters({
        'address': 'address',
        'addressType': 'addressType',
        'position': 'scrollY'
      })
    },
    activated () {
      let type = storage.get('type')
        // 这里写的有点粗糙，对应的是三种购买方式
      if (type === 1) {
        this.address_1 = Object.assign({}, this.address)[this.product_obj.brand.brand_id]
        this.address_2 = ''
        this.address_3 = ''
        if (this.address_1) {
          this.select_type = 1
        }
      } else if (type === 2) {
        this.address_1 = ''
        this.address_3 = ''
        this.address_2 = Object.assign({}, this.address)[this.product_obj.brand.brand_id]
        this.select_type = this.addressType
      } else if (type === 3) {
        this.address_1 = ''
        this.address_2 = ''
        this.address_3 = this.addressType[this.product_obj.brand.brand_id]
      }
      this.product_obj = {}
      this.id = this.$route.params.id
      this._getProductDesc(this.id)
      this._getShopCart()
      // 登录后拿到登录状态值
      this.api_token = storage.get('api_token')
      this.member_c = storage.get('member_class') === '2' ? '' : '1'
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
        } else {
          if (this.scrollY < -300) {
            this.returnFlag = true
          } else {
            this.returnFlag = false
          }
        }
      },
      slideDown () {
        this.$refs.scrollCom.refresh()
      }
    },
    filters: {
      // 对商品价格进行过滤
      format (num) {
        return Number.parseFloat(num)
      },
      blank (value) {
        return value.replace(/\s/g, '')
      }
    },
    components: {
      Tab,
      Placeholder,
      xHeader,
      RateItem,
      Scroll,
      Spinner,
      Confirms,
      Confirm
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
              margin-bottom: 10px;
              .no-wrap
            }
            .sell_point{
              font-size: @font-size-small;
              color: #666;
              line-height: 24px;
              margin-bottom: 6px;
            }
          }
        }
        .find{
          height: 50px;
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          padding: 0 15px;
          align-items: center;
          .left{
            width: 16px;
            height: 16px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .center{
            flex: 1;
            padding: 0 10px;
            font-size: @font-size-medium;
            text-align: left;
          }
          .vux-x-icon{
            fill: #9d9d9d;
          }
        }
        .recommend{
          padding-top: 15px;
          .title{
            padding-left: 15px;
            margin-bottom: 15px;
            font-size: @font-size-medium;
            .icon {
              width: 1.6em; height: 1.6em;
              vertical-align: -0.4em;
              fill: @color;
              overflow: hidden;
            }
          }
          .swiper-slide{
            height: 200px;
            width: 100%;
            margin-bottom: 15px;
          }
          .goods{
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            overflow: hidden;
            img{
              width: 100%;
              height: 120px;
            }
            .text{
              width: 100%;
              height: 80px;
              padding-top: 15px;
              text-align: center;
              display: flex;
              flex-flow: column nowrap;
              justify-content: space-between;
              .name{
                color: #5c5c5c;
                font-size: @font-size-medium;
                .no-wrap
              }
              .jingle{
                color: #adadad;
                font-size: @font-size-small;
              }
            }
          }
        }
        .pay_way{
          width: 100vw;
          // height: 273px;
          padding-left: 15px;
          font-size: @font-size-medium;
          overflow: hidden;
          li{
            padding: 19px 0;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            &.line{
              padding: 15px 0;
              align-items: center;
              .center{
                display: flex;
                align-items: center;
                p{
                  margin: 0!important;
                  color: #999;
                }
              }
            }
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
            &.strong{
              .left{
                width: 32px;
              }
              .center{
                p:nth-child(2){
                  color: #666;
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
              p:nth-child(2){
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
            .icon {
              width: 1.5em; height: 1.5em;
              vertical-align: -0.3em;
              fill: @color;
              overflow: hidden;
              margin-right: 4px;
            }
          }
        }
        .goods_info{
          padding: 0 15px;
          width: 100vw;
          .item{
            // height: 272px;
            width: 100%;
            border-top: 1px solid transparent;
            &~.item{
              margin-top: 10px;
            }
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
              video, iframe{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                object-fit: fill;
              }
            }
            .see_text{
              margin-top: 18px;
              margin-bottom: 12px;
              font-size: @font-size-small;
              text-align: center;
              font-weight: bold;
            }
          }
          .text{
            font-size: @font-size-small;
            margin-top: 6px;
            margin-bottom: 20px;
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
            .quality{
              width: 100%;
              text-align: center;
              padding-top: 40px;
              .desc{
                width: 100%;
                height: 95px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-around;
                a{
                  height: 54px;
                  width: 54px;
                  border: 1px solid @color;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: @color;
                  font-size: @font-size-medium;
                  line-height: 16px;
                }
              }
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
              video, img{
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
            height: 36px;
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
          .cue{
            color: @color;
            line-height: 30px;
            margin-left: 20px;
            letter-spacing: 1px;
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
