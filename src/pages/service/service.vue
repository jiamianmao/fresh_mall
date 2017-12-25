<template>
  <transition name='slide'>
    <div class="container">
      <x-title>{{title}}</x-title>
      <div class="head" v-if='telFlag'>
        <div class='vux-1px-r'>
          <img src="../../assets/service/refund.png">
          <p>支持售后退款</p>
        </div>
        <div>
          <img src="../../assets/service/bu.png">
          <p>不支持补发货</p>
        </div>
      </div>
      <main>
        <div class="text">
          <p v-html='desc'></p>
        </div>
        <div v-show='telFlag' class="btn">
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
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import Confirms from '@/components/confirm/confirm'
  export default {
    data () {
      return {
        tel: '',
        title: '',
        telFlag: false,
        desc: ''
      }
    },
    created () {
      this.type = this.$route.query.type
      if (this.type === 'service_help') {
        this.telFlag = true
        this._getTel()
      }
      this._getTypeDesc(this.type)
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
      },
      _getTypeDesc (type) {
        this.$http.get(`/mobile/?act=document&op=get_doc&doc_code=${type}`).then(res => {
          let data = res.data.data
          this.desc = data.doc_content
          this.title = data.doc_title
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
    z-index: 50;
    padding-bottom: 50px;
    .head{
      height: 55px;
      width: 100vw;
      padding: 9px 0;
      display: flex;
      flex-flow: row nowrap;
      background: #fff;
      div{
        width: 50%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        img{
          width: 27px;
          height: 21px;
        }
        p{
          margin-top: 5px;
          font-size: @font-size-small;
          color: #5c5c5c;
        }
      }
    }
    main{
      width: 100%;
      min-height: calc(~"100vh - 100px");
      display: flex;
      position: relative;
      padding: 15px 12px 50px 12px;
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
      .text{
        width: 100%;
        min-height: calc(~"100vh - 85px");
        text-align: center;
        display: flex;
        flex-flow: column nowrap;
        p{
          margin: 14px 0 19px 0;
          line-height: 28px;
          color: #666;
          text-align: left;
          flex: 1;
        }
        img{
          width: 100%;
          flex: 0;
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
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
