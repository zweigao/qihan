/**
 * Created by fangf on 2016/11/25.
 */
import * as api from '../services/notify';

export default {
  namespace: 'notify',
  state:{
    data:[]
  },
  effects:{
    *getAll(action,{put,call}){
      let {data} = yield call(api.getAll);
      yield put({type:'getAllAsync',data:data.data})
    }
  },
  reducers:{
    getAllAsync(state,{data}){
      state.data = data;
      return {...state};
    }
  }
}
