<template>
  <div class="container">
    <x-title>附近门店</x-title>
    <div id="container" class='map'></div>
    <div class="modal" v-if='active && activeAddData.shop_pic'>
      <div class="top vux-1px-b">
        <div class="left"><img v-lazy="activeAddData.shop_pic"></div>
        <div class="right">
          <h3>{{ activeAddData.company_name }}</h3>
          <p class='add'>{{ activeAddData.location }}</p>
          <p class='info'><span>距您{{ distance }}m</span><span>营业时间 {{ activeAddData.saletime }}</span></p>
        </div>
      </div>
      <div class="content">
        <div class="item tel vux-1px-b">
          门店联系电话：<img src="./tel.png">
          <a :href="tel">
          {{ activeAddData.contact_phone }}
          </a>
        </div>
        <div class="item transport vux-1px-b">
          您可以选择门店配送到家/到店自提: 
          <div class="radio_wrapper">
            <p @click='peisong' v-if='activeAddData.is_dispatching === "2" && activeAddData.dispatching_switch === "1"'>
              <img src="../../assets/selectAdd/selected.png" v-if='transport === 2'>
              <img src="../../assets/selectAdd/select.png" v-else>配送
            </p>
            <p @click='ziti'>
              <img src="../../assets/selectAdd/selected.png" v-if='transport === 3'>
            <img src="../../assets/selectAdd/select.png" v-else>自提
            </p>
          </div>
        </div>
        <div class="item rule vux-1px-b">
          <div class="left">
            <p v-if='transport === 2'>配送规则:</p>
            <p v-else>自提规则</p>
          </div>
          <div class="right">
            <p>{{ activeAddData.distribution_rule }}</p>
            <!--<p>1.配送时间：9:00-18:00</p>
            <p>2.满51元免配送费，不满51元收取10元配送费</p>-->
          </div>
        </div>
        <div class="item rule address" @click='selectAdd' v-show='transport === 2'>
          <div class="left"><p>配送地址:</p></div>
          <div class="right" v-if='!address_1'>
            <p>请选择配送地址</p>
          </div>
          <div class="right" v-else>
            <p>{{address_1.area_info | blank}}{{address.address}}</p>
            <p class='people'><span>{{address_1.true_name}}</span> &nbsp; <span>{{address_1.tel_phone}}</span></p>
          </div>
          <!-- <div class="right" v-if='address[id]'>
            <p>{{address[id].area_info | blank}}{{address[id].address}}</p>
            <p class='people'><span>{{address[id].true_name}}</span> &nbsp; <span>{{address[id].tel_phone}}</span></p>
          </div>
          <div class="right" v-else>
            <p>请选择配送地址</p>
          </div> -->
          <x-icon type="ios-arrow-right" size="30"></x-icon>
        </div>
      </div>
      <div class="close" @click='close'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-close47"></use>
        </svg>
      </div>
      <alert v-model="show" title="请完整输入信息">{{ msg }}</alert>
      <button @click='sure'>确定</button>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  /* eslint-disable */
  import XTitle from '@/components/x-title/x-title'
  import { mapGetters, mapMutations } from 'vuex'
  import { Alert } from 'vux'
  import storage from 'good-storage'
  import { Delivery } from '../../common/config/config.js'
  export default {
    name: 'maps',
    data () {
      return {
        active: false, // 上浮出来店铺信息的Flag
        transport: 0, // 配送方式
        id: 0,  // url传参传过来的Brand_id
        addList: [],
        activePoint: '',
        activeAddData: {},
        distance: 0,  // 这里应该是后端来获取的数据，是个跨域接口，用easy-mock做了层代理（服务器代理增加后端难度）
        address_1: '',
        show: false,
        msg: ''
      }
    },
    created () {
      this.id = this.$route.query.id
      this.goodsId = this.$route.query.goodsId
      // 因为后端需要从传递一个Arr,当goodsId只有一个时，利用history路由取到的值是一个String,所以做个hack
      // 包括在当前页面刷新，防止报错
      if (typeof this.goodsId === 'string') {
        let arr = []
        arr.push(this.goodsId)
        this.goodsId = arr
      }
      // 不是父子路由，用go(-1)还是要重新加载路由的，通过判断this.address的值来判断是否已经选好了地址
      if (this.address[this.id] !== 1) {
        this.active = true
      } else {
        this.active = false
      }
      this.api_token = storage.get('api_token')
    },
    mounted () {
      if (!this.position.lat) {
        this.$emit('position')
      } else {
        this._getMap()
      }
    },
    activated () {
      this.id = this.$route.query.id
      this.goodsId = this.$route.query.goodsId
      if (typeof this.goodsId === 'string') {
        let arr = []
        arr.push(this.goodsId)
        this.goodsId = arr
      }
      // 不是父子路由，用go(-1)还是要重新加载路由的，通过判断this.address的值来判断是否已经选好了地址
      if (this.address[this.id] && this.address[this.id].area_info) {
        this.active = true
      } else {
        this.address_1 = ''
        this.active = false
      }
      this._getMap()
    },
    methods: {
      peisong () {
        this.transport = Delivery.stSend
      },
      ziti () {
        this.transport = Delivery.self
      },
      close () {
        this.active = false
      },
      selectAdd () {
        this.$router.push({
          path: '/my/address',
          query: {
            id: this.id,
            transport: Delivery.stSend
          }
        })
      },
      sure () {
        if (!this.transport) {
          this.show = true
          this.msg = '请选择配送方式'
          return 
        }
        if (this.transport === Delivery.stSend && !this.address_1) {
          this.show = true
          this.msg = '请选择配送地址'
          return
        }
        let data = {
          id: this.id,
          transport: this.transport,
          store_id: this.activeAddData.member_id,
          store_add: this.activeAddData.location,
          store_name: this.activeAddData.company_name
        }
        // 不管是商家配送和还是自提都是关联 addressType 
        this.addressType(data)
        if (this.transport === Delivery.self) {
          this.SET_ADDRESS({
            'brand_id': this.id,
            'address': 1
          })
        }
        this.active = false
        storage.set('type', this.transport)
        this.$router.go(-1)
      },
      _getData () {
        this.$http.get('/api/goods/pickup', {
          params: {
            api_token: this.api_token,
            goods_id: this.goodsId
          }
        }).then(res => {
          if (~~res.data.status === 200) {
            this.addList = res.data.data
            this.addList.forEach(item => {
              let marker = new qq.maps.Marker({
                position: new qq.maps.LatLng(Number(item.location_lat), Number(item.location_lng)),
                map: this.map
              })
              var anchor = new qq.maps.Point(3, -30),
                  size = new qq.maps.Size(40, 54),
                  origin = new qq.maps.Point(0, 0),
                  scaleSize = new qq.maps.Size(20, 27),
                  icon = new qq.maps.MarkerImage(
                      "http://outpmmta5.bkt.clouddn.com/point",
                      size,
                      origin,
                      anchor,
                      scaleSize
                  )
              marker.setIcon(icon)
              var info = new qq.maps.InfoWindow({
                map: this.map
              })
              qq.maps.event.addListener(marker, 'click', (e) => {
                // 取其坐标值移动到该marker
                // map.panTo(new qq.maps.LatLng(39.916527,116.397128))
                this.activePoint = `${e.latLng.lat},${e.latLng.lng}`
                this.active = true
              })
            })
          }
        })
      },
      _getMap () {
        let center = new qq.maps.LatLng(this.position.lat, this.position.lng)
        this.map = new qq.maps.Map(document.getElementById('container'), {
          // 地图的中心地理坐标
          center,
          zoom: 15
        })
        // 地图的marker标注 这个是定位点
        let marker1 = new qq.maps.Marker({
          position: center,
          map: this.map
        })
        var anchor = new qq.maps.Point(0, 39),
            size = new qq.maps.Size(31, 70),
            origin = new qq.maps.Point(0, 0),
            icon = new qq.maps.MarkerImage(
                "http://outpmmta5.bkt.clouddn.com/curPoint.png",
                size,
                origin,
                anchor
            )
        marker1.setIcon(icon)
        this._getData()
      },
      ...mapMutations({
        'addressType': 'SET_ADDRESS_TYPE',
        'SET_ADDRESS': 'SET_ADDRESS'
      })
    },
    computed: {
      ...mapGetters({
        'address': 'address',
        'position': 'position'
      }),
      tel () {
        return `tel:${this.activeAddData.contact_phone}`
      }
    },
    filters: {
      blank (value) {
        return value.replace(/\s/g, '')
      }
    },
    watch: {
      $route () {
        if (this.$route.path === '/map') {
          this._getData()
        }
        this.address_1 = Object.assign({}, this.address)[this.id]
      },
      activePoint (newVal) {
        let x = this.addList.find(item => {
          return item.location_lat === newVal.split(',')[0]
        })
        this.activeAddData = x
        this.$http.get('https://www.easy-mock.com/mock/59e978ad9fb6d12f24ddbc4e/ctx/nginx', {
          params: {
            from: `${this.position.lat},${this.position.lng}`,
            to: `${this.activePoint}`,
            key: '2JHBZ-UC7WO-MKLWW-SDXUZ-WSI4J-XYF25'
          }
        }).then(res => {
          if (res.data.status === 0) {
            this.distance = res.data.result.elements[0].distance
          }
        })
      },
      position (newVal) {
        this._getMap()
      }
    },
    components: {
      XTitle,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    height: 100vh;
    position: relative;
    z-index: 1;
    .map{
      width: 100%;
      height: calc(~"100vh - 50px");
    }
    .modal{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      font-size: @font-size-small;
      background: #fff;
      .close{
        position: absolute;
        right: 15px;
        top: 15px;
        .icon {
          width: 1.5em;
          height: 1.5em;
          vertical-align: -0.15em;
          fill: #999;
          overflow: hidden;
        }
      }
      .top{
        width: 100%;
        padding: 18px;
        display: flex;
        flex-flow: row nowrap;
        .left{
          width: 90px;
          height: 90px;
          margin-right: 18px;
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
          .add{
            margin: 8px 0 12px 0;
            line-height: 16px;
          }
          .info{
            color: #666;
            span:first-child{
              margin-right: 10px;
            }
          }
        }
      }
      .content{
        width: 100%;
        padding-left: 18px;
        .left{
          width: 20%;
        }
        .right{
          color: #666;
          width: 72%;
          padding-right: 28px;
        }
        .item{
          // height: 58px;
          padding: 17px 0;
          width: 100%;
          p{
            line-height: 22px;
          }
          .radio_wrapper{
            flex: 1;
            display: flex;
            padding-right: 15px;
            flex-flow: row nowrap;
            align-items: right;
            justify-content: flex-end;
            p{
              &~p{
                margin-left: 26px;
              }
              img{
                width: 16px;
                height: 16px;
                vertical-align: -.3em;
                margin-right: 10px;
              }
            }
          }
          a{
            color: #000;
          }
        }
        .tel{
          img{
            height: 22px;
            vertical-align: -.5em;
            margin: 0 6px 0 15px;
          }
        }
        .transport{
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
        .rule{
          display: flex;
          padding: 20px 0;
          &.address{
            padding: 12px 0;
            position: relative;
            .vux-x-icon {
              position: absolute;
              top: 50%;
              width: 2em;
              height: 2em;
              right: 12px;
              transform: translateY(-50%);
              fill: #999;
            }
          }
          .left{
            margin-right: 10px;
          }
        }
      }
      button{
        width: 100%;
        height: 50px;
        border: 0;
        background: @color;
        color: #fff;
        letter-spacing: 8px;
        line-height: 50px;
        text-align: center;
        font-size: @font-size-large;
      }
    }
  }
</style>
