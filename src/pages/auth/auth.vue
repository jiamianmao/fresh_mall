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
      this.origin = storage.session.get('origin')
      this._getAuth()
    },
    methods: {
      _getAuth () {
        let redirect
        if (this.url) {
          redirect = `${this.origin}/api/wx/user?api_token=${this.api_token}&redirect_url=${encodeURIComponent(this.url)}`
        } else {
          redirect = `${this.origin}/api/auth/wx`
        }
        // console.log(redirect)
        window.location.href = redirect
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
