<template>
  <div class='container'>
    <x-title>定位</x-title>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    z-index: 1;
  }
</style>
