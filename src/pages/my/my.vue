<template>
  <div class='container'>
    <header ref='bg'>
      <div class="avatar">
        <div @click='userinfo' class="img_wrapper" :style='{backgroundImage: "url(" + "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3022382586,679430293&fm=27&gp=0.jpg" + ")"}'>
        </div>
        <span class="name">陈冠希</span>
      </div>
    </header>
    <scroll class='scroll'>
      <main>
        <div class="behavior">
          <div @click='collect'>
            <span>100</span>
            <p>收藏商品</p>
          </div>
          <div @click='brand'>
            <span>100</span>
            <p>关注品牌</p>
          </div>
          <div @click='footmark'>
            <span>100</span>
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
                <div class="num">1</div>
              </div>待付款
            </div>
            <div class="item" id='2'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_sent.png">
                <div class="num">2</div>
              </div>待发货</div>
            <div class="item" id='3'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_get.png">
                <div class="num">2</div>
              </div>待收货
            </div>
            <div class="item" id='4'>
              <div class="img_wrapper">
                <img src="../../assets/my/wait_judge.png">
              </div>待评价</div>
            <div class="item" @click.stop='after_sell'>
              <div class="img_wrapper">
                <img src="../../assets/my/service.png">
              </div>售后
            </div>
          </div>
          <div class='fun_wrapper'>
            <div class="item" @click='qualification'>资质认证<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item" @click='address'>收货地址管理<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item" @click='msg'>消息中心<x-icon type="ios-arrow-right" size="16"></x-icon><div class="has"></div></div>
            <div class="item" @click='account'>账号安全<x-icon type="ios-arrow-right" size="16"></x-icon></div>
            <div class="item">联系客服<x-icon type="ios-arrow-right" size="16"></x-icon></div>
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
  export default {
    data () {
      return {
        status: 0,
        scrollY: 0
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
      }
    },
    mounted () {
      this.bgHeight = this.$refs.bg.clientHeight
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
      background: url('../../assets/my/bg.png') 0 0 ~"/" 100% 100%;
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
          background-origin: border-box;
          background-size: 100% 100%;
          margin-right: 18px;
        }
        .name{
          position: relative;
          top: 32%;
          color: #fff;
          height: 18px;
          font-size: @font-size-large;
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
