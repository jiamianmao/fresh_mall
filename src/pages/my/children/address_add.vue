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
          <div class="left">收货地址</div>
          <div class="right area">
            <input type="text" class='ipt' v-model='address1' placeholder='省市地区选项' @click='selectArea'>
            <x-address style='display: none;' title="" v-model="address" :list="addressData" placeholder="请选择地址" :show.sync="showAddress"></x-address>
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
  import Storage from 'good-storage'
  import $ from 'jquery'
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
        msg: '信息输入有误',
        city_id: 0,
        area_id: 0
      }
    },
    created () {
      this.api_token = Storage.get('api_token')
      this.id = this.$route.query.id
      this.is_default = this.$route.query.status
      // this.flag = true
      if (this.id) {
        this.$http.post(`/mobile/?act=member_address&op=address_info&api_token=${this.api_token}`, {
          address_id: this.id
        }).then(res => {
          if (res.data.status === 200) {
            // this.flag = false
            let info = res.data.data.address_info
            this.address1 = info.area_info
            this.name = info.true_name
            this.tel = info.tel_phone
            this.city_id = parseInt(info.city_id)
            this.area_id = parseInt(info.area_id)
            this.desc = info.address
          }
        })
      }
    },
    methods: {
      selectArea () {
        // 防止唤起输入框
        $('.ipt').blur()
        this.showAddress = true
      },
      getName (value) {
        this.address1 = value2name(value, ChinaAddressV4Data)
      },
      submit () {
        // 表单校验
        // 名字校验: 1，非空值。 2，非数字1位以上
        let regName = /\D{1,}/
        let regTel = /^1[34578]{1}\d{9}$/
        if (!this.name.trim()) {
          this.msg = '请输入收货人姓名'
          this.show = true
          return
        } else if (!regName.test(this.name.trim())) {
          this.msg = '请正确输入您的姓名'
          this.show = true
          return
        }
        // 11位数字 这里简单实现，13x 14x 15x 17x 18x 号码段
        if (!regTel.test(this.tel.trim())) {
          this.msg = '请正确输入手机号码'
          this.show = true
          return
        }
        if (!this.address1) {
          this.msg = '请选择省市区'
          this.show = true
          return
        }
        if (!this.desc) {
          this.msg = '请输入您的详细地址'
          this.show = true
          return
        }
        // 这里不需要判断了
        // if (regName.test(this.name.trim()) && regTel.test(this.tel.trim()) && this.address && this.desc) {
        // }
        if (this.id) {
          // 修改地址
          this.$http.post(`/mobile/?act=member_address&op=address_edit&api_token=${this.api_token}`, {
            true_name: this.name,
            area_info: this.address1,
            address: this.desc,
            tel_phone: this.tel,
            area_id: this.area_id,
            city_id: this.city_id,
            is_default: this.is_default,
            address_id: this.id
          }).then(res => {
            if (res.data.status === 200) {
              this.$router.go(-1)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          // 添加地址
          this.$http.post(`/mobile/?act=member_address&op=address_add&api_token=${this.api_token}`, {
            true_name: this.name,
            area_info: this.address1,
            address: this.desc,
            tel_phone: this.tel,
            area_id: this.area_id,
            city_id: this.city_id,
            is_default: 0
          }).then(res => {
            if (res.data.status === 200) {
              this.$router.go(-1)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    watch: {
      // 用的vux 初始得到的地区id 然后拿到对应的真实地区
      address (value) {
        // console.log(1)
        // if (!this.flag) {
        //   this.flag = true
        //   return
        // }
        this.getName(value)
      },
      // 拿到真实地区后 来换取后端需要的地区id  麻烦不？？？？？
      address1 (newVal) {
        // 用来防止修改地址的时候，会触发address1的改变，会报错
        // if (!this.flag) {
        //   this.flag = true
        //   return
        // }
        let arr = newVal.split(' ')
        this.$http.get('/api/area/area').then(res => {
          let json = res.data
          let one = json.find(item => {
            return arr[0].indexOf(item.area_name) !== -1
          })
          let two
          if (one.sub.length === 1) {
            two = one.sub[0]
          } else {
            two = one.sub.find(item => {
              return arr[1] === item.area_name
            })
          }
          this.city_id = two.area_id
          let three = two.sub.find(item => {
            return arr[2] === item.area_name
          })
          this.area_id = three.area_id
        })
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
          top: 10px;
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
