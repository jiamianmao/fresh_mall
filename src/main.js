// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import routes from './router'
import App from './App'
import store from './store'
import qs from 'qs'
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

axios.defaults.baseURL = '/apis'
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    return config
  }
)

Vue.prototype.$http = axios

Vue.use(Vuelazyload, {
  loadding: require('common/images/default.jpg')
})

FastClick.attach(document.body)

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  mode: 'history'
  // 这里先暂时不加滚动行为，因为会导致better-scroll的bug
  // scrollBehavior (to, from, savedPosition) {
  //   console.log(savedPosition)
  //   return { x: 0, y: 500 }
  // }
})

router.beforeEach((to, from, next) => {
  // 官方做法是meta，但该项目都是子路由，较多，采用模糊匹配
  if ((to.path.indexOf('/my/') !== -1) && !Storage.get('api_token')) {
    next('/signin')
    Storage.set('currentUrl', to.fullPath)
  } else if (to.path === '/signin' && Storage.get('api_token')) {
    next('/')
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
