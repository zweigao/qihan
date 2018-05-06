/**
 * Created by fangf on 2016/11/25.
 */
import * as api from '../services/exam';

export default {
  namespace: 'exam',
  state: {
    data: []
  },
  effects:{
    *getAll(action,{put,call,select}){
      let exam = yield select(state => state.exam.data);
      if (exam.length==0) {
        let userId = yield select(state => state.user.id);
        let {data} = yield call(api.getAll, userId);
        yield put({type: 'getAllAsync', data: data.data})
      }
    }
  },
  reducers:{
    getAllAsync(state,action){
      return {...state,...action}
    }
  }
}
