/**
 * Created by fangf on 2016/12/21.
 */
import * as api from '../services/staffs';
import {
  message
} from 'antd';

export default {
  namespace: 'staffs',
  state: {
    data: [],
    achievement: []
  },
  effects: {
    * getList(action, {
      put,
      call
    }) {
      let {
        data
      } = yield call(api.getAll);
      if (data.code === 1) {
        yield put({
          type: 'setList',
          data: data.data
        })
      }
    },
    * add({
      name,
      mobile,
      idCard
    }, {
      put,
      call
    }) {
      let {
        data
      } = yield call(api.add, name, mobile, idCard);
      if (data.code == 1)
        yield put({
          type: 'addSync',
          staff: {
            id: data.data,
            name,
            mobile,
            identityCardCode: idCard
          }
        })
    },
    * upd({
      dividend,
      id,
      name,
      mobile,
      idCard,
      index
    }, {
      put,
      call
    }) {
      let {
        data
      } = yield call(api.upd, dividend, id, name, mobile, idCard);
      if (data.code == 1)
        yield put({
          type: 'updSync',
          index,
          staff: {
            name,
            mobile,
            identityCardCode: idCard
          }
        })
    },
    * updd({
      dividend,
      id,
      index
    }, {
      put,
      call
    }) {
      let {
        data
      } = yield call(api.updd, dividend, id);
      if (data.code == 1)
        yield put({
          type: 'upddSync',
          index
        });
    },
    * fetchAchievement({
      payload
    }, {
      put,
      call
    }) {
      let {
        data
      } = yield call(api.getAchievement, payload.id)
      if (data.code === 1) {
        yield put({
          type: 'getAchievement',
          payload: {
            data: data.data || []
          }
        })
      }
    },
    * exportAchievement({
      ids
    }, {
      put,
      call
    }) {
      let res = yield call(api.exportAchievement, ids);
      let filename = res.headers['filename'];
      if (filename) {
        var blob = new Blob([res.data]);
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      } else {
        message.error('选中对象没有数据')
      }
    }
  },
  reducers: {
    setList(state, {
      data
    }) {
      return { ...state,
        data
      }
    },
    addSync(state, {
      staff
    }) {
      message.success('添加业务人员成功');
      if (state.data.length > 0)
        state.data.push(staff);
      return { ...state
      };
    },
    updSync(state, {
      index,
      staff
    }) {
      message.success('更新业务人员信息成功');
      state.data[index] = { ...state.data[index],
        ...staff
      };
      return { ...state
      };
    },
    upddSync(state, {
      index
    }) {
      message.success('更新提成信息成功');
      state.data[index] = { ...state.data[index]
      };
      return {
        ...state
      };
    },
    ban(state, {
      index
    }) {
      let {
        id,
        loginBandom
      } = state.data[index];
      api.ban(id, !loginBandom);
      state.data[index].loginBandom = !loginBandom;
      return { ...state
      }
    },
    getAchievement(state, {
      payload
    }) {
      payload.data = payload.data.map((v, k) => ({ ...v,
        index: k
      }))
      return {
        ...state,
        achievement: payload.data
      }
    }
  }
}