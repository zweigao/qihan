/**
 * Created by fangf on 2016/11/21.
 * revised by ljz on2018/5/18.
 * model
 */
import * as api from '../services/exam';
import {message} from 'antd';


let status = {
  HAS_BEEN_CHECKIN:'已报考',
  UNPASSED:'未通过',
  PASSED:'已通过'
};

export default {
  namespace: 'exam',
  state: {
    loading:false,
    data:[],
    status
  },
  effects:{
    *getExamList(action,{put,call}){
      yield put({type:'loading'});
      let {data} = yield call(api.getExamList);
      data.data = data.data.map((v,k)=>{
        v.index = k;
        return v;
      });
      yield put({type:'getExamListAsync',data:data.data})
    },
    *setStatus({ids,status,index},{put,call}){
      yield put({type:'loading'});
      ids = ids.map((v)=>{
        return {examHistoryId:v,status}
      });
      yield call(api.setStatus,ids);
      yield put({type:'setStatusAsync',status,index})
    },
    *del({examId,index},{put,call}){
      yield put({type:'loading'});
      let {data} = yield call(api.del,examId);
      if (data.code==1)
        yield put({type:'delAsync',index});
      else yield put({type:'loaded'});
    },
    *exportArchives({payload}, {put, call}) {
      let res = yield call(api.exportArchives, payload.ids);
      let filename = res.headers['filename'];
      var blob = new Blob([res.data]);
      var downloadUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      a.click();
    }
  },
  reducers:{
    loading(state){
      state.loading = true;
      return {...state};
    },
    loaded(state){
      state.loading = false;
      return {...state};
    },
    getExamListAsync(state,action){
      state.loading = false;
      return {...state,...action}
    },
    setStatusAsync(state,{status,index}){
      state.loading = false;
      index.map(i=>{
        state.data[i].status = status
      });
      return {...state};
    },
    delAsync(state,{index}){
      state.loading = false;
      state.data.splice(index,1);
      message.success('删除报考记录成功');
      return {...state}
    }
  }
}
