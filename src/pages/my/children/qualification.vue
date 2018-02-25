<template>
  <transition name='slide'>
    <div class="container">
      <x-title :text='text' @rightClick='save'>{{title}}</x-title>

      <div class="main_wwrapper"  v-show='!complete'>
        <main>
          <h3 class="titlename vux-1px-b">企业基本信息</h3>
          <ul class=''>
            <li class='item vux-1px-b'>
              <div class="left">公司全称</div>
              <div class="right">
                <input type='text' placeholder='请输入营业执照上的公司全称' v-model.trim='company_name' />
              </div>
            </li>
            <li class='item vux-1px-b'>
              <div class="left">营业执照注册号</div>
              <div class="right">
                <input type='text' placeholder='输入纳税识别号' v-model.trim='business_licence_number' />
              </div>
            </li>
            <li class='item vux-1px-b'>
              <div class="left">银行开户名</div>
              <div class="right">
                <input type='text' v-model.trim='bank_account_name' />
              </div>
            </li>
            <li class='item vux-1px-b'>
              <div class="left">开户行所在城市</div>
              <div class="right">
                <input type='text' v-model.trim='bank_address' />
              </div>
            </li>
            <li class='item vux-1px-b'>
              <div class="left">开户银行支行名称</div>
              <div class="right">
                <input type='text' v-model.trim='bank_subbranch_name' />
              </div>
            </li>
            <li class='item vux-1px-b'>
              <div class="left">公司对公账号</div>
              <div class="right">
                <input type='tel' v-model.trim='bank_account' />
              </div>
            </li>
            <li class='upload'>
              <div class="top">
                <div class="left">请上传营业执照照片</div>
                <div class="right"  @click='arrowToggle'>*营业执照上传要求
                  <svg class="arrow" aria-hidden="true" ref='arrow'>
                    <use xlink:href="#icon-arrow-b"></use>
                  </svg>
                </div>
              </div>
              <div class="wrapper">
                <div class="slide_box" v-show='slideDown'>
                  <p>1.证件有效期限在30天以上，有效期在30天以内不可申请</p>
                  <p>2.原件拍摄，照片不得涂改，所有图片需体现出证件的实物特征，确保完整水印、文字、图片、证件号码清晰可辨，拍照时相机或手机对焦在证件上（在手机屏幕上对着画面中的证件按一下），使证件文字清晰，这样您的认证可以尽快通过</p>
                  <p>3.请上传营业执照正本、副本</p>
                </div>
                <div class="uploader-container">
                  <div class="box">
                    <div class="img" v-if='img1'>
                      <img ref='img1'>
                      <img src="../../../assets/my/close.png" class='close' @click='close(1)'>
                    </div>
                    <van-uploader class='upload_item' :after-read="logContent" v-else>
                      <img :src="url">
                    </van-uploader>
                  </div>
                  <div class="box two">
                    <div class="img" v-if='img2'>
                      <img ref='img2' v-show='img2'>
                      <img src="../../../assets/my/close.png" class='close' @click='close(2)'>
                    </div>
                    <van-uploader class='upload_item' :after-read="logContent" v-else>
                      <img :src="url">
                    </van-uploader>
                  </div>
                </div>
              </div>
              <div class="placeholder vux-1px-b"></div>
            </li>
            <li class='upload'>
              <div class="top">
                <div class="left">请上传门店照片</div>
              </div>
              <div class="wrapper">
                <div class="slide_box">
                  <p>门店照片上传要求：要求照片展现门店正面全貌，门店名称等信息清晰完整</p>
                </div>
                <div class="uploader-container">
                  <div class="box">
                    <div class="img" v-if='img3'>
                      <img ref='img3'>
                      <img src="../../../assets/my/close.png" class='close' @click='close(3)'>
                    </div>
                    <van-uploader class='upload_item' :after-read="store" v-else>
                      <img :src="url">
                    </van-uploader>
                  </div>
                </div>
              </div>
              <div class="placeholder vux-1px-b"></div>
            </li>
            <li class='item'>
              <div class="left">认证申请人真实姓名</div>
              <div class="right">
                <input type='text' placeholder='申请人真实姓名' v-model.trim='authenticator_truename' />
              </div>
              <div class="placeholder vux-1px-b"></div>
            </li>
            <li class='item'>
              <div class="left">认证申请人身份证号</div>
              <div class="right">
                <input type='text' placeholder='申请人身份证号' v-model.trim='authenticator_idnumber' />
              </div>
            </li>
          </ul>
          <h3 class="titlename vux-1px-b">增值服务信息 <span style='font-size: 12px; color: red;'>(此项服务暂不开放)</span></h3>
          <div class="select_wrapper">
            <div class="select_item">
              <div class="title vux-1px-b">
                <span>1</span>
                <p>您是否愿意成为平台在售门店？</p>
              </div>
              <div class="content">
                <p @click='select(1, 2)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_yinliu === 2'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>是，我已阅读<a @click='see(0)' href="javascript:;">《在售门店规则》</a></span>
                </p>
                <p @click='select(1, 1)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_yinliu === 1'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>否</span>
                </p>
              </div>
            </div>
            <div class="select_item">
              <div class="title vux-1px-b">
                <span>2</span>
                <p>您是否愿意成为平台自提门店？</p>
              </div>
              <div class="content">
                <p @click='select(2, 2)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_ziti === 2'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>是，我已阅读<a @click='see(1)' href="javascript:;">《自提门店规则》</a></span>
                </p>
                <p @click='select(2, 1)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_ziti === 1'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>否</span>
                </p>
              </div>
            </div>
            <div class="select_item">
              <div class="title vux-1px-b">
                <span>3</span>
                <p>您是否愿意代收生鲜产品？</p>
              </div>
              <div class="content">
                <p @click='select(3, 2)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_storegoods === 2'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>是，<router-link to="/my/qualification/fresh">点击上传</router-link>生鲜存储资质</span>
                </p>
                <p @click='select(3, 1)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_storegoods === 1'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>否</span>
                </p>
              </div>
            </div>
            <div class="select_item">
              <div class="title vux-1px-b">
                <span>4</span>
                <p>您是否愿意配送生鲜产品？</p>
              </div>
              <div class="content">
                <p @click='select(4, 2)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_dispatching === 2'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>是，配送费根据自己公示规则收取</span>
                </p>
                <p @click='select(4, 1)'>
                  <img src="../../../assets/selectAdd/selected.png" v-if='is_dispatching === 1'>
                  <img src="../../../assets/selectAdd/select.png" v-else>
                  <span>否</span>
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <button @click='submit'>提交审核</button>
          <p>请在48小时内到“我的-资质认证”页面查看审核结果，若审核成功，您还需到此查看是否需要交纳保证金。</p>
          <p><a @click='toDesc(1)'>《保证金管理制度》</a><span style='color: red;font-size: 12px;'>试运行期暂不执行，执行时间另行通知</span></p>
        </footer>
      </div>

      <div class="status" v-show='complete'>
        <div class="box">
          <div class="item_wrapper">
            <div class="item" :class='{active: 0 <= status}'>
              <img src="../../../assets/my/status_1.png">
              <p>提交成功</p>
            </div>
            <div class="placeholder" :class='{active: 0 <= status}'></div>
            <div class="item" :class='{active: 0 <= status}'>
              <img src="../../../assets/my/status_2.png">
              <p>正在审核</p>
            </div>
            <div class="placeholder" :class='{active: 1 <= status && status < 3, fail: status === 3}'></div>
            <div class="item" :class='{active: 1 <= status && status < 3, fail: status === 3}'>
              <img v-if='status === 3' src="../../../assets/my/status_4.png">
              <img v-else src="../../../assets/my/status_3.png">
              <p v-if='status === 3'>审核失败</p>
              <p v-else>审核成功</p>
            </div>
          </div>
          <div class="content">
            <div class="text_wrapper"  v-show='status === 0'>
              <p>您可以继续浏览商品，把心仪的商品先收藏</p>
              <!--<a @click='toDesc(0)'>申请成为线下门店面免交保证金</a>-->
            </div>
            <div class="text_wrapper"  v-show='status === 1'>
              <p>恭喜您审核成功，缴纳保证金即可购买</p>
              <a href="#" @click='toPromise'>缴纳保证金</a><br>
              <a @click='toDesc(1)'>保证金管理制度</a>
            </div>
            <!-- <div class="text_wrapper"  v-show='status === 2 && !deposit'>
              <p>经审核，您属于{{store_name}}的经销门店，免交保证金</p>
            </div> -->
            <div class="text_wrapper"  v-show='status === 2 && !authority_method'>
              <p>经审核，您属于{{store_name}}的经销门店，免交保证金</p>
            </div>
            <div class="text_wrapper"  v-show='status === 3'>
              <p>请您仔细阅读资质认证的信息填写要求</p>
              <p>修改并重新提交申请，如有疑问，请联系平台客服</p>
            </div>
            <div class="text_wrapper"  v-show='status === 2 && authority_method'>
              <p>您已通过押金授权，可以购买商品。</p>
            </div>
            <div class='resubmit' v-show='status === 3'>
              <button @click='resubmit'>重新申请</button>
            </div>
          </div>
        </div>
      </div>
      <alert v-model="show" title="请注意">{{msg}}</alert>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  /* eslint-disable no-undef */
  import XTitle from '@/components/x-title/x-title'
  import { Uploader } from 'vant'
  import { Alert } from 'vux'
  import { mapGetters, mapMutations } from 'vuex'
  import storage from 'good-storage'
  import compress from '@/common/js/compress'
  export default {
    name: 'qualification',
    data () {
      return {
        complete: false, // 是否完成来决定显示哪个
        title: '资质认证',
        url: require('../../../assets/my/uploadicon.png'),
        slideDown: false,
        img1: false,
        img2: false,
        img3: false,
        show: false,
        msg: '请核对信息',
        is_yinliu: null,
        is_ziti: null,
        is_storegoods: null,
        is_dispatching: null,
        status: 3,  // 审核状态
        success: null,
        text: '保存',
        company_name: '',
        business_licence_number: '',
        bank_account_name: '',
        bank_account: '',
        bank_address: '',
        bank_subbranch_name: '',
        authenticator_truename: '',
        authenticator_idnumber: '',
        licence_pic: [],
        shop_pic: '',
        store_condition: '',
        store_condition_pic: [],
        // deposit: false,  // 是否交保证金
        store_name: '',
        store_id: null,
        authority_method: false
      }
    },
    created () {
      // examine_state     -1：没认证  0未审核 1审核通过 未交保证金 2审核通过  3 审核不通过
      // authority_method  1供应商授权  2押金授权
      this.api_token = storage.get('api_token')
      this._getStatus()
    },
    methods: {
      logContent (file) {
        compress(file.file).then(res => {
          let content = res
          return content
        }).catch(err => {
          console.log(err)
          let content = file.content
          return content
        }).then(content => {
          if (!this.$refs.img1) {
            this.img1 = true
            this.licence_pic.unshift(content)
            this.$nextTick(() => {
              this.$refs.img1.setAttribute('src', content)
            })
          } else {
            this.img2 = true
            this.licence_pic.push(content)
            this.$nextTick(() => {
              this.$refs.img2.setAttribute('src', content)
            })
          }
        })
      },
      store (file) {
        compress(file.file).then(res => {
          let content = res
          return content
        }).catch(err => {
          console.log(err)
          let content = file.content
          return content
        }).then(content => {
          this.img3 = true
          this.shop_pic = content
          this.$nextTick(() => {
            this.$refs.img3.setAttribute('src', content)
          })
        })
      },
      arrowToggle () {
        this.slideDown = !this.slideDown
        this.$refs.arrow.style.transform = this.slideDown ? 'rotate(0.5turn)' : 'rotate(0)'
      },
      // 删除上传的图片，这里实现的机制不完美
      close (n) {
        if (n === 1) {
          this.licence_pic.shift()
          this.$refs.img1.setAttribute('src', '')
          this.img1 = false
        } else if (n === 2) {
          this.licence_pic.pop()
          this.$refs.img2.setAttribute('src', '')
          this.img2 = false
        } else {
          this.shop_pic = ''
          this.$refs.img3.setAttribute('src', '')
          this.img3 = false
        }
      },
      select (n, m) {
        if (n === 1) {
          if (m === 1) {
            this.is_yinliu = 1
          } else {
            this.is_yinliu = 2
          }
        } else if (n === 2) {
          if (m === 1) {
            this.is_ziti = 1
          } else {
            this.is_ziti = 2
          }
        } else if (n === 3) {
          if (m === 1) {
            this.is_storegoods = 1
          } else {
            this.is_storegoods = 2
          }
        } else {
          if (m === 1) {
            this.is_dispatching = 1
          } else {
            this.is_dispatching = 2
          }
        }
      },
      save () {
        storage.set('upload', {
          is_yinliu: this.is_yinliu,
          is_ziti: this.is_ziti,
          is_storegoods: this.is_storegoods,
          is_dispatching: this.is_dispatching,
          company_name: this.company_name,
          business_licence_number: this.business_licence_number,
          bank_account_name: this.bank_account_name,
          bank_account: this.bank_account,
          bank_address: this.bank_address,
          bank_subbranch_name: this.bank_subbranch_name,
          authenticator_truename: this.authenticator_truename,
          authenticator_idnumber: this.authenticator_idnumber,
          store_condition: this.store_condition
        })
        this.show = true
        this.msg = '已成功保存'
      },
      see (num) {
        let dict = {
          0: 'online_rule',
          1: 'pickup_rule'
        }
        this.$router.push(`/service?type=${dict[num]}`)
      },
      toDesc (id) {
        let titles = ['申请成为线下门店', '保证金制度']
        this.$router.push({
          path: '/desc',
          query: {
            title: titles[id]
          }
        })
      },
      submit () {
        if (!this.company_name || !this.business_licence_number || !this.bank_account_name || !this.bank_account || !this.bank_address || !this.bank_subbranch_name || !this.authenticator_truename || !this.authenticator_idnumber || !this.is_yinliu || !this.is_ziti || !this.is_storegoods || !this.is_dispatching || !this.licence_pic.length || !this.shop_pic) {
          this.show = true
          this.msg = '请完整输入信息'
        } else if (this.is_storegoods === 2 && !this.storeCondition) {
          this.show = true
          this.msg = '请上传生鲜存储资质'
        } else if (!this.authenticator_idnumber.match(/^(\d{15}|\d{17}[\dxX])$/)) {
          this.show = true
          this.msg = '请输入正确的身份证号'
        } else {
          // 提交审核也是保存，采用vuex，上边的save()采用缓存
          this.set_qualification({
            is_yinliu: this.is_yinliu,
            is_ziti: this.is_ziti,
            is_storegoods: this.is_storegoods,
            is_dispatching: this.is_dispatching,
            company_name: this.company_name,
            business_licence_number: this.business_licence_number,
            bank_account_name: this.bank_account_name,
            bank_account: this.bank_account,
            bank_address: this.bank_address,
            bank_subbranch_name: this.bank_subbranch_name,
            authenticator_truename: this.authenticator_truename,
            authenticator_idnumber: this.authenticator_idnumber,
            store_condition: this.store_condition,
            licence_pic: this.licence_pic,
            shop_pic: this.shop_pic,
            store_condition_pic: this.store_condition_pic
          })
          this.$router.push('/my/qualification/sure')
        }
      },
      toPromise () {
        this.$router.push('/pay')
      },
      resubmit () {
        this.complete = false
      },
      _getStatus () {
        this.$http.get(`mobile/?act=member_index&op=authority_state&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            let data = res.data.data
            if (~~data.examine_state === -1) {
              Object.assign(this, storage.get('upload'))
            } else {
              if (parseInt(data.company_info.authority_method) === 1) {
                this.authority_method = false
              } else {
                this.authority_method = true
              }
              this.store_name = data.company_info.store_name
              this.complete = true
              this.title = '审核状态'
              this.text = ''
              this.status = data.examine_state | 0
              // this.complete = false
              // this.status = 1
              this.store_id = data.company_info.store_id
            }
          }
        })
      },
      ...mapMutations({
        set_qualification: 'SET_QUALIFICATION'
      })
    },
    computed: {
      ...mapGetters([
        'storeConditionPic',
        'storeCondition'
      ])
    },
    components: {
      XTitle,
      Uploader,
      Alert
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    min-height: 603px;
    background: #fff;
    z-index: 1;
    .main_wwrapper{
      width: 100%;
      height: calc(~"100vh - 50px");
      main{
        width: 100%;
        h3{
          position: relative;
          padding-left: 36px;
          height: 52px;
          line-height: 52px;
          letter-spacing: 1px;
          background: #f4f4f4;
          font-size: @font-size-medium-x;
          &:before{
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translate3d(0, -50%, 0);
            height: 20px;
            width: 7px;
            background: @color;
          }
        }
        ul{
          width: 100%;
          padding-left: 15px;
          font-size: @font-size-medium;
          color: #333;
          .item, .top{
            width: 100%;
            height: 50px;
            line-height: 50px;
            display: flex;
            flex-flow: row nowrap;
            position: relative;
            .right{
              padding-right: 15px;
              flex: 1;
              text-align: right;
              input{
                width: 100%;
                text-align: right;
                height: 45px%;
                border: 0;
                vertical-align: middle;
              }
              .arrow{
                width: 18px;
                height: 18px;
                fill: @active-color;
                vertical-align: -.3em;
                overflow: hidden;
              }
            }
            .placeholder{
              position: absolute;
              bottom: 0;
              left: -15px;
              right: 0;
              height: 1px;
            }
          }
          .upload{
            width: 100%;
            position: relative;
            padding-bottom: 10px;
            .top{
              .right{
                color: @color;
              }
            }
            .wrapper{
              padding-right: 15px;
              width: 100%;
              .slide_box{
                width: 100%;
                padding: 12px;
                color: #666;
                font-size: @font-size-small;
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-between;
                background: #f4f4f4;
                p{
                  line-height: 18px;
                }
              }
              .uploader-container{
                margin-top: 10px;
                width: 100%;
                display: flex;
                flex-flow: row nowrap;
                position: relative;
                .box{
                  position: relative;
                  .close{
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: translate3d(40%, -40%, 0);
                    width: 20px;
                    height: 20px;
                  }
                }
                img{
                  width: 82px;
                  height: 82px;
                }
                .two{
                  margin-left: 10px;
                }
              }
            }
            .placeholder{
              position: absolute;
              bottom: 0;
              left: -15px;
              right: 0;
              height: 1px;
            }
          }
        }
        .select_wrapper{
          width: 100%;
          padding-bottom: 35px;
          .select_item{
            padding: 40px 15px 0;
            width: 100%;
            height: 176px;
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
            .content{
              flex: 1;
              display: flex;
              flex-flow: column nowrap;
              justify-content: flex-end;
              color: #666;
              p~p{
                margin-top: 10px;
              }
              img{
                width: 18px;
                height: 18px;
                vertical-align: -.2em;
                margin-right: 10px;
              }
              a{
                color: @color;
                border-bottom: 1px solid @color;
              }
            }
          }
        }
      }
      footer{
        width: 100%;
        height: 284px;
        background: #f4f4f4;
        padding: 40px 20px 0 27px;
        button{
          width: 95%;
          height: 49px;
          color: #fff;
          background: @color;
          letter-spacing: 4px;
          text-align: center;
          line-height: 49px;
          border: 0;
          margin-bottom: 20px;
        }
        p{
          line-height: 22px;
          font-size: @font-size-medium;
          color: #333;
          text-align: center;
          &~p{
            margin-top: 10px;
            a{
              color: @color;
              border-bottom: 1px solid @color;
            }
          }
        }
      }
    }
    .status{
      width: 100%;
      height: calc(~"100vh - 50px");
      background: #f4f4f4;
      padding-top: 27.907vh;
      .box{
        height: 216px;
        width: 100vw;
        .item_wrapper{
          width: 100%;
          height: 45px;
          padding: 0 20px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-around;
          .item{
            width: 45px;
            height: 45px;
            background: #ccc;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            p{
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translate3d(-50%, 0, 0);
              width: 60px;
              font-size: @font-size-small;
              text-align: center;
              color: #999;
            }
            img{
              width: 19px;
              height: 19px;
            }
            &.active{
              background: @color;
              p{
                color: @color;
              }
            }
            &.fail{
              background: #FF4467;
              p{
                color: #FF4467;
              }
            }
          }
          .placeholder{
            width: 65px;
            border-top: 1px dashed #ccc;
            &.active{
              border-top: 1px dashed @color;
            }
            &.fail{
              border-top: 1px dashed #FF4467;
            }
          }
        }
        .content{
          margin-top: 88px;
          text-align: center;
          color: #333;
          font-size: @font-size-medium;
          p{
            line-height: 22px;
          }
          a{
            display: inline-block;
            margin: 15px 0;
            color: @color;
            border-bottom: 1px solid @color;
            &~a{
              margin: 0;
            }
          }
          .resubmit{
            margin-top: 20px;
            button {
              border: 0;
              padding: 15px 30px;
              background: @color;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .slide-enter-active, .slide-leave-active{
    transition: all .5s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
