/**
 * Created by fangf on 2016/11/18.
 */

import * as api from '../services/applyment';
import {message} from 'antd';

let paymentWay = {
  WECHAT:'微信转账',
  ALIPAY:'支付宝转账',
  BANK_TRANSFER:'银行转账',
};
let status = {
  WAIT_FOR_CHECK:'等待审核',
  WAIT_FOR_PAY:'等待支付',
  NORMAL:'状态正常',
  SERVICE_TIMEOUT:'账号过期',
  UNPASSED:'审核不通过'
};

export default {
  namespace:'applyment',
  state:{
    loading:false,
    data:[],
    examOptions:[],
    paymentWay,
    status
  },
  effects:{
    *getAll(action,{put,call}){
      yield put({type:'loading',...data});
      let {data} = yield call(api.getAll);
      data.data = data.data.map((v,k)=>{
        v.payWay = paymentWay[v.paymentWay];
        v.status = status[v.status];
        v.index = k;
        v.amount = v.amount?v.amount:0;
        return v;
      });
      yield put({type:'getAllAsync',...data});
    },
    *setStatus({id,status,reason,index},{put,call}){
      yield put({type:'loading'});
      let {data} = status==false?yield call(api.setStatus,id,status,reason):yield call(api.setStatus,id,status);
      if (data.code==1)
        yield put({type:'setStatusAsync',index,stat:status,reason})
      else yield put({type:'loaded'});
    },
    *setMultipleStatus({ids,status,index},{put,call}){
      yield put({type:'loading'});
      let {data} = yield call(api.setMultipleStatus,ids,status);
      if (data.code==1) {
        let errors = data.data.filter(v=>v.code!=1);
        yield put({type: 'setMultipleStatusAsync', index, stat: status, errors})
      }
    },
    *pay({id,payWay,amount,payCode,index},{put,call}){
      let {data} = yield call(api.pay,id,payWay,amount,payCode);
      if (data.code==1)
        yield put({type:'payAsync',payWay,amount,payCode,index})
    },
    *paySecond({id,payWay,amount,payCode,index},{put,call}){
      let {data} = yield call(api.paySecond,id,payWay,amount,payCode);
      if (data.code==1)
        yield put({type:'payAsync',payWay,amount,payCode,index})
    },
    *getExamOptions({registerId},{put,call}){
      let {data} = yield call(api.getExamOptions,registerId);
      if (data.code==1)
        yield put({type:'getExamOptionsAsync',examOptions:data.data});
    },
    *selectExam({userId,examId,examArea},{put,call}){
      let {data} = yield call(api.selectExam,userId,examId,examArea);
      if (data.code==1)
        yield put({type:'selectExamAsync'});
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
    getAllAsync(state,action){
      state.loading = false;
      return {...state,...action}
    },
    setStatusAsync(state,{index,stat,reason}){
      state.loading = false;
      state.data[index].status = stat?'等待支付':'审核不通过';
      if (reason) state.data[index].unPassReason = reason;
      message.success('报名状态设置成功');
      return {...state};
    },
    setMultipleStatusAsync(state,{index,stat,errors}){
      let errorIds = errors.map(v=>v.id);
      state.loading = false;
      index.map(i=>{
        if (errorIds.indexOf(state.data[i].id)<0)
          state.data[i].status = status[stat];
      });
      if (errors.length==0)
        message.success('报名状态设置成功');
      else
        message.error(errors[0].message,4);
      return {...state};
    },
    payAsync(state,{payWay,amount,payCode,index}){
      let data = state.data[index];
      state.data[index] = {...data,payWay:paymentWay[payWay],paymentWay,amount,payCode,status:'状态正常'};
      message.success('确认支付成功');
      return {...state}
    },
    getExamOptionsAsync(state,action){
      return {...state,...action}
    },
    selectExamAsync(state,action){
      message.success('报考科目成功');
      return state;
    },
    upd(state,{index,data}){
      api.upd(data);
      state.data[index] = {...state.data[index],...data};
      return {...state}
    }
  }
}
