<template>
  <div class="container">
    <x-title>注册</x-title>
    <main>
      <div class="btn">
        <button @click='personal'>个人用户注册 <span>(消费者)</span></button>
        <button @click='company'>企业用户注册 <span>(经销商)</span></button>
      </div>
      <p>提示：企业用户注册后可以浏览产品，如需购买，请先到“我的－资 质认证”完善企业用户信息</p>
      <div class="desc">
        <h3>成为企业用户的权利和义务:</h3>
        <ul>
          <li>企业用户可享受低价采购商品</li>
          <li>平台部分产品可以享受跨品牌同物流配送，物流价更低</li>
          <li>成为平台的在售门店或/和自提门店可享受平台的引流服务</li>
          <li>成为平台自提门店可获得代收收益</li>
        </ul>
      </div>
    </main>
    <alert v-model="show" title="提示">暂未开放，请耐心等待!</alert>
    <router-view></router-view>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Alert } from 'vux'
  export default {
    name: 'signup',
    data () {
      return {
        show: false
      }
    },
    methods: {
      personal () {
        this.$router.push('/signup/personal')
      },
      company () {
        // this.show = true
        this.$router.push('/signup/company')
      }
    },
    components: {
      XTitle,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    height: 100vh;
    main{
      width: 100%;
      padding: 0 28px;
      .btn{
        width: 100%;
        margin-top: 3px;
        button{
          width: 100%;
          height: 8.30564784vh;
          color: #fff;
          background: @color;
          border: 0;
          letter-spacing: 4px;
          text-align: center;
          line-height: 8.30564784vh;
          margin-top: 11.6279vh;
          span{
            letter-spacing: 0;
          }
        }
      }
      p{
        margin: 5.814vh 0;
        font-size: @font-size-small;
        color: #999;
        line-height: 18px;
      }
      .desc{
        h3{
          font-size: @font-size-medium;
          margin-bottom: 20px;
        }
        li{
          font-size: @font-size-small;
          color: #333;
          line-height: 28px;
          padding-left: 1em;
          position: relative;
          &:before{
            display: block;
            content: '';
            position: absolute;
            left: 0;
            top: 10px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: @color;
          }
        }
      }
    }
  }
</style>
