import { createStore, createLogger } from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutation'
import state from './state'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  actions,
  getters,
  mutations,
  state,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
