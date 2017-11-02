import * as types from './mutation-type'

const mutations = {
  [types.SET_START_PAGE] (state, flag) {
    state.startPage = flag
  }
}

export default mutations
