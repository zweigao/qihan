// import * as api from '../services/video'

export default {

  namespace: 'global',

  state: {
    title: '',
    onLeftClick: null
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname.indexOf('question') >= 0) {
          dispatch({ type: 'updateTitle' })
        } else if (pathname === '/applyment') {
          dispatch({ type: 'setTitle', payload: { title: '报名 - 启翰教育' } })
        } else {
          dispatch({ type: 'setTitle', payload: { title: '' } })
        }
      })
    },
  },

  effects: {
    *updateTitle ({ payload }, { select, call, put }) {
      const { questionList, curQueIndex } = yield select(state => state.exam)
      yield put({ type: 'setTitle', payload: {title: `${curQueIndex+1} / ${questionList.length}`} })
    }
  },

  reducers: {
    setTitle (state, action) {
      return { ...state, title: action.payload.title }
    },
    setOnLeftClick (state, action) {
      return { ...state, onLeftClick: action.payload.onLeftClick}
    }
  }
}
