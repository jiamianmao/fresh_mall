<template>
  <div class='container'>
    <div class='left'>
      <slot name='left'></slot>
    </div>
    <div class='right'>
      <slot name='right'></slot>
      <x-icon type="ios-arrow-right" size="20" class='icon-right'></x-icon>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
<style lang="less" scoped>
  .container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .right{
      color: #999;
      .vux-x-icon{
        vertical-align: -5px;
        fill: currentColor;
      }
    }
  }
</style>
