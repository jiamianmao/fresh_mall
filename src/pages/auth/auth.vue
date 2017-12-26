<template>
  <div></div>
</template>
<script>
  import storage from 'good-storage'
  export default {
    data () {
      return {
      }
    },
    created () {
      this.url = this.$route.query.redirect
      this.api_token = storage.get('api_token')
      this._getAuth()
    },
    methods: {
      _getAuth () {
        let redirect
        if (this.url) {
          redirect = `http://ctx.17link.cc/api/wx/user?api_token=${this.api_token}&redirect_url=${encodeURIComponent(this.url)}`
        } else {
          redirect = `http://ctx.17link.cc/api/wx/user?api_token=${this.api_token}`
        }
        window.location.href = redirect
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
