<template>
  <transition name='slide'>
    <div class="container">
      <x-title :text='text' @rightClick='delAll'>{{title}}</x-title>
      <div class="goods_wrapper">
        <!-- 
        <div class="goods" v-for='(item, index) of arr' :class='{"vux-1px-t": index > 0}'>
          <div class='icon' ref='icon' @click='active(index)' v-show='del'></div>
          <div class="image">
            <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
          </div>
          <div class="content">
            <p>中天特羔羊肉片</p>
            <span>300g装</span>
            <div class="price">
              <strong>¥29.9</strong>
            </div>
          </div>
        </div> -->
        <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index' v-show='flag'>
          <van-cell-group>
            <div class="goods">
              <div class='icon' ref='icon' @click='active(index)' v-show='del'></div>
              <div class="image">
                <img v-lazy='item.goods_image_url'>
              </div>
              <div class="content">
                <p>{{item.goods_name}}</p>
                <span>{{item.guige}}</span>
                <div class="price">
                  <strong>¥{{item.goods_price}}</strong>
                </div>
              </div>
            </div>
          </van-cell-group>
          <div class='deltext' slot="right" @click='delOne(item.fav_id)'>删除</div>
        </van-cell-swipe>

        <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index' v-show='!flag' >
          <van-cell-group>
            <div class="brand">
              <div class='icon' ref='icon' @click='active(index)' v-show='del'></div>
              <div class="image">
                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
              </div>
              <p>恒源祥</p>
            </div>
          </van-cell-group>
          <div class='deltext1' slot="right" @click='delOne'>删除</div>
        </van-cell-swipe>

      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { CellSwipe } from 'vant'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        title: '',
        text: '编辑',
        del: false,
        arr: [],  // 模拟数据
        activeArr: [],  // 选择的待删除的item
        flag: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      if (this.$route.path === '/my/collect') {
        this.title = '收藏商品'
        this._getCollect()
      } else if (this.$route.path === '/my/footmark') {
        this.title = '浏览记录'
        this._getFootMark()
      } else if (this.$route.path === '/my/brand') {
        this.title = '关注品牌'
        this._getBrand()
      }
    },
    methods: {
      active (idx) {
        console.log(idx)
        console.log('active')
        console.log(this.$refs.icon[idx])
        let index = this.activeArr.indexOf(idx)
        if (index === -1) {
          this.$refs.icon[idx].classList.add('active')
          this.activeArr.push(idx)
        } else {
          this.activeArr.splice(index, 1)
          this.$refs.icon[idx].classList.remove('active')
        }
      },
      delAll (text) {
        if (text === '编辑') {
          this.text = '完成'
          this.del = true
        } else if (text === '删除') {
          this.text = '完成'
          this.activeArr = []
          // todos
        } else {
          this.text = '编辑'
          this.del = false
        }
      },
      delOne (favId) {
        this.$http({
          url: `/apis/mobile/?act=member_favorites&op=favorites_del`,
          method: 'POST',
          data: {
            api_token: this.api_token,
            fav_id: favId
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
      },
      _getBrand () {
        this.$http.get(`/apis/api/brand/follow_list?api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.flag = false
            this.arr = res.data.data
          }
        })
      },
      _getFootMark () {
        this.$http.get(`/apis/mobile/?act=member_goodsbrowse&op=browse_list&api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.flag = false
            this.arr = res.data.data
          }
        })
      },
      _getCollect () {
        this.$http.get(`/apis/mobile/?act=member_favorites&op=favorites_list&api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.flag = true
            this.arr = res.data.data.favorites_list
          }
        })
      }
    },
    components: {
      XTitle,
      CellSwipe
    },
    watch: {
      activeArr () {
        if (this.activeArr) {
          this.text = '删除'
        } else {
          this.text = '完成'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: #fff;
    z-index: 1;
    .goods_wrapper{
      width: 100%;
      .goods{
        width: 100%;
        height: 100px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .image{
          width: 81px;
          height: 81px;
          margin-right: 10px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .content{
          flex: 1;
          height: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          font-size: @font-size-medium;
          padding-right: 15px;
          >span{
            color: #999;
          }
        }
      }
      .deltext{
        width: 64px;
        height: 100%;
        background: red;
        color: #fff;
        text-align: center;
        line-height: 100px;
        letter-spacing: 4px;
      }
      .deltext1{
        .deltext;
        line-height: 60px;
      }
      .icon{
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 6px;
        background: url('../../../assets/selectAdd/select.png') 0 0 ~'/' 100% 100%;
        &.active{
          background: url('../../../assets/selectAdd/selected.png') 0 0 ~'/' 100% 100%;
        }
      }
      .brand{
        width: 100%;
        height: 60px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .image{
          width: 40px;
          height: 40px;
          margin-right: 10px;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
