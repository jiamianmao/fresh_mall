<template>
  <transition name='slide'>
    <div class="sure">
      <x-title>确认信息</x-title>
      <main>
        <div class="know vux-1px-b">
          <h3>认证须知</h3>
          <div class="box">请再次确认您的认证信息，确认后不能修改！确认后请及时点击页面底部的提交按钮提交认证：</div>
          <div class="desc" ref='desc'>
            <p>请务必保证填写的贵公司企业相关信息准确无误</p>
            <p>请确保贵公司的营业执照在工商局合法注册，正常经营，执照有 效期在30天（含）以上，且已通过最新的年度的工商年报</p>
            <p>请确保公贵司的营业执照上的登记事项不在工商变更登记中</p>
            <p>请确保贵公司认证申请人已得到贵司合法授权且属于贵司在职员 工，若贵公司属非法人企业（包括但不限于个体工商户、办事处 等），必须由执照上的经营者本人作为认证申请人</p>
            <p>请确保贵公司认证申请人已年满16周岁</p>
            <p>请确保贵公司在认证期限内能及时配合认证的各项工作，关注认 证中相关提醒（参考：认证期限为2个工作日）</p>
          </div>
          <div class="icon" @click='arrowToggle'>
            <svg class="arrow" aria-hidden="true" ref='arrow'>
              <use xlink:href="#icon-arrow-b"></use>
            </svg>
            {{text}}
          </div>
        </div>
        <div class="item_wrapper">
          <div class="item title vux-1px-b">
            <h3>确认企业信息</h3>
          </div>
          <div class="item vux-1px-b">
            <span>公司全称</span>
            <span>{{qualification.company_name}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>营业执照注册号</span>
            <span>{{qualification.business_licence_number}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>银行开户名</span>
            <span>{{qualification.bank_account_name}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>开户行所在城市</span>
            <span>{{qualification.bank_address}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>开户银行支行名称</span>
            <span>{{qualification.bank_subbranch_name}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>公司对公账号</span>
            <span>{{qualification.bank_account}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>营业执照照片</span>
            <div class="img_wrapper">
              <img v-for='item of qualification.licence_pic' v-lazy='item'>
            </div>
          </div>
          <div class="item vux-1px-b">
            <span>门店照片</span>
            <div class="img_wrapper">
              <img v-lazy='qualification.shop_pic'>
            </div>
          </div>
          <div class="item vux-1px-b">
            <span>认证申请人真实姓名</span>
            <span>{{qualification.authenticator_truename}}</span>
          </div>
          <div class="item vux-1px-b">
            <span>认证申请人身份证号</span>
            <span>{{qualification.authenticator_idnumber}}</span>
          </div>
        </div>
        <div class="select_item">
          <div class="title vux-1px-b">
            <span>1</span>
            <p>{{msg1}}</p>
          </div>
        </div>
        <div class="select_item">
          <div class="title vux-1px-b">
            <span>2</span>
            <p>{{msg2}}</p>
          </div>
        </div>
        <div class="select_item">
          <div class="title vux-1px-b">
            <span>3</span>
            <p>{{msg3}}</p>
          </div>
          <div class="store" v-show='qualification.is_storegoods === 2'>
            <p>门店资质</p>
            <div class="area" v-show='storeCondition'>
              <p>{{storeCondition}}</p>
            </div>
            <div class="img_wrapper">
              <img v-for='item of storeConditionPic' v-lazy="item">
            </div>
          </div>
        </div>
        <div class="select_item">
          <div class="title vux-1px-b">
            <span>4</span>
            <p>{{msg4}}</p>
          </div>
        </div>
      </main>
      <footer>
        <button @click='submit'>确认提交</button>
      </footer>
      <alert v-model="show" title="提示" @on-hide='success'>恭喜您，提交成功</alert>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { mapGetters } from 'vuex'
  import { Alert } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        text: '收起',
        slideDown: true,
        placeholder: '请具体介绍门店的存储设备、可为平台业务提供的设备容量、设备温度区间等',
        show: false
      }
    },
    created () {
      this.api_token = storage.get('api_token')
    },
    mounted () {
      this.$refs.arrow.style.transform = 'rotate(0.5turn)'
    },
    methods: {
      arrowToggle () {
        this.slideDown = !this.slideDown
        this.$refs.arrow.style.transform = this.slideDown ? 'rotate(0.5turn)' : 'rotate(0)'
      },
      submit () {
        let obj = {}
        if (this.storeCondition) {
          obj.store_condition = this.storeCondition
        }
        if (this.storeConditionPic.length > 0) {
          obj.store_condition_pic = this.storeConditionPic
        }
        this.$http.post(`/mobile/?act=member_index&op=company_authority&api_token=${this.api_token}`, Object.assign({
          business_licence_number: this.qualification.business_licence_number,
          bank_account_name: this.qualification.bank_account_name,
          bank_account: this.qualification.bank_account,
          bank_address: this.qualification.bank_address,
          bank_subbranch_name: this.qualification.bank_subbranch_name,
          authenticator_truename: this.qualification.authenticator_truename,
          authenticator_idnumber: this.qualification.authenticator_idnumber,
          licence_pic: this.qualification.licence_pic,
          shop_pic: [this.qualification.shop_pic],
          is_yinliu: this.qualification.is_yinliu,
          is_ziti: this.qualification.is_ziti,
          is_storegoods: this.qualification.is_storegoods,
          is_dispatching: this.qualification.is_dispatching,
          company_name: this.qualification.company_name
        }, obj)).then(res => {
          if (res.data.status === 200) {
            // 清理掉之前保存的storage
            storage.remove('upload')
            this.show = true
          } else {
            alert(res.data.data.error)
          }
        })
      },
      success () {
        this.$router.replace('/my')
      }
    },
    computed: {
      msg1 () {
        if (this.qualification.is_yinliu === 2) {
          return '我愿意成为平台在售门店'
        } else {
          return '我不愿意成为平台在售门店'
        }
      },
      msg2 () {
        if (this.qualification.is_ziti === 2) {
          return '我愿意成为平台自提门店'
        } else {
          return '我不愿意成为平台自提门店'
        }
      },
      msg3 () {
        if (this.qualification.is_storegoods === 2) {
          return '我愿意代收生鲜产品'
        } else {
          return '我不愿意代收生鲜产品'
        }
      },
      msg4 () {
        if (this.qualification.is_dispatching === 2) {
          return '我愿意配送生鲜产品'
        } else {
          return '我不愿意配送生鲜产品'
        }
      },
      ...mapGetters([
        'qualification',
        'storeConditionPic',
        'storeCondition'
      ])
    },
    components: {
      XTitle,
      Alert
    },
    watch: {
      slideDown () {
        if (this.slideDown) {
          this.$refs.desc.style.height = '216px'
          this.text = '收起'
        } else {
          this.$refs.desc.style.height = '20px'
          this.text = '展开'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .sure{
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100vh;
    right: 0;
    background: #fff;
    z-index: 1;
    main{
      width: 100%;
      .know{
        width: 100%;
        padding: 15px;
        padding-bottom: 0;
        font-size: @font-size-small;
        .box{
          width: 100%;
          height: 50px;
          line-height: 20px;
          background: #f4f4f4;
          padding: 0 10px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          margin: 20px 0;
        }
        .desc{
          height: 216px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          color: #333;
          overflow: hidden;
          p{
            padding-left: 1em;
            position: relative;
            line-height: 20px;
            &:before{
              position: absolute;
              content: '';
              display: block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: @color;
              left: 0;
              top: .4em;
            }
          }
        }
        .icon{
          height: 60px;
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          color: @color;
        }
      }
      .item_wrapper{
        width: 100%;
        .item{
          padding: 0 15px;
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          // justify-content: space-between;
          align-items: center;
          h3{
            line-height: 50px;
          }
          span{
            font-size: @font-size-medium;
            color: #333;
            line-height: 50px;
            &~span{
              flex: 1;
              text-align: right;
            }
          }
          .img_wrapper{
            height: 80px;
            width: 100%;
            margin-bottom: 15px;
            img{
              width: 80px;
              height: 80px;
              &~img{
                margin-left: 10px;
              }
            }
          }
        }
      }
      .select_item{
        padding: 40px 15px 0;
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        .title{
          height: 52px;
          width: 100%;
          span{
            color: #fff;
            background: @color;
            display: inline-block;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 23px;
          }
          p{
            margin-top: 10px;
            padding-left: 10px;
            font-size: @font-size-medium;
            font-weight: bold;
          }
        }
        .store{
          p{
            margin: 20px 0;
          }
          .img_wrapper{
            margin-top: 10px;
            height: 80px;
            width: 100%;
            img{
              width: 80px;
              height: 80px;
              &~img{
                margin-left: 10px;
              }
            }
          }
          .area{
            height: 180px;
            p{
              padding: 15px 25px 15px 15px;
              width: 100%;
              height: 100%;
              border: 0;
              background: #f4f4f4;
              resize: none;
              font-size: @font-size-medium;
              line-height: 20px;
            }
          }
        }
        
      }
    }
    footer{
      margin: 40px 0 72px 0;
      padding: 0 27px;
      width: 100%;
      button{
        width: 100%;
        height: 50px;
        border: 0;
        color: #fff;
        letter-spacing: 4px;
        line-height: 50px;
        text-align: center;
        background: @color;
      }
    }
  }
  .arrow{
    width: 18px;
    height: 18px;
    fill: @active-color;
    vertical-align: -.3em;
    overflow: hidden;
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    opacity: 0;
  }
</style>
