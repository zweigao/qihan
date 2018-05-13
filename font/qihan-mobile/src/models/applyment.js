import * as api from '../services/applyment'
import {
  Toast
} from 'antd-mobile';

const imagesEnum = {
  STANDERIMG: 'standarImg',
  IDCARD: 'idCardImg',
  IDCARDBACK: 'idCardBackImg',
  STUDENTCARD: 'studentCardImg'
}

export default {

  namespace: 'applyment',

  state: {
    menuData: [],
    idCardInfo: {
      nativePlace: '',
      gender: 'FEMALE'
    },
    images: {
      standarImg: '',
      idCardImg: '',
      idCardBackImg: '',
      studentCardImg: ''
    },
    registerDisplayItems: [],
    meterialNeed: {},
    uploadImgLoading: false,
    finished: false,
    applymentInfo: {}
  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      history.listen(({
        pathname
      }) => {
        if (pathname.indexOf('/applyment') >= 0) {
          dispatch({
            type: 'fetchMenu'
          })
        }
      })
    },
  },

  effects: {
    * fetchMenu({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getMenu())
      if (data.code === 1) {
        let menuData = getTree(data.data, 0, 1)
        yield put({
          type: 'getMenu',
          payload: {
            menuData
          }
        })
      }
    },
    * fetchIdCardInfo({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getIdCardInfo(payload.idCard))
      if (data.code === 1) {
        yield put({
          type: 'getIdCardInfo',
          payload: {
            info: data.data
          }
        })
      }
    },
    * fetchDisplayItems({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getMenuItemRegisterInfo(payload.id))
      const items = data.data.registerTimingOptionServiceList.filter((o) => {
        return o.optionActivityTimestamp > +new Date()
      })
      if (data.code === 1) {
        yield put({
          type: 'getDisplayItems',
          payload: {
            items,
            meterialNeed: data.data.materialForExam
          }
        })
      }
    },
    * uploadImage({
      payload
    }, {
      select,
      call,
      put
    }) {
      yield put({
        type: 'setUploadLoading',
        payload: {
          loading: true
        }
      })
      if (payload.image) {
        const {
          data
        } = yield call(() => api.fileUpload(payload.image, payload.type))
        yield put({
          type: 'setUploadLoading',
          payload: {
            loading: false
          }
        })
        if (data.code === 1) {
          yield put({
            type: 'getImages',
            payload: {
              type: payload.type,
              image: data.data
            }
          })
        }
      } else {
        yield put({
          type: 'getImages',
          payload: {
            type: payload.type,
            image: ''
          }
        })
      }

    },
    * register({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.register(payload.data))
      if (data.code === 1) {
        yield put({
          type: 'applySuccess'
        })
      }
    },
    * fetchPhoneCodeValidator({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getPhoneCodeValidator(payload.phoneCode))
      if (data.code === 1) {
        Toast.info("发送成功")
      }
    },
    * fetchPhoneCodeValidatorForModify({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getPhoneCodeValidatorForModify(payload.phoneCode))
      if (data.code === 1) {
        Toast.info("发送成功")
      }
    },
    * fetchApplymentInfo({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.getApplymentInfo(payload.registerId, payload.idCode))
      if (data.code === 1) {
        yield put({
          type: 'getApplymentInfo',
          payload: {
            applymentInfo: data.data
          }
        })
      }
    },
    * updateRegisterInfo({
      payload
    }, {
      select,
      call,
      put
    }) {
      const {
        data
      } = yield call(() => api.updateRegisterInfo(payload.data))
      if (data.code === 1) {
        yield put({
          type: 'applySuccess'
        })
      }
    }
  },

  reducers: {
    getMenu(state, action) {
      return { ...state,
        menuData: action.payload.menuData
      }
    },
    getIdCardInfo(state, action) {
      return { ...state,
        idCardInfo: action.payload.info || state.idCardInfo
      }
    },
    getDisplayItems(state, action) {
      const items = action.payload.items.map(i => ({
        label: i.displayContent,
        value: i.id
      }))
      return { ...state,
        registerDisplayItems: items,
        meterialNeed: action.payload.meterialNeed
      }
    },
    setUploadLoading(state, action) {
      return { ...state,
        uploadImgLoading: action.payload.loading
      }
    },
    getImages(state, action) {
      let images = state.images
      images[imagesEnum[action.payload.type]] = action.payload.image
      return { ...state,
        images: { ...images
        },
        uploadImgLoading: false
      }
    },
    applySuccess(state, action) {
      return { ...state,
        finished: true
      }
    },
    getApplymentInfo(state, action) {
      const {
        applymentInfo
      } = action.payload
      const items = applymentInfo.allowTimingOption.map(i => ({
        label: i.displayContent,
        value: i.id
      }))
      const images = {
        standarImg: applymentInfo.standerImg,
        idCardImg: applymentInfo.studentInfo.identityCardImg,
        idCardBackImg: applymentInfo.studentInfo.identityCardBackImg,
        studentCardImg: applymentInfo.studentInfo.studentCardImg
      }
      return {
        ...state,
        applymentInfo: applymentInfo,
        meterialNeed: applymentInfo.materialForExam,
        registerDisplayItems: items,
        images: images
      }
    }
  }
}

function getTree(data, id, level) {
  let treeData = [];
  for (let v of data) {
    if (v.fatherItem !== undefined && v.fatherItem === id && !v.hiddenFlag) {
      v.level = level;
      v.children = getTree(data, v.id, level + 1);
      treeData.push(v);
    }
  }
  return treeData;
}