<template>
  <form action="https://gateway.test.95516.com/gateway/api/frontTransReq.do" method='POST'>
    <input type="hidden" name="version" value="5.0.0" />
    <input type="hidden" name="encoding" value="utf-8" />
    <input type="hidden" name="certId" value="40220995861346480087409489142384722381" />
    <input type="hidden" name="txnType" value="01" />
    <input type="hidden" name="txnSubType" value="01" />
    <input type="hidden" name="bizType" value="000201" />
    <input type="hidden" name="frontUrl" :value="frontUrl" />
    <input type="hidden" name="backUrl" :value="backUrl" />
    <input type="hidden" name="signMethod" value="01" />
    <input type="hidden" name="channelType" value="08" />
    <input type="hidden" name="accessType" value="0" />
    <input type="hidden" name="merId" value="777290058153110" />
    <input type="hidden" name="orderId" :value="orderId" />
    <input type="hidden" name="txnTime" :value="txnTime" />
    <input type="hidden" name="txnAmt" :value="txnAmt" />
    <input type="hidden" name="currencyCode" value="156" />
    <input type="hidden" name="defaultPayType" value="0001" />
    <input type="hidden" name="orderDesc" :value="orderDesc" />
    <input type="hidden" name="signature" :value="signature" />
  </form>
</template>
<script>
  export default {
    data () {
      return {
        orderId: '',
        txnTime: '',
        txnAmt: '',
        orderDesc: '',
        signature: '',
        backUrl: '',
        frontUrl: ''
      }
    },
    created () {
      const paySign = this.$route.query.pay_sign
      this.orderId = paySign.orderId
      this.txnTime = paySign.txnTime
      this.txnAmt = paySign.txnAmt
      this.orderDesc = paySign.orderDesc
      this.signature = paySign.signature
      this.backUrl = paySign.backUrl
      this.frontUrl = paySign.frontUrl
    },
    mounted () {
      setTimeout(() => {
        document.forms[0].submit()
      }, 300)
    }
  }
</script>
<style lang="less" scoped>
</style>
