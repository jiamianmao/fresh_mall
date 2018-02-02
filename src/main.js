// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill' // 吃一堑，长一智了 Object.values 等es7方法兼容性很差，需要垫片操作
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
// import VConsole from 'vconsole'

/* eslint-disable */
// let vConsole = new VConsole()

// 有赞，Vue-Swiper中间件
Vue.use(Vant)
Vue.use(VueAwesomeSwiper)

// 动态baseURL
const origin = window.location.origin
Storage.session.set('origin', origin)

// axios 默认配置
axios.defaults.baseURL = origin
axios.defaults.timeout = 5000

// request 拦截器 （json -> 表单）
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    return config
  }
)

// response 拦截器 (接口登录的拦截)
axios.interceptors.response.use(
  res => {
    if (res.data.login === '0') {
      // console.log(router.currentRoute.fullPath)
      let url = router.currentRoute.fullPath
      if (router.currentRoute.fullPath.includes('/my/')) {
        url = '/my'
      }
      Storage.set('currentUrl', url)
      router.replace({
        path: '/signin'
      })
    }
    return res
  }
)

Vue.prototype.$http = axios

// 图片懒加载
Vue.use(Vuelazyload, {
  loading: require('common/images/default.jpg')
})

FastClick.attach(document.body)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes,
  // 这里先暂时不加滚动行为，因为会导致better-scroll的bug
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由登录的拦截
router.beforeEach((to, from, next) => {
  // 官方做法是meta，但该项目都是子路由，较多，采用模糊匹配
  if ((to.path.indexOf('/my/') !== -1) && !Storage.get('api_token')) {
    let url = to.fullPath.includes('/my/') ? '/my' : to.fullPath
    Storage.set('currentUrl', url)
    next('/signin')
  } else {
    // 路由之间的loadding状态
    store.commit('SET_IS_LOADING', true)
    next()
  }
})

// 路由之间的loadding状态
router.afterEach((to) => {
  store.commit('SET_IS_LOADING', false)
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
