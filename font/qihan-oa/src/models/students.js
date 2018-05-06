/**
 * Created by fangf on 2016/11/14.
 */
import React from 'react';
import * as students from '../services/students';

export default {
  namespace:'students',
  state:{
    loading: true,
    data: []
  },
  effects:{
    *getAllAsync(action,{call,put}){
      yield put({type:'loading'});
      let {data} = yield call(students.getAll);
      data.data = data.data.map((v,k)=>{
        v.index = k;
        return v;
      });
      yield put({type:'getAll',...data});
    },
  },
  reducers:{
    loading(state){
      state.loading = true;
      return {...state}
    },
    getAll(state,action){
      state.loading = false;
      return {...state,...action};
    },
    upd(state,{index,data}){
      students.upd(data);
      state.data[index] = {...state.data[index],...data};
      return {...state}
    }
  }
}
