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
                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4284663826,1657440413&fm=27&gp=0.jpg">
              </div>
              <div class="content">
                <p>中天特羔羊肉片</p>
                <span>300g装</span>
                <div class="price">
                  <strong>¥29.9</strong>
                </div>
              </div>
            </div>
          </van-cell-group>
          <div class='deltext' slot="right" @click='delOne'>删除</div>
        </van-cell-swipe>

        <van-cell-swipe :right-width="65" v-for='(item, index) of arr' :key='index' v-show='!flag'>
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
      console.log(storage.session.get('token'))
      if (this.$route.path === '/my/collect') {
        this.title = '收藏商品'
      } else if (this.$route.path === '/my/footmark') {
        this.title = '浏览记录'
      } else if (this.$route.path === '/my/brand') {
        this.title = '关注品牌'
        this._getBrand()
      }
    },
    methods: {
      active (idx) {
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
      delOne () {
        alert(1)
      },
      _getBrand () {
        var instance = this.$http.create({
          'headers': {'content-type': 'application/x-www-form-urlencoded'}
        })
        instance.get('/nginx/api/brand/follow_list?api_token=123456').then(res => {
          console.log(res.data.status)
          // if (res.data.status === 200) {
          //   this.arr = res.data.data
          // }
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
