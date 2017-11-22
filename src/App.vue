<template>
  <div id="app">
    <router-view></router-view>
    <tab></tab>
  </div>
</template>

<script>
import Tab from '@/components/tab/tab'
export default {
  data () {
    return {}
  },
  components: {
    Tab
  }
}
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
  #app{
    // padding-bottom: 50px;
    // box-sizing: border-box;
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: all .5s;
	}
	.router-fade-enter, .router-fade-leave-to {
    opacity: 0;
	}
</style>
