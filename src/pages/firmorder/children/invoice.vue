<template>
  <transition name='slide'>
    <div class='invoice_wrapper' @touchmove.prevent>
      <x-title>确认订单</x-title>
      <div class="main">
        <div class="type vux-1px-b">
          <p class='top'>发票类型</p>
          <p @click='selectInvoice' class='allType'>
            <span :class='{"active": invoice === 1}' data-id='1'>纸质发票</span>
            <span :class='{"active": invoice === 2}' data-id='2'>电子发票</span>
            <span :class='{"active": invoice === 3}' data-id='3'>不要发票</span>
          </p>
        </div>
        <div class="email vux-1px-b" v-show='invoice === 2'>
          <div class="left">
            请输入您的邮箱
          </div>
          <div class="right">
            <input type="text" placeholder='您的邮箱地址' v-model='email'>
          </div>
        </div>
        <div class="invoice_title" v-show='invoice < 3'>
          <p class='top'>发票抬头</p>
          <p>
            <span class='s1' @click='selectTitle'>
              <img src="../../../assets/selectAdd/select.png" v-if='person === 2'>
              <img src="../../../assets/selectAdd/selected.png" v-else>
              个人
            </span>
            <span class='s2' @click='selectTitle'>
              <img src="../../../assets/selectAdd/select.png" v-if='person === 1'>
              <img src="../../../assets/selectAdd/selected.png" v-else>
              单位
            </span>
          </p>
        </div>
        <div class="info_box" v-show='person === 2 && invoice < 3'>
          <div class="company_name">
            <input type="text" v-model='company_name' placeholder='请输入单位名称'>
          </div>
          <div class="num">
            <input type="text" v-model='tax_num' placeholder='请输入统一社会信用代码'>
          </div>
        </div>

        <div class="info_box">
          <div class="info vux-1px-b">发票信息</div>
          <div class="desc">
            <p>明细</p>
          </div>
        </div>
      </div>
      <button @click='submit'>确定</button>
      <alert v-model="show" title="提示">{{msg}}</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { Invoice } from '../../../common/config/config.js'
  import { Alert } from 'vux'
  import { mapMutations, mapGetters } from 'vuex'
  export default {
    data () {
      return {
        email: '',
        person: Invoice.person,  // 1个人 2企业
        company_name: '',
        tax_num: '',
        show: false,
        msg: '',
        invoice: Invoice.paper  // 1代表纸质，2代表电子 3代表不要发票
      }
    },
    created () {
      Object.assign(this, this.invoiceVuex)
      this.person = Invoice.person
    },
    methods: {
      selectInvoice (e) {
        this.invoice = ~~e.target.dataset.id
      },
      selectTitle (e) {
        if (e.currentTarget.getAttribute('class') === 's1') {
          this.person = Invoice.person
        } else {
          this.person = Invoice.company
        }
      },
      submit () {
        let data
        let re = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        // 个人
        if (this.invoice === 3) {
          let data = {
            invoice: 3,
            person: 3
          }
          this.set_invoice(data)
          this.$router.go(-1)
          return
        }
        if (this.person === Invoice.person) {
          // 如果是电子发票 就加一层拦截
          if (this.invoice === Invoice.elec) {
            if (!re.test(this.email)) {
              this.show = true
              this.msg = '请完善信息'
              return
            } else {
              data = {
                invoice: this.invoice,
                person: Invoice.person,
                email: this.email
              }
            }
          } else {
            data = {
              invoice: this.invoice,
              person: Invoice.person
            }
          }
        } else {
          // 单位
          // 电子
          if (this.invoice === Invoice.elec) {
            if (!re.test(this.email) || !this.company_name || !this.tax_num) {
              this.show = true
              this.msg = '请完善信息'
              return
            } else {
              data = {
                invoice: this.invoice,
                email: this.email,
                person: Invoice.company,
                company_name: this.company_name,
                tax_num: this.tax_num
              }
            }
          } else {
            if (!this.company_name || !this.tax_num) {
              this.show = true
              this.msg = '请完善信息'
              return
            } else {
              data = {
                invoice: this.invoice,
                person: Invoice.company,
                company_name: this.company_name,
                tax_num: this.tax_num
              }
            }
          }
        }
        this.set_invoice(data)
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      },
      ...mapMutations({
        'set_invoice': 'SET_INVOICE'
      })
    },
    computed: {
      ...mapGetters({
        'invoiceVuex': 'invoice'
      })
    },
    components: {
      XTitle,
      Alert
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
    z-index: 5;
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
          &:nth-child(2){
           margin: 0 10px; 
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
        .info, .desc{
          width: 100%;
          height: 45px;
          line-height: 45px;
        }
        .company_name, .num{
          input{
            width: 100%;
            height: 45px;
            // caret-color: red;
            // -webkit-user-select: auto;
          }
        }
        .num{
          margin: 10px 0 20px 0;
        }
        .company_name, .num{
          padding-right: 15px;
          input{
            width: 100%;
            background: #F4F4F4;
            // text-align: left;
            border: 0;
            padding-left: 10px;
          }
          input::-webkit-input-placeholder{
            color: @color;
          }
        }
      }
      .desc{
        color: #666;
        font-size: @font-size-small;
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
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
