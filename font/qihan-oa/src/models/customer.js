import React from 'react';
import * as api from '../services/customer';

export default {
  namespace:'customer',
  state:{
    loading: true,
    replyLoading: false,
    services: {
      hasRead: [],
      notRead: []
    },
    currentId: -1,
    session: [],
    customer: {}
  },
  effects:{
    /* *getAllAsync (action,{call,put}){
      yield put({type:'loading'});
      let {data} = yield call(api.getAll);
      let currentId = -1
      if (data.code === 1) {
        let d = data.data
        let services = {}
        d.forEach((k) => {
          if (!services[k.askStudent.id]) {
            services[k.askStudent.id] = { name: k.askStudent.name, mobile: k.askStudent.mobile, hasRead: true, list: []}
          }
          if (!k.isOfficial) {
            services[k.askStudent.id].hasRead = services[k.askStudent.id].hasRead&&k.hasRead
          }
          services[k.askStudent.id].list.push(k)
        });
        yield put({type:'getAll', services, currentId})
      }
    },*/
    *getSessionList({hasRead},{call,put}){
      let {data} = yield call(api.getSessionList,hasRead);
      yield put({type: 'getSessionListAsync',list:data.data,hasRead})
    },
    *getCurrentSession({currentId},{call,put}){
      let {data} = yield call(api.getCurrentSession,currentId);
      let session = data.data;
      yield put({type: 'getCurrentSessionAsync',session,currentId})
    },
    *reply ({currentId,content}, {call, put}) {
      yield put({type: 'replyLoading'});
      let {data} = yield call(api.reply,currentId,content);
      yield put({type: 'replyAsync',id:data.data,content})
    },
    *getUserInfo({userId}, {call, put}){
      let {data} = yield call(api.getUserInfo, userId);
      yield put({type:'getUserInfoAsync',customer: data.data});
      yield put({type:'getCurrentSession',currentId: userId})
    }
  },
  reducers:{
    loading(state){
      return {...state, loading: true}
    },
    replyLoading(state){
      state.replyLoading = true;
      return {...state}
    },
    replyAsync(state,{id,content}){
      state.replyLoading = false;
      state.session.push({isOfficial:true,id,content,sendTimestamp:+new Date()});
      return {...state}
    },
    setCurrent(state,{id}){
      state.currentId = id;
      state.services[id].hasClick = true;
      return {...state};
    },
    /*getAll(state,action){
      state.loading = false;
      return {...state, ...action};
    },*/
    getSessionListAsync(state,{list,hasRead}){
      state.services[hasRead?'hasRead':'notRead'] = list;
      return {...state};
    },
    getCurrentSessionAsync(state,action){
      state.services.notRead = state.services.notRead.map(v=>{
        if (v.id==action.currentId)
          v.hasClick = true;
        return v;
      });
      return {...state,...action};
    },
    getUserInfoAsync(state,action){
      return {...state,...action};
    }
  }
}
