/**
 * Created by fangf on 2016/12/22.
 */
import * as api from '../services/express';

export default {
  namespace: 'express',
  state: {
    data: [],
    list: [],
    expressData: {}
  },
  effects: {
    *add({code,companyName,fare,registerId},{put,call}){
      yield call(api.add,code,companyName,fare*100,registerId);
      yield put({type:'getListById',registerId})
    },
    *upd({id,code,companyName,fare,index},{put,call}){
      let {data} = yield call(api.upd,id,code,companyName,fare*100);
      if (data.code==1)
        yield put({type:'updSync',index,code,companyName,fare})
    },
    *del({id,index},{put,call}){
      let {data} = yield call(api.del,id);
      if (data.code==1)
        yield put({type:'delSync',index})
    },
    *getAll(action,{put,call}){
      let {data} = yield call(api.getAll);
      if (data.code==1)
        yield put({type:'getAllSync',data:data.data});
    },
    *updById({id,code,companyName,fare,registerId},{put,call}){
      let {data} = yield call(api.upd,id,code,companyName,fare*100);
      if (data.code==1)
        yield put({type:'getListById',registerId})
    },
    *delById({id,registerId},{put,call}){
      let {data} = yield call(api.del,id);
      if (data.code==1)
        yield put({type:'getListById',registerId})
    },
    *getListById({registerId},{put,call}){
      let {data} = yield call(api.getListById,registerId);
      if (data.code==1)
        yield put({type:'getListByIdSync',list:data.data?[data.data]:[]});
    },
    *exportData({ids},{call}){
      let res = yield call(api.exportData,ids);
      let filename = res.headers['filename'];
      var blob = new Blob([res.data], {type: 'applicationnd.ms-excel'});
      var downloadUrl = URL.createObjectURL(blob);
      console.log(downloadUrl);
      var a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      a.click();
    },
    *getExpressData({code},{put,call}){
      let {data} = yield call(api.getExpressData,code);
      let express = data.data||{};
      express.code = code;
      yield put({type: 'setExpressData', data: express});
    }
  },
  reducers: {
    addSync(state,action){
      delete action['type'];
      if (state.data.length>0)
        state.data.push(action);
      return {...state}
    },
    updSync(state,{index,code,companyName,fare}){
      state.data[index] = {...state.data[index],code,companyName,fare:fare*100};
      return {...state};
    },
    delSync(state,{index}){
      // delete state.data[index];
      state.data.splice(index,1);
      return {...state};
    },
    getAllSync(state,{data}){
      return {...state,data};
    },
    getListByIdSync(state,{list}){
      return {...state,list};
    },
    setExpressData(state,{data}){
      state.expressData = data;
      return {...state};
    }
  }
}
