<template>
  <div class="container">
    <x-title>评价</x-title>
    <div class="main">
      <div class="goodsWrapper" :class='{"vux-1px-t": index > 0}' v-for='(goods, index) of goodsBox'>
        <div class="goods">
          <div class="left">
            <img v-lazy="goods.image_60_url">
          </div>
          <div class="right">
            <p class='name'>{{ goods.goods_name }}</p>
            <div class="score">星级</div>
            <rater v-model='values[goods.goods_id]' :font-size='20'></rater>
          </div>
        </div>
        <div class="content">
          <textarea v-model='contents[goods.goods_id]' placeholder='评价商品' maxlength='200'></textarea>
        </div>
        <div class="uploader-container" @click='active(goods.goods_id)' :id='goods.goods_id'>
          <div class="box" v-for='(n, index) of 3' @click='nums(index)'>
            <div class="img" v-if='imgs[goods.goods_id] && imgs[goods.goods_id][index]'>
              <img class='pic' :src='imgs[goods.goods_id][index]'>
              <img src="../../../assets/my/close.png" class='close' @click='close(index, goods.goods_id)'>
            </div>
            <van-uploader class='upload_item' :after-read="logContent" v-else>
              <img v-lazy="url">
            </van-uploader>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <button @click='submit'>确认</button>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Rater } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        url: require('../../../assets/my/uploadicon.png'),
        goodsBox: [],
        values: {},
        contents: {},
        imgs: {},
        activeId: 0,  // 维护点击的是哪一个商品
        num: 0   // 维护点击的是哪一个图片
      }
    },
    created () {
      this.id = this.$route.query.id | 0
      this.api_token = storage.get('api_token')
      this._getOrder()
    },
    methods: {
      logContent (file) {
        if (!this.imgs[this.activeId]) {
          // 添加setter
          this.$set(this.imgs, this.activeId, [file.content])
        } else {
          if (this.imgs[this.activeId][this.num]) {
            this.imgs[this.activeId].splice(this.num, 1, file.content)
          } else {
            this.imgs[this.activeId].splice(this.num, 0, file.content)
          }
        }
      },
      close (idx, id) {
        if (!this.imgs[id] || !this.imgs[id][idx]) {
          return
        }
        this.imgs[id].splice(idx, 1)
      },
      active (id) {
        this.activeId = id
      },
      nums (id) {
        this.num = id
      },
      submit () {
        let params = {}
        this.goodsBox.forEach(item => {
          if (this.values[item.goods_id]) {
            params[`goods[${item.goods_id}][score]`] = this.values[item.goods_id]
          }
          if (this.contents[item.goods_id]) {
            params[`goods[${item.goods_id}][comment]`] = this.contents[item.goods_id]
          }
          if (this.imgs[item.goods_id]) {
            params[`goods[${item.goods_id}][eval_pic]`] = this.imgs[item.goods_id]
          }
        })
        const x = Object.assign(params, {
          order_id: this.order_id
        })
        this.$http.post(`/mobile/?act=member_evaluate&op=add_evaluate&api_token=${this.api_token}`, x).then(res => {
          if (res.data.status === 200) {
            this.$router.replace('/my/order')
          }
        })
      },
      _getOrder () {
        this.$http.get(`/mobile/?act=member_order&op=order_info&api_token=${this.api_token}&order_id=${this.id}`).then(res => {
          if (res.data.status === 200) {
            this.goodsBox = res.data.data.order_info.goods_list
            this.order_id = res.data.data.order_info.order_id
          }
        })
      }
    },
    components: {
      XTitle,
      Rater
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
    padding-bottom: 110px;
    .main{
      padding: 0 15px;
      .goodsWrapper{
        width: 100%;
        padding-top: 10px;
        padding-bottom: 15px;
        .goods{
          display: flex;
          flex-flow: row nowrap;
          .left{
            width: 82px;
            margin-right: 6px;
            img{
              width: 82px;
              height: 82px;
            }
          }
          .right{
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            padding: 6px 0;
            font-size: @font-size-medium;
            .score{
              font-weight: bold;
            }
          }
        }
        .content{
          width: 100%;
          margin-top: 10px;
          textarea{
            width: 100%;
            resize: none;
            border: 0;
            background: #f4f4f4;
            padding: 10px;
            height: 135px;
          }
        }
        .uploader-container{
          margin-top: 10px;
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          position: relative;
          .box{
            position: relative;
            .close{
              position: absolute;
              right: 0;
              top: 0;
              transform: translate3d(40%, -40%, 0);
              width: 20px;
              height: 20px;
            }
            &~.box{
              margin-left: 10px;
            }
          }
          img{
            width: 82px;
            height: 82px;
          }
        }
      }
    }
    .btn{
      position: absolute;
      bottom: 50px;
      left: 0;
      width: 100%;
      padding: 0 10px;
      text-align: center;
      button{
        width: 95%;
        height: 49px;
        color: #fff;
        background: @color;
        letter-spacing: 4px;
        text-align: center;
        line-height: 49px;
        border: 0;
      }
    }
  }
</style>
