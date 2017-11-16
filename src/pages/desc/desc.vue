<template>
  <div class="container">
    <x-title>{{title}}</x-title>
    <main>
      <h3 class="name">{{name}}</h3>
      <div class="text">
        <p v-html='desc'></p>
        <!-- 终于碰到了sticky-footer的使用场景 wrapper设置min-height top设置flex:1 bottom设置flex: 0 -->
        <img src="../../assets/product/icon.png">
      </div>
    </main>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  export default {
    // 不做成子组件形式，因为父组件是个product组件，该组件是企业名片，不合逻辑。
    // props: {
    //   title: {
    //     type: String,
    //     default: '默认值'
    //   },
    //   name: {
    //     type: String,
    //     default: '默认值'
    //   }
    // },
    data () {
      return {
        title: '',
        name: '',
        desc: ''
      }
    },
    created () {
      let init = [
        {
          title: '企业名片',
          name: '企业故事'
        }, {
          title: '快速加入品牌',
          name: '快速加入品牌'
        }
      ]
      this.title = this.$route.query.title
      init.forEach(item => {
        if (item.title === this.title) {
          this.name = item.name
        }
      })
      this._getDesc(this.$route.query.id)
    },
    methods: {
      _getDesc (id) {
        this.$http.get(`/mobile/?act=goods&op=store_card&store_id=3`).then(res => {
          if (res.data.status === 200) {
            this.desc = res.data.data
          }
        })
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  main{
    width: 100vw;
    min-height: calc(~"100vh - 50px");
    padding: 15px 12px 0 12px;
    .name{
      position: relative;
      padding-left: 18px;
      height: 20px;
      line-height: 20px;
      letter-spacing: 1px;
      font-size: @font-size-large;
      &:before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 7px;
        background: @color;
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
</style>
