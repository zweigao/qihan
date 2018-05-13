/**
 * Created by fangf on 2016/11/14.
 * model文件
 * revised by ljz
 */
import React from 'react';
import * as students from '../services/students';
import * as api from '../services/exam';
import {message} from 'antd';

let status = {
  HAS_BEEN_CHECKIN:'已报考',
  UNPASSED:'未通过',
  PASSED:'已通过'
};

export default {
  namespace:'students',
  state:{
    loading: true,
    data: [],
    examdata: [],
    status
  },
  effects:{
    //获取所有的学院信息
    *getAllAsync(action,{call,put}){
      yield put({type:'loading'});
      //调用server获取后台数据
      let {data} = yield call(students.getAll);
      data.examdata = [];
      data.data = data.data.map((v,k)=>{
        //v:data.data[index],k:index
        v.examinfo.map((v1,k1)=>{
          v1.index = k1;
          return v1;
        })
        data.examdata[k] = v.examinfo;
        v.index = k;
        return v;
      });console.log(data)
      //调用reducer的getAll，传递数据data
      yield put({type:'getAll',...data});
    },
    //修改考试状态
    *setStatus({ids,status,stuIndex,examIndex},{put,call}){
      yield put({type:'loading'});
      ids = ids.map((v)=>{
        return {examHistoryId:v,status}
      });
      yield call(api.setStatus,ids);
      yield put({type:'setStatusAsync',status,stuIndex,examIndex});
    },
    *del({examId,stuIndex,examIndex},{put,call}){
      yield put({type:'loading'});
      let {data} = yield call(api.del,examId);
      if (data.code==1)
        yield put({type:'delAsync',stuIndex,examIndex});
      else yield put({type:'loaded'});
    },
    *setExamData({index},{put,call}){
      yield put({type:'loading'});
      yield put({type:'setExamDataAsync',index});
    },
    //导出报考表
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
  //接收action，同步更新state
  reducers:{
    loading(state){
      state.loading = true;
      return {...state}
    },
    //返回所有的数据
    getAll(state,action){
      state.loading = false;
      return {...state,...action};
    },
    upd(state,{index,data}){
      students.upd(data);
      state.data[index] = {...state.data[index],...data};
      return {...state}
    },
    loaded(state){
      state.loading = false;
      return {...state};
    },
    //设置状态:这里的examIndex是一个数组，存所有需要修改状态的考试的index
    setStatusAsync(state,{status,stuIndex,examIndex}){
      state.loading = false;
      examIndex.map(i=>{
        state.data[stuIndex].examinfo[i].status = status;
        state.examdata[stuIndex][i].status = status;
      });
      return {...state};
    },
    //删除某个报考记录
    delAsync(state,{stuIndex,examIndex}){
      state.loading = false;
      state.examdata[stuIndex].splice(examIndex,1);
      message.success('删除报考记录成功');
      return {...state}
    }
  }
}
