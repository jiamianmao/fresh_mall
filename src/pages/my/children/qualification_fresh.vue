<template>
  <transition name='slide1'>
    <div class='fresh' @touchmove.prevent>
      <x-title :text='text' @rightClick='save'>生鲜储存资质</x-title>
      <main>
        <div class="title">门店资质</div>
        <div class="area">
          <textarea :placeholder='placeholder' maxlength='200' v-model='store_condition'></textarea>
        </div>
        <div class="wrapper">
          <div class="uploader-container">
            <div class="box">
              <div class="img" v-if='img1'>
                <img ref='img1'>
                <img src="../../../assets/my/close.png" class='close' @click='close(1)'>
              </div>
              <van-uploader class='upload_item' :after-read="logContent1" v-else>
                <img :src="url">
              </van-uploader>
            </div>
            <div class="box">
              <div class="img" v-if='img2'>
                <img ref='img2'>
                <img src="../../../assets/my/close.png" class='close' @click='close(2)'>
              </div>
              <van-uploader class='upload_item' :after-read="logContent2" v-else>
                <img :src="url">
              </van-uploader>
            </div>
          </div>
        </div>
      </main>
      <alert v-model="show" title="请核对信息">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { mapActions, mapGetters } from 'vuex'
  import { Alert } from 'vux'
  export default {
    data () {
      return {
        placeholder: '请具体介绍门店的存储设备、可为平台业务提供的设备容量、设备温度区间等',
        store_condition: '',
        url: require('../../../assets/my/uploadicon.png'),
        img1: false,
        img2: false,
        text: '保存',
        store_condition_pic: [],
        show: false,
        msg: ''
      }
    },
    created () {
      this.store_condition = this.textInfo
      this.store_condition_pic = this.imageInfo
    },
    mounted () {
      if (this.store_condition_pic[0]) {
        this.img1 = true
        this.$nextTick(() => {
          this.$refs.img1.setAttribute('src', this.store_condition_pic[0])
        })
      } else if (this.store_condition_pic[1]) {
        this.img2 = true
        this.$nextTick(() => {
          this.$refs.img2.setAttribute('src', this.store_condition_pic[1])
        })
      }
    },
    components: {
      XTitle,
      Alert
    },
    methods: {
      logContent1 (file) {
        this.img1 = true
        this.store_condition_pic.unshift(file.content)
        this.$nextTick(() => {
          this.$refs.img1.setAttribute('src', file.content)
        })
      },
      logContent2 (file) {
        this.img2 = true
        this.store_condition_pic.push(file.content)
        this.$nextTick(() => {
          this.$refs.img2.setAttribute('src', file.content)
        })
      },
      close (n) {
        if (n === 1) {
          this.store_condition_pic.shift()
          this.$refs.img1.setAttribute('src', '')
          this.img1 = false
        } else {
          this.store_condition_pic.pop()
          this.$refs.img2.setAttribute('src', '')
          this.img2 = false
        }
      },
      save () {
        if (!this.store_condition_pic.length || !this.store_condition) {
          this.show = true
          this.msg = '请填写完整信息'
        } else {
          let commitData = {
            storeCondition: this.store_condition,
            storeConditionPic: this.store_condition_pic
          }
          this.fresh(commitData)
          this.$router.go(-1)
        }
      },
      ...mapActions([
        'fresh'
      ])
    },
    computed: {
      ...mapGetters({
        'textInfo': 'storeCondition',
        'imageInfo': 'storeConditionPic'
      })
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .fresh{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    .title{
      height: 50px;
      padding: 0 15px;
      line-height: 50px;
    }
    .area{
      height: 180px;
      textarea{
        padding: 15px 25px 15px 15px;
        width: 100%;
        height: 100%;
        border: 0;
        background: #f4f4f4;
        resize: none;
        font-size: @font-size-medium;
        line-height: 20px;
      }
    }
    .wrapper{
      width: 100%;
      padding: 0 15px;
    }
    .uploader-container{
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      position: relative;
      .box{
        position: relative;
        &~.box{
          margin-left: 10px;
        }
        .close{
          position: absolute;
          right: 0;
          top: 0;
          transform: translate3d(40%, -40%, 0);
          width: 20px;
          height: 20px;
        }
      }
      img{
        width: 82px;
        height: 82px;
      }
      .two{
        margin-left: 10px;
      }
    }
  }
  .slide1-enter-active, .slide1-leave-active{
    transition: all .5s;
  }
  .slide1-enter, .slide1-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
