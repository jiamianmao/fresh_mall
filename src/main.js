// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import routes from './router'
import App from './App'
import store from './store'
import Vuelazyload from 'vue-lazyload'
import VueRouter from 'vue-router'
import axios from 'axios'
import 'common/less/index.less'
import 'swiper/dist/css/swiper.css'
import 'common/js/iconfont/iconfont'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
import Storage from 'good-storage'

Vue.use(Vant)
Vue.use(VueAwesomeSwiper)

Vue.prototype.$http = axios

Vue.use(Vuelazyload, {
  loadding: require('common/images/default.jpg')
})

FastClick.attach(document.body)

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if ((to.path.indexOf('/my/') !== -1) && !Storage.get('api_token')) {
    Storage.set('currentUrl', to.path)
    next('/signin')
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
