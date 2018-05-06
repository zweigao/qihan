/**
 * Created by fangf on 2016/12/21.
 */
import * as api from '../services/manager';
import {message} from 'antd';
import {browserHistory} from 'dva/router';

export default {
  namespace: 'manager',
  state: {
    data: [],
    achievement: []
  },
  effects:{
    *getList({tokenType},{put,call}){
      let {data} = yield call(api.getAll,tokenType);
      if (data.code === 1) {
        yield put({type:'setList',data:data.data})
      }
    },
    *add({name,userName,password,idCard,tokenType},{put,call}){
      let {data} = yield call(api.add,name,userName,password,idCard,tokenType);
      if (data.code==1)
        yield put({type:'addSync',staff:{id:data.data,managerName:name,userName,identityCardCode:idCard}})
    },
    *upd({id,name,userName,password,idCard,index},{put,call}){
      let {data} = yield call(api.upd,id,name,userName,password,idCard);
      if (data.code==1)
        yield put({type:'updSync',index,staff:{managerName:name,userName,identityCardCode:idCard}})
    },
    *changePwd({id,oldPwd,newPwd}, {put,call}){
      let {data} = yield call(api.changePwd,id,oldPwd,newPwd);
      if (data.code==1) {
        sessionStorage.removeItem('tokenID')
        sessionStorage.removeItem('tokenType')
        sessionStorage.removeItem('id')
        browserHistory.push('/login')
        message.success('修改密码成功，请重新登录')
      }
    }
  },
  reducers:{
    setList(state, {data}){
      return {...state, data}
    },
    addSync(state, {staff}){
      message.success('添加人员成功');
      if (state.data.length > 0)
        state.data.push(staff);
      return {...state};
    },
    updSync(state, {index,staff}){
      message.success('更新人员信息成功');
      state.data[index] = {...state.data[index], ...staff};
      return {...state};
    },
    ban(state, {index}){
      let {id,activityFlag} = state.data[index];
      api.ban(id,activityFlag);
      state.data[index].activityFlag = !activityFlag;
      return {...state}
    }
  }
}
