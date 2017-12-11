<template>
  <div class="container">
    <x-title>客服与帮助</x-title>
    <main>
      <p>一些内容.....</p>
      <div class="btn">
        <button @click='serviceTel'>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tel"></use>
          </svg>
          {{ tel }}
        </button>
      </div>
    </main>
    <Confirms :text='tel' ref='confirm' confirmBtnText='拨打' title='联系平台客服'></Confirms>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Confirms from '@/components/confirm/confirm'
  export default {
    data () {
      return {
        tel: ''
      }
    },
    created () {
      this._getTel()
    },
    methods: {
      serviceTel () {
        this.$refs.confirm.show()
      },
      _getTel () {
        this.$http.get('/mobile/?act=index&op=get_site_tel').then(res => {
          if (res.data.status === 200) {
            this.tel = res.data.data.value
          }
        })
      }
    },
    components: {
      XTitle,
      Confirms
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
    min-height: 100vh;
    background: #f4f4f4;
    z-index: 1;
    padding-bottom: 50px;
    main{
      width: 100%;
      min-height: calc(~"100vh - 100px");
      display: flex;
      position: relative;
      .btn{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        text-align: center;
        button{
          width: 85.333%;
          height: 50px;
          background: @color;
          border: 0;
          color: #fff;
          letter-spacing: 1px;
          text-align: center;
          line-height: 50px;
        }
      }
    }
    .icon {
      width: 1.5em; height: 1.5em;
      vertical-align: -0.35em;
      fill: currentColor;
      overflow: hidden;
    }
  }
</style>
