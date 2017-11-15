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
    state.addressType[data.id] = data.transport
  }
}

export default mutations
