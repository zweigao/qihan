/**
 * Created by fangf on 2016/11/25.
 */
import * as api from '../services/customer';

export default {
  namespace:'customer',
  state: {
    list: []
  },
  effects:{
    *getList(action,{put,call,select}){
      let userId = yield select(state => state.user.id);
      let {data} = yield call(api.getList,userId);
      yield put({type:'getListAsync',list:data.data});
    },
    *sendMsg({content},{put,call,select}){
      let userId = yield select(state => state.user.id);
      yield put({type:'sendMsgAsync',sendTimestamp:+new Date(),content});
      yield call(api.sendMsg,userId,content);
    }
  },
  reducers:{
    getListAsync(state,{list}){
      state.list = list;
      return {...state};
    },
    sendMsgAsync(state,{sendTimestamp,content}){
      state.list.push({sendTimestamp,content});
      return {...state}
    }
  }
}
