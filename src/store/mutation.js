import * as types from './mutation-type'

const mutations = {
  [types.SET_START_PAGE] (state, flag) {
    state.startPage = flag
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
  }
}

export default mutations
