<template>
  <transition name='slide'>
    <div class="container">
      <x-title :text='text' @rightClick='delAll'>{{title}}</x-title>
      <div class="goods_wrapper">
        <div v-if='flag === "goods"'>
          <!--  这是客户原来的需求，我更改了下
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
          <!-- 商品收藏列表 -->
          <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index'>
            <van-cell-group>
              <div class="goods" @click='goProduct(item.goods_id)'>
                <div class='icon' ref='icon' @click.stop='active(index, item.fav_id)' v-show='del'></div>
                <div class="image">
                  <img v-lazy='item.goods_image_url'>
                </div>
                <div class="content">
                  <p>{{ item.goods_name }}</p>
                  <span>{{item.goods_unit}}</span>
                  <div class="price">
                    <strong>¥{{item.goods_price}}</strong>
                  </div>
                </div>
              </div>
            </van-cell-group>
            <div class='deltext' slot="right" @click='delOne(item.fav_id)'>删除</div>
          </van-cell-swipe>
        </div>

        <div v-else-if='flag === "brand"'>
          <!-- 品牌收藏列表 -->
          <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index'>
            <van-cell-group>
              <div class="brand"  @click='goBrand(item.brand_id, item.brand.brand_name)'>
                <div class='icon' ref='icon' @click.stop='active(index, item.brand_id)' v-show='del'></div>
                <div class="image">
                  <img v-lazy='item.brand.brand_pic'>
                </div>
                <p>{{item.brand.brand_name}}</p>
              </div>
            </van-cell-group>
            <div class='deltext1' slot="right" @click='delOne(item.brand_id)'>删除</div>
          </van-cell-swipe>
        </div>

        <div v-else>
          <!-- 浏览记录列表 -->
          <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index'>
            <van-cell-group>
              <div class="goods"  @click='goProduct(item.goods_id)'>
                <div class='icon' ref='icon' @click.stop='active(index, item.goods_id)' v-show='del'></div>
                <div class="image">
                  <img v-lazy='item.goods_image_url'>
                </div>
                <div class="content">
                  <p>{{item.goods_name}}</p>
                  <span>{{item.goods_unit}}</span>
                  <div class="price">
                    <strong>¥{{item.goods_price}}</strong>
                  </div>
                </div>
              </div>
            </van-cell-group>
            <div class='deltext' slot="right" @click='delOne(item.goods_id)'>删除</div>
          </van-cell-swipe>
        </div>

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
        arr: [],
        activeArr: [],  // 选择的待删除的item  商品存放的是fav_id
        flag: 'goods' // true为商品列表
      }
    },
    created () {
      this.init = [
        {
          url: '/my/collect',
          name: '收藏商品',
          flag: 'goods'
        }, {
          url: '/my/brand',
          name: '关注品牌',
          flag: 'brand'
        }, {
          url: '/my/footmark',
          name: '浏览记录',
          flag: 'footmark'
        }
      ]
      this.api_token = storage.get('api_token')
      // 三个页面写在一起了，这里要根据url来选择不同的渲染
      this.init.forEach(item => {
        if (item.url === this.$route.path) {
          this.title = item.name
          this.flag = item.flag
          this.getData()
        }
      })
    },
    methods: {
      active (idx, id) {
        let index = this.activeArr.indexOf(id)
        if (index === -1) {
          this.$refs.icon[idx].classList.add('active')
          this.activeArr.push(id)
        } else {
          this.activeArr.splice(index, 1)
          this.$refs.icon[idx].classList.remove('active')
        }
      },
      delAll (text) {
        if (text === '编辑') {
          this.text = '删除'
          this.del = true
        } else if (text === '删除') {
          this.del = false
          // 做一层拦截
          if (!this.activeArr.length) {
            this.text = '编辑'
            return
          }
          this._del()
          // 清空active列表
          this.activeArr = []
          this.text = '编辑'
        }
      },
      delOne (id) {
        // 因为单个删除和批量删除实现功能一致了，之前是只能单个删除，后来升级为支持批量删除，造成代码冗余
        // 这里把单个删除的id添加到数组中，然后删除操作调用同一个方法即可。
        // 这里本来有两种方案： 1， 删除方法做三个，然后先判断再选择不同的调用   2，就是不判断，删除操作的时候去判断
        // 第2个方法比较优雅，也就是现在这种，大概就是AOP思想咯？
        this.activeArr.push(id)
        this._del()
      },
      getData () {
        if (this.title === this.init[0].name) {
          this._getCollect()
        } else if (this.title === this.init[1].name) {
          this._getBrand()
        } else {
          this._getFootMark()
        }
      },
      goProduct (id) {
        if (this.del) {
          return
        }
        this.$router.push(`/product/${id}`)
      },
      goBrand (id, name) {
        if (this.del) {
          return
        }
        this.$router.push(`/brandGoodsList?id=${id}&name=${name}`)
      },
      _del () {
        if (this.title === this.init[0].name) {
          this.$http.post('/mobile/?act=member_favorites&op=favorites_del', {
            api_token: this.api_token,
            fav_id: this.activeArr
          }).then(res => {
            this._getCollect()
          })
        } else if (this.title === this.init[1].name) {
          this.$http.post(`/api/brand/cancel_follow?api_token=${this.api_token}`, {
            id: this.activeArr
          }).then(res => {
            if (res.data.status === 200) {
              this._getBrand()
            }
          })
        } else if (this.title === this.init[2].name) {
          this.$http.post(`/mobile/?act=member_goodsbrowse&op=del_browse&api_token=${this.api_token}`, {
            goods_id: this.activeArr
          }).then(res => {
            if (res.data.status === 200) {
              this._getFootMark()
            }
          })
        }
      },
      _getCollect () {
        this.$http.get(`/mobile/?act=member_favorites&op=favorites_list&api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.arr = res.data.data.favorites_list
          }
        })
      },
      _getBrand () {
        this.$http.get(`/api/brand/follow_list?api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.arr = res.data.data
          }
        })
      },
      _getFootMark () {
        this.$http.get(`/mobile/?act=member_goodsbrowse&op=browse_list&api_token=${this.api_token}`).then(res => {
          if (parseInt(res.data.status) === 200) {
            this.arr = res.data.data.goodsbrowse_list
          }
        })
      }
    },
    components: {
      XTitle,
      CellSwipe
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
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
          flex-basis: 81px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .content{
          flex: 1;
          height: 81px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          font-size: @font-size-medium;
          overflow: hidden;
          padding: 4px 15px 10px 0;
          p{
            width: 100%;
            color: #414141;
            height: 16px;
            line-height: 16px;
            font-size: @font-size-medium;
            // font-family: '宋体';
            .no-wrap
          }
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
