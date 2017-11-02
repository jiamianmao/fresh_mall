<template>
  <transition name='slide'>
    <div class="container">
      <x-title>添加收货地址</x-title>
      <div class="main">
        <div class='item vux-1px-b'>
          <div class="left">收货人</div>
          <div class="right"><input type="text" v-model='name' placeholder='收货人姓名'></div>
        </div>
        <div class='item vux-1px-b'>
          <div class="left">手机号码</div>
          <div class="right"><input type="tel" v-model='tel' placeholder='11位手机号' maxlength="11"></div>
        </div>
        <div class='item vux-1px-b'>
          <div class="left">收货人</div>
          <div class="right area">
            <input type="text" v-model='address1' placeholder='省市地区选项' @click='selectArea'>
            <x-address style="display:none;" title="" v-model="address" :list="addressData" placeholder="请选择地址" :show.sync="showAddress"></x-address>
          </div>
          <x-icon type="ios-arrow-right" size="24"></x-icon>
        </div>
        <div class='item vux-1px-b'>
          <div class="left">详细地址</div>
          <div class="right desc">
            <input type="text" placeholder='街道门牌信息' v-model='desc'>
          </div>
        </div>
      </div>
      <button @click='submit'>确定</button>
      <alert v-model="show" title="请核对信息">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { XAddress, ChinaAddressV4Data, XButton, Value2nameFilter as value2name, Alert } from 'vux'
  export default {
    data () {
      return {
        addressData: ChinaAddressV4Data,
        address: [],
        address1: '',
        showAddress: false,
        name: '',
        tel: '',
        desc: '',
        show: false,
        msg: '信息输入有误'
      }
    },
    methods: {
      selectArea () {
        this.showAddress = true
      },
      getName (value) {
        this.address1 = value2name(value, ChinaAddressV4Data)
      },
      submit () {
        let regName = /\D{1,}/
        let regTel = /^1[34578]{1}\d{9}$/
        if (!this.name.trim()) {
          console.log(1)
          this.msg = '请输入收货人姓名'
          this.show = true
          return
        } else if (!regName.test(this.name.trim())) {
          console.log(1)
          this.msg = '请正确输入您的姓名'
          this.show = true
          return
        }
        if (!regTel.test(this.tel.trim()) || !this.name.trim()) {
          console.log(2)
          this.msg = '手机号码为11位数字'
          this.show = true
          return
        }
        if (!this.address1) {
          console.log(3)
          this.msg = '请选择省市区'
          this.show = true
          return
        }
        if (!this.desc) {
          console.log(4)
          this.msg = '请输入您的详细地址'
          this.show = true
          return
        }
        if (regName.test(this.name.trim()) && regTel.test(this.tel.trim()) && this.address && this.desc) {
          console.log(this.name)
          console.log(this.tel)
          console.log(this.address1)
          console.log(this.desc)
        }
      }
    },
    watch: {
      address (value) {
        this.getName(value)
      }
    },
    components: {
      XTitle,
      XAddress,
      XButton,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 9;
    .main{
      padding-left: 15px;
      .item{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        position: relative;
        font-size: @font-size-medium;
        .left{
          width: 65px;
          min-height: 49px;
          line-height: 49px;
        }
        .right{
          padding-right: 15px;
          flex: 1;
          input{
            border: 0;
            padding-left: 14px;
            width: 100%;
          }
          .vux-cell-box:before{
            border-top: 0;
          }
        }
        .desc{
          input{
          }
        }
        .vux-x-icon {
          position: absolute;
          right: 10px;
          fill: #999;
        }
      }
    }
    button{
      width: 85%;
      height: 50px;
      color: #fff;
      letter-spacing: 6px;
      border: 0;
      margin: 20px auto 0;
      display: block;
      background: @color;
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
