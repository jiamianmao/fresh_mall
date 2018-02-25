<template>
  <!-- <scroll class='outBox' ref='scrollCom' :data='Object.values(product_obj)' :probeType='3' :pulldown='true' :listenScroll='true' @scroll='scroll' @pullDown='pullEnd'> -->
    <div class="outBox">
      <div class='product_wrapper' ref='productWrapper'>
        <!-- 轮播图 增加一个外容器设置高度，以免重绘 -->
        <div class="placeholder">
          <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
            <swiper-slide v-for='(item, index) of goods_image' :key='index'>
              <img v-lazy="item">
              <div class="mask" v-show='index !== swiperOption.idx'></div>
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
              <strong v-if='product_obj.goods_price'>¥{{product_obj.goods_price | format}}<span v-if='product_obj.goods_unit'>/<span style='font-size: 12px;'>{{product_obj.goods_unit}}</span></span></strong>
              <strong v-else>¥ 0</strong>
            </div>
          </div>
          <!-- B端 如何加入经销商 -->
          <!-- <div class="find vux-1px-t" @click='toDesc(product_obj.brand.brand_id, 0)' v-if='!member_c && product_obj.brand'>
            <div class="left"><img src="../../assets/product/find.png"></div>
            <div class="center">查看如何成为{{product_obj.brand.brand_name}}经销商</div>
            <span class='right'>
              <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
            </span>
          </div> -->
          <placeholder></placeholder>

          <!-- C端 支付方式（名字，价格信息等）-->
          <ul class="pay_way" v-if='member_c && product_obj.brand'>
            <li class='title' v-if='offline_switch === "1"'>两种购买方式供您选择</li>
            <li v-if='offline_switch === "1"' @click='goZiti(product_obj.brand.brand_id)'>
              <span class='left'>到店购买:</span>
              <div class='center'>
                <p>请查看附近的<a class='mark'>在售门店</a></p>
                <p>线下零售店价格可能有所波动</p>
                <!-- <p v-else>线下销售门店正在完善中，敬请期待</p> -->
              </div>
              <span class='right'>
                <x-icon type="ios-arrow-right" size="24" class='icon-right'></x-icon>
              </span>
            </li>
            <li class='vux-1px-t vux-1px-b line' v-if='offline_switch === "1" || collect_switch === "1"'>
              <span class='left'>线上购买:</span>
              <div class='center'>
                <p>请选择收货方式</p>
              </div>
            </li>
            <li class="strong" @click='goHome(product_obj.brand.brand_id)'>
              <span class='left'></span>
              <div class='center' v-if='!address_1'>
                <p v-if='offline_switch === "1" || collect_switch === "1"'>1.直接配送到家</p>
                <p v-else>直接配送到家</p>
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
            <li class='vux-1px-t strong' v-if='collect_switch === "1"' @click='goStore(product_obj.brand.brand_id)'>
              <span class='left'></span>
              <div class='center' v-if='!address_2 && !address_3'>
                <p>2.由合作门店提供代收和短时贮藏服务</p>
                <p>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-cc-marker"></use>
                  </svg>
                  <span>选择门店</span>
                  <!-- <span v-else>代收货门店正在完善中，敬请期待</span> -->
                </p>
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

          <!-- B端 产品组合推荐及配送规则 -->
          <div class="recommend" v-if='!member_c'>
            <p class='title' @click='toggleRecommend'>
              运输方式及费用详细说明
              <svg class="icon" aria-hidden="true" ref='arrow'>
                <use xlink:href="#icon-arrow-up"></use>
              </svg>
            </p>
            <p class='rule' v-show='slideDown'>配送规则： <span v-if='product_obj.store'>{{ product_obj.store.delivery_rule }}</span></p>
            <swiper class="wrapper" :options='swiperOption2'>
              <swiper-slide v-for='(item, idx) of product_obj.goods_combo' :key='idx' @click.native='toProduct(item.combo_goods.goods_id)'>
                <div class="goods">
                  <img v-lazy="item.combo_goods.goods_image">
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

          <div class="goods_info" v-if='product_obj.goods_video'>
            <p class='see_text vux-1px-b'>
              <span>以下资料如果您不方便观看视频</span><br />
              <span>请<a class='mark' @click='toDesc(product_obj.goods_id, 3)'>点击此处</a>查看图文详情</span>
            </p>

            <!-- 固定视频 -->
            <div class="item" v-if='product_obj.goods_video.video && product_obj.goods_video.video[1]'>
              <div class="title">
                <span class='name'>生长环境</span>
                {{ product_obj.goods_video.video[1].Video.title }}
              </div>
              <div class="video">
                <iframe v-if='product_obj.goods_video.video[1].Video && product_obj.goods_video.video[1].Video.src' frameborder="0" :src="product_obj.goods_video.video[1].Video.src" allowfullscreen></iframe>
                <img v-else  @click='toDesc(product_obj.goods_video.video[1].Video.id, 4)' v-lazy='product_obj.goods_video.video[1].Video.image' />
              </div>
              <div class="text" v-if='product_obj.goods_video.video[1].Live'>
                <p class='live_tv' @click='toLive(product_obj.goods_video.video[1].Live.src)'>
                  查看24小时监控直播
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yuanjiantou"></use>
                  </svg>
                </p>
              </div>
            </div>
            <div class="item" v-if='product_obj.goods_video.video && product_obj.goods_video.video[2]'>
              <div class="title">
                <span class='name'>加工过程</span>
                {{ product_obj.goods_video.video[2].Video.title }}
              </div>
              <div class="video">
                <iframe v-if='product_obj.goods_video.video[2].Video && product_obj.goods_video.video[2].Video.src' frameborder="0" :src="product_obj.goods_video.video[2].Video.src" allowfullscreen></iframe>
                <img v-else @click='toDesc(product_obj.goods_video.video[2].Video.id, 4)' v-lazy='product_obj.goods_video.video[2].Video.image' />
              </div>
              <div class="text" v-if='product_obj.goods_video.video[2].Live'>
                <p class='live_tv' @click='toLive(product_obj.goods_video.video[2].Live.src)'>
                  查看24小时监控直播
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yuanjiantou"></use>
                  </svg>
                </p>
              </div>
            </div>

            <!-- 品种  -->
            <div class="item" v-if='product_obj.goods_video.variety && product_obj.goods_video.variety.length > 0'>
              <div class="title">
                <span class='name'>品种</span>
                {{ product_obj.goods_video.variety[0].title }}
              </div>
              <div class="video">
                <img @click='toDesc(product_obj.goods_video.variety[0].id, 4)' v-lazy="product_obj.goods_video.variety[0].image">
              </div>
            </div>

            <!-- 吃法 -->
            <div class="eat" v-if='product_obj.goods_video && product_obj.goods_video.recommend'>
              <div class="eat_way"></div>
              <swiper :options="swiperOption1" :not-next-tick="notNextTick" ref="mySwiper1">
                <swiper-slide v-for='(item, idx) of product_obj.goods_video.recommend' :key='idx'>
                  <div class='img'>
                    <img v-lazy='item.image' @click='toDesc(item.id, 6)'></img>
                    <div class="zhezhao" v-show='idx !== swiperOption1.idx % product_obj.goods_video.recommend.length'></div>
                  </div>
                  <div class='text'>{{ item.title }}</div>
                </swiper-slide>
              </swiper>
            </div>

            <!-- 不定视频 -->
            <div class="item" v-if='product_obj.goods_video.video && product_obj.goods_video.video[3]'>
              <div class="title">
                {{ product_obj.goods_video.video[3].Video.title }}
              </div>
              <div class="video">
                <iframe v-if='product_obj.goods_video.video[3].Video && product_obj.goods_video.video[3].Video.src' frameborder="0" :src="product_obj.goods_video.video[3].Video.src" allowfullscreen></iframe>
                <img v-else @click='toDesc(product_obj.goods_video.video[3].Video.id, 4)' v-lazy='product_obj.goods_video.video[3].Video.image' />
              </div>
              <div class="text" v-if='product_obj.goods_video.video[3].Live'>
                <p class='live_tv' @click='toLive(product_obj.goods_video.video[3].Live.src)'>
                  查看24小时监控直播
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yuanjiantou"></use>
                  </svg>
                </p>
              </div>
            </div>

            <div class="image">
              <div class="company" @click='toDesc(null, 5)'>
                <img src="../../assets/product/company.jpg">
              </div>
              <img src="../../assets/product/icon.jpg">
              <div class="quality" v-if='product_obj.goods_video && product_obj.goods_video.quality'>
                <h3>品控保证</h3>
                <div class="desc" v-if='product_obj.goods_video.quality'>
                  <a v-for='(item, index) of product_obj.goods_video.quality' @click='toDesc(item.id, item.title)'>
                    <span>{{ item.title }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="company_card" v-if='product_obj.store' @click='toDesc(product_obj.store_id, 1)'>
            <div class="brand">
              <img v-lazy="product_obj.store.store_label">
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
          <!-- 产品评价 -->
          <div class="rate">
            <x-header class='x-header vux-1px-b'>
              <span slot='left'>评价</span>
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
          <!-- <img src="../../assets/product/pulldown.png" v-if='pullicon'> -->
          <spinner v-if='!pullicon'></spinner>
        </div>
      </transition>

      <!-- 购物车 -->
      <transition name='slide' v-if='product_obj.goods_image'>
        <div class="shopcart" ref='shopcart' v-show='addFlag'>
          <div class="close_icon" @click='addFlag = !addFlag'>
            <x-icon type="ios-close-empty" size="30"></x-icon>
          </div>
          <div class="main">
            <div class="left">
              <img v-lazy="product_obj.goods_image[0]">
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
              <span class='count' @click='jianpanEvent'>{{ count }}</span>
              <div class='box add' @click='add'>+</div>
              <div class="cue" v-show='goods_storage'>库存不足</div>
            </div>
          </div>
          <button @click='submit'>加入购物车</button>
          <!-- <input type='button' @click='submit' value='加入购物车' /> -->
        </div>
      </transition>
      <van-number-keyboard
        :show="jianpan"
        theme="custom"
        extra-key="完成"
        @blur="jianpan = false"
        @input="onInput"
        @delete="onDelete"
      />
      <tab @add='addCart' @tel='tel'></tab>
      <confirm v-if='product_obj.brand' v-model='show' title='确定要重新选择购买方式吗？' @on-confirm='reSelect(product_obj.brand.brand_id)'></confirm>
      <Confirms :text="telephone" ref='confirm' confirmBtnText='拨打' title='联系卖家'></Confirms>
      <alert v-model="alertFlag" title='提示'>{{msg}}</alert>
    </div>
  <!-- </scroll> -->
</template>
<script>
  import assign from '@/mixins/assign.js'  // 兼容history模式 ios微信分享签名错误问题
  import Tab from '@/components/pro_tab/pro_tab'
  import Placeholder from '@/components/placeholder/placeholder'
  import xHeader from '@/components/x-header/x-header'
  import RateItem from '@/components/rate_item/rate_item'
  import { Spinner, Confirm, Alert } from 'vux'
  // import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'
  import Confirms from '@/components/confirm/confirm'
  import { mapGetters, mapMutations } from 'vuex'
  import { Delivery } from '../../common/config/config.js'
  
  const INIT = 1
  /* eslint-disable */
  export default {
    name: 'product',
    mixins: [assign],
    data () {
      return {
        member_c: true,
        product_obj: {},
        videoArr: ['http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA1', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/A%E7%BB%84VA2', 'http://outpmmta5.bkt.clouddn.com/MIXRT'],
        notNextTick: true,
        goods_image: [],
        // 顶部产品图片的swiper组件
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 8,
          initialSlide: INIT,
          idx: INIT,
          onSlideChangeStart (swiper) {
            this.idx = swiper.activeIndex
          }
        },
        // 建议吃法的swiper组件
        swiperOption1: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 10,
          initialSlide: INIT,
          idx: INIT,
          onSlideChangeStart (swiper) {
            this.idx = swiper.activeIndex
          }
        },
        // B端推荐产品的swiper组件
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
        offline_switch: '',
        collect_switch: '',
        num: 0, // 购物车的数量
        telephone: '',
        alertFlag: false,
        msg: '该店铺还未添加手机号',
        goods_storage: false,
        jianpan: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      // 这里不让用true/false  那就用隐式转换的方法实现，其实不合理
      this.member_c = storage.get('member_class') === '2' ? '' : '1'
      this.id = this.$route.params.id
      // 获得产品数据
      this._getProductDesc(this.id, this._wechatInit)
      // 清除type这个storage
      storage.remove('type')
      // 获取购物车商品数量
      this._getShopCart()
      this.submitFlag = false
      this.goods_storage = false
    },
    methods: {
      onInput (value) {
        if (value === '完成') {
          this.jianpan = false
        } else {
          this.count = Number(this.count + '' + value)
        }
      },
      onDelete () {
        this.count = Number(`${this.count}`.substring(0, `${this.count}`.length - 1))
      },
      jianpanEvent () {
        this.jianpan = true
      },
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
        // this.$refs.scrollCom.scrollTo(0, 0, 500)
      },
      addCart () {
        this.addFlag = true
        this.$refs.minus.style.color = '#999'
      },
      submit () {
        if (this.count > this.product_obj.goods_storage || this.submitFlag) {
          return
        }
        this.submitFlag = true
        this.addFlag = false
        this.$http.post(`/mobile/?act=member_cart&op=cart_add&api_token=${this.api_token}`, {
          goods_id: this.id,
          quantity: this.count
        }).then(res => {
          this.submitFlag = false
          if (res.data.status === 200) {
            // 获取购物车最新的数量
            this._getShopCart()
          } else {
            if (res.data.data.error !== '请登录') {
              this.msg = res.data.data.error
              this.alertFlag = true
            }
          }
        })
      },
      // 这块对于goods_storage的判断应该提取到watch里
      minus () {
        if (this.count === 1) {
          return
        }
        this.count--
      },
      add () {
        if (this.count < this.product_obj.goods_storage) {
          this.count++
        }
      },
      _changeNum () {
        if (this.count < 1) {
          this.count = 1
        }
      },
      // 滑动的时候直接给我pos值，来判断下拉的icon变化
      scroll (pos) {
        // this.scrollY = pos.y
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
      toDesc (id, idx) {
        if (idx > -1) {
          let arr = ['快速加入品牌', '企业名片', '品控保证', '图文查看', '图文详情', '平台规则', '建议吃法']
          this.$router.push({
            path: '/desc',
            query: {
              id,
              title: arr[idx]
            }
          })
        } else {
          this.$router.push({
            path: '/desc',
            query: {
              id,
              title: idx
            }
          })
        }
      },
      tel () {
        if (!this.telephone) {
          this.alertFlag = true
          return
        }
        this.$refs.confirm.show()
      },
      goZiti () {
        if (this.offline_switch !== '1') return
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
            id, // 传的是品牌id
            transport: Delivery.ptSend
          }
        })
      },
      // 这里改来改去 也不给我说 一会品牌id,一会商品id，让我被动改一大堆。
      goStore (id) {
        if (this.collect_switch !== '1') return
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
              id,
              transport: Delivery.ptSend
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
      toProduct (id) {
        this.$router.push(`/product/${id}`)
        // 刷新页面
        this.$router.go(0)
      },
      toLive (url) {
        window.location.href = url
      },
      _wechatInit () {
        console.log('wechat init')
        let url = encodeURIComponent(window.location.href.split('#')[0])
        this.$http.get(`api/wechatshare?url1=${url}`)
        .then( res => {
          let js_sdk = res.data
          const that = this
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: js_sdk.appId, // 必填，公众号的唯一标识
            timestamp: js_sdk.timestamp, // 必填，生成签名的时间戳
            nonceStr: js_sdk.nonceStr, // 必填，生成签名的随机串
            signature: js_sdk.signature, // 必填，签名，见附录1
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function() {
            console.log(that.product_obj.goods_jingle,that.product_obj.goods_name)
            const title = that.product_obj.goods_jingle  // 分享标题
            const desc = that.product_obj.goods_name   // 分享描述
            const link = window.location.href   // 分享链接
            const imgUrl = that.goods_image[1]   // 分享图片
            // 分享到朋友圈
            wx.onMenuShareTimeline({
              title: title, // 分享标题
              desc: desc,
              link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function() {
                // 用户确认分享后执行的回调函数
                console.log("朋友圈分享成功");
              }
            });
            //  分享给好友
            wx.onMenuShareAppMessage({
              title: title, // 分享标题
              desc: desc,
              link: link,
              imgUrl: imgUrl,
              success: function() {
                console.log("分享给朋友成功");
              }
            })
          })
        })
        .catch( err => {
          console.log(err)
        })
      },
      _getProductDesc (id, cb) {
        this.$http.get('/api/goods/detail', {
          params: {
            id,
            api_token: this.api_token
          }
        }).then(res => {
          if (~~res.data.status === 200) {
            this.product_obj = res.data.data
            if (res.data.data.store) {
              this.telephone = res.data.data.store.store_phone
            }
            // 对swiper的长度进行判断
            if (this.product_obj.goods_image.length === 1) {
              this.swiperOption.idx = 0
            }
            if (this.product_obj.goods_video.recommend && this.product_obj.goods_video.recommend.length === 1) {
              this.swiperOption1.idx = 0
            }
            if (this.product_obj.goods_storage === 0) {
              this.goods_storage = true
            }
            this.goods_image = this.product_obj.goods_image.slice()
            if (this.goods_image.length >= 2) {
              let x = this.goods_image[0]
              this.goods_image[0] = this.goods_image[1]
              this.goods_image[1] = x
            }
            this._getCollect()
            this._getAddressStatus()
            cb && cb()
          }
        }).catch(e => {
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
            this.collect_switch = res.data.data.site_collect_switch
            this.offline_switch = res.data.data.site_offline_switch
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
      },
      _getAddressStatus () {
        let type = storage.get('type')
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
      },
      ...mapMutations([
        'SET_CART_COUNT'
      ])
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
    watch: {
      // 进行减法的颜色变化，最低为1
      count () {
        if (this.count === 1) {
          this.$refs.minus.style.color = '#999'
        } else {
          this.$refs.minus.style.color = '#000'
        }
        if (this.count > this.product_obj.goods_storage) {
          this.goods_storage = true
        } else {
          this.goods_storage = false
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
        // this.$refs.scrollCom.refresh()
      },
      num (newVal) {
        this.SET_CART_COUNT(newVal)
      },
      $route (newVal) {
        if (newVal.path.indexOf('product') > -1) {
          // 这里写的有点粗糙，对应的是三种购买方式
          this.product_obj = {}
          this.id = this.$route.params.id
          // 登录后拿到登录状态值
          this.api_token = storage.get('api_token')
          this.member_c = storage.get('member_class') === '2' ? '' : '1'
          this.goods_storage = false
          this.returnFlag = false
          this.goods_image = []
          this.swiper.slideTo(1)
          this._getProductDesc(this.id, this._wechatInit)
          this._getShopCart()
        }
      },
      jianpan (newVal) {
        if (newVal) {
          this.$refs.shopcart.style.bottom = '216px'
        } else {
          this.$refs.shopcart.style.bottom = '0'
          this.count = this.count || 1
        }
      },
      product_obj: {
        deep: true,
        handler () {
          this.$nextTick(() => {
            // this.$refs.scrollCom.refresh()
          })
        }
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
      // Scroll,
      Spinner,
      Confirms,
      Confirm,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .outBox{
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 50px;
    // overflow-y: auto;
    padding-bottom: 50px;
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
      // position: absolute;
      // top: 0;
      // left: 0;
      // right: 0;
      // z-index: 1;
      background: #fff;
      .placeholder{
        height: 102vw;
        .swiper-wrapper{
          .swiper-slide {
            width: 77.333vw;
            height: 102vw;
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
      }
      main{
        .mark{
          color: #5eb29e;
        }
        .desc{
          width: 100vw;
          padding: 16px 15px;
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
              line-height: 18px;
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
              margin-bottom: 14px;
              line-height: 24px;
            }
            .sell_point{
              font-size: @font-size-small;
              color: #666;
              line-height: 24px;
              margin-bottom: 16px;
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
          .rule{
            padding: 0 15px 15px;
            font-size: @font-size-medium;
            color: #666;
            line-height: 20px;
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
          .see_text{
            line-height: 26px;
            padding: 6px 0;
            font-size: @font-size-small;
            text-align: center;
            font-weight: bold;
            .no-wrap
          }
          .item{
            width: 100%;
            margin-top: 20px;
            .title{
              margin-top: 8px;
              padding-left: 16px;
              position: relative;
              line-height: 24px;
              margin-bottom: 15px;
              &:before{
                position: absolute;
                content: '';
                display: block;
                width: 7px;
                height: 20px;
                left: 0;
                top: 2px;
                background: #5fb29e;
              }
              .name{
                position: relative;
                margin-right: 22px;
                &:before{
                  content: '';
                  display: block;
                  position: absolute;
                  right: -14px;
                  top: 50%;
                  transform: translate3d(0, -50%, 0);
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background: @color;
                }
              }
            }
            .video{
              width: 100%;
              height: 0;
              padding-top: 56.25%;
              position: relative;
              video, iframe, img{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                object-fit: fill;
              }
            }
            .text{
              font-size: @font-size-small;
              height: 42px;
              line-height: 42px;
              .live_tv{
                color: #b8b8b8;
                .icon {
                  width: 1em; 
                  height: 1em;
                  vertical-align: -0.15em;
                  fill: currentColor;
                  overflow: hidden;
                }
              }
            }
          }
          .image{
            margin-top: 40px;
            & > img {
              width: 100%;
            }
            .company{
              width: 100%;
              margin-bottom: 20px;
              img{
                width: 100%;
              }
            }
            .quality{
              width: 100%;
              text-align: center;
              margin-top: 38px;
              .desc{
                width: 100%;
                height: 95px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-around;
                a{
                  height: 54px;
                  width: 54px;
                  // border: 1px solid @color;
                  padding: 0 10px;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: @color;
                  color: #fff;
                  font-size: @font-size-medium;
                  line-height: 16px;
                }
              }
            }
          }
          .eat{
            margin-top: 40px;
            text-align: center;
            margin-bottom: 40px;
            .eat_way{
              height: 20px;
              // width: 100%;
              max-width: 345px;
              background: url('../../assets/product/eat_way.png') no-repeat 0 0;
              background-size: 100% 100%;
              margin: 0 auto 22px;
            }
            .swiper-wrapper{
              .swiper-slide {
                width: 64vw;
                position: relative;
                height: 57.333vw;
                .img{
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 48vw;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                  .zhezhao{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, .4);
                  }
                }
                .text{
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  width: 64vw;
                  transform: translate3d(-50%, 0, 0);
                  color: #000;
                  font-size: @font-size-medium;
                }
              }
            }
          }
        }
        .company_card{
          height: 78px;
          width: calc(~"100vw - 32px");
          margin: 19px auto 19px;
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
          flex: 1;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          overflow: hidden;
          h3{
            font-size: @font-size-large;
            margin: 14px 0 10px 0;
            .no-wrap
          }
          .middle{
            color: #adadad;
            margin-bottom: 10px;
            font-size: @font-size-small;
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
            width: 48px;
            line-height: 30px;
            text-align: center;
            font-size: @font-size-medium;
            border: 0;
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
