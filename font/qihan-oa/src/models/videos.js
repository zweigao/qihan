/**
 * Created by fangf on 2016/11/15.
 */
import * as videos from '../services/videos';
import {message} from 'antd';

export default {

  namespace:'videos',

  state: {
    loading:false,
    data: [],
    selectedRows: []
  },

  effects: {
    *getAll({menuItemId},{put,call}){
      if (menuItemId === undefined) {
        yield put({type:'setData',data: []})
      } else {
        yield put({type:'loading'});
        let res = yield call(videos.getAll, {menuItemId});
        yield put({type:'setData',...res.data})
        yield put({type:'loaded', msg: '获取成功'})
      }
    },
    *add({url,title,category},{put,call}){
      yield put({type:'loading'});
      yield call(()=>videos.add(url,title,category));
      yield put({type:'loaded',msg:'添加视频资源成功'})
    },
    *del({ids},{put,call}){
      yield put({type:'loading'});
      const res = yield call(()=>videos.del(ids));
      yield put({type:'loaded',msg:res.data.code === 1? '删除视频资源成功' : '',ids})
    },
    *upd({id,url,title,category},{put,call}){
      yield put({type:'loading'});
      yield call(()=>videos.upd(id,url,title,category));
      yield put({type:'loaded',msg:'更新视频资源成功',row:{id,url,title}})
    },
    *updRelativeSync ({ data }, { put, call }) {
      yield put({type:'loading'});
      const postData = data.map((d) => {
        return {learnVideoId: d.learnVideoId, menuItemIds: d.menuItems.map(m => m.id)}
      })
      const res = yield call(()=>videos.updRelative(postData));
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
      if (row){
        state.data = state.data.map(v=>{
          if (v.id==row.id){
            v.name = row.title;
            v.videoUrl = row.url;
          }
          return v;
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
    }
  }

}
