import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/pages/home/home')
const Category = () => import('@/pages/category/category')
const Shopcart = () => import('@/pages/shopcart/shopcart')

const Search = () => import('@/pages/search/search')
const City = () => import('@/components/city/city')

// 产品页面
const Product = () => import('@/pages/product/product')
const Rate = () => import('@/pages/rate/rate')

const Map = () => import('@/pages/map/map')

const GoodsList = () => import('@/pages/goods-list/goods-list')
const Desc = () => import('@/pages/desc/desc')

const FirmOrder = () => import('@/pages/firmorder/firmorder')
const Invoice = () => import('@/pages/firmorder/children/invoice')

const BrandGoodsList = () => import('@/pages/brandGoodsList/brandGoodsList')
const Pay = () => import('@/pages/pay/pay')

// 我的页面
const My = () => import('@/pages/my/my')
const Order = () => import('@/pages/my/children/order')
const AfterSell = () => import('@/pages/my/children/after_sell')
const Account = () => import('@/pages/my/children/account')
const ForgetPwd = () => import('@/pages/my/children/signin_forgetpwd')
const ForgetTel = () => import('@/pages/my/children/signin_forgetTel')
const Address = () => import('@/pages/my/children/address')
const AddressAdd = () => import('@/pages/my/children/address_add')
const Qualification = () => import('@/pages/my/children/qualification')
const MyQualificationFresh = () => import('@/pages/my/children/qualification_fresh')
const MyQualificationSure = () => import('@/pages/my/children/qualification_sure')
const Msg = () => import('@/pages/my/children/msg')
const Collect = () => import('@/pages/my/children/collect')
const UserInfo = () => import('@/pages/my/children/userinfo')
const Refund = () => import('@/pages/my/children/refund')
const ProductRate = () => import('@/pages/my/children/product_rate')

const Service = () => import('@/pages/service/service')

const Signin = () => import('@/pages/signin/signin')
const Signup = () => import('@/pages/signup/signup')
const SignupPersonal = () => import('@/pages/signup_personal/signup_personal')
const SignupCompany = () => import('@/pages/signup_company/signup_company')
const Bind = () => import('@/pages/bind/bind')

const Message = () => import('@/pages/message/message')
const MapZiti = () => import('@/pages/map_ziti/map_ziti')

const NotFound = () => import('@/pages/NotFound/404')

const Auth = () => import('@/pages/auth/auth')

const Union = () => import('@/pages/union')

Vue.use(Router)

/* eslint-disable */
export default [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/category', component: Category },
    { path: '/shopcart', component: Shopcart },
    { path: '/my', component: My, 
      children: [
        { path: 'order', component: Order },
        { path: 'aftersell', component: AfterSell },
        { path: 'account', component: Account,
          children: [
            { path: 'password', component: ForgetPwd },
            { path: 'tel', component: ForgetPwd,
              children: [
                { path: 'newtel', component: ForgetTel }
              ]
            }
          ]
        },
        { path: 'address', component: Address,
          children: [
            { path: 'add', component: AddressAdd }
          ]
        },
        { path: 'qualification', component: Qualification, 
          children: [
            { path: 'fresh', component: MyQualificationFresh}
          ]
        },
        // 这里没办法，只好挂载在/my路由上了
        { path: 'qualification/sure', component: MyQualificationSure},
        { path: 'msg', component: Msg },
        { path: 'collect', component: Collect },
        { path: 'footmark', component: Collect },
        { path: 'brand', component: Collect },
        { path: 'userinfo', component: UserInfo },
        { path: 'refund', component: Refund },
        { path: 'rate', component: ProductRate }
      ]
    },
    { path: '/service', component: Service },
    { path: '/firmorder', component: FirmOrder,
      children: [
        { path: 'invoice', component: Invoice }
      ]
    },
    { path: '/city', component: City },
    { path: '/search', component: Search },
    { path: '/product/:id', component: Product},
    { path: '/rate', component: Rate },
    // 这里存疑，之前不知道如何设计的，从/my/address回退到/map页面的时候，上拉框还在
    // 现在在/map里增加了子路由，来实现效果。
    { path: '/map', component: Map },
    { path: '/goodslist', component: GoodsList },
    { path: '/desc', component: Desc },
    { path: '/brandGoodsList', component: BrandGoodsList },
    { path: '/pay', component: Pay },
    { path: '/signin', component: Signin,
      children: [
         { path: 'forgetpassword', component: ForgetPwd },
         { path: 'bind', component: Bind }
      ]
    },
    { path: '/signup', component: Signup, 
      children: [
        { path: 'personal', component: SignupPersonal },
        { path: 'company', component: SignupCompany }
      ]
    },
    { path: '/message', component: Message },
    { path: '/mapziti', component: MapZiti },
    { path: '/auth', component: Auth },
    { path: '/union', component: Union },
    { path: '*', component: NotFound }
  ]
