/**
 * Created by fangf on 2016/11/21.
 */
import * as api from '../services/register';
import {message} from 'antd';

export default {
  namespace: 'register',
  state: {
    loading:false,
    applyments:[],
    applyTimes:[],
    exams:[],
    examTimes:[]
  },
  effects:{
    *getApplymentList(action,{put,call}){
      let {data} = yield call(api.getApplymentList);
      yield put({type:'asyncList',applyments:data.data})
    },
    *addTime({menuId,timeName,times},{put,call}){
      let {data} = yield call(api.addTime,menuId,timeName,times[0],times[1]);
      if (data.code==1) message.success('添加报名时间成功')
    },
    *getTimeList({menuId},{put,call}){
      let {data} = yield call(api.getTimeList,menuId);
      yield put({type:'asyncList',applyTimes:data.data})
    },
    *delTime({timeId},{put,call}){
      let {data} = yield call(api.delTime,timeId);
      if (data.code==1) message.success('删除报名时段成功')
    },
    *updTime({timeId,timeName,times},{put,call}){
      let {data} = yield call(api.updTime,timeId,timeName,times[0],times[1]);
      if (data.code==1) message.success('更新报名时间成功')
    },
    *getExamList(action,{put,call}){
      let {data} = yield call(api.getExamList);
      yield put({type:'asyncList',exams:data.data})
    },
    *addExamTime({menuId,timeName,times},{put,call}){
      let {data} = yield call(api.addExamTime,menuId,timeName,times[0],times[1]);
      if (data.code==1) message.success('添加报考时间成功')
    },
    *getExamTimeList({menuId},{put,call}){
      let {data} = yield call(api.getExamTimeList,menuId);
      yield put({type:'asyncList',examTimes:data.data})
    },
    *delExamTime({timeId},{put,call}){
      let {data} = yield call(api.delExamTime,timeId);
      if (data.code==1) message.success('删除报考时段成功')
    },
    *updExamTime({timeId,timeName,times},{put,call}){
      let {data} = yield call(api.updExamTime,timeId,timeName,times[0],times[1]);
      if (data.code==1) message.success('更新报考时间成功')
    }
  },
  reducers:{
    asyncList(state,action){
      return {...state, ...action}
    }
  }
}
