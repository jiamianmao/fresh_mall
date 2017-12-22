<template>
  <div class='container'>
    <x-title>定位</x-title>
    <scroll 
    class="listview" 
    :data="cityData"
    :listenScroll="listenScroll"
    :probeType="probeType"
    ref="listview">
      <ul>
        <li class="list-group">
          <h2>定位城市</h2>
          <ul class="list-hot">
            <li class="list-group-hot list-active">{{city}}</li>
          </ul>
        </li>
        <li class="list-group" v-if='lately.length'>
          <h2>最近访问城市</h2>
          <ul class="list-hot">
            <li class="list-group-hot" v-for='city of lately' @click='selectCity(city)'>{{city}}</li>
          </ul>
        </li>
        <li class="list-group">
          <h2>热门城市</h2>
          <ul class="list-hot" @click='selectHot'>
            <li class="list-group-hot">
              北京
            </li>
            <li class="list-group-hot">
              上海
            </li>
            <li class="list-group-hot">
              广州
            </li>
            <li class="list-group-hot">
              深圳
            </li>
            <li class="list-group-hot">
              杭州
            </li>
            <li class="list-group-hot">
              武汉
            </li>
          </ul>
        </li>
        <li class="list-group" v-for="item in cityData" :key="item.title" ref="listgroup">
          <h2>{{item.title}}</h2>
          <ul>
            <li class="list-group-item" v-for="area in item.items" :key="area.id" @click='selectCity(area.name)'>{{area.name}}</li>
          </ul>
        </li>
      </ul>
      <!-- 字母列表 -->
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li class="item" v-for="(item, index) in shortcut" :key="index" :data-index="index">
            {{item.title}}
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'

  const SHORTCUT_HEIGHT = 18
  export default {
    data () {
      return {
        cityData: [],
        city: '',
        cityFlag: false,
        lately: []
      }
    },
    created () {
      this.touch = {}   // 存多个函数共有数据
      this.listenScroll = true
      this.probeType = 3  // 滑动的时候不节流
      this._getCityList()
      this.city = storage.session.get('city')
      this.lately = storage.session.has('lately') ? storage.session.get('lately') : []
    },
    computed: {
      // 固定字母列表
      shortcut () {
        const arr = [{
          title: '#'
        }]
        return arr.concat(this.cityData)
      }
    },
    methods: {
      onShortcutTouchStart (e) {
        let shortcutIndex = this._getAttrVal(e.target, 'index')
        if (shortcutIndex == null) {  // 点击两端空白时 获取不到当前索引
          return
        }
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY  // 开始滑动时的pageY值
        this.touch.shortcutIndex = shortcutIndex - 1
        if (shortcutIndex === '0') {
          this.$refs.listview.scrollTo(0, 0)
        }
        this._scrollTo(shortcutIndex - 1)
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY  // 滑动结束时的pageY值
        let diff = (this.touch.y2 - this.touch.y1) / SHORTCUT_HEIGHT | 0
        let shortcutIndex = this.touch.shortcutIndex + diff
        // console.log(shortcutIndex)
        // 滑动到 # 时 回到顶部
        if (shortcutIndex < 0) {
          this.$refs.listview.scrollTo(0, 0)
        }
        // 滑动超过底部时  直接return
        if (shortcutIndex > this.shortcut.length) {
          return
        }
        // console.log(shortcutIndex)
        this._scrollTo(shortcutIndex)
      },
      selectCity (name) {
        this.city = name
        this.cityFlag = !this.cityFlag
      },
      selectHot (e) {
        this.city = e.target.innerText
        this.cityFlag = !this.cityFlag
      },
      // 滚动到当前元素
      _scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
      },
      // 获取DOM元素的属性值
      _getAttrVal (el, name) {
        const prefix = 'data-'
        name = prefix + name
        return el.getAttribute(name)
      },
      // 请求城市列表数据
      _getCityList () {
        this.$http.get('/api/area/area').then((res) => {
          this.cityData = this._changeCityData(res.data)
          // console.log(this.cityData)
        })
      },
      // 格式化城市数据
      _changeCityData (list) {
        // 先取出所有的城市数据
        let cityArr = []
        list.forEach((item, index) => {
          item.sub.forEach((val, key) => {
            cityArr.push(val)
          })
        })
        // console.log(cityArr)
        let map = {}
        cityArr.forEach((item, index) => {
          const key = item.area_initial
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(
            {
              id: item.area_id,
              name: item.area_name
            }
          )
        })
        // console.log(map)
        // map 转为有序数组
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return ret
      }
    },
    watch: {
      cityFlag () {
        storage.session.set('city', this.city)
        if (!storage.session.has('lately')) {
          storage.session.set('lately', [this.city])
        } else {
          let arr = storage.session.get('lately')
          if (!arr.includes(this.city)) {
            arr.unshift(this.city)
            // 控制长度
            if (arr.length > 6) {
              arr.pop()
            }
          } else {
            let idx = arr.findIndex(item => {
              return item === this.city
            })
            arr.splice(idx, 1)
            arr.unshift(this.city)
          }
          storage.session.set('lately', arr)
        }
        this.$router.push('/home')
      }
    },
    components: {
      XTitle,
      Scroll
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable';

  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    z-index: 1;
    .listview{
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .list-group{
        padding: 0 20px 20px 20px;
        h2{
          padding-top: 10px;
          font-size: 14px;
          color: #333;
        }
        .list-hot{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          border-bottom: 1px solid #eeeeee;
          .list-group-hot{
            box-sizing: border-box;
            margin-right: 10px;
            margin-bottom: 10px;
            width: 98px;
            height: 34px;
            border:1px solid #ccc;
            line-height: 34px;
            text-align: center;
            font-size: 12px;
            color: #333;
            overflow: hidden;
          }
          .list-active{
            color:@color;
            border-color:@color;
          }
        }
        .list-group-item{
          height: 34px;
          line-height: 34px;
          font-size: 12px;
        }
      }
      .list-shortcut{
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        font-family: Helvetica;
        .item{
          padding: 3px;
          line-height: 1;
          color: #333;
          font-size: 12px;
        }
      }
    }
  }
</style>
