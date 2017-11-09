import * as types from './mutation-type'

export const fresh = ({commit}, {storeCondition, storeConditionPic}) => {
  commit(types.SET_STORE_CONDITION, storeCondition)
  commit(types.SET_STORE_CONDITION_PIC, storeConditionPic)
}
