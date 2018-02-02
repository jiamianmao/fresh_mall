<template>
  <div class="wrapper vux-1px-b" ref='wrapper'>
    <slot></slot><span class='save' v-show='text' @click='toClick(text)'>{{text}}</span>
  </div>
</template>
<script>
  export default {
    props: {
      bottom: {
        type: Boolean,
        default: true
      },
      text: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
      }
    },
    methods: {
      toClick (text) {
        this.$emit('rightClick', text)
      }
    },
    mounted () {
      if (!this.bottom) {
        this.$refs.wrapper.classList.remove('vux-1px-b')
      }
    }
  }
</script>
<style lang="less" scoped>
  .wrapper{
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333;
    background: #fff;
    width: 100vw;
    position: relative;
    .save{
      position: absolute;
      right: 15px;
    }
  }
</style>
