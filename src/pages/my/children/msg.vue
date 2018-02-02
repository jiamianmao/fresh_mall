<template>
  <transition name='slide'>
    <div class="container">
      <x-title>消息中心</x-title>
      <div class="content">
        <div class="item vux-1px-b" v-for='(item, index) of arr' :key='index' @click='selectOne(item.message_id, item.about_order_id)'>
          <div class="left">
            <img v-if='~~item.read_state === 0' src="../../../assets/my/unread.png">
            <img v-else src="../../../assets//my/readed.png">
          </div>
          <div class="right">
            <p>
              <span>{{ item.message_type | type }}</span>
              <span>{{ item.message_time | time }}</span>
            </p>
            <p>{{ item.message_body | reg }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import XTitle from '@/components/x-title/x-title'
  import { dateFormat } from 'vux'
  import storage from 'good-storage'
  export default {
    data () {
      return {
        arr: []
      }
    },
    created () {
      this.api_token = storage.get('api_token')
      this._getMsgList()
    },
    filters: {
      type (val) {
        // 做个字典
        let dict = {
          0: '私信',
          1: '系统消息',
          2: '留言'
        }
        return dict[val]
      },
      time (val) {
        return dateFormat(~~val * 1000, 'YYYY.MM.DD HH:mm')
      },
      reg (val) {
        // 应该用正则更好，先用indexOf吧
        let idx = val.indexOf('<a')
        if (idx > -1) {
          return val.substring(0, idx)
        } else {
          return val
        }
      }
    },
    methods: {
      selectOne (id, flag) {
        this.$http.post(`/mobile/?act=member_message&op=msg_info&api_token=${this.api_token}`, {
          message_id: id
        }).then(res => {
          if (res.data.status === 200) {
            let orderSn = res.data.data.message_body.match(/20[0-9]{16}/)[0]
            this.arr.filter(item => {
              if (item.message_id === id) {
                // 减少http请求
                item.read_state = '1'
                if (flag) {
                  this.$router.push(`/my/order?hash=${orderSn}`)
                }
              }
            })
          }
        })
      },
      _getMsgList () {
        this.$http.get(`/mobile/?act=member_message&op=index&api_token=${this.api_token}`).then(res => {
          if (res.data.status === 200) {
            this.arr = res.data.data.message_list
          }
        })
      }
    },
    components: {
      XTitle
    }
  }
</script>
<style lang="less" scoped>
  @import '~common/less/variable.less';
  @import '~common/less/mixin.less';
  .container{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-height: 100vh;
    background: #fff;
    z-index: 1;
    .content{
      width: 100vw;
      .item{
        width: 100%;
        padding: 20px 15px 20px 12px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .left{
          width: 40px;
          height: 40px;
          margin-right: 20px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .right{
          flex: 1;
          height: inherit;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          font-size: @font-size-small;
          color: #999;
          overflow: hidden;
          p:first-child{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span:first-child{
              color: #333;
            }
          }
          p:last-child{
            margin-top: 12px;
            line-height: 20px;
            // .no-wrap
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
