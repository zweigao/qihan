/**
 * Created by fangf on 2016/11/13.
 */
import * as treeUtil from '../utils/tree-data-utils';

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function getNodeKey({ node: _node, treeIndex }) {
  return treeIndex;
}

export default {

  namespace: 'category',

  state: {
    loading: false,
    data: [
      { title: '计算机类', children: [ { title: '计算机二级' },{ title: '计算机三级' },{ title: '计算机四级' } ], expanded: true},
      { title: '基础英语', children: [ { title: '英语四级' },{ title: '英语六级' } ] },
      { title: '高级英语', children: [ { title: '雅思' },{ title: '托福' } ] },
      { title: '泡妞技巧', children: [ { title: '撩妹二级' },{ title: '撩妹四级' },{ title: '撩妹六级' } ] }
    ]
  },

  effects: {
    *addDelay(action, { call, put }) {
      yield put({ type: 'loading' });
      yield call(delay, 1000);
      delete action['type'];
      yield put({ type: 'add', ...action });
    }
  },

  reducers: {
    loading(state){
      state.loading = true;
      return {...state}
    },
    upd(state,action) {
      let {node} = treeUtil.getNodeAtPath({treeData:state.data,path:action.path,getNodeKey});
      node.title = action.text;
      state.data = treeUtil.changeNodeAtPath({treeData:state.data,path:action.path,newNode:node,getNodeKey});
      state.loading = false;
      return {...state};
    },
    add(state,action) {
      let tree = treeUtil.addNodeUnderParent({treeData:state.data,newNode:{title: action.text},parentKey:action.key,getNodeKey,expandParent:true});
      state.data = tree.treeData;
      state.loading = false;
      return {...state};
    },
    del(state,action){
      state.data = treeUtil.removeNodeAtPath({treeData:state.data,path:action.path,getNodeKey});
      return {...state}
    },
    change(state, action) {
      state.data = action.treeData;
      return {...state};
    }
  }

}
