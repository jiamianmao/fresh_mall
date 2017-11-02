<template>
  <div class="wrapper vux-1px-b" ref='wrapper'>
    <slot></slot><span class='save' v-show='save' @click='toSave'>保存</span>
  </div>
</template>
<script>
  export default {
    props: {
      bottom: {
        type: Boolean,
        default: true
      },
      save: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    methods: {
      toSave () {
        this.$emit('save')
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
