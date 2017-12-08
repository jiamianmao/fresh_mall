<template>
  <div class="container">
    <x-title>{{title}}</x-title>
    <main>
      <h3 class="name">{{name}}</h3>
      <div class="text">
        <video v-if='src' :src="src" controls></video>
        <p v-html='desc'></p>
        <p style='display: none;' ref='descText'></p>
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
        desc: '',
        src: ''
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
      this.id = this.$route.query.id
      let flag
      init.forEach(item => {
        if (item.title === this.title) {
          flag = true
          this.name = item.name
          this._getDesc(this.id)
        }
      })
      if (!flag) {
        this._getEnsure(this.id)
      }
    },
    methods: {
      _getDesc (id) {
        this.$http.get(`/mobile/?act=goods&op=store_card&store_id=${id}`).then(res => {
          if (res.data.status === 200) {
            // 因为是 转义后的带标签的 所以要双解析 只用v-html只会把标签转义 不会解析
            this.$refs.descText.innerHTML = res.data.data
            this.desc = this.$refs.descText.innerText
          }
        })
      },
      _getEnsure (id) {
        this.$http.get(`/api/goods_video/detail?id=${id}`).then(res => {
          if (res.data.status === 200) {
            let data = res.data.data
            this.$refs.descText.innerHTML = data.content
            this.desc = this.$refs.descText.innerText
            this.name = data.title
            this.src = data.src
          }
        })
      }
    },
    filters: {
      // unescape:function (html) {
      //   return html
      //     .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      //     .replace(/&lt;/g, '<')
      //     .replace(/&gt;/g, '>')
      //     .replace(/&quot;/g, '\')
      //     .replace(/&#39;/g, '\')
      // }
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
    video{
      margin-top: 20px;
      width: 100%;
      height: 0;
      padding-top: 56.25%;
    }
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
