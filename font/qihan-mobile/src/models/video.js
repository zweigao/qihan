import * as api from '../services/video'

export default {

  namespace: 'video',

  state: {
    courseList: [],
    videoList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/video') {
          dispatch({ type: 'account/fetchExamChekInInfo' })
        } else if (pathname.indexOf('/video/list') >= 0) {
          const id = /\/video\/list\/(\w*)/.exec(pathname)[1]
          dispatch({ type: 'fetchVideoList', payload: { id } })
        }
      })
    },
  },

  effects: {
    *fetchVideoList ({ payload }, { select, call, put }) {
      const { data } = yield call(() => api.getVideoList(payload.id))
      console.log(data)
      if (data.code === 1) {
        yield put({ type: 'getVideoList', payload: {list: data.data} })
      }
    }
  },

  reducers: {
    getCourseList (state, action) {
      return { ...state, courseList: action.payload }
    },
    getVideoList (state, action) {
      return { ...state, videoList: action.payload.list }
    },
  }
}
