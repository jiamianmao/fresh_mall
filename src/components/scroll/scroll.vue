<template>
  <div ref='wrapper'>
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  // import { throttle } from 'vux' 这里不能用，因为我需要实时获取来对下拉的icon做处理

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      pulldown: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos)
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.pulldown) {
          this.scroll.on('touchEnd', pos => {
            if (pos.y > 50) {
              this.$emit('pullDown')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disbale()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  }
</script>

<style scoped lang="less">
</style>
