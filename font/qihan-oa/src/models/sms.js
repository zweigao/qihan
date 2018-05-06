/**
 * Created by fangf on 2016/11/14.
 */
import * as sms from '../services/sms';
import {message} from 'antd';

export default {
  namespace: 'sms',
  state: {
    sending: false,
    loading: false,
    keywords: [
      {key: '$[姓名]', word: '姓名'},
      {key: '$[手机号]', word: '手机号'},
      {key: '$[学校名]', word: '学校名'},
      {key: '$[专业名]', word: '专业名'},
      {key: '$[身份证号]', word: '身份证号'},
      {key: '$[QQ]', word: 'QQ'},
      {key: '$[性别]', word: '性别'},
      {key: '$[地址]', word: '地址'},
      {key: '$[籍贯]', word: '籍贯'},
      {key: '$[身份证号后六位]', word: '身份证号后六位'}
    ],
    template: [],
    errors: [],
    status: ''
  },
  effects: {
    *sendSms({content,ids},{put,call}){
      yield put({type:'onSending'});
      let {data} = yield call(() => sms.sendSms(content,ids));
      let errors = [];
      if (data.code==1) message.success('发送短信成功');
      else {
        let ids = data.data.map(i=>{
          return i.id
        });
        errors.push(ids);
        let items = {};
        data.data.map(v=>{
          items[v.id] = v.message;
        });
        errors.push(items);
      }
      yield put({type:'sent',errors});
    },
    *addTemp({content},{put,call}){
      yield put({type:'onLoading'});
      yield call(()=>sms.create(content));
      yield put({type:'addTempAsync'});
    },
    *delTemp({id},{put,call}){
      yield put({type:'onLoading'});
      yield call(()=>sms.delTemp(id));
      yield put({type:'delTempAsync',id});
    },
    *getTemplateList(action,{put,call}){
      let res = yield call(sms.getTemplateList);
      yield put({
        type:'setTemplateList',
        ...res.data
      })
    },
    *getStatus(action,{put,call}){
      let {data} = yield call(sms.getStatus);
      yield put({
        type:'getStatusSync',
        status: data.data
      })
    }
  },
  reducers: {
    getStatusSync(state,{status}){
      return {...state,status}
    },
    onSending(state){
      state.sending = true;
      return {...state};
    },
    sent(state,action){
      state.sending = false;
      return {...state,...action};
    },
    onLoading(state){
      state.loading = true;
      return {...state};
    },
    loaded(state){
      state.loading = false;
      return {...state};
    },
    addTempAsync(state){
      state.loading = false;
      message.success('添加短信模板成功');
      return {...state};
    },
    delTempAsync(state,{id}){
      state.loading = false;
      state.template = state.template.filter(i=>i.id!=id);
      message.success('删除短信模板成功');
      return {...state};
    },
    setTemplateList(state,action){
      state.template = action.data;
      return {...state};
    }
  }
}
