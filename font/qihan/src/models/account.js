
import * as api from '../services/account'
import { routerRedux } from 'dva/router';

export default {

  namespace: 'account',

  state: {
    examRegisterInfo: [],
    noticeInfo: [],
    examCheckInfo: []
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { data } = yield call(() => api.login(payload.userName, payload.password))
      if (data.code === 1) {
        const info = data.data
        sessionStorage.setItem('tokenID', info.tokenId)
        sessionStorage.setItem('phoneCode', info.mobile)
        sessionStorage.setItem('id', info.id)
        yield put({type: 'setInfo', payload: info})
        yield put(routerRedux.push('/account'))
      }
    },
    *fetchUserInfo ({ payload }, { select, call, put }) {
      const info = yield select(state => state.account.info)
      if (!info.mobile) {
        const { data } = yield call(() => api.getStudentInfo(info.id))
        if (data.code === 1) {
          yield put({type: 'setInfo', payload: data.data})
        }
      }
    },
    *fetchExamRegisterInfo (action, { select, call, put }) {
      const { id } = yield select(state => state.user)
      const { data } = yield call(() => api.getExamRegisterInfo(id))
      if (data.code === 1)
        yield put({type: 'setExamRegisterInfo', payload: data.data})
    },
    *confirmInfo ({ id, index }, { call, put }) {
      let {data} = yield call(() => api.confirmInfo(id));
      if (data.code===1)
        yield put({type:'confirmInfoAsync',index})
    },
    *fetchExamChekInInfo ({ payload }, { select, call, put }) {
      const { id } = yield select(state => state.account.info)
      const { data } = yield call(() => api.getExamChenInInfo(id))
      if (data.code === 1) {
        yield put({type: 'getExamChekInInfo', payload: data.data})
      }
    },
    *fetchNoticeInfo ({ payload }, { call, put }) {
      const { data } = yield call(() => api.getNoticeInfo())
      if (data.code === 1) {
        yield put({type: 'getNotice', payload: data.data})
      }
    }
  },

  reducers: {
    setInfo (state, action) {
      return { ...state, info: action.payload }
    },
    setExamRegisterInfo (state, {payload}) {
      return { ...state, examRegisterInfo:payload }
    },
    getExamChekInInfo (state, action) {
      return { ...state, examCheckInfo: action.payload}
    },
    getNotice (state, action) {
      return { ...state, noticeInfo: action.payload}
    },
    confirmInfoAsync(state,{index}){
      state.examRegisterInfo[index].hasConfirmed = true;
      return {...state};
    }
  }

}
