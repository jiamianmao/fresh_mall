<template>
  <div class="container">
    <x-title>{{title}}</x-title>
    <main>
      <!-- <h3 class="name" v-show='flag'>{{name}}</h3> -->
      <div class="text">
        <iframe v-if='src' frameborder="0" :src="src" allowfullscreen></iframe>
        <div v-html='desc'></div>
        <p style='display: none;' ref='descText'></p>
        <!-- 终于碰到了sticky-footer的使用场景 wrapper设置min-height top设置flex:1 bottom设置flex: 0 -->
        <!-- <img v-show='imgFlag' src="../../assets/product/icon.jpg"> -->
      </div>
    </main>
  </div>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import storage from 'good-storage'
  import $ from 'jquery'
  export default {
    data () {
      return {
        title: '',
        name: '',
        desc: '',
        src: '',
        imgFlag: false,
        flag: true
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
      this.api_token = storage.get('api_token')
      this.adv_id = this.$route.query.adv_id
      let flag
      init.forEach(item => {
        if (item.title === this.title) {
          flag = true
          this.name = item.name
          this.imgFlag = true
          this._getDesc(this.id)
        }
      })
      if (!flag) {
        if (this.title === '图文查看') {
          this._getImgText(this.id)
        } else if (this.title === '平台规则') {
          this._getPt()
        } else if (this.title === '保证金制度') {
          this._getDeposit()
        } else if (this.title === '申请成为线下门店') {
          this._getOffline()
        } else if (!this.title && this.adv_id) {
          this._getBannerRule()
        } else {
          this._getEnsure(this.id)
        }
      }
    },
    updated () {
      this.$nextTick(() => {
        $('img').removeAttr('style').removeAttr('height').removeAttr('width').css({
          'width': 'calc(100vw - 24px)'
        })
      })
    },
    methods: {
      // 店铺类的详情
      _getDesc (id) {
        this.$http.get(`/mobile/?act=goods&op=store_card&store_id=${id}`).then(res => {
          if (res.data.status === 200) {
            // 因为是 转义后的带标签的 所以要双解析 只用v-html只会把标签转义 不会解析
            this.$refs.descText.innerHTML = res.data.data
            this.desc = this.$refs.descText.innerText
          }
        })
      },
      // 商品详情
      _getEnsure (id) {
        this.$http.get(`/api/goods_video/detail?id=${id}&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let data = res.data.data
            this.$refs.descText.innerHTML = data.content
            this.desc = this.$refs.descText.innerHTML
            this.name = data.title
            this.src = data.src
            this.title = data.title
          }
        })
      },
      // 图文详情
      _getImgText (id) {
        this.$http.get(`/api/goods/getGoodsBody?goods_id=${this.id}`).then(res => {
          if (res.data.status === 200) {
            this.flag = false
            let data = res.data.data
            this.$refs.descText.innerHTML = data
            this.desc = this.$refs.descText.innerHTML
          }
        })
      },
      // 平台类
      _getPt () {
        this.$http.post('/mobile?act=index&op=get_site_tel&name=site_describe').then(res => {
          if (res.data.status === 200) {
            this.flag = false
            let data = res.data.data.value
            this.$refs.descText.innerHTML = data
            this.desc = this.$refs.descText.innerText
          }
        })
      },
      // 保证金制度
      _getDeposit () {
        this.$http.get('/mobile/?act=document&op=get_doc&doc_code=deposit_rule').then(res => {
          if (res.data.status === 200) {
            this.flag = false
            this.title = res.data.data.doc_title
            let data = res.data.data.doc_content
            this.$refs.descText.innerHTML = data
            this.desc = this.$refs.descText.innerHTML
          }
        })
      },
      // 线下们店
      _getOffline () {
        this.$http.get('/mobile/?act=document&op=get_doc&doc_code=exempt_bond').then(res => {
          if (res.data.status === 200) {
            this.flag = false
            this.title = res.data.data.doc_title
            let data = res.data.data.doc_content
            this.$refs.descText.innerHTML = data
            this.desc = this.$refs.descText.innerHTML
          }
        })
      },
      // banner图规则
      _getBannerRule () {
        this.$http.post(`/mobile/?act=adv&op=adv_info`, {
          adv_id: this.adv_id
        }).then(res => {
          if (res.data.status === 200) {
            let result = res.data.data
            this.flag = false
            this.title = result.adv_title
            let data = result.adv_detail
            this.$refs.descText.innerHTML = data
            this.desc = this.$refs.descText.innerText
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
    iframe{
      margin: 20px 0;
      width: calc(~"100vw - 24px");
      height: calc(~"56.25vw - 11.25px");
    }
    // .name{
    //   position: relative;
    //   padding-left: 18px;
    //   height: 20px;
    //   line-height: 20px;
    //   letter-spacing: 1px;
    //   font-size: @font-size-large;
    //   &:before{
    //     content: '';
    //     display: block;
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     height: 20px;
    //     width: 7px;
    //     background: @color;
    //   }
    // }
    .text{
      width: 100%;
      min-height: calc(~"100vh - 85px");
      display: flex;
      flex-direction: column;
      overflow: hidden;
      // align-items: center;
      // div{
      //   flex: 1;
      // }
    }
  }
</style>
