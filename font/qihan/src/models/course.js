/**
 * Created by fangf on 2016/11/25.
 */
import * as api from '../services/course';

export default {
  namespace: 'course',
  state: {
    videos: [],
    papers: [],
    questions: [],
    chapters: [],
    types:{
      SINGLE_OPTION:'单选题',
      MULTIPLE_OPTION:'多选题',
      FILL_IN:'填空题',
      HEARING:'听力题',
      DESCRIPTION:'简述题',
      TRUE_OR_FALSE:'判断题'
    }
  },
  effects:{
    *getVideos({menuId},{put,call}){
      let {data} = yield call(api.getVideos,menuId);
      let videos = data.data;
      yield put({type:'setData',videos});
    },
    *getPaperList({menuId},{put,call}){
      let {data} = yield call(api.getPaperList,menuId);
      let papers = data.data.list.filter(v=>!v.hiddenFlag);
      papers = papers.map((v,k)=>({index:k,name:v}));
      yield put({type:'setData',papers});
    },
    *getPaperQuestions({courseId,paperName},{put,call}){
      let {data} = yield call(api.getPaperQuestions,courseId,paperName);
      let questions = data.data.filter(v=>!v.hiddenFlag);
      yield put({type:'setData',questions});
    },
    *getChapterList({menuId},{put,call}){
      let {data} = yield call(api.getChapterList,menuId);
      let chapters = data.data.filter(v=>!v.hiddenFlag);
      yield put({type:'setData',chapters});
    },
    *getChapterQuestions({menuId},{put,call}){
      let {data} = yield call(api.getChapterQuestions,menuId);
      let questions = data.data.filter(v=>!v.hiddenFlag);
      yield put({type:'setData',questions});
    }
  },
  reducers:{
    setData(state,action){
      return {...state,...action}
    }
  }
}
