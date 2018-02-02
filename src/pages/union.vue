<template>
  <form :action="paySign.pay_form" method='POST'>
    <input type="hidden" name="version" :value="paySign.version" />
    <input type="hidden" name="encoding" :value="paySign.encoding" />
    <input type="hidden" name="certId" :value="paySign.certId" />
    <input type="hidden" name="txnType" :value="paySign.txnType" />
    <input type="hidden" name="txnSubType" :value="paySign.txnSubType" />
    <input type="hidden" name="bizType" :value="paySign.bizType" />
    <input type="hidden" name="frontUrl" :value="paySign.frontUrl" />
    <input type="hidden" name="backUrl" :value="paySign.backUrl" />
    <input type="hidden" name="signMethod" :value="paySign.signMethod" />
    <input type="hidden" name="channelType" :value="paySign.channelType" />
    <input type="hidden" name="accessType" :value="paySign.accessType" />
    <input type="hidden" name="merId" :value="paySign.merId" />
    <input type="hidden" name="orderId" :value="paySign.orderId" />
    <input type="hidden" name="txnTime" :value="paySign.txnTime" />
    <input type="hidden" name="txnAmt" :value="paySign.txnAmt" />
    <input type="hidden" name="currencyCode" :value="paySign.currencyCode" />
    <input type="hidden" name="defaultPayType" :value="paySign.defaultPayType" />
    <input type="hidden" name="orderDesc" :value="paySign.orderDesc" />
    <input type="hidden" name="signature" :value="paySign.signature" />
  </form>
</template>
<script>
  export default {
    data () {
      return {
        paySign: ''
      }
    },
    created () {
      this.paySign = this.$route.query.pay_sign
    },
    mounted () {
      setTimeout(() => {
        document.forms[0].submit()
      }, 300)
    }
  }
</script>
