import * as api from '../services/account'
import { routerRedux } from 'dva/router';

export default {

  namespace: 'account',

  state: {
    info: {
      id: sessionStorage.getItem('id')
    },
    examRegistorInfo: [],
    curInfoIndex: -1,
    noticeInfo: [],
    examCheckInfo: [],
    moreService: false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname.indexOf('/account') >= 0) {
          dispatch({ type: 'fetchExamRegistorInfo' })
          dispatch({ type: 'fetchUserInfo' })
          dispatch({ type: 'fetchExamChekInInfo' })
        } 
        if (pathname === '/account/notification') {
          dispatch({ type: 'fetchNoticeInfo'})
        }
        if (pathname === '/account') {
          dispatch({ type: 'fetchMoreService' })
        }
      })
    },
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { data } = yield call(() => api.login(payload.userName, payload.password))
      if (data.code === 1) {
        const info = data.data
        sessionStorage.setItem('tokenID', info.tokenId)
        sessionStorage.setItem('phoneCode', info.mobile)
        sessionStorage.setItem('id', info.id)
        yield put({type: 'setInfo', payload: {info}})
        const nextPath = sessionStorage.getItem('nextPath')
        yield put(routerRedux.push(nextPath || '/account'))
        sessionStorage.removeItem('nextPath')
      }
    },
    *logout({ payload }, { call, put }) {
      sessionStorage.removeItem('tokenID')
      sessionStorage.removeItem('id')
      yield put({type: 'setInfo', payload: {info: {}}})
      yield put(routerRedux.push('/login'))
    },
    *fetchUserInfo ({ payload }, { select, call, put }) {
      const info = yield select(state => state.account.info)
      if (!info.mobile) {
        const { data } = yield call(() => api.getStudentInfo(info.id))
        if (data.code === 1) {
          yield put({type: 'setInfo', payload: {info: data.data}})
        }
      }
    },
    *fetchExamRegistorInfo ({ payload }, { select, call, put }) {
      const account = yield select(state => state.account)
      if (account.curInfoIndex < 0) {
        const { data } = yield call(() => api.getExamRegistorInfo(account.info.id))
        if (data.code === 1) {
          yield put({type: 'setExamRegistorInfo', payload: data.data})
        }
      }
    },
    *confirmInfo ({ payload }, { call, put }) {
      const { data } = yield call(() => api.confirmInfo(payload.id))
      if (data.code === 1) {
        yield put({type: 'addCurInfoIndex'})
      }
    },
    *fetchExamChekInInfo ({ payload }, { select, call, put }) {
      const account = yield select(state => state.account)
      if (account.curInfoIndex < 0) {
        const { data } = yield call(() => api.getExamChenInInfo(account.info.id))
        if (data.code === 1) {
          yield put({type: 'getExamChekInInfo', payload: data.data})
          const couseList = data.data.map((e) => {
            const item = e.examCheckIn.courseItem
            return {
              id: item.id,
              name: item.name
            }
          })
          yield put({type: 'video/getCourseList', payload: couseList})
          yield put({type: 'exam/getCourseList', payload: couseList})
        }
      }
    },
    *fetchNoticeInfo ({ payload }, { call, put }) {
      const { data } = yield call(() => api.getNoticeInfo())
      if (data.code === 1) {
        yield put({type: 'getNotice', payload: data.data})
      }
    },
    *fetchMoreService ({ payload }, { select, call, put }) {
      const { id } = yield select(state => state.account.info)
      const { data } = yield call(() => api.getMoreService(id))
      if (data.code === 1) {
        yield put({type: 'getMoreService', payload: data.data})
      }
    }
  },

  reducers: {
    setInfo (state, action) {
      return { ...state, info: action.payload.info }
    },
    setExamRegistorInfo (state, action) {
      return { ...state, examRegistorInfo: action.payload, curInfoIndex: 0 }
    },
    addCurInfoIndex (state, action) {
      return { ...state, curInfoIndex: state.curInfoIndex + 1 }
    },
    getExamChekInInfo (state, action) {
      return { ...state, examCheckInfo: action.payload}
    },
    getNotice (state, action) {
      return { ...state, noticeInfo: action.payload}
    },
    getMoreService (state, action) {
      return { ...state, moreService: action.payload }
    }
  },

}
