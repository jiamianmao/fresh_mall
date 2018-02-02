<template>
  <div class='placeholder' :style='{backgroundColor: color, height: height + "px"}'></div>
</template>
<script>
  export default {
    props: {
      color: {
        type: String,
        default: '#f4f4f4'
      },
      height: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="less" scoped>
  .placeholder{
    width: 100%;
  }
</style>
