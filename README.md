## 基于Vux开发的商城平台

> 项目地址： top.chhpz.com
<br />
> 测试地址： ctx.17link.cc

## 如果是你来维护项目，请仔细阅读以下内容：
[创天下项目总结](http://blog.csdn.net/qq_35534823/article/details/79300237)
<br />
[axios用法心得](http://blog.csdn.net/qq_35534823/article/details/79297931)

> 权限控制
项目采用`JWT`来鉴权的，通常做法是在header中增加token字段，但该一开始并非所有接口都需要token，所以采用在单独接口上加token，这里最后基本上把所有接口都加了token，所以你可以从全局进行一个配置，或者重新生成一个axios实例来进行优化。该项目的权限总结在 `创天下项目总结` 中有写，如果对`JWT`的前后端实现有兴趣，可以关注我的[Node & Vue](https://github.com/jiamianmao/node-vue)项目.

> 难点
- 产品组件(product.vue)的交互，因为是多配送方式的选择
- 订单提交(firmorder.vue)的交互，因为是多身份的选择
- 购物车(shopcart.vue)的交互，因为勾选和计算是由前端来维护
- 地图(map 和 map_ziti)的交互，这里我拆成两个组件，思考一下为什么要拆分，看能否合成一个组件

> 开发 & 生产
```
main.js的配置
开发环境下
axios.defaults.baseURL = '/apis'
生产环境下
axios.defaults.baseURL = origin  // 这里也可以置为'' 
```

> 优化点

- 代码层面
  ```
    1，一些if判断处理得不够优雅，耦合性较高
    2，一些组件里对代码设计缺乏了一些思考，较好的设计在 `collect.vue` 和 ` tab.vue ` 中
  ```
- 打包层面
  ```
    1，webpack3 update webpack4  把 commonChunksPlugin 换为 SplitChunksPlugin
    2，把公共包和业务代码拆分开（vue-router , vue, vuex, jquery ）
    3，开启Gzip压缩（待商榷）
  ```

## 项目目录

``` 
│  App.vue
│  main.js
│
├─assets  // 静态资源
│  ├─home
│  │      arrow.png
│  │      no_result.png
│  │      position.png
│  │      search.png
│  │
│  ├─login
│  │      avatar.jpg
│  │      brand.png
│  │      code.png
│  │      new_wechat.png
│  │      pwd.png
│  │      qq.png
│  │      tel.png
│  │      wechat.png
│  │
│  ├─my
│  │      avatar.png
│  │      bg.jpg
│  │      close.png
│  │      not_order.png
│  │      readed.png
│  │      service.png
│  │      status_1.png
│  │      status_2.png
│  │      status_3.png
│  │      status_4.png
│  │      unread.png
│  │      uploadicon.png
│  │      wait_get.png
│  │      wait_judge.png
│  │      wait_pay.png
│  │      wait_sent.png
│  │
│  ├─pay
│  │      alipay.png
│  │      companypay.png
│  │      unionpay.png
│  │      wechatpay.png
│  │
│  ├─product
│  │      border.png
│  │      company.jpg
│  │      eat_way.png
│  │      find.png
│  │      icon.jpg
│  │      pulldown.png
│  │      quality.png
│  │      return.png
│  │
│  ├─rate_item
│  │      no.png
│  │      yes.png
│  │
│  ├─selectAdd
│  │      del.png
│  │      rewrite.png
│  │      select.png
│  │      selected.png
│  │
│  ├─service
│  │      bu.png
│  │      refund.png
│  │
│  └─tab
│          category.png
│          category_active.png
│          home.png
│          home_active.png
│          my.png
│          my_active.png
│          shopcart.png
│          shopcart_active.png
│
├─common     // 基础建设
│  ├─config
│  │      config.js
│  │
│  ├─images
│  │      default.jpg
│  │
│  ├─js
│  │  │  alert.js
│  │  │  compress.js  // 图片压缩 已封装成promise
│  │  │
│  │  ├─alipay
│  │  │      ap.js
│  │  │
│  │  └─iconfont
│  │          iconfont.js
│  │
│  └─less
│          base.less
│          index.less
│          mixin.less
│          reset.less
│          variable.less
│
├─components  // 基础组件
│  ├─alert
│  │      alert.vue
│  │
│  ├─city
│  │      city.vue
│  │
│  ├─confirm
│  │      confirm.vue
│  │
│  ├─placeholder
│  │      placeholder.vue
│  │
│  ├─pro_tab
│  │      pro_tab.vue
│  │
│  ├─rate_item
│  │      rate_item.vue
│  │
│  ├─scroll
│  │      scroll.vue
│  │
│  ├─search
│  │      search.vue
│  │
│  ├─tab
│  │      tab.vue
│  │
│  ├─typeList
│  │      typeList.vue
│  │
│  ├─x-goods
│  │      x-goods.vue
│  │
│  ├─x-header
│  │      x-header.vue
│  │
│  └─x-title
│          x-title.vue
│
├─mixins   // 处理ios下微信分享的bug
│      assign.js
│
├─pages
│  │  union.vue
│  │
│  ├─auth
│  │      auth.vue
│  │
│  ├─bind
│  │      bind.vue
│  │
│  ├─brandGoodsList
│  │      brandGoodsList.vue
│  │
│  ├─category
│  │      category.vue
│  │
│  ├─desc
│  │      desc.vue
│  │
│  ├─firmorder
│  │  │  firmorder.vue
│  │  │
│  │  └─children
│  │          invoice.vue
│  │
│  ├─goods-list
│  │      goods-list.vue
│  │
│  ├─home
│  │      home.vue
│  │
│  ├─map
│  │      map.vue
│  │      tel.png
│  │
│  ├─map_ziti
│  │      map_ziti.vue
│  │      tel.png
│  │
│  ├─message
│  │      message.vue
│  │
│  ├─my
│  │  │  my.vue
│  │  │
│  │  └─children
│  │          account.vue
│  │          address.vue
│  │          address_add.vue
│  │          after_sell.vue
│  │          collect.vue
│  │          msg.vue
│  │          order.vue
│  │          product_rate.vue
│  │          qualification.vue
│  │          qualification_fresh.vue
│  │          qualification_sure.vue
│  │          refund.vue
│  │          signin_forgetpwd.vue
│  │          signin_forgetTel.vue
│  │          userinfo.vue
│  │
│  ├─NotFound
│  │      404.vue
│  │
│  ├─pay
│  │      pay.vue
│  │
│  ├─product
│  │      product.vue
│  │
│  ├─rate
│  │      rate.vue
│  │
│  ├─search
│  │      search.vue
│  │
│  ├─service
│  │      service.vue
│  │
│  ├─shopcart
│  │      shopcart.vue
│  │
│  ├─signin
│  │      signin.vue
│  │
│  ├─signup
│  │      signup.vue
│  │
│  ├─signup_company
│  │      signup_company.vue
│  │
│  └─signup_personal
│          signup_personal.vue
│
├─router
│      index.js
│
└─store
        actions.js
        getters.js
        index.js
        mutation-type.js
        mutation.js
        state.js
```
