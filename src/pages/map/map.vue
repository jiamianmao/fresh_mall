<template>
  <div class="container">
    <x-title>附近门店</x-title>
    <div id="container" class='map'></div>
    <div class="modal" v-show='active'>
      <div class="top vux-1px-b">
        <div class="left"><img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1084395821,713073207&fm=58"></div>
        <div class="right">
          <h3>这是一个title</h3>
          <p class='add'>海淀区中关村接到清华大学南门右侧300m</p>
          <p class='info'><span>距您38m</span><span>营业时间 08:00-22:00</span></p>
        </div>
      </div>
      <div class="content">
        <div class="item tel vux-1px-b">
          门店联系电话：<img src="./tel.png">18137855665
        </div>
        <div class="item transport vux-1px-b">
          您可以选择门店配送到家/到店自提: 
          <div class="radio_wrapper">
            <p @click='peisong'>
              <img src="../../assets/selectAdd/selected.png" v-if='transport === "peisong"'>
              <img src="../../assets/selectAdd/select.png" v-else>配送
            </p>
            <p @click='ziti'>
              <img src="../../assets/selectAdd/selected.png" v-if='transport === "ziti"'>
            <img src="../../assets/selectAdd/select.png" v-else>自提
            </p>
          </div>
        </div>
        <div class="item rule vux-1px-b">
          <div class="left">
            <p v-if='transport === "peisong"'>配送规则:</p>
            <p v-else>自提规则</p>
          </div>
          <div class="right">
            <p>1.配送时间：9:00-18:00</p>
            <p>2.满51元免配送费，不满51元收取10元配送费</p>
          </div>
        </div>
        <div class="item rule address" @click='selectAdd' v-show='transport === "peisong"'>
          <div class="left"><p>配送地址:</p></div>
          <div class="right">
            <p>北京市还带去海淀区</p>
            <p>隔壁老王 1819562566</p>
          </div>
          <x-icon type="ios-arrow-right" size="30"></x-icon>
        </div>
      </div>
      <div class="close" @click='close'>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-close47"></use>
        </svg>
      </div>
      <button @click='sure'>确定</button>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        active: false,
        transport: null
      }
    },
    created () {
      var geolocation = new qq.maps.Geolocation()
      geolocation.getIpLocation((position) => {
        this.lat = position.lat
        this.lng = position.lng
      })
    },
    mounted () {
      let center = new qq.maps.LatLng(this.lat, this.lng)
      var map = new qq.maps.Map(document.getElementById('container'), {
        // 地图的中心地理坐标。
        center,
        zoom: 15
      })

      // 地图的marker标注
      let marker1 = new qq.maps.Marker({
        position: center,
        map
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

      let marker2 = new qq.maps.Marker({
        position: new qq.maps.LatLng(34.756, 113.625368),
        map
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
      marker2.setIcon(icon)

      // 地图的marker点击事件
      var info = new qq.maps.InfoWindow({
        map: map
      })
      qq.maps.event.addListener(marker2, 'click', (e) => {
        // 取其坐标值移动到该marker
        // map.panTo(new qq.maps.LatLng(39.916527,116.397128))
        this.active = true
      })
    },
    methods: {
      peisong () {
        this.transport = 'peisong'
      },
      ziti () {
        this.transport = 'ziti'
      },
      close () {
        this.active = false
      },
      selectAdd () {
        this.$router.push('/my/address')
      },
      sure () {
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
        .right{
          color: #666;
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
