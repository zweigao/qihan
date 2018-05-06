import * as api from '../services/exam'
import { routerRedux } from 'dva/router';

const SIZE = 10

const dataSourceInit = {
  dataBlob: {},
  sectionIDs: [],
  rowIDs: []
}

export default {

  namespace: 'exam',

  state: {
    courseList: [],
    chapterList: [],
    dataSource: dataSourceInit,
    pageIndex: 0,
    loading: false,
    total: 1,
    questionList: [],
    curQueIndex: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/exam') {
          dispatch({ type: 'account/fetchExamChekInInfo' })
        } else if (pathname.indexOf('chapter') >= 0) {
          const id = /\/exam\/chapter\/(\w*)/.exec(pathname)[1]
          dispatch({ type: 'fetchChapterList', payload: { id }})
        } else if (pathname.indexOf('question') >= 0) {
          // dispatch(routerRedux.push(`/exam`))
          const id = /\/exam\/question\/(\w*)/.exec(pathname)[1]
          // dispatch({ type: 'fetchQuestions', payload: { id }})
        }
      })
    },
  },

  effects: {
    *fetchSubMenuList ({ payload }, { select, call, put }) {
      if (!payload.id) {
        yield put(routerRedux.push('/exam'))
      } else {
        const { pageIndex, dataSource, loading, total } = yield select(state => state.exam)
        yield put({ type: 'toggleLoading', payload: {loading: true} })
        const  { data } = yield call(() => api.getPaperList({ courseItemid: +payload.id, pageIndex: pageIndex * SIZE, pageSize: SIZE}))
        if (data.code === 1 && data.data.list.length > 0) {
          yield put({ type: 'getPaperList', payload: {list: data.data.list, pageIndex, total: data.data.sum} })
        }
      }
    },
    *fetchChapterList ({ payload }, { select, call, put }) {
      if (!payload.id) {
        yield put(routerRedux.push('/exam'))
      } else {
        const  { data } = yield call(() => api.getChapterList({ courseItemId: +payload.id }))
        if (data.code === 1 && data.data.length > 0) {
          yield put({ type: 'getChapterList', payload: {list: data.data} })
        }
      }
    },
    *fetchQuestions ({ payload }, { select, call, put }) {
      let resp
      if (payload.type === 'paper') {
        resp = yield call(() => api.getPaperQuestionBank({ courseItemId: +payload.id, paperName: payload.paperName }))
      } else {
        resp = yield call(() => api.getChapterQuestionBank({ chapterId: +payload.id }))
      }
      if (resp.data.code === 1) {
        yield put({ type: 'getQuestions', payload: {list: resp.data.data} })
        yield put(routerRedux.push(`/exam/question/${payload.id}`))
      }
    }
  },

  reducers: {
    getCourseList (state, action) {
      return { ...state, courseList: action.payload }
    },
    toggleLoading (state, action) {
      return { ...state, loading: action.payload.loading}
    },
    getChapterList (state, action) {
      return { ...state, chapterList: action.payload.list}
    },
    getPaperList (state, action) {
      let { dataSource } = state
      const { payload } = action
      const ii = payload.pageIndex
      const sectionName = `Section ${ii}`
      if (!dataSource.dataBlob[sectionName]) {
        dataSource.sectionIDs.push(sectionName)
        dataSource.dataBlob[sectionName] = sectionName
        dataSource.rowIDs[ii] = []
        payload.list.map((d, jj) => {
          const rowName = `S${ii}, R${jj}`
          dataSource.rowIDs[ii].push(rowName)
          dataSource.dataBlob[rowName] = d
        })
        return { ...state, dataSource: {...dataSource}, pageIndex: payload.pageIndex + 1, loading: false, total: payload.total }
      } else {
        return state        
      }
    },
    clearDataSource (state, action) {
      return { ...state, dataSource: dataSourceInit}
    },
    getQuestions (state, action) {
      action.payload.list.forEach((q) => {
        q.showAnswer = false
        q.stuAnswer = null
      })
      return { ...state, questionList: action.payload.list, curQueIndex: 0 }
    },
    nextQue (state, action) {
      if (state.curQueIndex < state.questionList.length - 1) {
        return { ...state, curQueIndex: ++state.curQueIndex }
      } else {
        return state
      }
    },
    prevQue (state, action) {
      if (state.curQueIndex > 0) {
        return { ...state, curQueIndex: --state.curQueIndex }
      } else {
        return state
      }
    },
    toggleAnswer (state, action) {
      const list = state.questionList.concat()
      list[state.curQueIndex].showAnswer = !list[state.curQueIndex].showAnswer
      return { ...state, questionList: list }
    },
    answer (state, action) {
      const list = state.questionList.concat()
      const answer = action.payload.answer
      let curQue = list[state.curQueIndex]
      if (curQue.showAnswer) {
        return state
      }
      if (curQue.questionType === 'SINGLE_OPTION' || curQue.questionType === 'TRUE_OR_FALSE'
        || curQue.questionType === 'DESCRIPTION' || curQue.questionType === 'FILL_IN') {
          if (curQue.stuAnswer === null) {
            curQue.stuAnswer = answer
            curQue.showAnswer = true
          }
      } else if (curQue.questionType === 'MULTIPLE_OPTION') {
        curQue.stuAnswer = curQue.stuAnswer || []
        if (curQue.stuAnswer.indexOf(answer) < 0) {
          curQue.stuAnswer.push(answer)
        } else {
          curQue.stuAnswer = curQue.stuAnswer.filter((a) => answer !== a)
        }
      }
      return { ...state, questionList: list }
    }
  }
}
