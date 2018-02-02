<template>
  <div class="container">
    <x-title>附近门店</x-title>
    <div id="container" class='map'></div>
    <div class="modal" v-if='active && activeAddData.member_id'>
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
          门店联系电话：<img src="./tel.png">{{ activeAddData.contact_phone }}
        </div>
      </div>
      <div class="close" @click='close'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-close47"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import XTitle from '@/components/x-title/x-title'
  import { mapGetters } from 'vuex'
  import storage from 'good-storage'
  export default {
    name: 'mapziti',
    data () {
      return {
        active: false, // 上浮出来店铺信息的Flag
        addList: [],
        activePoint: '', // 点击的位置的坐标点，用来拿distance
        activeAddData: {},
        distance: 0  // 这里应该是后端来获取的数据，是个跨域接口，用easy-mock做了层代理（服务器代理增加后端难度）
      }
    },
    created () {
      this.id = ~~this.$route.query.id
      this.api_token = storage.get('api_token')
      this.init = false
    },
    mounted () {
      if (!this.position.lat) {
        this.$emit('position')
      } else {
        this._getMap()
      }
    },
    computed: {
      ...mapGetters({
        'position': 'position'
      })
    },
    methods: {
      close () {
        this.active = false
      },
      _getData () {
        this.$http.get(`/api/goods/offline?api_token=${this.api_token}&goods_id=${this.id}`).then(res => {
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
                this.init = false
              })
            })
          }
        })
      },
      _getMap () {
        if (this.init) {
          return
        }
        this.init = true
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
      }
    },
    activated () {
      this.init = false
      this.id = ~~this.$route.query.id
      this.api_token = storage.get('api_token')
      this._getMap()
    },
    watch: {
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
            this.active = true
          }
        })
      },
      position (newVal) {
        this._getMap()
      }
    },
    components: {
      XTitle
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
