/* eslint-disable */
const location = global.location
const u = navigator.userAgent;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
console.log(isiOS)
export default {
  beforeRouteEnter(to, from, next) {
    // XXX: 修复iOS版微信HTML5 History兼容性问题
    console.log(to.fullPath, location.pathname)
    if (isiOS && to.path !== location.pathname) {
      // 此处不可使用location.replace
      location.assign(to.fullPath)
    } else {
      next()
    }
  }
}