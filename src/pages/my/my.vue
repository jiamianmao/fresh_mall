<template>
  <div class='container'>
    <header ref='bg'>
      <div class="avatar" @click='userinfo'>
        <div class="img_wrapper">
          <img v-if='info && info.avatar_url' v-lazy='info.avatar_url'>
          <img v-else src="../../assets/my/avatar.png">
        </div>
        <span class="name" v-if='info'>{{ info.member_name }}</span>
        <span class='name' v-else>马上登录</span>
      </div>
    </header>
    <scroll class='scroll'>
      <main>
        <div class="behavior">
          <div @click='collect'>
            <span>{{ nums.favorite_num || 0 }}</span>
            <p>收藏商品</p>
          </div>
          <div @click='brand'>
            <span>{{ nums.member_brand_num || 0 }}</span>
            <p>关注品牌</p>
          </div>
          <div @click='footmark'>
            <span>{{ nums.browse_num || 0 }}</span>
            <p>浏览记录</p>
          </div>
        </div>
        <div class="order">
          <div class="top">
            <div class="left">我的订单</div>
            <div class="right" @click='viewAllOrder'>查看全部订单<x-icon type="ios-arrow-right" size="16"></x-icon></div>
          </div>
          <div class="order_desc" @click='viewOrder'>
            <div class="item" id='1'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_pay.png">
                <div class="num" v-if='~~nums.new_count'>{{nums.new_count}}</div>
              </div>待付款
            </div>
            <div class="item" id='2'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_sent.png">
                <div class="num" v-if='~~nums.pay_count'>{{nums.pay_count}}</div>
              </div>待发货</div>
            <div class="item" id='3'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_get.png">
                <div class="num" v-if='~~nums.send_count'>{{nums.send_count}}</div>
              </div>待收货
            </div>
            <div class="item" id='4'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_judge.png">
                <div class="num" v-if='~~nums.eval_count'>{{nums.eval_count}}</div>
              </div>待评价</div>
            <div class="item" @click.stop='after_sell'>
              <div class="img_wrapper">
                <img src="../../assets/my/service.png">
                <!--<div class="num" v-if='~~nums.refund_count'>{{nums.refund_count}}</div>-->
              </div>
              <div>售后</div>
            </div>
          </div>
          <div class='fun_wrapper'>
            <div v-if='member === 2' class="item" @click='qualification'>资质认证<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item" @click='address'>收货地址管理<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item" @click='msg'>消息中心<x-icon type="ios-arrow-right" size="16"></x-icon><div class="has" v-if='~~nums.msg_num > 0'></div></div>
            <div class="item" @click='account'>账户管理<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item" @click='findService'>客服与帮助<x-icon type="ios-arrow-right" size="16"></x-icon></div>
          </div>
        </div>
      </main>
    </scroll>
    <router-view :status='status'></router-view>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Scroll from '@/components/scroll/scroll'
  import storage from 'good-storage'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data () {
      return {
        status: 0,
        scrollY: 0,
        nums: {},
        info: '',
        tel: '',
        member: 1
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this.member = ~~storage.get('member_class') || 1
      if (this.api_token) {
        this._getNums()
        this._getInfo()
      }
    },
    methods: {
      collect () {
        this.$router.push('/my/collect')
      },
      footmark () {
        this.$router.push('/my/footmark')
      },
      brand () {
        this.$router.push('/my/brand')
      },
      userinfo () {
        this.$router.push('/my/userinfo')
      },
      viewAllOrder () {
        this.status = 0
        this.$router.push('/my/order')
      },
      viewOrder (e) {
        if (e.target.id) {
          this.status = Number(e.target.id)
        } else {
          this.status = Number($(e.target).parentsUntil('.order_desc')[1].id)
        }
        this.$router.push('/my/order')
      },
      after_sell () {
        this.$router.push('/my/aftersell')
      },
      account () {
        this.$router.push('/my/account')
      },
      address () {
        this.$router.push('/my/address')
      },
      msg () {
        this.$router.push({
          path: '/my/msg'
        })
      },
      qualification () {
        this.$router.push('/my/qualification')
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      findService () {
        this.$router.push('/service?type=service_help')
      },
      _getNums () {
        this.$http.get(`/mobile/?act=member_order&op=series_num&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.nums = res.data.data.num
          }
        })
      },
      _getInfo () {
        if (this.user.openid) {
          this.info = this.user
        } else {
          this.$http.get(`/mobile/?act=member_account&op=get_member_info&api_token=${this.api_token}`).then(res => {
            if (res.data.status === 200) {
              this.info = res.data.data
              this.SET_USERINFO(this.info)
            }
          })
        }
      },
      ...mapMutations([
        'SET_USERINFO'
      ])
    },
    computed: {
      ...mapGetters({
        'user': 'userInfo'
      })
    },
    mounted () {
      this.bgHeight = this.$refs.bg.clientHeight
    },
    watch: {
      $route () {
        if (this.$route.fullPath === '/my') {
          this._getNums()
          this._getInfo()
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    width: 100vw;
    header{
      width: 100%;
      height: 84px;
      background: url('../../assets/my/bg.jpg') 0 0 ~"/" 100% 100%;
      position: relative;
      z-index: 1;
      .avatar{
        position: absolute;
        bottom: -20px;
        left: 5.06667%;
        height: 70px;
        display: flex;
        flex-flow: row nowrap;
        .img_wrapper{
          width: 70px;
          height: 100%;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, .6);
          margin-right: 18px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .name{
          position: relative;
          top: 32%;
          color: #fff;
          height: 18px;
          letter-spacing: 1px;
        }
      }
    }
    .scroll{
      width: 100vw;
      height: calc(~"100vh - 134px");
    }
    main
      width: 100%;
      .behavior{
        width: 100%;
        height: 124px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        div{
          height: 100%;
          flex: 1;
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          justify-content: center;
          span{
            font-weight: bold;
            margin-bottom: 6px;
          }
          p{
            font-size: @font-size-small;
          }
        }
      }
      .order{
        width: 100%;
        .top{
          height: 46px;
          width: 100%;
          display: flex;
          padding: 0 28px 0 16px;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .left{
            font-weight: 600;
          }
          .right{
            color: #999;
            font-size: @font-size-small;
            .vux-x-icon {
              fill: currentColor;
              vertical-align: -0.25em;
              margin-left: 9px;
            }
          }
        }
        .order_desc{
          width: 100%;
          height: 70px;
          padding: 0 13px 4px 13px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          .item{
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            font-size: @font-size-small;
            color: #666;
            .img_wrapper{
              width: 28px;
              height: 28px;
              margin-bottom: 14px;
              position: relative;
              img{
                width: 100%;
                height: 100%;
              }
              .num{
                position: absolute;
                top: -4px;
                right: -8px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                text-align: center;
                line-height: 16px;
                background: @color;
                color: #fff;
              }
            }
            
          }
        }
        .fun_wrapper{
          margin-top: 33px;
          width: 100%;
          padding: 0 28px 0 22px;
          .item{
            height: 45px;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .has{
              position: absolute;
              top: 14px;
              left: 65px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: @color;
            }
            .vux-x-icon {
              fill: #666;
            }
          }
        }
      }
  }
</style>
