
import * as api from '../services/service'
import { Toast } from 'antd-mobile';

export default {

  namespace: 'service',

  state: {
    services: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/account/service') {
          dispatch({ type: 'fetchServiceHistory' })
        }
      })
    },
  },

  effects: {
    *fetchServiceHistory ({ payload }, { select, call, put }) {
      const { id } = yield select(state => state.account.info)
      const { data } = yield call(() => api.getCustomerServiceHistory(id))
      if (data.code === 1) {
        if (data.data.length === 0) {
          data.data = [{
            isOfficial: true,
            content: '请问有什么可以帮助您的？',
            sendTimestamp: +(new Date())
          }]
        }
        yield put({type: 'getServices', payload: data.data})
      }
    },
    *sendRequest ({ payload }, { select, call, put }) {
      const { id } = yield select(state => state.account.info)
      const { data } = yield call(() => api.sendRequest(id, payload.content))
      if (data.code === 1) {
        yield put({type: 'addService', payload: { ...payload, sendTimestamp: +(new Date())}})
      }
    }
  },

  reducers: {
    getServices (state, action) {
      const services = action.payload.length === state.services.length ? state.service : action.payload
      return { ...state, services: action.payload }
    },
    addService (state, action) {
      return { ...state, services: state.services.concat(action.payload)}
    }
  }
}
