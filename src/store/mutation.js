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
  }
}

export default mutations
