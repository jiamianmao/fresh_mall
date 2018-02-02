<template>
  <div class="container">
    <x-title>留言</x-title>
    <div class="area">
      <textarea placeholder='添加留言' tel='message' maxlength='200'></textarea>
    </div>
    <button>确认</button>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    data () {
      return {
        message: ''
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    text-align: center;
    .area{
      height: 180px;
      // margin-top: 20px;
      padding: 15px;
      textarea{
        padding: 10px;
        width: 100%;
        height: 100%;
        resize: none;
        font-size: @font-size-medium;
        line-height: 20px;
      }
    }
    button{
      margin-top: 20px;
      width: 85%;
      background: @color;
      color: #fff;
      letter-spacing: 8px;
      height: 50px;
      line-height: 50px;
      border: 0;
    }
  }
</style>
