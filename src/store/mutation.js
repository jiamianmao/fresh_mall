import * as types from './mutation-type'

const mutations = {
  [types.SET_START_PAGE] (state, flag) {
    state.startPage = flag
  },
  [types.SET_STORE_CONDITION] (state, storeCondition) {
    state.storeCondition = storeCondition
  },
  [types.SET_STORE_CONDITION_PIC] (state, storeConditionPic) {
    state.storeConditionPic = storeConditionPic
  },
  [types.SET_QUALIFICATION] (state, qualification) {
    state.qualification = qualification
  },
  [types.SET_INVOICE] (state, invoice) {
    state.invoice = invoice
  },
  [types.SET_ADDRESS] (state, ids) {
    state.address[ids.brand_id] = ids.address
  },
  [types.SET_ADDRESS_TYPE] (state, data) {
    // 以品牌id为key， 配送方式，店铺id，店铺名为value
    state.addressType[data.id] = {
      transport: data.transport,
      store_id: data.store_id,
      store_add: data.store_add,
      store_name: data.store_name
    }
  },
  [types.SET_CART_COUNT] (state, num) {
    state.cartCount = num
  },
  [types.SET_POSITION] (state, position) {
    state.position = position
  },
  [types.SET_USERINFO] (state, info) {
    state.userInfo = info
  },
  [types.SET_IS_LOADING] (state, flag) {
    state.isLoading = flag
  },
  [types.SET_MAKE_ORDER] (state, flag) {
    state.makeOrder = flag
  }
}

export default mutations
