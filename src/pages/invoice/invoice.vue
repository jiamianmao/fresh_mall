<template>
  <div class='invoice_wrapper' @touchmove.prevent>
    <x-title>确认订单</x-title>
    <div class="main">
      <div class="type vux-1px-b">
        <p class='top'>发票类型</p>
        <p @click='selectInvoice' class='allType'>
          <span>纸质发票</span>
          <span>电子发票</span>
        </p>
      </div>
      <div class="email vux-1px-b">
        <div class="left">
          请输入您的邮箱
        </div>
        <div class="right">
          <input type="text" placeholder='您的邮箱地址' v-model='email'>
        </div>
      </div>
      <div class="invoice_title vux-1px-b">
        <p class='top'>发票抬头</p>
        <p>
          <span class='s1' @click='selectTitle'>
            <img src="../../assets/selectAdd/select.png" v-if='no_select || !select1'>
            <img src="../../assets/selectAdd/selected.png" v-else>
            个人
          </span>
          <span class='s2' @click='selectTitle'>
            <img src="../../assets/selectAdd/select.png" v-if='no_select || select1'>
            <img src="../../assets/selectAdd/selected.png" v-else>
            单位
          </span>
        </p>
      </div>
      <div class="info_box"  v-if='!select1'>
        <div class="info vux-1px-b">发票信息</div>
        <div class="company_name vux-1px-b">
          <p>单位名称</p>
          <div class="right">
            <input type="text" placeholder='请输入单位名称'>
          </div>
        </div>
        <div class="num vux-1px-b">
          <p>纳税人识别号</p>
          <div class="right">
            <input type="text" placeholder='请再次填写纳税人识别号'>
          </div>
        </div>
        <div class="desc">
          <p>明细</p>
        </div>
      </div>
      <div class="info_box"  v-else>
        <div class="info vux-1px-b">发票信息</div>
        <div class="desc">
          <p>明细</p>
        </div>
      </div>
    </div>
    <button>确定</button>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import $ from 'jquery'
  export default {
    data () {
      return {
        email: '',
        no_select: true,
        select1: false
      }
    },
    methods: {
      selectInvoice (e) {
        $('.allType span').removeClass('active')
        $(e.target).addClass('active')
      },
      selectTitle (e) {
        this.no_select = false
        if (e.currentTarget.getAttribute('class') === 's1') {
          this.select1 = true
        } else {
          this.select1 = false
        }
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .invoice_wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: #fff;
    .main{
      font-size: @font-size-medium;
      width: 100vw;
      .type{
        height: 88px;
        padding: 0 15px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        .top{
          margin-bottom: 15px;
        }
        span{
          color: #333;
          height: 28px;
          width: 78px;
          display: inline-block;
          border-radius: 4px;
          border: 1px solid #333;
          line-height: 28px;
          text-align: center;
          &:first-child{
           margin-right: 10px; 
          }
          &.active{
            border: 1px solid @color;
            color: @color;
          }
        }
      }
      .email{
        height: 50px;
        padding: 0 15px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .left{
          width: 40%;
        }
        .right{
          width: 60%;
          input{
            width: 100%;
            text-align: right;
            border: 0;
          }
        }
      }
      .invoice_title{
        height: 74px;
        width: 100%;
        padding: 0 15px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        .top{
          margin-bottom: 15px;
        }
        span{
          color: #333;
          height: 28px;
          width: 78px;
          display: inline-block;
          img{
            height: 16px;
            width: 16px;
            vertical-align: -.25em;
            margin-right: 6px;
          }
          &:first-child{
           margin-right: 10px; 
          }
        }
      }
      .info_box{
        width: 100vw;
        padding-left: 15px;
        .info, .company_name, .num, .desc{
          width: 100%;
          height: 45px;
          line-height: 45px;
        }
        .company_name, .num{
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          padding-right: 15px;
          p{
            width: 40%;
          }
          .right{
            width: 60%;
            input{
              width: 100%;
              text-align: right;
              border: 0;
            }
          }
        }
      }
    }
    button{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 50px;
      line-height: 50px;
      border: 0;
      background: @color;
      color: #fff;
      letter-spacing: 12px;
    }
  }
</style>
