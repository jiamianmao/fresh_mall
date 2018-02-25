<template>
  <div class='search' ref='search'>
    <!-- 为了输入框中出现搜索按钮，加了form及action，已经input.type='search' -->
    <form class='left' action='#' ref='left'>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-sousu"></use>
      </svg>
      <input type="search" v-model='msg' placeholder='搜索商品' @search='toSearch' ref='input'>
      <svg class="icon hotarea" aria-hidden="true" v-show='msg' @click='clear'>
        <use xlink:href="#icon-close47"></use>
      </svg>
    </form>
    <div class="right" @click='close' v-show='rightContent'>
      {{rightContent}}
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    props: {
      rightContent: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        msg: ''
      }
    },
    mounted () {
      $('.left').on('submit', (e) => {
        e.preventDefault()
      })
    },
    methods: {
      clear () {
        this.msg = ''
      },
      toSearch () {
        this.$emit('toSearch', this.msg)
      },
      close () {
        this.$emit('close')
      },
      changeColor () {
        $('input').parent('.left').addClass('category')
        $('input').css('color', '#eee')
        this.$refs.left.style.color = '#eee'
        this.$refs.left.style.backgroundColor = 'rgba(255, 255, 255, .15)'
      }
    },
    // directives: {
    //   focus: {
    //     inserted: function (el) {
    //       el.focus()
    //     }
    //   }
    // },
    watch: {
      rightContent () {
        if (this.rightContent) {
          console.log('rightContent')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .search{
    position: relative;
    height: 50px;
    width: 100vw;
    padding: 0 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      flex: 1;
      height: 30px;
      padding: 0 20px;
      background: #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 30px;
      .icon {
        width: 18px; 
        height: 18px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
      input{
        display: flex;
        align-items: center;
        border: 0;
        background: transparent;
        padding: 5px 0 5px 14px;
        width: 100%;
        font-size: @font-size-small;
        height: 20px;
        line-height: 20px;
      }
    }
    .category{
      input::-webkit-input-placeholder{
        color: #eee;
      }
    }
    .right{
      width: 21.067%;
      padding-right: 12px;
      box-sizing: border-box;
      text-align: center;
      color: @color;
    }
  }
  .hotarea{
    .extend-click
  }
</style>
