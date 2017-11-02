<template>
  <div class="container">
    <x-title>评价列表</x-title>
    <div class="wrapper">
      <rate-item></rate-item>
    </div>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import RateItem from '@/components/rate_item/rate_item'
  export default {
    data () {
      return {
      }
    },
    components: {
      XTitle,
      RateItem
    }
  }
</script>
<style lang="less" scoped>
  .container{
    width: 100vw;
    .wrapper{
      width: 100%;
      padding: 0 15px;
    }
  }
</style>
