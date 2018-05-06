/**
 * Created by fangf on 2016/11/17.
 */
import * as notify from '../services/notify';
import {message} from 'antd';

export default {
  namespace: 'notify',
  state: {
    loading:false,
    data: []
  },
  effects:{
    *getAll(action,{call,put}){
      let {data} = yield call(notify.getAll);
      yield put({type:'getAllAsync',...data});
    },
    *add({content},{call,put}){
      yield put({type:'loading'});
      let {data} = yield call(notify.add,content);
      if (data.code==1) message.success('发布系统通知成功');
      yield put({type:'getAll'})
    },
    *del({id},{call,put}){
      yield put({type:'loading'});
      yield call(notify.del,id);
      yield put({type:'delAsync',id})
    }
  },
  reducers:{
    loading(state){
      state.loading = true;
      return {...state};
    },
    delAsync(state,{id}){
      state.loading = false;
      state.data = state.data.filter(v=>v.id!=id);
      message.success('撤回通知成功');
      return {...state}
    },
    getAllAsync(state,action){
      state.loading = false;
      return {...state,...action};
    }
  }
}
