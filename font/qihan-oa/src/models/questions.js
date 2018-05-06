/**
 * Created by fangf on 2016/11/15.
 */
import * as api from '../services/questions';
import {message} from 'antd';

let uuid = 1
export default {

  namespace:'questions',

  state: {
    loading:false,
    data: [],
    selectedRows: [],
    optionKeys: [0, 1]
  },

  effects: {
    *getAll({menuItemId},{put,call}){
      if (menuItemId === undefined) {
        yield put({type:'setData',data: []})
      } else {
        yield put({type:'loading'});
        let res = yield call(api.getAll, {menuItemId});
        const data = JSON.parse(res.data.data)
        yield put({type:'setData',data})
        yield put({type:'loaded', msg: ''})
      }
    },
    *add(data,{put,call}){
      yield put({type:'loading'});
      const res = yield call(api.add, {menuItemIds: data.menuItemIds, questionBank: data.questionBank, paperName: data.paperName});
      yield put({type:'loaded',msg: res.data.code === 1 ? '添加题目成功' : ''})
    },
    *del({ids},{put,call}){
      yield put({type:'loading'});
      const res = yield call(()=>api.del(ids));
      yield put({type:'loaded',msg:res.data.code === 1? '删除题目成功' : '',ids})
    },
    *upd({ payload },{put,call}){
      yield put({type:'loading'});
      yield call(()=>api.upd(payload));
      yield put({type: 'getAll', menuItemId: payload.menuItemIds[0]})
      yield put({type:'loaded',msg:'更新题目成功'})
    },
    *updRelativeSync ({ data }, { put, call }) {
      yield put({type:'loading'});
      const postData = data.map((d) => {
        return {learnVideoId: d.learnVideoId, menuItemIds: d.menuItems.map(m => m.id)}
      })
      const res = yield call(()=>api.updRelative(postData));
      if (res.data.code === 1) {
        yield put({type: 'updRelative', data})
      }
      yield put({type:'loaded',msg:res.data.code === 1? '修改分类成功' : ''})
    }
  },

  reducers: {
    loading(state){
      state.loading = true;
      return {...state};
    },
    loaded(state,{msg,ids,row}){
      state.loading = false;
      if (ids) {
        ids.map((id) => {
          state.data = state.data.filter(i => i.id!=id)
        })
      }
      if (msg) {
        message.success(msg);
      }
      return {...state};
    },
    setData(state,action){
      return {...state,...action};
    },
    setSelectedRows(state, action) {
      return {...state, ...action}
    },
    updRelative(state, {data}) {
      const videos = state.data
      const videosId = data.map(v => v.learnVideoId)
      videos.forEach(v => {
        if (videosId.indexOf(v)) {
          v.menuArray = data[0].menuItems
        }
      })
      return {
        ...state
      }
    },
    setOptionKeys (state, {keys}) {
      uuid += keys.length
      return {
        ...state,
        optionKeys: keys
      }
    },
    addOption (state) {
      uuid++
      return {
        ...state,
        optionKeys: state.optionKeys.concat(uuid)
      }
    },
    removeOption (state, {k}) {
      if (state.optionKeys.length < 3) {
        return state
      } else {
        return {
          ...state,
          optionKeys: state.optionKeys.filter(key => key !== k)
        }
      }
    },
  }

}
