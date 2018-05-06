/**
 * Created by fangf on 2016/11/13.
 */
import * as treeUtil from '../utils/tree-data-utils';
import * as category from '../services/category';
import {message} from 'antd';

function getNodeKey({ node: _node, treeIndex }) {
  return treeIndex;
}

function getTree(data,id,level) {
  let treeData = [];
  for (let v of data){
    if (v.fatherItem&&v.fatherItem.id==id){
      v.level = level;
      v.title = v.name;
      v.children = getTree(data,v.id,level+1);
      v.value = v.id
      v.key = v.name
      v.label = v.name
      treeData.push(v);
      // treeData = treeData.concat(getTree(data,v.id,level+1));
    }
  }
  return treeData;
}

function getStruct(data) {
  let struct = [];
  for (let v of data){
    if (v.children&&v.children.length != 0) {
      for (let c of v.children)
        struct.push({id: c.id, fatherId: v.id});
      struct = struct.concat(getStruct(v.children));
    }
  }
  return struct;
}

export default {

  namespace: 'category',

  state: {
    loading: false,
    data: [],
    selCategory: [],
    fieldsList: {},
    rawData: {}
  },

  effects: {
    *getList(action,{call,put}){
      let {data} = yield call(category.getList);
      if (data.code === 1) {
        let treeData = getTree(data.data,0,1);
        let rawData = {}
        data.data.forEach((k) => {
          rawData[k.id] = {
            id: k.id,
            name: k.name,
            isCourse: k.isCourse,
            isChapter: k.isChapter
          }
        })
        yield put({type:'setList', data: treeData, rawData: rawData})
      }
    },
    *add({pid,text,key},{call,put}){
      let {data} = yield call(()=>category.add(pid,text));
      let id = data.data;
      yield put({type:'addAsync',id,text,key})
    },
    *upd({id,text,path},{call,put}){
      yield call(()=>category.upd(id,text));
      yield put({type:'updAsync',text,path})
    },
    *del({id,path},{call,put}){
      let res = yield call(()=>category.del(id));
      if (res.data.code == 1)
        yield put({type:'delAsync',path})
    },
    *saveMenu({data},{call,put}){
      yield put({type:'loading'});
      // console.log(data);
      let struct = getStruct(data);
      for (let v of data) struct.unshift({id:v.id,fatherId:0});
      let res = yield call(()=>category.updateStruct(struct));
      if (res.data.code==1)
        message.success('菜单分类列表保存成功');
      yield put({type:'loaded'})
    },
    *getFieldsList(action,{call,put}){
      let {data} = yield call(category.getFieldsList);
      let fieldsList = {};
      data.data.map(v=>{
        fieldsList[v.registerItem.id] = v;
      });
      yield put({type:'setFieldsList',fieldsList})
    },
    *saveFields({menuId,fields},{call,put}){
      if (!fields)
        return;
      let {data} = yield call(category.saveFields,menuId,fields);
      if (data.code==1){
        message.success('保存必填字段成功');
        yield put({type:'saveFieldsAsync',menuId})
      }
    },
    *delFieldsSet({menuId},{call,put}){
      let {data} = yield call(category.delFieldsSet,menuId);
      if (data.code==1)
        message.success('清除报考材料设置成功');
      yield put({type:'delFieldsSetAsync',menuId});
    },
    *copyResourse({ payload: { sourId, destId } },{call,put}){
      let { data } = yield call(category.copyResourse, sourId, destId);
      if (data.code === 1) {
        message.success('复制成功');
        yield put({type:'getList'});
      }
    }
  },

  reducers: {
    setList(state,action){
      return {...state, ...action};
    },
    loading(state){
      state.loading = true;
      return {...state}
    },
    loaded(state){
      state.loading = false;
      return {...state}
    },
    updAsync(state,action) {
      let {node} = treeUtil.getNodeAtPath({treeData:state.data,path:action.path,getNodeKey});
      node.title = action.text;
      state.data = treeUtil.changeNodeAtPath({treeData:state.data,path:action.path,newNode:node,getNodeKey});
      state.loading = false;
      return {...state};
    },
    addAsync(state,action) {
      let tree = treeUtil.addNodeUnderParent({treeData:state.data,newNode:{id:action.id,title: action.text,children:[]},parentKey:action.key,getNodeKey,expandParent:true});
      state.data = tree.treeData;
      state.loading = false;
      return {...state};
    },
    delAsync(state,action){
      state.data = treeUtil.removeNodeAtPath({treeData:state.data,path:action.path,getNodeKey});
      return {...state}
    },
    change(state, action) {
      state.data = action.treeData;
      return {...state};
    },
    setStatus(state, {id,status,path}){
      category.setStatus(id,status);
      let {node} = treeUtil.getNodeAtPath({treeData:state.data,path,getNodeKey});
      let tag = Object.keys(status)[0];
      node[tag] = status[tag];
      state.data = treeUtil.changeNodeAtPath({treeData:state.data,path,newNode:node,getNodeKey});
      return {...state};
    },
    setSelCategory (state, action) {
      return {...state, selCategory: action.selCategory}
    },
    setFields(state, {menuId,flag}) {
      state.fieldsList[menuId] = state.fieldsList[menuId]||{};
      state.fieldsList[menuId][flag] = !state.fieldsList[menuId][flag];
      return {...state};
    },
    setFieldsList (state, {fieldsList}) {
      return {...state, fieldsList}
    },
    saveFieldsAsync (state, {menuId}){
      if (state.fieldsList[menuId])
        state.fieldsList[menuId].id = 888;
      return {...state}
    },
    delFieldsSetAsync (state,{menuId}){
      delete state.fieldsList[menuId];
      return {...state};
    }
  }

}
